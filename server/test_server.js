import { generateArchitecturalPlan } from './engine/planGenerator.js';
import { generateBlenderScript } from './engine/blenderGenerator.js';
import assert from 'node:assert';

console.log('🧪 [Test Suite] Running ArchSynth 3D Architectural Engine Tests...\n');

// Test 1: Plan Generation with Vastu ON
console.log('Test 1: Plan Generation with Vastu ON (Indian 16-Zone Matrix)...');
const vastuPlan = generateArchitecturalPlan({
  plotWidth: 30,
  plotDepth: 40,
  facing: 'EAST',
  floors: 1,
  bhk: 3,
  vastuEnabled: true,
  outdoor: { gardenLawn: true, carPorch: true, pool: false, patio: true }
});

assert.strictEqual(vastuPlan.success, true);
assert.strictEqual(vastuPlan.meta.vastuEnabled, true);
assert.ok(vastuPlan.vastuReport, 'Vastu report must exist when vastuEnabled is true');
assert.ok(vastuPlan.vastuReport.vastuScore >= 75, `Vastu score should be >= 75, got ${vastuPlan.vastuReport.vastuScore}`);
const poojaRoom = vastuPlan.rooms.find(r => r.type === 'pooja');
assert.ok(poojaRoom, 'Pooja room must exist in Vastu mode');
assert.strictEqual(poojaRoom.zone, 'NORTH_EAST', 'Pooja must be in North-East (Ishanya)');
const kitchen = vastuPlan.rooms.find(r => r.type === 'kitchen');
assert.ok(kitchen, 'Kitchen must exist');
assert.strictEqual(kitchen.zone, 'SOUTH_EAST', 'Kitchen must be in South-East (Agni)');
const masterBed = vastuPlan.rooms.find(r => r.type === 'master_bed');
assert.ok(masterBed, 'Master bedroom must exist');
assert.strictEqual(masterBed.zone, 'SOUTH_WEST', 'Master bed must be in South-West (Nairitya)');
console.log('✅ Test 1 Passed: Vastu 16-Zone layout and elemental placements verified!\n');

// Test 2: Plan Generation with Vastu OFF (International Modern Architecture)
console.log('Test 2: Plan Generation with Vastu OFF (International Modern Architecture)...');
const modernPlan = generateArchitecturalPlan({
  plotWidth: 40,
  plotDepth: 60,
  facing: 'NORTH',
  floors: 2,
  bhk: 4,
  vastuEnabled: false,
  outdoor: { gardenLawn: true, carPorch: true, pool: true, patio: true }
});

assert.strictEqual(modernPlan.success, true);
assert.strictEqual(modernPlan.meta.vastuEnabled, false);
assert.strictEqual(modernPlan.vastuReport, null, 'Vastu report should be null when vastuEnabled is false');
assert.ok(modernPlan.modernReport, 'Modern solar passive report must exist');
assert.ok(modernPlan.modernReport.modernScore >= 80, `Modern score should be >= 80, got ${modernPlan.modernReport.modernScore}`);
assert.ok(modernPlan.landscape.pool, 'Swimming pool should be defined when pool is enabled');
assert.strictEqual(modernPlan.threeMeshSpecs.building.floors, 2);
console.log('✅ Test 2 Passed: International Modern open-concept layout verified!\n');

// Test 3: Walkthrough Waypoints & Cinematic Camera Trajectory
console.log('Test 3: Walkthrough Waypoints & Cinematic Camera Trajectory...');
assert.strictEqual(vastuPlan.waypoints.length, 7, 'Must have 7 camera flythrough stations');
vastuPlan.waypoints.forEach((wp, idx) => {
  assert.ok(wp.cameraPosition.length === 3, `Waypoint ${idx} must have 3D camera position`);
  assert.ok(wp.target.length === 3, `Waypoint ${idx} must have 3D look-at target`);
  assert.ok(wp.title, `Waypoint ${idx} must have a title`);
});
console.log('✅ Test 3 Passed: 7 Cinematic camera stations verified!\n');

// Test 4: Blender Python (bpy) Procedural Script Generation
console.log('Test 4: Blender Python (bpy) Procedural Script Generation...');
const script = generateBlenderScript(modernPlan, {
  wallColorHex: '#1e293b',
  accentColorHex: '#3b82f6',
  roofType: 'flat_parapet',
  lightingAmbiance: 'sunset'
});

assert.ok(script.includes('import bpy'), 'Blender script must import bpy');
assert.ok(script.includes('create_material'), 'Blender script must define material creation helper');
assert.ok(script.includes('camera_add'), 'Blender script must add animated camera');
assert.ok(script.includes('keyframes = ['), 'Blender script must animate camera keyframes');
assert.ok(script.includes('Wall_Stucco'), 'Blender script must create architectural wall materials');
console.log('✅ Test 4 Passed: Executable Blender Python script validated!\n');

console.log('🎉 ALL 4 ARCHSYNTH 3D ARCHITECTURAL TESTS PASSED PERFECTLY!');
