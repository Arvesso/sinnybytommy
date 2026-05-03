import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, useAuth } from '../store.js';
import { formatPrice } from '../api.js';

export default function Cart() {
  const items = useCart(s => s.items);
  const remove = useCart(s => s.remove);
  const setQty = useCart(s => s.setQty);
  const total = useCart(s => s.total());
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link to="/">Главная</Link>
        <span className="sep">—</span>
        <span className="current">Корзина</span>
      </nav>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '120px 0' }}>
          <div style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(28px,4vw,52px)', textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 14 }}>
            Ваша корзина пуста
          </div>
          <p style={{ color: 'var(--muted)', marginBottom: 32 }}>Добавленные изделия будут показаны здесь</p>
          <Link to="/" className="btn">Перейти к покупкам →</Link>
        </div>
      ) : (
        <>
          <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(26px,3.2vw,40px)', textTransform: 'uppercase', margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            Ваш заказ
          </h1>
          <div className="cart-items-grid">
            <AnimatePresence>
              {items.map((it, idx) => (
                <motion.div key={idx} className="cart-item"
                  layout
                  initial={{ opacity: 0, scale: .9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: .8, x: -50 }}
                  transition={{ duration: .35 }}>
                  <Link to={'/product/' + it.product_id} className="cart-item-img">
                    <img src={it.image} alt={it.name} />
                  </Link>
                  <div style={{ padding: '14px 0', textAlign: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.4 }}>
                      {it.name}<br/>{it.variant}
                    </div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, marginTop: 8 }}>
                      {formatPrice(it.price)}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, padding: '0 14px', alignItems: 'center', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      <span>размер</span>
                      <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{it.size}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 14px', alignItems: 'center', fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                      <span>кол-во</span>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <button onClick={() => setQty(idx, it.qty - 1)} style={{ width: 24, height: 24, border: '1px solid var(--line)', background: 'transparent' }}>−</button>
                        <span style={{ minWidth: 20, textAlign: 'center', color: 'var(--ink)', fontWeight: 700 }}>{it.qty}</span>
                        <button onClick={() => setQty(idx, it.qty + 1)} style={{ width: 24, height: 24, border: '1px solid var(--line)', background: 'transparent' }}>+</button>
                      </div>
                    </div>
                    <button onClick={() => remove(idx)}
                      style={{ marginTop: 14, background: 'transparent', border: 0, color: 'var(--muted)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                      удалить
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="cart-bar">
            <div>
              <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, fontWeight: 700 }}>{formatPrice(total)}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>* до вычета налогов</div>
            </div>
            <button className="btn btn-primary" onClick={() => navigate(user ? '/checkout' : '/login')}>
              Продолжить →
            </button>
          </div>
        </>
      )}
      <style>{`
        .cart-items-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        @media (max-width: 1100px) { .cart-items-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 800px) { .cart-items-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .cart-items-grid { grid-template-columns: 1fr; } }
        .cart-item { background: #fff; border: 1px solid var(--line); border-radius: 4px; overflow: hidden; }
        .cart-item-img { display: block; aspect-ratio: 1/1; padding: 18px; }
        .cart-item-img img { width: 100%; height: 100%; object-fit: contain; }
        .cart-bar {
          position: sticky; bottom: 0;
          margin-top: 40px;
          background: #fff;
          border: 1px solid var(--line);
          padding: 18px 26px;
          display: flex; justify-content: space-between; align-items: center;
          gap: 24px;
          border-radius: 4px;
          box-shadow: 0 -10px 30px -20px rgba(0,0,0,.2);
          flex-wrap: wrap;
        }
        @media (max-width: 480px) {
          .cart-bar { padding: 14px 16px; gap: 14px; }
          .cart-bar > div:first-child { width: 100%; text-align: center; }
          .cart-bar .btn { width: 100%; }
        }
      `}</style>
    </main>
  );
}
