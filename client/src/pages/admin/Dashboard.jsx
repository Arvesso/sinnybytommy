import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api, formatPrice } from '../../api.js';

export default function Dashboard() {
  const [s, setS] = useState(null);
  useEffect(() => { api.get('/admin/stats').then(setS); }, []);

  if (!s) return <div className="spinner" />;

  const cards = [
    { label: 'Заказов', value: s.ordersCount, delta: s.newOrders > 0 ? `${s.newOrders} новых` : 'все обработаны' },
    { label: 'Выручка', value: formatPrice(s.totalRevenue), delta: '' },
    { label: 'Товаров', value: s.productsCount },
    { label: 'Пользователей', value: s.usersCount }
  ];

  return (
    <>
      <h1>Дашборд</h1>
      <p className="admin-sub">Обзор магазина TommySinny</p>

      <div className="stat-grid">
        {cards.map((c, i) => (
          <motion.div key={c.label} className="stat-card"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <div className="label">{c.label}</div>
            <div className="value">{c.value}</div>
            {c.delta && <div className="delta">{c.delta}</div>}
          </motion.div>
        ))}
      </div>

      <div className="dash-2col" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div className="admin-card">
          <h2>Последние заказы</h2>
          <table className="admin-table">
            <thead><tr><th>#</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Дата</th></tr></thead>
            <tbody>
              {s.last.map(o => (
                <tr key={o.id}>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>#{o.id}</td>
                  <td>{o.first_name} {o.last_name}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{formatPrice(o.total)}</td>
                  <td><span className={'status-pill ' + o.status}>{o.status}</span></td>
                  <td style={{ color: '#909090' }}>{new Date(o.created_at * 1000).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/admin/orders" style={{ color: '#ff3a1f', fontSize: 13, marginTop: 14, display: 'inline-block' }}>Все заказы →</Link>
        </div>
        <div className="admin-card">
          <h2>Каталог</h2>
          {s.byCategory.map(c => (
            <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span>{c.name}</span>
              <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#ff3a1f' }}>{c.c}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
