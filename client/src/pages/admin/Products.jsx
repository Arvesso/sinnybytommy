import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatPrice } from '../../api.js';

export default function Products() {
  const [list, setList] = useState(null);
  const [q, setQ] = useState('');

  const load = () => api.get('/admin/products').then(setList);
  useEffect(() => { load(); }, []);

  const onDelete = async (id) => {
    if (!confirm('Удалить товар?')) return;
    await api.del('/admin/products/' + id);
    load();
  };

  const filtered = (list || []).filter(p =>
    !q || (p.name + ' ' + p.variant).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <>
      <h1>Товары</h1>
      <p className="admin-sub">Управление каталогом</p>
      <div className="adm-toolbar">
        <input className="adm-search" placeholder="Поиск по названию..." value={q} onChange={e => setQ(e.target.value)} />
        <Link to="/admin/products/new" className="adm-btn">+ Добавить товар</Link>
      </div>
      <div className="admin-card">
        {!list ? <div className="spinner" /> : (
          <table className="admin-table">
            <thead><tr><th></th><th>Название</th><th>Вариант</th><th>Категория</th><th>Цена</th><th>Поп</th><th></th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><div className="ph"><img src={p.image} alt="" /></div></td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td>{p.variant}</td>
                  <td style={{ color: '#909090' }}>{p.category_name || '—'}</td>
                  <td style={{ fontFamily: 'JetBrains Mono', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                  <td>{p.is_popular ? <span className="status-pill paid">★</span> : ''}</td>
                  <td className="actions">
                    <Link to={`/admin/products/${p.id}`} className="adm-btn secondary tiny">Изменить</Link>
                    <button className="adm-btn danger tiny" onClick={() => onDelete(p.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
