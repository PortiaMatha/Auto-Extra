import './PortalAnalytics.css';

const STATS = [
  { label: 'Total Revenue',    value: 'R48,320', change: '+12.4%', up: true,  icon: '💰' },
  { label: 'Orders This Month',value: '134',     change: '+8.1%',  up: true,  icon: '📦' },
  { label: 'Avg Order Value',  value: 'R360',    change: '-2.3%',  up: false, icon: '🛒' },
  { label: 'Return Rate',      value: '3.2%',    change: '-0.5%',  up: true,  icon: '↩' },
];

const TOP_PRODUCTS = [
  { name: 'Premium Seat Cover Set',  sales: 42, revenue: 18900, pct: 88 },
  { name: 'Exterior Car Cover',      sales: 31, revenue: 12400, pct: 65 },
  { name: 'Custom Logo Cover',       sales: 28, revenue: 11200, pct: 58 },
  { name: 'Steering Wheel Cover',    sales: 19, revenue: 4750,  pct: 40 },
  { name: 'Interior Cover Bundle',   sales: 14, revenue: 8400,  pct: 29 },
];

const MONTHLY = [
  { month: 'Oct', value: 6200 },
  { month: 'Nov', value: 8400 },
  { month: 'Dec', value: 11200 },
  { month: 'Jan', value: 7800 },
  { month: 'Feb', value: 9100 },
  { month: 'Mar', value: 12400 },
];

const MAX_VAL = Math.max(...MONTHLY.map(m => m.value));

export function PortalAnalytics() {
  return (
    <div className="analytics">
      <div className="analytics__header">
        <div>
          <h1 className="analytics__title">Analytics</h1>
          <p className="analytics__sub">Performance overview — last 30 days</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button className="btn-outline">📅 Last 30 days</button>
          <button className="btn-outline">⬇ Export</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="analytics__kpis">
        {STATS.map(s => (
          <div key={s.label} className="kpi-card">
            <div className="kpi-card__icon">{s.icon}</div>
            <div className="kpi-card__body">
              <p className="kpi-card__label">{s.label}</p>
              <p className="kpi-card__value">{s.value}</p>
              <span className={`kpi-card__change kpi-card__change--${s.up ? 'up' : 'down'}`}>
                {s.up ? '▲' : '▼'} {s.change} vs last month
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="analytics__row">
        {/* Revenue Chart */}
        <div className="analytics__chart-card">
          <h3 className="analytics__section-title">Monthly Revenue</h3>
          <div className="bar-chart">
            {MONTHLY.map(m => (
              <div key={m.month} className="bar-chart__col">
                <span className="bar-chart__value">R{(m.value/1000).toFixed(1)}k</span>
                <div
                  className="bar-chart__bar"
                  style={{ height: `${(m.value / MAX_VAL) * 160}px` }}
                />
                <span className="bar-chart__label">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="analytics__chart-card">
          <h3 className="analytics__section-title">Top Products</h3>
          <div className="top-products">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={p.name} className="top-product-row">
                <span className="top-product-row__rank">{i + 1}</span>
                <div className="top-product-row__info">
                  <span className="top-product-row__name">{p.name}</span>
                  <div className="top-product-row__bar-wrap">
                    <div className="top-product-row__bar" style={{ width: `${p.pct}%` }} />
                  </div>
                </div>
                <div className="top-product-row__stats">
                  <span>{p.sales} sales</span>
                  <span className="top-product-row__revenue">R{p.revenue.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
