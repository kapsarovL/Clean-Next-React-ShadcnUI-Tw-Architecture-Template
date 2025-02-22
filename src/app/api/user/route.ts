import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { email } = await request.json()

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { email },
    })

    return NextResponse.json(updatedUser)
  } catch {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}