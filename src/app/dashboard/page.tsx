import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { PrismaClient } from "@prisma/client"
import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

const prisma = new PrismaClient()

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/login")
      }

      // Fetch user's tasks
  const tasks = await prisma.task.findMany({
    where: { userId: session.user.id },
    orderBy: { id: "desc" },
    take: 5, // Limit to 5 recent tasks
  })

    return (
        <ProtectedRoute>
            <div className="space-y-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <DashboardContent tasks={tasks} />
      </div>
        <DashboardContent />
        </ProtectedRoute>
    )
    }