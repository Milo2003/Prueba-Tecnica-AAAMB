'use client';

import { useState, useEffect, useRef } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchFilter from './components/SearchFilter';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Por hacer' | 'En progreso' | 'Hecho';
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
      setFilteredTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    setFilteredTasks(tasks);
  }, [tasks]);

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Date.now().toString() };
    setTasks([...tasks, newTask]);
    dialogRef.current?.close();
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    setEditingTask(null);
    dialogRef.current?.close();
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleSearch = (searchTerm: string) => {
    const filtered = tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredTasks(filtered);
  };

  const handleFilter = (status: string) => {
    if (status === 'Todos') {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) => task.status === status);
      setFilteredTasks(filtered);
    }
  };

  const handleFormSubmit = (task: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask({ ...task, id: editingTask.id });
    } else {
      addTask(task);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Gestor de Tareas Personales
      </h1>
      <div className="flex items-center space-x-4 mb-4">
        <SearchFilter onSearch={handleSearch} onFilter={handleFilter} />
        <button
          onClick={() => {
            setEditingTask(null);
            dialogRef.current?.showModal();
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Agregar Tarea
        </button>
      </div>
      <dialog ref={dialogRef} className="p-6 bg-white rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingTask ? 'Editar Tarea' : 'Agregar Tarea'}
        </h2>
        <TaskForm
          onSubmit={handleFormSubmit}
          initialTask={editingTask}
          onCancel={() => {
            setEditingTask(null);
            dialogRef.current?.close();
          }}
        />
      </dialog>
      <TaskList
        tasks={filteredTasks}
        onDelete={deleteTask}
        onEdit={(task) => {
          setEditingTask(task);
          dialogRef.current?.showModal();
        }}
      />
    </div>
  );
}
