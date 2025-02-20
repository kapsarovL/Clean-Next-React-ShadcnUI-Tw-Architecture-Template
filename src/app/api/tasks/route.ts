import { NextResponse } from "next/server"

// Mock database (replace with actual DB in production)
let tasks: { id: string; title: string }[] = []

export async function GET() {
  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const { title } = await request.json()
  const newTask = { id: Date.now().toString(), title }
  tasks.push(newTask)
  return NextResponse.json(newTask, { status: 201 })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  tasks = tasks.filter((task) => task.id !== id)
  return NextResponse.json({ message: "Task deleted" })
}