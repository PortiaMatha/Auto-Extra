import React, { useEffect, useRef, useState } from "react";
import "./CarBuilderForm.css";
import { CarSelector } from "./CarSelector";
import { CustomBuilder3D } from "../builder3d/CustomBuilder3D";
import { useCart } from "../../context/CartContext";
import { Product } from "../../data/products";

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

const AREA_OPTIONS: {
  value: CarArea;
  label: string;
  desc: string;
  price: number;
}[] = [
  { value: "full-cover",     label: "Full Interior Set", desc: "Seats, headrests & all trims", price: 3500 },
  { value: "seat-covers",    label: "Seat Covers",       desc: "Front & rear seats",            price: 2200 },
  { value: "steering-wheel", label: "Steering Wheel",    desc: "Full wheel wrap & hub cover",   price: 800  },
  { value: "car-mat",        label: "Car Mats",          desc: "Complete floor mat set",         price: 1200 },
];

const formatZAR = (v: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(v);

export const CarBuilderForm: React.FC<CarBuilderFormProps> = ({ onChange }) => {
  const { addItem } = useCart();
  const [selection, setSelection] = useState<CarSelection>(defaultSelection);
  const [area, setArea]           = useState<CarArea>("full-cover");
  const [logoFile, setLogoFile]   = useState<File | null>(null);
  const [logoUrl, setLogoUrl]     = useState<string | null>(null);
  const [dragging, setDragging]   = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const fileInputRef              = useRef<HTMLInputElement>(null);

  const price = AREA_OPTIONS.find(o => o.value === area)!.price;

  useEffect(() => {
    onChange?.({ selection, area, price, logoFile, logoUrl });
  }, [selection, area, price, logoFile, logoUrl, onChange]);

  const applyFile = (file: File | null) => {
    setLogoFile(file);
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
    } else {
      setLogoUrl(null);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    applyFile(e.target.files?.[0] ?? null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) applyFile(file);
  };

  return (
    <div className="cb">

      {/* ── Header strip ── */}
      <div className="cb__header">
        <div className="cb__header-text">
          <h3 className="cb__header-title">Custom Cover Builder</h3>
          <p className="cb__header-sub">Choose your car, pick the area and upload your logo</p>
        </div>
        <ol className="cb__steps-track">
          <li className="cb__step-item cb__step-item--done">
            <span className="cb__step-num">1</span>
            <span className="cb__step-name">Vehicle</span>
          </li>
          <li className="cb__step-item cb__step-item--done">
            <span className="cb__step-num">2</span>
            <span className="cb__step-name">Location</span>
          </li>
          <li className="cb__step-item">
            <span className="cb__step-num">3</span>
            <span className="cb__step-name">Logo</span>
          </li>
          <li className="cb__step-item">
            <span className="cb__step-num">4</span>
            <span className="cb__step-name">Preview</span>
          </li>
        </ol>
      </div>

      {/* ── Body ── */}
      <div className="cb__body">

        {/* ── Config column ── */}
        <div className="cb__config">

          {/* Step 1 — Vehicle */}
          <section className="cb__section">
            <header className="cb__section-head">
              <span className="cb__section-num">01</span>
              <h4 className="cb__section-title">Your Vehicle</h4>
            </header>
            <CarSelector value={selection} onChange={setSelection} />
          </section>

          {/* Step 2 — Print area */}
          <section className="cb__section">
            <header className="cb__section-head">
              <span className="cb__section-num">02</span>
              <h4 className="cb__section-title">Print Location</h4>
            </header>
            <div className="cb__areas">
              {AREA_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  className={`cb__area-card${area === opt.value ? " cb__area-card--active" : ""}`}
                  onClick={() => setArea(opt.value)}
                >
                  <span className="cb__area-card__name">{opt.label}</span>
                  <span className="cb__area-card__desc">{opt.desc}</span>
                  <span className="cb__area-card__price">{formatZAR(opt.price)}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Step 3 — Logo upload */}
          <section className="cb__section">
            <header className="cb__section-head">
              <span className="cb__section-num">03</span>
              <h4 className="cb__section-title">Upload Your Logo</h4>
            </header>

            <div
              className={`cb__dropzone${dragging ? " cb__dropzone--drag" : ""}${logoUrl ? " cb__dropzone--filled" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="cb__dropzone-input"
              />

              {logoUrl ? (
                <div className="cb__dropzone-preview">
                  <img src={logoUrl} alt="Uploaded logo" className="cb__dropzone-img" />
                  <span className="cb__dropzone-change">Click to replace</span>
                </div>
              ) : (
                <div className="cb__dropzone-idle">
                  <svg className="cb__dropzone-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span className="cb__dropzone-text">
                    {dragging ? "Drop it here" : "Drag & drop or click to upload"}
                  </span>
                  <span className="cb__dropzone-hint">PNG, JPG or SVG — max 5 MB</span>
                </div>
              )}
            </div>

            {logoUrl && (
              <button
                type="button"
                className="cb__remove-logo"
                onClick={e => { e.stopPropagation(); applyFile(null); }}
              >
                Remove logo
              </button>
            )}
          </section>
        </div>

        {/* ── Preview column ── */}
        <div className="cb__preview-col">

          {/* 3D canvas */}
          <div className="cb__canvas-wrap">
            <CustomBuilder3D
              logoUrl={logoUrl}
              brand={selection.brand}
              model={selection.model}
              version={selection.version}
              area={area}
            />
          </div>

          {/* Summary card */}
          <div className="cb__summary">
            <div className="cb__summary-row">
              <span className="cb__summary-label">Vehicle</span>
              <span className="cb__summary-value">
                {selection.brand} {selection.model} — {selection.version}
              </span>
            </div>
            <div className="cb__summary-row">
              <span className="cb__summary-label">Cover type</span>
              <span className="cb__summary-value">
                {AREA_OPTIONS.find(o => o.value === area)!.label}
              </span>
            </div>
            {logoUrl && (
              <div className="cb__summary-row">
                <span className="cb__summary-label">Logo</span>
                <span className="cb__summary-value cb__summary-value--green">Uploaded</span>
              </div>
            )}
            <div className="cb__summary-price-row">
              <span className="cb__summary-price-label">Estimated total</span>
              <span className="cb__summary-price-amount">{formatZAR(price)}</span>
            </div>
            <button
              className="cb__order-btn"
              type="button"
              onClick={() => {
                const customProduct: Product = {
                  id: Date.now(),
                  slug: `custom-${Date.now()}`,
                  title: `${selection.brand} ${selection.model} — ${AREA_OPTIONS.find(o => o.value === area)!.label}`,
                  category: "custom",
                  brand: selection.brand,
                  description: `Custom-built cover for ${selection.brand} ${selection.model} ${selection.version}`,
                  basePrice: price,
                  shippingFee: 150,
                  materialOptions: [],
                  sizeOptions: [],
                  colors: [],
                  images: [logoUrl ?? "/Products/custome-logo.png"],
                  averageRating: 0,
                  reviewCount: 0,
                  stock: 1,
                  status: 'Active',
                };
                addItem(customProduct);
                setAddedToCart(true);
                setTimeout(() => setAddedToCart(false), 2500);
              }}
            >
              {addedToCart ? "✓ Added to Cart!" : "Add to Cart"}
            </button>
            <p className="cb__summary-note">
              Final price confirmed at checkout after vehicle fit check.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
