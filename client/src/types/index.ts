export type FacingDirection = 'NORTH' | 'EAST' | 'SOUTH' | 'WEST' | 'NORTH_EAST' | 'NORTH_WEST' | 'SOUTH_EAST' | 'SOUTH_WEST';

export interface Room {
  id: string;
  name: string;
  type: string;
  zone: string;
  x: number;
  y: number;
  width: number;
  depth: number;
  areaSqFt: number;
  color: string;
  features: string[];
}

export interface LandscapeZone {
  x: number;
  y: number;
  width: number;
  depth: number;
  areaSqFt: number;
  type: string;
}

export interface ThreeMeshSpecs {
  plot: {
    widthM: number;
    depthM: number;
    facing: FacingDirection;
  };
  building: {
    xM: number;
    zM: number;
    widthM: number;
    depthM: number;
    heightM: number;
    floors: number;
  };
  rooms3D: Array<{
    id: string;
    name: string;
    xM: number;
    zM: number;
    widthM: number;
    depthM: number;
    heightM: number;
    color: string;
  }>;
  landscape3D: {
    lawn: { xM: number; zM: number; widthM: number; depthM: number };
    driveway: { xM: number; zM: number; widthM: number; depthM: number };
  };
}

export interface Waypoint {
  title: string;
  cameraPosition: [number, number, number];
  target: [number, number, number];
  durationMs: number;
  description: string;
}

export interface VastuReport {
  isVastuCompliant: boolean;
  vastuScore: number;
  grade: string;
  brahmasthanaStatus: string;
  roomEvaluations: Array<{
    id: string;
    name: string;
    type: string;
    zone: string;
    element: string;
    status: string;
    score: number;
    explanation: string;
  }>;
  remedies: Array<{
    room: string;
    defect: string;
    remedy: string;
  }>;
  summary: string;
}

export interface ModernReport {
  modernScore: number;
  grade: string;
  daylightFactor: string;
  solarStrategy: string;
  roomEvaluations: Array<{
    id: string;
    name: string;
    acousticZone: string;
    daylightStatus: string;
    ventilation: string;
    energyRating: string;
    goldenRatioCompliance: string;
  }>;
  designPrinciples: string[];
}

export interface PlanData {
  success: boolean;
  meta: {
    planId: string;
    generatedAt: string;
    style: string;
    facing: FacingDirection;
    floors: number;
    bhk: number;
    vastuEnabled: boolean;
  };
  plot: {
    widthFt: number;
    depthFt: number;
    totalAreaSqFt: number;
    facing: FacingDirection;
    setbacks: { front: number; rear: number; left: number; right: number };
  };
  building: {
    widthFt: number;
    depthFt: number;
    groundFloorAreaSqFt: number;
    totalBuiltUpAreaSqFt: number;
    floors: number;
  };
  rooms: Room[];
  landscape: {
    gardenLawn: LandscapeZone;
    driveway: LandscapeZone;
    rearPatio: LandscapeZone;
    pool: LandscapeZone | null;
  };
  threeMeshSpecs: ThreeMeshSpecs;
  waypoints: Waypoint[];
  vastuReport: VastuReport | null;
  modernReport: ModernReport;
  costEstimate: {
    currencyUSD: { low: number; standard: number; luxury: number };
    currencyINR: { low: number; standard: number; luxury: number };
    materialBreakdown: Record<string, number>;
  };
}

export interface CustomizationState {
  wallColorHex: string;
  wallTexture: 'smooth_stucco' | 'concrete' | 'brick' | 'wood_slat';
  accentColorHex: string;
  flooringType: 'marble' | 'oak_wood' | 'dark_walnut' | 'terrazzo';
  roofType: 'flat_parapet' | 'sloped_shingle' | 'clay_tile';
  gardenStyle: 'bermuda_lawn' | 'zen_gravel' | 'tropical_pool';
  lightingAmbiance: 'daylight' | 'sunset' | 'night_glow';
}
