import { Menu } from 'lucide-react';

interface Props {
  onMenuOpen: () => void;
}

export default function PreguntasFrecuentesPage({ onMenuOpen }: Props) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
      <header className="flex items-center gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800">
        <button onClick={onMenuOpen} className="text-slate-400 hover:text-slate-200 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-100">Preguntas Frecuentes</h1>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        <div className="max-w-2xl w-full text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-10 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-200 mb-4">Preguntas Frecuentes en desarrollo</h2>
            <p className="text-slate-400">Esta sección se encuentra actualmente en construcción y estará disponible próximamente.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
