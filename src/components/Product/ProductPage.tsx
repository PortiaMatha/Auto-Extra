// src/components/Product/ProductPage.tsx
import React, { useEffect, useState } from "react";
import "./ProductPage.css";
import { useParams, Link } from "react-router-dom";
import { getProductBySlug } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

type ProductPageParams = {
  slug?: string;
};

export function ProductPage() {
  const { slug } = useParams<ProductPageParams>();
  const product = slug ? getProductBySlug(slug) : undefined;

  // ---- Hooks: must always be at the top, no early return before these ----
  const { addItem } = useCart();
  const { addItem: addToWishlist, hasItem: isWishlisted } = useWishlist();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedMaterial, setSelectedMaterial] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [customBuild, setCustomBuild] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Whenever the product changes (or first loads), reset state based on it
  useEffect(() => {
    if (!product) return;

    setSelectedImageIndex(0);
    setSelectedMaterial(product.materialOptions[0] ?? "");
    setSelectedSize(null);
    setQuantity(1);
    setCustomBuild(false);
  }, [product]);
  // ------------------------------------------------------------------------

  // If no product found, show a simple message
  if (!product) {
    return (
      <div className="product-page">
        <p>Product not found.</p>
        <p>
          <Link to="/">← Back to home</Link>
        </p>
      </div>
    );
  }

  const selectedImage =
    product.images[selectedImageIndex] || product.images[0];

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const next = prev + delta;
      return next < 1 ? 1 : next;
    });
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  const formatZAR = (value: number) =>
    new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(value);

  const price = formatZAR(product.basePrice);
  const shippingFee = formatZAR(product.shippingFee);
  const total = formatZAR(product.basePrice * quantity + product.shippingFee);

  return (
    <div className="product-page">
      {/* Breadcrumbs */}
      <nav className="product-breadcrumbs">
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/interior">{product.category}</Link>
        <span>›</span>
        <span>{product.title}</span>
      </nav>

      <div className="product-main">
        {/* LEFT: gallery */}
        <div className="product-gallery">
          <div className="product-gallery__main">
            <img src={selectedImage} alt={product.title} />
          </div>

          <div className="product-gallery__thumbs">
            {product.images.map((img, index) => (
              <button
                key={img}
                type="button"
                className={
                  index === selectedImageIndex
                    ? "product-thumb product-thumb--active"
                    : "product-thumb"
                }
                onClick={() => setSelectedImageIndex(index)}
              >
                <img src={img} alt={`${product.title} view ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: product info */}
        <div className="product-info">
          <h1 className="product-info__title">{product.title}</h1>
          <p className="product-info__brand">
            Brand: <strong>{product.brand}</strong>
          </p>

          {/* Rating */}
          <div className="product-rating">
            <span className="product-rating__stars">★★★★☆</span>
            <span className="product-rating__text">
              {product.averageRating.toFixed(1)} ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="product-price">
            <span className="product-price__label">Price:</span>
            <span className="product-price__value">{price}</span>
          </div>

          {/* Material */}
          <div className="product-field">
            <span className="product-field__label">Material:</span>
            <div className="product-options">
              {product.materialOptions.map((mat) => (
                <button
                  key={mat}
                  type="button"
                  className={
                    mat === selectedMaterial
                      ? "product-option product-option--active"
                      : "product-option"
                  }
                  onClick={() => setSelectedMaterial(mat)}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="product-field">
            <span className="product-field__label">Size:</span>
            <div className="product-options">
              {product.sizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    size === selectedSize
                      ? "product-option product-option--active"
                      : "product-option"
                  }
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity + shipping + total */}
          <div className="product-purchase">
            <div className="product-quantity">
              <span className="product-field__label">Quantity:</span>
              <div className="product-quantity__control">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(-1)}
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="product-shipping">
              <p className="product-shipping__line">
                Shipping fee: <strong>{shippingFee}</strong>
              </p>
              <p className="product-shipping__line">
                Estimated total: <strong>{total}</strong>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="product-actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
            <button
              type="button"
              className={`btn btn--ghost${isWishlisted(product.id) ? " btn--wishlisted" : ""}`}
              onClick={() => addToWishlist(product)}
            >
              {isWishlisted(product.id) ? "♥ Saved to Wishlist" : "♡ Add to Wishlist"}
            </button>
          </div>

          {/* Description */}
          <div className="product-short-desc">
            <h2>Product description</h2>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="product-reviews">
        <div className="product-reviews__header">
          <h2>Customer reviews</h2>
          <span>
            {product.averageRating.toFixed(1)} / 5 · {product.reviewCount}{" "}
            reviews
          </span>
        </div>

        {reviewSubmitted ? (
          <p className="product-review-success">✓ Thank you! Your review has been submitted.</p>
        ) : (
          <form
            className="product-review-form"
            onSubmit={(e) => { e.preventDefault(); setReviewSubmitted(true); }}
          >
            <div className="product-review-form__row">
              <label>
                Rating:
                <select defaultValue="5">
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                </select>
              </label>
            </div>
            <div className="product-review-form__row">
              <label>
                Your review:
                <textarea rows={3} placeholder="Share your experience..." />
              </label>
            </div>
            <button type="submit" className="btn btn--small">Submit review</button>
          </form>
        )}
      </section>

      {/* Custom built section */}
      <section className="product-custom">
        <h2>Custom built option (optional)</h2>
        <p>
          Want this cover custom printed with your logo or artwork? Turn on
          custom build and we’ll link this product to your custom builder
          configuration.
        </p>

        <label className="product-custom__toggle">
          <input
            type="checkbox"
            checked={customBuild}
            onChange={(e) => setCustomBuild(e.target.checked)}
          />
          <span>Yes, I want a custom-built version of this cover.</span>
        </label>

        {customBuild && (
          <div className="product-custom__note">
            <p>
              After checkout, you’ll be able to upload your artwork and choose
              placement using the custom builder.
            </p>
            <p>
              You can also go to the{" "}
              <Link to="/builder">custom builder page</Link> now if you’d like
              to preview your design.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
