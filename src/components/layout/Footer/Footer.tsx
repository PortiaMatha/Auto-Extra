import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  const year = new Date().getFullYear();

  const [enquiry, setEnquiry]     = useState({ name: "", email: "", message: "" });
  const [newsletter, setNewsletter] = useState({ name: "", email: "" });

  const handleEnquire = (e: React.FormEvent) => {
    e.preventDefault();
    setEnquiry({ name: "", email: "", message: "" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletter({ name: "", email: "" });
  };

  return (
    <footer className="ft">

      {/* ═══ CONNECT WITH US STRIP ═══ */}
      <section className="ft__connect">
        <div className="ft__connect-inner">

          {/* Left — info + buttons */}
          <div className="ft__connect-left">
            <h2 className="ft__connect-title">Connect with Us</h2>
            <p className="ft__connect-sub">
              Whether you're looking for a stockist or exploring custom cover options
              for your fleet, we're ready to assist.
            </p>
            <address className="ft__connect-address">
              <a href="tel:+27118874436" className="ft__connect-phone">+27 (0)11 887 4436</a>
              <a href="mailto:hello@motorcovers.co.za" className="ft__connect-email">hello@motorcovers.co.za</a>
            </address>
            <div className="ft__connect-btns">
              <Link to="/contact" className="ft__outline-btn">Frequent Questions</Link>
              <Link to="/shop"    className="ft__outline-btn">Shop Now</Link>
            </div>
          </div>

          {/* Right — enquiry form */}
          <form className="ft__enquire-form" onSubmit={handleEnquire} noValidate>
            <div className="ft__form-row">
              <div className="ft__form-field">
                <label className="ft__form-label">Name</label>
                <input
                  type="text"
                  className="ft__form-input"
                  value={enquiry.name}
                  onChange={e => setEnquiry(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="ft__form-field">
                <label className="ft__form-label">Email</label>
                <input
                  type="email"
                  className="ft__form-input"
                  value={enquiry.email}
                  onChange={e => setEnquiry(p => ({ ...p, email: e.target.value }))}
                />
              </div>
            </div>
            <div className="ft__form-field">
              <label className="ft__form-label">Message</label>
              <textarea
                className="ft__form-input ft__form-textarea"
                rows={2}
                value={enquiry.message}
                onChange={e => setEnquiry(p => ({ ...p, message: e.target.value }))}
              />
            </div>
            <div className="ft__form-footer">
              <button type="submit" className="ft__outline-btn">Enquire Now</button>
            </div>
          </form>

        </div>
      </section>

      {/* ═══ MAIN FOOTER BODY ═══ */}
      <div className="ft__body">
        <div className="ft__body-inner">

          {/* Column 1 — Logo + Social */}
          <div className="ft__brand-col">
            <div className="ft__logo">
              Drive<span>Craft</span>
            </div>
            <p className="ft__tagline">
              Premium custom covers for every South African road.
            </p>

            <p className="ft__follow-label">Follow us</p>
            <div className="ft__socials">
              {/* Facebook */}
              <a href="/" aria-label="Facebook" className="ft__social">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="/" aria-label="Instagram" className="ft__social">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="/" aria-label="X" className="ft__social">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="17" height="17">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="/" aria-label="LinkedIn" className="ft__social">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="/" aria-label="WhatsApp" className="ft__social">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 — Shop */}
          <div className="ft__col">
            <h4 className="ft__col-title">Shop</h4>
            <ul className="ft__col-list">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/interior">Interior Covers</Link></li>
              <li><Link to="/exterior">Exterior Covers</Link></li>
              <li><Link to="/builder">Custom Builder</Link></li>
              <li><Link to="/supplier">Become a Supplier</Link></li>
            </ul>
          </div>

          {/* Column 3 — Connect */}
          <div className="ft__col">
            <h4 className="ft__col-title">Connect</h4>
            <ul className="ft__col-list">
              <li><Link to="/">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/contact">Stockists</Link></li>
              <li><Link to="/help">FAQ</Link></li>
              <li><Link to="/help">Delivery Info</Link></li>
              <li><Link to="/help">Returns Policy</Link></li>
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div className="ft__col">
            <h4 className="ft__col-title">Newsletter</h4>
            <form className="ft__newsletter" onSubmit={handleSubscribe} noValidate>
              <div className="ft__form-field">
                <label className="ft__form-label">Name</label>
                <input
                  type="text"
                  className="ft__form-input"
                  value={newsletter.name}
                  onChange={e => setNewsletter(p => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div className="ft__form-field">
                <label className="ft__form-label">Email</label>
                <input
                  type="email"
                  className="ft__form-input"
                  value={newsletter.email}
                  onChange={e => setNewsletter(p => ({ ...p, email: e.target.value }))}
                />
              </div>
              <button type="submit" className="ft__outline-btn ft__outline-btn--sm">
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* ═══ COPYRIGHT BAR ═══ */}
      <div className="ft__bar">
        <div className="ft__bar-inner">
          <span>MOTORCOVERS &copy; {year}</span>
          <Link to="/help">Website Policy</Link>
          <Link to="/help">POPIA</Link>
        </div>
      </div>

    </footer>
  );
}
