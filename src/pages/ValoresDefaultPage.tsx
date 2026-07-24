import { useState } from 'react';
import { Settings } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { BundlePostulacion } from '../lib/api';
import { useBundles, useEmpresas, useCargos, useNiveles, usePlataformas, useUbicaciones, useModalidades, useEstados } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';

interface Props { onMenuOpen: () => void; }

type BundleForm = {
  nombre: string;
  id_empresa: string;
  id_cargo: string;
  id_nivel: string;
  id_plataforma: string;
  id_ubicacion: string;
  id_modalidad: string;
  id_estado: string;
  sueldo_ofrecido: string;
  sueldo_pedido: string;
};

const emptyForm = (): BundleForm => ({
  nombre: '', id_empresa: '', id_cargo: '', id_nivel: '', id_plataforma: '',
  id_ubicacion: '', id_modalidad: '', id_estado: '', sueldo_ofrecido: '', sueldo_pedido: '',
});

function toForm(b: BundlePostulacion): BundleForm {
  return {
    nombre: b.nombre,
    id_empresa: b.id_empresa ? String(b.id_empresa) : '',
    id_cargo: b.id_cargo ? String(b.id_cargo) : '',
    id_nivel: b.id_nivel ? String(b.id_nivel) : '',
    id_plataforma: b.id_plataforma ? String(b.id_plataforma) : '',
    id_ubicacion: b.id_ubicacion ? String(b.id_ubicacion) : '',
    id_modalidad: b.id_modalidad ? String(b.id_modalidad) : '',
    id_estado: b.id_estado ? String(b.id_estado) : '',
    sueldo_ofrecido: b.sueldo_ofrecido != null ? String(b.sueldo_ofrecido) : '',
    sueldo_pedido: b.sueldo_pedido != null ? String(b.sueldo_pedido) : '',
  };
}

function toPayload(f: BundleForm, es_default: boolean) {
  return {
    nombre: f.nombre.trim(),
    id_empresa: f.id_empresa ? Number(f.id_empresa) : null,
    id_cargo: f.id_cargo ? Number(f.id_cargo) : null,
    id_nivel: f.id_nivel ? Number(f.id_nivel) : null,
    id_plataforma: f.id_plataforma ? Number(f.id_plataforma) : null,
    id_ubicacion: f.id_ubicacion ? Number(f.id_ubicacion) : null,
    id_modalidad: f.id_modalidad ? Number(f.id_modalidad) : null,
    id_estado: f.id_estado ? Number(f.id_estado) : null,
    sueldo_ofrecido: f.sueldo_ofrecido ? Number(f.sueldo_ofrecido) : null,
    sueldo_pedido: f.sueldo_pedido ? Number(f.sueldo_pedido) : null,
    es_default,
  };
}

export default function ValoresDefaultPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = useBundles();
  const empresas = useEmpresas();
  const cargos = useCargos();
  const niveles = useNiveles();
  const plataformas = usePlataformas();
  const ubicaciones = useUbicaciones();
  const modalidades = useModalidades();
  const estados = useEstados();

  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<BundlePostulacion | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<BundleForm>(emptyForm());
  const [esDefault, setEsDefault] = useState(false);
  const [deleteItem, setDeleteItem] = useState<BundlePostulacion | null>(null);
  const [saving, setSaving] = useState(false);

  const set = (key: keyof BundleForm, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const openNew = () => { setEditing(null); setForm(emptyForm()); setEsDefault(false); setFormOpen(true); };
  const openEdit = (row: BundlePostulacion) => { setEditing(row); setForm(toForm(row)); setEsDefault(row.es_default); setFormOpen(true); };

  const handleSave = async () => {
    if (!form.nombre.trim()) return;
    setSaving(true);
    try {
      const payload = toPayload(form, esDefault);
      if (editing) {
        await apiFetch(`/bundles/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/bundles', { method: 'POST', body: JSON.stringify(payload) });
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
      await apiFetch(`/bundles/${deleteItem.id}`, { method: 'DELETE' });
      setDeleteItem(null);
      reload();
    } catch (err) {
      console.error(err);
    }
  };

  const paged = data.slice((page - 1) * perPage, page * perPage);

  const selectClass = "w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";
  const inputClass = selectClass;

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Bundles de Valores por Defecto"
        icon={<Settings size={18} className="text-slate-400" />}
        rows={paged}
        columns={[
          { key: 'nombre', label: 'Nombre del Bundle' },
          { key: 'empresa', label: 'Empresa', render: (r: BundlePostulacion) => r.empresa?.nombre || '—' },
          { key: 'cargo', label: 'Cargo', render: (r: BundlePostulacion) => r.cargo?.nombre || '—' },
          { key: 'nivel', label: 'Nivel', render: (r: BundlePostulacion) => r.nivel?.nombre || '—' },
          { key: 'estado', label: 'Estado', render: (r: BundlePostulacion) => r.estado?.nombre || '—' },
          { key: 'es_default', label: 'Default', render: (r: BundlePostulacion) => r.es_default ? <span className="text-emerald-400 font-bold">Sí</span> : '—' },
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Bundle' : 'Nuevo Bundle'} size="md">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nombre del Bundle</label>
            <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)}
              className={inputClass} placeholder="Ej: Informática" autoFocus />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Empresa</label>
              <select value={form.id_empresa} onChange={e => set('id_empresa', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {empresas.data.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cargo</label>
              <select value={form.id_cargo} onChange={e => set('id_cargo', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {cargos.data.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Nivel</label>
              <select value={form.id_nivel} onChange={e => set('id_nivel', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {niveles.data.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Plataforma</label>
              <select value={form.id_plataforma} onChange={e => set('id_plataforma', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {plataformas.data.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Ubicación</label>
              <select value={form.id_ubicacion} onChange={e => set('id_ubicacion', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {ubicaciones.data.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Modalidad</label>
              <select value={form.id_modalidad} onChange={e => set('id_modalidad', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {modalidades.data.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Estado</label>
              <select value={form.id_estado} onChange={e => set('id_estado', e.target.value)} className={selectClass}>
                <option value="">Sin valor por defecto</option>
                {estados.data.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Sueldo Ofrecido</label>
              <input type="number" value={form.sueldo_ofrecido} onChange={e => set('sueldo_ofrecido', e.target.value)}
                className={inputClass} placeholder="Sin valor por defecto" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Sueldo Solicitado</label>
              <input type="number" value={form.sueldo_pedido} onChange={e => set('sueldo_pedido', e.target.value)}
                className={inputClass} placeholder="Sin valor por defecto" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEsDefault(!esDefault)}
              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                esDefault ? 'bg-emerald-600 border-emerald-500' : 'bg-slate-700 border-slate-500'
              }`}
            >
              {esDefault && <div className="w-2 h-2 bg-white rounded-sm" />}
            </button>
            <span className="text-sm text-slate-300">Establecer como Bundle por Defecto al crear postulaciones</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg">{saving ? 'Guardando...' : 'Guardar'}</button>
            <button onClick={() => setFormOpen(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar el bundle <strong className="text-slate-100">{deleteItem?.nombre}</strong>?</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
