"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

// Hàm tạo mã băm đơn giản từ chuỗi
function hashCode(str: string) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Các cặp màu có thể có
const COLOR_PALETTES = [
  ["#ef4444", "#3b82f6"], // Đỏ - Xanh dương
  ["#10b981", "#8b5cf6"], // Xanh lá - Tím
  ["#f59e0b", "#06b6d4"], // Cam - Cyan
  ["#ec4899", "#14b8a6"], // Hồng - Teal
  ["#6366f1", "#f43f5e"], // Indigo - Rose
];

const DustParticles = ({ seed }: { seed: number }) => {
  const particlesRef = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, idx) => ({
      position: new THREE.Vector3(
        (Math.sin(seed + idx) - 0.5) * 8,
        (Math.cos(seed * idx) - 0.5) * 12,
        (Math.sin(seed - idx) - 0.5) * 8
      ),
      speed: Math.random() * 0.5 + 0.2,
      offset: Math.random() * Math.PI * 2
    }));
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((child, i) => {
        const t = state.clock.elapsedTime * particles[i].speed + particles[i].offset;
        child.position.y = particles[i].position.y + Math.sin(t) * 0.5;
        child.position.x = particles[i].position.x + Math.cos(t) * 0.5;
      });
    }
  });

  return (
    <group ref={particlesRef}>
      {particles.map((p, i) => (
        <mesh key={i} position={p.position}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const DNAStrand = ({ dnaCode }: { dnaCode: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Phân tích mã gen để tạo ra cấu trúc độc nhất
  const { numBasePairs, colors, speedMultiplier, radius, height } = useMemo(() => {
    const code = dnaCode || "FV-DNA";
    const hash = hashCode(code);
    
    // Tùy chỉnh thông số dựa trên mã băm
    const numPairs = 30 + (hash % 20); // Từ 30 đến 50
    const paletteIndex = hash % COLOR_PALETTES.length;
    
    return {
      numBasePairs: numPairs,
      colors: COLOR_PALETTES[paletteIndex],
      speedMultiplier: 0.2 + ((hash % 10) / 20), // 0.2 đến 0.65
      radius: 1.0 + ((hash % 5) / 10), // 1.0 đến 1.4
      height: 8 + ((hash % 4) / 1), // 8 đến 11
    };
  }, [dnaCode]);

  const yStep = height / numBasePairs;
  const angleStep = Math.PI / 8;

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speedMultiplier;
    }
  });

  const basePairs = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < numBasePairs; i++) {
      const y = i * yStep - height / 2;
      const angle = i * angleStep;
      
      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;
      
      pairs.push({ x1, z1, x2, z2, y, angle });
    }
    return pairs;
  }, []);

  return (
    <group ref={groupRef}>
      {basePairs.map((pair, i) => (
        <group key={i}>
          {/* Backbone 1 */}
          <mesh position={[pair.x1, pair.y, pair.z1]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={colors[0]} emissive={colors[0]} emissiveIntensity={3} toneMapped={false} />
          </mesh>
          
          {/* Backbone 2 */}
          <mesh position={[pair.x2, pair.y, pair.z2]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshStandardMaterial color={colors[1]} emissive={colors[1]} emissiveIntensity={3} toneMapped={false} />
          </mesh>

          {/* Connection */}
          <mesh position={[(pair.x1 + pair.x2) / 2, pair.y, (pair.z1 + pair.z2) / 2]} rotation={[0, -pair.angle, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, radius * 2, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} transparent opacity={0.3} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <DustParticles seed={hashCode(dnaCode || "FV-DNA")} />
    </group>
  );
};

export default function DNA3D({ dnaCode = "FV-DNA-8924X" }: { dnaCode?: string }) {
  return (
    <div className="w-full h-full min-h-[300px] absolute inset-0 z-10 cursor-move" key={dnaCode}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true, antialias: false }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
          <DNAStrand dnaCode={dnaCode} />
        </Float>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1} />
        <EffectComposer alpha={true} disableNormalPass>
          <Bloom luminanceThreshold={1.2} mipmapBlur intensity={2.5} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
