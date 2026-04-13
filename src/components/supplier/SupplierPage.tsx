import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SupplierPage.css';

/* ── Types ─────────────────────────────────────────── */
type FormState = {
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  city: string;
  website: string;
  message: string;
  plan: string;
};

const INIT: FormState = {
  businessName: '',
  contactPerson: '',
  email: '',
  phone: '',
  businessType: '',
  city: '',
  website: '',
  message: '',
  plan: 'standard',
};

/* ── Data ───────────────────────────────────────────── */
const BENEFITS = [
  {
    icon: '📦',
    title: 'Wide Product Range',
    desc: 'Access a broad range of high-quality automotive products to offer your customers.',
  },
  {
    icon: '🤝',
    title: 'Dedicated Support',
    desc: 'Our team is here to support you every step of the way as you grow your business.',
  },
  {
    icon: '💰',
    title: 'Profitable Partnership',
    desc: 'Benefit from competitive margins and co-marketing to boost your sales.',
  },
];

const STEPS = [
  {
    n: '01',
    title: 'Sign Up',
    desc: 'Fill in the inquiry form below to start the registration process.',
    icon: '📝',
  },
  {
    n: '02',
    title: 'Get Approved',
    desc: 'Our team will verify your information and approve your application.',
    icon: '✅',
  },
  {
    n: '03',
    title: 'Start Selling',
    desc: 'Once approved, list your products and start selling on AutoExtras.',
    icon: '🚀',
  },
];

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'FREE',
    priceNote: '',
    badge: '',
    color: '#f5f5f5',
    accentColor: '#333',
    features: [
      'Up to 50 product listings',
      'Order management dashboard',
      'Partner access to high-quality products',
      'Standard support (email)',
      'AutoExtras store listing',
    ],
    cta: 'Join Now',
    ctaStyle: 'dark',
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 'R499',
    priceNote: '/mo',
    badge: 'Most Popular',
    color: '#e53935',
    accentColor: '#e53935',
    features: [
      'Unlimited product listings',
      'Order management dashboard',
      'Partner co-branding on AutoExtras',
      '1 social media post/week on AutoExtras',
      'Priority support (email + chat)',
    ],
    cta: 'Get Started',
    ctaStyle: 'red',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R999',
    priceNote: '/mo',
    badge: '',
    color: '#1a1a2e',
    accentColor: '#1a1a2e',
    features: [
      'Unlimited product listings',
      'Advertise on AutoExtras homepage*',
      '3 social media posts/week on AutoExtras',
      'Priority support — 24 hrs, 3×/week',
      'Dedicated account manager',
    ],
    cta: 'Get Started',
    ctaStyle: 'dark',
  },
];

const PERKS = [
  { icon: '📈', title: 'Earn More', desc: 'Access competitive wholesale pricing and grow your revenue with our partner margins.' },
  { icon: '🌍', title: 'Wider Reach', desc: 'List your products on AutoExtras and reach thousands of buyers across South Africa.' },
  { icon: '📊', title: 'Business Insights', desc: 'Track orders, sales analytics and customer data from one easy dashboard.' },
  { icon: '🎯', title: 'Marketing Support', desc: 'We co-market your store through social media, email campaigns and search promotions.' },
];

/* ── Component ──────────────────────────────────────── */
export function SupplierPage() {
  const [form, setForm] = useState<FormState>(INIT);
  const [submitted, setSubmitted] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('standard');

  const set = (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(INIT);
  };

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan);
    setForm(f => ({ ...f, plan }));
    document.getElementById('supplier-form')?.scrollIntoView({ behavior: 'smooth' });
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
            <a href="#supplier-form" className="sp-hero__btn sp-hero__btn--primary">Join Now</a>
            <a href="#how-it-works" className="sp-hero__btn sp-hero__btn--ghost">Learn More</a>
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
                onClick={() => handlePlanSelect(plan.id)}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── BECOME A RETAIL PARTNER ───────────────────── */}
      <section className="sp-section sp-partner-section" id="supplier-form">
        <div className="sp-partner-left">
          <h2 className="sp-partner__title">Become a Retail Partner</h2>
          <p className="sp-partner__sub">
            Join now. Fill in the inquiry form to join AutoExtras and start growing your business today.
          </p>
          <div className="sp-perks">
            {PERKS.map(p => (
              <div key={p.title} className="sp-perk">
                <span className="sp-perk__icon">{p.icon}</span>
                <div>
                  <strong className="sp-perk__title">{p.title}</strong>
                  <p className="sp-perk__desc">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/portal" className="sp-portal-link">
            Already a partner? Sign in to the Portal →
          </Link>
        </div>

        <div className="sp-partner-right">
          <div className="sp-form-card">
            <h3 className="sp-form-card__title">Fill Inquiry Form</h3>

            {submitted ? (
              <div className="sp-success">
                <span className="sp-success__icon">🎉</span>
                <h3>Application Received!</h3>
                <p>We'll review your details and get back to you within 1–2 business days.</p>
                <button className="sp-success__btn" onClick={() => setSubmitted(false)}>
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form className="sp-form" onSubmit={handleSubmit}>
                <div className="sp-form__row">
                  <div className="sp-form__field">
                    <label className="sp-form__label">Business Name *</label>
                    <input className="sp-form__input" placeholder="AutoExtras SA" value={form.businessName} onChange={set('businessName')} required />
                  </div>
                  <div className="sp-form__field">
                    <label className="sp-form__label">Contact Person *</label>
                    <input className="sp-form__input" placeholder="John Smith" value={form.contactPerson} onChange={set('contactPerson')} required />
                  </div>
                </div>

                <div className="sp-form__row">
                  <div className="sp-form__field">
                    <label className="sp-form__label">Email Address *</label>
                    <input className="sp-form__input" type="email" placeholder="john@business.co.za" value={form.email} onChange={set('email')} required />
                  </div>
                  <div className="sp-form__field">
                    <label className="sp-form__label">Phone Number *</label>
                    <input className="sp-form__input" type="tel" placeholder="+27 79 123 4567" value={form.phone} onChange={set('phone')} required />
                  </div>
                </div>

                <div className="sp-form__row">
                  <div className="sp-form__field">
                    <label className="sp-form__label">Business Type</label>
                    <select className="sp-form__input" value={form.businessType} onChange={set('businessType')}>
                      <option value="">Select type...</option>
                      <option value="retailer">Retailer</option>
                      <option value="workshop">Auto Workshop</option>
                      <option value="dealership">Car Dealership</option>
                      <option value="online">Online Store</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="sp-form__field">
                    <label className="sp-form__label">City / Location</label>
                    <input className="sp-form__input" placeholder="Johannesburg" value={form.city} onChange={set('city')} />
                  </div>
                </div>

                <div className="sp-form__field">
                  <label className="sp-form__label">Preferred Plan</label>
                  <select className="sp-form__input" value={form.plan} onChange={set('plan')}>
                    <option value="basic">Basic — Free</option>
                    <option value="standard">Standard — R499/mo</option>
                    <option value="premium">Premium — R999/mo</option>
                  </select>
                </div>

                <div className="sp-form__field">
                  <label className="sp-form__label">Website (optional)</label>
                  <input className="sp-form__input" placeholder="https://yourbusiness.co.za" value={form.website} onChange={set('website')} />
                </div>

                <div className="sp-form__field">
                  <label className="sp-form__label">Additional Message</label>
                  <textarea className="sp-form__input sp-form__textarea" rows={3} placeholder="Tell us about your business..." value={form.message} onChange={set('message')} />
                </div>

                <button type="submit" className="sp-form__submit">
                  Submit Application →
                </button>
                <p className="sp-form__privacy">
                  By submitting you agree to our <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
