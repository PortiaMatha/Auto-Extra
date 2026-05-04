import { Link } from "react-router-dom";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import "./WishlistPage.css";

const formatZAR = (v: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(v);

export function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="wl-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="56" height="56" className="wl-empty__icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
        <h2 className="wl-empty__title">Your wishlist is empty</h2>
        <p className="wl-empty__sub">Save products you love and come back to them any time.</p>
        <Link to="/shop" className="wl-empty__cta">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="wl-page">
      <h1 className="wl-page__title">
        My Wishlist
        <span className="wl-page__count">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </h1>

      <div className="wl-grid">
        {items.map(product => {
          const oldPrice = Math.round(product.basePrice * 1.2);
          return (
            <article key={product.id} className="wl-card">
              <button
                className="wl-card__remove"
                onClick={() => removeItem(product.id)}
                aria-label={`Remove ${product.title}`}
                title="Remove from wishlist"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="16" height="16">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <Link to={`/product/${product.slug}`} className="wl-card__img-wrap">
                <img src={product.images[0]} alt={product.title} className="wl-card__img" />
              </Link>

              <div className="wl-card__body">
                <span className="wl-card__brand">{product.brand}</span>
                <h3 className="wl-card__title">
                  <Link to={`/product/${product.slug}`}>{product.title}</Link>
                </h3>
                <div className="wl-card__prices">
                  <span className="wl-card__price">{formatZAR(product.basePrice)}</span>
                  <span className="wl-card__price-old">{formatZAR(oldPrice)}</span>
                </div>
                <button
                  className="wl-card__cart-btn"
                  onClick={() => { addItem(product); removeItem(product.id); }}
                >
                  Add to Cart
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="wl-footer">
        <Link to="/shop" className="wl-footer__continue">← Continue Shopping</Link>
      </div>
    </div>
  );
}
