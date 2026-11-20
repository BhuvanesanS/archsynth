import type { FC } from 'react';
import type { CustomizationState } from '../types';
import { Palette, Sun, Moon, Sunset, Sparkles, Home, Trees, Layers } from 'lucide-react';

interface CustomizationPanelProps {
  customization: CustomizationState;
  onChange: (updated: Partial<CustomizationState>) => void;
}

export const CustomizationPanel: FC<CustomizationPanelProps> = ({
  customization,
  onChange
}) => {
  const wallColors = [
    { label: 'Alabaster White', hex: '#f8fafc', textClass: 'border-slate-300' },
    { label: 'Modern Charcoal', hex: '#1e293b', textClass: 'border-slate-700' },
    { label: 'Warm Linen', hex: '#f5efe6', textClass: 'border-amber-200' },
    { label: 'Desert Terracotta', hex: '#c2410c', textClass: 'border-orange-500' },
    { label: 'Nordic Sage', hex: '#475569', textClass: 'border-emerald-600' },
    { label: 'Slate Blue', hex: '#0284c7', textClass: 'border-sky-500' }
  ];

  const accentColors = [
    { label: 'Royal Sapphire', hex: '#3b82f6' },
    { label: 'Teak Timber', hex: '#92400e' },
    { label: 'Matte Obsidian', hex: '#0f172a' },
    { label: 'Champagne Gold', hex: '#d97706' },
    { label: 'Forest Pine', hex: '#15803d' }
  ];

  const flooringOptions: Array<{ id: CustomizationState['flooringType']; label: string; desc: string }> = [
    { id: 'marble', label: 'Statuario Marble', desc: 'High-gloss Italian vein marble' },
    { id: 'oak_wood', label: 'Scandinavian Oak', desc: 'Warm natural matte timber' },
    { id: 'dark_walnut', label: 'Dark Walnut', desc: 'Rich luxury hardwood' },
    { id: 'terrazzo', label: 'Polished Terrazzo', desc: 'Architectural mineral fleck' }
  ];

  const roofOptions: Array<{ id: CustomizationState['roofType']; label: string; desc: string }> = [
    { id: 'flat_parapet', label: 'Modern Parapet Slab', desc: 'Flat architectural coping with overhang' },
    { id: 'sloped_shingle', label: 'Sloped Charcoal Shingle', desc: 'Contemporary high-pitch gable' }
  ];

  const landscapeOptions: Array<{ id: CustomizationState['gardenStyle']; label: string; desc: string }> = [
    { id: 'bermuda_lawn', label: 'Bermuda Green Lawn', desc: 'Lush soft manicured grass' },
    { id: 'zen_gravel', label: 'Japanese Zen Gravel', desc: 'Raked river stones & minimalist shrubs' }
  ];

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Palette className="w-4 h-4 text-indigo-400" />
          <span>Real-time Material & Color Studio</span>
        </div>
        <span className="text-[10px] bg-indigo-950/80 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">
          3D LIVE SYNC
        </span>
      </div>

      {/* 1. Exterior Wall Color Palette */}
      <div>
        <label className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-blue-400" />
          <span>Exterior Facade Color</span>
        </label>
        <div className="grid grid-cols-6 gap-2">
          {wallColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => onChange({ wallColorHex: c.hex })}
              title={c.label}
              className={`h-8 rounded-lg border-2 transition-all transform hover:scale-105 relative ${
                customization.wallColorHex === c.hex
                  ? 'border-indigo-400 ring-2 ring-indigo-500/50 shadow-md'
                  : 'border-slate-700/60 opacity-85 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {customization.wallColorHex === c.hex && (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-indigo-900 font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Facade Accent Color */}
      <div>
        <label className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Architectural Accent Trim</span>
        </label>
        <div className="grid grid-cols-5 gap-2">
          {accentColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => onChange({ accentColorHex: c.hex })}
              title={c.label}
              className={`h-7 rounded-lg border-2 transition-all transform hover:scale-105 relative ${
                customization.accentColorHex === c.hex
                  ? 'border-indigo-400 ring-2 ring-indigo-500/50'
                  : 'border-slate-700 opacity-80 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.hex }}
            >
              {customization.accentColorHex === c.hex && (
                <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interior Flooring Finish */}
      <div>
        <label className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interior Floor Finish</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {flooringOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => onChange({ flooringType: f.id })}
              className={`p-2 rounded-lg border text-left transition-all ${
                customization.flooringType === f.id
                  ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-sm'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold text-xs text-slate-200">{f.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{f.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Roof Architecture */}
      <div>
        <label className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
          <Home className="w-3.5 h-3.5 text-purple-400" />
          <span>Roof Architecture Style</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {roofOptions.map((r) => (
            <button
              key={r.id}
              onClick={() => onChange({ roofType: r.id })}
              className={`p-2 rounded-lg border text-left transition-all ${
                customization.roofType === r.id
                  ? 'bg-purple-950/60 border-purple-500 text-white'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold text-xs text-slate-200">{r.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{r.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Landscape & Garden Style */}
      <div>
        <label className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
          <Trees className="w-3.5 h-3.5 text-emerald-400" />
          <span>Frontage Landscape & Garden</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {landscapeOptions.map((l) => (
            <button
              key={l.id}
              onClick={() => onChange({ gardenStyle: l.id })}
              className={`p-2 rounded-lg border text-left transition-all ${
                customization.gardenStyle === l.id
                  ? 'bg-emerald-950/60 border-emerald-500 text-white'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold text-xs text-slate-200">{l.label}</div>
              <div className="text-[10px] text-slate-400 truncate">{l.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 6. Lighting & Ambiance */}
      <div>
        <label className="text-slate-300 font-semibold mb-2 flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-yellow-400" />
          <span>Lighting & Solar Ambiance</span>
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'daylight', label: 'Daylight', icon: Sun, color: 'text-yellow-400' },
            { id: 'sunset', label: 'Sunset', icon: Sunset, color: 'text-orange-400' },
            { id: 'night_glow', label: 'Night Glow', icon: Moon, color: 'text-indigo-400' }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = customization.lightingAmbiance === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => onChange({ lightingAmbiance: mode.id as CustomizationState['lightingAmbiance'] })}
                className={`py-2 px-2.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md'
                    : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${mode.color}`} />
                <span className="text-[11px]">{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
