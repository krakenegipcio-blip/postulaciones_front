import { useState } from 'react';
import { Building2 } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { Empresa } from '../lib/api';
import { useEmpresas } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';

interface Props { onMenuOpen: () => void; }

export default function EmpresasPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useEmpresas();
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<Empresa | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [deleteItem, setDeleteItem] = useState<Empresa | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setNombre(''); setFormOpen(true); };
  const openEdit = (row: Empresa) => { setEditing(row); setNombre(row.nombre); setFormOpen(true); };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    if (editing) {
      await apiFetch(`/empresa/${editing.id}`, { method: 'PUT', body: JSON.stringify({ nombre }) });
    } else {
      await apiFetch('/empresa', { method: 'POST', body: JSON.stringify({ nombre }) });
    }
    setSaving(false);
    setFormOpen(false);
    reload();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await apiFetch(`/empresa/${deleteItem.id}`, { method: 'DELETE' });
    setDeleteItem(null);
    reload();
  };

  const paged = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Mantenedor de Empresas"
        icon={<Building2 size={18} className="text-slate-400" />}
        rows={paged}
        columns={[{ key: 'nombre', label: 'Nombre Empresa' }]}
        total={data.length}
        page={page}
        perPage={perPage}
        onPage={setPage}
        onNew={openNew}
        onEdit={openEdit}
        onDelete={setDeleteItem}
        loading={loading}
      />

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Empresa' : 'Nueva Empresa'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Nombre de la empresa"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
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
