import { Menu } from 'lucide-react';

interface Props {
  onMenuOpen: () => void;
}

export default function AreasPage({ onMenuOpen }: Props) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
      <header className="flex items-center gap-4 px-6 py-4 bg-slate-900 border-b border-slate-800">
        <button onClick={onMenuOpen} className="text-slate-400 hover:text-slate-200 transition-colors">
          <Menu size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-100">Áreas</h1>
      </header>

      <main className="flex-1 overflow-auto p-6 flex flex-col items-center justify-center">
        <div className="max-w-3xl w-full text-center">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-10 shadow-lg text-left">
            <h2 className="text-2xl font-bold text-slate-200 mb-4 text-center">Sección de "Áreas" en construcción</h2>
            <p className="text-slate-400 mb-4">
              En resumen se debe analizar como crear la tabla ,ya que podria influir como clave foraneas a tablas como "Cargos" o "Tecnologias". Deberiamos definir si los "select" al momento de agregar o editar son influidos por esta nueva tabla
            </p>
            <p className="text-slate-400 mb-4">
              Pero esto se definira luego ,de momento dejo esta nota
            </p>
            <p className="text-slate-400">
              Ejemplos de areas: informatica, cocina, cajero , conserje
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
