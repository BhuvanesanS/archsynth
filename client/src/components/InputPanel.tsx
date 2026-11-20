import { useState, type FC, type ChangeEvent } from 'react';
import type { FacingDirection } from '../types';
import { Sliders, Compass, Sparkles, Upload, RefreshCw, Home, CheckCircle2 } from 'lucide-react';

interface InputPanelProps {
  plotWidth: number;
  plotDepth: number;
  facing: FacingDirection;
  floors: number;
  bhk: number;
  style: string;
  vastuEnabled: boolean;
  poolEnabled: boolean;
  onUpdateParams: (params: {
    plotWidth?: number;
    plotDepth?: number;
    facing?: FacingDirection;
    floors?: number;
    bhk?: number;
    style?: string;
    vastuEnabled?: boolean;
    poolEnabled?: boolean;
  }) => void;
  onRegenerate: () => void;
}

export const InputPanel: FC<InputPanelProps> = ({
  plotWidth,
  plotDepth,
  facing,
  floors,
  bhk,
  style,
  vastuEnabled,
  poolEnabled,
  onUpdateParams,
  onRegenerate
}) => {
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string | null>(null);

  const facingOptions: Array<{ id: FacingDirection; label: string; icon: string }> = [
    { id: 'NORTH', label: 'North', icon: '🧭 N' },
    { id: 'EAST', label: 'East', icon: '🌅 E' },
    { id: 'SOUTH', label: 'South', icon: '☀️ S' },
    { id: 'WEST', label: 'West', icon: '🌇 W' },
    { id: 'NORTH_EAST', label: 'North-East', icon: '✨ NE' },
    { id: 'SOUTH_EAST', label: 'South-East', icon: '🔥 SE' },
    { id: 'SOUTH_WEST', label: 'South-West', icon: '⛰️ SW' },
    { id: 'NORTH_WEST', label: 'North-West', icon: '💨 NW' }
  ];

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedPhotoName(file.name);
    }
  };

  const totalPlotArea = plotWidth * plotDepth;
  const totalPlotSqM = Math.round(totalPlotArea * 0.092903);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-4 flex flex-col gap-4 text-xs">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <span>Plot Parameters & Architecture Brief</span>
        </div>
        <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded font-mono">
          AI GENERATIVE
        </span>
      </div>

      {/* 1. Plot Dimensions */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5 text-blue-400" />
            <span>Plot Dimensions (Feet)</span>
          </label>
          <span className="font-mono text-cyan-400 text-xs font-bold">
            {totalPlotArea} sq.ft ({totalPlotSqM} m²)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Width (Frontage)</span>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={20}
                max={150}
                value={plotWidth}
                onChange={(e) => onUpdateParams({ plotWidth: Number(e.target.value) || 20 })}
                className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
              />
              <span className="text-slate-500 font-mono text-[10px]">FT</span>
            </div>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block mb-0.5">Depth (Length)</span>
            <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5">
              <input
                type="number"
                min={25}
                max={200}
                value={plotDepth}
                onChange={(e) => onUpdateParams({ plotDepth: Number(e.target.value) || 25 })}
                className="w-full bg-transparent text-white font-mono text-xs focus:outline-none"
              />
              <span className="text-slate-500 font-mono text-[10px]">FT</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Road Facing Direction */}
      <div>
        <label className="text-slate-300 font-semibold mb-1.5 flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-emerald-400" />
          <span>Road Facing Direction</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {facingOptions.map((f) => (
            <button
              key={f.id}
              onClick={() => onUpdateParams({ facing: f.id })}
              className={`p-1.5 rounded-lg border text-center transition-all ${
                facing === f.id
                  ? 'bg-cyan-600 border-cyan-400 text-white font-bold shadow-md shadow-cyan-900/40'
                  : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="text-[10px]">{f.icon}</div>
              <div className="text-[9px] truncate">{f.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Floors & Bedrooms */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-slate-300 font-semibold mb-1 block">Floors</label>
          <div className="grid grid-cols-2 gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => onUpdateParams({ floors: 1 })}
              className={`py-1 rounded font-semibold text-xs ${
                floors === 1 ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Ground (1)
            </button>
            <button
              onClick={() => onUpdateParams({ floors: 2 })}
              className={`py-1 rounded font-semibold text-xs ${
                floors === 2 ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              Duplex (G+1)
            </button>
          </div>
        </div>

        <div>
          <label className="text-slate-300 font-semibold mb-1 block">Configuration</label>
          <div className="grid grid-cols-3 gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            {[2, 3, 4].map((b) => (
              <button
                key={b}
                onClick={() => onUpdateParams({ bhk: b })}
                className={`py-1 rounded font-semibold text-xs ${
                  bhk === b ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
              >
                {b} BHK
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Architectural Style */}
      <div>
        <label className="text-slate-300 font-semibold mb-1 block">Design Style</label>
        <div className="grid grid-cols-3 gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px]">
          {[
            { id: 'contemporary', label: 'Contemporary' },
            { id: 'scandinavian', label: 'Scandinavian' },
            { id: 'modern_villa', label: 'Modern Villa' }
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => onUpdateParams({ style: s.id })}
              className={`py-1 rounded font-medium truncate ${
                style === s.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Optional Vastu Mode Switch */}
      <div className="p-3 rounded-xl border border-slate-700 bg-slate-950/60 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className={`w-4 h-4 ${vastuEnabled ? 'text-amber-400' : 'text-slate-500'}`} />
            <div>
              <div className="font-bold text-xs text-white">
                Vastu Shastra Compliance
              </div>
              <div className="text-[10px] text-slate-400">
                {vastuEnabled ? 'Classical Indian 16-Zone Matrix Active' : 'Off (International Modern Architecture)'}
              </div>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => onUpdateParams({ vastuEnabled: !vastuEnabled })}
            className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
              vastuEnabled ? 'bg-amber-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-transform ${
                vastuEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="text-[10px] text-slate-400 italic">
          {vastuEnabled
            ? '✓ Places Kitchen in Agni (SE), Master in Nairitya (SW), Pooja in Ishanya (NE).'
            : '✓ Prioritizes passive solar daylighting, cross-ventilation, and open-plan garden flow.'}
        </div>
      </div>

      {/* 5. Outdoor Swimming Pool Feature */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
        <div>
          <span className="font-semibold text-white">Infinity Reflection Pool</span>
          <span className="text-[10px] text-slate-400 block">Adds landscaped pool & deck in rear yard</span>
        </div>
        <button
          onClick={() => onUpdateParams({ poolEnabled: !poolEnabled })}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
            poolEnabled ? 'bg-cyan-500' : 'bg-slate-700'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform ${
              poolEnabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* 6. Site Photo / Sketch Upload */}
      <div>
        <label className="text-slate-300 font-semibold mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Site Photo / Boundary Sketch</span>
          </span>
          <span className="text-[10px] text-slate-500">Optional</span>
        </label>

        <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg p-2.5 flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40">
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          {uploadedPhotoName ? (
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{uploadedPhotoName}</span>
            </div>
          ) : (
            <>
              <Upload className="w-4 h-4 text-slate-500 mb-1" />
              <span className="text-[10px] text-slate-400">Upload ground photo or drone shot</span>
              <span className="text-[9px] text-slate-500">AI automatically segments parcel boundary</span>
            </>
          )}
        </label>
      </div>

      {/* Regenerate Action Button */}
      <button
        onClick={onRegenerate}
        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/30"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Generate Architectural Layout</span>
      </button>
    </div>
  );
};
