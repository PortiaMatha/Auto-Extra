import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ShopPage.css';
import { products, ProductCategory, MATERIAL_OPTIONS, COLOR_OPTIONS } from '../../data/products';
import { ProductCard } from '../shared/ProductCard';

type Filter = 'all' | ProductCategory;
type Sort   = 'default' | 'price-asc' | 'price-desc' | 'rating';

const CATEGORY_FILTERS: { value: Filter; label: string }[] = [
  { value: 'all',      label: 'All Products' },
  { value: 'interior', label: 'Interior Covers' },
  { value: 'exterior', label: 'Exterior Covers' },
  { value: 'custom',   label: 'Custom Builder' },
];

const SORTS: { value: Sort; label: string }[] = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'rating',     label: 'Top Rated' },
];

const allBrands = Array.from(new Set(products.map(p => p.brand)));
const globalMin = Math.min(...products.map(p => p.basePrice));
const globalMax = Math.max(...products.map(p => p.basePrice));

const formatZAR = (v: number) =>
  new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(v);

export function ShopPage() {
  const [filter,          setFilter]          = useState<Filter>('all');
  const [sort,            setSort]            = useState<Sort>('default');
  const [search,          setSearch]          = useState('');
  const [selectedBrand,   setSelectedBrand]   = useState<string | null>(null);
  const [selectedMaterial,setSelectedMaterial] = useState<string | null>(null);
  const [selectedColors,  setSelectedColors]  = useState<string[]>([]);
  const [minPrice,        setMinPrice]        = useState<string>('');
  const [maxPrice,        setMaxPrice]        = useState<string>('');

  const min = minPrice === '' ? globalMin : Number(minPrice);
  const max = maxPrice === '' ? globalMax : Number(maxPrice);

  const toggleColor = (color: string) =>
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );

  let visible = useMemo(() => {
    return products.filter(p => {
      const matchCat      = filter === 'all' || p.category === filter;
      const matchSearch   = p.title.toLowerCase().includes(search.toLowerCase());
      const matchBrand    = !selectedBrand || p.brand === selectedBrand;
      const matchPrice    = p.basePrice >= min && p.basePrice <= max;
      const matchMaterial = !selectedMaterial || p.materialOptions.includes(selectedMaterial);
      const matchColor    = selectedColors.length === 0 || selectedColors.some(c => p.colors.includes(c));
      return matchCat && matchSearch && matchBrand && matchPrice && matchMaterial && matchColor;
    });
  }, [filter, search, selectedBrand, min, max, selectedMaterial, selectedColors]);

  if (sort === 'price-asc')  visible = [...visible].sort((a, b) => a.basePrice - b.basePrice);
  if (sort === 'price-desc') visible = [...visible].sort((a, b) => b.basePrice - a.basePrice);
  if (sort === 'rating')     visible = [...visible].sort((a, b) => b.averageRating - a.averageRating);

  const clearAll = () => {
    setFilter('all');
    setSearch('');
    setSelectedBrand(null);
    setSelectedMaterial(null);
    setSelectedColors([]);
    setMinPrice('');
    setMaxPrice('');
  };

  const hasActiveFilters =
    filter !== 'all' || selectedBrand || selectedMaterial ||
    selectedColors.length > 0 || minPrice !== '' || maxPrice !== '';

  return (
    <div className="shop-page">
      {/* Breadcrumb */}
      <div className="shop-breadcrumb">
        <Link to="/">Home</Link> / <span>Shop</span>
      </div>

      {/* Hero banner */}
      <section className="shop-hero">
        <div className="shop-hero__text">
          <p className="shop-hero__eyebrow">Browse our full range</p>
          <h1 className="shop-hero__title">Shop All Products</h1>
          <p className="shop-hero__sub">
            Premium seat covers, exterior covers and custom-built sets for every vehicle.
          </p>
        </div>
        <div className="shop-hero__search">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="shop-search"
          />
          <button className="shop-search-btn">SEARCH</button>
        </div>
      </section>

      {/* Body: sidebar + main */}
      <div className="shop-body">

        {/* ── SIDEBAR ── */}
        <aside className="shop-sidebar">

          {/* Category */}
          <div className="shop-sidebar__section">
            <h3 className="shop-sidebar__title">Shop by category</h3>
            <ul className="shop-sidebar__list">
              {CATEGORY_FILTERS.map(f => (
                <li key={f.value}>
                  <button
                    className={`shop-sidebar__btn${filter === f.value && !selectedBrand ? ' shop-sidebar__btn--active' : ''}`}
                    onClick={() => { setFilter(f.value); setSelectedBrand(null); }}
                  >
                    <span>{f.label}</span>
                    <span className="shop-sidebar__count">
                      {f.value === 'all'
                        ? products.length
                        : products.filter(p => p.category === f.value).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand */}
          <div className="shop-sidebar__section">
            <h4 className="shop-sidebar__subtitle">Popular brands</h4>
            <ul className="shop-sidebar__list">
              {allBrands.map(brand => (
                <li key={brand}>
                  <button
                    className={`shop-sidebar__btn${selectedBrand === brand ? ' shop-sidebar__btn--active' : ''}`}
                    onClick={() => setSelectedBrand(prev => prev === brand ? null : brand)}
                  >
                    <span>{brand}</span>
                    <span className="shop-sidebar__count">
                      {products.filter(p => p.brand === brand).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Material */}
          <div className="shop-sidebar__section">
            <h4 className="shop-sidebar__subtitle">Material</h4>
            <ul className="shop-sidebar__list">
              {MATERIAL_OPTIONS.map(mat => (
                <li key={mat}>
                  <button
                    className={`shop-sidebar__btn${selectedMaterial === mat ? ' shop-sidebar__btn--active' : ''}`}
                    onClick={() => setSelectedMaterial(prev => prev === mat ? null : mat)}
                  >
                    <span>{mat}</span>
                    <span className="shop-sidebar__count">
                      {products.filter(p => p.materialOptions.includes(mat)).length}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Color */}
          <div className="shop-sidebar__section">
            <h4 className="shop-sidebar__subtitle">Color</h4>
            <div className="shop-color-swatches">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.name}
                  title={c.name}
                  className={`shop-color-swatch${selectedColors.includes(c.name) ? ' shop-color-swatch--active' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => toggleColor(c.name)}
                  aria-label={c.name}
                />
              ))}
            </div>
            {selectedColors.length > 0 && (
              <p className="shop-color-selected">
                {selectedColors.join(', ')}
                <button className="shop-color-clear" onClick={() => setSelectedColors([])}>✕</button>
              </p>
            )}
          </div>

          {/* Price range */}
          <div className="shop-sidebar__section">
            <h4 className="shop-sidebar__subtitle">Price range</h4>
            <div className="shop-price-range">
              <div className="shop-price-range__row">
                <label className="shop-price-range__label">Min</label>
                <div className="shop-price-range__input-wrap">
                  <span className="shop-price-range__prefix">R</span>
                  <input
                    type="number"
                    className="shop-price-range__input"
                    placeholder={String(globalMin)}
                    value={minPrice}
                    min={globalMin}
                    max={globalMax}
                    onChange={e => setMinPrice(e.target.value)}
                  />
                </div>
              </div>
              <div className="shop-price-range__divider">—</div>
              <div className="shop-price-range__row">
                <label className="shop-price-range__label">Max</label>
                <div className="shop-price-range__input-wrap">
                  <span className="shop-price-range__prefix">R</span>
                  <input
                    type="number"
                    className="shop-price-range__input"
                    placeholder={String(globalMax)}
                    value={maxPrice}
                    min={globalMin}
                    max={globalMax}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <p className="shop-price-range__hint">
              Range: {formatZAR(globalMin)} – {formatZAR(globalMax)}
            </p>
          </div>

          {/* Clear */}
          {hasActiveFilters && (
            <button className="shop-sidebar__clear" onClick={clearAll}>
              ✕ Clear all filters
            </button>
          )}
        </aside>

        {/* ── MAIN ── */}
        <div className="shop-main">
          {/* Toolbar */}
          <div className="shop-toolbar">
            <p className="shop-results">
              Showing <strong>{visible.length}</strong> product{visible.length !== 1 ? 's' : ''}
              {selectedBrand ? ` — ${selectedBrand}` : ''}
            </p>
            <div className="shop-sort">
              <label className="shop-sort-label">Sort by:</label>
              <select
                className="shop-sort-select"
                value={sort}
                onChange={e => setSort(e.target.value as Sort)}
              >
                {SORTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid */}
          {visible.length > 0 ? (
            <div className="shop-grid">
              {visible.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="shop-empty">
              <p>No products match your filters.</p>
              <button onClick={clearAll} className="shop-reset-btn">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
