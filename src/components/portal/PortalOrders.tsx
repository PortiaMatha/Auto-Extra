import React, { useState } from 'react';
import './PortalOrders.css';
import { useOrders } from '../../context/OrdersContext';
import { Order, OrderStatus } from '../../types/orders';

const STATUS_TABS: Array<'All' | OrderStatus> = [
  'All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled',
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' });

/* ── Order detail drawer ──────────────────────────────────────────── */

function OrderDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (status: OrderStatus) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);

  const handleStatus = async (status: OrderStatus) => {
    setUpdating(true);
    try { await onStatusChange(status); } finally { setUpdating(false); }
  };

  return (
    <div className="odrawer-overlay" onClick={onClose}>
      <div className="odrawer" onClick={e => e.stopPropagation()}>
        <div className="odrawer__header">
          <div>
            <h2 className="odrawer__title">Order #{order.orderRef}</h2>
            <p className="odrawer__date">{formatDate(order.createdAt)}</p>
          </div>
          <button className="odrawer__close" onClick={onClose}>✕</button>
        </div>

        {/* Customer */}
        <div className="odrawer__section">
          <h3 className="odrawer__section-title">Customer</h3>
          <div className="odrawer__customer-card">
            <div className="odrawer__avatar">{order.customerName.charAt(0)}</div>
            <div>
              <p className="odrawer__customer-name">{order.customerName}</p>
              <p className="odrawer__customer-email">{order.customerEmail}</p>
              {order.phone && <p className="odrawer__customer-email">📞 {order.phone}</p>}
            </div>
          </div>
        </div>

        {/* Payment status */}
        <div className="odrawer__section">
          <h3 className="odrawer__section-title">Payment</h3>
          <span className={`opayment opayment--${order.paymentStatus.toLowerCase()}`}>
            {order.paymentStatus}
          </span>
        </div>

        {/* Delivery address */}
        <div className="odrawer__section">
          <h3 className="odrawer__section-title">Delivery Address</h3>
          <div className="odrawer__address">
            <p>{order.deliveryAddress}</p>
            <p>{order.deliveryCity}{order.deliveryProvince ? `, ${order.deliveryProvince}` : ''} {order.deliveryPostalCode}</p>
            <p>{order.deliveryCountry}</p>
          </div>
        </div>

        {/* Billing address */}
        <div className="odrawer__section">
          <h3 className="odrawer__section-title">Billing Address</h3>
          {order.billingSame ? (
            <p className="odrawer__same-billing">Same as delivery address</p>
          ) : (
            <div className="odrawer__address">
              <p><strong>{order.billingFirstName} {order.billingLastName}</strong></p>
              <p>{order.billingAddress}</p>
              <p>{order.billingCity}{order.billingProvince ? `, ${order.billingProvince}` : ''} {order.billingPostalCode}</p>
              <p>{order.billingCountry}</p>
              {order.billingPhone    && <p>📞 {order.billingPhone}</p>}
              {order.billingAltPhone && <p>📞 Alt: {order.billingAltPhone}</p>}
            </div>
          )}
        </div>

        {/* Products ordered */}
        <div className="odrawer__section">
          <h3 className="odrawer__section-title">Products Ordered</h3>
          {order.items.length === 0 ? (
            <p className="odrawer__empty">No items found.</p>
          ) : (
            <table className="odrawer__items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.productTitle}</td>
                    <td>{item.size || '—'}</td>
                    <td>{item.color || '—'}</td>
                    <td>{item.quantity}</td>
                    <td>R{item.unitPrice.toLocaleString()}</td>
                    <td>R{(item.unitPrice * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Totals */}
        <div className="odrawer__section">
          <div className="odrawer__totals">
            <div className="odrawer__total-row">
              <span>Subtotal</span>
              <span>R{(order.totalAmount - order.shippingFee).toLocaleString()}</span>
            </div>
            <div className="odrawer__total-row">
              <span>Shipping</span>
              <span>R{order.shippingFee.toLocaleString()}</span>
            </div>
            <div className="odrawer__total-row odrawer__total-row--grand">
              <span>Total</span>
              <span>R{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Status update */}
        <div className="odrawer__section">
          <h3 className="odrawer__section-title">Update Status</h3>
          <div className="odrawer__status-btns">
            {(['Pending','Processing','Shipped','Delivered','Cancelled'] as OrderStatus[]).map(s => (
              <button
                key={s}
                disabled={updating || order.status === s}
                className={`odrawer__status-btn odrawer__status-btn--${s.toLowerCase()}${order.status === s ? ' odrawer__status-btn--current' : ''}`}
                onClick={() => handleStatus(s)}
              >{s}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */

export function PortalOrders() {
  const { orders, loading, updateOrderStatus, deleteOrder } = useOrders();
  const [tab, setTab] = useState<'All' | OrderStatus>('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<number[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const visible = orders.filter(o => {
    const matchTab = tab === 'All' || o.status === tab;
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.orderRef.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const countFor = (t: 'All' | OrderStatus) =>
    t === 'All' ? orders.length : orders.filter(o => o.status === t).length;

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === visible.length ? [] : visible.map(o => o.id));

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this order? This cannot be undone.')) {
      await deleteOrder(id);
      setSelected(s => s.filter(x => x !== id));
    }
  };

  const exportCSV = () => {
    const header = 'Order#,Customer,Email,Date,Items,Total,Status';
    const rows = orders.map(o =>
      `${o.orderRef},"${o.customerName}","${o.customerEmail}",${formatDate(o.createdAt)},${o.items.length},${o.totalAmount},${o.status}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="opage">
      {/* Header */}
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Orders</h1>
          <p className="opage__sub">{orders.length} total order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline" onClick={exportCSV}>⬇ Export</button>
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
            <span className="otab__count">{countFor(t)}</span>
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
      </div>

      {/* Table */}
      <div className="opage__card">
        {loading && <div className="opage__loading">Loading orders…</div>}
        <table className="otable">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={selected.length === visible.length && visible.length > 0}
                />
              </th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(o.id)}
                    onChange={() => toggleSelect(o.id)}
                  />
                </td>
                <td><span className="otable__id">{o.orderRef}</span></td>
                <td>
                  <div className="otable__customer">
                    <div className="otable__avatar">{o.customerName.charAt(0)}</div>
                    <div>
                      <div className="otable__customer-name">{o.customerName}</div>
                      <div className="otable__customer-email">{o.customerEmail}</div>
                    </div>
                  </div>
                </td>
                <td className="otable__date">{formatDate(o.createdAt)}</td>
                <td className="otable__items">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                <td className="otable__total">R{o.totalAmount.toLocaleString()}.00</td>
                <td>
                  <span className={`ostatus ostatus--${o.status.toLowerCase()}`}>{o.status}</span>
                </td>
                <td>
                  <div className="ptable__actions">
                    <button className="view-btn" onClick={() => setActiveOrder(o)}>View →</button>
                    <button
                      className="action-btn action-btn--danger"
                      title="Delete"
                      onClick={() => handleDelete(o.id)}
                    >🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && visible.length === 0 && (
          <div className="opage__empty">No orders found.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="opage__pagination">
        <span className="opage__pag-info">
          Showing {visible.length} of {orders.length} orders
        </span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn">Next →</button>
        </div>
      </div>

      {/* Order detail drawer */}
      {activeOrder && (
        <OrderDrawer
          order={activeOrder}
          onClose={() => setActiveOrder(null)}
          onStatusChange={async (status) => {
            await updateOrderStatus(activeOrder.id, status);
            setActiveOrder(prev => prev ? { ...prev, status } : null);
          }}
        />
      )}
    </div>
  );
}
