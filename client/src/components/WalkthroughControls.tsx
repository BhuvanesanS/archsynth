import { useEffect, type FC } from 'react';
import { Play, Pause, SkipForward, SkipBack, Video, Sparkles } from 'lucide-react';
import type { Waypoint } from '../types';

interface WalkthroughControlsProps {
  waypoints: Waypoint[];
  activeIndex: number;
  isPlaying: boolean;
  onPlayToggle: () => void;
  onSelectWaypoint: (index: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onExportBlender: () => void;
}

export const WalkthroughControls: FC<WalkthroughControlsProps> = ({
  waypoints,
  activeIndex,
  isPlaying,
  onPlayToggle,
  onSelectWaypoint,
  speed,
  onSpeedChange,
  onExportBlender
}) => {
  // Automated timer to advance waypoints when playing
  useEffect(() => {
    if (!isPlaying) return;

    const currentWp = waypoints[activeIndex] || waypoints[0];
    const duration = (currentWp.durationMs || 4000) / speed;

    const timer = setTimeout(() => {
      const nextIndex = (activeIndex + 1) % waypoints.length;
      onSelectWaypoint(nextIndex);
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, activeIndex, waypoints, speed, onSelectWaypoint]);

  const currentWp = waypoints[activeIndex] || waypoints[0];

  return (
    <div className="w-full bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col gap-3">
      {/* Top Bar: Active Station Info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Video className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <span>Cinematic Architectural Flythrough Tour</span>
              {isPlaying && (
                <span className="flex items-center gap-1 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.2 rounded font-mono border border-red-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  LIVE PREVIEW
                </span>
              )}
            </div>
            <div className="text-sm font-bold text-white tracking-tight">
              {currentWp.title}
            </div>
          </div>
        </div>

        {/* Speed Controls & Blender Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
            {[0.5, 1, 2].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 rounded transition-colors ${
                  speed === s
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={onExportBlender}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-orange-950/40 transition-all border border-amber-400/30"
            title="Download executable Blender Python (bpy) automation script"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Blender Script (.py)</span>
          </button>
        </div>
      </div>

      {/* Narrative commentary ticker */}
      <div className="text-xs text-slate-400 italic bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800/80 flex items-center gap-2">
        <span className="text-indigo-400 font-mono font-bold">Cam Station [{activeIndex + 1}/{waypoints.length}]:</span>
        <span className="truncate">{currentWp.description}</span>
      </div>

      {/* Timeline Stations Scrubber & Playback Buttons */}
      <div className="flex items-center gap-3">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onSelectWaypoint((activeIndex - 1 + waypoints.length) % waypoints.length)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Previous Station"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayToggle}
            className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Play Tour</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelectWaypoint((activeIndex + 1) % waypoints.length)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
            title="Next Station"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Station Dots / Scrubber */}
        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {waypoints.map((wp, idx) => (
            <button
              key={idx}
              onClick={() => onSelectWaypoint(idx)}
              className={`h-2.5 rounded-full transition-all relative group ${
                idx === activeIndex
                  ? 'bg-indigo-500 shadow-md shadow-indigo-500/50 ring-2 ring-indigo-400/50'
                  : idx < activeIndex
                  ? 'bg-slate-600 hover:bg-slate-500'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 border border-slate-700 text-[10px] text-slate-200 px-2 py-0.5 rounded whitespace-nowrap z-20 pointer-events-none">
                {wp.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
