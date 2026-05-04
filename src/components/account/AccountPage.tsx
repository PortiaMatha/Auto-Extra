import { Link } from "react-router-dom";
import "./AccountPage.css";

export function AccountPage() {
  return (
    <div className="account-page">
      <div className="account-card">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="52" height="52" className="account-icon">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
        <h1 className="account-title">My Account</h1>
        <p className="account-sub">Sign in to view your orders, wishlist and account details.</p>
        <Link to="/signin" className="account-cta">Sign In / Register</Link>
        <div className="account-features">
          <div className="account-feature">
            <span>📦</span>
            <span>Track Orders</span>
          </div>
          <div className="account-feature">
            <span>♡</span>
            <span>Saved Wishlist</span>
          </div>
          <div className="account-feature">
            <span>⚙</span>
            <span>Manage Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
