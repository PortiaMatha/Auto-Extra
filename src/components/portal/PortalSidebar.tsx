import React from 'react';
import './PortalSidebar.css';
import { PortalSection } from './PortalLayout';

type NavItem = {
  id: PortalSection;
  label: string;
  icon: string;
};

type NavGroup = {
  title?: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = [
  {
    items: [
      { id: 'dashboard',     label: 'Dashboard',     icon: '⊞' },
      { id: 'store-profile', label: 'Store Profile',  icon: '🏪' },
      { id: 'products',      label: 'Products',       icon: '📦' },
      { id: 'categories',    label: 'Categories',     icon: '🏷' },
      { id: 'customization', label: 'Customization',  icon: '🎨' },
    ],
  },
  {
    title: 'ORDERS',
    items: [
      { id: 'orders',    label: 'Orders',    icon: '📋' },
      { id: 'shipments', label: 'Shipments', icon: '🚚' },
      { id: 'returns',   label: 'Returns',   icon: '↩' },
    ],
  },
  {
    title: 'FINANCE',
    items: [
      { id: 'invoices',      label: 'Invoices',        icon: '🧾' },
      { id: 'sales-payouts', label: 'Sales & Payouts', icon: '💳' },
    ],
  },
  {
    items: [
      { id: 'analytics', label: 'Analytics', icon: '📊' },
      { id: 'reviews',   label: 'Reviews',   icon: '⭐' },
    ],
  },
];

type PortalSidebarProps = {
  activeSection: PortalSection;
  onNavigate: (section: PortalSection) => void;
};

export function PortalSidebar({ activeSection, onNavigate }: PortalSidebarProps) {
  return (
    <aside className="portal-sidebar">
      {/* Logo */}
      <div className="portal-sidebar__logo">
        <div className="portal-sidebar__logo-hex">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <polygon
              points="14,2 25,8 25,20 14,26 3,20 3,8"
              fill="#4f6af5"
              stroke="#6b82f7"
              strokeWidth="1"
            />
            <text x="14" y="18.5" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">AE</text>
          </svg>
        </div>
        <div className="portal-sidebar__logo-text">
          <span className="portal-sidebar__logo-name">AUTOEXTRAS</span>
          <span className="portal-sidebar__logo-sub">Retail Partner Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="portal-sidebar__nav">
        {navGroups.map((group, gi) => (
          <div key={gi} className="portal-sidebar__group">
            {group.title && (
              <span className="portal-sidebar__group-title">{group.title}</span>
            )}
            {group.items.map(item => (
              <button
                key={item.id}
                className={`portal-sidebar__item${activeSection === item.id ? ' portal-sidebar__item--active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="portal-sidebar__item-icon">{item.icon}</span>
                <span className="portal-sidebar__item-label">{item.label}</span>
              </button>
            ))}
          </div>
        ))}

        <button
          className={`portal-sidebar__item${activeSection === 'settings' ? ' portal-sidebar__item--active' : ''}`}
          onClick={() => onNavigate('settings')}
        >
          <span className="portal-sidebar__item-icon">⚙️</span>
          <span className="portal-sidebar__item-label">Settings</span>
        </button>
      </nav>

      {/* Footer */}
      <div className="portal-sidebar__footer">
        <div className="portal-sidebar__help">
          <div className="portal-sidebar__help-icon">?</div>
          <div className="portal-sidebar__help-text">
            <p className="portal-sidebar__help-title">Need Help?</p>
            <a href="#support" className="portal-sidebar__help-link">Contact Partner Support</a>
          </div>
        </div>

        <div className="portal-sidebar__brand">
          <div className="portal-sidebar__brand-hex">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" fill="#4f6af5" />
              <text x="14" y="18.5" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="700">AE</text>
            </svg>
          </div>
          <div>
            <div className="portal-sidebar__brand-name">AUTOEXTRAS</div>
            <div className="portal-sidebar__brand-tagline">Drive Your Business</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
