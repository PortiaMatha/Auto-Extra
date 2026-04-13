import { useRef, useState } from "react";
import "./HomePage.css";
import { CarBuilderForm } from "../car/CarBuilderForm";
import { products, MATERIAL_OPTIONS, COLOR_OPTIONS } from "../../data/products";
import { Link } from "react-router-dom";

type FeaturedTab = "all" | "interior" | "exterior" | "custom";

const formatZAR = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(value);

/* Derive unique brands and per-category counts from the product data */
const allBrands = Array.from(new Set(products.map((p) => p.brand)));

const categoryItems: { value: FeaturedTab; label: string }[] = [
  { value: "all",      label: "All products" },
  { value: "interior", label: "Interior covers" },
  { value: "exterior", label: "Exterior covers" },
  { value: "custom",   label: "Custom builder" },
];

export function HomePage() {
  const [featuredTab,      setFeaturedTab]      = useState<FeaturedTab>("all");
  const [selectedBrand,    setSelectedBrand]    = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColors,   setSelectedColors]   = useState<string[]>([]);

  const sliderRef   = useRef<HTMLDivElement | null>(null);
  const featuredRef = useRef<HTMLElement | null>(null);

  /* ── helpers ── */
  const scrollToFeatured = () => {
    featuredRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollSlider = (direction: "left" | "right") => {
    const container = sliderRef.current;
    if (!container) return;
    container.scrollBy({
      left: direction === "left" ? -container.clientWidth * 0.8 : container.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  const handleCategoryClick = (cat: FeaturedTab) => {
    setFeaturedTab(cat);
    setSelectedBrand(null);
    scrollToFeatured();
  };

  const handleBrandClick = (brand: string) => {
    setSelectedBrand((prev) => (prev === brand ? null : brand));
    setFeaturedTab("all");
    scrollToFeatured();
  };

  const toggleColor = (color: string) =>
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );

  /* ── filtering ── */
  const filteredProducts = products.filter((p) => {
    const matchCat      = featuredTab === "all" || p.category === featuredTab;
    const matchBrand    = !selectedBrand    || p.brand === selectedBrand;
    const matchMaterial = !selectedMaterial || p.materialOptions.includes(selectedMaterial);
    const matchColor    = selectedColors.length === 0 || selectedColors.some((c) => p.colors.includes(c));
    return matchCat && matchBrand && matchMaterial && matchColor;
  });

  /* ── dynamic section label ── */
  const sectionLabel =
    featuredTab === "interior" ? "Interior covers"
    : featuredTab === "exterior" ? "Exterior covers"
    : featuredTab === "custom"   ? "Custom builder covers"
    : "Featured products";

  const sectionTitle = selectedBrand
    ? `${selectedBrand} products`
    : sectionLabel;

  /* ── counts ── */
  const countForCat = (cat: FeaturedTab) =>
    cat === "all"
      ? products.length
      : products.filter((p) => p.category === cat).length;

  const countForBrand = (brand: string) =>
    products.filter(
      (p) => p.brand === brand && (featuredTab === "all" || p.category === featuredTab)
    ).length;

  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="hero-main">
          <div className="hero-main__text">
            <p className="hero-main__tagline">BUY INTERIOR & EXTERIOR COVERS</p>
            <h1 className="hero-main__title">
              Create Your <span>Motor Style</span> Bundle
            </h1>
            <p className="hero-main__subtitle">
              Mix interior covers, exterior covers and custom-built sets for
              your exact car model.
            </p>
            <div className="hero-main__actions">
              <Link to="/shop" className="btn btn--primary">
                Shop Now
              </Link>
              <button className="btn btn--ghost" onClick={() => handleCategoryClick("custom")}>
                Build Custom Cover
              </button>
            </div>
          </div>
          <div className="hero-main__image">
            <div className="hero-main__image-placeholder">
              <img src="/Products/white-car.jpg" alt="white car" />
            </div>
          </div>
        </div>

        <div className="hero-promos">
          <article className="promo-card promo-card--yellow">
            <p className="promo-card__label">NEW</p>
            <h3 className="promo-card__title">Interior Covers</h3>
            <p className="promo-card__text">
              Fresh designs tailored to your seats, steering wheel and trims.
            </p>
            <button
              className="promo-card__button"
              onClick={() => handleCategoryClick("interior")}
            >
              View range
            </button>
          </article>

          <article className="promo-card promo-card--white">
            <p className="promo-card__label">BUILDER</p>
            <h3 className="promo-card__title">Custom Builder Covers</h3>
            <p className="promo-card__text">
              Upload your interior and preview covers before you buy.
            </p>
            <button
              className="promo-card__button"
              onClick={() => handleCategoryClick("custom")}
            >
              Start building
            </button>
          </article>
        </div>
      </section>

      {/* ── BELOW HERO ── */}
      <div className="home-content">
        {/* ── SIDEBAR ── */}
        <aside className="home-sidebar">

          {/* Shop by category */}
          <div className="side_category">
            <h3 className="home-sidebar__title">Shop by category</h3>
            <ul className="home-sidebar__list">
              {categoryItems.map((item) => (
                <li key={item.value}>
                  <button
                    className={`sidebar-filter-btn${
                      featuredTab === item.value && !selectedBrand
                        ? " sidebar-filter-btn--active"
                        : ""
                    }`}
                    onClick={() => handleCategoryClick(item.value)}
                  >
                    <span>{item.label}</span>
                    <span className="sidebar-filter-count">
                      {countForCat(item.value)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular brands */}
          <div className="side-brands">
            <h4 className="home-sidebar__subtitle">Popular brands</h4>
            <ul className="home-sidebar__list home-sidebar__list--small">
              {allBrands.map((brand) => (
                <li key={brand}>
                  <button
                    className={`sidebar-filter-btn${
                      selectedBrand === brand ? " sidebar-filter-btn--active" : ""
                    }`}
                    onClick={() => handleBrandClick(brand)}
                  >
                    <span>{brand}</span>
                    <span className="sidebar-filter-count">
                      {countForBrand(brand)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {selectedBrand && (
              <button
                className="sidebar-clear-btn"
                onClick={() => setSelectedBrand(null)}
              >
                ✕ Clear brand filter
              </button>
            )}
          </div>

          {/* Material */}
          <div className="side-brands">
            <h4 className="home-sidebar__subtitle">Material</h4>
            <ul className="home-sidebar__list home-sidebar__list--small">
              {MATERIAL_OPTIONS.map((mat) => (
                <li key={mat}>
                  <button
                    className={`sidebar-filter-btn${
                      selectedMaterial === mat ? " sidebar-filter-btn--active" : ""
                    }`}
                    onClick={() =>
                      setSelectedMaterial((prev) => (prev === mat ? null : mat))
                    }
                  >
                    <span>{mat}</span>
                    <span className="sidebar-filter-count">
                      {products.filter((p) => p.materialOptions.includes(mat)).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Color */}
          <div className="side-brands">
            <h4 className="home-sidebar__subtitle">Color</h4>
            <div className="sidebar-color-swatches">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.name}
                  title={c.name}
                  className={`sidebar-color-swatch${
                    selectedColors.includes(c.name) ? " sidebar-color-swatch--active" : ""
                  }`}
                  style={{ background: c.hex }}
                  onClick={() => toggleColor(c.name)}
                  aria-label={c.name}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="sidebar-color-selected">
                {selectedColors.join(", ")}
                <button
                  className="shop-color-clear"
                  onClick={() => setSelectedColors([])}
                >✕</button>
              </p>
            )}
          </div>

          {/* Promo */}
          <div className="home-sidebar__promo">
            <p className="home-sidebar__promo-label">Deal of the week</p>
            <p className="home-sidebar__promo-text">
              Up to <strong>30% OFF</strong> on premium cover sets.
            </p>
            <button
              className="home-sidebar__promo-btn"
              onClick={() => handleCategoryClick("interior")}
            >
              View offers
            </button>
          </div>
        </aside>

        {/* ── MAIN COLUMN ── */}
        <main className="home-main">

          {/* ── FEATURED PRODUCTS ── */}
          <section className="home-featured" id="interior" ref={featuredRef}>
            <header className="home-featured__header">
              <div>
                <h2 className="home-featured__title">{sectionTitle}</h2>
                <p className="home-featured__subtitle">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                  {selectedBrand ? ` for ${selectedBrand}` : ""}
                </p>
              </div>

              <div className="home_right_controls">
                <div className="home-featured__controls">
                  <button
                    type="button"
                    onClick={() => scrollSlider("left")}
                    aria-label="Previous products"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollSlider("right")}
                    aria-label="Next products"
                  >
                    ›
                  </button>
                </div>

                {/* Category tabs */}
                <div className="home-featured__tabs">
                  {categoryItems.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={
                        featuredTab === item.value && !selectedBrand
                          ? "home-featured__tab home-featured__tab--active"
                          : "home-featured__tab"
                      }
                      onClick={() => handleCategoryClick(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}

               
                  
                </div>
              </div>
            </header>

            {/* Product slider */}
            {filteredProducts.length > 0 ? (
              <div className="home-featured__slider-wrapper">
                <div className="home-featured__slider" ref={sliderRef}>
                  {filteredProducts.map((product) => {
                    const oldPrice = Math.round(product.basePrice * 1.2);
                    return (
                      <article
                        key={product.id}
                        className="product-card product-card--slider"
                      >
                        <div className="product-card__image-wrapper">
                          <Link
                            to={`/product/${product.slug}`}
                            className="product-card__image-link"
                          >
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="product-card__image-img"
                            />
                          </Link>
                          <div className="product-card__badges">
                            <span className="badge badge--sale">Sale</span>
                          </div>
                          <div className="product-card__actions">
                            <button type="button" className="product-card__action-btn" title="Add to cart">
                              🛒
                            </button>
                            <button type="button" className="product-card__action-btn" title="Quick view">
                              🔍
                            </button>
                          </div>
                        </div>

                        <div className="product-card__body">
                          <span className="product-card__category">
                            {product.category === "interior" && "Interior cover"}
                            {product.category === "exterior" && "Exterior cover"}
                            {product.category === "custom"   && "Custom builder"}
                          </span>
                          <span className="product-card__brand">{product.brand}</span>
                          <h3 className="product-card__title">
                            <Link to={`/product/${product.slug}`}>{product.title}</Link>
                          </h3>
                          <div className="product-card__prices">
                            <span className="product-card__price product-card__price--new">
                              {formatZAR(product.basePrice)}
                            </span>
                            <span className="product-card__price product-card__price--old">
                              {formatZAR(oldPrice)}
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="home-featured__empty">
                <p>No products found for the selected filter.</p>
                <button
                  className="btn btn--primary"
                  onClick={() => { setFeaturedTab("all"); setSelectedBrand(null); }}
                >
                  Clear filters
                </button>
              </div>
            )}
          </section>

          {/* ── CTA BANNER ── */}
          <section className="home-cta">
            <div className="home-cta__text">
              <p className="home-cta__eyebrow">BIG SALE COUNTDOWN</p>
              <h2 className="home-cta__title">
                Upgrade your interior <span>this weekend</span>
              </h2>
              <p className="home-cta__subtitle">
                Save on full interior cover sets with custom logo printing included.
              </p>
              <button
                className="btn btn--light home-cta__btn"
                onClick={() => handleCategoryClick("interior")}
              >
                Shop interior covers
              </button>
            </div>
            <div className="home-cta__badge">
              <span>UP TO</span>
              <strong>30% OFF</strong>
            </div>
          </section>

          {/* ── CUSTOM BUILDER ── */}
          <section className="home-builder" id="custom-builder">
            <div className="home-builder__header">
              <h2 className="home-builder__title">Custom builder covers</h2>
              <p className="home-builder__subtitle">
                Upload your interior, choose where to print your logo and preview
                the result before you order.
              </p>
            </div>
            <CarBuilderForm onChange={(value) => { console.log("Builder:", value); }} />
          </section>
        </main>
      </div>
    </div>
  );
}
