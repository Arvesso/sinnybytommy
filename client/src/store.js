import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from './api.js';

export const useAuth = create((set, get) => ({
  user: null,
  loaded: false,
  init: async () => {
    try { const { user } = await api.get('/auth/me'); set({ user, loaded: true }); }
    catch { set({ loaded: true }); }
  },
  startAuth: async (phone) => {
    const r = await api.post('/auth/start', { phone });
    set({ user: r.user });
    return r;
  },
  complete: async (data) => {
    const r = await api.post('/auth/complete', data);
    set({ user: r.user });
    return r;
  },
  logout: async () => { await api.post('/auth/logout'); set({ user: null }); }
}));

export const useCart = create(persist((set, get) => ({
  items: [],
  add: (product, size) => {
    const existing = get().items.find(i => i.product_id === product.id && i.size === size);
    if (existing) {
      set({ items: get().items.map(i => i === existing ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      set({ items: [...get().items, {
        product_id: product.id, name: product.name, variant: product.variant,
        price: product.price, image: product.image, size, qty: 1
      }] });
    }
  },
  remove: (idx) => set({ items: get().items.filter((_, i) => i !== idx) }),
  setQty: (idx, qty) => set({ items: get().items.map((it, i) => i === idx ? { ...it, qty: Math.max(1, qty) } : it) }),
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((s, i) => s + i.qty, 0),
  total: () => get().items.reduce((s, i) => s + i.price * i.qty, 0)
}), { name: 'tommysinny-cart' }));

export const useUI = create((set) => ({
  menuOpen: false,
  setMenu: (open) => set({ menuOpen: open }),
  searchOpen: false,
  setSearch: (open) => set({ searchOpen: open })
}));
