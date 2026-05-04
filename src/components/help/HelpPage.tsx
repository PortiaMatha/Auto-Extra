import { useState } from "react";
import { Link } from "react-router-dom";
import "./HelpPage.css";

const FAQS = [
  {
    q: "How do I find the right cover for my car?",
    a: "Use our Custom Builder to select your exact make and model. You can also browse by category (Interior / Exterior) and filter by brand on the Shop page.",
  },
  {
    q: "What is your delivery timeframe?",
    a: "Standard delivery takes 3–5 business days nationwide. Custom-built orders may take 7–10 business days. You'll receive a tracking number via email once your order ships.",
  },
  {
    q: "Can I return a product?",
    a: "Yes. We accept returns within 14 days of delivery for unused, undamaged products in their original packaging. Custom orders are non-refundable unless there is a manufacturing defect.",
  },
  {
    q: "How do I care for my seat covers?",
    a: "Most covers can be spot-cleaned with a mild detergent and a damp cloth. Avoid machine washing unless the label specifically states it is machine-washable. Do not tumble dry.",
  },
  {
    q: "Do you offer wholesale or fleet pricing?",
    a: "Yes. Please visit our Become a Supplier page or contact us directly at hello@motorcovers.co.za for bulk and fleet pricing enquiries.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships you'll receive an email with your tracking number. You can also log into your account (when accounts are live) to see order history.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept PayPal, major credit and debit cards (Visa, Mastercard), and EFT. All payments are processed securely.",
  },
  {
    q: "Can I get a custom logo printed on my covers?",
    a: "Absolutely! Use the Custom Builder on our website to upload your logo, choose the placement, and preview the result before you order.",
  },
];

export function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) =>
    setOpenIndex(prev => (prev === i ? null : i));

  return (
    <div className="help-page">
      <div className="help-hero">
        <h1 className="help-hero__title">Help &amp; Support</h1>
        <p className="help-hero__sub">
          Find answers to common questions below, or get in touch with our team.
        </p>
      </div>

      <div className="help-body">
        <section className="help-faq">
          <h2 className="help-section-title">Frequently Asked Questions</h2>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div key={i} className={`faq-item${openIndex === i ? " faq-item--open" : ""}`}>
                <button className="faq-item__q" onClick={() => toggle(i)}>
                  <span>{faq.q}</span>
                  <span className="faq-item__chevron">{openIndex === i ? "−" : "+"}</span>
                </button>
                {openIndex === i && <p className="faq-item__a">{faq.a}</p>}
              </div>
            ))}
          </div>
        </section>

        <aside className="help-contact-card">
          <h3 className="help-contact-card__title">Still need help?</h3>
          <p className="help-contact-card__sub">Our team is ready to assist you.</p>
          <address className="help-contact-card__address">
            <a href="tel:+27791234567">+27 79 123 4567</a>
            <a href="mailto:hello@motorcovers.co.za">hello@motorcovers.co.za</a>
          </address>
          <Link to="/contact" className="help-contact-card__btn">Send Us a Message</Link>
        </aside>
      </div>
    </div>
  );
}
