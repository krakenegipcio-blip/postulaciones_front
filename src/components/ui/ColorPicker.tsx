import { useState } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
}

const PRESETS = [
  '#ef4444','#f97316','#f59e0b','#eab308','#84cc16','#22c55e',
  '#10b981','#14b8a6','#06b6d4','#3b82f6','#6366f1','#8b5cf6',
  '#ec4899','#f43f5e','#64748b','#6b7280','#334155','#1e293b',
];

export default function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [inputVal, setInputVal] = useState(value);

  const handleInput = (v: string) => {
    setInputVal(v);
    if (/^#[0-9a-fA-F]{6}$/.test(v)) onChange(v);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-xs text-slate-400 uppercase tracking-wider">{label}</label>}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={e => handleInput(e.target.value)}
          className="bg-slate-700 border border-slate-600 text-slate-100 text-sm rounded px-2 py-1 w-28 focus:outline-none focus:border-blue-500"
          placeholder="#000000"
          maxLength={7}
        />
        <div
          className="w-8 h-8 rounded border border-slate-600 cursor-pointer flex-shrink-0"
          style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(inputVal) ? inputVal : '#6b7280' }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map(c => (
          <button
            key={c}
            type="button"
            onClick={() => { setInputVal(c); onChange(c); }}
            className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
            style={{
              backgroundColor: c,
              borderColor: value === c ? '#f9fafb' : 'transparent',
            }}
          />
        ))}
      </div>
    </div>
  );
}
