import { Link } from 'react-router-dom';
import { Product } from '../../data/products';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const formatZAR = (v: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v);

type Props = { product: Product };

export function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const oldPrice = Math.round(product.basePrice * 1.2);

  return (
    <article className="pc">
      {/* Image */}
      <div className="pc__img-wrap">
        <Link to={`/product/${product.slug}`}>
          <img src={product.images[0]} alt={product.title} className="pc__img" />
        </Link>
        <span className="pc__badge">Sale</span>
      </div>

      {/* Body */}
      <div className="pc__body">
        <span className="pc__cat">
          {product.category === 'interior' && 'Interior Cover'}
          {product.category === 'exterior' && 'Exterior Cover'}
          {product.category === 'custom'   && 'Custom Builder'}
        </span>

        <h3 className="pc__title">
          <Link to={`/product/${product.slug}`}>{product.title}</Link>
        </h3>

        <p className="pc__desc">{product.description}</p>

        <div className="pc__prices">
          <span className="pc__price pc__price--new">{formatZAR(product.basePrice)}</span>
          <span className="pc__price pc__price--old">{formatZAR(oldPrice)}</span>
        </div>
      </div>

      {/* Footer buttons */}
      <div className="pc__footer">
        <button className="pc__btn pc__btn--cart" type="button" onClick={() => addItem(product)}>
          Add to Cart
        </button>
        <Link to={`/product/${product.slug}`} className="pc__btn pc__btn--view">
          View
        </Link>
      </div>
    </article>
  );
}
