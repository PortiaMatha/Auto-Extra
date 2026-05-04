import { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import { CarBuilderForm } from "../car/CarBuilderForm";
import { MATERIAL_OPTIONS, COLOR_OPTIONS, BRAND_LOGOS } from "../../data/products";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductsContext";

type FeaturedTab = "all" | "interior" | "exterior" | "custom";

interface HeroSlide {
  tagline: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryCategory: FeaturedTab;
  image: string;
  imageAlt: string;
}

const HOME_FAQS = [
  {
    q: "Where can I find product information?",
    a: "All product details — materials, dimensions, compatibility and care instructions — are listed on each product page. You can also use our Custom Builder to preview covers on your specific vehicle model before ordering.",
  },
  {
    q: "What are your terms and conditions?",
    a: "Our full terms and conditions cover ordering, payment, delivery and returns. Standard products can be returned within 14 days of delivery in original condition. Custom-printed orders are non-refundable unless there is a manufacturing defect.",
  },
  {
    q: "Can I buy directly from the factory?",
    a: "Yes — we sell directly to the public, fleet operators and corporate clients. Volume discounts apply for orders of 10 units or more. Visit our Become a Supplier page or contact us to discuss wholesale pricing.",
  },
  {
    q: "What sizes of fitment do you accept?",
    a: "We offer universal-fit covers for sedans, hatchbacks, SUVs and bakkies, as well as custom-fit options. Use our Custom Builder to enter your exact make, model and trim for a precise fit recommendation.",
  },
  {
    q: "When do I receive my order?",
    a: "Standard delivery takes 3–5 business days nationwide. Express delivery (1–2 business days) is available at checkout. Custom-printed and logo orders require an additional 5–7 business days for production before dispatch.",
  },
];

const HERO_SLIDES: HeroSlide[] = [
  {
    tagline: "BUY INTERIOR & EXTERIOR COVERS",
    titleBefore: "Create Your ",
    titleHighlight: "Motor Style",
    titleAfter: " Bundle",
    subtitle:
      "Mix interior covers, exterior covers and custom-built sets for your exact car model.",
    primaryLabel: "Shop Now",
    secondaryLabel: "Build Custom Cover",
    secondaryCategory: "custom",
    image: "/yellow-car-cover.png",
    imageAlt: "Custom logo car cover",
  },
  {
    tagline: "INTERIOR PROTECTION",
    titleBefore: "Premium ",
    titleHighlight: "Interior Covers",
    titleAfter: " for Every Car",
    subtitle:
      "Tailored seat covers, steering wheel wraps and trim sets designed to fit your exact model.",
    primaryLabel: "Shop Interior",
    secondaryLabel: "View Range",
    secondaryCategory: "interior",
    image: "/interior-covers.png",
    imageAlt: "Red car cover",
  },
  {
    tagline: "EXTERIOR PROTECTION",
    titleBefore: "Full ",
    titleHighlight: "Exterior Covers",
    titleAfter: " Built to Last",
    subtitle:
      "From full car covers to wheel covers and window shades — weather-proof protection for any vehicle.",
    primaryLabel: "Shop Exterior",
    secondaryLabel: "Start Building",
    secondaryCategory: "exterior",
    image: "/exteriorcta.png",
    imageAlt: "Yellow car cover",
  },
];

const formatZAR = (value: number) =>
  new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(value);

const categoryItems: { value: FeaturedTab; label: string }[] = [
  { value: "all",      label: "All products" },
  { value: "interior", label: "Interior covers" },
  { value: "exterior", label: "Exterior covers" },
  { value: "custom",   label: "Custom builder" },
];

export function HomePage() {
  const { addItem } = useCart();
  const { products: allContextProducts } = useProducts();
  const products = allContextProducts.filter(p => p.status === 'Active');
  const [featuredTab,      setFeaturedTab]      = useState<FeaturedTab>("all");
  const [selectedBrand,    setSelectedBrand]    = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedColors,   setSelectedColors]   = useState<string[]>([]);
  const [heroSlide,        setHeroSlide]        = useState(0);
  const [heroPaused,       setHeroPaused]       = useState(false);
  const [openHomeFaq,      setOpenHomeFaq]      = useState<number>(0);

  const sliderRef   = useRef<HTMLDivElement | null>(null);
  const featuredRef = useRef<HTMLElement | null>(null);

  /* ── hero slider ── */
  const prevHeroSlide = () =>
    setHeroSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  const nextHeroSlide = () =>
    setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
  const slide = HERO_SLIDES[heroSlide];

  useEffect(() => {
    if (heroPaused) return;
    const id = setInterval(() => {
      setHeroSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(id);
  }, [heroPaused]);

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


  return (
    <div className="home">
      {/* ── HERO ── */}
      <section className="home-hero">
        <div
          className="hero-main"
          onMouseEnter={() => setHeroPaused(true)}
          onMouseLeave={() => setHeroPaused(false)}
        >
          <div className="hero-main__text hero-main__slide-anim" key={`text-${heroSlide}`}>
            <p className="hero-main__tagline">{slide.tagline}</p>
            <h1 className="hero-main__title">
              {slide.titleBefore}<span>{slide.titleHighlight}</span>{slide.titleAfter}
            </h1>
            <p className="hero-main__subtitle">{slide.subtitle}</p>
            <div className="hero-main__actions">
              <Link to="/shop" className="btn btn--primary">
                {slide.primaryLabel}
              </Link>
              <button
                className="btn btn--ghost"
                onClick={() => handleCategoryClick(slide.secondaryCategory)}
              >
                {slide.secondaryLabel}
              </button>
            </div>
            <div className="hero-main__arrows">
              <button
                className="hero-main__arrow"
                onClick={prevHeroSlide}
                aria-label="Previous slide"
              >
                &#8592;
              </button>
              <button
                className="hero-main__arrow"
                onClick={nextHeroSlide}
                aria-label="Next slide"
              >
                &#8594;
              </button>
            </div>
          </div>
          <div className="hero-main__image hero-main__slide-anim" key={`img-${heroSlide}`}>
            <div className="hero-main__image-placeholder">
               <img src={slide.image} alt={slide.imageAlt} />
            </div>
           
          </div>
        </div>

        <div className="hero-promos">
          <article className="promo-card promo-card--yellow">
            <div className="col-6">
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
            </div>
            <div className="col-6">
            <img src="/interior-ctaa.png" alt="Interior accessories" />
            </div>
          </article>

          <article className="promo-card promo-card--white">
            <div className="col-4">
            <p className="promo-card__label">Latest</p>
            <h3 className="promo-card__title">Exterior Covers</h3>
            <p className="promo-card__text">
              From full car covers, wheel covers to window Shades.
            </p>
            <button
              className="promo-card__button"
              onClick={() => handleCategoryClick("custom")}
            >
              Start building
            </button>
            </div>
            <div className="col-8">
              <img src="/exterior-cta.png" alt="Exterior car covers" />
            </div>
          </article>
        </div>
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

               {/* Brands */}
          <div className="side-brands">
            <h4 className="home-sidebar__subtitle">Brands</h4>
            <div className="brand-logo-grid">
              {BRAND_LOGOS.map(({ name, logo }) => (
                <button
                  key={name}
                  className={`brand-logo-btn${selectedBrand === name ? " brand-logo-btn--active" : ""}`}
                  onClick={() => handleBrandClick(name)}
                  title={name}
                >
                  <img src={logo} alt={name} className="brand-logo-btn__img" />
                  <span className="brand-logo-btn__name">{name}</span>
                </button>
              ))}
            </div>
            {selectedBrand && (
              <button
                className="sidebar-clear-btn"
                onClick={() => setSelectedBrand(null)}
              >
                ✕ Clear brand filter
              </button>
            )}
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
                      <article key={product.id} className="product-card product-card--slider">
                        {/* Image */}
                        <div className="product-card__image-wrapper">
                          <Link to={`/product/${product.slug}`} className="product-card__image-link">
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="product-card__image-img"
                            />
                          </Link>
                          <div className="product-card__badges">
                            <span className="badge badge--sale"></span>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="product-card__body">
                          <span className="product-card__category">
                            {product.category === "interior" && "Interior cover"}
                            {product.category === "exterior" && "Exterior cover"}
                            {product.category === "custom"   && "Custom builder"}
                          </span>
                          <h3 className="product-card__title">
                            <Link to={`/product/${product.slug}`}>{product.title}</Link>
                          </h3>
                          <p className="product-card__desc">{product.description}</p>
                          <div className="product-card__prices">
                            <span className="product-card__price product-card__price--new">
                              {formatZAR(product.basePrice)}
                            </span>
                            <span className="product-card__price product-card__price--old">
                              {formatZAR(oldPrice)}
                            </span>
                          </div>
                        </div>

                        {/* Footer buttons */}
                        <div className="product-card__footer">
                          <button type="button" className="product-card__btn product-card__btn--cart" onClick={() => addItem(product)}>
                            Add to Cart
                          </button>
                          <Link to={`/product/${product.slug}`} className="product-card__btn product-card__btn--view">
                            View
                          </Link>
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

         

        </main>
      </div>

      {/* ── CUSTOM BUILDER (full width) ── */}
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

      {/* ── HOME FAQ ── */}
      <section className="home-faq">
        {/* Left column */}
        <div className="home-faq__left">
          <div className="home-faq__promo-card">
            <div className="home-faq-img">
            
              <p className="home-faq__promo-eyebrow">Premium Quality</p>
            <h3 className="home-faq__promo-title">We're Your Cover Solution</h3>
            <p className="home-faq__promo-text">
              Custom-fit seat covers, exterior body covers and logo-printed sets — designed for every South African road.
            </p>
            <Link to="/builder" className="home-faq__promo-btn">Build Now</Link>
              <div className="overlayer"></div>
            </div>
            <div className="home-faq__contact-card">
            <span className="home-faq__contact-icon">📞</span>
            <div>
              <p className="home-faq__contact-label">Contact Us</p>
              <a href="tel:+27791234567" className="home-faq__contact-number">+27 (0)11 887 4436</a>
              <a href="mailto:hello@motorcovers.co.za" className="home-faq__contact-email">hello@motorcovers.co.za</a>
            </div>
          </div>
          </div>
          </div>

        {/* Right column — FAQ accordion */}
        <div className="home-faq__right">
          <div className="home-faq__heading">
            <span className="home-faq__tag">FAQ</span>
            <h2 className="home-faq__title">Frequently Asked Questions</h2>
          </div>

          <div className="home-faq__list">
            {HOME_FAQS.map((item, i) => {
              const isOpen = openHomeFaq === i;
              return (
                <div key={i} className={`home-faq__item${isOpen ? " home-faq__item--open" : ""}`}>
                  <button
                    className="home-faq__question"
                    onClick={() => setOpenHomeFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span>{item.q}</span>
                    <span className="home-faq__icon" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <div className="home-faq__answer">
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
