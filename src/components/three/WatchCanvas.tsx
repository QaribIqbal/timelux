"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { createWatchScene, WatchLayers } from "./createWatchScene";

interface WatchCanvasProps {
  scrollProgress: number; // 0.0 to 1.0 across the scrollytelling container
  activeLayerIndex?: number; // 0: None/Hero, 1: Sapphire, 2: Movement, 3: Shield
}

export default function WatchCanvas({
  scrollProgress,
  activeLayerIndex = 0,
}: WatchCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<WatchLayers | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070708, 0.035);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 9.5);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting setup
    // Key Warm Light (Champagne)
    const keyLight = new THREE.DirectionalLight(0xfff0d4, 3.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    // Rim / Edge Cool Light (Platinum)
    const rimLight = new THREE.DirectionalLight(0xaad4ff, 2.5);
    rimLight.position.set(-6, -4, -4);
    scene.add(rimLight);

    // Overhead Glint Light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.8);
    topLight.position.set(0, 8, 3);
    scene.add(topLight);

    // Soft Ambient Studio Light
    const ambientLight = new THREE.AmbientLight(0x22242a, 1.2);
    scene.add(ambientLight);

    // 5. Instantiate Watch Scene
    const watch = createWatchScene();
    scene.add(watch.root);
    scene.add(watch.sweepLight);
    layersRef.current = watch;

    // 6. Handle Mouse Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2;
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 7. Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 8. Animation & Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseRef.current.x +=
        (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y +=
        (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Watch mechanical ticks & oscillations
      if (watch) {
        // Balance wheel escapement oscillations (4Hz = 8 beats/sec)
        const balanceOscillation = Math.sin(elapsedTime * 25) * 0.55;
        watch.balanceWheel.rotation.z = balanceOscillation;

        // Gears spinning in gear train
        watch.gears.forEach((gear, idx) => {
          const dir = idx % 2 === 0 ? 1 : -1;
          const speed = (idx + 1) * 0.4;
          gear.rotation.z += 0.01 * dir * speed;
        });

        // Seconds hand: mechanical smooth sweep with micro-tick
        watch.secondHand.rotation.z = -elapsedTime * 1.05;

        // Minute and hour hands subtle creep
        watch.minuteHand.rotation.z = Math.PI * 0.6 - (elapsedTime / 60) * 0.1;
        watch.hourHand.rotation.z = -Math.PI / 3 - (elapsedTime / 3600) * 0.1;

        // Automatic rotor subtle swinging
        watch.rotor.rotation.z = Math.sin(elapsedTime * 0.8) * 0.75;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update exploded view and camera positions when scrollProgress changes
  useEffect(() => {
    const watch = layersRef.current;
    if (!watch) return;

    // Progress phases:
    // 0.00 - 0.18: Hero section (Assembled, gentle tilt)
    // 0.18 - 0.60: Exploded view & Layers inspection
    // 0.60 - 0.76: Reassembly (Snaps together + light sweep)
    // 0.76 - 1.00: Collection / Craftsmanship transition
    const p = Math.max(0, Math.min(1, scrollProgress));

    let explosion = 0;
    let targetX = 0;
    let targetY = 0;
    let targetRotX = 0.2;
    let targetRotY = -0.3;
    let targetRotZ = 0;
    let sweepIntensity = 0;
    let sweepPosX = -6;

    if (p < 0.18) {
      // HERO
      const localP = p / 0.18;
      explosion = 0;
      targetX = 0;
      targetY = 0;
      targetRotX = 0.2 + localP * 0.1;
      targetRotY = -0.3 + localP * 0.1;
    } else if (p < 0.6) {
      // EXPLODED VIEW & LAYER DISCOVERY
      const localP = (p - 0.18) / 0.42;
      explosion = Math.min(1, localP * 1.6);

      // On desktop, shift watch to the right half so 60% negative space holds copy
      const isWide = typeof window !== "undefined" && window.innerWidth > 900;
      targetX = isWide ? 1.6 : 0;
      targetY = 0.2;

      // Fine-tune focus based on active layer
      if (activeLayerIndex === 1) {
        // Sapphire UI Layer
        targetRotX = 0.65;
        targetRotY = -0.45;
        targetRotZ = 0.15;
      } else if (activeLayerIndex === 2) {
        // Calibrated Movement
        targetRotX = 0.4;
        targetRotY = -0.15;
        targetRotZ = -0.2;
      } else if (activeLayerIndex === 3) {
        // DevOps Shield
        targetRotX = 0.9;
        targetRotY = -0.8;
        targetRotZ = 0.35;
      } else {
        targetRotX = 0.55;
        targetRotY = -0.45;
        targetRotZ = 0.05;
      }
    } else if (p < 0.76) {
      // REASSEMBLY (Smooth snap back + dynamic light sweep)
      const localP = (p - 0.6) / 0.16;
      explosion = Math.max(0, 1 - localP * 1.8);
      targetX = 0;
      targetY = 0.1;
      targetRotX = 0.25;
      targetRotY = -0.25;
      targetRotZ = 0;

      // Dynamic light sweep
      sweepIntensity = Math.sin(localP * Math.PI) * 16;
      sweepPosX = -6 + localP * 12;
    } else {
      // COLLECTION / CRAFTSMANSHIP
      explosion = 0;
      targetX = 0;
      targetY = -0.4;
      targetRotX = 0.15;
      targetRotY = -0.2;
      targetRotZ = 0;
      sweepIntensity = 0;
    }

    // Apply exploded layer offsets
    // Layer 1: Sapphire & Bezel (Frontend) flies forward
    watch.crystalLayer.position.z = explosion * 2.5;
    // Layer 2: Dial & Hands (Interface)
    watch.dialLayer.position.z = explosion * 1.1;
    // Layer 3: Movement (Core Engine)
    watch.movementLayer.position.z = -explosion * 0.4;
    // Layer 4: DevOp Shield & Caseback
    watch.caseLayer.position.z = -explosion * 2.1;

    // Apply Root Transformation with mouse parallax blend
    const mx = mouseRef.current.x * 0.15;
    const my = mouseRef.current.y * 0.15;

    watch.root.position.x = targetX + mx * 0.5;
    watch.root.position.y = targetY - my * 0.5;
    watch.root.rotation.x = targetRotX + my;
    watch.root.rotation.y = targetRotY + mx;
    watch.root.rotation.z = targetRotZ;

    // Sweep light
    watch.sweepLight.intensity = sweepIntensity;
    watch.sweepLight.position.x = sweepPosX;
  }, [scrollProgress, activeLayerIndex]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  );
}
