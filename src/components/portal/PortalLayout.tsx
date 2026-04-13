import React, { useState } from 'react';
import './PortalLayout.css';
import { PortalSidebar } from './PortalSidebar';
import { PortalTopBar } from './PortalTopBar';
import { Dashboard } from './Dashboard';
import { PortalProducts } from './PortalProducts';
import { PortalOrders } from './PortalOrders';
import { PortalStoreProfile } from './PortalStoreProfile';
import { PortalSalesPayouts } from './PortalSalesPayouts';

export type PortalSection =
  | 'dashboard'
  | 'store-profile'
  | 'products'
  | 'categories'
  | 'customization'
  | 'orders'
  | 'returns'
  | 'shipments'
  | 'invoices'
  | 'sales-payouts'
  | 'analytics'
  | 'reviews'
  | 'settings';

function formatSection(s: PortalSection): string {
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function renderSection(section: PortalSection) {
  switch (section) {
    case 'dashboard':    return <Dashboard />;
    case 'store-profile': return <PortalStoreProfile />;
    case 'products':     return <PortalProducts />;
    case 'orders':       return <PortalOrders />;
    case 'sales-payouts': return <PortalSalesPayouts />;
    default:
      return (
        <div className="portal-placeholder">
          <div className="portal-placeholder__icon">🚧</div>
          <h2 className="portal-placeholder__title">{formatSection(section)}</h2>
          <p className="portal-placeholder__sub">This section is under construction.</p>
        </div>
      );
  }
}

export function PortalLayout() {
  const [activeSection, setActiveSection] = useState<PortalSection>('dashboard');

  return (
    <div className="portal-layout">
      <PortalSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div className="portal-body">
        <PortalTopBar />
        <main className="portal-content">
          {renderSection(activeSection)}
        </main>
      </div>
    </div>
  );
}
