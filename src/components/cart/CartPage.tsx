import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import "./CartPage.css";

const formatZAR = (v: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(v);

const PAYPAL_URL = "https://www.paypal.com";

export function CartPage() {
  const { items, removeItem, updateQty, totalCount, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="56" height="56" className="cart-empty__icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <h2 className="cart-empty__title">Your cart is empty</h2>
        <p className="cart-empty__sub">Add some products and come back here to checkout.</p>
        <Link to="/shop" className="cart-empty__cta">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__title">
        Your Cart
        <span className="cart-page__count">{totalCount} item{totalCount !== 1 ? "s" : ""}</span>
      </h1>

      {/* ── TABLE HEADER (desktop only) ── */}
      <div className="cart-table">
        <div className="cart-table__head">
          <span className="cart-col cart-col--product">Product</span>
          <span className="cart-col cart-col--price">Price</span>
          <span className="cart-col cart-col--qty">Quantity</span>
          <span className="cart-col cart-col--subtotal">Subtotal</span>
          <span className="cart-col cart-col--remove" />
        </div>

        {/* ── ROWS ── */}
        <ul className="cart-table__body">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="cart-row">
              {/* Image + title */}
              <div className="cart-col cart-col--product">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="cart-row__img"
                />
                <div className="cart-row__info">
                  <Link to={`/product/${product.slug}`} className="cart-row__title">
                    {product.title}
                  </Link>
                  <span className="cart-row__brand">{product.brand}</span>
                </div>
              </div>

              {/* Unit price */}
              <div className="cart-col cart-col--price" data-label="Price">
                <span className="cart-row__price">{formatZAR(product.basePrice)}</span>
              </div>

              {/* Quantity */}
              <div className="cart-col cart-col--qty" data-label="Quantity">
                <div className="cart-qty">
                  <button
                    className="cart-qty__btn"
                    onClick={() => updateQty(product.id, quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="cart-qty__val">{quantity}</span>
                  <button
                    className="cart-qty__btn"
                    onClick={() => updateQty(product.id, quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Line subtotal */}
              <div className="cart-col cart-col--subtotal" data-label="Subtotal">
                <span className="cart-row__subtotal">
                  {formatZAR(product.basePrice * quantity)}
                </span>
              </div>

              {/* Remove */}
              <div className="cart-col cart-col--remove">
                <button
                  className="cart-row__remove"
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${product.title}`}
                  title="Remove item"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── SUMMARY ── */}
      <div className="cart-summary">
        <div className="cart-summary__box">
          <div className="cart-summary__row">
            <span>Subtotal ({totalCount} item{totalCount !== 1 ? "s" : ""})</span>
            <span className="cart-summary__total">{formatZAR(totalPrice)}</span>
          </div>
          <p className="cart-summary__note">Shipping &amp; taxes calculated at checkout</p>

          <a
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="cart-summary__paypal-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.59 3.025-2.566 4.643-5.813 4.643h-2.189c-.988 0-1.829.722-1.98 1.698l-1.12 7.104-.314 1.987a.64.64 0 0 0 .633.738h3.872c.524 0 .968-.382 1.05-.9l.436-2.764.28-1.774a1.07 1.07 0 0 1 1.05-.9h.663c3.602 0 6.42-1.463 7.241-5.695.35-1.79.169-3.286-.66-4.343a3.685 3.685 0 0 0-.501-.508z"/>
            </svg>
            Proceed To Payment
          </a>

          <Link to="/shop" className="cart-summary__continue">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
