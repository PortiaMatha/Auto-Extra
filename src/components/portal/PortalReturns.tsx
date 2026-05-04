import { useState } from 'react';
import './PortalOrders.css';

type ReturnStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

type ReturnItem = {
  id: string; orderId: string; customer: string; email: string;
  product: string; reason: string; date: string; status: ReturnStatus;
};

const MOCK: ReturnItem[] = [
  { id: 'RMA-0041', orderId: 'AE9844', customer: 'John Smith',    email: 'john@mail.com',  product: 'Premium Seat Cover Set',  reason: 'Wrong size',        date: '18 Mar 2024', status: 'Pending'   },
  { id: 'RMA-0040', orderId: 'AE9840', customer: 'David Botha',   email: 'david@mail.com', product: 'Exterior Car Cover',      reason: 'Defective product', date: '16 Mar 2024', status: 'Approved'  },
  { id: 'RMA-0039', orderId: 'AE9837', customer: 'Priya Naidoo',  email: 'priya@mail.com', product: 'Steering Wheel Cover',    reason: 'Changed mind',      date: '14 Mar 2024', status: 'Rejected'  },
  { id: 'RMA-0038', orderId: 'AE9833', customer: 'Sarah Miller',  email: 'sarah@mail.com', product: 'Interior Cover Bundle',   reason: 'Wrong colour',      date: '12 Mar 2024', status: 'Completed' },
  { id: 'RMA-0037', orderId: 'AE9829', customer: 'Emma Nkosi',    email: 'emma@mail.com',  product: 'Custom Logo Cover',       reason: 'Logo placement off',date: '10 Mar 2024', status: 'Approved'  },
];

const TABS: Array<'All' | ReturnStatus> = ['All', 'Pending', 'Approved', 'Rejected', 'Completed'];

const STATUS_COLOR: Record<ReturnStatus, string> = {
  Pending: 'ostatus--pending', Approved: 'ostatus--processing',
  Rejected: 'ostatus--cancelled', Completed: 'ostatus--delivered',
};

export function PortalReturns() {
  const [tab, setTab]       = useState<'All' | ReturnStatus>('All');
  const [search, setSearch] = useState('');

  const visible = MOCK.filter(r => {
    const matchTab    = tab === 'All' || r.status === tab;
    const matchSearch = r.customer.toLowerCase().includes(search.toLowerCase()) ||
                        r.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="opage">
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Returns</h1>
          <p className="opage__sub">{MOCK.length} return requests</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline">⬇ Export</button>
          <button className="btn-primary">+ New Return</button>
        </div>
      </div>

      <div className="opage__tabs">
        {TABS.map(t => (
          <button key={t} className={`otab${tab === t ? ' otab--active' : ''}`} onClick={() => setTab(t)}>
            {t}
            <span className="otab__count">{t === 'All' ? MOCK.length : MOCK.filter(r => r.status === t).length}</span>
          </button>
        ))}
      </div>

      <div className="opage__toolbar">
        <div className="opage__search">
          <span>🔍</span>
          <input placeholder="Search by RMA # or customer..." value={search}
            onChange={e => setSearch(e.target.value)} className="opage__search-input" />
        </div>
      </div>

      <div className="opage__card">
        <table className="otable">
          <thead>
            <tr>
              <th>RMA #</th><th>Order #</th><th>Customer</th>
              <th>Product</th><th>Reason</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id}>
                <td><span className="otable__id">{r.id}</span></td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{r.orderId}</td>
                <td>
                  <div className="otable__customer">
                    <div className="otable__avatar">{r.customer.charAt(0)}</div>
                    <div>
                      <div className="otable__customer-name">{r.customer}</div>
                      <div className="otable__customer-email">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 13 }}>{r.product}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{r.reason}</td>
                <td className="otable__date">{r.date}</td>
                <td><span className={`ostatus ${STATUS_COLOR[r.status]}`}>{r.status}</span></td>
                <td><button className="view-btn">View →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <div className="opage__empty">No returns found.</div>}
      </div>

      <div className="opage__pagination">
        <span className="opage__pag-info">Showing {visible.length} of {MOCK.length} returns</span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn" disabled>Next →</button>
        </div>
      </div>
    </div>
  );
}
