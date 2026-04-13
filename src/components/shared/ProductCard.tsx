import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/products';
import './ProductCard.css';

const formatZAR = (v: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(v);

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const oldPrice = Math.round(product.basePrice * 1.2);

  return (
    <article className="pc">
      <div className="pc__img-wrap">
        <Link to={`/product/${product.slug}`}>
          <img src={product.images[0]} alt={product.title} className="pc__img" />
        </Link>
        <span className="pc__badge">Sale</span>
        <div className="pc__actions">
          <button className="pc__action-btn" title="Add to cart">🛒</button>
          <button className="pc__action-btn" title="Quick view">🔍</button>
        </div>
      </div>
      <div className="pc__body">
        <span className="pc__cat">
          {product.category === 'interior' && 'Interior Cover'}
          {product.category === 'exterior' && 'Exterior Cover'}
          {product.category === 'custom'   && 'Custom Builder'}
        </span>
        <h3 className="pc__title">
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>
        <div className="pc__prices">
          <span className="pc__price pc__price--new">{formatZAR(product.basePrice)}</span>
          <span className="pc__price pc__price--old">{formatZAR(oldPrice)}</span>
        </div>
        <Link to={`/product/${product.slug}`} className="pc__cta">View Product →</Link>
      </div>
    </article>
  );
}
