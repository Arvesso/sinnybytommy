import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, formatPrice } from '../api.js';
import { useAuth } from '../store.js';

const STATUSES = {
  new: 'Новый',
  paid: 'Оплачен',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён'
};

export default function Account() {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { api.get('/orders').then(setOrders); }, []);

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link to="/">Главная</Link>
        <span className="sep">—</span>
        <span className="current">Личный кабинет</span>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 18, marginBottom: 12 }}>
        <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(28px,3.6vw,44px)', textTransform: 'uppercase', margin: 0, letterSpacing: '-0.02em' }}>
          ПОКУПКИ
        </h1>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          {user.is_admin && (
            <Link to="/admin" className="btn">Админ-панель</Link>
          )}
          <button onClick={async () => { await logout(); navigate('/'); }}
            style={{ background: 'transparent', border: 0, fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
            Выйти
          </button>
        </div>
      </div>
      <p style={{ color: 'var(--muted)', marginTop: 4, marginBottom: 40 }}>
        {user.first_name} {user.last_name} • {user.phone}
      </p>

      {orders === null ? <div className="spinner" /> :
        orders.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '100px 0' }}>
            <div style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(22px,3vw,38px)', textTransform: 'uppercase', marginBottom: 16 }}>
              Вы ещё не оформили ни одного заказа
            </div>
            <Link to="/" className="btn">К покупкам →</Link>
          </motion.div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {orders.map((o, i) => (
              <motion.div key={o.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 4, padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, paddingBottom: 16, borderBottom: '1px solid var(--line)' }}>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 13, color: 'var(--muted)' }}>Заказ #{o.id}</div>
                    <div style={{ fontWeight: 700, marginTop: 4 }}>{new Date(o.created_at * 1000).toLocaleString('ru-RU')}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={'status status-' + o.status} style={{
                      display: 'inline-block', padding: '4px 12px', borderRadius: 999,
                      fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700,
                      background: o.status === 'delivered' ? '#0a0' : o.status === 'cancelled' ? '#a00' : 'var(--ink)',
                      color: '#fff'
                    }}>{STATUSES[o.status] || o.status}</span>
                    <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 18, marginTop: 6 }}>{formatPrice(o.total)}</div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginTop: 16 }}>
                  {o.items.map(it => (
                    <div key={it.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{ width: 60, height: 60, background: 'var(--bg-soft)', flex: '0 0 60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={it.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                      </div>
                      <div style={{ fontSize: 12, lineHeight: 1.4 }}>
                        <div style={{ fontWeight: 600 }}>{it.name}</div>
                        <div style={{ color: 'var(--muted)' }}>{it.variant} • {it.size} × {it.qty}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )
      }
    </main>
  );
}
