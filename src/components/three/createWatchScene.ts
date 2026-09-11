import * as THREE from "three";

export interface WatchLayers {
  root: THREE.Group;
  crystalLayer: THREE.Group;
  dialLayer: THREE.Group;
  movementLayer: THREE.Group;
  caseLayer: THREE.Group;
  gears: THREE.Mesh[];
  rotor: THREE.Group;
  balanceWheel: THREE.Group;
  secondHand: THREE.Group;
  minuteHand: THREE.Group;
  hourHand: THREE.Group;
  sweepLight: THREE.SpotLight;
}

export function createWatchScene(): WatchLayers {
  const root = new THREE.Group();
  root.rotation.x = 0.2;
  root.rotation.y = -0.3;

  // ----------------------------------------------------
  // Shared Materials (Luxury Metallic & Horological)
  // ----------------------------------------------------
  const polishedGoldMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.15,
  });

  const champagneGoldMat = new THREE.MeshStandardMaterial({
    color: 0xe5c365,
    metalness: 0.9,
    roughness: 0.25,
  });

  const brushedTitaniumMat = new THREE.MeshStandardMaterial({
    color: 0x9098a2,
    metalness: 0.85,
    roughness: 0.35,
  });

  const mirrorSteelMat = new THREE.MeshStandardMaterial({
    color: 0xe8ecf0,
    metalness: 0.98,
    roughness: 0.08,
  });

  const darkSlateMat = new THREE.MeshStandardMaterial({
    color: 0x111215,
    metalness: 0.7,
    roughness: 0.4,
  });

  const rubyMat = new THREE.MeshPhysicalMaterial({
    color: 0xcc1133,
    metalness: 0.1,
    roughness: 0.1,
    transmission: 0.85,
    ior: 1.76,
    emissive: 0x330008,
    emissiveIntensity: 0.4,
  });

  const sapphireGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xd8eeff,
    metalness: 0.05,
    roughness: 0.03,
    transmission: 0.95,
    ior: 1.77, // Real sapphire refractive index
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    transparent: true,
    opacity: 0.45,
  });

  // ====================================================
  // LAYER 1: SAPPHIRE CRYSTAL & BEZEL (The Frontend)
  // ====================================================
  const crystalLayer = new THREE.Group();
  crystalLayer.name = "Layer_Sapphire_Crystal";

  // Bezel Ring
  const bezelGeom = new THREE.CylinderGeometry(2.65, 2.7, 0.25, 64, 1, true);
  const bezelMesh = new THREE.Mesh(bezelGeom, mirrorSteelMat);
  bezelMesh.rotation.x = Math.PI / 2;
  crystalLayer.add(bezelMesh);

  // Bezel Fluted Accent Ring (Gold)
  const flutedGeom = new THREE.TorusGeometry(2.68, 0.06, 16, 64);
  const flutedMesh = new THREE.Mesh(flutedGeom, polishedGoldMat);
  crystalLayer.add(flutedMesh);

  // Sapphire Glass Lens (Curved Domed Disk)
  const sapphireGeom = new THREE.CylinderGeometry(2.58, 2.58, 0.08, 64);
  const sapphireMesh = new THREE.Mesh(sapphireGeom, sapphireGlassMat);
  sapphireMesh.rotation.x = Math.PI / 2;
  sapphireMesh.position.z = 0.06;
  crystalLayer.add(sapphireMesh);

  // Tachymeter scale ring
  const tachyGeom = new THREE.RingGeometry(2.35, 2.58, 64);
  const tachyMat = new THREE.MeshStandardMaterial({
    color: 0x16181d,
    metalness: 0.8,
    roughness: 0.3,
    side: THREE.DoubleSide,
  });
  const tachyMesh = new THREE.Mesh(tachyGeom, tachyMat);
  crystalLayer.add(tachyMesh);

  // Small hour markers on the tachy ring
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * Math.PI * 2;
    const isFive = i % 5 === 0;
    const markerGeom = new THREE.BoxGeometry(
      isFive ? 0.03 : 0.015,
      isFive ? 0.12 : 0.06,
      0.02
    );
    const markerMesh = new THREE.Mesh(
      markerGeom,
      isFive ? polishedGoldMat : mirrorSteelMat
    );
    const r = 2.46;
    markerMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.02);
    markerMesh.rotation.z = angle + Math.PI / 2;
    crystalLayer.add(markerMesh);
  }

  // ====================================================
  // LAYER 2: DIAL & HANDS (The Interface)
  // ====================================================
  const dialLayer = new THREE.Group();
  dialLayer.name = "Layer_Dial_And_Hands";

  // Main dial face
  const dialGeom = new THREE.CylinderGeometry(2.34, 2.34, 0.06, 64);
  const dialMesh = new THREE.Mesh(dialGeom, darkSlateMat);
  dialMesh.rotation.x = Math.PI / 2;
  dialLayer.add(dialMesh);

  // 12 Applied Gold Hour Indices
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const isQuarter = i % 3 === 0;
    const indexGeom = new THREE.BoxGeometry(
      isQuarter ? 0.09 : 0.06,
      isQuarter ? 0.35 : 0.24,
      0.04
    );
    const indexMesh = new THREE.Mesh(indexGeom, polishedGoldMat);
    const r = 1.95;
    indexMesh.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0.04);
    indexMesh.rotation.z = angle + Math.PI / 2;
    dialLayer.add(indexMesh);
  }

  // 3 Chronograph Sub-Dials (3, 6, 9 o'clock)
  const subdialPositions = [
    { x: 0.9, y: 0, r: 0.5 },
    { x: -0.9, y: 0, r: 0.5 },
    { x: 0, y: -0.85, r: 0.55 },
  ];

  subdialPositions.forEach((pos) => {
    const subGeom = new THREE.CylinderGeometry(pos.r, pos.r, 0.03, 32);
    const subMat = new THREE.MeshStandardMaterial({
      color: 0x0c0d10,
      metalness: 0.85,
      roughness: 0.5,
    });
    const subMesh = new THREE.Mesh(subGeom, subMat);
    subMesh.rotation.x = Math.PI / 2;
    subMesh.position.set(pos.x, pos.y, 0.035);
    dialLayer.add(subMesh);

    // Subdial ring
    const subRingGeom = new THREE.TorusGeometry(pos.r, 0.018, 12, 32);
    const subRingMesh = new THREE.Mesh(subRingGeom, champagneGoldMat);
    subRingMesh.position.set(pos.x, pos.y, 0.05);
    dialLayer.add(subRingMesh);

    // Subdial mini hand
    const subHandGeom = new THREE.BoxGeometry(0.015, pos.r * 0.75, 0.02);
    const subHandMesh = new THREE.Mesh(subHandGeom, polishedGoldMat);
    subHandMesh.position.set(pos.x, pos.y + (pos.r * 0.75) / 2, 0.06);
    dialLayer.add(subHandMesh);
  });

  // Center Pinion Cap
  const pinionGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 32);
  const pinionMesh = new THREE.Mesh(pinionGeom, polishedGoldMat);
  pinionMesh.rotation.x = Math.PI / 2;
  pinionMesh.position.z = 0.08;
  dialLayer.add(pinionMesh);

  // Hour Hand (Dauphine Faceted Style)
  const hourHand = new THREE.Group();
  const hourGeom = new THREE.ConeGeometry(0.09, 1.2, 4);
  const hourMesh = new THREE.Mesh(hourGeom, polishedGoldMat);
  hourMesh.position.y = 0.6;
  hourMesh.rotation.y = Math.PI / 4;
  hourHand.add(hourMesh);
  hourHand.position.z = 0.09;
  hourHand.rotation.z = -Math.PI / 3;
  dialLayer.add(hourHand);

  // Minute Hand (Longer Dauphine)
  const minuteHand = new THREE.Group();
  const minuteGeom = new THREE.ConeGeometry(0.07, 1.75, 4);
  const minuteMesh = new THREE.Mesh(minuteGeom, polishedGoldMat);
  minuteMesh.position.y = 0.88;
  minuteMesh.rotation.y = Math.PI / 4;
  minuteHand.add(minuteMesh);
  minuteHand.position.z = 0.11;
  minuteHand.rotation.z = Math.PI * 0.6;
  dialLayer.add(minuteHand);

  // Seconds Hand (Ultra-fine Champagne Needle with Red Tip)
  const secondHand = new THREE.Group();
  const secondStemGeom = new THREE.CylinderGeometry(0.012, 0.012, 2.05, 16);
  const secondStemMesh = new THREE.Mesh(secondStemGeom, champagneGoldMat);
  secondStemMesh.position.y = 0.75;
  secondHand.add(secondStemMesh);

  // Counterweight
  const counterGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.4, 16);
  const counterMesh = new THREE.Mesh(counterGeom, polishedGoldMat);
  counterMesh.position.y = -0.2;
  secondHand.add(counterMesh);

  // Red Precision Pointer Tip
  const tipGeom = new THREE.ConeGeometry(0.03, 0.22, 16);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    metalness: 0.3,
    roughness: 0.2,
  });
  const tipMesh = new THREE.Mesh(tipGeom, tipMat);
  tipMesh.position.y = 1.8;
  secondHand.add(tipMesh);

  secondHand.position.z = 0.13;
  dialLayer.add(secondHand);

  // ====================================================
  // LAYER 3: THE CALIBRATED MOVEMENT (The Core Engine)
  // ====================================================
  const movementLayer = new THREE.Group();
  movementLayer.name = "Layer_Movement_Engine";

  // Mainplate (Geneva striped circular plate with cutouts)
  const plateGeom = new THREE.CylinderGeometry(2.35, 2.35, 0.12, 48);
  const plateMesh = new THREE.Mesh(plateGeom, brushedTitaniumMat);
  plateMesh.rotation.x = Math.PI / 2;
  plateMesh.position.z = -0.15;
  movementLayer.add(plateMesh);

  // Mechanical Bridges
  const bridgeMat = new THREE.MeshStandardMaterial({
    color: 0xd8dde4,
    metalness: 0.92,
    roughness: 0.2,
  });

  const bridgeGeom1 = new THREE.BoxGeometry(1.6, 0.9, 0.08);
  const bridge1 = new THREE.Mesh(bridgeGeom1, bridgeMat);
  bridge1.position.set(0.4, 0.6, -0.05);
  bridge1.rotation.z = 0.2;
  movementLayer.add(bridge1);

  const bridgeGeom2 = new THREE.BoxGeometry(1.4, 0.7, 0.08);
  const bridge2 = new THREE.Mesh(bridgeGeom2, bridgeMat);
  bridge2.position.set(-0.5, -0.4, -0.05);
  bridge2.rotation.z = -0.4;
  movementLayer.add(bridge2);

  // Helper to create realistic toothed cog gears
  const gears: THREE.Mesh[] = [];

  function createGear(
    radius: number,
    teeth: number,
    depth: number,
    material: THREE.Material
  ) {
    const shape = new THREE.Shape();
    const toothHeight = radius * 0.12;

    for (let i = 0; i < teeth; i++) {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.3) / teeth) * Math.PI * 2;
      const a3 = ((i + 0.6) / teeth) * Math.PI * 2;
      const a4 = ((i + 0.9) / teeth) * Math.PI * 2;

      const rInner = radius;
      const rOuter = radius + toothHeight;

      if (i === 0) {
        shape.moveTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
      } else {
        shape.lineTo(Math.cos(a1) * rInner, Math.sin(a1) * rInner);
      }
      shape.lineTo(Math.cos(a2) * rOuter, Math.sin(a2) * rOuter);
      shape.lineTo(Math.cos(a3) * rOuter, Math.sin(a3) * rOuter);
      shape.lineTo(Math.cos(a4) * rInner, Math.sin(a4) * rInner);
    }
    shape.closePath();

    // Center cutout hole
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, radius * 0.35, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    const extrudeSettings = {
      depth: depth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.015,
      bevelThickness: 0.015,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const mesh = new THREE.Mesh(geom, material);
    return mesh;
  }

  // Gear 1: Large Center Brass Wheel
  const gear1 = createGear(0.85, 28, 0.05, polishedGoldMat);
  gear1.position.set(-0.2, 0.3, -0.06);
  movementLayer.add(gear1);
  gears.push(gear1);

  // Gear 2: Intermediate Driving Wheel
  const gear2 = createGear(0.65, 20, 0.05, mirrorSteelMat);
  gear2.position.set(0.7, 0.15, -0.04);
  movementLayer.add(gear2);
  gears.push(gear2);

  // Gear 3: Third Wheel
  const gear3 = createGear(0.5, 16, 0.04, champagneGoldMat);
  gear3.position.set(-0.65, -0.55, -0.05);
  movementLayer.add(gear3);
  gears.push(gear3);

  // Gear 4: Escape Wheel (Finest pitch)
  const gear4 = createGear(0.35, 15, 0.03, polishedGoldMat);
  gear4.position.set(0.1, -0.8, -0.03);
  movementLayer.add(gear4);
  gears.push(gear4);

  // Synthetic Rubies on Pivot Bearings
  const rubyPositions = [
    { x: -0.2, y: 0.3, z: 0.02 },
    { x: 0.7, y: 0.15, z: 0.03 },
    { x: -0.65, y: -0.55, z: 0.02 },
    { x: 0.1, y: -0.8, z: 0.03 },
    { x: 0, y: 0, z: 0.01 },
  ];

  rubyPositions.forEach((pos) => {
    const jewelGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
    const jewelMesh = new THREE.Mesh(jewelGeom, rubyMat);
    jewelMesh.rotation.x = Math.PI / 2;
    jewelMesh.position.set(pos.x, pos.y, pos.z);
    movementLayer.add(jewelMesh);

    const chatonGeom = new THREE.TorusGeometry(0.095, 0.025, 8, 16);
    const chatonMesh = new THREE.Mesh(chatonGeom, polishedGoldMat);
    chatonMesh.position.set(pos.x, pos.y, pos.z);
    movementLayer.add(chatonMesh);
  });

  // Tourbillon / Balance Wheel Assembly (Oscillates rapidly)
  const balanceWheel = new THREE.Group();
  balanceWheel.position.set(0.2, -1.05, 0.01);

  // Balance rim
  const rimGeom = new THREE.TorusGeometry(0.48, 0.035, 16, 32);
  const rimMesh = new THREE.Mesh(rimGeom, polishedGoldMat);
  balanceWheel.add(rimMesh);

  // 4 Cross-arms
  for (let a = 0; a < 4; a++) {
    const armGeom = new THREE.BoxGeometry(0.03, 0.94, 0.02);
    const armMesh = new THREE.Mesh(armGeom, polishedGoldMat);
    armMesh.rotation.z = (a * Math.PI) / 4;
    balanceWheel.add(armMesh);
  }

  // Balance regulating screws on rim
  for (let s = 0; s < 8; s++) {
    const sAngle = (s / 8) * Math.PI * 2;
    const screwGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.06, 8);
    const screwMesh = new THREE.Mesh(screwGeom, mirrorSteelMat);
    screwMesh.position.set(
      Math.cos(sAngle) * 0.49,
      Math.sin(sAngle) * 0.49,
      0
    );
    screwMesh.rotation.z = sAngle;
    balanceWheel.add(screwMesh);
  }
  movementLayer.add(balanceWheel);

  // ====================================================
  // LAYER 4: THE DEVOP SHIELD (Case, Crown, Rotor)
  // ====================================================
  const caseLayer = new THREE.Group();
  caseLayer.name = "Layer_DevOp_Case_Shield";

  // Main Case Barrel (Titanium 41mm architecture)
  const caseBodyGeom = new THREE.CylinderGeometry(2.78, 2.82, 0.65, 64);
  const caseBody = new THREE.Mesh(caseBodyGeom, brushedTitaniumMat);
  caseBody.rotation.x = Math.PI / 2;
  caseBody.position.z = -0.35;
  caseLayer.add(caseBody);

  // Lugs (Upper and Lower strap mounts)
  const lugGeom = new THREE.BoxGeometry(0.4, 1.2, 0.4);
  const lugOffsets = [
    { x: -1.8, y: 2.35, rz: -0.2 },
    { x: 1.8, y: 2.35, rz: 0.2 },
    { x: -1.8, y: -2.35, rz: 0.2 },
    { x: 1.8, y: -2.35, rz: -0.2 },
  ];

  lugOffsets.forEach((l) => {
    const lugMesh = new THREE.Mesh(lugGeom, brushedTitaniumMat);
    lugMesh.position.set(l.x, l.y, -0.35);
    lugMesh.rotation.z = l.rz;
    caseLayer.add(lugMesh);
  });

  // Fluted Crown at 3 o'clock
  const crownGroup = new THREE.Group();
  const crownStemGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.35, 24);
  const crownStem = new THREE.Mesh(crownStemGeom, mirrorSteelMat);
  crownStem.rotation.z = Math.PI / 2;
  crownGroup.add(crownStem);

  const crownCapGeom = new THREE.CylinderGeometry(0.3, 0.26, 0.22, 32);
  const crownCap = new THREE.Mesh(crownCapGeom, polishedGoldMat);
  crownCap.rotation.z = Math.PI / 2;
  crownCap.position.x = 0.2;
  crownGroup.add(crownCap);

  crownGroup.position.set(2.95, 0, -0.35);
  caseLayer.add(crownGroup);

  // Chronograph Pushers at 2 and 4 o'clock
  [-1, 1].forEach((dir) => {
    const angle = dir * 0.55;
    const pusherGeom = new THREE.CylinderGeometry(0.12, 0.12, 0.3, 16);
    const pusher = new THREE.Mesh(pusherGeom, mirrorSteelMat);
    pusher.position.set(Math.cos(angle) * 2.9, Math.sin(angle) * 2.9, -0.35);
    pusher.rotation.z = angle + Math.PI / 2;
    caseLayer.add(pusher);
  });

  // Exhibition Caseback Ring & Sapphire Window
  const casebackRingGeom = new THREE.TorusGeometry(2.4, 0.25, 24, 64);
  const casebackRing = new THREE.Mesh(casebackRingGeom, mirrorSteelMat);
  casebackRing.position.z = -0.72;
  caseLayer.add(casebackRing);

  const rearSapphireGeom = new THREE.CylinderGeometry(2.25, 2.25, 0.05, 48);
  const rearSapphire = new THREE.Mesh(rearSapphireGeom, sapphireGlassMat);
  rearSapphire.rotation.x = Math.PI / 2;
  rearSapphire.position.z = -0.72;
  caseLayer.add(rearSapphire);

  // Automatic Winding Rotor (Oscillating Semicircular Mass)
  const rotor = new THREE.Group();
  rotor.position.z = -0.58;

  const rotorShape = new THREE.Shape();
  rotorShape.absarc(0, 0, 2.1, 0, Math.PI, false);
  rotorShape.lineTo(0, 0);
  rotorShape.closePath();

  const rotorExtrude = new THREE.ExtrudeGeometry(rotorShape, {
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  const rotorMesh = new THREE.Mesh(rotorExtrude, polishedGoldMat);
  rotor.add(rotorMesh);

  // Rotor central bearing
  const bearingGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.1, 32);
  const bearingMesh = new THREE.Mesh(bearingGeom, mirrorSteelMat);
  bearingMesh.rotation.x = Math.PI / 2;
  rotor.add(bearingMesh);

  caseLayer.add(rotor);

  // ====================================================
  // DYNAMIC SWEEP LIGHT (For Section 4 Reassembly Glint)
  // ====================================================
  const sweepLight = new THREE.SpotLight(0xffffff, 0, 15, Math.PI / 6, 0.3, 1);
  sweepLight.position.set(-5, 5, 6);
  sweepLight.target = root;

  // Add all layers to root group
  root.add(caseLayer);
  root.add(movementLayer);
  root.add(dialLayer);
  root.add(crystalLayer);

  return {
    root,
    crystalLayer,
    dialLayer,
    movementLayer,
    caseLayer,
    gears,
    rotor,
    balanceWheel,
    secondHand,
    minuteHand,
    hourHand,
    sweepLight,
  };
}
