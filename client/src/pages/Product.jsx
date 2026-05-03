import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api, formatPrice } from '../api.js';
import { useCart } from '../store.js';

export default function Product() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [size, setSize] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const add = useCart(s => s.add);
  const navigate = useNavigate();

  useEffect(() => {
    setP(null);
    api.get('/products/' + id).then(d => {
      setP(d);
      const sizes = (d.sizes || '').split(',').map(s => s.trim()).filter(Boolean);
      setSize(sizes[0] || 'one size');
    });
  }, [id]);

  if (!p) return <div className="spinner" />;
  const sizes = (p.sizes || '').split(',').map(s => s.trim()).filter(Boolean);

  const onAdd = () => {
    setAdding(true);
    add(p, size);
    setTimeout(() => { setAdding(false); setAdded(true); }, 350);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link to="/">Главная</Link>
        <span className="sep">—</span>
        <Link to={'/catalog/' + (p.category_slug || 'popular')}>{p.category_name}</Link>
        <span className="sep">—</span>
        <span className="current">{p.variant || p.name}</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, padding: '20px 0 60px' }} className="product-detail-grid">
        <div className="product-img-card"
          style={{ background: '#fff', border: '1px solid var(--line)', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30, borderRadius: 4, overflow: 'hidden' }}>
          <img src={p.image} alt={p.name}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'transform .5s ease' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
        </div>

        <div>
          <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(28px,3.6vw,40px)', margin: '0 0 22px', letterSpacing: '-0.02em' }}>
            {p.name} {p.variant && <span style={{ display: 'block', color: 'var(--muted)', fontSize: '0.75em', fontWeight: 400 }}>{p.variant}</span>}
          </h1>
          <div style={{ fontSize: 30, fontWeight: 800, marginBottom: 36, fontFamily: 'JetBrains Mono' }}>
            {formatPrice(p.price)}
          </div>

          <div className="field">
            <label className="field-label">Размер</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sizes.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  style={{
                    minWidth: 60, padding: '12px 18px',
                    border: '1px solid ' + (size === s ? 'var(--ink)' : 'var(--line)'),
                    background: size === s ? 'var(--ink)' : 'transparent',
                    color: size === s ? 'var(--bg)' : 'var(--ink)',
                    fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase',
                    fontWeight: 600, cursor: 'pointer', transition: 'all .25s', borderRadius: 4
                  }}>{s}</button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-block" onClick={onAdd} style={{ padding: '20px 28px', fontSize: 14, marginTop: 10 }}>
            <AnimatePresence mode="wait">
              {added ? (
                <motion.span key="ok" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                  ✓ Добавлено в корзину
                </motion.span>
              ) : adding ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Добавляем...
                </motion.span>
              ) : (
                <motion.span key="add" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
                  Добавить в корзину
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <div style={{ marginTop: 36, padding: 24, background: 'var(--bg-soft)', borderRadius: 4 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Внимание!</div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--ink-soft)' }}>
              {p.description}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-detail-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </main>
  );
}
