import type { FC } from 'react';
import type { PlanData } from '../types';
import { Compass, Sparkles, Layers } from 'lucide-react';

interface Blueprint2DProps {
  plan: PlanData;
}

export const Blueprint2D: FC<Blueprint2DProps> = ({ plan }) => {
  const { plot, building, rooms, landscape, meta, vastuReport } = plan;

  // Viewbox calculation (scale plot dimensions to fit nicely in 800x800 SVG canvas)
  const margin = 50;
  const svgWidth = 800;
  const svgHeight = 800;
  const maxPlotDim = Math.max(plot.widthFt, plot.depthFt);
  const scale = (svgWidth - 2 * margin) / maxPlotDim;

  const toSvgX = (ftX: number) => margin + ftX * scale;
  const toSvgY = (ftY: number) => margin + (plot.depthFt - ftY) * scale; // invert Y for CAD coordinate system

  return (
    <div className="relative w-full h-full min-h-[520px] bg-slate-950 blueprint-grid border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
      {/* Blueprint Header Pill */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300">
        <Layers className="w-3.5 h-3.5 text-blue-400" />
        <span className="font-semibold text-white">2D Architectural CAD Blueprint</span>
        <span className="text-slate-500">•</span>
        <span className="font-mono text-cyan-400">{plot.widthFt}' × {plot.depthFt}' ({plot.totalAreaSqFt} sq.ft)</span>
      </div>

      {/* Vastu / Modern Indicator Badge */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
        {meta.vastuEnabled ? (
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vastu Shastra: </span>
            <span className="bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800 text-amber-300 font-bold">
              {vastuReport?.vastuScore || 94}/100
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Passive Solar Core: </span>
            <span className="bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800 text-emerald-300 font-bold">
              Optimal Daylighting
            </span>
          </div>
        )}
      </div>

      {/* SVG Canvas */}
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full max-h-[680px] drop-shadow-2xl"
      >
        <defs>
          {/* Garden Grass Pattern */}
          <pattern id="grassPattern" width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="12" height="12" fill="#064e3b" opacity="0.4" />
            <path d="M2,10 L4,3 M6,11 L8,4 M10,9 L11,2" stroke="#10b981" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          </pattern>

          {/* Driveway Paver Pattern */}
          <pattern id="paverPattern" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect width="16" height="16" fill="#1e293b" opacity="0.8" />
            <path d="M0,8 L16,8 M8,0 L8,16" stroke="#475569" strokeWidth="1" opacity="0.4" />
          </pattern>

          {/* Room Hatch Pattern */}
          <pattern id="roomHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#3b82f6" strokeWidth="0.5" opacity="0.12" />
          </pattern>
        </defs>

        {/* 1. Outer Plot Boundary */}
        <rect
          x={margin}
          y={margin}
          width={plot.widthFt * scale}
          height={plot.depthFt * scale}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="2.5"
          strokeDasharray="6,4"
        />

        {/* 2. Front Garden Lawn */}
        <rect
          x={toSvgX(landscape.gardenLawn.x)}
          y={toSvgY(landscape.gardenLawn.y + landscape.gardenLawn.depth)}
          width={landscape.gardenLawn.width * scale}
          height={landscape.gardenLawn.depth * scale}
          fill="url(#grassPattern)"
          stroke="#10b981"
          strokeWidth="1.5"
        />
        <text
          x={toSvgX(landscape.gardenLawn.x + landscape.gardenLawn.width / 2)}
          y={toSvgY(landscape.gardenLawn.y + landscape.gardenLawn.depth / 2)}
          fill="#34d399"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          🌿 Landscaped Garden Lawn
        </text>

        {/* 3. Driveway & Parking */}
        <rect
          x={toSvgX(landscape.driveway.x)}
          y={toSvgY(landscape.driveway.y + landscape.driveway.depth)}
          width={landscape.driveway.width * scale}
          height={landscape.driveway.depth * scale}
          fill="url(#paverPattern)"
          stroke="#64748b"
          strokeWidth="1.5"
        />
        <text
          x={toSvgX(landscape.driveway.x + landscape.driveway.width / 2)}
          y={toSvgY(landscape.driveway.y + landscape.driveway.depth / 2)}
          fill="#cbd5e1"
          fontSize="11"
          fontWeight="bold"
          textAnchor="middle"
          dominantBaseline="central"
        >
          🚗 Paver Driveway & Car Porch
        </text>

        {/* 4. Rear Patio */}
        <rect
          x={toSvgX(landscape.rearPatio.x)}
          y={toSvgY(landscape.rearPatio.y + landscape.rearPatio.depth)}
          width={landscape.rearPatio.width * scale}
          height={landscape.rearPatio.depth * scale}
          fill="#1e1b4b"
          opacity="0.5"
          stroke="#6366f1"
          strokeWidth="1"
          strokeDasharray="3,3"
        />
        <text
          x={toSvgX(landscape.rearPatio.x + landscape.rearPatio.width / 2)}
          y={toSvgY(landscape.rearPatio.y + landscape.rearPatio.depth / 2)}
          fill="#a5b4fc"
          fontSize="10"
          textAnchor="middle"
          dominantBaseline="central"
        >
          Rear Yard & Patio Deck
        </text>

        {/* 5. Building Footprint Plinth */}
        <rect
          x={toSvgX(plot.setbacks.left)}
          y={toSvgY(plot.setbacks.rear + building.depthFt)}
          width={building.widthFt * scale}
          height={building.depthFt * scale}
          fill="#0f172a"
          stroke="#f8fafc"
          strokeWidth="3"
        />

        {/* 6. Rooms Layout */}
        {rooms.map((room) => {
          const rx = toSvgX(room.x);
          const ry = toSvgY(room.y + room.depth);
          const rw = room.width * scale;
          const rh = room.depth * scale;

          return (
            <g key={room.id} className="cursor-pointer group">
              {/* Room Body */}
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill={room.color}
                fillOpacity="0.16"
                stroke="#38bdf8"
                strokeWidth="1.8"
                className="transition-all duration-200 group-hover:fill-opacity-30"
              />

              {/* Room Hatch Pattern */}
              <rect
                x={rx}
                y={ry}
                width={rw}
                height={rh}
                fill="url(#roomHatch)"
                pointerEvents="none"
              />

              {/* Door swing arc simulation */}
              <path
                d={`M ${rx + 15} ${ry + rh} A 12 12 0 0 0 ${rx + 27} ${ry + rh - 12}`}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
              <line x1={rx + 15} y1={ry + rh} x2={rx + 15} y2={ry + rh - 12} stroke="#f59e0b" strokeWidth="1.5" />

              {/* Room Labels */}
              <text
                x={rx + rw / 2}
                y={ry + rh / 2 - 8}
                fill="#ffffff"
                fontSize="11"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {room.name}
              </text>

              <text
                x={rx + rw / 2}
                y={ry + rh / 2 + 8}
                fill="#94a3b8"
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {room.width}' × {room.depth}' ({room.areaSqFt} sq.ft)
              </text>

              {/* Vastu Zone Marker if enabled */}
              {meta.vastuEnabled && (
                <text
                  x={rx + rw / 2}
                  y={ry + rh / 2 + 20}
                  fill="#facc15"
                  fontSize="8"
                  fontWeight="600"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  [{room.zone}]
                </text>
              )}
            </g>
          );
        })}

        {/* 7. North Arrow & Compass Rose */}
        <g transform={`translate(${svgWidth - 65}, 65)`}>
          <circle cx="0" cy="0" r="22" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
          <polygon points="0,-18 5,0 0,-4 -5,0" fill="#ef4444" />
          <polygon points="0,18 5,0 0,4 -5,0" fill="#64748b" />
          <text x="0" y="-8" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">N</text>
          <text x="0" y="14" fill="#94a3b8" fontSize="8" textAnchor="middle">S</text>
          <text x="14" y="3" fill="#94a3b8" fontSize="8" textAnchor="middle">E</text>
          <text x="-14" y="3" fill="#94a3b8" fontSize="8" textAnchor="middle">W</text>
        </g>

        {/* 8. Dimension Callouts */}
        {/* Width Dimension */}
        <line
          x1={margin}
          y1={margin - 16}
          x2={margin + plot.widthFt * scale}
          y2={margin - 16}
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <text
          x={margin + (plot.widthFt * scale) / 2}
          y={margin - 22}
          fill="#38bdf8"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
        >
          {plot.widthFt}'-0" (WIDTH)
        </text>

        {/* Depth Dimension */}
        <line
          x1={margin - 16}
          y1={margin}
          x2={margin - 16}
          y2={margin + plot.depthFt * scale}
          stroke="#38bdf8"
          strokeWidth="1.5"
        />
        <text
          x={margin - 22}
          y={margin + (plot.depthFt * scale) / 2}
          fill="#38bdf8"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
          transform={`rotate(-90, ${margin - 22}, ${margin + (plot.depthFt * scale) / 2})`}
        >
          {plot.depthFt}'-0" (DEPTH)
        </text>

        {/* 9. Title Block */}
        <g transform={`translate(${margin}, ${svgHeight - 34})`}>
          <rect width={plot.widthFt * scale} height="24" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="10" y="16" fill="#94a3b8" fontSize="9" fontFamily="monospace">
            PLAN REF: <tspan fill="#ffffff" fontWeight="bold">{meta.planId}</tspan> | BUILT-UP: <tspan fill="#38bdf8" fontWeight="bold">{building.totalBuiltUpAreaSqFt} SQ.FT</tspan> | SCALE: 1:100 ARCHITECTURAL
          </text>
        </g>
      </svg>
    </div>
  );
};
