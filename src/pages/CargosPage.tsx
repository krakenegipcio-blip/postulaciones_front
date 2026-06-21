import { useState } from 'react';
import { Users } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { Cargo } from '../lib/api';
import { useCargos } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';

interface Props { onMenuOpen: () => void; }

export default function CargosPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useCargos();
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<Cargo | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [orden, setOrden] = useState<number>(0);
  const [deleteItem, setDeleteItem] = useState<Cargo | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setNombre(''); setOrden(0); setFormOpen(true); };
  const openEdit = (row: Cargo) => { setEditing(row); setNombre(row.nombre); setOrden(row.orden ?? 0); setFormOpen(true); };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    const body = { nombre, orden: Number(orden) };
    if (editing) {
      await apiFetch(`/cargo/${editing.id}`, { method: 'PUT', body: JSON.stringify(body) });
    } else {
      await apiFetch('/cargo', { method: 'POST', body: JSON.stringify(body) });
    }
    setSaving(false);
    setFormOpen(false);
    reload();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await apiFetch(`/cargo/${deleteItem.id}`, { method: 'DELETE' });
    setDeleteItem(null);
    reload();
  };

  const paged = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Mantenedor de Cargos"
        icon={<Users size={18} className="text-slate-400" />}
        rows={paged}
        columns={[
          { key: 'nombre', label: 'Nombre del Cargo' },
          { key: 'orden', label: 'Orden' }
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Cargo' : 'Nuevo Cargo'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" placeholder="Nombre del cargo" autoFocus />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Orden</label>
            <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" placeholder="0" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">{saving ? 'Guardando...' : 'Guardar'}</button>
            <button onClick={() => setFormOpen(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar <strong className="text-slate-100">{deleteItem?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
