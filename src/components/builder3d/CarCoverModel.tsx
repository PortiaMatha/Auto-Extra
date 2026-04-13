// src/components/builder3d/CarCoverModel.tsx
import React from "react";
import { useGLTF } from "@react-three/drei";

// Loose typing keeps TypeScript happy without full three typings
type CarCoverModelProps = {
  modelPath: string;
} & any;

export function CarCoverModel({ modelPath, ...props }: CarCoverModelProps) {
  const gltf: any = useGLTF(modelPath);
  const scene = gltf.scene || gltf;

  return <primitive object={scene} {...props} />;
}