import { useState } from 'react';
import { Milestone } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { FaseSeguimiento } from '../lib/api';
import { useFasesSeguimiento } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';

interface Props { onMenuOpen: () => void; }

export default function FasesPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useFasesSeguimiento();
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<FaseSeguimiento | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [colorHex, setColorHex] = useState('#38bdf8');
  const [icono, setIcono] = useState('');
  const [ordenDefault, setOrdenDefault] = useState<number>(0);
  const [esFinal, setEsFinal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<FaseSeguimiento | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => {
    setEditing(null); setNombre(''); setColorHex('#38bdf8'); setIcono(''); setOrdenDefault(0); setEsFinal(false); setFormOpen(true);
  };
  const openEdit = (row: FaseSeguimiento) => {
    setEditing(row); setNombre(row.nombre); setColorHex(row.color_hex); setIcono(row.icono ?? ''); setOrdenDefault(row.orden_default); setEsFinal(row.es_final); setFormOpen(true);
  };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    const body = { nombre, color_hex: colorHex, icono: icono || null, orden_default: Number(ordenDefault), es_final: esFinal };
    try {
      if (editing) {
        await apiFetch(`/fase_seguimiento/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
      } else {
        await apiFetch('/fase_seguimiento', { method: 'POST', body: JSON.stringify(body) });
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    try {
      await apiFetch(`/fase_seguimiento/${deleteItem.id}`, { method: 'DELETE' });
      setDeleteItem(null);
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  const paged = data.slice((page - 1) * perPage, page * perPage);

  const iconOptions = [
    'send', 'phone', 'file-code', 'users', 'monitor-code', 'handshake',
    'message-square', 'badge-dollar-sign', 'x-circle', 'badge-check', 'circle-slash',
  ];

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Mantenedor de Fases de Seguimiento"
        icon={<Milestone size={18} className="text-slate-400" />}
        rows={paged}
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'color_hex', label: 'Color', render: (row: FaseSeguimiento) => (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full inline-block" style={{ backgroundColor: row.color_hex }} />
              <span className="text-xs text-slate-400">{row.color_hex}</span>
            </div>
          )},
          { key: 'icono', label: 'Icono' },
          { key: 'orden_default', label: 'Orden' },
          { key: 'es_final', label: 'Final', render: (row: FaseSeguimiento) => (
            <span className={`text-xs px-2 py-0.5 rounded-full ${row.es_final ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
              {row.es_final ? 'Sí' : 'No'}
            </span>
          )},
        ]}
        total={data.length}
        page={page}
        perPage={perPage}
        onPage={setPage}
        onNew={openNew}
        onEdit={openEdit}
        onDelete={setDeleteItem}
        loading={loading}
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Fase' : 'Nueva Fase'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" placeholder="Ej: Entrevista RRHH" autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={colorHex} onChange={e => setColorHex(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent" />
                <input type="text" value={colorHex} onChange={e => setColorHex(e.target.value)}
                  className="flex-1 bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Icono</label>
              <select value={icono} onChange={e => setIcono(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500">
                <option value="">Sin icono</option>
                {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Orden</label>
              <input type="number" value={ordenDefault} onChange={e => setOrdenDefault(Number(e.target.value))} onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">¿Es fase final?</label>
              <button type="button" onClick={() => setEsFinal(!esFinal)}
                className={`w-full py-2 text-sm font-semibold rounded-lg transition-colors ${esFinal ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'}`}>
                {esFinal ? 'Sí, es final' : 'No'}
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">{saving ? 'Guardando...' : 'Guardar'}</button>
            <button onClick={() => setFormOpen(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar la fase <strong className="text-slate-100">{deleteItem?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
