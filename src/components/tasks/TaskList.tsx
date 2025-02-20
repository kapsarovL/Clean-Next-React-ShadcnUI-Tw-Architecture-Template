"use client"

import { useTasks } from "@/hooks/useTasks"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"

export function TaskList() {
  const { tasks, loading, deleteTask } = useTasks()

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p>No tasks available.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center p-2 border rounded"
            >
              <span>{task.title}</span>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}