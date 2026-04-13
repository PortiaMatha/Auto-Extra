import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { navLinks } from "../../../config/navLinks";

export function Navigation() {
  return (
    <nav className="nav">
      {navLinks.map((link) => (
        <NavLink
          key={link.href}
          to={link.href}
          end={link.href === "/"}
          className={({ isActive }) =>
            `nav__link${isActive ? " nav__link--active" : ""}`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
