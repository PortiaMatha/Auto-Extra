import React from 'react';
import { Link } from 'react-router-dom';
import './ExteriorPage.css';
import { products } from '../../data/products';
import { ProductCard } from '../shared/ProductCard';

const exteriorProducts = products.filter(p => p.category === 'exterior');

const FEATURES = [
  { icon: '🌧️', title: 'All-Weather Protection', desc: 'UV-resistant and waterproof materials that stand up to rain, dust and harsh sunlight.' },
  { icon: '🔒', title: 'Secure Fit', desc: 'Elastic hems, wind straps and mirror pockets ensure your cover stays put.' },
  { icon: '🚘', title: 'Vehicle Specific', desc: 'Covers sized for sedans, hatchbacks, SUVs and bakkies — choose your model.' },
];

export function ExteriorPage() {
  return (
    <div className="exterior-page">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <Link to="/">Home</Link> / <span>Exterior Covers</span>
      </div>

      {/* Hero */}
      <section className="exterior-hero">
        <div className="exterior-hero__image">
          <img src="/header-exterior.jpeg" alt="Exterior car cover" />
        </div>
        <div className="exterior-hero__text">
          <span className="exterior-hero__tag">Exterior Collection</span>
          <h1 className="exterior-hero__title">
            Exterior Covers <br /><em>Built to Protect</em>
          </h1>
          <p className="exterior-hero__sub">
            Guard your vehicle against UV, rain, dust and scratches with our range
            of premium exterior car covers — available for all makes and sizes.
          </p>
          <div className="exterior-hero__actions">
            <Link to="/shop" className="btn-yellow">Browse All Covers</Link>
            <Link to="/contact" className="btn-ghost">Get a Quote →</Link>
          </div>
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
            <h2 className="section-title">Exterior Cover Range</h2>
            <p className="section-sub">{exteriorProducts.length} products available</p>
          </div>
          <Link to="/shop" className="view-all-link">View all in Shop →</Link>
        </div>
        <div className="product-grid">
          {exteriorProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Why choose us */}
      <section className="ext-why">
        <h2 className="section-title" style={{ marginBottom: '1.2rem' }}>Why choose our covers?</h2>
        <div className="ext-why__grid">
          {[
            { label: 'Waterproof', pct: 100 },
            { label: 'UV Resistant', pct: 100 },
            { label: 'Dust Proof', pct: 98 },
            { label: 'Customer Satisfaction', pct: 96 },
          ].map(item => (
            <div key={item.label} className="ext-why__item">
              <div className="ext-why__label">{item.label}</div>
              <div className="ext-why__bar">
                <div className="ext-why__fill" style={{ width: `${item.pct}%` }} />
              </div>
              <span className="ext-why__pct">{item.pct}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="exterior-cta">
        <div>
          <h2 className="exterior-cta__title">Not sure which size?</h2>
          <p className="exterior-cta__sub">Contact us and we'll match the perfect cover to your vehicle.</p>
        </div>
        <Link to="/contact" className="btn-yellow">Contact Us →</Link>
      </section>
    </div>
  );
}
