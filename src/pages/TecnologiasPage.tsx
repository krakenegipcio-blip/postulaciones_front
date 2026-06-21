import { useState } from 'react';
import { Cpu, Pencil, Trash2, Plus, Search, X } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { Tecnologia } from '../lib/api';
import { useTecnologias } from '../hooks/useData';
import { useIsMobile } from '../hooks/useIsMobile';
import { useLongPress } from '../hooks/useLongPress';
import Pagination from '../components/ui/Pagination';
import ColorPicker from '../components/ui/ColorPicker';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';
import Drawer from '../components/ui/Drawer';

interface Props { onMenuOpen: () => void; }

const EMPTY: Omit<Tecnologia, 'id' | 'created_at'> = { nombre: '', id_padre: null, color_hex: '#61dafb', orden: 0 };

function MobileTecnologiaCard({ t, onTap, onLongPress }: { t: Tecnologia; onTap: () => void; onLongPress: () => void }) {
  const lp = useLongPress(onLongPress, onTap);
  return (
    <div
      {...lp}
      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 active:bg-slate-700/60 transition-colors select-none cursor-pointer"
      style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
    >
      <div className="flex flex-col gap-2">
        <p className="text-slate-200 font-semibold text-base truncate">
          {t.nombre}
        </p>
        <div className="flex flex-col gap-1 text-xs text-slate-400">
          <span className="text-[10px] text-slate-500 uppercase font-mono mb-1">ID: {t.id}</span>
          <div className="flex gap-2 min-w-0">
             <span className="text-slate-500 flex-shrink-0">Padre:</span>
             <span className="text-slate-300 truncate">{(t as any).padre?.nombre ?? '-'}</span>
          </div>
          <div className="flex gap-2 min-w-0">
             <span className="text-slate-500 flex-shrink-0">Orden:</span>
             <span className="text-slate-300 font-mono">{t.orden ?? 0}</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-slate-500">Color:</span>
             <span className="w-3.5 h-3.5 rounded-full border border-slate-600" style={{ backgroundColor: t.color_hex }} />
             <span className="text-slate-400 text-xs font-mono">{t.color_hex}</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-slate-600 mt-3 italic text-right">
        Toca para editar · Mantén presionado para eliminar
      </p>
    </div>
  );
}

export default function TecnologiasPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useTecnologias();
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Tecnologia | null>(null);
  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Tecnologia | null>(null);
  const isMobile = useIsMobile();

  const parents = data.filter(t => !t.id_padre);

  const openNew = () => {
    setSelected(null);
    setForm({ ...EMPTY });
    setIsNew(true);
  };

  const openEdit = (t: Tecnologia) => {
    setSelected(t);
    setForm({ nombre: t.nombre, id_padre: t.id_padre, color_hex: t.color_hex, orden: t.orden ?? 0 });
    setIsNew(false);
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    const payload = { nombre: form.nombre, id_padre: form.id_padre, color_hex: form.color_hex, orden: Number(form.orden ?? 0) };
    if (!isNew && selected) {
      await apiFetch(`/tecnologia/${selected.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch('/tecnologia', { method: 'POST', body: JSON.stringify(payload) });
    }
    setSaving(false);
    setSelected(null);
    setIsNew(false);
    setForm({ ...EMPTY });
    reload();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await apiFetch(`/tecnologia/${deleteItem.id}`, { method: 'DELETE' });
    setDeleteItem(null);
    if (selected?.id === deleteItem.id) { setSelected(null); setIsNew(false); }
    reload();
  };

  const filtered = search ? data.filter(t => t.nombre.toLowerCase().includes(search.toLowerCase())) : data;
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const showForm = isNew || selected;

  const formContent = (
    <>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Datos Generales</h4>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">id_tecnologia</label>
          <div className="bg-slate-700/50 border border-slate-600 text-slate-400 text-sm rounded px-3 py-2">
            {selected ? selected.id : '(nuevo)'}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Nombre Tecnología</label>
          <input
            type="text"
            value={form.nombre}
            onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="Ej: React, Spring Boot"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">
            Tecnología Padre <span className="text-slate-500 font-normal">(opcional)</span>
          </label>
          <select
            value={form.id_padre ?? ''}
            onChange={e => setForm(p => ({ ...p, id_padre: e.target.value ? Number(e.target.value) : null }))}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">Selecciona Padre...</option>
            {parents.filter(p => p.id !== selected?.id).map(p => (
              <option key={p.id} value={p.id}>{p.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Orden</label>
          <input
            type="number"
            value={(form as any).orden ?? 0}
            onChange={e => setForm(p => ({ ...p, orden: Number(e.target.value) }))}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <ColorPicker value={form.color_hex} onChange={c => setForm(p => ({ ...p, color_hex: c }))} label="Color Hex (con preview)" />

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Preview:</span>
          <Badge label={form.nombre || 'Tecnología'} color={form.color_hex} size="md" />
        </div>
      </div>

      <div className="px-5 py-4 border-t border-slate-700/50 flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving || !form.nombre.trim()}
          className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          onClick={() => { setSelected(null); setIsNew(false); setForm({ ...EMPTY }); }}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg"
        >
          Cancelar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />

      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
        <Cpu size={18} className="text-slate-400" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Mantenedor de Tecnologías</h2>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Table */}
        <div className="flex flex-col flex-1 overflow-hidden sm:border-r sm:border-slate-700/50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 flex-shrink-0 gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Buscar tecnología..."
                className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-1.5 focus:outline-none focus:border-blue-500 w-full sm:w-56" />
            </div>
            <button onClick={openNew} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors flex-shrink-0">
              <Plus size={14} /> <span className="hidden sm:inline">Nuevo</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {loading ? (
               <div className="text-center py-10 text-slate-500">Cargando...</div>
            ) : isMobile ? (
              <div className="p-3 space-y-3">
                {paged.length === 0 && <div className="text-center py-10 text-slate-500">Sin registros</div>}
                {paged.map(t => (
                  <MobileTecnologiaCard key={t.id} t={t} onTap={() => openEdit(t)} onLongPress={() => setDeleteItem(t)} />
                ))}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800/80 sticky top-0 z-10">
                    <th className="px-3 py-2.5 text-left">
                      <input type="checkbox" className="accent-blue-500" />
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs text-blue-400 font-medium cursor-pointer">
                      id_tec... ↑
                    </th>
                    <th className="px-3 py-2.5 text-left text-xs text-blue-400 font-medium">Nombre Tecnología ↑</th>
                    <th className="px-3 py-2.5 text-left text-xs text-slate-400 font-medium">Tecnología Padre</th>
                    <th className="px-3 py-2.5 text-left text-xs text-slate-400 font-medium">Orden</th>
                    <th className="px-3 py-2.5 text-left text-xs text-slate-400 font-medium">Color Hex</th>
                    <th className="px-3 py-2.5 text-right text-xs text-slate-400 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {paged.length === 0 && <tr><td colSpan={7} className="text-center py-10 text-slate-500">Sin registros</td></tr>}
                  {paged.map(t => (
                    <tr key={t.id}
                      onClick={() => openEdit(t)}
                      className={`hover:bg-slate-800/60 cursor-pointer transition-colors group ${selected?.id === t.id ? 'bg-slate-700/50 border-l-2 border-l-blue-500' : ''}`}
                    >
                      <td className="px-3 py-2.5" onClick={e => e.stopPropagation()}>
                        <input type="checkbox" className="accent-blue-500" />
                      </td>
                      <td className="px-3 py-2.5 text-slate-400 text-xs">{t.id}</td>
                      <td className="px-3 py-2.5 text-slate-200">{t.nombre}</td>
                      <td className="px-3 py-2.5 text-slate-400">
                        {(t as { padre?: { nombre: string } }).padre?.nombre ?? '-'}
                      </td>
                      <td className="px-3 py-2.5 text-slate-300 font-mono">{t.orden ?? 0}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-slate-600" style={{ backgroundColor: t.color_hex }} />
                          <span className="text-slate-400 text-xs font-mono">{t.color_hex}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(t)} className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded"><Pencil size={13} /></button>
                          <button onClick={() => setDeleteItem(t)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <Pagination page={page} perPage={perPage} total={filtered.length} onPage={setPage} />
        </div>

        {/* Right: Form */}
        {isMobile ? (
          <Drawer open={showForm && isMobile} onClose={() => { setSelected(null); setIsNew(false); }} title={isNew ? 'Crear Tecnología' : 'Detalle / Editar'}>
            <div className="flex flex-col h-full -m-6 pb-6">
               {formContent}
            </div>
          </Drawer>
        ) : (
          <div className={`w-80 flex-shrink-0 flex flex-col transition-all duration-300 ${showForm ? 'opacity-100' : 'opacity-40'}`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">
                {isNew ? 'Crear Tecnología' : 'Detalle / Editar'}
              </h3>
              {showForm && (
                <button onClick={() => { setSelected(null); setIsNew(false); }} className="text-slate-500 hover:text-slate-300">
                  <X size={15} />
                </button>
              )}
            </div>
            {formContent}
          </div>
        )}
      </div>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar tecnología <strong className="text-slate-100">{deleteItem?.nombre}</strong>?</p>
          <p className="text-slate-500 text-xs">Las tecnologías hijas quedarán sin padre. Las postulaciones que la usan también se verán afectadas.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
