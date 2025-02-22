import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10)
  await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      password: hashedPassword,
      role: "USER",
    },
  })
  console.log("Test user created")
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect())