import { ProtectedRoute } from "@/components/layout/ProtectedRoute"
import { TaskForm } from "@/components/tasks/TaskForm"
import { TaskList } from "@/components/tasks/TaskList"

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <TaskForm />
        <TaskList />
      </div>
    </ProtectedRoute>
  )
}