import React, { useState } from 'react';
import './PortalStoreProfile.css';

type Tab = 'General' | 'Contact' | 'Branding' | 'Products';

const STORE_PRODUCTS = [
  { id: 1, name: 'Car Cover for Toyota Hilux',       price: 520,  stock: 15, status: 'Active',   image: '/Products/car-cover.jpg' },
  { id: 2, name: 'Premium Leather Seat Cover Set',   price: 890,  stock: 8,  status: 'Active',   image: '/Products/seat-cover-front.jpeg' },
  { id: 3, name: 'Steering Wheel Cover Carbon Fiber',price: 340,  stock: 22, status: 'Active',   image: '/Products/seat-cover-detail.jpeg' },
  { id: 4, name: 'Premium Car Cover for Fortuner',   price: 750,  stock: 5,  status: 'Inactive', image: '/Products/white-car.jpg' },
];

export function PortalStoreProfile() {
  const [activeTab, setActiveTab] = useState<Tab>('General');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="sppage">
      {/* Header */}
      <div className="sppage__header">
        <div>
          <h1 className="sppage__title">Store Profile</h1>
          <p className="sppage__sub">Manage your store details and appearance</p>
        </div>
        <div className="sppage__header-actions">
          <button className="btn-outline">Discard</button>
          <button className={`btn-primary${saved ? ' btn-primary--saved' : ''}`} onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="sppage__tabs">
        {(['General', 'Contact', 'Branding', 'Products'] as Tab[]).map(t => (
          <button
            key={t}
            className={`sptab${activeTab === t ? ' sptab--active' : ''}`}
            onClick={() => setActiveTab(t)}
          >{t}</button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sppage__body">
        {activeTab === 'General' && <GeneralTab />}
        {activeTab === 'Contact' && <ContactTab />}
        {activeTab === 'Branding' && <BrandingTab />}
        {activeTab === 'Products' && <StoreProductsTab />}
      </div>
    </div>
  );
}

/* ---- General Tab ---- */
function GeneralTab() {
  return (
    <div className="sp-form">
      <div className="sp-form__section">
        <h3 className="sp-form__section-title">Store Information</h3>
        <div className="sp-form__grid">
          <div className="sp-field">
            <label className="sp-field__label">Store Name</label>
            <input className="sp-field__input" defaultValue="AutoExtras SA" />
          </div>
          <div className="sp-field">
            <label className="sp-field__label">Store URL</label>
            <div className="sp-field__url-wrap">
              <span className="sp-field__url-prefix">autoextras.co.za/store/</span>
              <input className="sp-field__input sp-field__input--url" defaultValue="autoextras-sa" />
            </div>
          </div>
          <div className="sp-field sp-field--full">
            <label className="sp-field__label">Store Description</label>
            <textarea className="sp-field__textarea" rows={4}
              defaultValue="Premium car accessories and seat covers for all vehicle makes and models. Custom embroidery available." />
          </div>
          <div className="sp-field">
            <label className="sp-field__label">Primary Category</label>
            <select className="sp-field__select">
              <option>Car Accessories</option>
              <option>Seat Covers</option>
              <option>Car Covers</option>
              <option>Interior Accessories</option>
            </select>
          </div>
          <div className="sp-field">
            <label className="sp-field__label">Year Established</label>
            <input className="sp-field__input" defaultValue="2019" type="number" />
          </div>
        </div>
      </div>

      <div className="sp-form__section">
        <h3 className="sp-form__section-title">Operating Hours</h3>
        <div className="sp-form__grid">
          {['Monday – Friday', 'Saturday', 'Sunday'].map((day, i) => (
            <div key={day} className="sp-hours-row">
              <span className="sp-hours-day">{day}</span>
              <input className="sp-field__input sp-hours-input" defaultValue={i === 0 ? '08:00' : i === 1 ? '09:00' : 'Closed'} />
              {i < 2 && <span className="sp-hours-to">to</span>}
              {i < 2 && <input className="sp-field__input sp-hours-input" defaultValue={i === 0 ? '17:00' : '13:00'} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Contact Tab ---- */
function ContactTab() {
  return (
    <div className="sp-form">
      <div className="sp-form__section">
        <h3 className="sp-form__section-title">Contact Details</h3>
        <div className="sp-form__grid">
          <div className="sp-field">
            <label className="sp-field__label">Phone Number</label>
            <input className="sp-field__input" defaultValue="+27 79 123 4567" />
          </div>
          <div className="sp-field">
            <label className="sp-field__label">Email Address</label>
            <input className="sp-field__input" defaultValue="hello@autoextras.co.za" type="email" />
          </div>
          <div className="sp-field">
            <label className="sp-field__label">WhatsApp</label>
            <input className="sp-field__input" defaultValue="+27 79 123 4567" />
          </div>
          <div className="sp-field">
            <label className="sp-field__label">Website</label>
            <input className="sp-field__input" defaultValue="https://autoextras.co.za" type="url" />
          </div>
          <div className="sp-field sp-field--full">
            <label className="sp-field__label">Physical Address</label>
            <input className="sp-field__input" defaultValue="14 Automotive Drive, Sandton, Johannesburg, 2196" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Branding Tab ---- */
function BrandingTab() {
  return (
    <div className="sp-form">
      <div className="sp-form__section">
        <h3 className="sp-form__section-title">Brand Assets</h3>
        <div className="sp-brand-uploads">
          <div className="sp-upload">
            <div className="sp-upload__preview sp-upload__preview--logo">
              <div className="sp-upload__placeholder-logo">AE</div>
            </div>
            <div className="sp-upload__info">
              <span className="sp-upload__label">Store Logo</span>
              <span className="sp-upload__hint">PNG or SVG, max 2MB, min 200×200px</span>
              <button className="btn-outline sp-upload__btn">Upload Logo</button>
            </div>
          </div>
          <div className="sp-upload">
            <div className="sp-upload__preview sp-upload__preview--banner">
              <div className="sp-upload__placeholder-banner">Banner Image</div>
            </div>
            <div className="sp-upload__info">
              <span className="sp-upload__label">Store Banner</span>
              <span className="sp-upload__hint">JPG or PNG, max 5MB, 1200×400px recommended</span>
              <button className="btn-outline sp-upload__btn">Upload Banner</button>
            </div>
          </div>
        </div>
      </div>
      <div className="sp-form__section">
        <h3 className="sp-form__section-title">Brand Colours</h3>
        <div className="sp-form__grid">
          <div className="sp-field">
            <label className="sp-field__label">Primary Colour</label>
            <div className="sp-color-row">
              <input type="color" className="sp-color-picker" defaultValue="#4f6af5" />
              <input className="sp-field__input" defaultValue="#4F6AF5" style={{ flex: 1 }} />
            </div>
          </div>
          <div className="sp-field">
            <label className="sp-field__label">Accent Colour</label>
            <div className="sp-color-row">
              <input type="color" className="sp-color-picker" defaultValue="#f97316" />
              <input className="sp-field__input" defaultValue="#F97316" style={{ flex: 1 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Products Tab ---- */
function StoreProductsTab() {
  return (
    <div className="sp-products">
      <div className="sp-products__header">
        <span className="sp-products__count">{STORE_PRODUCTS.length} active listings</span>
        <button className="btn-primary">+ Add Product</button>
      </div>
      <div className="sp-products__table-wrap">
        <table className="ptable">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {STORE_PRODUCTS.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="ptable__product">
                    <img src={p.image} alt={p.name} className="ptable__thumb" />
                    <span className="ptable__name">{p.name}</span>
                  </div>
                </td>
                <td className="ptable__price">R{p.price.toLocaleString()}.00</td>
                <td>
                  <span className={`stock-pill${p.stock <= 5 ? ' stock-pill--low' : ''}`}>
                    {p.stock} units
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-badge--${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td>
                  <div className="ptable__actions">
                    <button className="action-btn" title="Edit">✏️</button>
                    <button className="action-btn action-btn--danger" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
