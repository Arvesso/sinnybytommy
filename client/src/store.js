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

// Версия для слабовидящих — настройки доступности.
// Применяются к <html> через data-атрибуты (см. App.jsx и global.css).
export const useA11y = create(persist((set, get) => ({
  enabled: false,      // активна ли версия для слабовидящих
  font: 'large',       // normal | large | xlarge
  scheme: 'mono',      // mono (ч/б) | dark (инверсия) | beige (бежевый)
  spacing: 'normal',   // normal | wide
  images: 'on',        // on (цветные) | off (ч/б)
  panelOpen: false,    // открыта ли панель настроек (не сохраняется)

  togglePanel: () => set((s) => {
    const opening = !s.panelOpen;
    // первый клик по иконке сразу включает версию для слабовидящих
    return opening && !s.enabled
      ? { panelOpen: true, enabled: true }
      : { panelOpen: opening };
  }),
  closePanel: () => set({ panelOpen: false }),

  setFont: (font) => set({ font, enabled: true }),
  setScheme: (scheme) => set({ scheme, enabled: true }),
  setSpacing: (spacing) => set({ spacing, enabled: true }),
  setImages: (images) => set({ images, enabled: true }),

  // вернуться к обычной версии (настройки запоминаются для следующего раза)
  reset: () => set({ enabled: false, panelOpen: false })
}), {
  name: 'tommysinny-a11y',
  partialize: (s) => ({ font: s.font, scheme: s.scheme, spacing: s.spacing, images: s.images, enabled: s.enabled })
}));
