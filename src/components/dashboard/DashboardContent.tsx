"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Task {
    id: string
    title: string
  }
  
  interface DashboardContentProps {
    tasks: Task[]
  }


export function DashboardContent({ tasks }: DashboardContentProps) {
    const { data: session } = useSession()
  const { toast } = useToast()

  if (!session) return null

  const userInitials = session.user.email?.charAt(0).toUpperCase() || "U"
    return (

        <div className="grid gap-6 md:grid-cols-2">
<Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={session.user.profilePictureUrl || ""} alt="Profile" />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{session.user.email}</h2>
              <p className="text-muted-foreground">{session.user.role}</p>
            </div>
          </div>
          <Button asChild>
            <Link href="/settings">Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Tasks Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length === 0 ? (
            <p className="text-muted-foreground">No tasks yet.</p>
          ) : (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="flex justify-between items-center">
                  <span>{task.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "Task",
                        description: `Task: ${task.title}`,
                      })
                    }
                  >
                    View
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <Button asChild className="mt-4">
            <Link href="/tasks">View All Tasks</Link>
          </Button>
        </CardContent>
      </Card>
            </div>

    )
}