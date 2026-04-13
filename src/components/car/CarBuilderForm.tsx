import React, { useEffect, useState } from "react";
import "./CarBuilderForm.css";
import { CarSelector } from "./CarSelector";
import { CustomBuilder3D } from "../builder3d/CustomBuilder3D";

export type CarArea =
  | "full-cover"
  | "steering-wheel"
  | "seat-covers"
  | "car-mat";

export type CarSelection = {
  brand: string;
  model: string;
  version: string;
};

export type CarBuilderValue = {
  selection: CarSelection;
  area: CarArea;
  price: number;
  logoFile: File | null;
  logoUrl: string | null;
};

type CarBuilderFormProps = {
  onChange?: (value: CarBuilderValue) => void;
};

const defaultSelection: CarSelection = {
  brand: "Volkswagen",
  model: "Golf",
  version: "GTI",
};

function computePrice(area: CarArea): number {
  switch (area) {
    case "steering-wheel":
      return 800;
    case "seat-covers":
      return 2200;
    case "car-mat":
      return 1200;
    case "full-cover":
    default:
      return 3500;
  }
}

export const CarBuilderForm: React.FC<CarBuilderFormProps> = ({ onChange }) => {
  const [selection, setSelection] = useState<CarSelection>(defaultSelection);
  const [area, setArea] = useState<CarArea>("full-cover");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const price = computePrice(area);

  // Notify parent (HomePage) when anything important changes
  useEffect(() => {
    onChange?.({
      selection,
      area,
      price,
      logoFile,
      logoUrl,
    });
  }, [selection, area, price, logoFile, logoUrl, onChange]);

  const handleAreaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setArea(e.target.value as CarArea);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setLogoFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
    } else {
      setLogoUrl(null);
    }
  };

  return (
    <div className="car-builder">
      {/* TOP: selectors + upload + radio buttons + price */}
      <div className="car-builder__top">
        <div className="car-builder__left">
          <div className="car-builder__selectors">
            <CarSelector value={selection} onChange={setSelection} />
          </div>

          <div className="car-builder__upload">
            <p className="car-builder__upload-label">UPLOAD LOGO / ARTWORK</p>
            <input type="file" accept="image/*" onChange={handleLogoChange} />
            {logoUrl && (
              <div className="car-builder__upload-preview">
                <img src={logoUrl} alt="Uploaded logo" />
              </div>
            )}
            <p className="car-builder__upload-help">
              Upload the image you want printed on your cover (logo, pattern,
              cat photo, etc).
            </p>
          </div>
        </div>

        <div className="car-builder__right">
          <fieldset className="car-builder__area">
            <legend>WHERE SHOULD WE PRINT IT?</legend>
            <label>
              <input
                type="radio"
                name="area"
                value="full-cover"
                checked={area === "full-cover"}
                onChange={handleAreaChange}
              />
              Full interior cover set
            </label>
            <label>
              <input
                type="radio"
                name="area"
                value="steering-wheel"
                checked={area === "steering-wheel"}
                onChange={handleAreaChange}
              />
              Car steering wheel
            </label>
            <label>
              <input
                type="radio"
                name="area"
                value="seat-covers"
                checked={area === "seat-covers"}
                onChange={handleAreaChange}
              />
              Seat covers
            </label>
            <label>
              <input
                type="radio"
                name="area"
                value="car-mat"
                checked={area === "car-mat"}
                onChange={handleAreaChange}
              />
              Car mats
            </label>
          </fieldset>

          <p className="car-builder__price">
            Estimated price:{" "}
            <strong>R {price.toLocaleString("en-ZA")}</strong>
          </p>
        </div>
      </div>

      {/* BOTTOM: Live preview */}
      <div className="car-builder__bottom">
        <h3 className="car-builder__section-title">Live preview</h3>
        <p className="car-builder__preview-text">
          {selection.brand} {selection.model} {selection.version} ·{" "}
          {area === "full-cover"
            ? "Full interior cover set"
            : area === "steering-wheel"
            ? "Steering wheel cover"
            : area === "seat-covers"
            ? "Seat covers"
            : "Car mats"}
        </p>

        {/* NEW 3D preview */}
        <div className="car-builder__preview-3d">
          <CustomBuilder3D
            logoUrl={logoUrl}
            brand={selection.brand}
            model={selection.model}
            version={selection.version}
            area={area}
          />
        </div>
      </div>
    </div>
  );
};