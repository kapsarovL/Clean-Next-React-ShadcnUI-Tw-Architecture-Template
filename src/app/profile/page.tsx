import type { Metadata } from 'next';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = { title: 'Profile' };

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      email: true,
      role: true,
      profilePictureUrl: true,
      createdAt: true,
      _count: { select: { tasks: true } },
    },
  });

  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>

      <div className="rounded-lg border bg-card p-6 space-y-4">
        <div className="flex items-center gap-4">
          {user.profilePictureUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.profilePictureUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-xl font-semibold">{user.email}</p>
            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium mt-1 ${
              user.role === 'ADMIN'
                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {user.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
          <div>
            <p className="text-sm text-muted-foreground">Member since</p>
            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total tasks</p>
            <p className="font-medium">{user._count.tasks}</p>
          </div>
        </div>
      </div>

      <Link
        href="/settings"
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90"
      >
        Edit Profile
      </Link>
    </div>
  );
}
