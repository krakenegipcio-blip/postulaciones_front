import { useMemo, useState } from 'react';
import {
  BadgeCheck,
  BadgeDollarSign,
  Circle,
  CircleSlash,
  FileCode,
  Handshake,
  MessageSquare,
  Monitor,
  Pencil,
  Phone,
  Plus,
  Send,
  Trash2,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useSeguimiento } from '../../hooks/useSeguimiento';
import type { FaseSeguimiento, MetodoEvaluacion, PostulacionSeguimiento, ResultadoSeguimiento, SeguimientoPayload } from '../../lib/api';

interface Props {
  postulacionId: number;
  fases: FaseSeguimiento[];
  metodos: MetodoEvaluacion[];
  readOnly?: boolean;
}

type StepForm = {
  id_fase_seguimiento: string;
  id_metodo_evaluacion: string;
  titulo: string;
  nota: string;
  fecha_evento: string;
  fecha_limite: string;
  resultado: ResultadoSeguimiento;
  orden: string;
};

const iconMap: Record<string, LucideIcon> = {
  send: Send,
  phone: Phone,
  'file-code': FileCode,
  users: Users,
  'monitor-code': Monitor,
  handshake: Handshake,
  'message-square': MessageSquare,
  'badge-dollar-sign': BadgeDollarSign,
  'x-circle': XCircle,
  'badge-check': BadgeCheck,
  'circle-slash': CircleSlash,
};

const resultadoLabels: Record<ResultadoSeguimiento, string> = {
  pendiente: 'Pendiente',
  completado: 'Completado',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  cancelado: 'Cancelado',
};

const today = () => new Date().toISOString().split('T')[0];

function formatDate(dateStr: string | null) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return day && month && year ? `${day}-${month}-${year}` : dateStr;
}

function emptyForm(fases: FaseSeguimiento[]): StepForm {
  const fase = fases[0];
  return {
    id_fase_seguimiento: fase ? String(fase.id) : '',
    id_metodo_evaluacion: '',
    titulo: '',
    nota: '',
    fecha_evento: today(),
    fecha_limite: '',
    resultado: 'pendiente',
    orden: fase ? String(fase.orden_default) : '0',
  };
}

function toForm(step: PostulacionSeguimiento): StepForm {
  return {
    id_fase_seguimiento: String(step.id_fase_seguimiento),
    id_metodo_evaluacion: step.id_metodo_evaluacion ? String(step.id_metodo_evaluacion) : '',
    titulo: step.titulo ?? '',
    nota: step.nota ?? '',
    fecha_evento: step.fecha_evento ? step.fecha_evento.split('T')[0] : today(),
    fecha_limite: step.fecha_limite ? step.fecha_limite.split('T')[0] : '',
    resultado: step.resultado,
    orden: String(step.orden ?? 0),
  };
}

function toPayload(form: StepForm, fases: FaseSeguimiento[]): SeguimientoPayload {
  const fase = fases.find(f => String(f.id) === form.id_fase_seguimiento);
  return {
    id_fase_seguimiento: Number(form.id_fase_seguimiento),
    id_metodo_evaluacion: form.id_metodo_evaluacion ? Number(form.id_metodo_evaluacion) : null,
    titulo: form.titulo.trim() || null,
    nota: form.nota.trim() || null,
    fecha_evento: form.fecha_evento,
    fecha_limite: form.fecha_limite || null,
    resultado: form.resultado,
    orden: form.orden ? Number(form.orden) : (fase?.orden_default ?? 0),
  };
}

export default function SeguimientoTimeline({ postulacionId, fases, metodos, readOnly = false }: Props) {
  const { rows, loading, error, createStep, updateStep, deleteStep } = useSeguimiento(postulacionId);
  const [editing, setEditing] = useState<PostulacionSeguimiento | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<StepForm>(() => emptyForm(fases));
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const sortedFases = useMemo(
    () => [...fases].sort((a, b) => a.orden_default - b.orden_default || a.nombre.localeCompare(b.nombre)),
    [fases]
  );

  const set = (key: keyof StepForm, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm(sortedFases));
    setLocalError('');
    setFormOpen(true);
  };

  const openEdit = (step: PostulacionSeguimiento) => {
    setEditing(step);
    setForm(toForm(step));
    setLocalError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
    setLocalError('');
  };

  const handleFaseChange = (value: string) => {
    const fase = sortedFases.find(f => String(f.id) === value);
    setForm(prev => ({ ...prev, id_fase_seguimiento: value, orden: fase ? String(fase.orden_default) : prev.orden }));
  };

  const handleSave = async () => {
    if (!form.id_fase_seguimiento) { setLocalError('Selecciona una fase.'); return; }
    if (!form.fecha_evento) { setLocalError('Indica la fecha del evento.'); return; }
    setSaving(true);
    setLocalError('');
    try {
      const payload = toPayload(form, sortedFases);
      if (editing) await updateStep(editing.id, payload);
      else await createStep(payload);
      closeForm();
    } catch (err: any) {
      setLocalError(err.message || 'Error al guardar el paso');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (step: PostulacionSeguimiento) => {
    if (!window.confirm('¿Eliminar este paso de seguimiento?')) return;
    await deleteStep(step.id);
  };

  return (
    <div className="h-full min-h-[520px] bg-slate-900/25 border border-slate-700 rounded-lg p-4 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-bold text-slate-100">Timeline de etapas</p>
          <p className="text-xs text-slate-500 mt-0.5">Fases, métodos, notas y fechas</p>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={openNew}
            disabled={sortedFases.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Plus size={13} />
            Paso
          </button>
        )}
      </div>

      {(error || localError) && (
        <div className="mb-3 bg-red-900/30 border border-red-700 text-red-300 text-xs px-3 py-2 rounded-lg">
          {localError || error}
        </div>
      )}

      {formOpen && !readOnly && (
        <div className="mb-4 rounded-lg border border-slate-600 bg-slate-800/80 p-3 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-300">{editing ? 'Editar paso' : 'Nuevo paso'}</p>
            <button type="button" onClick={closeForm} className="text-slate-400 hover:text-slate-200"><X size={14} /></button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Fase</label>
              <select
                value={form.id_fase_seguimiento}
                onChange={e => handleFaseChange(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Seleccionar fase</option>
                {sortedFases.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Método</label>
              <select
                value={form.id_metodo_evaluacion}
                onChange={e => set('id_metodo_evaluacion', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Sin método</option>
                {metodos.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Título opcional</label>
              <input
                value={form.titulo}
                onChange={e => set('titulo', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Ej: Prueba frontend"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Fecha</label>
              <input
                type="date"
                value={form.fecha_evento}
                onChange={e => set('fecha_evento', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Límite</label>
              <input
                type="date"
                value={form.fecha_limite}
                onChange={e => set('fecha_limite', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Resultado</label>
              <select
                value={form.resultado}
                onChange={e => set('resultado', e.target.value as ResultadoSeguimiento)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              >
                {Object.entries(resultadoLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Orden</label>
              <input
                type="number"
                value={form.orden}
                onChange={e => set('orden', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-slate-400 mb-1 block">Nota</label>
              <textarea
                value={form.nota}
                onChange={e => set('nota', e.target.value)}
                rows={2}
                className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-xs rounded-lg px-2 py-2 focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Qué se hizo o qué recibiste..."
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={handleSave} disabled={saving} className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors">
              {saving ? 'Guardando...' : 'Guardar paso'}
            </button>
            <button type="button" onClick={closeForm} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs rounded-lg transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-1">
        {loading && <div className="text-xs text-slate-500 py-8 text-center">Cargando seguimiento...</div>}

        {!loading && rows.length === 0 && (
          <div className="border border-dashed border-slate-700 rounded-lg p-4 text-center">
            <p className="text-sm text-slate-300 font-semibold">Sin seguimiento registrado</p>
            <p className="text-xs text-slate-500 mt-1">
              {readOnly ? 'Todavía no hay eventos para esta postulación.' : 'Agrega llamadas, pruebas o entrevistas.'}
            </p>
          </div>
        )}

        {!loading && rows.length > 0 && (
          <div className="relative pl-8 space-y-4">
            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-700" />
            {rows.map(step => {
              const Icon = iconMap[step.fase.icono ?? ''] ?? Circle;
              const title = step.titulo || step.fase.nombre;
              return (
                <div key={step.id} className="relative">
                  <div className="absolute -left-8 top-3 w-7 h-7 rounded-full flex items-center justify-center ring-4 ring-slate-800" style={{ backgroundColor: step.fase.color_hex }}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <div className="bg-slate-700/55 border border-slate-600 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-100 truncate">{title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{formatDate(step.fecha_evento)}</p>
                      </div>
                      {!readOnly && (
                        <div className="flex gap-1 flex-shrink-0">
                          <button type="button" onClick={() => openEdit(step)} className="p-1 text-slate-400 hover:text-blue-300 hover:bg-slate-600 rounded transition-colors" title="Editar paso">
                            <Pencil size={13} />
                          </button>
                          <button type="button" onClick={() => handleDelete(step)} className="p-1 text-slate-400 hover:text-red-300 hover:bg-slate-600 rounded transition-colors" title="Eliminar paso">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ color: step.fase.color_hex, borderColor: `${step.fase.color_hex}88`, backgroundColor: `${step.fase.color_hex}22` }}>
                        {resultadoLabels[step.resultado]}
                      </span>
                      {step.metodo && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{ color: step.metodo.color_hex, borderColor: `${step.metodo.color_hex}88`, backgroundColor: `${step.metodo.color_hex}22` }}>
                          {step.metodo.nombre}
                        </span>
                      )}
                      {step.fecha_limite && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-400/30">
                          Límite {formatDate(step.fecha_limite)}
                        </span>
                      )}
                    </div>

                    {step.nota && <p className="text-xs text-slate-300 leading-relaxed mt-2">{step.nota}</p>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
