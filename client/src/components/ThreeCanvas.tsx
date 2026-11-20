import { useEffect, useRef, type FC } from 'react';
import * as THREE from 'three';
import type { PlanData, CustomizationState } from '../types';

interface ThreeCanvasProps {
  plan: PlanData;
  customization: CustomizationState;
  activeWaypointIndex: number | null;
  isPlayingWalkthrough: boolean;
  onWaypointReached?: (index: number) => void;
}

export const ThreeCanvas: FC<ThreeCanvasProps> = ({
  plan,
  customization,
  activeWaypointIndex,
  isPlayingWalkthrough
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const houseGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  // Orbit control state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const sphericalRef = useRef({ radius: 36, theta: Math.PI / 4, phi: Math.PI / 3 });
  const targetRef = useRef(new THREE.Vector3(0, 1.5, 0));

  // Animation interpolation state
  const cameraTargetPosRef = useRef<THREE.Vector3 | null>(null);
  const cameraLookTargetRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    // 2. Camera setup
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // 4. Groups
    const houseGroup = new THREE.Group();
    scene.add(houseGroup);
    houseGroupRef.current = houseGroup;

    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    // 5. Mouse controls for free orbiting
    const handleMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || isPlayingWalkthrough) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      sphericalRef.current.theta -= deltaX * 0.006;
      sphericalRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.05, sphericalRef.current.phi - deltaY * 0.006));

      updateCameraPosition();
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (isPlayingWalkthrough) return;
      e.preventDefault();
      sphericalRef.current.radius = Math.max(8, Math.min(80, sphericalRef.current.radius + e.deltaY * 0.03));
      updateCameraPosition();
    };

    mount.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    mount.addEventListener('wheel', handleWheel, { passive: false });

    // Handle Resize
    const handleResize = () => {
      if (!mount || !renderer || !camera) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth camera interpolation during walkthrough
      if (cameraTargetPosRef.current && camera) {
        camera.position.lerp(cameraTargetPosRef.current, 0.04);
        if (cameraLookTargetRef.current) {
          targetRef.current.lerp(cameraLookTargetRef.current, 0.04);
          camera.lookAt(targetRef.current);
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      mount.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      mount.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Helper to sync camera with spherical angles
  const updateCameraPosition = () => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    const target = targetRef.current;

    cameraRef.current.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    cameraRef.current.position.y = target.y + radius * Math.cos(phi);
    cameraRef.current.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    cameraRef.current.lookAt(target);
  };

  // React to Walkthrough Waypoints
  useEffect(() => {
    if (activeWaypointIndex !== null && plan.waypoints[activeWaypointIndex]) {
      const wp = plan.waypoints[activeWaypointIndex];
      cameraTargetPosRef.current = new THREE.Vector3(...wp.cameraPosition);
      cameraLookTargetRef.current = new THREE.Vector3(...wp.target);
    } else {
      cameraTargetPosRef.current = null;
      cameraLookTargetRef.current = null;
    }
  }, [activeWaypointIndex, plan.waypoints]);

  // Rebuild 3D Meshes & Materials when plan or customization changes
  useEffect(() => {
    const scene = sceneRef.current;
    const houseGroup = houseGroupRef.current;
    const lightsGroup = lightsGroupRef.current;
    if (!scene || !houseGroup || !lightsGroup) return;

    // Clear old objects
    while (houseGroup.children.length > 0) {
      const obj = houseGroup.children[0] as THREE.Mesh;
      houseGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    while (lightsGroup.children.length > 0) {
      const light = lightsGroup.children[0];
      lightsGroup.remove(light);
    }

    // 1. Setup Lighting based on Ambience
    const isSunset = customization.lightingAmbiance === 'sunset';
    const isNight = customization.lightingAmbiance === 'night_glow';

    // Sky Background
    if (isNight) {
      scene.background = new THREE.Color(0x05070e);
      scene.fog = new THREE.FogExp2(0x05070e, 0.02);
    } else if (isSunset) {
      scene.background = new THREE.Color(0x1a1215);
      scene.fog = new THREE.FogExp2(0x1a1215, 0.015);
    } else {
      scene.background = new THREE.Color(0x0c1322);
      scene.fog = new THREE.FogExp2(0x0c1322, 0.012);
    }

    // Ambient Light
    const ambientColor = isNight ? 0x1e293b : isSunset ? 0x7c2d12 : 0x334155;
    const ambientLight = new THREE.AmbientLight(ambientColor, isNight ? 0.4 : isSunset ? 1.2 : 0.8);
    lightsGroup.add(ambientLight);

    // Sun / Moon Directional Light
    const sunColor = isNight ? 0x93c5fd : isSunset ? 0xfdba74 : 0xffffff;
    const sunLight = new THREE.DirectionalLight(sunColor, isNight ? 0.6 : isSunset ? 2.8 : 2.0);
    sunLight.position.set(20, isSunset ? 12 : 28, 15);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 100;
    const shadowD = 25;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    lightsGroup.add(sunLight);

    // 2. Materials
    const wallColor = new THREE.Color(customization.wallColorHex || '#f1f5f9');
    const accentColor = new THREE.Color(customization.accentColorHex || '#3b82f6');

    const wallMat = new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: customization.wallTexture === 'concrete' ? 0.8 : 0.4,
      metalness: 0.05
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      roughness: 0.35,
      metalness: 0.15
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x93c5fd,
      transmission: 0.88,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      reflectivity: 0.8
    });

    const woodDoorMat = new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.3
    });

    const grassMat = new THREE.MeshStandardMaterial({
      color: customization.gardenStyle === 'zen_gravel' ? 0xd1d5db : 0x22c55e,
      roughness: 0.9
    });

    const paverMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.6
    });

    const poolWaterMat = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      transmission: 0.75,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      ior: 1.33
    });

    // 3. Ground Site Plane
    const plotSpec = plan.threeMeshSpecs.plot;
    const groundGeo = new THREE.PlaneGeometry(plotSpec.widthM, plotSpec.depthM);
    const groundMesh = new THREE.Mesh(groundGeo, paverMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    houseGroup.add(groundMesh);

    // Plot Boundary Line
    const edgeGeo = new THREE.EdgesGeometry(groundGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x3b82f6, linewidth: 2 });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    edgeLine.rotation.x = -Math.PI / 2;
    edgeLine.position.y = 0.01;
    houseGroup.add(edgeLine);

    // 4. Front Garden Lawn
    const lawn = plan.threeMeshSpecs.landscape3D.lawn;
    const lawnGeo = new THREE.BoxGeometry(lawn.widthM, 0.12, lawn.depthM);
    const lawnMesh = new THREE.Mesh(lawnGeo, grassMat);
    lawnMesh.position.set(lawn.xM, 0.06, lawn.zM);
    lawnMesh.receiveShadow = true;
    houseGroup.add(lawnMesh);

    // 5. Driveway
    const drive = plan.threeMeshSpecs.landscape3D.driveway;
    const driveGeo = new THREE.BoxGeometry(drive.widthM, 0.08, drive.depthM);
    const driveMesh = new THREE.Mesh(driveGeo, paverMat);
    driveMesh.position.set(drive.xM, 0.04, drive.zM);
    driveMesh.receiveShadow = true;
    houseGroup.add(driveMesh);

    // Sleek Modern Car Silhouette in Driveway
    const carGroup = new THREE.Group();
    const carBodyGeo = new THREE.BoxGeometry(2.0, 0.7, 4.2);
    const carCabGeo = new THREE.BoxGeometry(1.8, 0.6, 2.3);
    const carMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8 });
    const carBody = new THREE.Mesh(carBodyGeo, carMat);
    carBody.position.y = 0.55;
    carBody.castShadow = true;
    const carCab = new THREE.Mesh(carCabGeo, glassMat);
    carCab.position.set(0, 1.15, -0.2);
    carCab.castShadow = true;
    carGroup.add(carBody);
    carGroup.add(carCab);
    carGroup.position.set(drive.xM, 0, drive.zM);
    houseGroup.add(carGroup);

    // 6. Swimming Pool (if enabled)
    if (plan.landscape.pool) {
      const poolW = plan.landscape.pool.width * 0.3048;
      const poolD = plan.landscape.pool.depth * 0.3048;
      const poolGeo = new THREE.BoxGeometry(poolW, 0.3, poolD);
      const poolMesh = new THREE.Mesh(poolGeo, poolWaterMat);
      poolMesh.position.set(0, 0.1, -plotSpec.depthM * 0.38);
      houseGroup.add(poolMesh);
    }

    // 7. Architectural Building Volume
    const bldg = plan.threeMeshSpecs.building;
    const wallH = bldg.heightM;

    // Foundation Plinth Slab
    const plinthGeo = new THREE.BoxGeometry(bldg.widthM + 0.4, 0.3, bldg.depthM + 0.4);
    const plinthMesh = new THREE.Mesh(plinthGeo, accentMat);
    plinthMesh.position.set(bldg.xM, 0.15, bldg.zM);
    plinthMesh.receiveShadow = true;
    houseGroup.add(plinthMesh);

    // Main Exterior Mass
    const houseGeo = new THREE.BoxGeometry(bldg.widthM, wallH, bldg.depthM);
    const houseMesh = new THREE.Mesh(houseGeo, wallMat);
    houseMesh.position.set(bldg.xM, wallH / 2 + 0.3, bldg.zM);
    houseMesh.castShadow = true;
    houseMesh.receiveShadow = true;
    houseGroup.add(houseMesh);

    // Accent Front Facade Volume
    const accentFrontGeo = new THREE.BoxGeometry(bldg.widthM * 0.38, wallH * 1.05, 0.5);
    const accentFrontMesh = new THREE.Mesh(accentFrontGeo, accentMat);
    accentFrontMesh.position.set(bldg.xM - bldg.widthM * 0.28, wallH / 2 + 0.35, bldg.zM + bldg.depthM / 2 + 0.15);
    accentFrontMesh.castShadow = true;
    houseGroup.add(accentFrontMesh);

    // Panoramic Curtain Wall Glazing (Floor-to-Ceiling Windows)
    const windowGeo = new THREE.BoxGeometry(bldg.widthM * 0.45, wallH * 0.65, 0.2);
    const windowMesh = new THREE.Mesh(windowGeo, glassMat);
    windowMesh.position.set(bldg.xM + bldg.widthM * 0.2, wallH * 0.45 + 0.3, bldg.zM + bldg.depthM / 2 + 0.08);
    windowMesh.castShadow = true;
    houseGroup.add(windowMesh);

    // Solid Teak Front Entry Portal
    const doorGeo = new THREE.BoxGeometry(1.4, 2.4, 0.18);
    const doorMesh = new THREE.Mesh(doorGeo, woodDoorMat);
    doorMesh.position.set(bldg.xM - bldg.widthM * 0.15, 1.5, bldg.zM + bldg.depthM / 2 + 0.1);
    doorMesh.castShadow = true;
    houseGroup.add(doorMesh);

    // Roof: Modern Parapet Slab or Sloped
    if (customization.roofType === 'sloped_shingle') {
      const roofGeo = new THREE.ConeGeometry(Math.max(bldg.widthM, bldg.depthM) * 0.75, 2.2, 4);
      const roofMesh = new THREE.Mesh(roofGeo, accentMat);
      roofMesh.position.set(bldg.xM, wallH + 1.4, bldg.zM);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      houseGroup.add(roofMesh);
    } else {
      // Modern Flat Parapet Slab with Overhang
      const roofGeo = new THREE.BoxGeometry(bldg.widthM + 0.8, 0.35, bldg.depthM + 0.8);
      const roofMesh = new THREE.Mesh(roofGeo, accentMat);
      roofMesh.position.set(bldg.xM, wallH + 0.48, bldg.zM);
      roofMesh.castShadow = true;
      houseGroup.add(roofMesh);
    }

    // 8. Interior Warm Room Lights (Visible in Evening / Night)
    plan.threeMeshSpecs.rooms3D.forEach((room) => {
      const roomLight = new THREE.PointLight(
        0xfbbf24,
        isNight ? 120 : isSunset ? 60 : 15,
        14,
        2
      );
      roomLight.position.set(room.xM, 2.2, room.zM);
      lightsGroup.add(roomLight);

      // Light Marker
      const lightBulb = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0xfef08a })
      );
      lightBulb.position.copy(roomLight.position);
      houseGroup.add(lightBulb);
    });

    // 9. Outdoor Landscaping Trees & Shrubs
    const addTree = (x: number, z: number) => {
      const treeGroup = new THREE.Group();
      const trunkGeo = new THREE.CylinderGeometry(0.12, 0.18, 1.8, 8);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 0.9;
      trunk.castShadow = true;

      const foliageGeo = new THREE.DodecahedronGeometry(1.2, 1);
      const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 2.4;
      foliage.castShadow = true;

      treeGroup.add(trunk);
      treeGroup.add(foliage);
      treeGroup.position.set(x, 0, z);
      houseGroup.add(treeGroup);
    };

    addTree(lawn.xM - lawn.widthM * 0.35, lawn.zM);
    addTree(lawn.xM + lawn.widthM * 0.35, lawn.zM);
    addTree(-plotSpec.widthM * 0.42, -plotSpec.depthM * 0.38);

  }, [plan, customization]);

  return (
    <div className="relative w-full h-full min-h-[480px] select-none overflow-hidden rounded-xl bg-slate-950">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Navigation Guide */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs text-slate-300 pointer-events-none">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Left-click + Drag to Orbit • Scroll to Zoom</span>
      </div>

      {/* Facing & Compass Marker */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700/60 text-xs font-mono text-cyan-400 pointer-events-none">
        <span>Road Facing:</span>
        <span className="font-bold text-white bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-800">
          {plan.plot.facing}
        </span>
      </div>
    </div>
  );
};
