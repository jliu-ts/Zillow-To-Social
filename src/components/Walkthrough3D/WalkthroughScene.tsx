import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  createHerringboneWoodTexture,
  createCalacattaMarbleTexture,
  createFlutedWoodTexture,
  createTravertineTexture,
  createAcousticFabricTexture,
  createWaterRippleTexture,
} from '../../utils/proceduralTextures';
import { WalkthroughDock } from './WalkthroughDock';
import { FloorRadar } from './FloorRadar';
import { PropertyListing } from '../../types/property';
import { Info, X, Camera, Compass } from '@phosphor-icons/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WalkthroughSceneProps {
  listing: PropertyListing;
}

export type RoomId = 'living' | 'kitchen' | 'primary' | 'bath' | 'terrace';
export type CameraMode = 'walk' | 'cinematic' | 'dollhouse';
export type LightingPreset = 'day' | 'sunset' | 'night';

export interface HotspotData {
  id: string;
  roomId: RoomId;
  position: [number, number, number];
  title: string;
  tag: string;
  description: string;
  specs: string[];
}

export const HOTSPOTS: HotspotData[] = [
  {
    id: 'hs-fireplace',
    roomId: 'living',
    position: [0, 1.8, -7.8],
    title: 'Dual-Sided Linear Gas Fireplace',
    tag: 'Great Room Feature',
    description: 'An 84-inch architectural linear flame enclosed in low-iron tempered glass with a floating honed basalt hearth and integrated heat-dispersal louvers.',
    specs: ['84" Direct-Vent Linear Burner', 'Honed Basalt Hearth Plinth', 'Crestron Smart Wall Control'],
  },
  {
    id: 'hs-island',
    roomId: 'kitchen',
    position: [14, 1.6, -2],
    title: '14-Foot Calacatta Gold Waterfall Island',
    tag: 'Chef’s Kitchen',
    description: 'Bespoke book-matched Italian marble with double mitered waterfall legs, flush Gaggenau induction cooktop, and hidden pop-up electrical columns.',
    specs: ['Book-matched Calacatta Gold', 'Gaggenau Flush Induction Hub', 'Integrated Prep Sink & Disposal'],
  },
  {
    id: 'hs-primary',
    roomId: 'primary',
    position: [-14, 1.6, -2.5],
    title: 'Primary Sanctuary & Glass Wall',
    tag: 'Primary Suite',
    description: 'Floating European white oak platform bed facing a 24-foot motorized Fleetwood glass wall opening to a private sunrise terrace.',
    specs: ['Custom Slatted Upholstered Headboard', 'Fleetwood Vanishing Pocket Doors', 'Bespoke Fluted Nightstands'],
  },
  {
    id: 'hs-tub',
    roomId: 'bath',
    position: [-14, 1.4, 11],
    title: 'Volcanic Limestone Soaking Tub',
    tag: 'Primary Spa Bath',
    description: 'Monolithic ergonomic egg tub cast from British volcanic limestone with floor-mounted Dornbracht matte black spout and heated travertine flooring.',
    specs: ['Cast Volcanic Limestone', 'Dornbracht Architectural Fixtures', 'Heated Radiant Terrazzo Plinth'],
  },
  {
    id: 'hs-pool',
    roomId: 'terrace',
    position: [0, 1.2, 14],
    title: 'Zero-Edge Sunset Infinity Pool',
    tag: 'Outdoor Pavilion',
    description: 'Heated saltwater infinity pool with glass mosaic tile coping, submerged baja tanning shelf, and unobstructed 270-degree panoramic horizon views.',
    specs: ['Zero-Edge Perimeter Trough', 'Submerged Teak Baja Sunbed', 'Underwater Color-Coded LEDs'],
  },
];

const ROOM_VIEWPOINTS: Record<RoomId, { camPos: [number, number, number]; lookAt: [number, number, number]; name: string }> = {
  living: { camPos: [0, 2.1, 4.5], lookAt: [0, 1.8, -8], name: 'Grand Great Room' },
  kitchen: { camPos: [14, 2.1, 4.0], lookAt: [14, 1.7, -4], name: 'Chef’s Island Kitchen' },
  primary: { camPos: [-14, 2.1, 3.5], lookAt: [-14, 1.7, -6], name: 'Primary Suite' },
  bath: { camPos: [-14, 2.1, 7.0], lookAt: [-14, 1.6, 12], name: 'Spa Bath Sanctuary' },
  terrace: { camPos: [0, 2.2, 8.5], lookAt: [0, 1.5, 18], name: 'Sunset Pool Terrace' },
};

export const WalkthroughScene: React.FC<WalkthroughSceneProps> = ({ listing }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [activeRoom, setActiveRoom] = useState<RoomId>('living');
  const [cameraMode, setCameraMode] = useState<CameraMode>('walk');
  const [lightingPreset, setLightingPreset] = useState<LightingPreset>('sunset');
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotData | null>(null);
  const [showMinimap, setShowMinimap] = useState(true);

  // Mutable refs for Three.js render loop to avoid GC
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const lightsRef = useRef<{
    sun: THREE.DirectionalLight;
    hemi: THREE.HemisphereLight;
    interiorGroup: THREE.Group;
    fireLight: THREE.PointLight;
  } | null>(null);

  // Camera animation target state
  const camCurrentPos = useRef(new THREE.Vector3(0, 2.1, 4.5));
  const camTargetPos = useRef(new THREE.Vector3(0, 2.1, 4.5));
  const camCurrentLook = useRef(new THREE.Vector3(0, 1.8, -8));
  const camTargetLook = useRef(new THREE.Vector3(0, 1.8, -8));

  // Pointer drag controls for walk mode
  const isPointerDown = useRef(false);
  const prevPointer = useRef({ x: 0, y: 0 });
  const yawPitch = useRef({ yaw: 0, pitch: 0 });

  // Cinematic timer
  const cinematicTimeRef = useRef(0);

  // Setup Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Renderer setup complying with Three.js skill
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(65, width / height, 0.1, 250);
    camera.position.set(0, 2.1, 4.5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Room Environment Map using PMREMGenerator
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 2. Procedural Textures & Materials
    const woodFloorTex = createHerringboneWoodTexture();
    const marbleTex = createCalacattaMarbleTexture();
    const flutedWoodTex = createFlutedWoodTexture();
    const travertineTex = createTravertineTexture();
    const fabricTex = createAcousticFabricTexture();
    const waterTex = createWaterRippleTexture();

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    woodFloorTex.anisotropy = maxAnisotropy;
    marbleTex.anisotropy = maxAnisotropy;
    flutedWoodTex.anisotropy = maxAnisotropy;
    travertineTex.anisotropy = maxAnisotropy;

    // Materials
    const floorMat = new THREE.MeshStandardMaterial({
      map: woodFloorTex,
      roughness: 0.35,
      metalness: 0.05,
    });

    const marbleMat = new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.15,
      metalness: 0.1,
    });

    const flutedWoodMat = new THREE.MeshStandardMaterial({
      map: flutedWoodTex,
      roughness: 0.55,
      metalness: 0.05,
    });

    const travertineMat = new THREE.MeshStandardMaterial({
      map: travertineTex,
      roughness: 0.7,
      metalness: 0.05,
    });

    const fabricMat = new THREE.MeshStandardMaterial({
      map: fabricTex,
      roughness: 0.85,
      metalness: 0.02,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0x9b784a,
      roughness: 0.25,
      metalness: 0.85,
    });

    const blackSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.4,
      metalness: 0.7,
    });

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      roughness: 0.05,
      ior: 1.5,
      thickness: 0.8,
      depthWrite: false,
    });

    const waterMat = new THREE.MeshStandardMaterial({
      map: waterTex,
      color: 0x24a0bd,
      roughness: 0.1,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85,
    });

    // 3. Lighting Rig
    const sunLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    sunLight.position.set(18, 25, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 80;
    const d = 28;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0xbad2e8, 0x3d352e, 0.9);
    scene.add(hemiLight);

    const interiorGroup = new THREE.Group();
    scene.add(interiorGroup);

    // Living room linear fire point light
    const fireLight = new THREE.PointLight(0xff7722, 1.8, 10);
    fireLight.position.set(0, 1.2, -7.5);
    scene.add(fireLight);

    lightsRef.current = {
      sun: sunLight,
      hemi: hemiLight,
      interiorGroup,
      fireLight,
    };

    // Horizon fog
    scene.fog = new THREE.FogExp2(0x1a1c22, 0.012);
    scene.background = new THREE.Color(0x1a1c22);

    // 4. ARCHITECTURAL STRUCTURE & ROOMS (Composite 3-12 parts per subject)

    // Main floor base
    const mainFloorGeo = new THREE.PlaneGeometry(42, 28);
    const mainFloorMesh = new THREE.Mesh(mainFloorGeo, floorMat);
    mainFloorMesh.rotation.x = -Math.PI / 2;
    mainFloorMesh.position.set(0, 0, 0);
    mainFloorMesh.receiveShadow = true;
    scene.add(mainFloorMesh);

    // Terrace floor
    const terraceGeo = new THREE.PlaneGeometry(36, 16);
    const terraceMesh = new THREE.Mesh(terraceGeo, travertineMat);
    terraceMesh.rotation.x = -Math.PI / 2;
    terraceMesh.position.set(0, -0.02, 16);
    terraceMesh.receiveShadow = true;
    scene.add(terraceMesh);

    // Ceiling with architectural white oak slats (Composite group)
    const ceilingGroup = new THREE.Group();
    const ceilingBase = new THREE.Mesh(
      new THREE.BoxGeometry(42, 0.2, 24),
      new THREE.MeshStandardMaterial({ color: 0x262320, roughness: 0.9 })
    );
    ceilingBase.position.set(0, 4.4, 0);
    ceilingGroup.add(ceilingBase);

    // Extruded cedar slats on ceiling
    const slatGeo = new THREE.BoxGeometry(0.08, 0.08, 22);
    const slatMat = flutedWoodMat;
    for (let sx = -19; sx <= 19; sx += 0.5) {
      const slat = new THREE.Mesh(slatGeo, slatMat);
      slat.position.set(sx, 4.3, 0);
      ceilingGroup.add(slat);
    }
    scene.add(ceilingGroup);

    // Recessed LED lights in ceiling
    for (let rx = -14; rx <= 14; rx += 7) {
      for (let rz = -6; rz <= 6; rz += 6) {
        const canLight = new THREE.PointLight(0xffe8cf, 0.8, 8);
        canLight.position.set(rx, 4.1, rz);
        interiorGroup.add(canLight);

        // Visual trim ring
        const ring = new THREE.Mesh(
          new THREE.CylinderGeometry(0.12, 0.12, 0.02, 16),
          bronzeMat
        );
        ring.position.set(rx, 4.28, rz);
        scene.add(ring);
      }
    }

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xeeeeea,
      roughness: 0.85,
      metalness: 0.02,
    });

    // Back perimeter wall (behind living room)
    const backWall = new THREE.Mesh(new THREE.BoxGeometry(42, 4.4, 0.4), wallMat);
    backWall.position.set(0, 2.2, -8.6);
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Dividing room wing partitions
    const divider1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.4, 16), wallMat);
    divider1.position.set(-7, 2.2, 0);
    divider1.castShadow = true;
    divider1.receiveShadow = true;
    scene.add(divider1);

    const divider2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 4.4, 16), wallMat);
    divider2.position.set(7, 2.2, 0);
    divider2.castShadow = true;
    divider2.receiveShadow = true;
    scene.add(divider2);

    // Floor-to-ceiling glass pocket doors to the terrace
    const glassWall = new THREE.Mesh(new THREE.BoxGeometry(38, 4.2, 0.08), glassMat);
    glassWall.position.set(0, 2.1, 8);
    scene.add(glassWall);

    // Glass frames (bronze columns)
    for (let gx = -18; gx <= 18; gx += 6) {
      const frameCol = new THREE.Mesh(new THREE.BoxGeometry(0.12, 4.3, 0.16), blackSteelMat);
      frameCol.position.set(gx, 2.15, 8);
      scene.add(frameCol);
    }

    // ==========================================
    // ROOM 1: GRAND LIVING ROOM (Center: 0, 0)
    // Composite 8-part Modular Sectional Sofa
    // ==========================================
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(0, 0, 0);

    // Base plinth
    const sofaPlinth = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.15, 3.2), blackSteelMat);
    sofaPlinth.position.set(0, 0.075, 0);
    sofaPlinth.castShadow = true;
    sofaGroup.add(sofaPlinth);

    // Main seat cushion block
    const seat1 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.8), fabricMat);
    seat1.position.set(-1.2, 0.32, 0.5);
    seat1.castShadow = true;
    seat1.receiveShadow = true;
    sofaGroup.add(seat1);

    const seat2 = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 1.8), fabricMat);
    seat2.position.set(1.2, 0.32, 0.5);
    seat2.castShadow = true;
    seat2.receiveShadow = true;
    sofaGroup.add(seat2);

    // Chaise section
    const chaise = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.35, 2.8), fabricMat);
    chaise.position.set(-1.8, 0.32, -0.6);
    chaise.castShadow = true;
    sofaGroup.add(chaise);

    // Backrests
    const back1 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.5, 0.4), fabricMat);
    back1.position.set(0.1, 0.65, 1.4);
    back1.castShadow = true;
    sofaGroup.add(back1);

    // Lumbar accent pillows
    const pillowGeo = new THREE.BoxGeometry(0.7, 0.35, 0.2);
    const pillowMat = new THREE.MeshStandardMaterial({ color: 0x8c5b38, roughness: 0.7 });
    for (let p = -1.2; p <= 1.2; p += 1.2) {
      const pillow = new THREE.Mesh(pillowGeo, pillowMat);
      pillow.position.set(p, 0.65, 1.15);
      pillow.rotation.x = -0.15;
      sofaGroup.add(pillow);
    }
    scene.add(sofaGroup);

    // Composite Cocktail Table (Calacatta marble slab + matte steel legs + glass vase)
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.2, 0, -1.8);
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.3), marbleMat);
    tableTop.position.set(0, 0.42, 0);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    tableGroup.add(tableTop);

    // Sled legs
    const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 1.1), blackSteelMat);
    leg1.position.set(-0.95, 0.18, 0);
    leg1.castShadow = true;
    tableGroup.add(leg1);

    const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.36, 1.1), blackSteelMat);
    leg2.position.set(0.95, 0.18, 0);
    leg2.castShadow = true;
    tableGroup.add(leg2);

    // Glass vase with dried palm accent on table
    const vase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.4, 16), glassMat);
    vase.position.set(0.4, 0.66, 0.1);
    tableGroup.add(vase);

    scene.add(tableGroup);

    // Linear Fireplace Feature Wall
    const fpWallGroup = new THREE.Group();
    fpWallGroup.position.set(0, 0, -8.2);

    const fpBasalt = new THREE.Mesh(
      new THREE.BoxGeometry(8, 3.8, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x2a2c30, roughness: 0.9 })
    );
    fpBasalt.position.set(0, 1.9, 0);
    fpBasalt.receiveShadow = true;
    fpWallGroup.add(fpBasalt);

    // Fireplace niche cut
    const fpFireBox = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.7, 0.4),
      new THREE.MeshBasicMaterial({ color: 0x050505 })
    );
    fpFireBox.position.set(0, 1.1, 0.18);
    fpWallGroup.add(fpFireBox);

    // Animated flame bar mesh
    const flameGeo = new THREE.BoxGeometry(3.6, 0.18, 0.1);
    const flameMat = new THREE.MeshBasicMaterial({ color: 0xffaa33 });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0, 0.95, 0.22);
    fpWallGroup.add(flameMesh);

    // Floating granite hearth
    const hearth = new THREE.Mesh(new THREE.BoxGeometry(9, 0.25, 1.2), marbleMat);
    hearth.position.set(0, 0.35, 0.4);
    hearth.castShadow = true;
    fpWallGroup.add(hearth);

    // Large fine-art abstract canvas above fireplace
    const artCanvas = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, 1.6, 0.08),
      new THREE.MeshStandardMaterial({
        color: 0xdfd9ce,
        roughness: 0.8,
        metalness: 0.1,
      })
    );
    artCanvas.position.set(0, 2.7, 0.32);
    artCanvas.castShadow = true;
    fpWallGroup.add(artCanvas);

    scene.add(fpWallGroup);

    // ==========================================
    // ROOM 2: CHEF'S KITCHEN & WATERFALL ISLAND (Right: 14, 0)
    // ==========================================
    const kitchenGroup = new THREE.Group();
    kitchenGroup.position.set(14, 0, 0);

    // Calacatta Marble Waterfall Island (Composite: Top + Left waterfall + Right waterfall + Bar)
    const islandTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.18, 2.2), marbleMat);
    islandTop.position.set(0, 1.05, -2);
    islandTop.castShadow = true;
    islandTop.receiveShadow = true;
    kitchenGroup.add(islandTop);

    const islandLeftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.96, 2.2), marbleMat);
    islandLeftLeg.position.set(-2.51, 0.48, -2);
    islandLeftLeg.castShadow = true;
    kitchenGroup.add(islandLeftLeg);

    const islandRightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.96, 2.2), marbleMat);
    islandRightLeg.position.set(2.51, 0.48, -2);
    islandRightLeg.castShadow = true;
    kitchenGroup.add(islandRightLeg);

    // Undermount sink and gooseneck faucet
    const faucetArch = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.02, 12, 24, Math.PI), blackSteelMat);
    faucetArch.position.set(-0.6, 1.35, -2);
    faucetArch.rotation.z = Math.PI / 2;
    kitchenGroup.add(faucetArch);

    // Flush Induction cooktop on island
    const cooktop = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.02, 1.0),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.9 })
    );
    cooktop.position.set(1.2, 1.15, -2);
    kitchenGroup.add(cooktop);

    // 3 Modern Barstools
    for (let bi = -1.6; bi <= 1.6; bi += 1.6) {
      const stoolGroup = new THREE.Group();
      stoolGroup.position.set(bi, 0, -0.6);

      // Stool cushion
      const stoolSeat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36, 0.36, 0.08, 24),
        new THREE.MeshStandardMaterial({ color: 0x6e4c2f, roughness: 0.6 })
      );
      stoolSeat.position.set(0, 0.75, 0);
      stoolSeat.castShadow = true;
      stoolGroup.add(stoolSeat);

      // 4 tapered legs
      const stoolLegGeo = new THREE.CylinderGeometry(0.015, 0.025, 0.72, 8);
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        const sLeg = new THREE.Mesh(stoolLegGeo, blackSteelMat);
        sLeg.position.set(Math.cos(angle) * 0.22, 0.36, Math.sin(angle) * 0.22);
        stoolGroup.add(sLeg);
      }
      kitchenGroup.add(stoolGroup);
    }

    // Trio of Brass Teardrop Pendants above island
    for (let pi = -1.5; pi <= 1.5; pi += 1.5) {
      const pendantGroup = new THREE.Group();
      pendantGroup.position.set(pi, 4.3, -2);

      const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.8, 8), blackSteelMat);
      wire.position.set(0, -0.9, 0);
      pendantGroup.add(wire);

      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.35, 24, 1, true), bronzeMat);
      shade.position.set(0, -1.8, 0);
      shade.rotation.x = Math.PI;
      pendantGroup.add(shade);

      const pendantLight = new THREE.PointLight(0xffdfa8, 0.9, 5);
      pendantLight.position.set(0, -1.9, 0);
      interiorGroup.add(pendantLight);

      kitchenGroup.add(pendantGroup);
    }

    // Back fluted oak cabinetry wall
    const cabWall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.8, 0.7), flutedWoodMat);
    cabWall.position.set(0, 1.9, -7.8);
    cabWall.castShadow = true;
    kitchenGroup.add(cabWall);

    scene.add(kitchenGroup);

    // ==========================================
    // ROOM 3: PRIMARY PENTHOUSE SUITE (Left: -14, 0)
    // ==========================================
    const suiteGroup = new THREE.Group();
    suiteGroup.position.set(-14, 0, 0);

    // King Platform Bed (Platform + Headboard + Mattress + Pillows + Blanket)
    const bedPlinth = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 3.8), flutedWoodMat);
    bedPlinth.position.set(0, 0.125, -4.5);
    bedPlinth.castShadow = true;
    suiteGroup.add(bedPlinth);

    // Fluted acoustic headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.0, 0.18), fabricMat);
    headboard.position.set(0, 1.1, -6.3);
    headboard.castShadow = true;
    suiteGroup.add(headboard);

    // Plush mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 3.4), fabricMat);
    mattress.position.set(0, 0.45, -4.5);
    mattress.castShadow = true;
    suiteGroup.add(mattress);

    // Duvet fold
    const duvet = new THREE.Mesh(
      new THREE.BoxGeometry(3.24, 0.2, 2.2),
      new THREE.MeshStandardMaterial({ color: 0xeee8dd, roughness: 0.9 })
    );
    duvet.position.set(0, 0.6, -3.8);
    suiteGroup.add(duvet);

    // 4 pillows
    const pillowBedGeo = new THREE.BoxGeometry(0.85, 0.22, 0.5);
    const pillowBedMat = new THREE.MeshStandardMaterial({ color: 0xfcfaf5, roughness: 0.8 });
    for (let px = -1.0; px <= 1.0; px += 0.9) {
      const p1 = new THREE.Mesh(pillowBedGeo, pillowBedMat);
      p1.position.set(px, 0.72, -5.7);
      suiteGroup.add(p1);
    }

    // Floating Nightstands & Brass Table Lamps
    for (let nx of [-2.3, 2.3]) {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.25, 0.6), flutedWoodMat);
      stand.position.set(nx, 0.55, -6.1);
      stand.castShadow = true;
      suiteGroup.add(stand);

      // Lamp
      const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16), bronzeMat);
      lampBase.position.set(nx, 0.85, -6.1);
      suiteGroup.add(lampBase);

      const lampShade = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.3, 24), fabricMat);
      lampShade.position.set(nx, 1.15, -6.1);
      suiteGroup.add(lampShade);

      const nightLight = new THREE.PointLight(0xffd5a0, 0.6, 4);
      nightLight.position.set(nx, 1.15, -6.1);
      interiorGroup.add(nightLight);
    }

    scene.add(suiteGroup);

    // ==========================================
    // ROOM 4: SPA SANCTUARY BATH (Left rear: -14, 11)
    // ==========================================
    const bathGroup = new THREE.Group();
    bathGroup.position.set(-14, 0, 11);

    // Freestanding Volcanic Stone Soaking Tub (Lathe geometry oval)
    const tubPoints: THREE.Vector2[] = [];
    for (let deg = 0; deg <= 180; deg += 10) {
      const rad = (deg * Math.PI) / 180;
      tubPoints.push(new THREE.Vector2(Math.sin(rad) * 0.65 + 0.3, -Math.cos(rad) * 0.4 + 0.4));
    }
    const tubGeo = new THREE.LatheGeometry(tubPoints, 32);
    const tubMat = new THREE.MeshStandardMaterial({ color: 0x222428, roughness: 0.3, metalness: 0.1 });
    const tub = new THREE.Mesh(tubGeo, tubMat);
    tub.position.set(0, 0.05, 0);
    tub.scale.set(1.4, 0.95, 0.9);
    tub.castShadow = true;
    bathGroup.add(tub);

    // Floor mounted black matte tub filler
    const tubFiller = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 12), blackSteelMat);
    tubFiller.position.set(-1.1, 0.55, 0);
    bathGroup.add(tubFiller);

    // Floating Double Vanity
    const vanityTop = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.22, 1.2), travertineMat);
    vanityTop.position.set(0, 0.95, -4.2);
    vanityTop.castShadow = true;
    bathGroup.add(vanityTop);

    // Twin rectangular stone sinks
    for (let vx of [-1.2, 1.2]) {
      const sink = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.14, 0.6), marbleMat);
      sink.position.set(vx, 1.05, -4.2);
      bathGroup.add(sink);
    }

    // LED Backlit Mirror
    const mirror = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, 1.4, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x999999, roughness: 0.05, metalness: 0.95 })
    );
    mirror.position.set(0, 2.1, -4.7);
    bathGroup.add(mirror);

    const mirrorBacklight = new THREE.PointLight(0xffeedd, 1.0, 5);
    mirrorBacklight.position.set(0, 2.1, -4.5);
    interiorGroup.add(mirrorBacklight);

    scene.add(bathGroup);

    // ==========================================
    // ROOM 5: SUNSET INFINITY POOL TERRACE (Center rear: 0, 16)
    // ==========================================
    const terraceGroup = new THREE.Group();
    terraceGroup.position.set(0, 0, 16);

    // Zero-edge Pool Basin
    const poolBasin = new THREE.Mesh(
      new THREE.BoxGeometry(18, 1.4, 7),
      new THREE.MeshStandardMaterial({ color: 0x1b4352, roughness: 0.2 })
    );
    poolBasin.position.set(0, -0.65, 0);
    terraceGroup.add(poolBasin);

    // Water Surface
    const poolWater = new THREE.Mesh(new THREE.PlaneGeometry(17.6, 6.6), waterMat);
    poolWater.rotation.x = -Math.PI / 2;
    poolWater.position.set(0, -0.05, 0);
    terraceGroup.add(poolWater);

    // Underwater pool glow light
    const poolLight = new THREE.PointLight(0x00e1ff, 2.2, 12);
    poolLight.position.set(0, -0.4, 0);
    terraceGroup.add(poolLight);

    // Pair of Teak & Ivory Sun Loungers
    for (let lx of [-4.5, 4.5]) {
      const lounger = new THREE.Group();
      lounger.position.set(lx, 0, -5);

      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.12, 2.4), flutedWoodMat);
      frame.position.set(0, 0.12, 0);
      frame.castShadow = true;
      lounger.add(frame);

      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.14, 2.3), fabricMat);
      cushion.position.set(0, 0.25, 0);
      lounger.add(cushion);

      terraceGroup.add(lounger);
    }

    // Modern glass balustrade railing
    const railGlass = new THREE.Mesh(new THREE.BoxGeometry(32, 1.2, 0.06), glassMat);
    railGlass.position.set(0, 0.6, 4.2);
    terraceGroup.add(railGlass);

    scene.add(terraceGroup);

    // Distant mountain horizon silhouette
    const horizonGroup = new THREE.Group();
    for (let m = -80; m <= 80; m += 20) {
      const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(18 + Math.abs(Math.sin(m)) * 8, 22 + Math.abs(Math.cos(m)) * 14, 5),
        new THREE.MeshStandardMaterial({ color: 0x16171d, roughness: 0.95 })
      );
      mountain.position.set(m, 4, 85 + Math.sin(m * 0.2) * 15);
      horizonGroup.add(mountain);
    }
    scene.add(horizonGroup);

    // 5. INTERACTIVE 3D HOTSPOTS
    // Create animated beacon rings & pins for raycasting
    const hotspotObjects: THREE.Group[] = [];
    HOTSPOTS.forEach((hs) => {
      const pinGroup = new THREE.Group();
      pinGroup.position.set(...hs.position);
      pinGroup.name = `hotspot-${hs.id}`;
      (pinGroup as any).hotspotData = hs;

      // Outer animated ring
      const ringMesh = new THREE.Mesh(
        new THREE.RingGeometry(0.25, 0.32, 32),
        new THREE.MeshBasicMaterial({ color: 0xeab308, side: THREE.DoubleSide })
      );
      ringMesh.rotation.x = Math.PI / 2;
      pinGroup.add(ringMesh);

      // Core sphere
      const coreMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.8 })
      );
      coreMesh.position.y = 0.15;
      pinGroup.add(coreMesh);

      scene.add(pinGroup);
      hotspotObjects.push(pinGroup);
    });

    // Raycaster for clicking hotspots
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerClick = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let parent = hit.object.parent;
        while (parent && !parent.name.startsWith('hotspot-') && parent !== scene) {
          parent = parent.parent;
        }
        if (parent && parent.name.startsWith('hotspot-')) {
          const data = (parent as any).hotspotData as HotspotData;
          if (data) {
            setSelectedHotspot(data);
            return;
          }
        }
      }
    };

    container.addEventListener('click', handlePointerClick);

    // Mouse drag handlers for first-person orientation
    const handlePointerDown = (e: MouseEvent) => {
      isPointerDown.current = true;
      prevPointer.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (!isPointerDown.current) return;
      const dx = e.clientX - prevPointer.current.x;
      const dy = e.clientY - prevPointer.current.y;
      prevPointer.current = { x: e.clientX, y: e.clientY };

      yawPitch.current.yaw -= dx * 0.003;
      yawPitch.current.pitch = Math.max(-0.6, Math.min(0.6, yawPitch.current.pitch - dy * 0.003));
    };

    const handlePointerUp = () => {
      isPointerDown.current = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // 6. ANIMATION RENDER LOOP with Lossless 60fps & Exponential Damping
    const clock = new THREE.Clock();
    const _vecScratch = new THREE.Vector3();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Dynamic flame flicker & water animation
      if (flameMesh) {
        flameMesh.scale.y = 1 + Math.sin(elapsed * 18) * 0.25;
        if (lightsRef.current?.fireLight) {
          lightsRef.current.fireLight.intensity = 1.6 + Math.sin(elapsed * 12) * 0.4;
        }
      }

      // Animate hotspot beacon pulses
      hotspotObjects.forEach((hObj, idx) => {
        hObj.position.y = HOTSPOTS[idx].position[1] + Math.sin(elapsed * 3 + idx) * 0.08;
        const ring = hObj.children[0];
        if (ring) {
          ring.rotation.z += 0.02;
          const s = 1 + Math.sin(elapsed * 4 + idx) * 0.15;
          ring.scale.set(s, s, s);
        }
      });

      // Camera motion logic based on cameraMode
      if (cameraMode === 'cinematic') {
        cinematicTimeRef.current += delta * 0.25;
        const t = cinematicTimeRef.current;
        // Fly through rooms along smooth bezier path
        const cx = Math.sin(t) * 12;
        const cz = Math.cos(t * 0.7) * 8 + 4;
        const cy = 2.4 + Math.sin(t * 0.5) * 0.6;
        camTargetPos.current.set(cx, cy, cz);
        camTargetLook.current.set(Math.sin(t + 0.5) * 6, 1.8, Math.cos((t + 0.5) * 0.7) * 6);
      } else if (cameraMode === 'dollhouse') {
        camTargetPos.current.set(0, 24, 26);
        camTargetLook.current.set(0, 1.5, 3);
      } else {
        // 'walk' mode: apply look yaw/pitch offset
        const baseLook = ROOM_VIEWPOINTS[activeRoom].lookAt;
        _vecScratch.set(
          baseLook[0] + Math.sin(yawPitch.current.yaw) * 10,
          baseLook[1] + yawPitch.current.pitch * 6,
          baseLook[2] - Math.cos(yawPitch.current.yaw) * 10
        );
        camTargetLook.current.copy(_vecScratch);
      }

      // Silky-Smooth Exponential Damping: THREE.MathUtils.damp
      camCurrentPos.current.x = THREE.MathUtils.damp(camCurrentPos.current.x, camTargetPos.current.x, 3.5, delta);
      camCurrentPos.current.y = THREE.MathUtils.damp(camCurrentPos.current.y, camTargetPos.current.y, 3.5, delta);
      camCurrentPos.current.z = THREE.MathUtils.damp(camCurrentPos.current.z, camTargetPos.current.z, 3.5, delta);

      camCurrentLook.current.x = THREE.MathUtils.damp(camCurrentLook.current.x, camTargetLook.current.x, 4.0, delta);
      camCurrentLook.current.y = THREE.MathUtils.damp(camCurrentLook.current.y, camTargetLook.current.y, 4.0, delta);
      camCurrentLook.current.z = THREE.MathUtils.damp(camCurrentLook.current.z, camTargetLook.current.z, 4.0, delta);

      camera.position.copy(camCurrentPos.current);
      camera.lookAt(camCurrentLook.current);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handlePointerClick);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);

      renderer.dispose();
      woodFloorTex.dispose();
      marbleTex.dispose();
      flutedWoodTex.dispose();
      travertineTex.dispose();
      fabricTex.dispose();
      waterTex.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update room position
  useEffect(() => {
    if (cameraMode === 'walk') {
      const target = ROOM_VIEWPOINTS[activeRoom];
      camTargetPos.current.set(...target.camPos);
      yawPitch.current = { yaw: 0, pitch: 0 };
    }
  }, [activeRoom, cameraMode]);

  // Update Lighting Presets (Day, Sunset, Night)
  useEffect(() => {
    const scene = sceneRef.current;
    const lights = lightsRef.current;
    if (!scene || !lights) return;

    if (lightingPreset === 'sunset') {
      // Warm golden hour
      lights.sun.color.setHex(0xff9944);
      lights.sun.intensity = 2.8;
      lights.sun.position.set(22, 10, 18);
      lights.hemi.color.setHex(0xffaa77);
      lights.hemi.groundColor.setHex(0x332211);
      lights.hemi.intensity = 0.9;
      scene.background = new THREE.Color(0x351d1a);
      scene.fog = new THREE.FogExp2(0x351d1a, 0.012);
      lights.interiorGroup.children.forEach((l: any) => {
        if (l.isLight) l.intensity = 1.0;
      });
    } else if (lightingPreset === 'day') {
      // Crisp daylight
      lights.sun.color.setHex(0xfff8ee);
      lights.sun.intensity = 2.5;
      lights.sun.position.set(12, 28, 8);
      lights.hemi.color.setHex(0xd0e8ff);
      lights.hemi.groundColor.setHex(0x554433);
      lights.hemi.intensity = 1.2;
      scene.background = new THREE.Color(0x7695b2);
      scene.fog = new THREE.FogExp2(0x7695b2, 0.008);
      lights.interiorGroup.children.forEach((l: any) => {
        if (l.isLight) l.intensity = 0.3;
      });
    } else {
      // Deep blue twilight/night
      lights.sun.color.setHex(0x112244);
      lights.sun.intensity = 0.4;
      lights.sun.position.set(-15, 8, 15);
      lights.hemi.color.setHex(0x16223d);
      lights.hemi.groundColor.setHex(0x080911);
      lights.hemi.intensity = 0.4;
      scene.background = new THREE.Color(0x0c0f16);
      scene.fog = new THREE.FogExp2(0x0c0f16, 0.014);
      lights.interiorGroup.children.forEach((l: any) => {
        if (l.isLight) l.intensity = 1.6;
      });
    }
  }, [lightingPreset]);

  return (
    <div className="relative w-full flex-1 h-[calc(100dvh-150px)] min-h-[500px] overflow-hidden bg-neutral-950 select-none">
      {/* 3D WebGL Mount Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Bar Spec & Room Overlay (Architectural HUD) */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 pointer-events-none max-w-[calc(100vw-160px)]">
        <div className="bg-white/95 text-[#0a1317] border border-[#e5e7eb] px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-tight shadow-xs flex items-center gap-2 backdrop-blur-md">
          <Compass className="w-3.5 h-3.5 text-[#5d6c7b] shrink-0" />
          <span className="font-semibold truncate">{ROOM_VIEWPOINTS[activeRoom].name}</span>
          <span className="text-[#ced0d4]">•</span>
          <span className="text-[#5d6c7b] capitalize font-mono text-[11px]">{cameraMode}</span>
        </div>
      </div>

      {/* Architectural Interactive 2D Blueprint Floor Radar */}
      {showMinimap ? (
        <FloorRadar
          activeRoom={activeRoom}
          onSelectRoom={(r) => {
            setActiveRoom(r);
            setCameraMode('walk');
          }}
          onClose={() => setShowMinimap(false)}
          cameraMode={cameraMode}
        />
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowMinimap(true)}
          className="absolute top-3 right-3 z-10 bg-white/95 hover:bg-white text-[#0a1317] border-[#e5e7eb] px-3 py-1.5 h-auto rounded-lg text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
        >
          <Compass className="w-3.5 h-3.5 text-[#5d6c7b]" />
          <span>Floor Radar</span>
        </Button>
      )}

      {/* Hotspot Inspector Modal */}
      {selectedHotspot && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-20 w-[92vw] max-w-md animate-in fade-in duration-200">
          <Card className="bg-white border-[#e5e7eb] rounded-xl p-5 shadow-xl text-[#0a1317]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block mb-1">
                  {selectedHotspot.tag}
                </span>
                <CardTitle className="font-serif text-lg font-normal text-[#0a1317]">{selectedHotspot.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setSelectedHotspot(null)}
                className="text-[#8595a4] hover:text-[#0a1317] size-6 rounded-md hover:bg-[#f8f9fa]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <CardDescription className="text-xs text-[#5d6c7b] leading-relaxed mb-3 font-normal">
              {selectedHotspot.description}
            </CardDescription>
            <div className="border-t border-[#e5e7eb] pt-2.5 flex flex-wrap gap-1.5">
              {selectedHotspot.specs.map((spec, i) => (
                <span
                  key={i}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#f8f9fa] text-[#0a1317] border border-[#e5e7eb]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Unified Ergonomic Collapsible Bottom Control Dock */}
      <WalkthroughDock
        activeRoom={activeRoom}
        onSelectRoom={(r) => {
          setActiveRoom(r);
          setCameraMode('walk');
        }}
        cameraMode={cameraMode}
        onSelectCameraMode={setCameraMode}
        lightingPreset={lightingPreset}
        onSelectLightingPreset={setLightingPreset}
      />
    </div>
  );
};
