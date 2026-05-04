import React, { useState, useRef, useCallback } from 'react';
import './PortalProducts.css';
import { useProducts } from '../../context/ProductsContext';
import { supabase } from '../../lib/supabase';
import { Product, ProductCategory, ProductStatus, MATERIAL_OPTIONS, COLOR_OPTIONS, BRAND_OPTIONS } from '../../data/products';

/* ── Image upload constants ───────────────────────────────────────── */

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB
const BUCKET = 'product-images';

interface PendingFile {
  file: File;
  preview: string;
  error?: string;
}

async function uploadToStorage(file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `public/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return publicUrl;
}

function validateFile(file: File): string | null {
  if (!ALLOWED_TYPES.includes(file.type)) return 'Only JPEG, PNG and WebP images are allowed.';
  if (file.size > MAX_SIZE_BYTES) return `File is ${(file.size / 1024 / 1024).toFixed(1)} MB — must be under 2 MB.`;
  return null;
}

/* ── ImageUploader component ──────────────────────────────────────── */

interface ImageUploaderProps {
  existingUrls: string[];
  pendingFiles: PendingFile[];
  onExistingRemove: (url: string) => void;
  onFilesAdd: (files: PendingFile[]) => void;
  onPendingRemove: (preview: string) => void;
}

function ImageUploader({ existingUrls, pendingFiles, onExistingRemove, onFilesAdd, onPendingRemove }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFiles = useCallback((fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    const results: PendingFile[] = files.map(file => {
      const err = validateFile(file);
      return {
        file,
        preview: URL.createObjectURL(file),
        error: err ?? undefined,
      };
    });
    onFilesAdd(results);
  }, [onFilesAdd]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="img-uploader">
      {/* Drop zone */}
      <div
        className={`img-uploader__dropzone${dragging ? ' img-uploader__dropzone--active' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <svg className="img-uploader__icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        <p className="img-uploader__hint">
          <strong>Click to upload</strong> or drag &amp; drop
        </p>
        <p className="img-uploader__rules">JPEG, PNG, WebP — max 2 MB each</p>
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          style={{ display: 'none' }}
          onChange={e => e.target.files && processFiles(e.target.files)}
        />
      </div>

      {/* Thumbnails */}
      {(existingUrls.length > 0 || pendingFiles.length > 0) && (
        <div className="img-uploader__thumbs">
          {/* Existing (saved) images */}
          {existingUrls.map(url => (
            <div key={url} className="img-thumb">
              <img src={url} alt="product" className="img-thumb__img" />
              <button
                type="button"
                className="img-thumb__remove"
                onClick={() => onExistingRemove(url)}
                title="Remove"
              >✕</button>
            </div>
          ))}

          {/* Pending (newly selected) images */}
          {pendingFiles.map(pf => (
            <div key={pf.preview} className={`img-thumb${pf.error ? ' img-thumb--error' : ''}`}>
              <img src={pf.preview} alt="preview" className="img-thumb__img" />
              {pf.error && <div className="img-thumb__error-msg" title={pf.error}>⚠</div>}
              <button
                type="button"
                className="img-thumb__remove"
                onClick={() => onPendingRemove(pf.preview)}
                title="Remove"
              >✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Form data type ───────────────────────────────────────────────── */

type FormData = {
  title: string;
  category: ProductCategory;
  brand: string;
  description: string;
  basePrice: string;
  discountPrice: string;
  shippingFee: string;
  stock: string;
  status: ProductStatus;
  materialOptions: string[];
  sizeOptions: string[];
  colors: string[];
  imageUrls: string[];      // existing saved URLs (edit mode)
  pendingFiles: PendingFile[]; // newly selected files awaiting upload
};

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];
const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'interior', label: 'Interior' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'custom',   label: 'Custom' },
];

function toggleItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item];
}

function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function emptyForm(): FormData {
  return {
    title: '', category: 'interior', brand: '', description: '',
    basePrice: '', discountPrice: '', shippingFee: '', stock: '', status: 'Active',
    materialOptions: [], sizeOptions: [], colors: [],
    imageUrls: [], pendingFiles: [],
  };
}

/* ── ProductModal ─────────────────────────────────────────────────── */

interface ProductModalProps {
  initial?: Product;
  onSave: (data: Omit<Product, 'id'> | Product) => Promise<void>;
  onClose: () => void;
}

function ProductModal({ initial, onSave, onClose }: ProductModalProps) {
  const [form, setForm] = useState<FormData>(() =>
    initial
      ? {
          title: initial.title,
          category: initial.category,
          brand: initial.brand,
          description: initial.description,
          basePrice: String(initial.basePrice),
          discountPrice: initial.discountPrice ? String(initial.discountPrice) : '',
          shippingFee: String(initial.shippingFee),
          stock: String(initial.stock),
          status: initial.status,
          materialOptions: [...initial.materialOptions],
          sizeOptions: [...initial.sizeOptions],
          colors: [...initial.colors],
          imageUrls: [...initial.images],
          pendingFiles: [],
        }
      : emptyForm()
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim())  { setError('Product name is required.');    return; }
    if (!form.brand.trim())  { setError('Brand is required.');           return; }
    if (!form.basePrice || isNaN(Number(form.basePrice))) { setError('Valid price is required.'); return; }
    if (!form.stock || isNaN(Number(form.stock)))         { setError('Valid stock quantity is required.'); return; }

    const invalid = form.pendingFiles.filter(pf => pf.error);
    if (invalid.length > 0) { setError('Remove invalid images before saving.'); return; }

    setSaving(true);

    // Upload pending files to Supabase Storage
    const uploadedUrls: string[] = [];
    try {
      for (let i = 0; i < form.pendingFiles.length; i++) {
        setUploadProgress(`Uploading image ${i + 1} of ${form.pendingFiles.length}…`);
        const url = await uploadToStorage(form.pendingFiles[i].file);
        uploadedUrls.push(url);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed.';
      setError(`Upload failed: ${msg}`);
      setSaving(false);
      setUploadProgress('');
      return;
    }
    setUploadProgress('');

    const allImages = [...form.imageUrls, ...uploadedUrls];

    const productData: Omit<Product, 'id'> = {
      slug: slugify(form.title),
      title: form.title.trim(),
      category: form.category,
      brand: form.brand,
      description: form.description.trim(),
      basePrice: Number(form.basePrice),
      discountPrice: form.discountPrice && !isNaN(Number(form.discountPrice))
        ? Number(form.discountPrice)
        : undefined,
      shippingFee: Number(form.shippingFee) || 0,
      stock: Number(form.stock),
      status: form.status,
      materialOptions: form.materialOptions,
      sizeOptions: form.sizeOptions,
      colors: form.colors,
      images: allImages,
      averageRating: initial?.averageRating ?? 0,
      reviewCount: initial?.reviewCount ?? 0,
    };

    try {
      if (initial) {
        await onSave({ ...productData, id: initial.id });
      } else {
        await onSave(productData);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message
        : (err as { message?: string })?.message ?? 'Unknown error';
      setError(`Failed to save product: ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pmodal-overlay" onClick={onClose}>
      <div className="pmodal" onClick={e => e.stopPropagation()}>
        <div className="pmodal__header">
          <h2 className="pmodal__title">{initial ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="pmodal__close" onClick={onClose} disabled={saving}>✕</button>
        </div>

        <form className="pmodal__form" onSubmit={handleSubmit}>
          {error && <p className="pmodal__error">{error}</p>}

          <div className="pmodal__row">
            <label className="pmodal__label">Product Name *</label>
            <input
              className="pmodal__input"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g. Premium Leather Seat Cover"
            />
          </div>

          <div className="pmodal__row pmodal__row--2col">
            <div>
              <label className="pmodal__label">Category *</label>
              <select
                className="pmodal__select"
                value={form.category}
                onChange={e => set('category', e.target.value as ProductCategory)}
              >
                {CATEGORY_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="pmodal__label">Status</label>
              <select
                className="pmodal__select"
                value={form.status}
                onChange={e => set('status', e.target.value as ProductStatus)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="pmodal__row">
            <label className="pmodal__label">Brand *</label>
            <select
              className="pmodal__select"
              value={form.brand}
              onChange={e => set('brand', e.target.value)}
            >
              <option value="">Select a brand…</option>
              {BRAND_OPTIONS.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="pmodal__row">
            <label className="pmodal__label">Description</label>
            <textarea
              className="pmodal__textarea"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              placeholder="Brief product description..."
            />
          </div>

          <div className="pmodal__row pmodal__row--2col">
            <div>
              <label className="pmodal__label">Price (R) *</label>
              <input
                className="pmodal__input"
                type="number"
                min="0"
                value={form.basePrice}
                onChange={e => set('basePrice', e.target.value)}
                placeholder="e.g. 1200"
              />
            </div>
            <div>
              <label className="pmodal__label">Discount Price (R)</label>
              <input
                className="pmodal__input"
                type="number"
                min="0"
                value={form.discountPrice}
                onChange={e => set('discountPrice', e.target.value)}
                placeholder="Leave empty if no sale"
              />
            </div>
          </div>

          <div className="pmodal__row pmodal__row--2col">
            <div>
              <label className="pmodal__label">Shipping Fee (R)</label>
              <input
                className="pmodal__input"
                type="number"
                min="0"
                value={form.shippingFee}
                onChange={e => set('shippingFee', e.target.value)}
                placeholder="e.g. 150"
              />
            </div>
            <div>
              <label className="pmodal__label">Stock Quantity *</label>
              <input
                className="pmodal__input"
                type="number"
                min="0"
                value={form.stock}
                onChange={e => set('stock', e.target.value)}
                placeholder="e.g. 25"
              />
            </div>
          </div>

          {/* Image uploader */}
          <div className="pmodal__row">
            <label className="pmodal__label">Product Images</label>
            <ImageUploader
              existingUrls={form.imageUrls}
              pendingFiles={form.pendingFiles}
              onExistingRemove={url =>
                set('imageUrls', form.imageUrls.filter(u => u !== url))
              }
              onFilesAdd={files =>
                set('pendingFiles', [...form.pendingFiles, ...files])
              }
              onPendingRemove={preview => {
                const pf = form.pendingFiles.find(f => f.preview === preview);
                if (pf) URL.revokeObjectURL(pf.preview);
                set('pendingFiles', form.pendingFiles.filter(f => f.preview !== preview));
              }}
            />
            {uploadProgress && (
              <p className="pmodal__upload-progress">{uploadProgress}</p>
            )}
          </div>

          <div className="pmodal__row">
            <label className="pmodal__label">Materials</label>
            <div className="pmodal__chips">
              {MATERIAL_OPTIONS.map(m => (
                <button
                  key={m}
                  type="button"
                  className={`pmodal__chip${form.materialOptions.includes(m) ? ' pmodal__chip--active' : ''}`}
                  onClick={() => set('materialOptions', toggleItem(form.materialOptions, m))}
                >{m}</button>
              ))}
            </div>
          </div>

          <div className="pmodal__row">
            <label className="pmodal__label">Sizes</label>
            <div className="pmodal__chips">
              {SIZE_OPTIONS.map(s => (
                <button
                  key={s}
                  type="button"
                  className={`pmodal__chip${form.sizeOptions.includes(s) ? ' pmodal__chip--active' : ''}`}
                  onClick={() => set('sizeOptions', toggleItem(form.sizeOptions, s))}
                >{s}</button>
              ))}
            </div>
          </div>

          <div className="pmodal__row">
            <label className="pmodal__label">Colors</label>
            <div className="pmodal__chips">
              {COLOR_OPTIONS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  className={`pmodal__chip${form.colors.includes(c.name) ? ' pmodal__chip--active' : ''}`}
                  onClick={() => set('colors', toggleItem(form.colors, c.name))}
                >{c.name}</button>
              ))}
            </div>
          </div>

          <div className="pmodal__footer">
            <button type="button" className="btn-outline" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? (uploadProgress || 'Saving…') : initial ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────────── */

export function PortalProducts() {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'All' | ProductStatus>('All');
  const [selected, setSelected] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const visible = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'All' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const toggleSelect = (id: number) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () =>
    setSelected(selected.length === visible.length ? [] : visible.map(p => p.id));

  const openAdd = () => { setEditingProduct(null); setShowModal(true); };
  const openEdit = (p: Product) => { setEditingProduct(p); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingProduct(null); };

  const handleSave = async (data: Omit<Product, 'id'> | Product) => {
    if ('id' in data) {
      await updateProduct(data as Product);
    } else {
      await addProduct(data);
    }
    closeModal();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this product? It will also be removed from the shop.')) {
      try {
        await deleteProduct(id);
        setSelected(s => s.filter(x => x !== id));
      } catch {
        // error already logged in context
      }
    }
  };

  const exportCSV = () => {
    const header = 'ID,Name,Category,Price,Stock,Status';
    const rows = products.map(p =>
      `${p.id},"${p.title}",${p.category},${p.basePrice},${p.stock},${p.status}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'products.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ppage">
      {/* Header */}
      <div className="ppage__header">
        <div>
          <h1 className="ppage__title">Products</h1>
          <p className="ppage__sub">{products.length} product{products.length !== 1 ? 's' : ''} in your store</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>+ Add Product</button>
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
        <button className="btn-outline" onClick={exportCSV}>⬇ Export</button>
      </div>

      {/* Table */}
      <div className="ppage__card">
        {loading && <div className="ppage__loading">Loading products…</div>}
        <table className="ptable">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={selected.length === visible.length && visible.length > 0}
                />
              </th>
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
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(p.id)}
                    onChange={() => toggleSelect(p.id)}
                  />
                </td>
                <td>
                  <div className="ptable__product">
                    {p.images[0] && (
                      <img src={p.images[0]} alt={p.title} className="ptable__thumb" />
                    )}
                    <span className="ptable__name">{p.title}</span>
                  </div>
                </td>
                <td>
                  <span className="ptable__cat">{p.category}</span>
                </td>
                <td className="ptable__price">R{p.basePrice.toLocaleString()}.00</td>
                <td>
                  <span className={`stock-pill${p.stock <= 5 ? ' stock-pill--low' : ''}`}>
                    {p.stock} units
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-badge--${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div className="ptable__actions">
                    <button className="action-btn" title="Edit" onClick={() => openEdit(p)}>✏️</button>
                    <button
                      className="action-btn action-btn--danger"
                      title="Delete"
                      onClick={() => handleDelete(p.id)}
                    >🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && visible.length === 0 && (
          <div className="ppage__empty">No products match your search.</div>
        )}
      </div>

      {/* Pagination */}
      <div className="ppage__pagination">
        <span className="ppage__pag-info">
          Showing {visible.length} of {products.length} products
        </span>
        <div className="ppage__pag-btns">
          <button className="pag-btn" disabled>← Prev</button>
          <button className="pag-btn pag-btn--active">1</button>
          <button className="pag-btn">Next →</button>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <ProductModal
          initial={editingProduct ?? undefined}
          onSave={handleSave}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
