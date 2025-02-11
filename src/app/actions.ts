'use server';

import { revalidatePath } from 'next/cache';
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Por hacer' | 'En progreso' | 'Hecho';
}

export async function getTasks() {
  const response = await fetch('/api/tasks', {
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Error al obtener las tareas');
  return response.json() as Promise<Task[]>;
}

export async function addTask(task: Omit<Task, 'id'>) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) throw new Error('Error al crear la tarea');
  revalidatePath('/');
  return response.json();
}

export async function updateTask(task: Task) {
  const response = await fetch(`/api/tasks/${task.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    },
  );

  if (!response.ok) throw new Error('Error al actualizar la tarea');
  revalidatePath('/');
  return response.json();
}

export async function deleteTask(id: string) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error al eliminar la tarea');
  revalidatePath('/');
  return response.json();
}
