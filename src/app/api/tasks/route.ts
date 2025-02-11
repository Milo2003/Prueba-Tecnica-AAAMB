import { NextResponse } from 'next/server';
import clientPromise from 'app/lib/mongodb';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Por hacer' | 'En progreso' | 'Hecho';
}

export async function GET() {
  try {
    const client = await clientPromise;
    const collection = client.db('taskmanager').collection('tasks');
    const tasks = await collection.find({}).toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return NextResponse.json(
      { error: 'Error al obtener las tareas' },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const task: Omit<Task, 'id'> = await request.json();
    const client = await clientPromise;
    const collection = client.db('taskmanager').collection('tasks');

    // Validar los campos requeridos
    if (!task.title || !task.dueDate || !task.status) {
      return NextResponse.json(
        { error: 'Título, fecha y estado son requeridos' },
        { status: 400 },
      );
    }

    // Validar el estado
    if (!['Por hacer', 'En progreso', 'Hecho'].includes(task.status)) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 });
    }

    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      description: task.description || '', // Asegurarse de que description siempre sea un string
    };

    const result = await collection.insertOne(newTask);
    console.log('Tarea creada:', result);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    return NextResponse.json(
      { error: 'Error al crear la tarea' },
      { status: 500 },
    );
  }
}
