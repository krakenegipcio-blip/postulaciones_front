const API_URL = import.meta.env.VITE_API_URL || '/api';

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API Error: ${res.statusText}`);
  }
  return res.json();
};

export type Area = { id: number; nombre: string; color_hex: string; created_at?: string };
export type Duracion = { id: number; nombre: string; color_hex: string; created_at?: string };
export type Empresa = { id: number; nombre: string; created_at?: string };
export type Cargo = { id: number; nombre: string; id_area?: number; area?: Area; orden?: number; created_at?: string };
export type Estado = { id: number; nombre: string; color_hex: string; created_at?: string };
export type Plataforma = { id: number; nombre: string; created_at?: string };
export type Modalidad = { id: number; nombre: string; color_hex: string; created_at?: string };
export type Ubicacion = { id: number; nombre: string; created_at?: string };
export type Tecnologia = { id: number; nombre: string; id_padre: number | null; id_area?: number; area?: Area; color_hex: string; orden?: number; created_at?: string; padre?: Tecnologia };
export type MetodoEvaluacion = { id: number; nombre: string; color_hex: string; created_at?: string };
export type NivelExperiencia = { id: number; nombre: string; orden?: number; created_at?: string };

export type FaseSeguimiento = {
  id: number;
  nombre: string;
  color_hex: string;
  icono: string | null;
  orden_default: number;
  es_final: boolean;
  created_at?: string;
};

export type ResultadoSeguimiento = 'pendiente' | 'completado' | 'aprobado' | 'rechazado' | 'cancelado';

export type PostulacionSeguimiento = {
  id: number;
  id_postulacion: number;
  id_fase_seguimiento: number;
  id_metodo_evaluacion: number | null;
  nota: string | null;
  fecha_evento: string;
  created_at?: string;
  updated_at?: string;
  fase: FaseSeguimiento;
  metodo: MetodoEvaluacion | null;
};

export type SeguimientoPayload = {
  id_fase_seguimiento: number;
  id_metodo_evaluacion: number | null;
  nota: string | null;
  fecha_evento: string;
};

export type PostulacionRow = {
  id: number;
  descripcion: string;
  id_empresa: number | null;
  id_cargo: number | null;
  id_estado: number;
  url: string | null;
  id_plataforma: number | null;
  id_modalidad: number | null;
  id_ubicacion: number | null;
  id_area: number | null;
  id_duracion: number | null;
  dias_presenciales: number | null;
  sueldo_ofrecido: number | null;
  cantidad_solicitudes: number | null;
  id_nivel: number | null;
  sueldo_pedido: number | null;
  fecha_postulacion: string;
  fecha_actualizacion: string;
  created_at?: string;
  empresa?: Empresa;
  cargo?: Cargo;
  estado?: Estado;
  plataforma?: Plataforma;
  modalidad?: Modalidad;
  ubicacion?: Ubicacion;
  area?: Area;
  duracion?: Duracion;
  nivel_experiencia?: NivelExperiencia;
  tecnologias?: Tecnologia[];
  metodos?: MetodoEvaluacion[];
};

export type PreguntaFrecuente = {
  id: number;
  pregunta: string;
  respuesta: string;
  frecuencia: number;
  id_area: number | null;
  id_tecnologia: number | null;
  activa: boolean;
  usuario_id: number;
  created_at?: string;
  area?: Area;
  tecnologia?: Tecnologia;
};

export type BundlePostulacion = {
  id: number;
  nombre: string;
  id_empresa: number | null;
  id_cargo: number | null;
  id_nivel: number | null;
  id_plataforma: number | null;
  id_ubicacion: number | null;
  id_modalidad: number | null;
  id_estado: number | null;
  id_area: number | null;
  id_duracion: number | null;
  sueldo_ofrecido: number | null;
  sueldo_pedido: number | null;
  es_default: boolean;
  created_at?: string;
  empresa?: Empresa | null;
  cargo?: Cargo | null;
  nivel?: NivelExperiencia | null;
  plataforma?: Plataforma | null;
  ubicacion?: Ubicacion | null;
  modalidad?: Modalidad | null;
  estado?: Estado | null;
  area?: Area | null;
  duracion?: Duracion | null;
};
