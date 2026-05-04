import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Do your covers fit all car models?',
    a: 'We offer universal-fit covers that suit the majority of sedan, hatchback, SUV, and bakkie models. For a precise fit, use our Custom Builder to specify your exact make, model, and trim. If you are unsure, contact us and we will confirm compatibility before you order.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Standard nationwide delivery takes 3–5 business days. Express delivery (1–2 business days) is available at checkout for an additional fee. Custom-built and logo-printed orders require an additional 5–7 business days for production before dispatch.',
  },
  {
    q: 'Can I add my own logo or design to any cover?',
    a: 'Yes! Our Custom Builder lets you upload any PNG, JPG, or SVG artwork to be printed on seat covers, steering wheel covers, car mats, or full interior sets. We recommend a high-resolution file (at least 300 dpi) for the best print quality.',
  },
  {
    q: 'What materials are available?',
    a: 'Depending on the product, covers are available in Polyester, Nylon, Canvas, Micro-polyester, Nylon Blend, and Polyester-fibre. Each material listing includes a durability and comfort rating. If you need a specific material for allergies or climate reasons, reach out and we will advise.',
  },
  {
    q: 'What is your return and refund policy?',
    a: 'Standard (non-customised) products can be returned within 14 days of delivery, provided they are unused and in original packaging. Custom-printed orders are non-refundable unless there is a manufacturing defect. Please contact us within 48 hours of delivery if you have a quality concern and we will resolve it promptly.',
  },
  {
    q: 'Do you offer wholesale or fleet pricing?',
    a: 'Yes, we offer volume discounts for orders of 10 units or more. Fleet and corporate clients receive dedicated account management, branded packaging options, and priority production slots. Visit the Become a Supplier page or contact us directly to discuss your requirements.',
  },
  {
    q: 'How do I install the seat covers?',
    a: 'All covers come with a printed quick-start guide and we also have video tutorials on our website. Most universal covers clip or strap into place in under 10 minutes without tools. Custom-fit covers include vehicle-specific instructions.',
  },
  {
    q: 'Are the covers waterproof?',
    a: 'Exterior body covers are fully waterproof and UV-resistant. Interior seat covers and steering wheel covers are water-resistant and easy to wipe clean, but are not designed for prolonged submersion. Car mats are waterproof and non-slip.',
  },
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

const INITIAL: FormState = { name: '', email: '', phone: '', subject: '', message: '' };

export function ContactPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (i: number) => setOpenFaq(prev => (prev === i ? null : i));

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setForm(INITIAL);
  };

  return (
    <div className="contact-page">
      {/* Breadcrumb */}
      <div className="page-breadcrumb">
        <Link to="/">Home</Link> / <span>Contact</span>
      </div>

      {/* Dark header strip */}
      <div className="contact-heading">
        <div>
          <h1 className="contact-heading__title">Get in Touch</h1>
          <p className="contact-heading__sub">
            Have a question about our covers, a custom order, or need sizing advice?
            We'd love to hear from you.
          </p>
        </div>
      </div>

      <div className="contact-layout">
        {/* Contact form */}
        <div className="contact-form-card">
          <h2 className="contact-form-card__title">Send us a Message</h2>


          {submitted ? (
            <div className="contact-success">
              <span className="contact-success__icon">✅</span>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. We'll get back to you within 1–2 business days.</p>
              <button className="contact-success__btn" onClick={() => setSubmitted(false)}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form__row">
                <div className="contact-field">
                  <label className="contact-field__label">Full Name *</label>
                  <input
                    className="contact-field__input"
                    type="text"
                    placeholder="John Smith"
                    value={form.name}
                    onChange={set('name')}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Email Address *</label>
                  <input
                    className="contact-field__input"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={set('email')}
                    required
                  />
                </div>
              </div>

              <div className="contact-form__row">
                <div className="contact-field">
                  <label className="contact-field__label">Phone Number</label>
                  <input
                    className="contact-field__input"
                    type="tel"
                    placeholder="+27 79 123 4567"
                    value={form.phone}
                    onChange={set('phone')}
                  />
                </div>
                <div className="contact-field">
                  <label className="contact-field__label">Subject *</label>
                  <select
                    className="contact-field__input"
                    value={form.subject}
                    onChange={set('subject')}
                    required
                  >
                    <option value="">Select a topic...</option>
                    <option value="order">Order Enquiry</option>
                    <option value="custom">Custom Order / Design</option>
                    <option value="sizing">Sizing Help</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="contact-field">
                <label className="contact-field__label">Message *</label>
                <textarea
                  className="contact-field__input contact-field__input--textarea"
                  rows={5}
                  placeholder="Tell us how we can help you..."
                  value={form.message}
                  onChange={set('message')}
                  required
                />
              </div>

              <button type="submit" className="contact-submit-btn">
                Send Message →
              </button>
            </form>
          )}
        </div>

        {/* Info sidebar */}
        <aside className="contact-info">
          <div className="contact-info__card">
            <h3 className="contact-info__title">Contact Details</h3>

            <ul className="contact-info__list">
              <li className="contact-info__item">
                <span className="contact-info__icon">📍</span>
                <div>
                  <strong>Address</strong>
                  <p>14 Automotive Drive, Sandton<br />Johannesburg, 2196</p>
                </div>
              </li>
              <li className="contact-info__item">
                <span className="contact-info__icon">📞</span>
                <div>
                  <strong>Phone</strong>
                  <p>+27 79 123 4567</p>
                </div>
              </li>
              <li className="contact-info__item">
                <span className="contact-info__icon">✉️</span>
                <div>
                  <strong>Email</strong>
                  <p>hello@motorcovers.co.za</p>
                </div>
              </li>
              <li className="contact-info__item">
                <span className="contact-info__icon">💬</span>
                <div>
                  <strong>WhatsApp</strong>
                  <p>+27 79 123 4567</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="contact-info__card">
            <h3 className="contact-info__title">Trading Hours</h3>
            <ul className="contact-hours">
              {[
                { day: 'Mon – Fri', time: '08:00 – 17:00' },
                { day: 'Saturday', time: '09:00 – 13:00' },
                { day: 'Sunday',   time: 'Closed' },
              ].map(h => (
                <li key={h.day} className="contact-hours__row">
                  <span>{h.day}</span>
                  <span className={h.time === 'Closed' ? 'contact-hours__closed' : ''}>
                    {h.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="contact-info__card contact-info__card--yellow">
            <p className="contact-info__quick">⚡ Quick response</p>
            <p className="contact-info__quick-sub">
              We typically reply within a few hours during trading hours. For urgent orders, call or WhatsApp us directly.
            </p>
          </div>
        </aside>
      </div>

      {/* FAQ section */}
      <section className="faq">
        <div className="faq__header">
          <h2 className="faq__title">Frequently Asked Questions</h2>
          <p className="faq__sub">
            Can't find what you're looking for? <Link to="/contact" className="faq__sub-link">Send us a message</Link> and we'll get back to you.
          </p>
        </div>

        <div className="faq__grid">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className={`faq__item${isOpen ? ' faq__item--open' : ''}`}>
                <button
                  className="faq__question"
                  onClick={() => toggleFaq(i)}
                  aria-expanded={isOpen}
                >
                  <span>{item.q}</span>
                  <span className="faq__icon" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </button>
                <div className="faq__answer" aria-hidden={!isOpen}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Map placeholder */}
      <div className="contact-map">
        <div className="contact-map__placeholder">
          <span>📍</span>
          <p>14 Automotive Drive, Sandton, Johannesburg</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="contact-map__link"
          >
            Open in Google Maps →
          </a>
        </div>
      </div>
    </div>
  );
}
