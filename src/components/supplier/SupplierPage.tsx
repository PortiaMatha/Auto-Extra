import React, { useState } from 'react';
import './SupplierPage.css';
import { useSupplier } from '../../context/SupplierContext';

/* ── Data ───────────────────────────────────────────── */

const BENEFITS = [
  { icon: '📦', title: 'Wide Product Range', desc: 'Access a broad range of high-quality automotive products to offer your customers.' },
  { icon: '🤝', title: 'Dedicated Support', desc: 'Our team is here to support you every step of the way as you grow your business.' },
  { icon: '💰', title: 'Profitable Partnership', desc: 'Benefit from competitive margins and co-marketing to boost your sales.' },
];

const STEPS = [
  { n: '01', title: 'Sign Up',      desc: 'Create your retail partner account to start the registration process.', icon: '📝', btn: 'Register',   btnType: 'register'   },
  { n: '02', title: 'Get Approved', desc: 'Our team will verify your information and approve your application.',    icon: '✅', btn: 'Learn More', btnType: 'learn-more' },
  { n: '03', title: 'Start Selling',desc: 'Once approved, list your products and start selling on AutoExtras.',      icon: '🚀', btn: 'Home',       btnType: 'home'       },
];

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: 'FREE', priceNote: '', badge: '', color: '#f5f5f5', accentColor: '#333',
    features: ['Up to 50 product listings','Order management dashboard','Partner access to high-quality products','Standard support (email)','AutoExtras store listing'],
    cta: 'Join Now', ctaStyle: 'dark',
  },
  {
    id: 'standard', name: 'Standard', price: 'R499', priceNote: '/mo', badge: 'Most Popular', color: '#e53935', accentColor: '#e53935',
    features: ['Unlimited product listings','Order management dashboard','Partner co-branding on AutoExtras','1 social media post/week on AutoExtras','Priority support (email + chat)'],
    cta: 'Get Started', ctaStyle: 'red',
  },
  {
    id: 'premium', name: 'Premium', price: 'R999', priceNote: '/mo', badge: '', color: '#1a1a2e', accentColor: '#1a1a2e',
    features: ['Unlimited product listings','Advertise on AutoExtras homepage*','3 social media posts/week on AutoExtras','Priority support — 24 hrs, 3×/week','Dedicated account manager'],
    cta: 'Get Started', ctaStyle: 'dark',
  },
];

const FEATURES = [
  { icon: '📈', title: 'Earn More',             desc: 'Access competitive wholesale pricing and grow your revenue with our partner margins.' },
  { icon: '🌍', title: 'Wider Reach',            desc: 'List your products on AutoExtras and reach thousands of buyers across South Africa.' },
  { icon: '📊', title: 'Real-time Analytics',    desc: 'Track orders, sales and customer data from one powerful, easy-to-use dashboard.' },
  { icon: '🎯', title: 'Marketing Support',      desc: 'We co-market your store through social media, email campaigns and search promotions.' },
  { icon: '🛡️', title: 'Brand Protection',       desc: 'Your brand identity and product listings are protected under our partner agreement.' },
  { icon: '⚡', title: 'Fast Onboarding',        desc: 'Get set up in under 48 hours — our team guides you through every step of the process.' },
  { icon: '🤝', title: 'Dedicated Account Manager', desc: 'Premium partners receive a dedicated manager for personalised business support.' },
  { icon: '🎨', title: 'Custom Branding',        desc: 'Co-brand your storefront with your logo, colours and personalised product displays.' },
];

/* ── Auth modals ────────────────────────────────────── */

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Please enter your email and password.'); return; }
    onSuccess();
  };

  return (
    <div className="sp-modal-overlay" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        <button className="sp-modal__close" onClick={onClose}>✕</button>
        <h2 className="sp-modal__title">Retailer Login</h2>
        <p className="sp-modal__sub">Sign in to access your Retail Portal</p>

        {error && <p className="sp-modal__error">{error}</p>}

        <form className="sp-modal__form" onSubmit={handleSubmit}>
          <div className="sp-modal__field">
            <label className="sp-modal__label">Email Address</label>
            <input
              className="sp-modal__input"
              type="email"
              placeholder="you@business.co.za"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="sp-modal__field">
            <label className="sp-modal__label">Password</label>
            <input
              className="sp-modal__input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="sp-modal__btn sp-modal__btn--primary">
            Login to Portal
          </button>
        </form>

        <p className="sp-modal__footer-text">
          Don't have an account?{' '}
          <button className="sp-modal__link" onClick={onClose}>Register here</button>
        </p>
      </div>
    </div>
  );
}

interface RegisterModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

function RegisterModal({ onClose, onSuccess }: RegisterModalProps) {
  const [form, setForm] = useState({ businessName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim()) { setError('Business name is required.'); return; }
    if (!form.email.trim())        { setError('Email is required.'); return; }
    if (form.password.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    onSuccess();
  };

  return (
    <div className="sp-modal-overlay" onClick={onClose}>
      <div className="sp-modal" onClick={e => e.stopPropagation()}>
        <button className="sp-modal__close" onClick={onClose}>✕</button>
        <h2 className="sp-modal__title">Create Retail Account</h2>
        <p className="sp-modal__sub">Join the AutoExtras partner network</p>

        {error && <p className="sp-modal__error">{error}</p>}

        <form className="sp-modal__form" onSubmit={handleSubmit}>
          <div className="sp-modal__field">
            <label className="sp-modal__label">Business Name *</label>
            <input className="sp-modal__input" placeholder="AutoExtras SA" value={form.businessName} onChange={set('businessName')} />
          </div>
          <div className="sp-modal__field">
            <label className="sp-modal__label">Email Address *</label>
            <input className="sp-modal__input" type="email" placeholder="you@business.co.za" value={form.email} onChange={set('email')} />
          </div>
          <div className="sp-modal__field">
            <label className="sp-modal__label">Password *</label>
            <input className="sp-modal__input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
          </div>
          <div className="sp-modal__field">
            <label className="sp-modal__label">Confirm Password *</label>
            <input className="sp-modal__input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} />
          </div>
          <button type="submit" className="sp-modal__btn sp-modal__btn--primary">
            Create Account &amp; Go to Portal
          </button>
        </form>

        <p className="sp-modal__footer-text">
          Already have an account?{' '}
          <button className="sp-modal__link" onClick={onClose}>Login here</button>
        </p>
      </div>
    </div>
  );
}

/* ── Component ──────────────────────────────────────── */

export function SupplierPage() {
  const { registerAsSupplier } = useSupplier();
  const [modal, setModal] = useState<'login' | 'register' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const openPortal = () => {
    registerAsSupplier();
    window.open('/portal', '_blank', 'noopener,noreferrer');
  };

  const handleLoginSuccess = () => {
    setModal(null);
    openPortal();
  };

  const handleRegisterSuccess = () => {
    setModal(null);
    openPortal();
  };

  const handleStepBtn = (btnType: string) => {
    if (btnType === 'register')   setModal('register');
    if (btnType === 'learn-more') document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
    if (btnType === 'home')       window.location.href = '/';
  };

  return (
    <div className="sp-page">

      {/* ── HERO ──────────────────────────────────────── */}
      <section className="sp-hero">
        <div className="sp-hero__overlay" />
        <div className="sp-hero__content">
          <span className="sp-hero__tag">AutoExtras Partner Programme</span>
          <h1 className="sp-hero__title">
            Partner With AutoExtras:<br />
            <span>Expand Your Retail Business</span>
          </h1>
          <p className="sp-hero__sub">
            Join our network of retailers and boost your sales with AutoExtras.
            Choose a subscription package that fits your business and get started today.
          </p>
          <div className="sp-hero__actions">
            <button className="sp-hero__btn sp-hero__btn--primary" onClick={() => setModal('register')}>
              Register
            </button>
            <button className="sp-hero__btn sp-hero__btn--ghost" onClick={() => setModal('login')}>
              Login
            </button>
          </div>
        </div>
        <div className="sp-hero__images">
          <img src="/Products/car-cover.jpg" alt="Car cover" className="sp-hero__img sp-hero__img--1" />
          <img src="/Products/white-car.jpg" alt="Car" className="sp-hero__img sp-hero__img--2" />
          <img src="/Products/seat-cover-detail.jpeg" alt="Seat cover" className="sp-hero__img sp-hero__img--3" />
        </div>
      </section>

      {/* ── ABOUT US ──────────────────────────────────── */}
      <section className="sp-section">
        <div className="sp-section__head">
          <h2 className="sp-section__title">About Us</h2>
          <p className="sp-section__sub">
            Access a broad range of high-quality automotive products to offer your customers.
          </p>
        </div>
        <div className="sp-benefits-grid">
          {BENEFITS.map(b => (
            <div key={b.title} className="sp-benefit-card">
              <span className="sp-benefit-card__icon">{b.icon}</span>
              <h3 className="sp-benefit-card__title">{b.title}</h3>
              <p className="sp-benefit-card__desc">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────── */}
      <section className="sp-section sp-section--dark" id="how-it-works">
        <div className="sp-section__head sp-section__head--light">
          <h2 className="sp-section__title">How It Works</h2>
          <p className="sp-section__sub">Three simple steps to start your partnership.</p>
        </div>
        <div className="sp-steps">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.n}>
              <div className="sp-step">
                <div className="sp-step__num">{step.n}</div>
                <div className="sp-step__icon">{step.icon}</div>
                <h3 className="sp-step__title">{step.title}</h3>
                <p className="sp-step__desc">{step.desc}</p>
                <button
                  className="sp-step__btn"
                  onClick={() => handleStepBtn(step.btnType)}
                >
                  {step.btn}
                </button>
              </div>
              {i < STEPS.length - 1 && <div className="sp-step__arrow">→</div>}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ── SUBSCRIPTION PACKAGES ─────────────────────── */}
      <section className="sp-section" id="packages">
        <div className="sp-section__head">
          <h2 className="sp-section__title">Subscription Packages</h2>
          <p className="sp-section__sub">Choose the plan that best fits your business needs.</p>
        </div>
        <div className="sp-plans">
          {PLANS.map(plan => (
            <div
              key={plan.id}
              className={`sp-plan${plan.id === 'standard' ? ' sp-plan--featured' : ''}${selectedPlan === plan.id ? ' sp-plan--selected' : ''}`}
            >
              {plan.badge && <span className="sp-plan__badge">{plan.badge}</span>}
              <div className="sp-plan__header">
                <h3 className="sp-plan__name">{plan.name}</h3>
                <div className="sp-plan__price">
                  <span className="sp-plan__amount">{plan.price}</span>
                  {plan.priceNote && <span className="sp-plan__note">{plan.priceNote}</span>}
                </div>
              </div>
              <ul className="sp-plan__features">
                {plan.features.map(f => (
                  <li key={f} className="sp-plan__feature">
                    <span className="sp-plan__check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`sp-plan__cta sp-plan__cta--${plan.ctaStyle}`}
                onClick={() => { setSelectedPlan(plan.id); setModal('register'); }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES & BENEFITS ───────────────────────── */}
      <section className="sp-section sp-section--dark" id="features">
        <div className="sp-section__head sp-section__head--light">
          <h2 className="sp-section__title">Features &amp; Benefits</h2>
          <p className="sp-section__sub">
            Everything you need to grow and manage your retail business on AutoExtras.
          </p>
        </div>
        <div className="sp-features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="sp-feature-card">
              <div className="sp-feature-card__icon">{f.icon}</div>
              <h3 className="sp-feature-card__title">{f.title}</h3>
              <p className="sp-feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
        <div className="sp-features__cta">
          <button className="sp-hero__btn sp-hero__btn--primary" onClick={() => setModal('register')}>
            Get Started Today
          </button>
          <button className="sp-hero__btn sp-hero__btn--ghost" onClick={() => setModal('login')}>
            Already a Partner? Login
          </button>
        </div>
      </section>

      {/* ── Modals ────────────────────────────────────── */}
      {modal === 'login' && (
        <LoginModal onClose={() => setModal(null)} onSuccess={handleLoginSuccess} />
      )}
      {modal === 'register' && (
        <RegisterModal onClose={() => setModal(null)} onSuccess={handleRegisterSuccess} />
      )}

    </div>
  );
}
