import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPage: (p: number) => void;
}

export default function Pagination({ page, perPage, total, onPage }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const start = Math.min((page - 1) * perPage + 1, total);
  const end = Math.min(page * perPage, total);

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700 gap-2 flex-shrink-0">
      <span className="text-xs sm:text-sm text-slate-400 hidden sm:inline">
        Mostrando {start}-{end} de {total}
      </span>
      <span className="text-xs text-slate-400 sm:hidden">
        {start}-{end} / {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="px-2 sm:px-3 py-1 text-sm rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Anterior</span>
          <ChevronLeft size={16} className="sm:hidden" />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-1 sm:px-2 text-slate-500">...</span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p as number)}
              className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded transition-colors ${
                page === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="px-2 sm:px-3 py-1 text-sm rounded bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={16} className="sm:hidden" />
        </button>
      </div>
    </div>
  );
}
