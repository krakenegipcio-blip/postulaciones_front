import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Users, Code2, Globe } from 'lucide-react';
import { apiFetch } from '../lib/api';
import Header from '../components/layout/Header';
import Badge from '../components/ui/Badge';

interface Props { onMenuOpen: () => void; }

interface TecnoCount { id: number; nombre: string; color_hex: string; count: number }
interface CargoCount { nombre: string; count: number }
interface StackCombo { stack: string; count: number }
interface MetodoCount { nombre: string; color_hex: string; count: number }

interface AnalisisData {
  totalPostulaciones: number;
  conIngles: number;
  sinIngles: number;
  tecnologias: TecnoCount[];
  cargos: CargoCount[];
  stacks: StackCombo[];
  metodos: MetodoCount[];
  porEstado: { nombre: string; color_hex: string; count: number }[];
  porModalidad: { nombre: string; color_hex: string; count: number }[];
}

function BarH({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-3 group">
      <span className="text-slate-300 text-xs w-20 sm:w-36 truncate flex-shrink-0 text-right">{label}</span>
      <div className="flex-1 h-5 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-slate-400 text-xs w-6 text-right">{value}</span>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, color }: { title: string; value: string | number; subtitle?: string; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '22' }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider truncate">{title}</p>
        <p className="text-xl sm:text-2xl font-bold text-slate-100 mt-0.5">{value}</p>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

export default function AnalisisPage({ onMenuOpen }: Props) {
  const [data, setData] = useState<AnalisisData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const result = await apiFetch('/dashboard');
        setData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} search="" onSearch={() => {}} showSearch={false} />

      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-700/50">
        <BarChart2 size={18} className="text-slate-400" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200">Panel de Análisis</h2>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1 text-slate-400">Cargando datos...</div>
      ) : !data ? null : (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard title="Total Postulaciones" value={data.totalPostulaciones} icon={<TrendingUp size={20} />} color="#3b82f6" />
            <StatCard title="Requieren Inglés" value={data.conIngles} subtitle={`${data.totalPostulaciones > 0 ? Math.round((data.conIngles / data.totalPostulaciones) * 100) : 0}% del total`} icon={<Globe size={20} />} color="#f59e0b" />
            <StatCard title="Sin Inglés" value={data.sinIngles} icon={<Users size={20} />} color="#22c55e" />
            <StatCard title="Tecnologías Únicas" value={data.tecnologias.length} icon={<Code2 size={20} />} color="#06b6d4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Tecnologías más demandadas */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Tecnologías más Demandadas</h3>
              <div className="space-y-2">
                {data.tecnologias.length === 0 && <p className="text-slate-500 text-xs">Sin datos</p>}
                {data.tecnologias.map(t => (
                  <BarH key={t.id} label={t.nombre} value={t.count} max={data.tecnologias[0]?.count ?? 1} color={t.color_hex} />
                ))}
              </div>
            </div>

            {/* Cargos más solicitados */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Cargos más Solicitados</h3>
              <div className="space-y-2">
                {data.cargos.length === 0 && <p className="text-slate-500 text-xs">Sin datos</p>}
                {data.cargos.map(c => (
                  <BarH key={c.nombre} label={c.nombre} value={c.count} max={data.cargos[0]?.count ?? 1} color="#3b82f6" />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Combos de stacks */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Combinaciones de Stack más Comunes</h3>
              {data.stacks.length === 0 && <p className="text-slate-500 text-xs">Sin datos suficientes</p>}
              <div className="space-y-2.5">
                {data.stacks.map((s, i) => (
                  <div key={s.stack} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-slate-500 text-xs w-4 flex-shrink-0">{i + 1}.</span>
                      <span className="text-slate-200 text-xs font-mono bg-slate-700 px-2 py-0.5 rounded truncate">{s.stack}</span>
                    </div>
                    <span className="text-slate-400 text-xs font-semibold flex-shrink-0 ml-2">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Métodos de evaluación */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Métodos de Evaluación</h3>
              {data.metodos.length === 0 && <p className="text-slate-500 text-xs">Sin datos</p>}
              <div className="space-y-2">
                {data.metodos.map(m => (
                  <BarH key={m.nombre} label={m.nombre} value={m.count} max={data.metodos[0]?.count ?? 1} color={m.color_hex} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Por estado */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Distribución por Estado</h3>
              <div className="flex flex-wrap gap-3">
                {data.porEstado.map(e => (
                  <div key={e.nombre} className="flex items-center gap-2">
                    <Badge label={e.nombre} color={e.color_hex} />
                    <span className="text-slate-300 text-sm font-bold">{e.count}</span>
                  </div>
                ))}
                {data.porEstado.length === 0 && <p className="text-slate-500 text-xs">Sin datos</p>}
              </div>
              <div className="mt-4 space-y-2">
                {data.porEstado.map(e => (
                  <BarH key={e.nombre} label={e.nombre} value={e.count} max={data.porEstado[0]?.count ?? 1} color={e.color_hex} />
                ))}
              </div>
            </div>

            {/* Por modalidad */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Distribución por Modalidad</h3>
              <div className="flex flex-wrap gap-3 mb-4">
                {data.porModalidad.map(m => (
                  <div key={m.nombre} className="flex items-center gap-2">
                    <Badge label={m.nombre} color={m.color_hex} />
                    <span className="text-slate-300 text-sm font-bold">{m.count}</span>
                  </div>
                ))}
                {data.porModalidad.length === 0 && <p className="text-slate-500 text-xs">Sin datos</p>}
              </div>
              <div className="space-y-2">
                {data.porModalidad.map(m => (
                  <BarH key={m.nombre} label={m.nombre} value={m.count} max={data.porModalidad[0]?.count ?? 1} color={m.color_hex} />
                ))}
              </div>
            </div>
          </div>

          {/* Inglés section */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Requisito de Idioma (Inglés)</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-8">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Con Inglés</span>
                  <span className="text-xs text-slate-300 font-bold">{data.conIngles} ({data.totalPostulaciones > 0 ? Math.round((data.conIngles / data.totalPostulaciones) * 100) : 0}%)</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${data.totalPostulaciones > 0 ? (data.conIngles / data.totalPostulaciones) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Sin Inglés</span>
                  <span className="text-xs text-slate-300 font-bold">{data.sinIngles} ({data.totalPostulaciones > 0 ? Math.round((data.sinIngles / data.totalPostulaciones) * 100) : 0}%)</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${data.totalPostulaciones > 0 ? (data.sinIngles / data.totalPostulaciones) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
