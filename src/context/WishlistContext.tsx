import { createContext, useContext, useState, ReactNode } from "react";
import { Product } from "../data/products";

interface WishlistContextType {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  hasItem: (productId: number) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);

  const addItem = (product: Product) =>
    setItems(prev =>
      prev.find(p => p.id === product.id) ? prev : [...prev, product]
    );

  const removeItem = (productId: number) =>
    setItems(prev => prev.filter(p => p.id !== productId));

  const hasItem = (productId: number) => items.some(p => p.id === productId);

  return (
    <WishlistContext.Provider value={{ items, addItem, removeItem, hasItem, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
}
