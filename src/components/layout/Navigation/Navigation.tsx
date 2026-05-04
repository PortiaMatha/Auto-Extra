import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { navLinks } from "../../../config/navLinks";

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="nav">
      {/* Hamburger button — mobile only */}
      <button
        className={`nav__hamburger${open ? " nav__hamburger--open" : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>

      {/* Link list */}
      <div className={`nav__links${open ? " nav__links--open" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.href}
            to={link.href}
            end={link.href === "/"}
            className={({ isActive }) =>
              `nav__link${isActive ? " nav__link--active" : ""}`
            }
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Backdrop — closes menu when tapped outside */}
      {open && (
        <div className="nav__backdrop" onClick={() => setOpen(false)} />
      )}
    </nav>
  );
}
