"use client";

import { createContext, useContext, useState, useEffect } from "react";

type CartContextType = {
  itemCount: number;
  updateCount: (count: number) => void;
  increment: (qty?: number) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ 
  children, 
  initialCount = 0 
}: { 
  children: React.ReactNode; 
  initialCount: number;
}) {
  const [itemCount, setItemCount] = useState(initialCount);

  // Sync with server initial state on first load
  useEffect(() => {
    setItemCount(initialCount);
  }, [initialCount]);

  const updateCount = (count: number) => setItemCount(count);
  
  // Optimistic increment
  const increment = (qty = 1) => setItemCount((prev) => prev + qty);

  return (
    <CartContext.Provider value={{ itemCount, updateCount, increment }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}