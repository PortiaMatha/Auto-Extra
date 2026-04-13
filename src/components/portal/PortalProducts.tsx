import React, { useState } from 'react';
import './PortalProducts.css';

type ProductStatus = 'Active' | 'Inactive';

type PortalProduct = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: ProductStatus;
  image: string;
};

const mockProducts: PortalProduct[] = [
  { id: 1, name: 'Car Cover for Toyota Hilux', category: 'Exterior', price: 520, stock: 15, status: 'Active', image: '/Products/car-cover.jpg' },
  { id: 2, name: 'Premium Leather Seat Cover Set', category: 'Interior', price: 890, stock: 8, status: 'Active', image: '/Products/seat-cover-front.jpeg' },
  { id: 3, name: 'Steering Wheel Cover with Carbon Fiber', category: 'Interior', price: 340, stock: 22, status: 'Active', image: '/Products/seat-cover-detail.jpeg' },
  { id: 4, name: 'Premium Car Cover for Fortuner', category: 'Exterior', price: 750, stock: 5, status: 'Inactive', image: '/Products/white-car.jpg' },
  { id: 5, name: 'Custom Embroidered Seat Covers', category: 'Interior', price: 1200, stock: 11, status: 'Active', image: '/Products/seat-cover-back.jpg' },
  { id: 6, name: 'Universal Car Body Cover', category: 'Exterior', price: 480, stock: 30, status: 'Active', image: '/Products/car-cover.jpg' },
];

export function PortalProducts() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | ProductStatus>('All');
  const [selected, setSelected] = useState<number[]>([]);

  const visible = mockProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === visible.length ? [] : visible.map(p => p.id));

  return (
    <div className="ppage">
      {/* Header */}
      <div className="ppage__header">
        <div>
          <h1 className="ppage__title">Products</h1>
          <p className="ppage__sub">{mockProducts.length} products in your store</p>
        </div>
        <button className="btn-primary">+ Add Product</button>
      </div>

      {/* Toolbar */}
      <div className="ppage__toolbar">
        <div className="ppage__search">
          <span className="ppage__search-icon">🔍</span>
          <input
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ppage__search-input"
          />
        </div>
        <div className="ppage__filters">
          {(['All', 'Active', 'Inactive'] as const).map(f => (
            <button
              key={f}
              className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`}
              onClick={() => setFilter(f)}
            >{f}</button>
          ))}
        </div>
        <button className="btn-outline">⬇ Export</button>
      </div>

      {/* Table */}
      <div className="ppage__card">
        <table className="ptable">
          <thead>
            <tr>
              <th><input type="checkbox" onChange={toggleAll} checked={selected.length === visible.length && visible.length > 0} /></th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(p => (
              <tr key={p.id} className={selected.includes(p.id) ? 'ptable__row--selected' : ''}>
                <td><input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                <td>
                  <div className="ptable__product">
                    <img src={p.image} alt={p.name} className="ptable__thumb" />
                    <span className="ptable__name">{p.name}</span>
                  </div>
                </td>
                <td><span className="ptable__cat">{p.category}</span></td>
                <td className="ptable__price">R{p.price.toLocaleString()}.00</td>
                <td>
                  <span className={`stock-pill${p.stock <= 5 ? ' stock-pill--low' : ''}`}>
                    {p.stock} units
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-badge--${p.status.toLowerCase()}`}>{p.status}</span>
                </td>
                <td>
                  <div className="ptable__actions">
                    <button className="action-btn" title="Edit">✏️</button>
                    <button className="action-btn action-btn--danger" title="Delete">🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="ppage__empty">No products match your search.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="ppage__pagination">
        <span className="ppage__pag-info">Showing {visible.length} of {mockProducts.length} products</span>
        <div className="ppage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn">2</button>
          <button className="pag-btn">Next →</button>
        </div>
      </div>
    </div>
  );
}
