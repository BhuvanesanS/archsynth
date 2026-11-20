import { evaluateVastu } from './vastuEngine.js';
import { evaluateModernDesign } from './modernEngine.js';

export function generateArchitecturalPlan(params) {
  const {
    plotWidth = 30,
    plotDepth = 50,
    facing = 'EAST',
    floors = 1,
    bhk = 3,
    style = 'contemporary',
    vastuEnabled = false,
    outdoor = { gardenLawn: true, carPorch: true, pool: false, patio: true },
    setbacks = { front: 8, rear: 4, left: 3, right: 3 }
  } = params;

  const totalPlotAreaSqFt = plotWidth * plotDepth;
  const buildWidth = Math.max(16, plotWidth - (setbacks.left + setbacks.right));
  const buildDepth = Math.max(20, plotDepth - (setbacks.front + setbacks.rear));
  const groundFloorAreaSqFt = Math.round(buildWidth * buildDepth);
  const totalBuiltUpAreaSqFt = groundFloorAreaSqFt * (floors === 2 ? 1.85 : 1);

  // Generate Room Partitions based on Vastu vs International Modern preference
  let rooms = [];
  const roomColors = {
    living: '#38bdf8',
    dining: '#818cf8',
    kitchen: '#fb923c',
    master_bed: '#a78bfa',
    bed_2: '#c084fc',
    bed_3: '#e879f9',
    pooja: '#facc15',
    bath_1: '#94a3b8',
    bath_2: '#94a3b8',
    foyer: '#6ee7b7',
    utility: '#f472b6',
    balcony: '#34d399',
    porch: '#fdba74'
  };

  const hw = buildWidth / 2;
  const hd = buildDepth / 2;

  if (vastuEnabled) {
    // Vastu-Compliant 9-Grid Layout
    rooms = [
      {
        id: 'r_living',
        name: 'Formal Living & Brahmasthana Hall',
        type: 'living',
        zone: 'CENTER',
        x: setbacks.left + 0.2 * buildWidth,
        y: setbacks.rear + 0.25 * buildDepth,
        width: Math.round(0.6 * buildWidth * 10) / 10,
        depth: Math.round(0.4 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.24 * groundFloorAreaSqFt),
        color: roomColors.living,
        features: ['Double-height ceiling', 'Open to sky skylight', 'Marble flooring']
      },
      {
        id: 'r_kitchen',
        name: 'Modular Kitchen (Agni Zone)',
        type: 'kitchen',
        zone: 'SOUTH_EAST',
        x: setbacks.left + 0.6 * buildWidth,
        y: setbacks.rear,
        width: Math.round(0.4 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.14 * groundFloorAreaSqFt),
        color: roomColors.kitchen,
        features: ['East-facing cooking platform', 'Granite countertop', 'Exhaust duct']
      },
      {
        id: 'r_master_bed',
        name: 'Master Suite (Nairitya Zone)',
        type: 'master_bed',
        zone: 'SOUTH_WEST',
        x: setbacks.left,
        y: setbacks.rear,
        width: Math.round(0.6 * buildWidth * 10) / 10,
        depth: Math.round(0.38 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.22 * groundFloorAreaSqFt),
        color: roomColors.master_bed,
        features: ['Attached luxury bath', 'Walk-in wardrobe', 'Solid teak headboard']
      },
      {
        id: 'r_pooja',
        name: 'Pooja Meditation Sanctum (Ishanya)',
        type: 'pooja',
        zone: 'NORTH_EAST',
        x: setbacks.left + 0.7 * buildWidth,
        y: setbacks.rear + 0.7 * buildDepth,
        width: Math.round(0.3 * buildWidth * 10) / 10,
        depth: Math.round(0.3 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.09 * groundFloorAreaSqFt),
        color: roomColors.pooja,
        features: ['White Makrana marble altar', 'Positive solar alignment', 'Copper bell inlay']
      },
      {
        id: 'r_bed_2',
        name: 'Guest Bedroom (Vayu Zone)',
        type: 'bed_2',
        zone: 'NORTH_WEST',
        x: setbacks.left,
        y: setbacks.rear + 0.6 * buildDepth,
        width: Math.round(0.45 * buildWidth * 10) / 10,
        depth: Math.round(0.4 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.18 * groundFloorAreaSqFt),
        color: roomColors.bed_2,
        features: ['Cross-ventilation window', 'Built-in study nook', 'Attached bath']
      },
      {
        id: 'r_foyer',
        name: 'Grand Entrance Foyer & Verandah',
        type: 'foyer',
        zone: facing === 'EAST' ? 'EAST' : 'NORTH',
        x: setbacks.left + 0.45 * buildWidth,
        y: setbacks.rear + 0.8 * buildDepth,
        width: Math.round(0.25 * buildWidth * 10) / 10,
        depth: Math.round(0.2 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.05 * groundFloorAreaSqFt),
        color: roomColors.foyer,
        features: ['Double-leaf teak door', 'Shoe console', 'Brass fixture lighting']
      }
    ];
  } else {
    // International Modern Architecture Layout (Passive Solar & Open Concept)
    rooms = [
      {
        id: 'r_living',
        name: 'Grand Great Room & Lounge',
        type: 'living',
        zone: 'SOUTHERN_EXPOSURE',
        x: setbacks.left,
        y: setbacks.rear + 0.35 * buildDepth,
        width: Math.round(0.55 * buildWidth * 10) / 10,
        depth: Math.round(0.45 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.25 * groundFloorAreaSqFt),
        color: roomColors.living,
        features: ['Floor-to-ceiling glass wall', 'Acoustic slat wood wall', 'Recessed ambient LED']
      },
      {
        id: 'r_kitchen',
        name: 'Chef Kitchen & Waterfall Island',
        type: 'kitchen',
        zone: 'GARDEN_FACING',
        x: setbacks.left + 0.55 * buildWidth,
        y: setbacks.rear + 0.4 * buildDepth,
        width: Math.round(0.45 * buildWidth * 10) / 10,
        depth: Math.round(0.4 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.18 * groundFloorAreaSqFt),
        color: roomColors.kitchen,
        features: ['Quartz island bar', 'Integrated pantry', 'Bifold patio pass-through window']
      },
      {
        id: 'r_master_bed',
        name: 'Primary Suite Sanctuary',
        type: 'master_bed',
        zone: 'PRIVATE_NORTH',
        x: setbacks.left,
        y: setbacks.rear,
        width: Math.round(0.58 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.20 * groundFloorAreaSqFt),
        color: roomColors.master_bed,
        features: ['Spacious ensuite bathroom', 'Custom walk-in closet', 'Private patio slider']
      },
      {
        id: 'r_bed_2',
        name: 'Secondary Bedroom / Studio Suite',
        type: 'bed_2',
        zone: 'EAST_LIGHT',
        x: setbacks.left + 0.58 * buildWidth,
        y: setbacks.rear,
        width: Math.round(0.42 * buildWidth * 10) / 10,
        depth: Math.round(0.4 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.17 * groundFloorAreaSqFt),
        color: roomColors.bed_2,
        features: ['Dedicated desk space', 'Soundproof drywall insulation', 'Generous closet']
      },
      {
        id: 'r_foyer',
        name: 'Entry Vestibule & Mudroom',
        type: 'foyer',
        zone: 'ENTRANCE_WEST',
        x: setbacks.left + 0.2 * buildWidth,
        y: setbacks.rear + 0.8 * buildDepth,
        width: Math.round(0.35 * buildWidth * 10) / 10,
        depth: Math.round(0.2 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.07 * groundFloorAreaSqFt),
        color: roomColors.foyer,
        features: ['Drop zone bench', 'Concealed coat closet', 'Smart security hub']
      }
    ];

    if (bhk >= 3) {
      rooms.push({
        id: 'r_bed_3',
        name: 'Guest Bedroom / Executive Office',
        type: 'bed_3',
        zone: 'GUEST_WING',
        x: setbacks.left + 0.55 * buildWidth,
        y: setbacks.rear + 0.8 * buildDepth,
        width: Math.round(0.45 * buildWidth * 10) / 10,
        depth: Math.round(0.2 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.09 * groundFloorAreaSqFt),
        color: roomColors.bed_3,
        features: ['Dual-function sofa-bed', 'Garden view window', 'Private powder access']
      });
    }
  }

  // Outdoor landscaping zones
  const landscape = {
    gardenLawn: {
      x: 0,
      y: plotDepth - setbacks.front,
      width: plotWidth * 0.55,
      depth: setbacks.front,
      areaSqFt: Math.round(plotWidth * 0.55 * setbacks.front),
      type: 'Lush Bermuda Turf with Japanese Maple & Boxwood Shrubs'
    },
    driveway: {
      x: plotWidth * 0.55,
      y: plotDepth - setbacks.front,
      width: plotWidth * 0.45,
      depth: setbacks.front,
      areaSqFt: Math.round(plotWidth * 0.45 * setbacks.front),
      type: 'Permeable Basalt Pavers with Inset Solar Markers'
    },
    rearPatio: {
      x: 0,
      y: 0,
      width: plotWidth,
      depth: setbacks.rear,
      areaSqFt: Math.round(plotWidth * setbacks.rear),
      type: 'Weathered Teak Decking with Pergola & Outdoor Fire Lounge'
    },
    pool: outdoor.pool ? {
      x: setbacks.left,
      y: 0.5,
      width: Math.round(buildWidth * 0.5),
      depth: Math.max(3, setbacks.rear - 1),
      areaSqFt: Math.round(buildWidth * 0.5 * (setbacks.rear - 1)),
      type: 'Infinity Edge Reflection Pool with Sukabumi Stone'
    } : null
  };

  // 3D Spatial Mesh Definitions (Scale factor: 1 ft = 0.5 meter in Three.js world)
  const scale = 0.3048; // exact meter conversion
  const wallHeightMeters = 3.2;

  const threeMeshSpecs = {
    plot: {
      widthM: plotWidth * scale,
      depthM: plotDepth * scale,
      facing
    },
    building: {
      xM: (setbacks.left + buildWidth / 2 - plotWidth / 2) * scale,
      zM: (setbacks.rear + buildDepth / 2 - plotDepth / 2) * scale,
      widthM: buildWidth * scale,
      depthM: buildDepth * scale,
      heightM: wallHeightMeters * floors,
      floors
    },
    rooms3D: rooms.map(r => ({
      id: r.id,
      name: r.name,
      xM: (r.x + r.width / 2 - plotWidth / 2) * scale,
      zM: (r.y + r.depth / 2 - plotDepth / 2) * scale,
      widthM: r.width * scale,
      depthM: r.depth * scale,
      heightM: wallHeightMeters,
      color: r.color
    })),
    landscape3D: {
      lawn: {
        xM: (landscape.gardenLawn.x + landscape.gardenLawn.width / 2 - plotWidth / 2) * scale,
        zM: (landscape.gardenLawn.y + landscape.gardenLawn.depth / 2 - plotDepth / 2) * scale,
        widthM: landscape.gardenLawn.width * scale,
        depthM: landscape.gardenLawn.depth * scale
      },
      driveway: {
        xM: (landscape.driveway.x + landscape.driveway.width / 2 - plotWidth / 2) * scale,
        zM: (landscape.driveway.y + landscape.driveway.depth / 2 - plotDepth / 2) * scale,
        widthM: landscape.driveway.width * scale,
        depthM: landscape.driveway.depth * scale
      }
    }
  };

  // Cinematic Walkthrough Camera Waypoints (Smooth Flythrough Tour)
  const waypoints = [
    {
      title: '1. Aerial Establishing Drone View',
      cameraPosition: [0, 22, 28],
      target: [0, 1.5, 0],
      durationMs: 4000,
      description: 'High-altitude panoramic perspective displaying roof architecture, plot boundaries, and landscape.'
    },
    {
      title: '2. Street & Driveway Approach',
      cameraPosition: [threeMeshSpecs.landscape3D.driveway.xM, 2.0, plotDepth * scale * 0.65],
      target: [0, 1.8, 0],
      durationMs: 4500,
      description: 'Pedestrian eye-level glide entering through the landscaped frontage and paver driveway.'
    },
    {
      title: '3. Grand Entrance & Garden Threshold',
      cameraPosition: [0, 1.8, (plotDepth * scale * 0.5) - 1],
      target: [0, 2.0, (setbacks.rear + buildDepth / 2 - plotDepth / 2) * scale],
      durationMs: 4000,
      description: 'Front entryway revealing teak entry portal and landscaped flower beds.'
    },
    {
      title: '4. Great Living Hall & Dining Showcase',
      cameraPosition: [threeMeshSpecs.rooms3D[0].xM - 1, 1.7, threeMeshSpecs.rooms3D[0].zM + 2],
      target: [threeMeshSpecs.rooms3D[0].xM, 1.6, threeMeshSpecs.rooms3D[0].zM],
      durationMs: 5000,
      description: 'Immersive interior glide highlighting expansive ceiling, natural daylighting, and spatial flow.'
    },
    {
      title: '5. Gourmet Kitchen & Garden Pass-Through',
      cameraPosition: [threeMeshSpecs.rooms3D[1].xM, 1.7, threeMeshSpecs.rooms3D[1].zM + 1.8],
      target: [threeMeshSpecs.rooms3D[1].xM, 1.5, threeMeshSpecs.rooms3D[1].zM - 1],
      durationMs: 4500,
      description: 'Modern island counter, cabinetry finish, and exterior courtyard panorama.'
    },
    {
      title: '6. Master Suite & Private Terrace',
      cameraPosition: [threeMeshSpecs.rooms3D[2].xM - 1, 1.7, threeMeshSpecs.rooms3D[2].zM + 1.5],
      target: [threeMeshSpecs.rooms3D[2].xM, 1.5, threeMeshSpecs.rooms3D[2].zM],
      durationMs: 4500,
      description: 'Peaceful primary retreat featuring tranquil acoustic balance and terrace connectivity.'
    },
    {
      title: '7. Backyard Lounge & Evening Ambience',
      cameraPosition: [0, 6, -(plotDepth * scale * 0.6)],
      target: [0, 1.5, 0],
      durationMs: 4500,
      description: 'Rear perspective overlooking outdoor seating, deck, and glowing architectural facade.'
    }
  ];

  // Construction Cost Estimation (Standard Benchmark: $140 - $220 / sqft in US/Europe, ₹1,800 - ₹2,600 / sqft in India)
  const costEstimate = {
    currencyUSD: {
      low: Math.round(totalBuiltUpAreaSqFt * 140),
      standard: Math.round(totalBuiltUpAreaSqFt * 180),
      luxury: Math.round(totalBuiltUpAreaSqFt * 240)
    },
    currencyINR: {
      low: Math.round(totalBuiltUpAreaSqFt * 1850),
      standard: Math.round(totalBuiltUpAreaSqFt * 2300),
      luxury: Math.round(totalBuiltUpAreaSqFt * 3100)
    },
    materialBreakdown: {
      concreteSteelPct: 34,
      masonryPlasterPct: 18,
      flooringTilingPct: 14,
      electricalPlumbingPct: 16,
      doorsWindowsGlassPct: 10,
      finishingPaintLandscapePct: 8
    }
  };

  // Vastu or Modern Assessment
  const vastuReport = vastuEnabled ? evaluateVastu(rooms) : null;
  const modernReport = evaluateModernDesign(rooms, facing);

  return {
    success: true,
    meta: {
      planId: `AS-${Date.now().toString().slice(-6)}`,
      generatedAt: new Date().toISOString(),
      style,
      facing,
      floors,
      bhk,
      vastuEnabled
    },
    plot: {
      widthFt: plotWidth,
      depthFt: plotDepth,
      totalAreaSqFt: totalPlotAreaSqFt,
      facing,
      setbacks
    },
    building: {
      widthFt: buildWidth,
      depthFt: buildDepth,
      groundFloorAreaSqFt,
      totalBuiltUpAreaSqFt,
      floors
    },
    rooms,
    landscape,
    threeMeshSpecs,
    waypoints,
    vastuReport,
    modernReport,
    costEstimate
  };
}
