import React from "react";
import "./Footer.css";
import { navLinks } from "../../../config/navLinks";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* TOP: columns */}
      <div className="footer-top">
        <div className="container footer-top__inner">
          <div className="footer-col footer-col--about">
            <h4 className="footer-col__title">Why buy from us</h4>
            <p className="footer-col__text">
              Custom-fit interior and exterior covers, built for your exact car
              model and finished with premium stitching.
            </p>
            <ul className="footer-list">
              <li>Made for South African conditions</li>
              <li>Secure checkout & trusted payment options</li>
              <li>Fast nationwide delivery</li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col__title">Shop</h4>
            <ul className="footer-list">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col__title">Customer care</h4>
            <ul className="footer-list">
              <li>
                <a href="/account">My account</a>
              </li>
              <li>
                <a href="/wishlist">Wishlist</a>
              </li>
              <li>
                <a href="/compare">Compare</a>
              </li>
              <li>
                <a href="/contact">Contact us</a>
              </li>
            </ul>
          </div>

          <div className="footer-col footer-col--newsletter">
            <h4 className="footer-col__title">Get 5% off</h4>
            <p className="footer-col__text">
              Subscribe to our newsletter and get a discount on your next
              purchase.
            </p>
            <form
              className="footer-newsletter"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Subscribed (demo only)");
              }}
            >
              <input
                type="email"
                placeholder="Your email address"
                required
              />
              <button type="submit">Subscribe</button>
            </form>

            <div className="footer-payments">
              <span className="footer-payment-badge">VISA</span>
              <span className="footer-payment-badge">Mastercard</span>
              <span className="footer-payment-badge">PayFast</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM: contact + social + copyright */}
      <div className="footer-bottom">
        <div className="container footer-bottom__inner">
          <div className="footer-bottom__left">
            <p>Digitally Moved Auto Accessories · Johannesburg, South Africa</p>
            <p>Tel: +27 00 000 0000 · Email: hello@digitallymoved.co.za</p>
          </div>
          <div className="footer-bottom__right">
            <span>Follow us:</span>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                f
              </a>
              <a href="#" aria-label="Instagram">
                ig
              </a>
              <a href="#" aria-label="YouTube">
                yt
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom__copy">
          <div className="container">
            <p>
              © {currentYear} Digitally Moved - Auto Accessories. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
