'use client';

import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

/* ------------------------------------------------------------------ */
/*  Infrastructure project node data                                   */
/* ------------------------------------------------------------------ */
interface ProjectNode {
  position: [number, number, number];
  color: string;
  emissive: string;
  label: string;
  riskLevel: number; // 0-1, affects pulse speed
  size: number;
}

const PROJECT_NODES: ProjectNode[] = [
  { position: [-2.8, 1.2, 0], color: '#10b981', emissive: '#10b981', label: 'NH Highway', riskLevel: 0.2, size: 0.18 },
  { position: [1.5, 2.0, -0.5], color: '#ef4444', emissive: '#ef4444', label: 'Metro Rail', riskLevel: 0.85, size: 0.22 },
  { position: [-1.0, -1.5, 0.5], color: '#f59e0b', emissive: '#f59e0b', label: 'Power Grid', riskLevel: 0.55, size: 0.2 },
  { position: [2.8, -0.8, -0.3], color: '#0ea5e9', emissive: '#0ea5e9', label: 'Rail Corridor', riskLevel: 0.3, size: 0.17 },
  { position: [0.0, 0.5, 0.2], color: '#ef4444', emissive: '#ef4444', label: 'HSR Project', riskLevel: 0.9, size: 0.24 },
  { position: [-2.0, -0.3, -0.4], color: '#10b981', emissive: '#10b981', label: 'Airport', riskLevel: 0.15, size: 0.19 },
  { position: [2.0, 1.5, 0.3], color: '#f59e0b', emissive: '#f59e0b', label: 'Bridge', riskLevel: 0.6, size: 0.18 },
  { position: [-0.5, 2.2, -0.2], color: '#0ea5e9', emissive: '#0ea5e9', label: 'Urban Infra', riskLevel: 0.35, size: 0.16 },
  { position: [1.0, -1.8, 0.4], color: '#10b981', emissive: '#10b981', label: 'Water Supply', riskLevel: 0.25, size: 0.15 },
  { position: [-1.5, 1.8, 0.6], color: '#f59e0b', emissive: '#f59e0b', label: 'Solar Park', riskLevel: 0.5, size: 0.17 },
];

/* Connection lines between nodes */
const CONNECTIONS: [number, number][] = [
  [0, 5], [0, 3], [1, 4], [1, 7], [2, 4], [2, 9],
  [3, 8], [4, 6], [5, 9], [6, 7], [7, 9], [3, 6],
  [0, 2], [1, 6], [4, 8], [5, 2],
];

/* ------------------------------------------------------------------ */
/*  Pulsing Project Node                                                */
/* ------------------------------------------------------------------ */
function InfraNode({ node }: { node: ProjectNode }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current || !glowRef.current) return;
    const t = clock.getElapsedTime();
    const pulse = 1 + Math.sin(t * (1.5 + node.riskLevel * 2.5)) * 0.15 * (0.5 + node.riskLevel);
    meshRef.current.scale.setScalar(pulse);
    glowRef.current.scale.setScalar(pulse * 2.2);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.08 + Math.sin(t * (1 + node.riskLevel * 2)) * 0.06;
  });

  return (
    <group position={node.position}>
      {/* Outer glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[node.size * 2, 16, 16]} />
        <meshBasicMaterial color={node.emissive} transparent opacity={0.1} />
      </mesh>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[node.size, 24, 24]} />
        <meshStandardMaterial
          color={node.color}
          emissive={node.emissive}
          emissiveIntensity={0.6}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Data flow particle system along connections                         */
/* eslint-disable */
function DataFlowParticles() {
  const particleCount = 120;
  const pointsRef = useRef<THREE.Points>(null);

  const particleDataRef = useRef<Array<{ startNode: number; endNode: number; progress: number; speed: number; offset: number }>>([]);
  if (particleDataRef.current.length === 0) {
    const data = [];
    for (let i = 0; i < particleCount; i++) {
      const connIdx = Math.floor(Math.random() * CONNECTIONS.length);
      const [a, b] = CONNECTIONS[connIdx];
      data.push({
        startNode: a,
        endNode: b,
        progress: Math.random(),
        speed: 0.15 + Math.random() * 0.35,
        offset: (Math.random() - 0.5) * 0.15,
      });
    }
    particleDataRef.current = data;
  }

  const positionsRef = useRef<Float32Array | null>(null);
  if (!positionsRef.current) {
    positionsRef.current = new Float32Array(particleCount * 3);
  }

  const colorsRef = useRef<Float32Array | null>(null);
  if (!colorsRef.current) {
    colorsRef.current = new Float32Array(particleCount * 3);
  }

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const particleData = particleDataRef.current;
    const positions = positionsRef.current;
    const colors = colorsRef.current;
    if (!positions || !colors) return;

    for (let i = 0; i < particleCount; i++) {
      const p = particleData[i];
      p.progress = (p.progress + p.speed * 0.008) % 1;
      const startPos = PROJECT_NODES[p.startNode].position;
      const endPos = PROJECT_NODES[p.endNode].position;
      const prog = p.progress;
      positions[i * 3] = THREE.MathUtils.lerp(startPos[0], endPos[0], prog) + Math.sin(t + i) * p.offset;
      positions[i * 3 + 1] = THREE.MathUtils.lerp(startPos[1], endPos[1], prog) + Math.cos(t * 0.7 + i) * p.offset;
      positions[i * 3 + 2] = THREE.MathUtils.lerp(startPos[2], endPos[2], prog) + Math.sin(t * 1.3 + i) * p.offset * 0.5;

      // Color: sky blue with fade at endpoints
      const fade = Math.sin(prog * Math.PI);
      colors[i * 3] = 0.05 * fade;
      colors[i * 3 + 1] = 0.65 * fade;
      colors[i * 3 + 2] = 0.91 * fade;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positionsRef.current, 3]}
          count={particleCount}
          array={positionsRef.current}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colorsRef.current, 3]}
          count={particleCount}
          array={colorsRef.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ------------------------------------------------------------------ */
/*  Connection lines (subtle)                                           */
/* ------------------------------------------------------------------ */
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const positions: number[] = [];
    CONNECTIONS.forEach(([a, b]) => {
      const pa = PROJECT_NODES[a].position;
      const pb = PROJECT_NODES[b].position;
      positions.push(pa[0], pa[1], pa[2]);
      positions.push(pb[0], pb[1], pb[2]);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!linesRef.current) return;
    const mat = linesRef.current.material as THREE.LineBasicMaterial;
    mat.opacity = 0.12 + Math.sin(clock.getElapsedTime() * 0.5) * 0.04;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#38bdf8" transparent opacity={0.15} />
    </lineSegments>
  );
}

/* ------------------------------------------------------------------ */
/*  Ambient floating grid (ground plane)                                */
/* ------------------------------------------------------------------ */
function GridPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[14, 14, 28, 28]} />
      <meshBasicMaterial
        color="#0ea5e9"
        transparent
        opacity={0.04}
        wireframe
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Camera rig: cursor-based parallax + slow ambient drift              */
/* ------------------------------------------------------------------ */
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const targetPos = useRef(new THREE.Vector3(0, 0.5, 7));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Cursor-based parallax
    const cursorX = mouse.current.x * 0.8;
    const cursorY = -mouse.current.y * 0.4;
    // Slow ambient drift
    const driftX = Math.sin(t * 0.15) * 0.3;
    const driftY = Math.cos(t * 0.12) * 0.15;

    targetPos.current.set(
      cursorX + driftX,
      0.5 + cursorY + driftY,
      7
    );

    camera.position.lerp(targetPos.current, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ------------------------------------------------------------------ */
/*  Main scene                                                          */
/* ------------------------------------------------------------------ */
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[-5, 3, -3]} intensity={0.3} color="#38bdf8" />
      <pointLight position={[0, -3, 2]} intensity={0.2} color="#0ea5e9" />

      <CameraRig />

      <Float speed={0.5} rotationIntensity={0.1} floatIntensity={0.2}>
        <group>
          {/* Grid plane */}
          <GridPlane />

          {/* Connection lines */}
          <ConnectionLines />

          {/* Project nodes */}
          {PROJECT_NODES.map((node, i) => (
            <InfraNode key={i} node={node} />
          ))}

          {/* Data flow particles */}
          <DataFlowParticles />
        </group>
      </Float>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Exported component                                                  */
/* ------------------------------------------------------------------ */
const emptySubscribe = () => () => {};
export default function InfrastructureScene() {
  const mounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl flex items-center justify-center">
        <div className="text-sky-300 text-sm font-medium animate-pulse">Loading visualization...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      {/* Subtle radial gradient overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-fade" />
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.5, 7], fov: 45 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
