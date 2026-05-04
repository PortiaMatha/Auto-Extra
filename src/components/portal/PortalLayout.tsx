import React, { useState } from 'react';
import './PortalLayout.css';
import { PortalSidebar } from './PortalSidebar';
import { PortalTopBar } from './PortalTopBar';
import { Dashboard } from './Dashboard';
import { PortalProducts } from './PortalProducts';
import { PortalOrders } from './PortalOrders';
import { PortalStoreProfile } from './PortalStoreProfile';
import { PortalSalesPayouts } from './PortalSalesPayouts';
import { PortalCategories } from './PortalCategories';
import { PortalCustomization } from './PortalCustomization';
import { PortalReturns } from './PortalReturns';
import { PortalShipments } from './PortalShipments';
import { PortalInvoices } from './PortalInvoices';
import { PortalAnalytics } from './PortalAnalytics';
import { PortalReviews } from './PortalReviews';
import { PortalSettings } from './PortalSettings';

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


function renderSection(section: PortalSection, onNavigate: (s: PortalSection) => void) {
  switch (section) {
    case 'dashboard':      return <Dashboard onNavigate={onNavigate} />;
    case 'store-profile':  return <PortalStoreProfile />;
    case 'products':       return <PortalProducts />;
    case 'categories':     return <PortalCategories />;
    case 'customization':  return <PortalCustomization />;
    case 'orders':         return <PortalOrders />;
    case 'returns':        return <PortalReturns />;
    case 'shipments':      return <PortalShipments />;
    case 'invoices':       return <PortalInvoices />;
    case 'sales-payouts':  return <PortalSalesPayouts />;
    case 'analytics':      return <PortalAnalytics />;
    case 'reviews':        return <PortalReviews />;
    case 'settings':       return <PortalSettings />;
    default:               return null;
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
          {renderSection(activeSection, setActiveSection)}
        </main>
      </div>
    </div>
  );
}
