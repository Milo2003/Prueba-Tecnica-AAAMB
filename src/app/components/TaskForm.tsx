'use client';

import { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Por hacer' | 'En progreso' | 'Hecho';
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
  const [status, setStatus] = useState('Por hacer');

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
      setStatus('Por hacer');
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) return;

    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 1)
    const selectedDate = new Date(dueDate);
    if (selectedDate < minDate) {
      alert('La fecha de vencimiento debe establecerse a partir de hoy');
      return;
    }

    onSubmit({ title, description, dueDate, status });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 space-y-4">
      <input
        className="h-10 w-full rounded-md border px-3 py-2 text-sm"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        required
      />
      <textarea
        className="h-32 w-full rounded-md border px-3 py-2 text-sm"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />
      <input
        className="h-10 w-full rounded-md border px-3 py-2 text-sm"
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
          className="px-4 py-2 border rounded-md hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-400"
        >
          {initialTask ? 'Actualizar Tarea' : 'Agregar Tarea'}
        </button>
      </div>
    </form>
  );
}
