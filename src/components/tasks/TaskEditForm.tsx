"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTasks } from "@/hooks/useTasks"
import { useToast } from "@/hooks/use-toast" 

export function TaskForm() {
  const [title, setTitle] = useState("")
  const { addTask } = useTasks()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Task title cannot be empty.",
      })
      return
    }
    try {
      await addTask(title)
      setTitle("")
      toast({
        title: "Success",
        description: "Task added successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add task.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="task-title">New Task</Label>
        <Input
          id="task-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  )
}