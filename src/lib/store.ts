import { create } from 'zustand';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isCartOpen: false,
  addItem: (item) => set((state) => {
    const existingItem = state.items.find((i) => i.id === item.id);
    if (existingItem) {
      return {
        items: state.items.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    return { items: [...state.items, { ...item, quantity: 1 }] };
  }),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((i) => i.id !== id),
  })),
  clearCart: () => set({ items: [] }),
  totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  totalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
}));
