'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id'>) => void;
  initialTask: Task | null;
  onCancel: () => void;
}

export default function TaskForm({
  onSubmit,
  initialTask,
  onCancel,
}: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pendiente');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setDueDate(initialTask.dueDate);
      setStatus(initialTask.status);
    } else {
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus('Pendiente');
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(dueDate);
    if (selectedDate < today) {
      alert('La fecha de vencimiento no puede ser una fecha pasada');
      return;
    }

    onSubmit({ title, description, dueDate, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        required
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="h-10 w-full rounded-md border px-3 py-2 text-sm"
      >
        <option value="Por hacer">Por hacer</option>
        <option value="En progreso">En progreso</option>
        <option value="Hecho">Hecho</option>
      </select>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          {initialTask ? 'Actualizar Tarea' : 'Agregar Tarea'}
        </button>
      </div>
    </form>
  );
}
