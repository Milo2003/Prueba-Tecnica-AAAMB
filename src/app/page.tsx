'use client';

import { useState, useEffect, useRef } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SearchFilter from './components/SearchFilter';
import { getTasks, addTask, updateTask, deleteTask } from './actions';

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
    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks();
        setTasks(loadedTasks);
        setFilteredTasks(loadedTasks);
      } catch (error) {
        console.error('Error al obtener las tareas:', error);
      }
    };
    loadTasks();
  }, []);

  const handleAddTask = async (task: Omit<Task, 'id'>) => {
    try {
      await addTask(task);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      dialogRef.current?.close();
    } catch (error) {
      console.error('Error al añadir la tarea:', error);
    }
  };

  const handleUpdateTask = async (taskToUpdate: Task) => {
    try {
      await updateTask(taskToUpdate);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
      setEditingTask(null);
      dialogRef.current?.close();
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
      setFilteredTasks(updatedTasks);
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
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
      handleUpdateTask({ ...task, id: editingTask.id });
    } else {
      handleAddTask(task);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Gestor de Tareas Personales
      </h1>
      <div className="flex items-center space-x-4 mb-10">
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
        onDelete={handleDeleteTask}
        onEdit={(task) => {
          setEditingTask(task);
          dialogRef.current?.showModal();
        }}
      />
    </div>
  );
}
