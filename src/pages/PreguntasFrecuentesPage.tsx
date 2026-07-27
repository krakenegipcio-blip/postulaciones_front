import { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { apiFetch } from '../lib/api';
import type { PreguntaFrecuente } from '../lib/api';
import { useCatalog, useAreas } from '../hooks/useData';
import MaintainerTable from '../components/maintainer/MaintainerTable';
import Modal from '../components/ui/Modal';
import Header from '../components/layout/Header';
import RichTextEditor from '../components/ui/RichTextEditor';

interface Props { onMenuOpen: () => void; }

// Extendemos useData para obtener las preguntas
export function usePreguntasFrecuentes() {
  return useCatalog<PreguntaFrecuente>('preguntas_frecuentes');
}

export default function PreguntasFrecuentesPage({ onMenuOpen }: Props) {
  const { data, loading, reload } = usePreguntasFrecuentes();
  const areas = useAreas();
  
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [editing, setEditing] = useState<PreguntaFrecuente | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [id_area, setIdArea] = useState('');
  const [activa, setActiva] = useState(true);

  const [deleteItem, setDeleteItem] = useState<PreguntaFrecuente | null>(null);
  const [saving, setSaving] = useState(false);

  const openNew = () => { 
    setEditing(null); 
    setPregunta(''); 
    setRespuesta(''); 
    setIdArea('');
    setActiva(true);
    setFormOpen(true); 
  };
  
  const openEdit = (row: PreguntaFrecuente) => { 
    setEditing(row); 
    setPregunta(row.pregunta); 
    setRespuesta(row.respuesta); 
    setIdArea(row.id_area ? String(row.id_area) : '');
    setActiva(row.activa);
    setFormOpen(true); 
  };

  const handleSave = async () => {
    if (!pregunta.trim() || !respuesta.trim()) return;
    setSaving(true);
    
    // Convertir el HTML a texto plano rápido para extraer un snippet para el log/UI si se necesita,
    // pero guardamos el HTML completo
    const payload = { 
      pregunta, 
      respuesta,
      id_area: id_area ? Number(id_area) : null,
      activa,
    };
    
    try {
      if (editing) {
        await apiFetch(`/preguntas_frecuentes/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/preguntas_frecuentes', { method: 'POST', body: JSON.stringify(payload) });
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
    await apiFetch(`/preguntas_frecuentes/${deleteItem.id}`, { method: 'DELETE' });
    setDeleteItem(null);
    reload();
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const paged = data.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />
      <MaintainerTable
        title="Mantenedor de Preguntas Frecuentes"
        icon={<HelpCircle size={18} className="text-slate-400" />}
        rows={paged}
        columns={[
          { 
            key: 'pregunta', 
            label: 'Pregunta',
            render: (row) => (
              <div className="max-w-xs truncate text-slate-200 font-medium">
                {stripHtml(row.pregunta)}
              </div>
            )
          },
          { 
            key: 'respuesta', 
            label: 'Respuesta (Snippet)',
            render: (row) => (
              <div className="max-w-xs truncate text-slate-400 text-xs">
                {stripHtml(row.respuesta)}
              </div>
            )
          },
          { 
            key: 'frecuencia', 
            label: 'Frecuencia',
            render: (row) => (
              <span className="bg-slate-700 text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold">
                {row.frecuencia}
              </span>
            )
          },
          {
            key: 'activa',
            label: 'Estado',
            render: (row) => (
              <span className={row.activa ? 'text-emerald-400' : 'text-red-400'}>
                {row.activa ? 'Activa' : 'Inactiva'}
              </span>
            )
          }
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? 'Editar Pregunta' : 'Nueva Pregunta'} size="xl">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Asociar a un Área (Opcional)</label>
              <select 
                value={id_area} 
                onChange={e => setIdArea(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Cualquier Área</option>
                {areas.data.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Estado</label>
              <select 
                value={activa ? 'true' : 'false'} 
                onChange={e => setActiva(e.target.value === 'true')}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="true">Activa (Visible)</option>
                <option value="false">Inactiva (Archivada)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">La Pregunta</label>
            <RichTextEditor 
              content={pregunta} 
              onChange={setPregunta} 
              placeholder="Escribe la pregunta que te hicieron..."
            />
          </div>
          
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tu Respuesta Ideal</label>
            <RichTextEditor 
              content={respuesta} 
              onChange={setRespuesta} 
              placeholder="Redacta la mejor respuesta. Usa listas, negritas, o bloques de código..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-colors">
              {saving ? 'Guardando...' : 'Guardar Pregunta Frecuente'}
            </button>
            <button onClick={() => setFormOpen(false)} className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!deleteItem} onClose={() => setDeleteItem(null)} title="Confirmar Eliminación" size="sm">
        <div className="space-y-4">
          <p className="text-slate-300 text-sm">¿Eliminar esta pregunta frecuente de forma permanente?</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg">Eliminar</button>
            <button onClick={() => setDeleteItem(null)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg">Cancelar</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
