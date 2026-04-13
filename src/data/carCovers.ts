// src/data/carCovers.ts
export type View = "front" | "back" | "left" | "right";
export type CarAreaKey = "full-cover" | "steering-wheel" | "seat-covers" | "car-mat";

export type CarCover = {
  brand: string;
  model: string;
  version: string;
  images: Record<View, string>;
  prices: Record<CarAreaKey, number>;
};

export const carCovers: CarCover[] = [
  {
    brand: "Volkswagen",
    model: "Golf",
    version: "GTI",
    images: {
      front: "/covers/vw-golf-gti-front.jpg",
      back: "/covers/vw-golf-gti-back.jpg",
      left: "/covers/vw-golf-gti-left.jpg",
      right: "/covers/vw-golf-gti-right.jpg",
    },
    prices: {
      "full-cover": 3500,
      "steering-wheel": 450,
      "seat-covers": 2200,
      "car-mat": 800,
    },
  },
  // add more entries for other cars…
];
