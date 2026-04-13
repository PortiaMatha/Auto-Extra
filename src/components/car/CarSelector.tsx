import React from "react";
import "./CarSelector.css";

export type CarSelection = {
  brand: string;
  model: string;
  version: string;
};

export type CarSelectorProps = {
  value: CarSelection;
  onChange: (value: CarSelection) => void;
};

const CAR_DATA: Record<string, Record<string, string[]>> = {
  Volkswagen: {
    Golf: ["GTI", "R-Line"],
    Polo: ["Trendline", "Comfortline"],
  },
  Toyota: {
    Corolla: ["1.8 XR", "Quest"],
    Hilux: ["Single Cab", "Double Cab"],
  },
  BMW: {
    "3 Series": ["320i", "M Sport"],
    "1 Series": ["118i", "M Sport"],
  },
};

export const CarSelector: React.FC<CarSelectorProps> = ({
  value,
  onChange,
}) => {
  const { brand, model, version } = value;

  const brands = Object.keys(CAR_DATA);
  const models = brand ? Object.keys(CAR_DATA[brand]) : [];
  const versions =
    brand && model ? CAR_DATA[brand]?.[model] ?? [] : [];

  const handleBrandChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newBrand = e.target.value;
    const firstModel =
      Object.keys(CAR_DATA[newBrand] || {})[0] || "";
    const firstVersion =
      (CAR_DATA[newBrand]?.[firstModel] || [])[0] || "";
    onChange({
      brand: newBrand,
      model: firstModel,
      version: firstVersion,
    });
  };

  const handleModelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newModel = e.target.value;
    const firstVersion =
      (CAR_DATA[brand]?.[newModel] || [])[0] || "";
    onChange({
      brand,
      model: newModel,
      version: firstVersion,
    });
  };

  const handleVersionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newVersion = e.target.value;
    onChange({
      brand,
      model,
      version: newVersion,
    });
  };

  return (
    <div className="car-selector">
      <div className="car-selector__field">
        <label htmlFor="car-brand">Car Brand</label>
        <select
          id="car-brand"
          value={brand}
          onChange={handleBrandChange}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className="car-selector__field">
        <label htmlFor="car-model">Car Model</label>
        <select
          id="car-model"
          value={model}
          onChange={handleModelChange}
        >
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="car-selector__field">
        <label htmlFor="car-version">Version / Trim</label>
        <select
          id="car-version"
          value={version}
          onChange={handleVersionChange}
        >
          {versions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};