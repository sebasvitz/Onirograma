"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

// ─── Per-section atmospheric palettes ────────────────────────────────────────
// Matches the 4 sections: Título, Registrar, Biblioteca, Explicación

const SECTION_PALETTES = [
  { particle: 0xb898e8, glow: 0x8d80b0 }, // Título    — violet/lavender
  { particle: 0xcf90c1, glow: 0xfbd8e0 }, // Registrar — mauve/petal
  { particle: 0x8397c4, glow: 0xaacbe0 }, // Biblioteca — periwinkle/powder
  { particle: 0xaacbe0, glow: 0xdde9ef }, // Explicación — powder/mist
];

interface Props {
  currentSection: number;
}

export default function ThreeBackground({ currentSection }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>(0);
  const mainMatRef = useRef<THREE.PointsMaterial | null>(null);
  const glowMatRef = useRef<THREE.PointsMaterial | null>(null);
  const targetColorRef = useRef(new THREE.Color(SECTION_PALETTES[0].particle));
  const currentColorRef = useRef(new THREE.Color(SECTION_PALETTES[0].particle));
  const targetGlowRef = useRef(new THREE.Color(SECTION_PALETTES[0].glow));
  const currentGlowRef = useRef(new THREE.Color(SECTION_PALETTES[0].glow));

  // ── Bootstrap Three.js scene once ──────────────────────────────────────────
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer — transparent so CSS body bg shows through
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );
    camera.position.z = 40;

    // ── Small ambient particles (the "star field") ──────────────────────────
    const AMBIENT_COUNT = 1400;
    const ambientPos = new Float32Array(AMBIENT_COUNT * 3);
    for (let i = 0; i < AMBIENT_COUNT; i++) {
      const r = 25 + Math.random() * 55;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      ambientPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      ambientPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      ambientPos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    const ambientGeo = new THREE.BufferGeometry();
    ambientGeo.setAttribute("position", new THREE.BufferAttribute(ambientPos, 3));
    const mainMat = new THREE.PointsMaterial({
      color: SECTION_PALETTES[0].particle,
      size: 0.18,
      transparent: true,
      opacity: 0.52,
      sizeAttenuation: true,
      depthWrite: false,
    });
    mainMatRef.current = mainMat;
    const ambient = new THREE.Points(ambientGeo, mainMat);
    scene.add(ambient);

    // ── Larger soft glow particles (foreground depth layer) ─────────────────
    const GLOW_COUNT = 100;
    const glowPos = new Float32Array(GLOW_COUNT * 3);
    for (let i = 0; i < GLOW_COUNT; i++) {
      glowPos[i * 3]     = (Math.random() - 0.5) * 60;
      glowPos[i * 3 + 1] = (Math.random() - 0.5) * 50;
      glowPos[i * 3 + 2] = (Math.random() - 0.5) * 35;
    }
    const glowGeo = new THREE.BufferGeometry();
    glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));
    const glowMat = new THREE.PointsMaterial({
      color: SECTION_PALETTES[0].glow,
      size: 0.55,
      transparent: true,
      opacity: 0.28,
      sizeAttenuation: true,
      depthWrite: false,
    });
    glowMatRef.current = glowMat;
    const glowPoints = new THREE.Points(glowGeo, glowMat);
    scene.add(glowPoints);

    // ── Subtle wireframe rings for depth feel ───────────────────────────────
    const ringParams = [
      { radius: 9, tube: 0.04, pos: [-6, 2, -12], rotX: 0.5, rotY: 0.3, opacity: 0.1 },
      { radius: 6, tube: 0.03, pos: [8, -4, -22], rotX: -0.3, rotY: 0.8, opacity: 0.08 },
      { radius: 14, tube: 0.05, pos: [0, 6, -30], rotX: 1.1, rotY: -0.4, opacity: 0.06 },
    ] as const;

    const rings: THREE.Mesh[] = [];
    ringParams.forEach(({ radius, tube, pos, rotX, rotY, opacity }) => {
      const rGeo = new THREE.TorusGeometry(radius, tube, 8, 60);
      const rMat = new THREE.MeshBasicMaterial({
        color: 0x8d80b0,
        transparent: true,
        opacity,
        depthWrite: false,
      });
      const mesh = new THREE.Mesh(rGeo, rMat);
      mesh.position.set(pos[0], pos[1], pos[2]);
      mesh.rotation.x = rotX;
      mesh.rotation.y = rotY;
      scene.add(mesh);
      rings.push(mesh);
    });

    // ── Animation loop ──────────────────────────────────────────────────────
    let time = 0;
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      time += 0.001;

      ambient.rotation.y   =  time * 0.025;
      ambient.rotation.x   =  Math.sin(time * 0.18) * 0.025;
      glowPoints.rotation.y = -time * 0.018;
      glowPoints.rotation.z =  Math.cos(time * 0.12) * 0.015;

      rings[0].rotation.z += 0.0008;
      rings[1].rotation.z -= 0.0006;
      rings[2].rotation.z += 0.0004;
      rings[2].rotation.x += 0.0002;

      // Smooth color transitions
      currentColorRef.current.lerp(targetColorRef.current, 0.018);
      currentGlowRef.current.lerp(targetGlowRef.current, 0.018);
      mainMat.color.copy(currentColorRef.current);
      glowMat.color.copy(currentGlowRef.current);

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ──────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", onResize);
      ambientGeo.dispose();
      mainMat.dispose();
      glowGeo.dispose();
      glowMat.dispose();
      rings.forEach((r) => {
        (r.geometry as THREE.BufferGeometry).dispose();
        (r.material as THREE.Material).dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null;
    };
  }, []);

  // ── React to section changes ────────────────────────────────────────────────
  useEffect(() => {
    const palette = SECTION_PALETTES[currentSection] ?? SECTION_PALETTES[0];
    targetColorRef.current.setHex(palette.particle);
    targetGlowRef.current.setHex(palette.glow);
  }, [currentSection]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
