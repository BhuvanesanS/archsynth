import type { PlanData, FacingDirection } from '../types';

export function generateLocalPlan(params: {
  plotWidth?: number;
  plotDepth?: number;
  facing?: FacingDirection;
  floors?: number;
  bhk?: number;
  style?: string;
  vastuEnabled?: boolean;
  outdoor?: { gardenLawn: boolean; carPorch: boolean; pool: boolean; patio: boolean };
  setbacks?: { front: number; rear: number; left: number; right: number };
}): PlanData {
  const {
    plotWidth = 35,
    plotDepth = 55,
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

  const roomColors = {
    living: '#38bdf8',
    dining: '#818cf8',
    kitchen: '#fb923c',
    master_bed: '#a78bfa',
    bed_2: '#c084fc',
    bed_3: '#e879f9',
    pooja: '#facc15',
    foyer: '#6ee7b7'
  };

  let rooms = [];

  if (vastuEnabled) {
    rooms = [
      {
        id: 'r_living',
        name: 'Formal Living & Brahmasthana Hall',
        type: 'living',
        zone: 'Brahmasthana (Center)',
        x: setbacks.left + 0.15 * buildWidth,
        y: setbacks.rear + 0.25 * buildDepth,
        width: Math.round(0.65 * buildWidth * 10) / 10,
        depth: Math.round(0.4 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.26 * groundFloorAreaSqFt),
        color: roomColors.living,
        features: ['Center energetic courtyard', 'Skylight illumination', 'Open spatial flow']
      },
      {
        id: 'r_kitchen',
        name: 'Gourmet Kitchen (Agni Zone)',
        type: 'kitchen',
        zone: 'Agni (South-East)',
        x: setbacks.left + 0.58 * buildWidth,
        y: setbacks.rear,
        width: Math.round(0.42 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.15 * groundFloorAreaSqFt),
        color: roomColors.kitchen,
        features: ['East-facing cooking stove', 'Quartz breakfast bar', 'Exhaust vent']
      },
      {
        id: 'r_master_bed',
        name: 'Master Sanctuary (Nairitya Zone)',
        type: 'master_bed',
        zone: 'Nairitya (South-West)',
        x: setbacks.left,
        y: setbacks.rear,
        width: Math.round(0.58 * buildWidth * 10) / 10,
        depth: Math.round(0.38 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.22 * groundFloorAreaSqFt),
        color: roomColors.master_bed,
        features: ['Luxury attached ensuite', 'Walk-in wardrobe', 'Solid acoustic buffer']
      },
      {
        id: 'r_pooja',
        name: 'Pooja Meditation Mandir (Ishanya)',
        type: 'pooja',
        zone: 'Ishanya (North-East)',
        x: setbacks.left + 0.68 * buildWidth,
        y: setbacks.rear + 0.65 * buildDepth,
        width: Math.round(0.32 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.11 * groundFloorAreaSqFt),
        color: roomColors.pooja,
        features: ['Makrana marble wall inlay', 'North-East auspicious orientation', 'Copper bell chime']
      },
      {
        id: 'r_bed_2',
        name: 'Guest Wing (Vayu Zone)',
        type: 'bed_2',
        zone: 'Vayu (North-West)',
        x: setbacks.left,
        y: setbacks.rear + 0.65 * buildDepth,
        width: Math.round(0.45 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.16 * groundFloorAreaSqFt),
        color: roomColors.bed_2,
        features: ['Cross-breeze window', 'Integrated wardrobe', 'Private powder access']
      },
      {
        id: 'r_foyer',
        name: 'Grand Entrance Verandah',
        type: 'foyer',
        zone: 'Indra (East)',
        x: setbacks.left + 0.45 * buildWidth,
        y: setbacks.rear + 0.8 * buildDepth,
        width: Math.round(0.23 * buildWidth * 10) / 10,
        depth: Math.round(0.2 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.05 * groundFloorAreaSqFt),
        color: roomColors.foyer,
        features: ['Custom solid teak door', 'Shoe console', 'Brass fixture lighting']
      }
    ];
  } else {
    // International Modern Architecture
    rooms = [
      {
        id: 'r_living',
        name: 'Grand Great Room & Glass Atrium',
        type: 'living',
        zone: 'Daylight Core',
        x: setbacks.left,
        y: setbacks.rear + 0.35 * buildDepth,
        width: Math.round(0.55 * buildWidth * 10) / 10,
        depth: Math.round(0.45 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.25 * groundFloorAreaSqFt),
        color: roomColors.living,
        features: ['Floor-to-ceiling glass wall', 'Acoustic wood slat paneling', 'Garden connection']
      },
      {
        id: 'r_kitchen',
        name: 'Chef Kitchen & Island Bar',
        type: 'kitchen',
        zone: 'Dining & Courtyard Wing',
        x: setbacks.left + 0.55 * buildWidth,
        y: setbacks.rear + 0.35 * buildDepth,
        width: Math.round(0.45 * buildWidth * 10) / 10,
        depth: Math.round(0.45 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.20 * groundFloorAreaSqFt),
        color: roomColors.kitchen,
        features: ['Waterfall Calacatta marble island', 'Hidden appliance garage', 'Garden patio slider']
      },
      {
        id: 'r_master_bed',
        name: 'Primary Suite Sanctuary',
        type: 'master_bed',
        zone: 'Quiet Private Wing',
        x: setbacks.left,
        y: setbacks.rear,
        width: Math.round(0.58 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.20 * groundFloorAreaSqFt),
        color: roomColors.master_bed,
        features: ['Freestanding soaking tub ensuite', 'Custom walk-in dressing room', 'Private terrace']
      },
      {
        id: 'r_bed_2',
        name: 'Junior Suite / Home Office',
        type: 'bed_2',
        zone: 'Executive Wing',
        x: setbacks.left + 0.58 * buildWidth,
        y: setbacks.rear,
        width: Math.round(0.42 * buildWidth * 10) / 10,
        depth: Math.round(0.35 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.15 * groundFloorAreaSqFt),
        color: roomColors.bed_2,
        features: ['Built-in ergonomic workspace', 'High STC soundproof insulation', 'Lush tree view']
      },
      {
        id: 'r_foyer',
        name: 'Entry Portico & Vestibule',
        type: 'foyer',
        zone: 'Arrival Wing',
        x: setbacks.left + 0.3 * buildWidth,
        y: setbacks.rear + 0.8 * buildDepth,
        width: Math.round(0.4 * buildWidth * 10) / 10,
        depth: Math.round(0.2 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.08 * groundFloorAreaSqFt),
        color: roomColors.foyer,
        features: ['Covered portico entrance', 'Integrated coat storage', 'Smart keyless entry']
      }
    ];

    if (bhk >= 3) {
      rooms.push({
        id: 'r_bed_3',
        name: 'Guest Bedroom / Wellness Studio',
        type: 'bed_3',
        zone: 'Flexible Wing',
        x: setbacks.left + 0.7 * buildWidth,
        y: setbacks.rear + 0.8 * buildDepth,
        width: Math.round(0.3 * buildWidth * 10) / 10,
        depth: Math.round(0.2 * buildDepth * 10) / 10,
        areaSqFt: Math.round(0.06 * groundFloorAreaSqFt),
        color: roomColors.bed_3,
        features: ['Daybed lounge', 'Yoga floor space', 'Garden view ribbon window']
      });
    }
  }

  const landscape = {
    gardenLawn: {
      x: 0,
      y: plotDepth - setbacks.front,
      width: plotWidth * 0.55,
      depth: setbacks.front,
      areaSqFt: Math.round(plotWidth * 0.55 * setbacks.front),
      type: 'Lush Bermuda Turf with Architectural Planters'
    },
    driveway: {
      x: plotWidth * 0.55,
      y: plotDepth - setbacks.front,
      width: plotWidth * 0.45,
      depth: setbacks.front,
      areaSqFt: Math.round(plotWidth * 0.45 * setbacks.front),
      type: 'Permeable Basalt Cobblestone with LED Step Strips'
    },
    rearPatio: {
      x: 0,
      y: 0,
      width: plotWidth,
      depth: setbacks.rear,
      areaSqFt: Math.round(plotWidth * setbacks.rear),
      type: 'Teak Sun Deck & Outdoor BBQ Pergola'
    },
    pool: outdoor.pool ? {
      x: setbacks.left,
      y: 0.5,
      width: Math.round(buildWidth * 0.45),
      depth: Math.max(3, setbacks.rear - 1),
      areaSqFt: Math.round(buildWidth * 0.45 * (setbacks.rear - 1)),
      type: 'Modern Infinity Reflection Pool with Heated Spa'
    } : null
  };

  const scale = 0.3048;
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

  const waypoints = [
    {
      title: '1. Aerial Establishing Drone View',
      cameraPosition: [0, 20, 26] as [number, number, number],
      target: [0, 1.5, 0] as [number, number, number],
      durationMs: 4000,
      description: 'High-altitude panoramic perspective displaying roof architecture, plot boundaries, and landscape.'
    },
    {
      title: '2. Street & Driveway Approach',
      cameraPosition: [threeMeshSpecs.landscape3D.driveway.xM, 2.0, plotDepth * scale * 0.65] as [number, number, number],
      target: [0, 1.8, 0] as [number, number, number],
      durationMs: 4500,
      description: 'Pedestrian eye-level glide entering through the landscaped frontage and paver driveway.'
    },
    {
      title: '3. Grand Entrance & Garden Threshold',
      cameraPosition: [0, 1.8, (plotDepth * scale * 0.5) - 1] as [number, number, number],
      target: [0, 2.0, (setbacks.rear + buildDepth / 2 - plotDepth / 2) * scale] as [number, number, number],
      durationMs: 4000,
      description: 'Front entryway revealing teak entry portal and landscaped flower beds.'
    },
    {
      title: '4. Great Living Hall & Dining Showcase',
      cameraPosition: [threeMeshSpecs.rooms3D[0].xM - 1, 1.7, threeMeshSpecs.rooms3D[0].zM + 2] as [number, number, number],
      target: [threeMeshSpecs.rooms3D[0].xM, 1.6, threeMeshSpecs.rooms3D[0].zM] as [number, number, number],
      durationMs: 5000,
      description: 'Immersive interior glide highlighting expansive ceiling, natural daylighting, and spatial flow.'
    },
    {
      title: '5. Gourmet Kitchen & Garden Pass-Through',
      cameraPosition: [threeMeshSpecs.rooms3D[1].xM, 1.7, threeMeshSpecs.rooms3D[1].zM + 1.8] as [number, number, number],
      target: [threeMeshSpecs.rooms3D[1].xM, 1.5, threeMeshSpecs.rooms3D[1].zM - 1] as [number, number, number],
      durationMs: 4500,
      description: 'Modern island counter, cabinetry finish, and exterior courtyard panorama.'
    },
    {
      title: '6. Master Suite & Private Terrace',
      cameraPosition: [threeMeshSpecs.rooms3D[2].xM - 1, 1.7, threeMeshSpecs.rooms3D[2].zM + 1.5] as [number, number, number],
      target: [threeMeshSpecs.rooms3D[2].xM, 1.5, threeMeshSpecs.rooms3D[2].zM] as [number, number, number],
      durationMs: 4500,
      description: 'Peaceful primary retreat featuring tranquil acoustic balance and terrace connectivity.'
    },
    {
      title: '7. Backyard Lounge & Evening Ambience',
      cameraPosition: [0, 6, -(plotDepth * scale * 0.6)] as [number, number, number],
      target: [0, 1.5, 0] as [number, number, number],
      durationMs: 4500,
      description: 'Rear perspective overlooking outdoor seating, deck, and glowing architectural facade.'
    }
  ];

  const vastuReport = vastuEnabled ? {
    isVastuCompliant: true,
    vastuScore: 94,
    grade: 'A+ (Maha Vastu Compliant)',
    brahmasthanaStatus: 'Clear & Open (Compliant)',
    roomEvaluations: rooms.map(r => ({
      id: r.id,
      name: r.name,
      type: r.type,
      zone: r.zone,
      element: r.type === 'kitchen' ? 'Fire (Agni)' : r.type === 'pooja' ? 'Water/Ether (Ishanya)' : r.type === 'master_bed' ? 'Heavy Earth (Nairitya)' : 'Cosmic Energy',
      status: 'Excellent',
      score: 95,
      explanation: `Optimally oriented in ${r.zone} quadrant respecting positive electromagnetic flow.`
    })),
    remedies: [
      {
        room: 'General Boundary',
        defect: 'Compound wall height variation',
        remedy: 'Keep South and West boundary walls slightly higher than North and East to trap auspicious solar prana.'
      }
    ],
    summary: 'Layout achieves 94/100 Vastu quotient with optimal energy flow, balance of the 5 primordial elements (Pancha Bhoota), and unobstructed Brahmasthana center.'
  } : null;

  const modernReport = {
    modernScore: 92,
    grade: 'LEED Platinum Biophilic Standard',
    daylightFactor: '3.1% Daylight Factor (Optimal Glazing)',
    solarStrategy: `${facing} Facing Solar Architecture with passive morning heating and summer thermal buffers.`,
    roomEvaluations: rooms.map(r => ({
      id: r.id,
      name: r.name,
      acousticZone: ['living', 'kitchen'].includes(r.type) ? 'Active Social Zone' : 'Restful Quiet Sanctuary',
      daylightStatus: 'High Natural Lumens (Cross-Ventilated)',
      ventilation: 'Dual-Aspect Operable Glazing',
      energyRating: 'A+',
      goldenRatioCompliance: '97% (1:1.618 Harmonized Proportions)'
    })),
    designPrinciples: [
      'Indoor-Outdoor Continuum: Seamless sliding thresholds connect interior spaces to landscaped exterior.',
      'Passive Solar Shading: Deep overhangs block harsh noon summer sun while inviting winter morning light.',
      'Acoustic Decoupling: Private sleep sanctuaries buffered by storage, hallways, and solid core doors.'
    ]
  };

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

  return {
    success: true,
    meta: {
      planId: `AS-${Math.floor(100000 + Math.random() * 900000)}`,
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
