import type { FC } from 'react';
import { Box, Sparkles, FileText, ArrowLeft } from 'lucide-react';
import type { PlanData } from '../types';

interface HeaderProps {
  plan: PlanData;
  currency: 'USD' | 'INR' | 'EUR';
  onCurrencyChange: (c: 'USD' | 'INR' | 'EUR') => void;
  onSelectPreset: (presetId: string) => void;
  onOpenCheckout: () => void;
  onDownloadPdf: () => void;
  onDownloadBlender: () => void;
  onBackToHome: () => void;
}

export const Header: FC<HeaderProps> = ({
  plan,
  currency,
  onCurrencyChange,
  onSelectPreset,
  onOpenCheckout,
  onDownloadPdf,
  onDownloadBlender,
  onBackToHome
}) => {
  return (
    <header className="w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2.5 sm:py-3 sticky top-0 z-40 flex items-center justify-between gap-3">
      {/* Brand Identity & Back to Home */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition"
          title="Return to Company Overview & Features"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Overview</span>
        </button>

        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/40 border border-indigo-400/30">
          <Box className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
              ArchSynth <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">3D</span>
            </h1>
            <span className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-mono">
              {plan.meta.planId}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 hidden lg:block">
            AI Architecture, Real-Time 3D Color Customizer & Walkthrough Video
          </p>
        </div>
      </div>

      {/* Middle: Presets Dropdown */}
      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs text-slate-400 font-medium">Load Preset:</span>
        <select
          onChange={(e) => onSelectPreset(e.target.value)}
          defaultValue=""
          className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-medium"
        >
          <option value="" disabled>Select architectural archetype...</option>
          <option value="modern_40x60">40×60 Modern Villa (North Facing • Pool)</option>
          <option value="vastu_30x40">30×40 Vastu House (East Facing • 100% Vastu)</option>
          <option value="compact_25x50">25×50 Scandinavian Townhouse (West Facing)</option>
        </select>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Currency Switcher */}
        <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
          <button
            onClick={() => onCurrencyChange('USD')}
            className={`px-2 py-1 rounded transition ${currency === 'USD' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            USD ($)
          </button>
          <button
            onClick={() => onCurrencyChange('INR')}
            className={`px-2 py-1 rounded transition ${currency === 'INR' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            INR (₹)
          </button>
          <button
            onClick={() => onCurrencyChange('EUR')}
            className={`px-2 py-1 rounded transition ${currency === 'EUR' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            EUR (€)
          </button>
        </div>

        {/* Quick Actions */}
        <button
          onClick={onDownloadPdf}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          title="Download PDF Blueprint"
        >
          <FileText className="w-3.5 h-3.5 text-blue-400" />
          <span>Blueprint PDF</span>
        </button>

        <button
          onClick={onDownloadBlender}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
          title="Download Blender Python (.py) Script"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Blender .py</span>
        </button>

        {/* Primary Checkout Button */}
        <button
          onClick={onOpenCheckout}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-indigo-950/60 border border-indigo-400/30 transition transform hover:scale-[1.02]"
        >
          <span>Unlock Builder Pack</span>
          <span className="bg-white/20 px-1.5 py-0.2 rounded text-[10px] font-mono">
            {currency === 'USD' ? '$49' : currency === 'INR' ? '₹2,499' : '€45'}
          </span>
        </button>
      </div>
    </header>
  );
};
