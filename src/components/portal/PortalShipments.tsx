import { useState } from 'react';
import './PortalOrders.css';

type ShipStatus = 'In Transit' | 'Delivered' | 'Pending' | 'Failed';

type Shipment = {
  tracking: string; orderId: string; customer: string; courier: string;
  destination: string; eta: string; status: ShipStatus;
};

const MOCK: Shipment[] = [
  { tracking: 'CPX-110293847', orderId: 'AE9844', customer: 'John Smith',    courier: 'Courier Guy', destination: 'Johannesburg', eta: '20 Mar 2024', status: 'In Transit' },
  { tracking: 'DHL-884920011', orderId: 'AE9843', customer: 'Sarah Miller',  courier: 'DHL',         destination: 'Cape Town',    eta: '19 Mar 2024', status: 'Delivered'  },
  { tracking: 'DSV-002948301', orderId: 'AE9842', customer: 'Mike Roberts',  courier: 'DSV',         destination: 'Durban',       eta: '21 Mar 2024', status: 'Pending'    },
  { tracking: 'CPX-110293100', orderId: 'AE9841', customer: 'Lisa Khumalo',  courier: 'Courier Guy', destination: 'Pretoria',     eta: '18 Mar 2024', status: 'Failed'     },
  { tracking: 'DHL-884920045', orderId: 'AE9840', customer: 'David Botha',   courier: 'DHL',         destination: 'Bloemfontein', eta: '17 Mar 2024', status: 'Delivered'  },
  { tracking: 'DSV-002948412', orderId: 'AE9839', customer: 'Emma Nkosi',    courier: 'DSV',         destination: 'Port Elizabeth',eta:'22 Mar 2024', status: 'In Transit' },
];

const TABS: Array<'All' | ShipStatus> = ['All', 'In Transit', 'Delivered', 'Pending', 'Failed'];

const STATUS_COLOR: Record<ShipStatus, string> = {
  'In Transit': 'ostatus--processing', Delivered: 'ostatus--delivered',
  Pending: 'ostatus--pending', Failed: 'ostatus--cancelled',
};

export function PortalShipments() {
  const [tab, setTab]       = useState<'All' | ShipStatus>('All');
  const [search, setSearch] = useState('');

  const visible = MOCK.filter(s => {
    const matchTab    = tab === 'All' || s.status === tab;
    const matchSearch = s.customer.toLowerCase().includes(search.toLowerCase()) ||
                        s.tracking.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="opage">
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Shipments</h1>
          <p className="opage__sub">{MOCK.length} shipments</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline">⬇ Export</button>
          <button className="btn-primary">+ Create Shipment</button>
        </div>
      </div>

      <div className="opage__tabs">
        {TABS.map(t => (
          <button key={t} className={`otab${tab === t ? ' otab--active' : ''}`} onClick={() => setTab(t)}>
            {t}
            <span className="otab__count">{t === 'All' ? MOCK.length : MOCK.filter(s => s.status === t).length}</span>
          </button>
        ))}
      </div>

      <div className="opage__toolbar">
        <div className="opage__search">
          <span>🔍</span>
          <input placeholder="Search by tracking # or customer..." value={search}
            onChange={e => setSearch(e.target.value)} className="opage__search-input" />
        </div>
        <div className="opage__toolbar-right">
          <button className="btn-outline">⚙ Filters</button>
        </div>
      </div>

      <div className="opage__card">
        <table className="otable">
          <thead>
            <tr>
              <th>Tracking #</th><th>Order #</th><th>Customer</th>
              <th>Courier</th><th>Destination</th><th>ETA</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(s => (
              <tr key={s.tracking}>
                <td><span className="otable__id" style={{ fontFamily: 'monospace', fontSize: 12 }}>{s.tracking}</span></td>
                <td style={{ color: '#6b7280', fontSize: 13 }}>{s.orderId}</td>
                <td className="otable__customer-name">{s.customer}</td>
                <td style={{ fontSize: 13 }}>{s.courier}</td>
                <td style={{ fontSize: 13, color: '#6b7280' }}>{s.destination}</td>
                <td className="otable__date">{s.eta}</td>
                <td><span className={`ostatus ${STATUS_COLOR[s.status]}`}>{s.status}</span></td>
                <td><button className="view-btn">Track →</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && <div className="opage__empty">No shipments found.</div>}
      </div>

      <div className="opage__pagination">
        <span className="opage__pag-info">Showing {visible.length} of {MOCK.length} shipments</span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn" disabled>Next →</button>
        </div>
      </div>
    </div>
  );
}
