import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { writeFile } from "fs/promises"
import path from "path"

const prisma = new PrismaClient()

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await request.formData()
  const email = formData.get("email") as string
  const currentPassword = formData.get("currentPassword") as string | null
  const newPassword = formData.get("newPassword") as string | null
  const profilePicture = formData.get("profilePicture") as File | null
  const notificationsEmail = formData.get("notificationsEmail") === "true"
  const notificationsPush = formData.get("notificationsPush") === "true"

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const updateData: any = {}

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to change password" },
          { status: 400 }
        )
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: "Incorrect current password" }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    // Handle email update
    if (email !== user.email) {
      updateData.email = email
    }

    // Handle profile picture upload
    let profilePictureUrl = user.profilePictureUrl
    if (profilePicture && profilePicture instanceof File) {
      const uploadDir = path.join(process.cwd(), "public/uploads")
      const fileName = `${session.user.id}-${Date.now()}.${profilePicture.name.split(".").pop()}`
      const filePath = path.join(uploadDir, fileName)
      const buffer = Buffer.from(await profilePicture.arrayBuffer())
      await writeFile(filePath, buffer)
      profilePictureUrl = `/uploads/${fileName}`
      updateData.profilePictureUrl = profilePictureUrl
    }

    // Handle notification preferences
    updateData.notificationsEmail = notificationsEmail
    updateData.notificationsPush = notificationsPush

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    )
  }
}