import React, { useEffect, useState } from 'react';
import { api, formatPrice } from '../../api.js';

const STATUSES = ['new', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function Orders() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);

  const load = () => api.get('/admin/orders').then(setList);
  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    await api.put('/admin/orders/' + id, { status });
    load();
  };

  const filtered = list.filter(o => filter === 'all' || o.status === filter);
  const counts = STATUSES.reduce((a, s) => ({ ...a, [s]: list.filter(o => o.status === s).length }), {});

  return (
    <>
      <h1>Заказы</h1>
      <p className="admin-sub">Все поступившие заказы</p>

      <div className="adm-toolbar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className={'adm-btn tiny ' + (filter === 'all' ? '' : 'secondary')} onClick={() => setFilter('all')}>Все ({list.length})</button>
          {STATUSES.map(s => (
            <button key={s} className={'adm-btn tiny ' + (filter === s ? '' : 'secondary')} onClick={() => setFilter(s)}>
              {s} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Клиент</th><th>Телефон</th><th>Сумма</th><th>Статус</th><th>Дата</th><th></th></tr></thead>
          <tbody>
            {filtered.map(o => (
              <React.Fragment key={o.id}>
                <tr style={{ cursor: 'pointer' }} onClick={() => setOpen(open === o.id ? null : o.id)}>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>#{o.id}</td>
                  <td style={{ fontWeight: 600 }}>{o.first_name} {o.last_name}</td>
                  <td style={{ color: '#909090', fontFamily: 'JetBrains Mono', fontSize: 12 }}>{o.phone}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{formatPrice(o.total)}</td>
                  <td>
                    <select value={o.status} onClick={e => e.stopPropagation()} onChange={e => setStatus(o.id, e.target.value)}
                      style={{ background: '#1c1c1c', color: '#eaeaea', border: '1px solid rgba(255,255,255,0.1)', padding: '6px 10px', borderRadius: 4, fontSize: 12 }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={{ color: '#909090' }}>{new Date(o.created_at * 1000).toLocaleString('ru-RU')}</td>
                  <td>{open === o.id ? '▴' : '▾'}</td>
                </tr>
                {open === o.id && (
                  <tr><td colSpan="7" style={{ padding: 0 }}>
                    <div style={{ background: '#0f0f0f', padding: 20 }}>
                      <div style={{ marginBottom: 14, fontSize: 13, color: '#b8b8b8' }}>
                        <strong>Адрес:</strong> {o.address} <br/>
                        <strong>Телефон:</strong> {o.phone} • <strong>Оплата:</strong> {o.payment_method}
                      </div>
                      <table className="admin-table" style={{ background: 'transparent' }}>
                        <thead><tr><th></th><th>Товар</th><th>Размер</th><th>×</th><th>Цена</th></tr></thead>
                        <tbody>
                          {o.items.map(it => (
                            <tr key={it.id}>
                              <td><div className="ph"><img src={it.image} alt="" /></div></td>
                              <td>{it.name} <span style={{ color: '#909090' }}>{it.variant}</span></td>
                              <td>{it.size}</td>
                              <td>{it.qty}</td>
                              <td style={{ fontFamily: 'JetBrains Mono' }}>{formatPrice(it.price * it.qty)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td></tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
