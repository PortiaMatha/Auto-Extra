import { useState } from 'react';
import './PortalCustomization.css';

export function PortalCustomization() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    storeName: 'My AutoExtras Store',
    tagline: 'Premium car covers for every road.',
    primaryColor: '#4f6af5',
    accentColor: '#ffcc00',
    description: 'We offer a wide range of high-quality automotive covers including interior, exterior and custom-built options.',
    banner: '',
  });

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="custom-page">
      <div className="custom-page__header">
        <div>
          <h1 className="custom-page__title">Store Customization</h1>
          <p className="custom-page__sub">Personalise how your store appears to customers on AutoExtras.</p>
        </div>
      </div>

      <form className="custom-body" onSubmit={handleSave}>
        <div className="custom-card">
          <h3 className="custom-card__title">Store Identity</h3>
          <div className="custom-grid">
            <div className="custom-field">
              <label className="custom-label">Store Name</label>
              <input className="custom-input" value={form.storeName} onChange={set('storeName')} />
            </div>
            <div className="custom-field">
              <label className="custom-label">Tagline</label>
              <input className="custom-input" value={form.tagline} onChange={set('tagline')} placeholder="Short one-liner about your store" />
            </div>
          </div>
          <div className="custom-field">
            <label className="custom-label">Store Description</label>
            <textarea className="custom-input custom-textarea" rows={3} value={form.description} onChange={set('description')} />
          </div>
        </div>

        <div className="custom-card">
          <h3 className="custom-card__title">Brand Colours</h3>
          <div className="custom-grid">
            <div className="custom-field">
              <label className="custom-label">Primary Colour</label>
              <div className="custom-color-row">
                <input type="color" className="custom-color-picker" value={form.primaryColor}
                  onChange={set('primaryColor')} />
                <input className="custom-input custom-input--color-text" value={form.primaryColor}
                  onChange={set('primaryColor')} placeholder="#4f6af5" />
              </div>
            </div>
            <div className="custom-field">
              <label className="custom-label">Accent Colour</label>
              <div className="custom-color-row">
                <input type="color" className="custom-color-picker" value={form.accentColor}
                  onChange={set('accentColor')} />
                <input className="custom-input custom-input--color-text" value={form.accentColor}
                  onChange={set('accentColor')} placeholder="#ffcc00" />
              </div>
            </div>
          </div>
          <div className="custom-preview">
            <span style={{ background: form.primaryColor, color: '#fff', padding: '6px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600 }}>
              Primary Button
            </span>
            <span style={{ background: form.accentColor, color: '#111', padding: '6px 18px', borderRadius: 7, fontSize: 13, fontWeight: 600, marginLeft: 10 }}>
              Accent Button
            </span>
          </div>
        </div>

        <div className="custom-card">
          <h3 className="custom-card__title">Logo &amp; Banner</h3>
          <div className="custom-grid">
            <div className="custom-field">
              <label className="custom-label">Store Logo</label>
              <div className="custom-upload-box">
                <span>🖼</span>
                <p>Drag &amp; drop or <strong>browse</strong></p>
                <p className="custom-upload-hint">PNG, JPG, SVG · Max 2MB</p>
              </div>
            </div>
            <div className="custom-field">
              <label className="custom-label">Banner Image</label>
              <div className="custom-upload-box">
                <span>🖼</span>
                <p>Drag &amp; drop or <strong>browse</strong></p>
                <p className="custom-upload-hint">PNG, JPG · Min 1200×400 · Max 5MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="custom-footer">
          <button type="submit" className={`btn-primary${saved ? ' btn-primary--saved' : ''}`}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
          <button type="button" className="btn-outline">Reset</button>
        </div>
      </form>
    </div>
  );
}
