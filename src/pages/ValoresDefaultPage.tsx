import Header from '../components/layout/Header';

interface Props {
  onMenuOpen: () => void;
}

export default function ValoresDefaultPage({ onMenuOpen }: Props) {
  return (
    <div className="flex flex-col h-full">
      <Header onMenuOpen={onMenuOpen} />
      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-xl font-bold mb-4">Valores Default</h1>
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6">
          <p className="text-slate-300">aqui va la funcionalidad valores default</p>
        </div>
      </div>
    </div>
  );
}
