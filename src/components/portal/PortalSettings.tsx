import { useState } from 'react';
import './PortalSettings.css';

type Tab = 'profile' | 'password' | 'notifications' | 'billing';

export function PortalSettings() {
  const [tab, setTab]     = useState<Tab>('profile');
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    firstName: 'Portia', lastName: 'Matha', email: 'portia@mag.cr',
    phone: '+27 79 123 4567', company: 'MotorCovers SA', city: 'Johannesburg',
  });

  const [password, setPassword] = useState({ current: '', next: '', confirm: '' });

  const [notifs, setNotifs] = useState({
    orderEmails: true, marketingEmails: false,
    smsAlerts: true, weeklyReport: true,
  });

  const [billing, setBilling] = useState({
    plan: 'standard', cardHolder: 'Portia Matha',
    cardNumber: '•••• •••• •••• 4242', expiry: '08/27', cvv: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'profile',       label: 'Profile',        icon: '👤' },
    { id: 'password',      label: 'Password',        icon: '🔒' },
    { id: 'notifications', label: 'Notifications',   icon: '🔔' },
    { id: 'billing',       label: 'Billing',         icon: '💳' },
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-sub">Manage your account and portal preferences.</p>
      </div>

      <div className="settings-layout">
        <nav className="settings-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`settings-nav__item${tab === t.id ? ' settings-nav__item--active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        <div className="settings-content">
          {/* ── Profile ── */}
          {tab === 'profile' && (
            <form className="settings-card" onSubmit={handleSave}>
              <h3 className="settings-card__title">Profile Information</h3>
              <div className="settings-grid">
                <div className="settings-field">
                  <label className="settings-label">First Name</label>
                  <input className="settings-input" value={profile.firstName}
                    onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Last Name</label>
                  <input className="settings-input" value={profile.lastName}
                    onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Email Address</label>
                  <input type="email" className="settings-input" value={profile.email}
                    onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Phone</label>
                  <input className="settings-input" value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Company</label>
                  <input className="settings-input" value={profile.company}
                    onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">City</label>
                  <input className="settings-input" value={profile.city}
                    onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} />
                </div>
              </div>
              <div className="settings-footer">
                <button type="submit" className={`btn-primary${saved ? ' btn-primary--saved' : ''}`}>
                  {saved ? '✓ Saved!' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {/* ── Password ── */}
          {tab === 'password' && (
            <form className="settings-card" onSubmit={handleSave}>
              <h3 className="settings-card__title">Change Password</h3>
              <div className="settings-grid settings-grid--single">
                <div className="settings-field">
                  <label className="settings-label">Current Password</label>
                  <input type="password" className="settings-input" placeholder="••••••••"
                    value={password.current} onChange={e => setPassword(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">New Password</label>
                  <input type="password" className="settings-input" placeholder="••••••••"
                    value={password.next} onChange={e => setPassword(p => ({ ...p, next: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Confirm New Password</label>
                  <input type="password" className="settings-input" placeholder="••••••••"
                    value={password.confirm} onChange={e => setPassword(p => ({ ...p, confirm: e.target.value }))} />
                </div>
              </div>
              <div className="settings-footer">
                <button type="submit" className={`btn-primary${saved ? ' btn-primary--saved' : ''}`}>
                  {saved ? '✓ Updated!' : 'Update Password'}
                </button>
              </div>
            </form>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <form className="settings-card" onSubmit={handleSave}>
              <h3 className="settings-card__title">Notification Preferences</h3>
              <div className="settings-toggles">
                {([
                  ['orderEmails',    'Order confirmation emails',   'Receive an email when a new order is placed.'],
                  ['marketingEmails','Marketing emails',             'Promotions, new products and partner updates.'],
                  ['smsAlerts',      'SMS alerts',                  'Critical alerts sent directly to your phone.'],
                  ['weeklyReport',   'Weekly performance report',   'A summary of your store performance every Monday.'],
                ] as const).map(([key, label, desc]) => (
                  <div key={key} className="settings-toggle-row">
                    <div className="settings-toggle-info">
                      <span className="settings-toggle-label">{label}</span>
                      <span className="settings-toggle-desc">{desc}</span>
                    </div>
                    <button
                      type="button"
                      className={`settings-toggle${notifs[key] ? ' settings-toggle--on' : ''}`}
                      onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                      aria-label={label}
                    >
                      <span className="settings-toggle__thumb" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="settings-footer">
                <button type="submit" className={`btn-primary${saved ? ' btn-primary--saved' : ''}`}>
                  {saved ? '✓ Saved!' : 'Save Preferences'}
                </button>
              </div>
            </form>
          )}

          {/* ── Billing ── */}
          {tab === 'billing' && (
            <form className="settings-card" onSubmit={handleSave}>
              <h3 className="settings-card__title">Billing &amp; Subscription</h3>
              <div className="settings-plan-row">
                {[
                  { id:'basic',    label:'Basic',    price:'FREE' },
                  { id:'standard', label:'Standard', price:'R499/mo' },
                  { id:'premium',  label:'Premium',  price:'R999/mo' },
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    className={`settings-plan-btn${billing.plan === p.id ? ' settings-plan-btn--active' : ''}`}
                    onClick={() => setBilling(b => ({ ...b, plan: p.id }))}
                  >
                    <span className="settings-plan-name">{p.label}</span>
                    <span className="settings-plan-price">{p.price}</span>
                  </button>
                ))}
              </div>

              <h4 className="settings-section-sub">Payment Method</h4>
              <div className="settings-grid">
                <div className="settings-field settings-field--full">
                  <label className="settings-label">Card Holder</label>
                  <input className="settings-input" value={billing.cardHolder}
                    onChange={e => setBilling(b => ({ ...b, cardHolder: e.target.value }))} />
                </div>
                <div className="settings-field settings-field--full">
                  <label className="settings-label">Card Number</label>
                  <input className="settings-input" value={billing.cardNumber}
                    onChange={e => setBilling(b => ({ ...b, cardNumber: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">Expiry</label>
                  <input className="settings-input" placeholder="MM/YY" value={billing.expiry}
                    onChange={e => setBilling(b => ({ ...b, expiry: e.target.value }))} />
                </div>
                <div className="settings-field">
                  <label className="settings-label">CVV</label>
                  <input type="password" className="settings-input" placeholder="•••"
                    value={billing.cvv} onChange={e => setBilling(b => ({ ...b, cvv: e.target.value }))} />
                </div>
              </div>
              <div className="settings-footer">
                <button type="submit" className={`btn-primary${saved ? ' btn-primary--saved' : ''}`}>
                  {saved ? '✓ Saved!' : 'Save Billing'}
                </button>
                <button type="button" className="btn-outline" style={{ color:'#ef4444', borderColor:'#fca5a5' }}>
                  Cancel Subscription
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
