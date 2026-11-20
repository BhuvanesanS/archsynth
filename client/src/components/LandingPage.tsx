import { type FC } from 'react';
import { 
  Box, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Compass, 
  Layers, 
  Video, 
  Palette, 
  Zap 
} from 'lucide-react';

interface LandingPageProps {
  onLaunchStudio: () => void;
  currency: 'USD' | 'INR' | 'EUR';
  onCurrencyChange: (c: 'USD' | 'INR' | 'EUR') => void;
}

export const LandingPage: FC<LandingPageProps> = ({
  onLaunchStudio,
  currency,
  onCurrencyChange
}) => {
  const currencySymbol = currency === 'USD' ? '$' : currency === 'INR' ? '₹' : '€';
  const pricingData = {
    standard: currency === 'USD' ? 49 : currency === 'INR' ? 2499 : 45,
    pro: currency === 'USD' ? 79 : currency === 'INR' ? 3999 : 75
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-900/50 border border-indigo-400/30">
            <Box className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                ArchSynth <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">3D</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono">
                AI ARCHITECTURE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden sm:block">
              Generative Blueprint CAD, 3D Studio & Cinematic Video Walkthroughs
            </p>
          </div>
        </div>

        {/* Center Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-white transition">Core Features</a>
          <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
          <a href="#walkthrough-demo" className="hover:text-white transition">3D Video Walkthrough</a>
          <a href="#vastu-modern" className="hover:text-white transition">Dual Engine (Vastu + Solar)</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
        </nav>

        {/* Right CTA & Currency Switcher */}
        <div className="flex items-center gap-3">
          {/* Currency Toggle */}
          <div className="hidden sm:flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800 text-xs">
            {(['USD', 'INR', 'EUR'] as const).map((c) => (
              <button
                key={c}
                onClick={() => onCurrencyChange(c)}
                className={`px-2 py-1 rounded transition text-xs ${
                  currency === c
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {c === 'USD' ? '$ USD' : c === 'INR' ? '₹ INR' : '€ EUR'}
              </button>
            ))}
          </div>

          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-950/60 border border-indigo-400/30 transition transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Launch Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 px-4 lg:px-8 border-b border-slate-900">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 shadow-lg text-xs text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">Next-Gen Architecture Intelligence Platform</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 hidden sm:inline">Built for Homeowners, Builders & Civil Engineers</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Design, Walk Through & Build Your Dream Home{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              Before Laying A Single Brick
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300/90 leading-relaxed font-normal">
            Input your plot dimensions and road orientation. Our generative AI engine instantly produces 
            <strong className="text-white"> permit-ready 2D CAD blueprints</strong>, an 
            <strong className="text-white"> interactive 3D WebGL studio</strong> with live facade color changing, a 
            <strong className="text-white"> 7-station cinematic video walkthrough tour</strong>, and 
            <strong className="text-white"> optional Indian Vastu compliance</strong>.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={onLaunchStudio}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-950/70 border border-indigo-400/40 transition transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Launch 3D Architecture Studio (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchStudio}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-semibold text-sm border border-slate-700/80 transition flex items-center justify-center gap-2"
            >
              <Video className="w-4 h-4 text-amber-400" />
              <span>Explore 3D Video Walkthrough Demo</span>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> No CAD software installation needed
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Instant 2D Blueprint PDF download
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" /> Ready to hand off to local contractors
            </span>
          </div>
        </div>

        {/* Hero Interactive Mockup Showcase */}
        <div className="max-w-4xl mx-auto mt-12 relative rounded-2xl border border-slate-800 bg-slate-900/70 p-3 sm:p-5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-slate-400 text-[11px]">ArchSynth 3D Live Engine • 35ft × 55ft Plot (East Facing)</span>
            </div>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              SYNTHESIS COMPLETE (0.8s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mt-3">
            {/* Left Blueprint Mock */}
            <div className="md:col-span-5 bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" /> 2D CAD Blueprint
                  </span>
                  <span className="font-mono text-cyan-400">1:100 Scale</span>
                </div>
                <div className="space-y-1.5 text-[11px] font-mono text-slate-300">
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800 flex justify-between">
                    <span>Formal Living Hall</span>
                    <span className="text-cyan-400">18' × 16'</span>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800 flex justify-between">
                    <span>Gourmet Island Kitchen</span>
                    <span className="text-orange-400">14' × 12'</span>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800 flex justify-between">
                    <span>Master Suite Sanctuary</span>
                    <span className="text-purple-400">18' × 14'</span>
                  </div>
                  <div className="p-2 bg-slate-900/80 rounded border border-slate-800 flex justify-between">
                    <span>Landscaped Garden Lawn</span>
                    <span className="text-emerald-400">22' × 8'</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Total Built-Up:</span>
                <span className="font-bold text-white font-mono">1,925 SQ.FT</span>
              </div>
            </div>

            {/* Right 3D & Walkthrough Mock */}
            <div className="md:col-span-7 bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" /> 3D Flythrough Camera Active
                  </span>
                  <span className="text-amber-400 font-mono text-[10px] bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                    STATION 4 OF 7
                  </span>
                </div>

                <div className="h-32 rounded-lg bg-slate-950/80 border border-slate-800/80 flex flex-col items-center justify-center p-4 text-center">
                  <Box className="w-8 h-8 text-indigo-400 animate-bounce mb-1" />
                  <span className="text-xs font-bold text-white">Full 360° Real-Time WebGL Canvas</span>
                  <span className="text-[10px] text-slate-400">Interactive lighting, marble floors, teak portals & garden trees</span>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Live Facade Swatches:</span>
                <div className="flex gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-400 inline-block" />
                  <span className="w-4 h-4 rounded-full bg-slate-800 border border-slate-600 inline-block" />
                  <span className="w-4 h-4 rounded-full bg-orange-700 border border-orange-500 inline-block" />
                  <span className="w-4 h-4 rounded-full bg-sky-600 border border-sky-400 inline-block" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Metrics & Proof Bar */}
      <section className="py-12 bg-slate-900/50 border-b border-slate-800/80 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">14,200+</div>
            <div className="text-xs text-slate-400 mt-1">Homes Planned Worldwide</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">60 Sec</div>
            <div className="text-xs text-slate-400 mt-1">From Plot Size to 3D Model</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-indigo-400 font-mono">$2,800+</div>
            <div className="text-xs text-slate-400 mt-1">Avg Saved vs Manual Architects</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">99.4%</div>
            <div className="text-xs text-slate-400 mt-1">Builder Handoff Compatibility</div>
          </div>
        </div>
      </section>

      {/* 4. What is ArchSynth? (Core Capabilities) */}
      <section id="features" className="py-20 px-4 lg:px-8 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            All-In-One Architecture Solution
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Everything You Need From Concept to Concrete
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Traditional architectural firms take 3 to 4 weeks and charge thousands of dollars. 
            ArchSynth 3D delivers permit-grade results in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
              1. Permitted 2D CAD Blueprints
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated mathematical room zoning, wall thicknesses, door swing arcs, setbacks, and dimension schedules. Downloadable as vector PDF formatted to 1:100 architectural scale.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-400 transition">
              2. Real-Time 3D WebGL Studio
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore your building volume in 360 degrees directly in your browser. Live lighting and shadows, curtain wall glass, foundation plinths, and driveways rendered on GPU.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition">
              3. Live Color & Material Switcher
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't guess how paint colors will look. Switch exterior stucco shades (Alabaster, Charcoal, Terracotta), interior flooring (Italian Marble, Oak Wood), and roof architectures in real time.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-red-400 transition">
              4. 7-Station Cinematic Video Walkthrough
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Experience an automated director's camera tour: drone aerial approach, street driveway entry, double-height living hall, island kitchen, master sanctuary, and backyard evening lounge.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
              5. Dual Engine: Modern Solar vs Vastu
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Going global? Rely on our International Solar Passive & Daylighting algorithms. Want traditional energy balance? Toggle our 16-zone Indian Vastu Shastra engine with one click.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition">
              6. Blender Automation Script (`bpy`)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download clean, procedural Python scripts for Blender. Run headless rendering on any cloud GPU or give it to 3D visualization artists to render 4K photorealistic videos.
            </p>
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-900/40 border-y border-slate-900 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
              Simple 3-Step Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              How ArchSynth 3D Operates
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="text-2xl font-black text-indigo-500 font-mono">01</div>
              <h3 className="text-sm font-bold text-white">Input Plot & Orientation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your plot width and depth (e.g. 35' × 55'). Choose cardinal road facing (North, East, South, West) and select whether to enable Vastu Shastra.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="text-2xl font-black text-cyan-500 font-mono">02</div>
              <h3 className="text-sm font-bold text-white">Customize Colors & Walk Through</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test various wall paint swatches, roof shingles, and flooring. Hit "Play Tour" to watch the camera glide through the rooms in cinematic 3D.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 relative">
              <div className="text-2xl font-black text-purple-500 font-mono">03</div>
              <h3 className="text-sm font-bold text-white">Hand Off To Your Builder</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export the permit-grade 2D Blueprint PDF, material area schedules, and Blender script. Hand them directly to your general contractor or civil engineer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Dual Engine Explainer (Vastu vs Modern International) */}
      <section id="vastu-modern" className="py-20 px-4 lg:px-8 max-w-5xl mx-auto space-y-8">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950/60 border border-slate-800 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              Cultural & International Flexibility
            </span>
            <h3 className="text-2xl font-bold text-white">
              Vastu When You Want It. International Modern When You Don't.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Most tools force either rigid ancient rules or generic Western floor plans. ArchSynth gives you a simple toggle:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Compass className="w-4 h-4" />
                <span>International Modern (Vastu OFF)</span>
              </div>
              <p className="text-xs text-slate-400">
                Optimizes passive solar daylighting, cross-ventilation, open-concept Great Room living, and acoustic buffering between active zones and quiet bedroom suites.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Indian Vastu Shastra (Vastu ON)</span>
              </div>
              <p className="text-xs text-slate-400">
                Aligns rooms with the 5 primordial elements (Pancha Bhoota): Fire in Agni (Kitchen), Earth in Nairitya (Master Bedroom), Ether in Ishanya (Pooja/Water), and an open central Brahmasthana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Transparent Pricing Section */}
      <section id="pricing" className="py-20 bg-slate-900/40 border-t border-slate-900 px-4 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Pay Only When You're Ready To Build
            </h2>
            <p className="text-xs text-slate-400">
              Interactive 3D designing, color switching, and live video previews are 100% free. Pay only to unlock high-res deliverables.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Tier */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Free Interactive Studio</h3>
                  <div className="text-2xl font-black text-white mt-1">
                    {currencySymbol}0
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Design and preview your plot in 3D directly in the browser.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-time 3D WebGL Studio</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Live Color & Material Switcher</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>7-Station Video Tour Preview</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Optional Vastu Shastra Audit</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchStudio}
                className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition"
              >
                Launch Free Studio
              </button>
            </div>

            {/* Standard Pack */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-white">Standard Construction Pack</h3>
                  <div className="text-2xl font-black text-white mt-1">
                    {currencySymbol}{pricingData.standard}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Municipal-ready plans to submit to your contractor.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2D Permitted Blueprint PDF (1:100 Scale)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Room Schedules & Setback Dimensions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bill of Quantities (BoQ) Material List</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>4K Exterior & Interior 3D Renders</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchStudio}
                className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-md shadow-indigo-900/40"
              >
                Start In Studio
              </button>
            </div>

            {/* Pro Studio Pack */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-indigo-950/60 to-slate-950 border border-indigo-500/80 flex flex-col justify-between relative shadow-xl">
              <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Recommended
              </span>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-indigo-300">Pro Studio BIM Package</h3>
                  <div className="text-2xl font-black text-white mt-1">
                    {currencySymbol}{pricingData.pro}
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Full architectural blueprints + 1080p Video + Blender Python.
                  </p>
                </div>

                <ul className="space-y-2 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Everything in Standard Pack</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1080p 60FPS Video Walkthrough (MP4)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Blender Python (`bpy`) Source Script</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Priority Engineering Support</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={onLaunchStudio}
                className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-950/60 border border-indigo-400/30"
              >
                Launch Studio & Unlock Pro
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action Banner */}
      <section className="py-20 px-4 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Ready to See Your Plot Transform Into A 3D Home?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          No sign-up or credit card required to begin designing. Choose your dimensions and watch the magic happen.
        </p>
        <button
          onClick={onLaunchStudio}
          className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm inline-flex items-center gap-2 shadow-xl shadow-indigo-950/70 border border-indigo-400/40 transition transform hover:scale-105"
        >
          <span>Open 3D Architecture Studio</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* 9. Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 px-4 lg:px-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex items-center justify-center gap-2 text-slate-400 font-semibold">
          <Box className="w-4 h-4 text-indigo-400" />
          <span>ArchSynth 3D Architecture Systems Inc.</span>
        </div>
        <p>© 2026 ArchSynth 3D. All rights reserved. Built for international homeowners and builders.</p>
      </footer>
    </div>
  );
};
