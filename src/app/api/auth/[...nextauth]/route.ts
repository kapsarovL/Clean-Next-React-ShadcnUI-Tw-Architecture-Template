import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import bcrypt from "bcrypt"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) return null
        return {
          id: user.id,
          email: user.email,
          role: user.role,
          profilePictureUrl: user.profilePictureUrl,
          notificationsEmail: user.notificationsEmail,
          notificationsPush: user.notificationsPush,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.profilePictureUrl = user.profilePictureUrl
        token.notificationsEmail = user.notificationsEmail
        token.notificationsPush = user.notificationsPush
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role;
        session.user.profilePictureUrl = token.profilePictureUrl;
        session.user.notificationsEmail = token.notificationsEmail;
        session.user.notificationsPush = token.notificationsPush;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };