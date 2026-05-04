import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { buildPayFastData, submitPayFastForm } from '../../lib/payfast';
import './CheckoutPage.css';

const formatZAR = (v: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v);

export function CheckoutPage() {
  const { items, totalPrice, totalCount } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <Link to="/shop" className="checkout-btn checkout-btn--primary">Continue Shopping</Link>
      </div>
    );
  }

  const shippingTotal = items.reduce((s, i) => s + i.product.shippingFee, 0);
  const grandTotal    = totalPrice + shippingTotal;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    if (!form.lastName.trim())  e.lastName  = 'Last name is required.';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'A valid email address is required.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    const itemName = items.length === 1
      ? items[0].product.title
      : `AutoExtras Order (${totalCount} items)`;

    const { data } = buildPayFastData(
      form.firstName,
      form.lastName,
      form.email,
      grandTotal,
      itemName,
    );

    submitPayFastForm(data);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-page__inner">
        <h1 className="checkout-page__title">Checkout</h1>

        <div className="checkout-layout">

          {/* ── LEFT: Customer details ── */}
          <div className="checkout-details">
            <h2 className="checkout-section__title">Your Details</h2>
            <form onSubmit={handleSubmit} noValidate>

              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label className="checkout-label">First Name *</label>
                  <input
                    className={`checkout-input${errors.firstName ? ' checkout-input--error' : ''}`}
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    placeholder="e.g. Portia"
                  />
                  {errors.firstName && <p className="checkout-error">{errors.firstName}</p>}
                </div>
                <div className="checkout-field">
                  <label className="checkout-label">Last Name *</label>
                  <input
                    className={`checkout-input${errors.lastName ? ' checkout-input--error' : ''}`}
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    placeholder="e.g. Matha"
                  />
                  {errors.lastName && <p className="checkout-error">{errors.lastName}</p>}
                </div>
              </div>

              <div className="checkout-field">
                <label className="checkout-label">Email Address *</label>
                <input
                  className={`checkout-input${errors.email ? ' checkout-input--error' : ''}`}
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="e.g. you@example.com"
                />
                {errors.email && <p className="checkout-error">{errors.email}</p>}
              </div>

              <div className="checkout-sandbox-note">
                <strong>Sandbox mode</strong> — No real payment will be taken.
                Use PayFast test credentials after redirecting.
              </div>

              <button
                type="submit"
                className="checkout-btn checkout-btn--primary checkout-btn--full"
                disabled={loading}
              >
                {loading ? 'Redirecting to PayFast…' : 'Pay with PayFast'}
              </button>

              <Link to="/cart" className="checkout-btn checkout-btn--ghost checkout-btn--full">
                ← Back to Cart
              </Link>

            </form>
          </div>

          {/* ── RIGHT: Order summary ── */}
          <div className="checkout-summary">
            <h2 className="checkout-section__title">Order Summary</h2>

            <ul className="checkout-items">
              {items.map(({ product, quantity }) => {
                const unitPrice = product.discountPrice && product.discountPrice < product.basePrice
                  ? product.discountPrice
                  : product.basePrice;
                return (
                  <li key={product.id} className="checkout-item">
                    <img src={product.images[0]} alt={product.title} className="checkout-item__img" />
                    <div className="checkout-item__info">
                      <p className="checkout-item__title">{product.title}</p>
                      <p className="checkout-item__qty">Qty: {quantity}</p>
                    </div>
                    <span className="checkout-item__price">{formatZAR(unitPrice * quantity)}</span>
                  </li>
                );
              })}
            </ul>

            <div className="checkout-totals">
              <div className="checkout-total-row">
                <span>Subtotal</span>
                <span>{formatZAR(totalPrice)}</span>
              </div>
              <div className="checkout-total-row">
                <span>Shipping</span>
                <span>{formatZAR(shippingTotal)}</span>
              </div>
              <div className="checkout-total-row checkout-total-row--grand">
                <span>Total</span>
                <span>{formatZAR(grandTotal)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
