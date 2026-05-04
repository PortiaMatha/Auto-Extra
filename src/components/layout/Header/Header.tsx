import "./Header.css";
import { Link } from "react-router-dom";
import { Navigation } from "../Navigation";
import { useCart } from "../../../context/CartContext";
import { useSupplier } from "../../../context/SupplierContext";
import { SearchBar } from "./SearchBar";

export function Header() {
  const { totalCount, openCart } = useCart();
  const { isSupplier } = useSupplier();

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
          Drive<span>Craft</span>
        </div>

        <SearchBar />

        <div className="header-main__right">
          <div className="header-icons">
            <Link to="/wishlist" className="header-icon header-icon--link">
              <span className="header-icon__symbol" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
              </span>
              <span className="header-icon__text">Wishlist</span>
            </Link>

            {/* Cart button — opens mini cart */}
            <button className="header-icon header-cart-btn" type="button" onClick={openCart}>
              <span className="header-icon__symbol" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="24" height="24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                </svg>
              </span>
              <span className="header-icon__text">Cart</span>
              {totalCount > 0 && (
                <span className="header-cart-count">{totalCount}</span>
              )}
            </button>

            {isSupplier ? (
              <Link to="/portal" className="header-supplier-btn header-supplier-btn--portal">
                Retail Portal
              </Link>
            ) : (
              <Link to="/supplier" className="header-supplier-btn">
                Become a Supplier
              </Link>
            )}
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
