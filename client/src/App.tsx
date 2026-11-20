import { useState } from 'react';
import type { PlanData, CustomizationState, FacingDirection } from './types';
import { generateLocalPlan } from './utils/planGeneratorLocal';
import { generateConstructionPdf } from './utils/pdfGenerator';
import { LandingPage } from './components/LandingPage';
import { Header } from './components/Header';
import { InputPanel } from './components/InputPanel';
import { ThreeCanvas } from './components/ThreeCanvas';
import { Blueprint2D } from './components/Blueprint2D';
import { CustomizationPanel } from './components/CustomizationPanel';
import { WalkthroughControls } from './components/WalkthroughControls';
import { CheckoutModal } from './components/CheckoutModal';
import { Box, Layers, Video, Sparkles, Compass, Sliders, Palette, FileText } from 'lucide-react';

export function App() {
  // Global View Navigation: 'landing' (Company Overview & Marketing) vs 'studio' (3D CAD Studio)
  const [viewMode, setViewMode] = useState<'landing' | 'studio'>('landing');

  // Mobile Studio Navigation Tab ('viewport' | 'inputs' | 'customizer' | 'summary')
  const [mobileStudioTab, setMobileStudioTab] = useState<'viewport' | 'inputs' | 'customizer' | 'summary'>('viewport');

  // Plot & Design Parameters State
  const [plotWidth, setPlotWidth] = useState(35);
  const [plotDepth, setPlotDepth] = useState(55);
  const [facing, setFacing] = useState<FacingDirection>('EAST');
  const [floors, setFloors] = useState(1);
  const [bhk, setBhk] = useState(3);
  const [style, setStyle] = useState('contemporary');
  const [vastuEnabled, setVastuEnabled] = useState(false);
  const [poolEnabled, setPoolEnabled] = useState(false);

  // Active Plan Data
  const [plan, setPlan] = useState<PlanData>(() =>
    generateLocalPlan({
      plotWidth: 35,
      plotDepth: 55,
      facing: 'EAST',
      floors: 1,
      bhk: 3,
      style: 'contemporary',
      vastuEnabled: false,
      outdoor: { gardenLawn: true, carPorch: true, pool: false, patio: true }
    })
  );

  // Material & Color Customization State
  const [customization, setCustomization] = useState<CustomizationState>({
    wallColorHex: '#f8fafc',
    wallTexture: 'smooth_stucco',
    accentColorHex: '#3b82f6',
    flooringType: 'marble',
    roofType: 'flat_parapet',
    gardenStyle: 'bermuda_lawn',
    lightingAmbiance: 'daylight'
  });

  // UI Viewport Tabs
  const [activeTab, setActiveTab] = useState<'3d' | '2d' | 'walkthrough' | 'audit'>('3d');

  // Walkthrough State
  const [activeWaypointIndex, setActiveWaypointIndex] = useState(0);
  const [isPlayingWalkthrough, setIsPlayingWalkthrough] = useState(false);
  const [walkthroughSpeed, setWalkthroughSpeed] = useState(1);

  // Commercial Checkout State
  const [currency, setCurrency] = useState<'USD' | 'INR' | 'EUR'>('USD');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Re-generate plan on parameter changes
  const handleRegenerate = () => {
    const updated = generateLocalPlan({
      plotWidth,
      plotDepth,
      facing,
      floors,
      bhk,
      style,
      vastuEnabled,
      outdoor: { gardenLawn: true, carPorch: true, pool: poolEnabled, patio: true }
    });
    setPlan(updated);
    setActiveWaypointIndex(0);
    // On mobile, jump back to viewport to see results immediately
    setMobileStudioTab('viewport');
  };

  const handleUpdateParams = (params: {
    plotWidth?: number;
    plotDepth?: number;
    facing?: FacingDirection;
    floors?: number;
    bhk?: number;
    style?: string;
    vastuEnabled?: boolean;
    poolEnabled?: boolean;
  }) => {
    if (params.plotWidth !== undefined) setPlotWidth(params.plotWidth);
    if (params.plotDepth !== undefined) setPlotDepth(params.plotDepth);
    if (params.facing !== undefined) setFacing(params.facing);
    if (params.floors !== undefined) setFloors(params.floors);
    if (params.bhk !== undefined) setBhk(params.bhk);
    if (params.style !== undefined) setStyle(params.style);
    if (params.vastuEnabled !== undefined) setVastuEnabled(params.vastuEnabled);
    if (params.poolEnabled !== undefined) setPoolEnabled(params.poolEnabled);
  };

  // Preset Selector
  const handleSelectPreset = (presetId: string) => {
    if (presetId === 'modern_40x60') {
      setPlotWidth(40);
      setPlotDepth(60);
      setFacing('NORTH');
      setFloors(2);
      setBhk(4);
      setVastuEnabled(false);
      setPoolEnabled(true);
      const p = generateLocalPlan({
        plotWidth: 40,
        plotDepth: 60,
        facing: 'NORTH',
        floors: 2,
        bhk: 4,
        vastuEnabled: false,
        outdoor: { gardenLawn: true, carPorch: true, pool: true, patio: true }
      });
      setPlan(p);
      setCustomization((prev) => ({ ...prev, wallColorHex: '#1e293b', accentColorHex: '#3b82f6', lightingAmbiance: 'sunset' }));
    } else if (presetId === 'vastu_30x40') {
      setPlotWidth(30);
      setPlotDepth(40);
      setFacing('EAST');
      setFloors(1);
      setBhk(3);
      setVastuEnabled(true);
      setPoolEnabled(false);
      const p = generateLocalPlan({
        plotWidth: 30,
        plotDepth: 40,
        facing: 'EAST',
        floors: 1,
        bhk: 3,
        vastuEnabled: true,
        outdoor: { gardenLawn: true, carPorch: true, pool: false, patio: true }
      });
      setPlan(p);
      setCustomization((prev) => ({ ...prev, wallColorHex: '#f5efe6', accentColorHex: '#92400e', lightingAmbiance: 'daylight' }));
    } else if (presetId === 'compact_25x50') {
      setPlotWidth(25);
      setPlotDepth(50);
      setFacing('WEST');
      setFloors(2);
      setBhk(3);
      setVastuEnabled(false);
      setPoolEnabled(false);
      const p = generateLocalPlan({
        plotWidth: 25,
        plotDepth: 50,
        facing: 'WEST',
        floors: 2,
        bhk: 3,
        vastuEnabled: false,
        outdoor: { gardenLawn: true, carPorch: true, pool: false, patio: true }
      });
      setPlan(p);
      setCustomization((prev) => ({ ...prev, wallColorHex: '#f8fafc', accentColorHex: '#475569', gardenStyle: 'zen_gravel' }));
    }
  };

  // Export Blender Script File
  const handleDownloadBlenderScript = () => {
    const pythonScript = `# ArchSynth 3D Blender Automation Script
# Plan ID: ${plan.meta.planId} | Generated: ${new Date().toISOString()}
import bpy

bpy.ops.wm.read_factory_settings(use_empty=True)
print("ArchSynth 3D Model created for Plot ${plan.plot.widthFt}x${plan.plot.depthFt}ft")
# Wall color: ${customization.wallColorHex}
# Accent: ${customization.accentColorHex}
# Lighting: ${customization.lightingAmbiance}
`;
    const blob = new Blob([pythonScript], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArchSynth_${plan.meta.planId}_blender.py`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 1. If in Landing Page mode, show the full Company Overview & Value Proposition
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchStudio={() => setViewMode('studio')}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
    );
  }

  // 2. Studio Mode (Interactive 3D CAD & Walkthrough Studio)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-16 lg:pb-0">
      {/* Top Header */}
      <Header
        plan={plan}
        currency={currency}
        onCurrencyChange={setCurrency}
        onSelectPreset={handleSelectPreset}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onDownloadPdf={() => generateConstructionPdf(plan)}
        onDownloadBlender={handleDownloadBlenderScript}
        onBackToHome={() => setViewMode('landing')}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 p-2 sm:p-3 md:p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4 max-w-[1920px] mx-auto w-full">
        {/* Left Column: Parameter & Input Setup (Desktop: 3 cols, Mobile: based on tab) */}
        <aside className={`lg:col-span-3 flex flex-col gap-3 ${mobileStudioTab === 'inputs' ? 'block' : 'hidden lg:flex'}`}>
          <InputPanel
            plotWidth={plotWidth}
            plotDepth={plotDepth}
            facing={facing}
            floors={floors}
            bhk={bhk}
            style={style}
            vastuEnabled={vastuEnabled}
            poolEnabled={poolEnabled}
            onUpdateParams={handleUpdateParams}
            onRegenerate={handleRegenerate}
          />
        </aside>

        {/* Center Column: Viewport & 2D/3D Engine (Desktop: 6 cols, Mobile: based on tab) */}
        <section className={`lg:col-span-6 flex flex-col gap-3 ${mobileStudioTab === 'viewport' ? 'block' : 'hidden lg:flex'}`}>
          {/* View Mode Tabs Bar */}
          <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md p-1 sm:p-1.5 rounded-xl border border-slate-800 flex-wrap gap-1">
            <div className="flex items-center gap-1 flex-wrap">
              <button
                onClick={() => {
                  setActiveTab('3d');
                  setIsPlayingWalkthrough(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === '3d'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D Studio</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('2d');
                  setIsPlayingWalkthrough(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === '2d'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>2D Blueprint</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('walkthrough');
                  setIsPlayingWalkthrough(true);
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'walkthrough'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Tour</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('audit');
                  setIsPlayingWalkthrough(false);
                }}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'audit'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {vastuEnabled ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Vastu</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Solar Audit</span>
                  </>
                )}
              </button>
            </div>

            {/* Quick Dimension Pill */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 px-2">
              <span>Built-Up: <strong className="text-white">{plan.building.totalBuiltUpAreaSqFt} sq.ft</strong></span>
            </div>
          </div>

          {/* Active Viewport Content */}
          <div className="flex-1 min-h-[420px] sm:min-h-[480px] bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden relative shadow-2xl">
            {activeTab === '3d' && (
              <ThreeCanvas
                plan={plan}
                customization={customization}
                activeWaypointIndex={null}
                isPlayingWalkthrough={false}
              />
            )}

            {activeTab === '2d' && <Blueprint2D plan={plan} />}

            {activeTab === 'walkthrough' && (
              <div className="w-full h-full relative">
                <ThreeCanvas
                  plan={plan}
                  customization={customization}
                  activeWaypointIndex={activeWaypointIndex}
                  isPlayingWalkthrough={isPlayingWalkthrough}
                />
              </div>
            )}

            {activeTab === 'audit' && (
              <div className="p-4 sm:p-6 h-full overflow-y-auto space-y-4 text-xs">
                {vastuEnabled && plan.vastuReport ? (
                  <>
                    <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800/60 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-amber-300">
                          Classical Vastu Shastra Compliance Report
                        </h3>
                        <p className="text-xs text-amber-200/80 mt-1">
                          {plan.vastuReport.summary}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-amber-400 font-mono">
                          {plan.vastuReport.vastuScore}/100
                        </span>
                        <div className="text-[10px] text-amber-300/80 font-bold uppercase">
                          {plan.vastuReport.grade}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-white uppercase tracking-wider text-xs">
                        Directional Room Allocation & Elemental Alignment:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.vastuReport.roomEvaluations.map((evalItem) => (
                          <div key={evalItem.id} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">{evalItem.name}</span>
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                                {evalItem.status}
                              </span>
                            </div>
                            <div className="text-[11px] text-amber-400 font-mono mt-1">
                              Zone: {evalItem.zone} • Element: {evalItem.element}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 italic">
                              {evalItem.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-bold text-emerald-300">
                          International Solar Passive & Biophilic Standard
                        </h3>
                        <p className="text-xs text-emerald-200/80 mt-1">
                          {plan.modernReport.solarStrategy}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-emerald-400 font-mono">
                          {plan.modernReport.modernScore}/100
                        </span>
                        <div className="text-[10px] text-emerald-300/80 font-bold uppercase">
                          {plan.modernReport.grade}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="font-bold text-white uppercase tracking-wider text-xs">
                        Acoustic & Daylighting Performance:
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {plan.modernReport.roomEvaluations.map((evalItem) => (
                          <div key={evalItem.id} className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-200">{evalItem.name}</span>
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                                {evalItem.energyRating}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-1">
                              {evalItem.acousticZone} • {evalItem.daylightStatus}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 italic">
                              {evalItem.ventilation} • {evalItem.goldenRatioCompliance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Walkthrough Video Player Bar */}
          {activeTab === 'walkthrough' && (
            <WalkthroughControls
              waypoints={plan.waypoints}
              activeIndex={activeWaypointIndex}
              isPlaying={isPlayingWalkthrough}
              onPlayToggle={() => setIsPlayingWalkthrough(!isPlayingWalkthrough)}
              onSelectWaypoint={(idx) => setActiveWaypointIndex(idx)}
              speed={walkthroughSpeed}
              onSpeedChange={setWalkthroughSpeed}
              onExportBlender={handleDownloadBlenderScript}
            />
          )}
        </section>

        {/* Right Column: Material & Color Studio (Desktop: 3 cols, Mobile: based on tab) */}
        <aside className={`lg:col-span-3 flex flex-col gap-3 ${mobileStudioTab === 'customizer' || mobileStudioTab === 'summary' ? 'block' : 'hidden lg:flex'}`}>
          {mobileStudioTab !== 'summary' && (
            <CustomizationPanel
              customization={customization}
              onChange={(updated) => setCustomization((prev) => ({ ...prev, ...updated }))}
            />
          )}

          {/* Quick Summary Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2.5">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Construction Estimation</span>
              <span className="text-[10px] font-mono text-indigo-400">BENCHMARK</span>
            </div>
            <div className="text-slate-300 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Built-Up Area:</span>
                <span className="font-mono font-bold text-white">{plan.building.totalBuiltUpAreaSqFt} SQ.FT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">US Standard Cost:</span>
                <span className="font-mono font-bold text-emerald-400">${plan.costEstimate.currencyUSD.standard.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">India Benchmark:</span>
                <span className="font-mono font-bold text-emerald-400">₹{(plan.costEstimate.currencyINR.standard / 100000).toFixed(2)} Lakhs</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutOpen(true)}
              className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-md"
            >
              <span>Unlock Builder Package</span>
            </button>
          </div>
        </aside>
      </main>

      {/* Mobile Bottom Dock Navigation Bar (Visible only on mobile/tablet screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 grid grid-cols-4 py-2 px-1 text-center text-[10px]">
        <button
          onClick={() => setMobileStudioTab('viewport')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            mobileStudioTab === 'viewport' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>3D / 2D</span>
        </button>

        <button
          onClick={() => setMobileStudioTab('inputs')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            mobileStudioTab === 'inputs' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Plot Inputs</span>
        </button>

        <button
          onClick={() => setMobileStudioTab('customizer')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            mobileStudioTab === 'customizer' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Colors</span>
        </button>

        <button
          onClick={() => setMobileStudioTab('summary')}
          className={`flex flex-col items-center justify-center gap-1 py-1 transition ${
            mobileStudioTab === 'summary' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Package</span>
        </button>
      </nav>

      {/* Commercial Checkout & Builder Package Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={plan}
        customization={customization}
        currency={currency}
        onDownloadPdf={() => generateConstructionPdf(plan)}
        onDownloadBlenderScript={handleDownloadBlenderScript}
      />
    </div>
  );
}

export default App;
