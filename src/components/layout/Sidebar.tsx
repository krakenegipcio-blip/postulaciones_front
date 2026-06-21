import { X, BarChart2, Briefcase, Building2, Tag, MapPin, Monitor, Users, Layers, Cpu, CheckSquare, Award, LogOut } from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

export type Page =
  | 'postulaciones'
  | 'analisis'
  | 'tecnologias'
  | 'metodos'
  | 'empresas'
  | 'cargos'
  | 'plataformas'
  | 'modalidades'
  | 'ubicaciones'
  | 'estados'
  | 'niveles';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  current: Page;
  onNavigate: (p: Page) => void;
}

const NAV = [
  { section: 'Principal', items: [
    { id: 'postulaciones' as Page, label: 'Postulaciones', icon: Briefcase },
    { id: 'analisis' as Page, label: 'Analisis', icon: BarChart2 },
  ]},
  { section: 'Configuraciones', items: [
    { id: 'tecnologias' as Page, label: 'Tecnologías', icon: Cpu },
    { id: 'metodos' as Page, label: 'Metodos Evaluaciones', icon: CheckSquare },
    { id: 'empresas' as Page, label: 'Empresas', icon: Building2 },
    { id: 'cargos' as Page, label: 'Cargos', icon: Users },
    { id: 'plataformas' as Page, label: 'Plataformas', icon: Layers },
    { id: 'modalidades' as Page, label: 'Modalidad', icon: Monitor },
    { id: 'ubicaciones' as Page, label: 'Ubicaciones', icon: MapPin },
    { id: 'estados' as Page, label: 'Estados', icon: Tag },
    { id: 'niveles' as Page, label: 'Niveles', icon: Award },
  ]},
];

export default function Sidebar({ open, onClose, current, onNavigate }: SidebarProps) {
  const { user, logout } = useAuthStore();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 z-40 h-full w-72 bg-slate-900 border-r border-slate-700/50 flex flex-col transition-transform duration-300 ease-in-out shadow-2xl ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <span className="text-slate-200 font-medium text-sm truncate max-w-[200px]" title={user?.email}>
              Hola, {user?.email || 'Usuario'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold px-2 mb-2">{section}</p>
              <ul className="space-y-0.5">
                {items.map(({ id, label, icon: Icon }) => (
                  <li key={id}>
                    <button
                      onClick={() => { onNavigate(id); onClose(); }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                        current === id
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button 
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-150"
            onClick={async () => {
              try {
                await apiFetch('/auth/logout', { method: 'POST' });
              } catch (e) {
                // Ignore failure if already logged out from server
              }
              logout();
            }}
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
