import React from 'react';
import { Link } from 'react-router-dom';
import './InteriorPage.css';
import { products } from '../../data/products';
import { ProductCard } from '../shared/ProductCard';

const interiorProducts = products.filter(p => p.category === 'interior');

const FEATURES = [
  { icon: '🪡', title: 'Custom Embroidery', desc: 'Add your logo, initials or design — stitched directly into the fabric.' },
  { icon: '🛡️', title: 'Durable Materials', desc: 'Premium leather, synthetic and cotton options built to last for years.' },
  { icon: '🚗', title: 'Perfect Fit', desc: 'Tailored to your exact vehicle make, model and seat configuration.' },
];

export function InteriorPage() {
  return (
    <div className="interior-page">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <Link to="/">Home</Link> / <span>Interior Covers</span>
      </div>

      {/* Hero */}
      <section className="interior-hero">
        <div className="interior-hero__text">
          <span className="interior-hero__tag">Interior Collection</span>
          <h1 className="interior-hero__title">
            Interior Covers <br /><em>Crafted for Your Ride</em>
          </h1>
          <p className="interior-hero__sub">
            Seat covers, steering wheel covers, floor mats and more — all available
            with custom logo embroidery for your personal touch.
          </p>
          <div className="interior-hero__actions">
            <Link to="/shop" className="btn-yellow">Shop All Interior</Link>
            <Link to="/builder" className="btn-ghost">Customise Yours →</Link>
          </div>
        </div>
        <div className="interior-hero__image">
          <img src="/header-interior.jpeg" alt="Interior seat cover" />
        </div>
      </section>

      {/* Features */}
      <section className="features-row">
        {FEATURES.map(f => (
          <div key={f.title} className="feature-card">
            <span className="feature-card__icon">{f.icon}</span>
            <h3 className="feature-card__title">{f.title}</h3>
            <p className="feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Products */}
      <section>
        <div className="section-header">
          <div>
            <h2 className="section-title">Interior Cover Range</h2>
            <p className="section-sub">{interiorProducts.length} products available</p>
          </div>
          <Link to="/shop?filter=interior" className="view-all-link">View all in Shop →</Link>
        </div>
        <div className="product-grid">
          {interiorProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="interior-cta">
        <div>
          <h2 className="interior-cta__title">Want something unique?</h2>
          <p className="interior-cta__sub">Use our Custom Builder to create covers with your own logo and colours.</p>
        </div>
        <Link to="/builder" className="btn-yellow">Start Custom Builder →</Link>
      </section>
    </div>
  );
}
