import { Menu } from 'lucide-react';

interface Props {
  onMenuOpen: () => void;
}

export default function DuracionPage({ onMenuOpen }: Props) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
      <header className="flex items-center gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800">
        <button onClick={onMenuOpen} className="text-slate-400 hover:text-slate-200 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-100">Duración</h1>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-10 shadow-lg text-left">
            <h2 className="text-2xl font-bold text-slate-200 mb-4 text-center">Sección de "Duración" en construcción</h2>
            <p className="text-slate-400 mb-4">
              Valores iniciales: Permanente, Proyecto, Esporádico / Por día.
            </p>
            <p className="text-slate-400">
              Requiere un mantenedor para que se puedan agregar o modificar estos valores en el futuro.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
