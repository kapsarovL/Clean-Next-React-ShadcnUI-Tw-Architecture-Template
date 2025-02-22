import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import { ReactNode } from "react"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "USER" | "ADMIN"
}

export async function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (requiredRole && session.user.role !== requiredRole) {
    redirect("/unauthorized") // Create an unauthorized page if needed
  }

  return <>{children}</>
}