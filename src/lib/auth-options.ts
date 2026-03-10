import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        // Initial sign-in: load full profile from DB
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            role: true,
            profilePictureUrl: true,
            notificationsEmail: true,
            notificationsPush: true,
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.profilePictureUrl = dbUser.profilePictureUrl ?? undefined;
          token.notificationsEmail = dbUser.notificationsEmail;
          token.notificationsPush = dbUser.notificationsPush;
        }
      }
      if (trigger === 'update' && session) {
        // Called when client calls update() after settings save
        if (session.email !== undefined) token.email = session.email;
        if (session.profilePictureUrl !== undefined) token.profilePictureUrl = session.profilePictureUrl;
        if (session.notificationsEmail !== undefined) token.notificationsEmail = session.notificationsEmail;
        if (session.notificationsPush !== undefined) token.notificationsPush = session.notificationsPush;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.profilePictureUrl = token.profilePictureUrl;
        session.user.notificationsEmail = token.notificationsEmail;
        session.user.notificationsPush = token.notificationsPush;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
