import { useState } from 'react';
import { Pencil, Trash2, Plus, Search } from 'lucide-react';
import Pagination from '../ui/Pagination';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useLongPress } from '../../hooks/useLongPress';

export interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends { id: number }> {
  title: string;
  icon?: React.ReactNode;
  rows: T[];
  columns: Column<T>[];
  total: number;
  page: number;
  perPage: number;
  onPage: (p: number) => void;
  onNew: () => void;
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  loading?: boolean;
  selected?: T | null;
}

function MobileMaintainerCard<T extends { id: number }>({
  row, columns, onTap, onLongPress
}: {
  row: T;
  columns: Column<T>[];
  onTap: () => void;
  onLongPress: () => void;
}) {
  const lp = useLongPress(onLongPress, onTap);
  return (
    <div
      {...lp}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 active:bg-slate-700/60 transition-colors select-none cursor-pointer"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-slate-200 font-semibold text-base truncate">
          {columns[0]?.render ? columns[0].render(row) : String((row as Record<string, unknown>)[columns[0].key] ?? '-')}
        </p>
        <div className="flex flex-col gap-1 text-xs text-slate-400">
          <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">ID: {row.id}</span>
          {columns.slice(1).map(c => (
             <div key={c.key} className="flex gap-2 min-w-0">
                <span className="text-slate-500 flex-shrink-0">{c.label}:</span>
                <span className="text-slate-300 truncate">
                   {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '-')}
                </span>
             </div>
          ))}
        </div>
      </div>
      <p className="text-[10px] text-slate-600 mt-3 italic text-right">
        Toca para editar · Mantén presionado para eliminar
      </p>
    </div>
  );
}

export default function MaintainerTable<T extends { id: number }>({
  title, icon, rows, columns, total, page, perPage, onPage, onNew, onEdit, onDelete, loading, selected,
}: Props<T>) {
  const [search, setSearch] = useState('');
  const isMobile = useIsMobile();

  const filtered = search
    ? rows.filter(r => JSON.stringify(r).toLowerCase().includes(search.toLowerCase()))
    : rows;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
        {icon}
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">{title}</h2>
      </div>

      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 flex-shrink-0 gap-2">
        <div className="relative flex-1 sm:flex-none">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar..."
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500 w-full sm:w-64"
          />
        </div>
        <button
          onClick={onNew}
          title="Nuevo"
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Nuevo</span>
        </button>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 text-slate-400">Cargando...</div>
        ) : isMobile ? (
          <div className="p-3 space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-10 text-slate-500">Sin registros</div>
            )}
            {filtered.map(row => (
              <MobileMaintainerCard
                key={row.id}
                row={row}
                columns={columns}
                onTap={() => onEdit(row)}
                onLongPress={() => onDelete(row)}
              />
            ))}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-800/80 sticky top-0 z-10">
                <th className="px-4 py-3 text-left text-xs text-slate-500 font-medium w-16">ID</th>
                {columns.map(c => (
                  <th key={c.key} className="px-4 py-3 text-left text-xs text-slate-400 font-medium">{c.label}</th>
                ))}
                <th className="px-4 py-3 text-right text-xs text-slate-400 font-medium w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.length === 0 && (
                <tr><td colSpan={columns.length + 2} className="text-center py-10 text-slate-500">Sin registros</td></tr>
              )}
              {filtered.map(row => (
                <tr
                  key={row.id}
                  className={`hover:bg-slate-800/60 transition-colors group ${selected?.id === row.id ? 'bg-slate-700/50 border-l-2 border-l-blue-500' : ''}`}
                >
                  <td className="px-4 py-2.5 text-slate-500 text-xs">{row.id}</td>
                  {columns.map(c => (
                    <td key={c.key} className="px-4 py-2.5 text-slate-200">
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '-')}
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded transition-all"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded transition-all"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} perPage={perPage} total={total} onPage={onPage} />
    </div>
  );
}
