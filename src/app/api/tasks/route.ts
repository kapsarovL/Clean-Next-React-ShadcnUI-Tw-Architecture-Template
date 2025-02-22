import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession, NextAuthOptions, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

// Mock database (replace with actual DB in production)
let tasks: { id: string; title: string }[] = []

export async function GET() {
  const session = await getServerSession(authOptions as NextAuthOptions) as Session & {
    user: {
      id: string;
      email?: string;
    }
  };

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions as NextAuthOptions) as Session & {
    user: {
      id: string;
      email?: string;
    }
  };
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { title } = await request.json();
  const newTask = await prisma.task.create({
    data: {
      title,
      userId: session.user.id,
    },
  });
  return NextResponse.json(newTask, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions as NextAuthOptions) as Session & {
    user: {
      id: string;
      email?: string;
    }
  };
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const { title } = await request.json();
  const task = await prisma.task.findUnique({
    where: { id },
  });
  if (!task || task.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  const updatedTask = await prisma.task.update({
    where: { id },
    data: { title },
  });
  return NextResponse.json(updatedTask);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions as NextAuthOptions) as Session & {
    user: {
      id: string;
      email?: string;
    }
  };
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const task = await prisma.task.findUnique({
    where: { id },
  });
  if (!task || task.userId !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }
  await prisma.task.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Task deleted" });
}