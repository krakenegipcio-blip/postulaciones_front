import { useState } from 'react';
import { Clock } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { Duracion } from '../lib/api';
import { useDuraciones } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';

interface Props { onMenuOpen: () => void; }

export default function DuracionPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useDuraciones();
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<Duracion | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [color_hex, setColorHex] = useState('#8b5cf6');
  const [deleteItem, setDeleteItem] = useState<Duracion | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setNombre(''); setColorHex('#8b5cf6'); setFormOpen(true); };
  const openEdit = (row: Duracion) => { setEditing(row); setNombre(row.nombre); setColorHex(row.color_hex); setFormOpen(true); };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    const payload = { nombre, color_hex };
    if (editing) {
      await apiFetch(`/duracion/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
    } else {
      await apiFetch('/duracion', { method: 'POST', body: JSON.stringify(payload) });
    }
    setSaving(false);
    setFormOpen(false);
    reload();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await apiFetch(`/duracion/${deleteItem.id}`, { method: 'DELETE' });
    setDeleteItem(null);
    reload();
  };

  const paged = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Mantenedor de Duración"
        icon={<Clock size={18} className="text-slate-400" />}
        rows={paged}
        columns={[
          { 
            key: 'color_hex', 
            label: 'Color',
            render: (row) => (
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: row.color_hex }}></span>
                <span className="text-slate-400 font-mono text-[10px]">{row.color_hex}</span>
              </div>
            )
          },
          { key: 'nombre', label: 'Tipo de Duración' }
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Duración' : 'Nueva Duración'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Ej: Permanente, Proyecto..."
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Color Distintivo</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color_hex}
                onChange={e => setColorHex(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer bg-slate-700 border-0 p-1"
              />
              <span className="text-sm text-slate-300 font-mono">{color_hex}</span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button onClick={() => setFormOpen(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar duración <strong className="text-slate-100">{deleteItem?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
