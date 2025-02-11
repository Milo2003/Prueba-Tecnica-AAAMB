interface SearchFilterProps {
  onSearch: (searchTerm: string) => void;
  onFilter: (status: string) => void;
}

export default function SearchFilter({ onSearch, onFilter }: SearchFilterProps) {
  return (
    <div className="flex items-center space-x-2 flex-grow">
      <input
        type="text"
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Buscar por título"
        className="flex-grow border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <select
        onChange={(e) => onFilter(e.target.value)}
        className="w-[180px] border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="Todos">Todos</option>
        <option value="Por hacer">Por hacer</option>
        <option value="En progreso">En progreso</option>
        <option value="Hecho">Hecho</option>
      </select>
    </div>
  );
}

