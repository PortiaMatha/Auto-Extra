import React, { useState } from 'react';
import './PortalTopBar.css';

export function PortalTopBar() {
  const [search, setSearch] = useState('');

  return (
    <header className="portal-topbar">
      <div className="portal-topbar__search">
        <span className="portal-topbar__search-icon">🔍</span>
        <input
          type="text"
          className="portal-topbar__search-input"
          placeholder="Search orders, products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="portal-topbar__right">
        <button className="portal-topbar__icon-btn" title="Notifications">
          <span className="portal-topbar__bell">🔔</span>
          <span className="portal-topbar__badge">3</span>
        </button>

        <div className="portal-topbar__user">
          <div className="portal-topbar__avatar">PM</div>
          <div className="portal-topbar__user-info">
            <span className="portal-topbar__user-name">Portia Matha</span>
            <span className="portal-topbar__user-role">Store Owner</span>
          </div>
          <span className="portal-topbar__chevron">▾</span>
        </div>
      </div>
    </header>
  );
}
