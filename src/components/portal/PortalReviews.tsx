import { useState } from 'react';
import './PortalOrders.css';
import './PortalReviews.css';

type ReviewStatus = 'Published' | 'Pending' | 'Flagged';

type Review = {
  id: number; customer: string; product: string; rating: number;
  comment: string; date: string; status: ReviewStatus;
};

const MOCK: Review[] = [
  { id: 1, customer: 'John Smith',    product: 'Premium Seat Cover Set',  rating: 5, comment: 'Absolutely love these! Perfect fit for my VW Golf.',       date: '18 Mar 2024', status: 'Published' },
  { id: 2, customer: 'Sarah Miller',  product: 'Exterior Car Cover',       rating: 4, comment: 'Great quality, fits snugly. Delivery was a bit slow.',      date: '16 Mar 2024', status: 'Published' },
  { id: 3, customer: 'Mike Roberts',  product: 'Steering Wheel Cover',     rating: 3, comment: 'Decent product but the colour was slightly off.',            date: '14 Mar 2024', status: 'Pending'   },
  { id: 4, customer: 'Lisa Khumalo',  product: 'Interior Cover Bundle',    rating: 5, comment: 'Top-notch quality! Will definitely order again.',            date: '12 Mar 2024', status: 'Published' },
  { id: 5, customer: 'David Botha',   product: 'Custom Logo Cover',        rating: 2, comment: 'Logo placement was wrong, had to return it.',               date: '10 Mar 2024', status: 'Flagged'   },
  { id: 6, customer: 'Emma Nkosi',    product: 'Wheel Cover Set',          rating: 5, comment: 'Beautiful covers, my car looks brand new!',                 date: '08 Mar 2024', status: 'Published' },
  { id: 7, customer: 'Thabo Dlamini', product: 'Premium Seat Cover Set',   rating: 4, comment: 'Good value for money. Easy to install.',                   date: '06 Mar 2024', status: 'Published' },
];

const TABS: Array<'All' | ReviewStatus> = ['All', 'Published', 'Pending', 'Flagged'];

export function PortalReviews() {
  const [tab, setTab]       = useState<'All' | ReviewStatus>('All');
  const [search, setSearch] = useState('');

  const visible = MOCK.filter(r => {
    const matchTab    = tab === 'All' || r.status === tab;
    const matchSearch = r.customer.toLowerCase().includes(search.toLowerCase()) ||
                        r.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const avgRating = (MOCK.reduce((s, r) => s + r.rating, 0) / MOCK.length).toFixed(1);

  return (
    <div className="opage">
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Reviews</h1>
          <p className="opage__sub">{MOCK.length} reviews · Avg rating {avgRating} ★</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline">⬇ Export</button>
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
          <input placeholder="Search by customer or product..." value={search}
            onChange={e => setSearch(e.target.value)} className="opage__search-input" />
        </div>
      </div>

      <div className="ppage__card">
        {visible.map(r => (
          <div key={r.id} className="review-row">
            <div className="review-row__left">
              <div className="otable__avatar">{r.customer.charAt(0)}</div>
            </div>
            <div className="review-row__body">
              <div className="review-row__top">
                <span className="review-row__customer">{r.customer}</span>
                <span className="review-row__stars">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                <span className="review-row__date">{r.date}</span>
                <span className={`ostatus ostatus--${r.status === 'Published' ? 'delivered' : r.status === 'Pending' ? 'pending' : 'cancelled'}`}>
                  {r.status}
                </span>
              </div>
              <div className="review-row__product">{r.product}</div>
              <p className="review-row__comment">{r.comment}</p>
            </div>
            <div className="review-row__actions">
              {r.status === 'Pending' && <button className="btn-primary" style={{ fontSize:12, padding:'6px 12px' }}>Approve</button>}
              {r.status === 'Flagged' && <button className="btn-outline" style={{ fontSize:12, padding:'6px 12px' }}>Review</button>}
              <button className="action-btn action-btn--danger">🗑</button>
            </div>
          </div>
        ))}
        {visible.length === 0 && <div className="opage__empty">No reviews found.</div>}
      </div>

      <div className="opage__pagination">
        <span className="opage__pag-info">Showing {visible.length} of {MOCK.length} reviews</span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn" disabled>Next →</button>
        </div>
      </div>
    </div>
  );
}
