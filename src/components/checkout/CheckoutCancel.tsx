import { Link } from 'react-router-dom';
import './CheckoutSuccess.css';

export function CheckoutCancel() {
  return (
    <div className="checkout-result">
      <div className="checkout-result__icon checkout-result__icon--cancel">✕</div>
      <h1 className="checkout-result__title">Payment Cancelled</h1>
      <p className="checkout-result__msg">
        Your payment was not completed. Your cart has been kept — you can try again whenever you're ready.
      </p>
      <div className="checkout-result__actions">
        <Link to="/cart" className="checkout-result__btn checkout-result__btn--primary">
          Return to Cart
        </Link>
        <Link to="/shop" className="checkout-result__btn checkout-result__btn--ghost">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
