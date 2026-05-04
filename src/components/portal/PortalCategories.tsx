import { useState } from 'react';
import './PortalOrders.css';
import './PortalCategories.css';

type Category = { id: number; name: string; slug: string; products: number; status: 'Active' | 'Draft' };

const CATS: Category[] = [
  { id: 1, name: 'Interior Covers',  slug: 'interior-covers',  products: 24, status: 'Active' },
  { id: 2, name: 'Exterior Covers',  slug: 'exterior-covers',  products: 18, status: 'Active' },
  { id: 3, name: 'Custom Builder',   slug: 'custom-builder',   products: 12, status: 'Active' },
  { id: 4, name: 'Accessories',      slug: 'accessories',      products: 8,  status: 'Draft'  },
  { id: 5, name: 'Steering Covers',  slug: 'steering-covers',  products: 6,  status: 'Active' },
  { id: 6, name: 'Wheel Covers',     slug: 'wheel-covers',     products: 9,  status: 'Draft'  },
];

export function PortalCategories() {
  const [cats, setCats] = useState(CATS);

  const toggle = (id: number) =>
    setCats(prev =>
      prev.map(c => c.id === id ? { ...c, status: c.status === 'Active' ? 'Draft' : 'Active' } : c)
    );

  return (
    <div className="opage">
      <div className="opage__header">
        <div>
          <h1 className="opage__title">Categories</h1>
          <p className="opage__sub">{cats.length} categories</p>
        </div>
        <div className="opage__header-actions">
          <button className="btn-outline">⬇ Export</button>
          <button className="btn-primary">+ New Category</button>
        </div>
      </div>

      <div className="ppage__card">
        <table className="ptable">
          <thead>
            <tr>
              <th>#</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map(c => (
              <tr key={c.id}>
                <td style={{ color: '#9ca3af', fontSize: 13 }}>{c.id}</td>
                <td style={{ fontWeight: 600, color: '#111827' }}>{c.name}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#6b7280' }}>{c.slug}</td>
                <td>
                  <span className="stock-pill">{c.products} products</span>
                </td>
                <td>
                  <span className={`status-badge status-badge--${c.status === 'Active' ? 'active' : 'inactive'}`}>
                    {c.status}
                  </span>
                </td>
                <td>
                  <div className="ptable__actions">
                    <button className="action-btn" title="Edit">✏️</button>
                    <button className="action-btn" title="Toggle status" onClick={() => toggle(c.id)}>
                      {c.status === 'Active' ? '🔒' : '✅'}
                    </button>
                    <button className="action-btn action-btn--danger" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="opage__pagination">
        <span className="opage__pag-info">Showing {cats.length} of {cats.length} categories</span>
        <div className="opage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn" disabled>Next →</button>
        </div>
      </div>
    </div>
  );
}
