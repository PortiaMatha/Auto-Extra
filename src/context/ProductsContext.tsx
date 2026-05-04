import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Product, ProductCategory, ProductStatus } from '../data/products';

/* ── Row shape returned by Supabase (snake_case) ─────────────────── */
interface ProductRow {
  id: number;
  slug: string;
  title: string;
  category: string;
  brand: string;
  description: string;
  base_price: number;
  discount_price: number | null;
  shipping_fee: number;
  material_options: string[];
  size_options: string[];
  colors: string[];
  images: string[];
  average_rating: number;
  review_count: number;
  stock: number;
  status: string;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as ProductCategory,
    brand: row.brand,
    description: row.description,
    basePrice: row.base_price,
    discountPrice: row.discount_price ?? undefined,
    shippingFee: row.shipping_fee,
    materialOptions: row.material_options ?? [],
    sizeOptions: row.size_options ?? [],
    colors: row.colors ?? [],
    images: row.images ?? [],
    averageRating: row.average_rating,
    reviewCount: row.review_count,
    stock: row.stock,
    status: row.status as ProductStatus,
  };
}

function productToRow(p: Omit<Product, 'id'>): Omit<ProductRow, 'id'> {
  return {
    slug: p.slug,
    title: p.title,
    category: p.category,
    brand: p.brand,
    description: p.description,
    base_price: p.basePrice,
    discount_price: p.discountPrice ?? null,
    shipping_fee: p.shippingFee,
    material_options: p.materialOptions,
    size_options: p.sizeOptions,
    colors: p.colors,
    images: p.images,
    average_rating: p.averageRating,
    review_count: p.reviewCount,
    stock: p.stock,
    status: p.status,
  };
}

/* ── Context ──────────────────────────────────────────────────────── */

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  /* ── Fetch all products on mount ── */
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Failed to load products:', error.message);
      } else {
        setProducts((data as ProductRow[]).map(rowToProduct));
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  /* ── Real-time subscription — portal changes appear instantly ── */
  useEffect(() => {
    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, rowToProduct(payload.new as ProductRow)]);
          } else if (payload.eventType === 'UPDATE') {
            setProducts(prev =>
              prev.map(p => p.id === payload.new.id ? rowToProduct(payload.new as ProductRow) : p)
            );
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  /* ── CRUD ── */
  const addProduct = async (product: Omit<Product, 'id'>) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productToRow(product))
      .select()
      .single();

    if (error) {
      console.error('Failed to add product:', error.message);
      throw new Error(error.message);
    }
    // Real-time subscription will update state automatically;
    // but add optimistically in case subscription lags
    if (data) {
      setProducts(prev => {
        const exists = prev.some(p => p.id === data.id);
        return exists ? prev : [...prev, rowToProduct(data as ProductRow)];
      });
    }
  };

  const updateProduct = async (product: Product) => {
    const { error } = await supabase
      .from('products')
      .update(productToRow(product))
      .eq('id', product.id);

    if (error) {
      console.error('Failed to update product:', error.message);
      throw new Error(error.message);
    }
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = async (id: number) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete product:', error.message);
      throw error;
    }
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, loading, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used inside ProductsProvider');
  return ctx;
}
