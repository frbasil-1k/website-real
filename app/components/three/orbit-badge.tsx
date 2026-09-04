"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import * as THREE from "three";

function Ring({
  radiusX,
  radiusY,
  rotation,
  color,
  opacity,
  speed,
}: {
  radiusX: number;
  radiusY: number;
  rotation: [number, number, number];
  color: string;
  opacity: number;
  speed: number;
}) {
  const ref = useRef<THREE.LineLoop>(null);
  const points = new Array(80).fill(0).map((_, i) => {
    const t = (i / 80) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(t) * radiusX, Math.sin(t) * radiusY, 0);
  });
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.LineDashedMaterial({
    color,
    transparent: true,
    opacity,
    dashSize: 0.1,
    gapSize: 0.09,
  });
  const line = new THREE.LineLoop(geometry, material);
  line.computeLineDistances();

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.getElapsedTime() * speed;
  });

  return <primitive ref={ref} object={line} rotation={rotation} />;
}

function CenterMark({ glyph, color }: { glyph: string; color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.9) * 0.08;
  });

  return (
    <group ref={ref}>
      <mesh>
        <torusGeometry args={[0.001, 0.001, 4, 4]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {glyph === "trophy" ? (
        <group>
          <mesh position={[0, 0.05, 0]}>
            <sphereGeometry args={[0.22, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.65]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.05, 0.09, 0.18, 16]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.27, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.03, 24]} />
            <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ) : (
        <mesh rotation={[0.4, 0.6, 0]}>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color={color}
            metalness={0.5}
            roughness={0.25}
            wireframe={glyph === "wire"}
          />
        </mesh>
      )}
    </group>
  );
}

export default function OrbitBadge({
  glyph = "gem",
  accent = "#ff5a2b",
}: {
  glyph?: "trophy" | "gem" | "wire";
  accent?: string;
}) {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative aspect-square w-full max-w-xs" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 40 }}
        dpr={[1, 1.75]}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: "opacity 400ms ease" }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 3]} intensity={1} />
        <Ring
          radiusX={1.3}
          radiusY={0.95}
          rotation={[0.3, 0.4, 0.2]}
          color={accent}
          opacity={0.5}
          speed={0.12}
        />
        <Ring
          radiusX={1.15}
          radiusY={1.15}
          rotation={[1.1, 0.1, 0.6]}
          color="#6d6b64"
          opacity={0.35}
          speed={-0.08}
        />
        <Suspense fallback={null}>
          <CenterMark glyph={glyph} color={accent} />
        </Suspense>
      </Canvas>
    </div>
  );
}
