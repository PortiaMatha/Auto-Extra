
export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Interior Covers", href: "/interior" },
  { label: "Exterior Covers", href: "/exterior" },
  { label: "Custom Builder", href: "/builder" },
  { label: "Contacts", href: "/contact" },
];
