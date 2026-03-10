import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { put } from '@vercel/blob';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      role: true,
      profilePictureUrl: true,
      notificationsEmail: true,
      notificationsPush: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = rateLimit(`user-patch:${session.user.id}`, 10, 60 * 1000); // 10 per min
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } }
    );
  }

  try {
    const formData = await request.formData();

    const email = formData.get('email') as string | null;
    const currentPassword = formData.get('currentPassword') as string | null;
    const newPassword = formData.get('newPassword') as string | null;
    const notificationsEmail = formData.get('notificationsEmail');
    const notificationsPush = formData.get('notificationsPush');
    const profilePicture = formData.get('profilePicture');

    const updateData: Record<string, unknown> = {};

    if (profilePicture instanceof File && profilePicture.size > 0) {
      const { url } = await put(
        `avatars/${session.user.id}-${Date.now()}`,
        profilePicture,
        { access: 'public', contentType: profilePicture.type }
      );
      updateData.profilePictureUrl = url;
    }

    if (email) {
      updateData.email = email;
    }

    if (notificationsEmail !== null) {
      updateData.notificationsEmail = notificationsEmail === 'true';
    }

    if (notificationsPush !== null) {
      updateData.notificationsPush = notificationsPush === 'true';
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to set a new password' },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: 'New password must be at least 8 characters' },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true },
      });

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        profilePictureUrl: true,
        notificationsEmail: true,
        notificationsPush: true,
      },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
