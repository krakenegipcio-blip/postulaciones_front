import { Menu, Search } from 'lucide-react';

interface HeaderProps {
  onMenuOpen: () => void;
  search: string;
  onSearch: (v: string) => void;
  showSearch?: boolean;
}

export default function Header({ onMenuOpen, search, onSearch, showSearch = true }: HeaderProps) {
  return (
    <header className="h-14 flex items-center justify-between px-4 border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-md flex-shrink-0 gap-2">
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onMenuOpen}
          className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
        >
          <Menu size={18} />
        </button>
        <h1 className="text-slate-200 font-semibold text-sm tracking-wide hidden sm:block">Mi Gestor de Postulaciones</h1>
        <h1 className="text-slate-200 font-semibold text-sm tracking-wide sm:hidden">Postulaciones</h1>
      </div>

      {showSearch && (
        <div className="relative flex-1 max-w-xs sm:max-w-[16rem] sm:flex-none">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 w-full focus:outline-none focus:border-blue-500 placeholder-slate-500 transition-colors"
          />
        </div>
      )}
    </header>
  );
}
