import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CheckoutSuccess.css';

export function CheckoutSuccess() {
  const { items, removeItem } = useCart();

  useEffect(() => {
    items.forEach(i => removeItem(i.product.id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="checkout-result">
      <div className="checkout-result__icon checkout-result__icon--success">✓</div>
      <h1 className="checkout-result__title">Payment Successful!</h1>
      <p className="checkout-result__msg">
        Thank you for your order. You will receive a confirmation email shortly.
      </p>
      <div className="checkout-result__actions">
        <Link to="/shop" className="checkout-result__btn checkout-result__btn--primary">
          Continue Shopping
        </Link>
        <Link to="/" className="checkout-result__btn checkout-result__btn--ghost">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
