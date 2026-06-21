import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { MetodoEvaluacion } from '../lib/api';
import { useMetodos } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import ColorPicker from '../components/ui/ColorPicker';
import Badge from '../components/ui/Badge';
import Header from '../components/layout/Header';

interface Props { onMenuOpen: () => void; }

export default function MetodosPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useMetodos();
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<MetodoEvaluacion | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState('#6b7280');
  const [deleteItem, setDeleteItem] = useState<MetodoEvaluacion | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { setEditing(null); setNombre(''); setColor('#6b7280'); setFormOpen(true); };
  const openEdit = (row: MetodoEvaluacion) => { setEditing(row); setNombre(row.nombre); setColor(row.color_hex); setFormOpen(true); };

  const handleSave = async () => {
    if (!nombre.trim()) return;
    setSaving(true);
    if (editing) await apiFetch(`/metodo_evaluacion/${editing.id}`, { method: 'PUT', body: JSON.stringify({ nombre, color_hex: color }) });
    else await apiFetch('/metodo_evaluacion', { method: 'POST', body: JSON.stringify({ nombre, color_hex: color }) });
    setSaving(false);
    setFormOpen(false);
    reload();
  };

  const handleDelete = async () => {
    if (!deleteItem) return;
    await apiFetch(`/metodo_evaluacion/${deleteItem.id}`, { method: 'DELETE' });
    setDeleteItem(null);
    reload();
  };

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Mantenedor de Métodos de Evaluación"
        icon={<CheckSquare size={18} className="text-slate-400" />}
        rows={data.slice((page - 1) * perPage, page * perPage)}
        columns={[
          { key: 'nombre', label: 'Método', render: (r: MetodoEvaluacion) => <Badge label={r.nombre} color={r.color_hex} size="md" /> },
          { key: 'color_hex', label: 'Color', render: (r: MetodoEvaluacion) => (
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: r.color_hex }} />
              <span className="text-slate-400 text-xs font-mono">{r.color_hex}</span>
            </div>
          )},
        ]}
        total={data.length} page={page} perPage={perPage} onPage={setPage}
        onNew={openNew} onEdit={openEdit} onDelete={setDeleteItem} loading={loading}
      />
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Método' : 'Nuevo Método'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
            <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500" autoFocus />
          </div>
          <ColorPicker value={color} onChange={setColor} label="Color del Badge" />
          <div className="flex items-center gap-2"><span className="text-xs text-slate-500">Preview:</span><Badge label={nombre || 'Método'} color={color} size="md" /></div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">{saving ? 'Guardando...' : 'Guardar'}</button>
            <button onClick={() => setFormOpen(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar <strong>{deleteItem?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
