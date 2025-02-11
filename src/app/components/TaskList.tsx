interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Por hacer' | 'En progreso' | 'Hecho';
}
interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}
export default function TaskList({ tasks, onDelete, onEdit }: TaskListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex flex-col border rounded-lg shadow-sm bg-white text-gray-900"
        >
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">{task.title}</h3>
          </div>
          <div className="p-4 flex-grow">
            <p className="text-sm">{task.description}</p>
            <p className="mt-2 text-sm">Fecha: {task.dueDate}</p>
            <p className="text-sm">Estado: {task.status}</p>
          </div>
          <div className="p-4 border-t flex justify-end space-x-2">
            <button
              className=" text-white px-3 py-1 text-sm border rounded-md bg-gray-900 hover:bg-gray-600"
              onClick={() => onEdit(task)}
            >
              Editar
            </button>
            <button
              className="px-3 py-1 text-sm border rounded-md bg-red-600 text-white hover:bg-red-400"
              onClick={() => onDelete(task.id)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
