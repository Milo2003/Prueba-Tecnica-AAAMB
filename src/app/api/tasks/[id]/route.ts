import { NextResponse } from "next/server"
import clientPromise from "app/lib/mongodb"

interface Task {
  id: string
  title: string
  description: string
  dueDate: string
  status: string
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params
    const task: Omit<Task, "id"> = await request.json()
    const client = await clientPromise
    const collection = client.db("taskmanager").collection("tasks")

    // Validar los campos requeridos
    if (!task.title || !task.dueDate || !task.status) {
      return NextResponse.json({ error: "Título, fecha y estado son requeridos" }, { status: 400 })
    }

    // Validar que la fecha no sea anterior al día actual
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(task.dueDate)
    if (taskDate < today) {
      return NextResponse.json(
        { error: "La fecha de vencimiento no puede ser anterior al día actual" },
        { status: 400 },
      )
    }

    // Validar el estado
    if (!["Por hacer", "En progreso", "Hecho"].includes(task.status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    const updatedTask: Task = {
      ...task,
      id,
      description: task.description || "", // Asegurarse de que description siempre sea un string
    }

    const result = await collection.updateOne({ id }, { $set: updatedTask })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error al actualizar la tarea:", error)
    return NextResponse.json({ error: "Error al actualizar la tarea" }, { status: 500 })
  }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params
    const client = await clientPromise
    const collection = client.db("taskmanager").collection("tasks")

    const result = await collection.deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ message: "Tarea eliminada correctamente" })
  } catch (error) {
    console.error("Error al eliminar la tarea:", error)
    return NextResponse.json({ error: "Error al eliminar la tarea" }, { status: 500 })
  }
}