import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastItem {
  id: number;
  message: string;
}

let toastId = 0;
const listeners: Array<(t: ToastItem) => void> = [];

export function showToast(message: string) {
  const item: ToastItem = { id: ++toastId, message };
  listeners.forEach(fn => fn(item));
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const handler = (t: ToastItem) => {
      setToasts(prev => [...prev, t]);
      setTimeout(() => {
        setToasts(prev => prev.filter(x => x.id !== t.id));
      }, 3500);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
      {toasts.map(t => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 bg-emerald-600/90 backdrop-blur-sm text-white text-sm font-medium rounded-xl shadow-lg shadow-emerald-900/30 animate-slide-in-right border border-emerald-500/30"
        >
          <CheckCircle size={18} className="flex-shrink-0" />
          <span>{t.message}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            className="ml-2 p-0.5 hover:bg-emerald-500/50 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
