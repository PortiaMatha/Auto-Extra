import React, { useState } from 'react';
import './PortalOrders.css';

type OrderStatus = 'Processing' | 'Delivered' | 'Pending' | 'Cancelled';

type Order = {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: OrderStatus;
};

const mockOrders: Order[] = [
  { id: 'AE9844', customer: 'John Smith',    email: 'john@mail.com',    date: '15 Mar 2024', items: 2, total: 1250, status: 'Processing' },
  { id: 'AE9843', customer: 'Sarah Miller',  email: 'sarah@mail.com',   date: '14 Mar 2024', items: 1, total: 890,  status: 'Delivered'  },
  { id: 'AE9842', customer: 'Mike Roberts',  email: 'mike@mail.com',    date: '14 Mar 2024', items: 3, total: 2100, status: 'Pending'    },
  { id: 'AE9841', customer: 'Lisa Khumalo',  email: 'lisa@mail.com',    date: '12 Mar 2024', items: 1, total: 650,  status: 'Cancelled'  },
  { id: 'AE9840', customer: 'David Botha',   email: 'david@mail.com',   date: '11 Mar 2024', items: 4, total: 3450, status: 'Delivered'  },
  { id: 'AE9839', customer: 'Emma Nkosi',    email: 'emma@mail.com',    date: '10 Mar 2024', items: 2, total: 1740, status: 'Processing' },
  { id: 'AE9838', customer: 'Thabo Dlamini', email: 'thabo@mail.com',   date: '09 Mar 2024', items: 1, total: 480,  status: 'Delivered'  },
  { id: 'AE9837', customer: 'Priya Naidoo',  email: 'priya@mail.com',   date: '08 Mar 2024', items: 2, total: 960,  status: 'Pending'    },
];

const STATUS_TABS: Array<'All' | OrderStatus> = ['All', 'Processing', 'Delivered', 'Pending', 'Cancelled'];

const STATUS_COUNTS: Record<string, number> = {
  All: mockOrders.length,
  Processing: mockOrders.filter(o => o.status === 'Processing').length,
  Delivered:  mockOrders.filter(o => o.status === 'Delivered').length,
  Pending:    mockOrders.filter(o => o.status === 'Pending').length,
  Cancelled:  mockOrders.filter(o => o.status === 'Cancelled').length,
};

export function PortalOrders() {
  const [tab, setTab]       = useState<'All' | OrderStatus>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const visible = mockOrders.filter(o => {
    const matchTab = tab === 'All' || o.status === tab;
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
                        o.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const toggleSelect = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === visible.length ? [] : visible.map(o => o.id));

  return (
    <div className="opage">
      {/* Header */}
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Orders</h1>
          <p className="opage__sub">{mockOrders.length} total orders</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline">⬇ Export</button>
          <button className="btn-primary">+ New Order</button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="opage__tabs">
        {STATUS_TABS.map(t => (
          <button
            key={t}
            className={`otab${tab === t ? ' otab--active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
            <span className="otab__count">{STATUS_COUNTS[t]}</span>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="opage__toolbar">
        <div className="opage__search">
          <span>🔍</span>
          <input
            placeholder="Search by order # or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="opage__search-input"
          />
        </div>
        <div className="opage__toolbar-right">
          <button className="btn-outline">📅 Date Range</button>
          <button className="btn-outline">⚙ Filters</button>
        </div>
      </div>

      {/* Table */}
      <div className="opage__card">
        <table className="otable">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={toggleAll} checked={selected.length === visible.length && visible.length > 0} /></th>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(o => (
              <tr key={o.id} className={selected.includes(o.id) ? 'otable__row--selected' : ''}>
                <td><input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggleSelect(o.id)} /></td>
                <td><span className="otable__id">{o.id}</span></td>
                <td>
                  <div className="otable__customer">
                    <div className="otable__avatar">{o.customer.charAt(0)}</div>
                    <div>
                      <div className="otable__customer-name">{o.customer}</div>
                      <div className="otable__customer-email">{o.email}</div>
                    </div>
                  </div>
                </td>
                <td className="otable__date">{o.date}</td>
                <td className="otable__items">{o.items} item{o.items !== 1 ? 's' : ''}</td>
                <td className="otable__total">R{o.total.toLocaleString()}.00</td>
                <td><span className={`ostatus ostatus--${o.status.toLowerCase()}`}>{o.status}</span></td>
                <td>
                  <button className="view-btn">View →</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="opage__empty">No orders found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="opage__pagination">
        <span className="opage__pag-info">Showing {visible.length} of {mockOrders.length} orders</span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn">2</button>
          <button className="pag-btn">Next →</button>
        </div>
      </div>
    </div>
  );
}
