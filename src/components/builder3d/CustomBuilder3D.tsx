// src/components/builder3d/CustomBuilder3D.tsx
import React, { useState } from "react";
import "./CustomBuilder3D.css";
import { CarCoverScene } from "./CarCoverScene";

type CustomBuilder3DProps = {
  logoUrl: string | null;
  brand: string;
  model: string;
  version: string;
  area: "full-cover" | "steering-wheel" | "seat-covers" | "car-mat";
};

// Map Brand -> Model -> Version -> GLB path
const MODEL_PATHS: Record<string, Record<string, Record<string, string>>> = {
  Volkswagen: {
    Golf: {
      GTI: "/models/generic-car.glb", // your VW Golf GTI GLB
    },
  },
  // Add more cars here later...
  // Toyota: { Corolla: { "1.8 XR": "/models/toyota-corolla-18xr.glb" } },
};

function resolveModelPath(
  brand: string,
  model: string,
  version: string
): string | null {
  return MODEL_PATHS[brand]?.[model]?.[version] ?? null;
}

export const CustomBuilder3D: React.FC<CustomBuilder3DProps> = ({
  logoUrl,
  brand,
  model,
  version,
  area,
}) => {
  // controls for the decal on the cover box
  const [decalScale, setDecalScale] = useState(0.35);
  const [decalPosition, setDecalPosition] = useState<[number, number, number]>(
    [0, 0.02, 0] // x, y, z on the cover box
  );
  const [decalRotation, setDecalRotation] = useState<[number, number, number]>(
    [0, 0, 0]
  );

  const modelPath = resolveModelPath(brand, model, version);

  return (
    <div className="builder3d">
      {/* LEFT: 3D canvas */}
      <div className="builder3d__canvas">
        {modelPath ? (
          <CarCoverScene
            logoUrl={logoUrl}
            modelPath={modelPath}
            decalPosition={decalPosition}
            decalRotation={decalRotation}
            decalScale={decalScale}
            autoRotate
          />
        ) : (
          <div className="builder3d__canvas-placeholder">
            <p>
              3D preview not available for this configuration yet.
              <br />
              Try <strong>Volkswagen / Golf / GTI</strong> to see the demo car.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT: controls panel */}
      <div className="builder3d__panel">
        <h4 className="builder3d__title">
          3D preview – {brand} {model} {version}
        </h4>
        <p className="builder3d__subtitle">
          Area:{" "}
          {area === "full-cover"
            ? "Full interior cover set"
            : area === "steering-wheel"
            ? "Steering wheel cover"
            : area === "seat-covers"
            ? "Seat covers"
            : "Car mats"}
        </p>

        <div className="builder3d__controls">
          <label>
            <span>Logo size</span>
            <input
              type="range"
              min={0.1}
              max={0.5}
              step={0.02}
              value={decalScale}
              onChange={(e) => setDecalScale(Number(e.target.value))}
            />
          </label>

          <label>
            <span>Height (Y)</span>
            <input
              type="range"
              min={0}
              max={0.8}
              step={0.005}
              value={decalPosition[1]}
              onChange={(e) =>
                setDecalPosition([
                  decalPosition[0],
                  Number(e.target.value),
                  decalPosition[2],
                ])
              }
            />
          </label>

          <label>
            <span>Forward / back (Z)</span>
            <input
              type="range"
              min={-0.25}
              max={0.25}
              step={0.01}
              value={decalPosition[2]}
              onChange={(e) =>
                setDecalPosition([
                  decalPosition[0],
                  decalPosition[1],
                  Number(e.target.value),
                ])
              }
            />
          </label>

          <label>
            <span>Rotate</span>
            <input
              type="range"
              min={-Math.PI}
              max={Math.PI}
              step={0.05}
              value={decalRotation[2]}
              onChange={(e) =>
                setDecalRotation([
                  decalRotation[0],
                  decalRotation[1],
                  Number(e.target.value),
                ])
              }
            />
          </label>
        </div>
      </div>
    </div>
  );
};