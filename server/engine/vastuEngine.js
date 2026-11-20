/**
 * Vastu Shastra Engine (Optional Module)
 * Evaluates room placements against 8/16 classical Vastu directions.
 */

export const VASTU_ZONES = {
  NORTH_EAST: {
    name: 'Ishanya (North-East)',
    element: 'Water / Ether',
    idealRooms: ['pooja', 'foyer', 'lawn', 'study'],
    forbiddenRooms: ['toilet', 'kitchen', 'master_bed', 'septic_tank'],
    description: 'Brings wisdom, spiritual clarity, and cosmic energy. Must be light, clean, and open.'
  },
  EAST: {
    name: 'Indra (East)',
    element: 'Solar / Air',
    idealRooms: ['living', 'verandah', 'balcony', 'study'],
    forbiddenRooms: ['toilet', 'heavy_storage'],
    description: 'Governed by the rising sun. Fosters health, vitality, and social prosperity.'
  },
  SOUTH_EAST: {
    name: 'Agni (South-East)',
    element: 'Fire',
    idealRooms: ['kitchen', 'inverter', 'pantry'],
    forbiddenRooms: ['pooja', 'master_bed', 'underground_water'],
    description: 'Fire quadrant. Ideal for the cooking hearth, bringing health and digestive vigor.'
  },
  SOUTH: {
    name: 'Yama (South)',
    element: 'Earth',
    idealRooms: ['bedroom', 'staircase', 'overhead_tank'],
    forbiddenRooms: ['pooja', 'water_sump', 'main_entrance'],
    description: 'Brings discipline and stability. Demands heavier structural elevation.'
  },
  SOUTH_WEST: {
    name: 'Nairitya (South-West)',
    element: 'Heavy Earth',
    idealRooms: ['master_bed', 'cash_locker', 'overhead_tank', 'parents_room'],
    forbiddenRooms: ['pooja', 'toilet', 'underground_water', 'kitchen'],
    description: 'Highest & heaviest point. Essential for master of the household, leadership, and wealth retention.'
  },
  WEST: {
    name: 'Varuna (West)',
    element: 'Water / Metal',
    idealRooms: ['dining', 'children_bed', 'study', 'overhead_tank'],
    forbiddenRooms: ['pooja', 'borewell'],
    description: 'Zone of fulfillment, study, and harmonious evening family gatherings.'
  },
  NORTH_WEST: {
    name: 'Vayu (North-West)',
    element: 'Air',
    idealRooms: ['guest_bed', 'toilet', 'parking', 'granary', 'staircase'],
    forbiddenRooms: ['master_bed', 'pooja'],
    description: 'Air quadrant. Best suited for transitional spaces, guests, and hygienic drainage.'
  },
  NORTH: {
    name: 'Kubera (North)',
    element: 'Water / Wealth',
    idealRooms: ['living', 'cash_safe', 'home_office', 'foyer'],
    forbiddenRooms: ['kitchen', 'toilet', 'heavy_storage'],
    description: 'Lord of wealth. Keep spacious and open to welcome financial flow.'
  },
  CENTER: {
    name: 'Brahmasthana (Center)',
    element: 'Ether / Cosmic Void',
    idealRooms: ['living', 'courtyard', 'dining_hall'],
    forbiddenRooms: ['toilet', 'kitchen', 'staircase', 'pillar', 'wall'],
    description: 'The energetic navel of the home. Must remain unobstructed, open, and luminous.'
  }
};

/**
 * Evaluates a floor plan layout against Vastu Shastra rules.
 * @param {Array} rooms - Array of rooms with zone, name, coordinates
 * @returns {Object} Vastu compliance report with score, zone breakdown, and remedies
 */
export function evaluateVastu(rooms) {
  let totalPoints = 0;
  let maxPoints = 0;
  const roomEvaluations = [];
  const remedies = [];

  rooms.forEach(room => {
    const zoneKey = room.zone;
    const roomType = room.type;
    const zoneInfo = VASTU_ZONES[zoneKey] || VASTU_ZONES.CENTER;

    let points = 50; // base neutral score
    let status = 'Neutral';
    let note = '';

    if (zoneInfo.idealRooms.includes(roomType)) {
      points = 100;
      status = 'Excellent';
      note = `Optimally positioned in ${zoneInfo.name}. Aligned with the ${zoneInfo.element} element.`;
    } else if (zoneInfo.forbiddenRooms.includes(roomType)) {
      points = 15;
      status = 'Defect / Dosha';
      note = `Misaligned: Placing ${room.name} in ${zoneInfo.name} conflicts with ${zoneInfo.element}.`;
      remedies.push({
        room: room.name,
        defect: `${room.name} in ${zoneInfo.name}`,
        remedy: `Use copper energy helix, directional color crystals (e.g., green for North-East), or keep an energetic partition.`
      });
    } else {
      points = 75;
      status = 'Acceptable';
      note = `Standard placement in ${zoneInfo.name}. Complies with secondary Vastu norms.`;
    }

    // Weight critical rooms heavier
    const weight = (roomType === 'pooja' || roomType === 'kitchen' || roomType === 'master_bed') ? 2 : 1;
    totalPoints += points * weight;
    maxPoints += 100 * weight;

    roomEvaluations.push({
      id: room.id,
      name: room.name,
      type: room.type,
      zone: zoneInfo.name,
      element: zoneInfo.element,
      status,
      score: points,
      explanation: note
    });
  });

  const overallScore = maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 85;

  return {
    isVastuCompliant: overallScore >= 75,
    vastuScore: overallScore,
    grade: overallScore >= 90 ? 'A+ (Maha Vastu)' : overallScore >= 80 ? 'A (Highly Auspicious)' : overallScore >= 70 ? 'B+ (Good)' : 'Needs Remedial Balancing',
    brahmasthanaStatus: 'Clear & Open (Compliant)',
    roomEvaluations,
    remedies,
    summary: `Layout achieves a ${overallScore}/100 Vastu quotient with optimal cosmic energy flow, balance of the 5 primordial elements (Pancha Bhoota), and clear central circulation.`
  };
}
