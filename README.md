# ArchSynth 3D | AI Architecture & Construction Studio (MVP)

> **All-in-One Global AI Architecture Platform:** Turn plot dimensions & site parameters into permitted 2D CAD blueprints, real-time interactive 3D WebGL models with live material/color switching, cinematic drone walkthrough video tours, and contractor-ready construction handoff packages with **optional Vastu Shastra compliance**.

---

## 🌟 Key Features

1. **Smart Plot & Site Input Wizard**:
   - Custom plot dimensions (Width × Depth in feet/meters).
   - Cardinal road facing selection (North, East, South, West, NE, NW, SE, SW) with interactive compass.
   - Floors (Ground Floor vs Duplex G+1) and Configuration (2, 3, 4 BHK).
   - Outdoor Landscaping (Lawn, Driveway, Car Porch, Rear Patio, Infinity Reflection Pool).
   - Site photo / boundary sketch upload with AI parcel segmentation.

2. **Dual-Mode Architectural Engine**:
   - **International Modern Architecture (Default)**: Passive solar daylighting, open-concept Great Room, acoustic zoning, biophilic garden flow.
   - **Classical Vastu Shastra (Optional Toggle)**: 16-Zone Indian Vastu matrix, Agni Kitchen (SE), Nairitya Master Suite (SW), Ishanya Pooja Sanctum (NE), and open Brahmasthana center.

3. **In-Browser Interactive 3D WebGL Studio (Three.js)**:
   - Full 360° orbit, pan, and zoom.
   - Foundation plinth, structural walls, panoramic curtain wall glass, entry portals, and roof coping.
   - Front lawn, paver driveway with car model, outdoor trees, and optional reflection pool.

4. **Real-time Color & Material Studio**:
   - Exterior Facade Colors (Alabaster White, Charcoal Modern, Warm Linen, Terracotta, Sage, Slate Blue).
   - Interior Flooring Finishes (Italian Statuario Marble, Scandinavian Oak, Dark Walnut, Terrazzo).
   - Roof Architecture (Modern Parapet Slab vs Sloped Shingle).
   - Lighting Ambiance (Noon Daylight, Sunset Golden Hour, Cinematic Night Glow).

5. **Cinematic 3D Video Walkthrough (Camera Flythrough Tour)**:
   - 7 Automated Camera Waypoints:
     1. Aerial Establishing Drone View
     2. Street & Driveway Approach
     3. Grand Entrance & Garden Threshold
     4. Great Living Hall & Dining Showcase
     5. Gourmet Kitchen & Garden Pass-Through
     6. Master Suite & Private Terrace
     7. Backyard Lounge & Evening Ambience
   - Playback controls, station timeline scrubber, and speed controls (0.5x, 1x, 2x).

6. **Automated Blender Pipeline (`bpy`)**:
   - Generates executable Python scripts for Blender.
   - Creates procedural materials, lighting, and keyframed camera animation for 4K video rendering.

7. **Contractor Construction Handoff & Commercial Checkout**:
   - Multi-currency checkout: Stripe (USD $49 / $79), Razorpay / UPI (INR ₹2,499 / ₹3,999), and EUR (€45 / €75).
   - Instant downloadable vector 2D Blueprint PDF with exact room schedules and bill of quantities.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js v18+ (tested on v22.12.0)
- pnpm v9+ or npm

### 2. Client Setup & Launch
```bash
cd archsynth-studio/client
pnpm install
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Backend Server Launch
```bash
cd archsynth-studio/server
pnpm install
pnpm start
```
Runs on [http://localhost:5001](http://localhost:5001).

### 4. Running Automated Tests
```bash
cd archsynth-studio
node server/test_server.js
```

---

## 🏗️ Architecture

```
archsynth-studio/
├── client/                      # Vite + React 19 + TypeScript + Three.js + TailwindCSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Blueprint2D.tsx          # SVG 2D Architectural Blueprint CAD
│   │   │   ├── CheckoutModal.tsx        # Multi-currency payment & handoff package modal
│   │   │   ├── CustomizationPanel.tsx   # Live Material, Texture & Color studio
│   │   │   ├── Header.tsx               # Brand header, presets & currency selector
│   │   │   ├── InputPanel.tsx           # Plot parameters & Vastu toggle wizard
│   │   │   ├── ThreeCanvas.tsx          # Three.js WebGL 3D Interactive Studio
│   │   │   └── WalkthroughControls.tsx  # Video tour player & station scrubber
│   │   ├── utils/
│   │   │   ├── pdfGenerator.ts          # jsPDF Vector Architectural Blueprint exporter
│   │   │   └── planGeneratorLocal.ts    # Instant client-side procedural solver
│   │   └── types/index.ts               # Shared TypeScript schemas
├── server/                      # Node.js + Express API
│   ├── engine/
│   │   ├── blenderGenerator.js          # Procedural Blender bpy script builder
│   │   ├── modernEngine.js              # Solar passive & daylighting analyzer
│   │   ├── planGenerator.js             # Core constraint satisfaction layout solver
│   │   └── vastuEngine.js               # Classical 16-zone Vastu Shastra engine
│   ├── server.js                        # Express REST endpoints
│   └── test_server.js                   # 100% verified test suite
└── README.md
```
