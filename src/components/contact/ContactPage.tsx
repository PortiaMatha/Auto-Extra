import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ContactPage.css';

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

      {/* Page heading */}
      <div className="contact-heading">
        <h1 className="contact-heading__title">Get in Touch</h1>
        <p className="contact-heading__sub">
          Have a question about our covers, a custom order, or need sizing advice?
          We'd love to hear from you.
        </p>
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
