import { useState, useEffect, useRef } from 'react';
import { Plus, X, ChevronDown } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import type { PostulacionRow, Empresa, Cargo, Estado, Plataforma, Modalidad, Ubicacion, Tecnologia, MetodoEvaluacion, NivelExperiencia, FaseSeguimiento } from '../../lib/api';
import Badge from '../ui/Badge';
import { showToast } from '../ui/Toast';
import SeguimientoTimeline from './SeguimientoTimeline';

interface Props {
  item: PostulacionRow | null;
  empresas: Empresa[];
  cargos: Cargo[];
  estados: Estado[];
  plataformas: Plataforma[];
  modalidades: Modalidad[];
  ubicaciones: Ubicacion[];
  tecnologias: Tecnologia[];
  metodos: MetodoEvaluacion[];
  niveles: NivelExperiencia[];
  fasesSeguimiento: FaseSeguimiento[];
  onSave: () => void;
  onCancel: () => void;
  reloadEmpresas: () => Promise<void>;
  reloadCargos: () => Promise<void>;
  reloadTecnologias: () => Promise<void>;
  readOnly?: boolean;
}

type FormState = {
  id_empresa: string;
  id_cargo: string;
  id_estado: string;
  url: string;
  id_plataforma: string;
  id_modalidad: string;
  id_ubicacion: string;
  dias_presenciales: string;
  sueldo_ofrecido: string;
  cantidad_solicitudes: string;
  id_nivel: string;
  sueldo_pedido: string;
  fecha_postulacion: string;
  descripcion: string;
  tecnologias: number[];
  metodos: number[];
};

function toForm(item: PostulacionRow | null, estadoDefault: number): FormState {
  if (!item) {
    const today = new Date().toISOString().split('T')[0];
    return {
      id_empresa: '', id_cargo: '', id_estado: String(estadoDefault),
      url: '', id_plataforma: '', id_modalidad: '', id_ubicacion: '',
      dias_presenciales: '', sueldo_ofrecido: '',
      cantidad_solicitudes: '', id_nivel: '', sueldo_pedido: '',
      fecha_postulacion: today, descripcion: '',
      tecnologias: [], metodos: [],
    };
  }
  return {
    id_empresa: String(item.id_empresa ?? ''),
    id_cargo: String(item.id_cargo ?? ''),
    id_estado: String(item.id_estado),
    url: item.url ?? '',
    id_plataforma: String(item.id_plataforma ?? ''),
    id_modalidad: String(item.id_modalidad ?? ''),
    id_ubicacion: String(item.id_ubicacion ?? ''),
    dias_presenciales: String(item.dias_presenciales ?? ''),
    sueldo_ofrecido: String(item.sueldo_ofrecido ?? ''),
    cantidad_solicitudes: String(item.cantidad_solicitudes ?? ''),
    id_nivel: String(item.id_nivel ?? ''),
    sueldo_pedido: String(item.sueldo_pedido ?? ''),
    fecha_postulacion: item.fecha_postulacion ? item.fecha_postulacion.split('T')[0] : '',
    descripcion: item.descripcion ?? '',
    tecnologias: item.tecnologias?.map(t => t.id) ?? [],
    metodos: item.metodos?.map(m => m.id) ?? [],
  };
}

interface ComboBoxProps {
  label: string;
  placeholder: string;
  items: { id: number; nombre: string }[];
  value: string;
  onChange: (id: string) => void;
  onCreateNew: (nombre: string) => Promise<void>;
  entityLabel: string;
  readOnly?: boolean;
}

function ComboBox({ label, placeholder, items, value, onChange, onCreateNew, entityLabel, readOnly = false }: ComboBoxProps) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const found = items.find(i => String(i.id) === value);
      setText(found ? found.nombre : '');
    } else {
      setText('');
    }
  }, [value, items]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = items.filter(i => i.nombre.toLowerCase().includes(text.toLowerCase()));
  const existsAlready = items.some(i => i.nombre.toLowerCase() === text.trim().toLowerCase());
  const canCreate = text.trim().length > 0 && !existsAlready;

  const handleSelect = (item: { id: number; nombre: string }) => {
    onChange(String(item.id));
    setText(item.nombre);
    setOpen(false);
  };

  const handleCreate = async () => {
    if (!canCreate || creating) return;
    setCreating(true);
    try {
      await onCreateNew(text.trim());
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (val: string) => {
    setText(val);
    if (value) {
      const current = items.find(i => String(i.id) === value);
      if (current && current.nombre !== val) onChange('');
    }
    if (!open) setOpen(true);
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={e => handleInputChange(e.target.value)}
            onFocus={() => !readOnly && setOpen(true)}
            placeholder={placeholder}
            disabled={readOnly}
            className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 disabled:opacity-60"
          />
          <button
            type="button"
            onClick={() => !readOnly && setOpen(!open)}
            disabled={readOnly}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-60"
          >
            <ChevronDown size={16} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
        </div>
        <button
          type="button"
          onClick={handleCreate}
          disabled={!canCreate || creating || readOnly}
          title={existsAlready && text.trim().length > 0 ? `"${text.trim()}" ya existe` : `Agregar ${entityLabel}`}
          className="flex items-center justify-center w-9 h-9 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-500 text-white rounded-lg transition-colors flex-shrink-0"
        >
          <Plus size={16} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg shadow-xl max-h-44 overflow-y-auto">
          {filtered.length === 0 && (
            <div className="px-3 py-2 text-xs text-slate-500">
              {text.trim().length > 0 ? 'Sin coincidencias - usa "+" para crear' : 'Sin registros'}
            </div>
          )}
          {filtered.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-600 ${String(item.id) === value ? 'bg-slate-600 text-blue-400' : 'text-slate-200'}`}
            >
              {item.nombre}
            </button>
          ))}
          {text.trim().length > 0 && existsAlready && (
            <div className="px-3 py-1.5 text-xs text-amber-400 border-t border-slate-600">
              "{text.trim()}" ya existe en la lista
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function PostulacionForm({ item, empresas, cargos, estados, plataformas, modalidades, ubicaciones, tecnologias, metodos, niveles, fasesSeguimiento, onSave, onCancel, reloadEmpresas, reloadCargos, reloadTecnologias, readOnly = false }: Props) {
  const estadoDefault = estados.find(e => e.nombre === 'En Espera')?.id ?? (estados[0]?.id ?? 0);
  const [form, setForm] = useState<FormState>(() => toForm(item, estadoDefault));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [tecnoSearch, setTecnoSearch] = useState('');
  const [metodoSearch, setMetodoSearch] = useState('');
  const [creatingTecno, setCreatingTecno] = useState(false);

  const showSeguimiento = Boolean(item);

  useEffect(() => {
    setForm(toForm(item, estadoDefault));
    setError('');
  }, [item, estadoDefault]);

  const set = (k: keyof FormState, v: string | number[]) => setForm(prev => ({ ...prev, [k]: v }));

  const toggleTecno = (id: number, parentId: number | null) => {
    let arr = [...form.tecnologias];
    if (arr.includes(id)) arr = arr.filter(x => x !== id);
    else {
      arr.push(id);
      if (parentId && !arr.includes(parentId)) arr.push(parentId);
    }
    set('tecnologias', arr);
  };

  const toggleMetodo = (id: number) => {
    const arr = form.metodos.includes(id) ? form.metodos.filter(x => x !== id) : [...form.metodos, id];
    set('metodos', arr);
  };

  const handleSave = async () => {
    if (!form.id_estado) { setError('Debe seleccionar un estado.'); return; }
    setSaving(true);
    setError('');

    const body = {
      id_empresa: form.id_empresa ? Number(form.id_empresa) : null,
      id_cargo: form.id_cargo ? Number(form.id_cargo) : null,
      id_estado: Number(form.id_estado),
      url: form.url || null,
      id_plataforma: form.id_plataforma ? Number(form.id_plataforma) : null,
      id_modalidad: form.id_modalidad ? Number(form.id_modalidad) : null,
      id_ubicacion: form.id_ubicacion ? Number(form.id_ubicacion) : null,
      dias_presenciales: form.dias_presenciales ? Number(form.dias_presenciales) : null,
      sueldo_ofrecido: form.sueldo_ofrecido ? Number(form.sueldo_ofrecido) : null,
      cantidad_solicitudes: form.cantidad_solicitudes ? Number(form.cantidad_solicitudes) : null,
      id_nivel: form.id_nivel ? Number(form.id_nivel) : null,
      sueldo_pedido: form.sueldo_pedido ? Number(form.sueldo_pedido) : null,
      fecha_postulacion: form.fecha_postulacion,
      descripcion: form.descripcion,
      tecnologias: form.tecnologias,
      metodos: form.metodos,
    };

    try {
      if (item) await apiFetch(`/postulaciones/${item.id}`, { method: 'PUT', body: JSON.stringify(body) });
      else await apiFetch('/postulaciones', { method: 'POST', body: JSON.stringify(body) });
      onSave();
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateEmpresa = async (nombre: string) => {
    const created = await apiFetch('/empresa', { method: 'POST', body: JSON.stringify({ nombre }) });
    await reloadEmpresas();
    set('id_empresa', String(created.id));
    showToast('Nueva empresa agregada');
  };

  const handleCreateCargo = async (nombre: string) => {
    const created = await apiFetch('/cargo', { method: 'POST', body: JSON.stringify({ nombre }) });
    await reloadCargos();
    set('id_cargo', String(created.id));
    showToast('Nuevo cargo agregado');
  };

  const handleCreateTecnologia = async () => {
    const trimmed = tecnoSearch.trim();
    if (!trimmed) return;
    const exists = tecnologias.some(t => t.nombre.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setError(`La tecnología "${trimmed}" ya existe.`);
      return;
    }
    setCreatingTecno(true);
    try {
      const hue = Math.floor(Math.random() * 360);
      const hex = hslToHex(hue, 70, 60);
      const created = await apiFetch('/tecnologia', { method: 'POST', body: JSON.stringify({ nombre: trimmed, color_hex: hex, id_padre: null }) });
      await reloadTecnologias();
      set('tecnologias', [...form.tecnologias, created.id]);
      setTecnoSearch('');
      showToast('Nueva tecnología agregada');
    } catch (err: any) {
      setError(err.message || 'Error al crear tecnología');
    } finally {
      setCreatingTecno(false);
    }
  };

  const filteredTecnos = tecnologias.filter(t => t.nombre.toLowerCase().includes(tecnoSearch.toLowerCase()));
  const filteredMetodos = metodos.filter(m => m.nombre.toLowerCase().includes(metodoSearch.toLowerCase()));
  const selectedModalidad = modalidades.find(m => String(m.id) === form.id_modalidad);
  const isHibrido = selectedModalidad?.nombre === 'Híbrido';
  const tecnoExistsAlready = tecnoSearch.trim().length > 0 && tecnologias.some(t => t.nombre.toLowerCase() === tecnoSearch.trim().toLowerCase());
  const canCreateTecno = tecnoSearch.trim().length > 0 && !tecnoExistsAlready;

  return (
    <div className="space-y-6">
      {error && <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-2 rounded-lg">{error}</div>}

      <div className={`grid gap-5 sm:gap-6 ${showSeguimiento ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1 lg:grid-cols-3'}`}>
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2">1. Detalles Generales</h3>

          <ComboBox label="Empresa" placeholder="Seleccionar o crear empresa" items={empresas} value={form.id_empresa} onChange={v => set('id_empresa', v)} onCreateNew={handleCreateEmpresa} entityLabel="empresa" readOnly={readOnly} />
          <ComboBox label="Cargo" placeholder="Seleccionar o crear cargo" items={cargos} value={form.id_cargo} onChange={v => set('id_cargo', v)} onCreateNew={handleCreateCargo} entityLabel="cargo" readOnly={readOnly} />

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nivel <span className="text-slate-600">(opcional)</span></label>
            <select value={form.id_nivel} onChange={e => set('id_nivel', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60">
              <option value="">Sin especificar</option>
              {niveles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Plataforma</label>
            <select value={form.id_plataforma} onChange={e => set('id_plataforma', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60">
              <option value="">Sin especificar</option>
              {plataformas.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Fecha Postulación</label>
              <input type="date" value={form.fecha_postulacion} onChange={e => set('fecha_postulacion', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Cant. Solicitudes <span className="text-slate-600">(opc.)</span></label>
              <input type="number" min={0} value={form.cantidad_solicitudes} onChange={e => set('cantidad_solicitudes', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" placeholder="Ej: 150" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Notas <span className="text-slate-600">(opcional)</span></label>
            <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={2} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 resize-none disabled:opacity-60" placeholder="Notas breves..." />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2">2. Conocimientos</h3>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Tecnologías Requeridas</label>
            <div className="flex flex-wrap gap-1 mb-2 min-h-[28px]">
              {form.tecnologias.map(tid => {
                const t = tecnologias.find(x => x.id === tid);
                if (!t) return null;
                return (
                  <span key={tid} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: t.color_hex + '33', color: t.color_hex, border: `1px solid ${t.color_hex}66` }}>
                    {t.nombre}
                    {!readOnly && <button type="button" onClick={() => toggleTecno(tid, null)} className="hover:opacity-70"><X size={10} /></button>}
                  </span>
                );
              })}
            </div>
            <div className="flex gap-1.5">
              <input type="text" placeholder="Buscar o crear tecnología" value={tecnoSearch} onChange={e => setTecnoSearch(e.target.value)} disabled={readOnly} className="flex-1 bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" />
              <button type="button" onClick={handleCreateTecnologia} disabled={!canCreateTecno || creatingTecno || readOnly} title={tecnoExistsAlready && tecnoSearch.trim().length > 0 ? `"${tecnoSearch.trim()}" ya existe` : 'Agregar tecnología'} className="flex items-center justify-center w-9 h-9 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:text-slate-500 text-white rounded-lg transition-colors flex-shrink-0">
                <Plus size={16} />
              </button>
            </div>
            {tecnoExistsAlready && <div className="mt-1 text-xs text-amber-400">"{tecnoSearch.trim()}" ya existe en la lista</div>}
            <div className="mt-2 max-h-40 overflow-y-auto space-y-0.5 bg-slate-700/50 rounded-lg p-2">
              {filteredTecnos.map(t => (
                <button key={t.id} type="button" onClick={() => !readOnly && toggleTecno(t.id, t.id_padre)} disabled={readOnly} className={`w-full text-left text-xs px-2 py-1 rounded flex items-center gap-2 transition-colors ${form.tecnologias.includes(t.id) ? 'bg-slate-600' : 'hover:bg-slate-600'} disabled:pointer-events-none`}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: t.color_hex }} />
                  <span className="text-slate-200">{t.nombre}</span>
                  {t.id_padre && <span className="text-slate-500 text-xs ml-auto">{(t as { padre?: { nombre: string } }).padre?.nombre}</span>}
                  {form.tecnologias.includes(t.id) && <span className="text-emerald-400 ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Métodos de Evaluación</label>
            <input type="text" placeholder="Buscar método..." value={metodoSearch} onChange={e => setMetodoSearch(e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" />
            <div className="mt-2 max-h-32 overflow-y-auto space-y-0.5 bg-slate-700/50 rounded-lg p-2">
              {filteredMetodos.map(m => (
                <button key={m.id} type="button" onClick={() => !readOnly && toggleMetodo(m.id)} disabled={readOnly} className={`w-full text-left text-xs px-2 py-1 rounded flex items-center gap-2 transition-colors ${form.metodos.includes(m.id) ? 'bg-slate-600' : 'hover:bg-slate-600'} disabled:pointer-events-none`}>
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: m.color_hex }} />
                  <span className="text-slate-200">{m.nombre}</span>
                  {form.metodos.includes(m.id) && <span className="text-emerald-400 ml-auto text-xs">✓</span>}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {form.metodos.map(mid => {
                const m = metodos.find(x => x.id === mid);
                if (!m) return null;
                return <Badge key={mid} label={m.nombre} color={m.color_hex} />;
              })}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2">{showSeguimiento ? '3. Contratación' : '3. Contratación & Seguimiento'}</h3>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Ubicación</label>
            <select value={form.id_ubicacion} onChange={e => set('id_ubicacion', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60">
              <option value="">Sin especificar</option>
              {ubicaciones.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Modalidad</label>
            <select value={form.id_modalidad} onChange={e => set('id_modalidad', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60">
              <option value="">Sin especificar</option>
              {modalidades.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
            </select>
          </div>

          {isHibrido && (
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Días Híbrido</label>
              <input type="number" min={1} max={5} value={form.dias_presenciales} onChange={e => set('dias_presenciales', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" placeholder="Ej: 2" />
            </div>
          )}

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Sueldo Ofrecido</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
              <input type="number" value={form.sueldo_ofrecido} onChange={e => set('sueldo_ofrecido', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Sueldo Solicitado <span className="text-slate-600">(por ti)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm">$</span>
              <input type="number" value={form.sueldo_pedido} onChange={e => set('sueldo_pedido', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg pl-7 pr-3 py-2 focus:outline-none focus:border-emerald-500 disabled:opacity-60" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Estado</label>
            <select value={form.id_estado} onChange={e => set('id_estado', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60">
              <option value="">Seleccionar Estado</option>
              {estados.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">URL Oferta</label>
            <input type="url" value={form.url} onChange={e => set('url', e.target.value)} disabled={readOnly} className="w-full bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:opacity-60" placeholder="https://..." />
          </div>
        </div>

        {showSeguimiento && item && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-700 pb-2">4. Seguimiento</h3>
            <SeguimientoTimeline
              postulacionId={item.id}
              fases={fasesSeguimiento}
              metodos={metodos}
              readOnly={readOnly}
            />
          </div>
        )}
      </div>

      {!readOnly && (
        <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-700">
          <button onClick={handleSave} disabled={saving} className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-colors">
            {saving ? 'Guardando...' : 'Guardar Postulación'}
          </button>
          <button onClick={onCancel} className="px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Cancelar
          </button>
        </div>
      )}
      {readOnly && (
        <div className="flex items-center justify-center pt-2 border-t border-slate-700">
          <button onClick={onCancel} className="px-8 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors">
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
