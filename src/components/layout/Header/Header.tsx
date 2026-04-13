import React from "react";
import "./Header.css";
import { Link } from "react-router-dom";
import { Navigation } from "../Navigation";

export function Header() {
  return (
    <header className="header">
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="header-top">
        <div className="header-top__left">
          <a href="/account">My account</a>
          <span className="divider">/</span>
          <a href="/wishlist">Wishlist</a>
          <span className="divider">/</span>
          <a href="/help">Help &amp; support</a>
        </div>
        <div className="header-top__right">
          <span>Call us: +27 79 123 4567</span>
          <span className="divider">|</span>
          <a href="/signin">Sign in / Register</a>
        </div>
      </div>

      {/* MAIN HEADER: LOGO + SEARCH + CONTACT + ICONS */}
      <div className="header-main">
        <div className="header-logo">
          {/* Replace text with an img tag if you have a logo */}
          motor<span>covers</span>
        </div>

        <form
          className="header-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="Search by Car brand, Model, category or car Type..."
          />
          <button type="submit">Search</button>
        </form>

        <div className="header-main__right">
          <div className="header-icons">
            <button className="header-icon" type="button">
              <span className="header-icon__symbol" aria-hidden="true">
                ♡
              </span>
              <span className="header-icon__text">Wishlist</span>
            </button>

            <button className="header-icon" type="button">
              <span className="header-icon__symbol" aria-hidden="true">
                🛒
              </span>
              <span className="header-icon__text">R0.00</span>
            </button>

            <Link to="/supplier" className="header-supplier-btn">
              Become a Supplier
            </Link>
          </div>
        </div>
      </div>

      {/* NAV BAR */}
      <div className="header-nav">
        <Navigation />
      </div>
    </header>
  );
}
