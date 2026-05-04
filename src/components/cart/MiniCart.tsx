import { useCart } from "../../context/CartContext";
import { Link } from "react-router-dom";
import "./MiniCart.css";

const formatZAR = (v: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(v);

export function MiniCart() {
  const { items, isOpen, closeCart, removeItem, updateQty, totalCount, totalPrice } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="mc-backdrop" onClick={closeCart} />}

      {/* Slide-out panel */}
      <aside className={`mc${isOpen ? " mc--open" : ""}`} aria-label="Mini cart">
        {/* Header */}
        <div className="mc__header">
          <div className="mc__header-left">
            <span className="mc__icon">🛒</span>
            <h3 className="mc__title">Your Cart</h3>
            {totalCount > 0 && (
              <span className="mc__badge">{totalCount}</span>
            )}
          </div>
          <button className="mc__close" onClick={closeCart} aria-label="Close cart">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="mc__body">
          {items.length === 0 ? (
            <div className="mc__empty">
              <span className="mc__empty-icon">🛒</span>
              <p>Your cart is empty</p>
              <button className="mc__empty-cta" onClick={closeCart}>
                Start Shopping
              </button>
            </div>
          ) : (
            <ul className="mc__list">
              {items.map(({ product, quantity }) => (
                <li key={product.id} className="mc__item">
                  {/* Product image */}
                  <div className="mc__item-img-wrap">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="mc__item-img"
                    />
                  </div>

                  {/* Info */}
                  <div className="mc__item-info">
                    <p className="mc__item-title">{product.title}</p>
                    <p className="mc__item-price">{formatZAR(product.basePrice)}</p>

                    {/* Quantity controls */}
                    <div className="mc__item-qty">
                      <button
                        className="mc__qty-btn"
                        onClick={() => updateQty(product.id, quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="mc__qty-value">{quantity}</span>
                      <button
                        className="mc__qty-btn"
                        onClick={() => updateQty(product.id, quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    className="mc__item-remove"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.title}`}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Summary + footer */}
        {items.length > 0 && (
          <>
            <div className="mc__summary">
              <div className="mc__summary-row">
                <span>Subtotal ({totalCount} item{totalCount !== 1 ? "s" : ""})</span>
                <strong>{formatZAR(totalPrice)}</strong>
              </div>
              <p className="mc__summary-note">Shipping calculated at checkout</p>
            </div>

            <div className="mc__footer">
              <button className="mc__footer-btn mc__footer-btn--secondary" onClick={closeCart}>
                Continue Shopping
              </button>
              <Link
                to="/cart"
                className="mc__footer-btn mc__footer-btn--primary"
                onClick={closeCart}
              >
                Go To Cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
