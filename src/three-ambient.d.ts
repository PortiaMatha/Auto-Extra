// src/three-ambient.d.ts
import * as React from "react";


declare module "@react-three/fiber" {
  export const Canvas: React.ComponentType<any>;
  export const useFrame: (
    callback: (state: any, delta: number) => void
  ) => void;
}

declare module "@react-three/drei" {
  export const OrbitControls: React.ComponentType<any>;
  export const Environment: React.ComponentType<any>;
  export const Decal: React.ComponentType<any>;
  export const useTexture: (url: string) => any;
  export const useGLTF: (url: string) => any;
}

// Tell TS about the extra JSX tags used by react-three-fiber
declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any;
      group: any;
      ambientLight: any;
      directionalLight: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      meshBasicMaterial: any;
    }
  }
}