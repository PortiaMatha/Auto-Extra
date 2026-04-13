export type CarVersion = string;

export type CarModel = {
  name: string;
  versions: CarVersion[];
  colour: CarColour[];
};

export type CarBrand = {
  name: string;
  models: CarModel[];
};

export type CarColour = string;

export const carOptions: CarBrand[] = [
  {
    name: "Toyota",
    models: [
      { name: "Corolla", versions: ["1.6 Prestige", "1.8 XR", "GR-S"], colour: ["White", "Grey","Black","Red","Blue"] },
      { name: "Hilux", versions: ["2.4 GD-6", "2.8 Legend"], colour: ["White", "Grey","Black","Red","Blue"]},
    ],
  },
  {
    name: "Volkswagen",
    models: [
      { name: "Golf", versions: ["GTI", "R-Line"], colour: ["White", "Grey","Black","Red","Blue"] },
      { name: "Polo", versions: ["Trendline", "Comfortline", "GTI"], colour: ["White", "Grey","Black","Red","Blue"] },
    ],
  },
  {
    name: "BMW",
    models: [
      { name: "3 Series", versions: ["318i", "320d", "330i"], colour: ["White", "Grey","Black","Red","Blue"] },
      { name: "X5", versions: ["xDrive30d", "xDrive40i"], colour: ["White", "Grey","Black","Red","Blue"] },
    ],
  },
];
