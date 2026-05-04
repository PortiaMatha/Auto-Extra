import { useState } from "react";
import { Link } from "react-router-dom";
import "./SignInPage.css";

type View = "signin" | "register" | "forgot";

export function SignInPage() {
  const [view, setView]             = useState<View>("signin");
  const [signIn, setSignIn]         = useState({ email: "", password: "" });
  const [register, setRegister]     = useState({ name: "", email: "", password: "", confirm: "" });
  const [forgot, setForgot]         = useState({ email: "" });
  const [submitted, setSubmitted]   = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  /* ── Sign In submit ── */
  if (submitted) {
    return (
      <div className="signin-page">
        <div className="signin-card">
          <div className="signin-success">
            <span className="signin-success__icon">✓</span>
            <h2>Signed in successfully</h2>
            <p>Welcome back to MotorCovers!</p>
            <Link to="/" className="signin-btn">Go to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Forgot password ── */
  if (view === "forgot") {
    return (
      <div className="signin-page">
        <div className="signin-card">
          <div className="signin-logo">motor<span>covers</span></div>
          <h1 className="signin-title">Reset Password</h1>
          <p className="signin-sub">We'll send a reset link to your email.</p>

          {forgotSent ? (
            <div className="signin-success" style={{ marginTop: "1rem" }}>
              <span className="signin-success__icon">✉</span>
              <p style={{ fontWeight: 600 }}>Check your inbox</p>
              <p>A reset link has been sent to <strong>{forgot.email}</strong>.</p>
              <button className="signin-btn" onClick={() => { setView("signin"); setForgotSent(false); }}>
                Back to Sign In
              </button>
            </div>
          ) : (
            <form
              className="signin-form"
              onSubmit={e => { e.preventDefault(); setForgotSent(true); }}
              noValidate
            >
              <div className="signin-field">
                <label className="signin-label">Email address</label>
                <input
                  type="email"
                  className="signin-input"
                  placeholder="you@example.com"
                  value={forgot.email}
                  onChange={e => setForgot({ email: e.target.value })}
                  required
                />
              </div>
              <button type="submit" className="signin-btn">Send Reset Link</button>
              <p className="signin-register">
                <button type="button" className="signin-text-btn" onClick={() => setView("signin")}>
                  ← Back to Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ── Register ── */
  if (view === "register") {
    return (
      <div className="signin-page">
        <div className="signin-card">
          <div className="signin-logo">motor<span>covers</span></div>
          <h1 className="signin-title">Create Account</h1>
          <p className="signin-sub">Join MotorCovers today</p>

          <form
            className="signin-form"
            onSubmit={e => { e.preventDefault(); setSubmitted(true); }}
            noValidate
          >
            <div className="signin-field">
              <label className="signin-label">Full name</label>
              <input
                type="text"
                className="signin-input"
                placeholder="Jane Smith"
                value={register.name}
                onChange={e => setRegister(p => ({ ...p, name: e.target.value }))}
                required
              />
            </div>
            <div className="signin-field">
              <label className="signin-label">Email address</label>
              <input
                type="email"
                className="signin-input"
                placeholder="you@example.com"
                value={register.email}
                onChange={e => setRegister(p => ({ ...p, email: e.target.value }))}
                required
              />
            </div>
            <div className="signin-field">
              <label className="signin-label">Password</label>
              <input
                type="password"
                className="signin-input"
                placeholder="••••••••"
                value={register.password}
                onChange={e => setRegister(p => ({ ...p, password: e.target.value }))}
                required
              />
            </div>
            <div className="signin-field">
              <label className="signin-label">Confirm password</label>
              <input
                type="password"
                className="signin-input"
                placeholder="••••••••"
                value={register.confirm}
                onChange={e => setRegister(p => ({ ...p, confirm: e.target.value }))}
                required
              />
            </div>
            <button type="submit" className="signin-btn">Create Account</button>
          </form>

          <p className="signin-register">
            Already have an account?{" "}
            <button type="button" className="signin-text-btn" onClick={() => setView("signin")}>
              Sign In
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* ── Sign In (default) ── */
  return (
    <div className="signin-page">
      <div className="signin-card">
        <div className="signin-logo">motor<span>covers</span></div>
        <h1 className="signin-title">Sign In</h1>
        <p className="signin-sub">Welcome back to MotorCovers</p>

        <form className="signin-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }} noValidate>
          <div className="signin-field">
            <label className="signin-label">Email address</label>
            <input
              type="email"
              className="signin-input"
              placeholder="you@example.com"
              value={signIn.email}
              onChange={e => setSignIn(p => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="signin-field">
            <label className="signin-label">
              Password
              <button type="button" className="signin-forgot" onClick={() => setView("forgot")}>
                Forgot password?
              </button>
            </label>
            <input
              type="password"
              className="signin-input"
              placeholder="••••••••"
              value={signIn.password}
              onChange={e => setSignIn(p => ({ ...p, password: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="signin-btn">Sign In</button>
        </form>

        <p className="signin-register">
          Don't have an account?{" "}
          <button type="button" className="signin-text-btn" onClick={() => setView("register")}>
            Create one
          </button>
        </p>

        <div className="signin-divider">or continue with</div>
        <div className="signin-socials">
          <button className="signin-social-btn">Google</button>
          <button className="signin-social-btn">Facebook</button>
        </div>
      </div>
    </div>
  );
}
