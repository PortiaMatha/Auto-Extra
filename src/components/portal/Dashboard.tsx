import React from 'react';
import './Dashboard.css';

// --- Types ---
type DataPoint = { day: string; value: number };

type Order = {
  id: string;
  customer: string;
  amount: string;
  status: 'Processing' | 'Pending' | 'Delivered' | 'Cancelled';
  time: string;
};

type StatCard = {
  label: string;
  sublabel: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  action: string;
  accentColor: string;
  icon: string;
};

// --- Mock API Data ---
const salesData: DataPoint[] = [
  { day: 'Mon', value: 5200 },
  { day: 'Tue', value: 6800 },
  { day: 'Wed', value: 5900 },
  { day: 'Thu', value: 8200 },
  { day: 'Fri', value: 9400 },
  { day: 'Sat', value: 7100 },
  { day: 'Sun', value: 6600 },
];

const statCards: StatCard[] = [
  {
    label: 'TOTAL SALES',
    sublabel: 'last 7 days',
    value: 'R28,450.00',
    change: '+8.2% ↑',
    changeType: 'positive',
    action: 'View Reports',
    accentColor: '#f97316',
    icon: '📈',
  },
  {
    label: 'ORDERS',
    sublabel: '',
    value: '12',
    change: '+3 new this week',
    changeType: 'positive',
    action: 'View Orders',
    accentColor: '#3b82f6',
    icon: '🛒',
  },
  {
    label: 'PAYOUT BALANCE',
    sublabel: '',
    value: 'R6,320.00',
    change: 'Next payout: 3 days',
    changeType: 'neutral',
    action: 'View Payouts',
    accentColor: '#22c55e',
    icon: '💳',
  },
  {
    label: 'ACTIVE PRODUCTS',
    sublabel: '',
    value: '48',
    change: '2 pending review',
    changeType: 'neutral',
    action: 'Manage Products',
    accentColor: '#8b5cf6',
    icon: '📦',
  },
];

const recentOrders: Order[] = [
  { id: 'AE70044', customer: 'John S.', amount: 'R1,250', status: 'Processing', time: '10 mins ago' },
  { id: 'AE70043', customer: 'Sarah M.', amount: 'R890', status: 'Processing', time: '1 hour ago' },
  { id: 'AE70042', customer: 'Mike R.', amount: 'R2,100', status: 'Pending', time: '3 hours ago' },
  { id: 'AE70041', customer: 'Lisa K.', amount: 'R650', status: 'Delivered', time: '2 days ago' },
  { id: 'AE70040', customer: 'David B.', amount: 'R3,450', status: 'Delivered', time: '3 days ago' },
];

const quickActions = [
  { icon: '📦', label: 'Add New Product', desc: 'List a new item', bg: '#fef3c7', color: '#d97706' },
  { icon: '📋', label: 'View Orders', desc: 'Manage orders', bg: '#dbeafe', color: '#2563eb' },
  { icon: '🚚', label: 'Configure Shipping', desc: 'Shipping settings', bg: '#e0e7ff', color: '#4338ca' },
  { icon: '🏪', label: 'Update Store', desc: 'Edit store profile', bg: '#d1fae5', color: '#059669' },
];

// --- SVG Chart ---
function buildSmoothPath(pts: [number, number][]): string {
  if (pts.length < 2) return '';
  const d: string[] = [`M ${pts[0][0]},${pts[0][1]}`];
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const cp1x = px + (cx - px) * 0.45;
    const cp2x = cx - (cx - px) * 0.45;
    d.push(`C ${cp1x},${py} ${cp2x},${cy} ${cx},${cy}`);
  }
  return d.join(' ');
}

function SalesChart({ data }: { data: DataPoint[] }) {
  const W = 520, H = 190;
  const pL = 52, pR = 16, pT = 20, pB = 36;
  const cW = W - pL - pR;
  const cH = H - pT - pB;

  const values = data.map(d => d.value);
  const maxV = Math.max(...values) * 1.05;
  const minV = Math.min(...values) * 0.82;
  const range = maxV - minV;

  const pts: [number, number][] = data.map((d, i) => [
    pL + (i / (data.length - 1)) * cW,
    pT + cH - ((d.value - minV) / range) * cH,
  ]);

  const linePath = buildSmoothPath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  const fillPath = `${linePath} L ${last[0]},${pT + cH} L ${first[0]},${pT + cH} Z`;

  const gridCount = 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="sales-chart-svg">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f6af5" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#4f6af5" stopOpacity="0" />
        </linearGradient>
      </defs>

      {Array.from({ length: gridCount + 1 }, (_, i) => {
        const t = i / gridCount;
        const y = pT + t * cH;
        const v = maxV - t * range;
        return (
          <g key={i}>
            <line x1={pL} y1={y} x2={W - pR} y2={y}
              stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,4" />
            <text x={pL - 7} y={y + 4} textAnchor="end" fontSize="9.5" fill="#9ca3af">
              R{(v / 1000).toFixed(0)}k
            </text>
          </g>
        );
      })}

      {pts.map(([x], i) => (
        <text key={i} x={x} y={H - 8} textAnchor="middle" fontSize="10" fill="#9ca3af">
          {data[i].day}
        </text>
      ))}

      <path d={fillPath} fill="url(#chartGrad)" />
      <path d={linePath} fill="none" stroke="#4f6af5" strokeWidth="2.5" strokeLinejoin="round" />

      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke="#4f6af5" strokeWidth="2" />
      ))}
    </svg>
  );
}

// --- Status Badge ---
function StatusBadge({ status }: { status: Order['status'] }) {
  const cls: Record<Order['status'], string> = {
    Processing: 'badge--blue',
    Pending: 'badge--orange',
    Delivered: 'badge--green',
    Cancelled: 'badge--red',
  };
  return <span className={`order-badge ${cls[status]}`}>{status}</span>;
}

// --- Dashboard ---
export function Dashboard() {
  return (
    <div className="dashboard">
      {/* Page Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
          <p className="dashboard-subtitle">Welcome back, John! Here's your store performance</p>
        </div>
        <div className="dashboard-header-actions">
          <button className="date-filter-btn">📅 Last 7 days ▾</button>
          <span className="store-status-badge">
            <span className="status-dot" /> Store Status: <strong>Approved</strong>
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((card, i) => (
          <div key={i} className="stat-card" style={{ borderTopColor: card.accentColor }}>
            <div className="stat-card__top">
              <span className="stat-card__icon" style={{ background: card.accentColor + '1a', color: card.accentColor }}>
                {card.icon}
              </span>
              <div>
                <div className="stat-card__label">
                  {card.label}
                  {card.sublabel && <span className="stat-card__sublabel"> ({card.sublabel})</span>}
                </div>
                <div className="stat-card__value">{card.value}</div>
              </div>
            </div>
            <div className="stat-card__footer">
              <span className={`stat-card__change stat-card__change--${card.changeType}`}>
                {card.change}
              </span>
              <a href="#" className="stat-card__action">{card.action} →</a>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row */}
      <div className="dashboard-row">
        <div className="card card--wide">
          <div className="card-header">
            <h3 className="card-title">Sales Performance</h3>
            <span className="card-pill">Last 7 Days</span>
          </div>
          <SalesChart data={salesData} />
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Orders</h3>
            <a href="#" className="card-link">View All Orders →</a>
          </div>
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-item__left">
                  <span className="order-item__id">{order.id}</span>
                  <span className="order-item__customer">{order.customer}</span>
                </div>
                <div className="order-item__right">
                  <span className="order-item__amount">{order.amount}</span>
                  <StatusBadge status={order.status} />
                  <span className="order-item__time">{order.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-row">
        <div className="card card--wide">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
            <a href="#" className="card-link">View all →</a>
          </div>
          <div className="quick-actions-grid">
            {quickActions.map((a, i) => (
              <button key={i} className="quick-action-card">
                <span className="quick-action-icon" style={{ background: a.bg, color: a.color }}>
                  {a.icon}
                </span>
                <span className="quick-action-label">{a.label}</span>
                <span className="quick-action-desc">{a.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Store Performance</h3>
          </div>
          <div className="perf-rating-row">
            <div className="perf-rating-num">4.9<span>/5.0</span></div>
            <div>
              <div className="perf-stars">★★★★★</div>
              <div className="perf-rating-label">Average Rating</div>
            </div>
          </div>
          <div className="perf-items">
            <div className="perf-item">
              <span className="perf-item__label">Total Reviews</span>
              <span className="perf-item__val">124</span>
            </div>
            <div className="perf-item">
              <span className="perf-item__label">Fulfilment</span>
              <div className="perf-item__bar-row">
                <div className="perf-bar"><div className="perf-bar__fill" style={{ width: '98%' }} /></div>
                <span className="perf-item__val">98%</span>
              </div>
            </div>
            <div className="perf-item">
              <span className="perf-item__label">On-time Shipping</span>
              <div className="perf-item__bar-row">
                <div className="perf-bar"><div className="perf-bar__fill" style={{ width: '96%' }} /></div>
                <span className="perf-item__val">96%</span>
              </div>
            </div>
          </div>
          <a href="#" className="perf-view-link">View Performance Details →</a>
        </div>
      </div>
    </div>
  );
}
