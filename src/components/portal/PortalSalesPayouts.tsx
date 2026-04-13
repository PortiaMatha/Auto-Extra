import React, { useState } from 'react';
import './PortalSalesPayouts.css';

type PayoutStatus = 'Paid' | 'Pending' | 'Processing';

type SaleEntry = {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  fee: number;
  net: number;
  status: PayoutStatus;
};

const mockSales: SaleEntry[] = [
  { id: 'PAY001', orderId: 'AE9844', customer: 'John Smith',    date: '15 Mar 2024', amount: 1250, fee: 62,  net: 1188, status: 'Processing' },
  { id: 'PAY002', orderId: 'AE9843', customer: 'Sarah Miller',  date: '14 Mar 2024', amount: 890,  fee: 44,  net: 846,  status: 'Paid'       },
  { id: 'PAY003', orderId: 'AE9842', customer: 'Mike Roberts',  date: '14 Mar 2024', amount: 2100, fee: 105, net: 1995, status: 'Pending'     },
  { id: 'PAY004', orderId: 'AE9840', customer: 'David Botha',   date: '11 Mar 2024', amount: 3450, fee: 172, net: 3278, status: 'Paid'        },
  { id: 'PAY005', orderId: 'AE9839', customer: 'Emma Nkosi',    date: '10 Mar 2024', amount: 1740, fee: 87,  net: 1653, status: 'Paid'        },
  { id: 'PAY006', orderId: 'AE9838', customer: 'Thabo Dlamini', date: '09 Mar 2024', amount: 480,  fee: 24,  net: 456,  status: 'Paid'        },
  { id: 'PAY007', orderId: 'AE9837', customer: 'Priya Naidoo',  date: '08 Mar 2024', amount: 960,  fee: 48,  net: 912,  status: 'Pending'     },
  { id: 'PAY008', orderId: 'AE9835', customer: 'James Venter',  date: '06 Mar 2024', amount: 2780, fee: 139, net: 2641, status: 'Paid'        },
];

const totalEarnings   = mockSales.reduce((s, e) => s + e.net, 0);
const pendingPayout   = mockSales.filter(e => e.status === 'Pending').reduce((s, e) => s + e.net, 0);
const totalPaidOut    = mockSales.filter(e => e.status === 'Paid').reduce((s, e) => s + e.net, 0);
const nextPayoutDate  = '22 Mar 2024';

const STATUS_COLORS: Record<PayoutStatus, string> = {
  Paid: 'pstatus--paid',
  Pending: 'pstatus--pending',
  Processing: 'pstatus--processing',
};

export function PortalSalesPayouts() {
  const [filter, setFilter] = useState<'All' | PayoutStatus>('All');

  const visible = filter === 'All' ? mockSales : mockSales.filter(e => e.status === filter);

  return (
    <div className="paypage">
      {/* Header */}
      <div className="paypage__header">
        <div>
          <h1 className="paypage__title">Sales & Payouts</h1>
          <p className="paypage__sub">Track your earnings and payout schedule</p>
        </div>
        <div className="paypage__header-actions">
          <button className="btn-outline">⬇ Download Report</button>
          <button className="btn-primary">💳 Request Payout</button>
        </div>
      </div>

      {/* Layout: table + summary */}
      <div className="paypage__layout">
        {/* LEFT — Sales table */}
        <div className="paypage__main">
          {/* Filter tabs */}
          <div className="paypage__filters">
            {(['All', 'Paid', 'Pending', 'Processing'] as const).map(f => (
              <button
                key={f}
                className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`}
                onClick={() => setFilter(f)}
              >{f}</button>
            ))}
          </div>

          <div className="ppage__card">
            <table className="paytable">
              <thead>
                <tr>
                  <th>Payout ID</th>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Sale Amount</th>
                  <th>Fee (5%)</th>
                  <th>Net Payout</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visible.map(e => (
                  <tr key={e.id}>
                    <td className="paytable__id">{e.id}</td>
                    <td><span className="otable__id">{e.orderId}</span></td>
                    <td className="paytable__customer">{e.customer}</td>
                    <td className="paytable__date">{e.date}</td>
                    <td className="paytable__amount">R{e.amount.toLocaleString()}.00</td>
                    <td className="paytable__fee">-R{e.fee}.00</td>
                    <td className="paytable__net">R{e.net.toLocaleString()}.00</td>
                    <td><span className={`pstatus ${STATUS_COLORS[e.status]}`}>{e.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT — Payout Summary */}
        <aside className="paypage__summary">
          <div className="pay-summary-card">
            <h3 className="pay-summary-card__title">Payout Summary</h3>

            <div className="pay-stat pay-stat--main">
              <span className="pay-stat__label">Total Earnings</span>
              <span className="pay-stat__value">R{totalEarnings.toLocaleString()}.00</span>
            </div>

            <div className="pay-stat">
              <span className="pay-stat__label">Total Paid Out</span>
              <span className="pay-stat__value pay-stat__value--green">R{totalPaidOut.toLocaleString()}.00</span>
            </div>

            <div className="pay-divider" />

            <div className="pay-stat pay-stat--pending">
              <span className="pay-stat__label">Pending Payout</span>
              <span className="pay-stat__value pay-stat__value--orange">R{pendingPayout.toLocaleString()}.00</span>
            </div>

            <div className="pay-next">
              <span className="pay-next__icon">📅</span>
              <div>
                <div className="pay-next__label">Next Payout Date</div>
                <div className="pay-next__date">{nextPayoutDate}</div>
              </div>
            </div>

            <button className="btn-primary pay-summary-card__cta">Request Payout</button>

            <div className="pay-divider" />

            <div className="pay-breakdown">
              <h4 className="pay-breakdown__title">This Week</h4>
              {[
                { label: 'Orders',     value: '8' },
                { label: 'Revenue',    value: `R${mockSales.reduce((s,e)=>s+e.amount,0).toLocaleString()}.00` },
                { label: 'Fees',       value: `R${mockSales.reduce((s,e)=>s+e.fee,0)}.00` },
                { label: 'Net',        value: `R${totalEarnings.toLocaleString()}.00` },
              ].map(item => (
                <div key={item.label} className="pay-breakdown__row">
                  <span className="pay-breakdown__label">{item.label}</span>
                  <span className="pay-breakdown__val">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
