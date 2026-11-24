import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { ProductCategory, UploadKind } from "./format";
import type { UploadedFile } from "./upload-client";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  category: ProductCategory;
  imageUrl: string;
  unitPrice: number;
  priceUnit: string;
  priceIsStarting: boolean;
  quantity: number;
  notes: string;
  uploadKind: UploadKind;
  uploadRequired: boolean;
  files: UploadedFile[];
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  ready: boolean;
  add: (item: Omit<CartItem, "key">) => void;
  update: (key: string, patch: Partial<Omit<CartItem, "key">>) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "durga-studio-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

export function cartTotal(items: Pick<CartItem, "unitPrice" | "quantity">[]): number {
  return items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* ignore corrupt cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const add = useCallback((item: Omit<CartItem, "key">) => {
    setItems((prev) => [...prev, { ...item, key: crypto.randomUUID() }]);
  }, []);
  const update = useCallback((key: string, patch: Partial<Omit<CartItem, "key">>) => {
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  }, []);
  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.quantity, 0),
      total: cartTotal(items),
      ready,
      add,
      update,
      remove,
      clear,
    }),
    [items, ready, add, update, remove, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
