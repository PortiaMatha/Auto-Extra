import { useState } from 'react';
import './PortalOrders.css';

type InvStatus = 'Paid' | 'Pending' | 'Overdue';

type Invoice = {
  id: string; orderId: string; customer: string; email: string;
  date: string; due: string; amount: number; status: InvStatus;
};

const MOCK: Invoice[] = [
  { id: 'INV-2024-0041', orderId: 'AE9844', customer: 'John Smith',    email: 'john@mail.com',  date: '15 Mar 2024', due: '29 Mar 2024', amount: 1250, status: 'Pending'  },
  { id: 'INV-2024-0040', orderId: 'AE9843', customer: 'Sarah Miller',  email: 'sarah@mail.com', date: '14 Mar 2024', due: '28 Mar 2024', amount: 890,  status: 'Paid'     },
  { id: 'INV-2024-0039', orderId: 'AE9842', customer: 'Mike Roberts',  email: 'mike@mail.com',  date: '14 Mar 2024', due: '28 Mar 2024', amount: 2100, status: 'Pending'  },
  { id: 'INV-2024-0038', orderId: 'AE9841', customer: 'Lisa Khumalo',  email: 'lisa@mail.com',  date: '12 Mar 2024', due: '26 Mar 2024', amount: 650,  status: 'Overdue'  },
  { id: 'INV-2024-0037', orderId: 'AE9840', customer: 'David Botha',   email: 'david@mail.com', date: '11 Mar 2024', due: '25 Mar 2024', amount: 3450, status: 'Paid'     },
  { id: 'INV-2024-0036', orderId: 'AE9839', customer: 'Emma Nkosi',    email: 'emma@mail.com',  date: '10 Mar 2024', due: '24 Mar 2024', amount: 1740, status: 'Overdue'  },
  { id: 'INV-2024-0035', orderId: 'AE9838', customer: 'Thabo Dlamini', email: 'thabo@mail.com', date: '09 Mar 2024', due: '23 Mar 2024', amount: 480,  status: 'Paid'     },
];

const TABS: Array<'All' | InvStatus> = ['All', 'Paid', 'Pending', 'Overdue'];

const STATUS_COLOR: Record<InvStatus, string> = {
  Paid: 'ostatus--delivered', Pending: 'ostatus--pending', Overdue: 'ostatus--cancelled',
};

export function PortalInvoices() {
  const [tab, setTab]       = useState<'All' | InvStatus>('All');
  const [search, setSearch] = useState('');

  const visible = MOCK.filter(inv => {
    const matchTab    = tab === 'All' || inv.status === tab;
    const matchSearch = inv.customer.toLowerCase().includes(search.toLowerCase()) ||
                        inv.id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const totalVisible = visible.reduce((s, i) => s + i.amount, 0);

  return (
    <div className="opage">
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Invoices</h1>
          <p className="opage__sub">{MOCK.length} invoices · Total R{MOCK.reduce((s,i)=>s+i.amount,0).toLocaleString()}.00</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline">⬇ Export</button>
          <button className="btn-primary">+ New Invoice</button>
        </div>
      </div>

      <div className="opage__tabs">
        {TABS.map(t => (
          <button key={t} className={`otab${tab === t ? ' otab--active' : ''}`} onClick={() => setTab(t)}>
            {t}
            <span className="otab__count">{t === 'All' ? MOCK.length : MOCK.filter(i => i.status === t).length}</span>
          </button>
        ))}
      </div>

      <div className="opage__toolbar">
        <div className="opage__search">
          <span>🔍</span>
          <input placeholder="Search by invoice # or customer..." value={search}
            onChange={e => setSearch(e.target.value)} className="opage__search-input" />
        </div>
        <div className="opage__toolbar-right">
          <button className="btn-outline">📅 Date Range</button>
        </div>
      </div>

      <div className="opage__card">
        <table className="otable">
          <thead>
            <tr>
              <th>Invoice #</th><th>Order</th><th>Customer</th>
              <th>Date</th><th>Due</th><th>Amount</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(inv => (
              <tr key={inv.id}>
                <td><span className="otable__id">{inv.id}</span></td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{inv.orderId}</td>
                <td>
                  <div className="otable__customer">
                    <div className="otable__avatar">{inv.customer.charAt(0)}</div>
                    <div>
                      <div className="otable__customer-name">{inv.customer}</div>
                      <div className="otable__customer-email">{inv.email}</div>
                    </div>
                  </div>
                </td>
                <td className="otable__date">{inv.date}</td>
                <td className="otable__date" style={{ color: inv.status === 'Overdue' ? '#ef4444' : undefined }}>{inv.due}</td>
                <td className="otable__total">R{inv.amount.toLocaleString()}.00</td>
                <td><span className={`ostatus ${STATUS_COLOR[inv.status]}`}>{inv.status}</span></td>
                <td>
                  <div style={{ display:'flex', gap:6 }}>
                    <button className="view-btn">View</button>
                    <button className="view-btn">PDF</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
          {visible.length > 0 && (
            <tfoot>
              <tr style={{ background:'#f9fafb' }}>
                <td colSpan={5} style={{ textAlign:'right', padding:'12px 14px', fontWeight:600, fontSize:13 }}>Total:</td>
                <td style={{ padding:'12px 14px', fontWeight:700, color:'#111827' }}>R{totalVisible.toLocaleString()}.00</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          )}
        </table>
        {visible.length === 0 && <div className="opage__empty">No invoices found.</div>}
      </div>

      <div className="opage__pagination">
        <span className="opage__pag-info">Showing {visible.length} of {MOCK.length} invoices</span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn" disabled>Next →</button>
        </div>
      </div>
    </div>
  );
}
