// src/components/builder3d/CarCoverScene.tsx
import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Decal,
  useTexture,
} from "@react-three/drei";
import { CarCoverModel } from "./CarCoverModel";

type CarCoverSceneProps = {
  logoUrl: string | null;
  modelPath: string;
  decalPosition: [number, number, number];
  decalRotation: [number, number, number];
  decalScale: number;
  autoRotate?: boolean;
};

function CarCoverInner({
  logoUrl,
  modelPath,
  decalPosition,
  decalRotation,
  decalScale,
  autoRotate,
}: CarCoverSceneProps) {
  const logoTexture = useTexture(logoUrl || "/logo192.png");
  const groupRef = React.useRef<any>(null);

  // slow spin
  useFrame((_, delta) => {
    if (!autoRotate || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <>
      {/* everything lives in this group so rotation is clean */}
      <group ref={groupRef} position={[0, -0.4, 0]}>
        {/* 🔹 Make the car itself LARGE */}
        <CarCoverModel
          modelPath={modelPath}
          scale={[55, 55, 55]}    // <– bump this if car still feels small
          position={[0, 0, 0]}
        />

        {/* 🔹 Small red patch just above the roof / hood */}
        <mesh
          position={[0, 0.80, 0]}  // lower = closer to car; raise if it intersects
          castShadow
          receiveShadow
        >
          {/* width, height, length – very small square */}
          <boxGeometry args={[0.5, 0.02, 0.8]} />
          <meshStandardMaterial
            color="#c00000"
            transparent
            opacity={0.5}
          />

          {/* logo decal stuck to the PATCH, not full cover */}
          <Decal
            position={decalPosition}
            rotation={[-Math.PI / 2, 0, decalRotation[2]]}
            scale={decalScale}
          >
            <meshBasicMaterial
              map={logoTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-10}
            />
          </Decal>
        </mesh>
      </group>

      {/* lights & controls */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.9} />
      <Environment preset="warehouse" />
      <OrbitControls enablePan={false} />
    </>
  );
}

export function CarCoverScene(props: CarCoverSceneProps) {
  return (
    <Canvas camera={{ position: [0, 2, 8], fov: 35 }}>
      <CarCoverInner {...props} />
    </Canvas>
  );
}