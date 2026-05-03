import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Users() {
  const [list, setList] = useState([]);
  const load = () => api.get('/admin/users').then(setList);
  useEffect(() => { load(); }, []);

  const toggleAdmin = async (u) => {
    if (!confirm(u.is_admin ? 'Снять права администратора?' : 'Сделать администратором?')) return;
    await api.put('/admin/users/' + u.id, { is_admin: !u.is_admin });
    load();
  };

  return (
    <>
      <h1>Пользователи</h1>
      <p className="admin-sub">Зарегистрированные клиенты</p>
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Имя</th><th>Телефон</th><th>Дата</th><th>Подписка</th><th>Роль</th><th></th></tr></thead>
          <tbody>
            {list.map(u => (
              <tr key={u.id}>
                <td style={{ fontFamily: 'JetBrains Mono', color: '#909090' }}>{u.id}</td>
                <td style={{ fontWeight: 600 }}>{u.first_name || '—'} {u.last_name || ''}</td>
                <td style={{ fontFamily: 'JetBrains Mono' }}>{u.phone}</td>
                <td style={{ color: '#909090' }}>{new Date(u.created_at * 1000).toLocaleDateString('ru-RU')}</td>
                <td>{u.newsletter ? '✓' : ''}</td>
                <td>{u.is_admin ? <span className="status-pill new">Админ</span> : <span style={{ color: '#909090' }}>клиент</span>}</td>
                <td className="actions">
                  <button className="adm-btn secondary tiny" onClick={() => toggleAdmin(u)}>
                    {u.is_admin ? 'Снять админа' : 'Сделать админом'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
