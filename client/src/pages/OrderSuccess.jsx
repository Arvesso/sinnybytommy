import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, formatPrice } from '../api.js';
// no Crest import — uses /logo.svg directly

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { api.get('/orders/' + id).then(setOrder).catch(() => {}); }, [id]);

  return (
    <main className="container" style={{ minHeight: 'calc(100vh - var(--header-h))', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 32px', textAlign: 'center' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}
        style={{ maxWidth: 640 }}>
        <motion.img src="/logo.svg" alt=""
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
          style={{ height: 64, marginBottom: 30, display: 'inline-block' }} />
        <div className="eyebrow" style={{ marginBottom: 14 }}>Заказ #{id} принят</div>
        <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(32px,4.5vw,56px)', textTransform: 'uppercase', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: 1.05 }}>
          Спасибо! <br /> Ты уже в семье.
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 28, fontSize: 15, lineHeight: 1.6 }}>
          Мы получили оплату. Менеджер свяжется с вами в течение часа для подтверждения деталей.
        </p>
        {order && (
          <div style={{ background: 'var(--bg-soft)', padding: 24, borderRadius: 4, marginBottom: 32, textAlign: 'left' }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Состав заказа</div>
            {order.items.map(it => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', fontSize: 14 }}>
                <span>{it.name} {it.variant} ({it.size}) × {it.qty}</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 12, marginTop: 8 }}>
              <span style={{ fontFamily: 'Unbounded', fontWeight: 800, textTransform: 'uppercase', fontSize: 14 }}>Итого</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 18 }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/account" className="btn">Мои заказы</Link>
          <Link to="/" className="btn btn-primary">На главную →</Link>
        </div>
      </motion.div>
    </main>
  );
}
