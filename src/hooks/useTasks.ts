"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Task {
  id: string
  title: string
}

const fetchTasks = async (): Promise<Task[]> => {
  const res = await fetch("/api/tasks")
  return res.json()
}

const addTask = async (title: string) => {
  const res = await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  })
  return res.json()
}

const deleteTask = async (id: string) => {
  await fetch(`/api/tasks?id=${id}`, { method: "DELETE" })
}

export function useTasks() {
  const queryClient = useQueryClient()

  const { data: tasks = [], isLoading: loading } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  })

  const addMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  })

  return {
    tasks,
    loading,
    addTask: (title: string) => addMutation.mutate(title),
    deleteTask: (id: string) => deleteMutation.mutate(id),
  }
}