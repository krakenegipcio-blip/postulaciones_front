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
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-10 shadow-lg text-left">
            <h2 className="text-2xl font-bold text-slate-200 mb-4 text-center">Preguntas Frecuentes</h2>
            <p className="text-slate-400 mb-4">
              En esta pantalla se colocan las preguntas frecuentes, por ejemplo si se pregunto de principios SOLID, de inyeccion de dependencias etc
            </p>
            <p className="text-slate-400">
              La complejidad viene que en las fases de una postulaciones se debe agregar a futuro una pestaña "agregar/editar/eliminar/ver preguntas frecuentes , donde se abrira otro modal donde se agregaran las preguntas frecuentes en la entrevista ,para agregarlas o sea grega una nueva con su respuesta o se selecciona una ya existente... se puede agregar o editar una pregunta frecuente desde las fases o desde la vista de preguntas frecuentes comodidad maxima
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
