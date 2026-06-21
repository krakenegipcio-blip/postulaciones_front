import { X } from 'lucide-react';
import type { PostulacionFilters } from '../../store/filterStore';
import type { Empresa, Estado, Modalidad, Cargo, Tecnologia } from '../../lib/api';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  filters: PostulacionFilters;
  setFilters: (p: Partial<PostulacionFilters>) => void;
  resetFilters: () => void;
  empresas: Empresa[];
  estados: Estado[];
  modalidades: Modalidad[];
  cargos: Cargo[];
  tecnologias: Tecnologia[];
}

export default function FilterPanel({
  open, onClose, filters, setFilters, resetFilters, empresas, estados, modalidades, cargos, tecnologias,
}: FilterPanelProps) {
  const toggleTecno = (id: number) => {
    const arr = filters.tecnologias.includes(id)
      ? filters.tecnologias.filter(t => t !== id)
      : [...filters.tecnologias, id];
    setFilters({ tecnologias: arr });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-30 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 z-40 h-full w-full sm:w-80 bg-slate-900 border-l border-slate-700 flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Filtro Avanzado</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Empresa */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Filtrar por Empresa</label>
            <select
              value={filters.id_empresa ?? ''}
              onChange={e => setFilters({ id_empresa: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Todas las empresas</option>
              {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Estado</label>
            <div className="space-y-1.5">
              {estados.map(e => (
                <label key={e.id} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="estado"
                    checked={filters.id_estado === e.id}
                    onChange={() => setFilters({ id_estado: filters.id_estado === e.id ? null : e.id })}
                    className="accent-blue-500"
                  />
                  <span
                    className="text-sm px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: e.color_hex + '33', color: e.color_hex }}
                  >
                    {e.nombre}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Modalidad */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Modalidad</label>
            <select
              value={filters.id_modalidad ?? ''}
              onChange={e => setFilters({ id_modalidad: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Todas</option>
              {modalidades.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>

          {/* Cargo */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Cargo</label>
            <select
              value={filters.id_cargo ?? ''}
              onChange={e => setFilters({ id_cargo: e.target.value ? Number(e.target.value) : null })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="">Todos los cargos</option>
              {cargos.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>

          {/* Rango Sueldo */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Rango de Sueldo</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="min"
                value={filters.sueldo_min ?? ''}
                onChange={e => setFilters({ sueldo_min: e.target.value ? Number(e.target.value) : null })}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="max"
                value={filters.sueldo_max ?? ''}
                onChange={e => setFilters({ sueldo_max: e.target.value ? Number(e.target.value) : null })}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded px-2 py-1.5 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tecnologías */}
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wider mb-2 block">Tecnologías</label>
            <div className="flex flex-wrap gap-1.5">
              {tecnologias.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggleTecno(t.id)}
                  className="text-xs px-2 py-0.5 rounded-full border transition-all"
                  style={{
                    backgroundColor: filters.tecnologias.includes(t.id) ? t.color_hex : 'transparent',
                    borderColor: t.color_hex,
                    color: filters.tecnologias.includes(t.id) ? '#fff' : t.color_hex,
                  }}
                >
                  {t.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-5 py-4 border-t border-slate-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </>
  );
}
