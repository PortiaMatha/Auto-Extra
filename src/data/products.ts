// src/data/products.ts
export type ProductCategory = "interior" | "exterior" | "custom";

export interface Product {
  id: number;
  slug: string;
  title: string;
  category: ProductCategory;
  brand: string;
  description: string;
  basePrice: number;
  shippingFee: number;
  materialOptions: string[];
  sizeOptions: string[];
  colors: string[];
  images: string[];
  averageRating: number;
  reviewCount: number;
}

/* ── Shared filter options ───────────────────────────────────── */

export const MATERIAL_OPTIONS = [
  'Polyester',
  'Nylon',
  'Plastic',
  'Canvas',
  'Micro-polyester',
  'Nylon blend',
  'Polyester-fibre',
];

export const COLOR_OPTIONS: { name: string; hex: string }[] = [
  { name: 'Black',  hex: '#111111' },
  { name: 'Red',    hex: '#e53935' },
  { name: 'White',  hex: '#f0f0f0' },
  { name: 'Yellow', hex: '#ffcc00' },
  { name: 'Grey',   hex: '#9e9e9e' },
  { name: 'Beige',  hex: '#e8d5b5' },
  { name: 'Blue',   hex: '#1e6fc5' },
  { name: 'Brown',  hex: '#795548' },
];

/* ── Products ────────────────────────────────────────────────── */

export const products: Product[] = [
  {
    id: 1,
    slug: "premium-leather-seat-cover-set",
    title: "Premium Leather Seat Cover Set",
    category: "interior",
    brand: "Volkswagen",
    description:
      "High–quality leather seat cover set designed to fit your car model. Durable, easy to clean and perfect for custom logo prints.",
    basePrice: 2500,
    shippingFee: 150,
    materialOptions: ["Polyester-fibre", "Nylon", "Micro-polyester"],
    sizeOptions: ["S", "M", "L", "XL"],
    colors: ["Black", "Red", "Beige"],
    images: [
      "/Products/seat-cover-front.jpeg",
      "/Products/seat-cover-detail.jpeg",
      "/Products/seat-cover-back.jpeg",
    ],
    averageRating: 4.6,
    reviewCount: 18,
  },
  {
    id: 2,
    slug: "sport-steering-wheel-cover",
    title: "Sport Steering Wheel Cover",
    category: "interior",
    brand: "Universal",
    description:
      "Sport-style steering wheel cover with excellent grip and comfort, available in multiple colours.",
    basePrice: 450,
    shippingFee: 80,
    materialOptions: ["Nylon blend", "Micro-polyester"],
    sizeOptions: ["S", "M", "L"],
    colors: ["Black", "Red", "White"],
    images: [
      "/Products/seat-cover-detail.jpeg",
      "/Products/seat-cover-detail.jpeg",
    ],
    averageRating: 4.3,
    reviewCount: 9,
  },
  {
    id: 3,
    slug: "car-cover",
    title: "Car cover",
    category: "interior",
    brand: "Universal",
    description:
      "Sport-style steering wheel cover with excellent grip and comfort, available in multiple colours.",
    basePrice: 450,
    shippingFee: 80,
    materialOptions: ["Polyester", "Canvas"],
    sizeOptions: ["S", "M", "L"],
    colors: ["Black", "Grey", "Beige"],
    images: [
      "/Products/seat-cover-detail.jpeg",
      "/Products/seat-cover-detail.jpeg",
    ],
    averageRating: 4.3,
    reviewCount: 9,
  },
  {
    id: 4,
    slug: "car-cover-2",
    title: "Car cover",
    category: "interior",
    brand: "Universal",
    description:
      "Sport-style steering wheel cover with excellent grip and comfort, available in multiple colours.",
    basePrice: 450,
    shippingFee: 80,
    materialOptions: ["Polyester", "Canvas"],
    sizeOptions: ["S", "M", "L"],
    colors: ["Black", "Grey"],
    images: [
      "/Products/seat-cover-detail.jpeg",
      "/Products/seat-cover-detail.jpeg",
    ],
    averageRating: 4.3,
    reviewCount: 9,
  },
  {
    id: 5,
    slug: 'universal-car-body-cover',
    title: 'Universal Car Body Cover',
    category: 'exterior',
    brand: 'Universal',
    description: 'Heavy-duty waterproof exterior car cover suitable for all weather conditions. UV-resistant and dust-proof.',
    basePrice: 520,
    shippingFee: 100,
    materialOptions: ['Polyester', 'Nylon'],
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colors: ['Grey', 'Black', 'Blue'],
    images: ['/Products/car-cover.jpg', '/Products/white-car.jpg'],
    averageRating: 4.5,
    reviewCount: 22,
  },
  {
    id: 6,
    slug: 'premium-suv-exterior-cover',
    title: 'Premium SUV Exterior Cover',
    category: 'exterior',
    brand: 'Universal',
    description: 'Premium-grade exterior cover designed specifically for SUV and 4x4 models. Includes carry bag.',
    basePrice: 890,
    shippingFee: 120,
    materialOptions: ['Polyester-fibre', 'Canvas'],
    sizeOptions: ['L', 'XL', 'XXL'],
    colors: ['Grey', 'Black', 'White'],
    images: ['/Products/white-car.jpg', '/Products/car-cover.jpg'],
    averageRating: 4.7,
    reviewCount: 14,
  },
  {
    id: 7,
    slug: 'all-weather-hatchback-cover',
    title: 'All-Weather Hatchback Cover',
    category: 'exterior',
    brand: 'Universal',
    description: 'Lightweight all-weather cover tailored for hatchback models. Elastic hem for a snug fit.',
    basePrice: 420,
    shippingFee: 80,
    materialOptions: ['Polyester', 'Canvas', 'Nylon blend'],
    sizeOptions: ['S', 'M', 'L'],
    colors: ['Black', 'Grey', 'Blue'],
    images: ['/Products/car-cover.jpg'],
    averageRating: 4.3,
    reviewCount: 31,
  },
  {
    id: 8,
    slug: 'custom-logo-seat-cover',
    title: 'Custom Logo Seat Cover Set',
    category: 'custom',
    brand: 'AutoExtras',
    description: 'Fully personalised seat covers with your brand logo or custom design, printed to perfection.',
    basePrice: 1500,
    shippingFee: 150,
    materialOptions: ['Micro-polyester', 'Nylon blend'],
    sizeOptions: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Red', 'White', 'Yellow', 'Blue'],
    images: ['/Products/seat-cover-detail.jpeg', '/Products/seat-cover-front.jpeg'],
    averageRating: 4.9,
    reviewCount: 8,
  },
  {
    id: 9,
    slug: 'custom-embroidered-floor-mats',
    title: 'Custom Embroidered Floor Mats',
    category: 'custom',
    brand: 'AutoExtras',
    description: 'High-quality floor mats with custom embroidery — choose your text, colour and pattern.',
    basePrice: 950,
    shippingFee: 100,
    materialOptions: ['Nylon blend', 'Polyester-fibre', 'Canvas'],
    sizeOptions: ['S', 'M', 'L'],
    colors: ['Black', 'Brown', 'Beige', 'Red'],
    images: ['/Products/seat-cover-back.jpg'],
    averageRating: 4.8,
    reviewCount: 12,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
