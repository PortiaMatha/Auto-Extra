import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import { products, BRAND_LOGOS } from '../../../data/products';
import { carOptions } from '../../../data/carOptions';

type Category = 'all' | 'interior' | 'exterior' | 'custom';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all',      label: 'All Covers' },
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'custom',   label: 'Custom' },
];

/* Build a merged list: every logo brand, enriched with carOptions models where available */
const brandList = BRAND_LOGOS.map(({ name, logo }) => {
  const carBrand = carOptions.find(b => b.name === name);
  return { name, logo, models: carBrand?.models ?? [] };
});

function countForCarBrand(carBrand: string, category: Category): number {
  const pool = category === 'all' ? products : products.filter(p => p.category === category);
  const universal = pool.filter(p => p.brand === 'Universal' || p.brand === 'AutoExtras').length;
  const specific  = pool.filter(p => p.brand === carBrand).length;
  return universal + specific;
}

function countForCategory(category: Category): number {
  return category === 'all' ? products.length : products.filter(p => p.category === category).length;
}

export function SearchBar() {
  const navigate = useNavigate();

  const [isOpen,         setIsOpen]         = useState(false);
  const [category,       setCategory]       = useState<Category>('all');
  const [inputValue,     setInputValue]     = useState('');
  const [expandedBrand,  setExpandedBrand]  = useState<string | null>(null);
  const [expandedModel,  setExpandedModel]  = useState<string | null>(null);
  const [selectedBrand,  setSelectedBrand]  = useState<string | null>(null);
  const [selectedModel,  setSelectedModel]  = useState<string | null>(null);
  const [selectedVersion,setSelectedVersion]= useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  /* Computed search count */
  const totalCount = selectedBrand
    ? countForCarBrand(selectedBrand, category)
    : countForCategory(category);

  /* Filtered brand list (text filter while typing) */
  const filteredBrands = inputValue.trim()
    ? brandList.filter(b =>
        b.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        b.models.some(m => m.name.toLowerCase().includes(inputValue.toLowerCase()))
      )
    : brandList;

  /* Selection handlers */
  const pickBrand = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedModel(null);
    setSelectedVersion(null);
    setInputValue(brand);
    setIsOpen(false);
  };

  const pickModel = (brand: string, model: string) => {
    setSelectedBrand(brand);
    setSelectedModel(model);
    setSelectedVersion(null);
    setInputValue(`${brand} ${model}`);
    setIsOpen(false);
  };

  const pickVersion = (brand: string, model: string, version: string) => {
    setSelectedBrand(brand);
    setSelectedModel(model);
    setSelectedVersion(version);
    setInputValue(`${brand} ${model} — ${version}`);
    setIsOpen(false);
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBrand(null);
    setSelectedModel(null);
    setSelectedVersion(null);
    setInputValue('');
  };

  const handleSearch = () => {
    navigate('/shop');
    setIsOpen(false);
  };

  const toggleBrand = (e: React.MouseEvent, brand: string) => {
    e.stopPropagation();
    setExpandedBrand(prev => (prev === brand ? null : brand));
    setExpandedModel(null);
  };

  const toggleModel = (e: React.MouseEvent, model: string) => {
    e.stopPropagation();
    setExpandedModel(prev => (prev === model ? null : model));
  };

  return (
    <div className="sb" ref={wrapperRef}>

      {/* ── INPUT ROW ── */}
      <div className={`sb__row${isOpen ? ' sb__row--open' : ''}`}>

        {/* Category select */}
        <select
          className="sb__cat"
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          onClick={e => e.stopPropagation()}
        >
          {CATEGORIES.map(c => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>

        <span className="sb__divider" aria-hidden="true" />

        {/* Text input */}
        <div className="sb__input-wrap" onClick={() => setIsOpen(true)}>
          <svg className="sb__search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="sb__input"
            placeholder="Make, Model &amp; Variant…"
            value={inputValue}
            onChange={e => { setInputValue(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            role="combobox"
            aria-label="Search by car make, model and variant"
            aria-expanded={isOpen}
            aria-autocomplete="list"
          />
          {(inputValue || selectedBrand) && (
            <button className="sb__clear" onClick={clearAll} aria-label="Clear selection">✕</button>
          )}
        </div>

        {/* CTA button */}
        <button className="sb__cta" onClick={handleSearch} type="button">
          Search&nbsp;<strong>{totalCount}</strong>&nbsp;covers
        </button>
      </div>

      {/* ── DROPDOWN PANEL ── */}
      {isOpen && (
        <div className="sb__panel" role="listbox" aria-label="Car brands">

          <div className="sb__panel-header">
            <span className="sb__panel-label">Select car brand</span>
            <span className="sb__panel-hint">{filteredBrands.length} brands available</span>
          </div>

          <ul className="sb__brand-list">
            {filteredBrands.length === 0 ? (
              <li className="sb__no-results">No brands match "{inputValue}"</li>
            ) : filteredBrands.map(({ name, logo, models }) => {
              const count       = countForCarBrand(name, category);
              const isBrandOpen = expandedBrand === name;
              const isSelected  = selectedBrand === name;

              return (
                <li key={name} className="sb__brand-item">

                  {/* Brand row */}
                  <div
                    className={`sb__brand-row${isSelected ? ' sb__brand-row--selected' : ''}`}
                    onClick={() => pickBrand(name)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <img src={logo} alt={name} className="sb__brand-logo" />
                    <span className="sb__brand-name">{name}</span>
                    <span className="sb__count-pill">{count}</span>
                    {models.length > 0 && (
                      <button
                        className={`sb__expand${isBrandOpen ? ' sb__expand--open' : ''}`}
                        onClick={e => toggleBrand(e, name)}
                        aria-label={isBrandOpen ? `Collapse ${name} models` : `Expand ${name} models`}
                      >
                        Models&nbsp;›
                      </button>
                    )}
                  </div>

                  {/* Model list */}
                  {isBrandOpen && models.length > 0 && (
                    <ul className="sb__model-list">
                      {models.map(model => {
                        const isModelOpen     = expandedModel === model.name;
                        const isModelSelected = selectedModel === model.name && isSelected;
                        return (
                          <li key={model.name} className="sb__model-item">

                            <div
                              className={`sb__model-row${isModelSelected ? ' sb__model-row--selected' : ''}`}
                              onClick={() => pickModel(name, model.name)}
                              role="option"
                              aria-selected={isModelSelected}
                            >
                              <span className="sb__model-name">{model.name}</span>
                              <span className="sb__count-pill">{count}</span>
                              {model.versions.length > 0 && (
                                <button
                                  className={`sb__expand${isModelOpen ? ' sb__expand--open' : ''}`}
                                  onClick={e => toggleModel(e, model.name)}
                                  aria-label={isModelOpen ? `Collapse ${model.name} variants` : `Expand ${model.name} variants`}
                                >
                                  Variants&nbsp;›
                                </button>
                              )}
                            </div>

                            {/* Version list */}
                            {isModelOpen && model.versions.length > 0 && (
                              <ul className="sb__version-list">
                                {model.versions.map(version => {
                                  const isVersionSelected = selectedVersion === version && isModelSelected;
                                  return (
                                    <li
                                      key={version}
                                      className={`sb__version-row${isVersionSelected ? ' sb__version-row--selected' : ''}`}
                                      onClick={() => pickVersion(name, model.name, version)}
                                      role="option"
                                      aria-selected={isVersionSelected}
                                    >
                                      <span>{version}</span>
                                      <span className="sb__count-pill">{count}</span>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

        </div>
      )}
    </div>
  );
}
