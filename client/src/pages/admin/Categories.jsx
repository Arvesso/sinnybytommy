import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function Categories() {
  const [list, setList] = useState([]);
  const [draft, setDraft] = useState({ slug: '', name: '', position: 0 });
  const [editing, setEditing] = useState(null);

  const load = () => api.get('/admin/categories').then(setList);
  useEffect(() => { load(); }, []);

  const onSave = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put('/admin/categories/' + editing.id, editing);
      setEditing(null);
    } else {
      await api.post('/admin/categories', draft);
      setDraft({ slug: '', name: '', position: 0 });
    }
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Удалить категорию?')) return;
    await api.del('/admin/categories/' + id);
    load();
  };

  return (
    <>
      <h1>Категории</h1>
      <p className="admin-sub">Структура каталога</p>
      <div className="dash-2col" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 18 }}>
        <div className="admin-card">
          <table className="admin-table">
            <thead><tr><th>#</th><th>Slug</th><th>Название</th><th>Позиция</th><th></th></tr></thead>
            <tbody>
              {list.map(c => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'JetBrains Mono', color: '#909090' }}>{c.id}</td>
                  <td style={{ fontFamily: 'JetBrains Mono' }}>{c.slug}</td>
                  <td style={{ fontWeight: 600 }}>{c.name}</td>
                  <td>{c.position}</td>
                  <td className="actions">
                    <button className="adm-btn secondary tiny" onClick={() => setEditing(c)}>Изменить</button>
                    <button className="adm-btn danger tiny" onClick={() => onDelete(c.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="admin-card">
          <h2>{editing ? 'Редактировать' : 'Добавить категорию'}</h2>
          <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['slug', 'name'].map(f => (
              <div className="adm-field" key={f}>
                <label>{f === 'slug' ? 'Slug (англ)' : 'Название'}</label>
                <input
                  value={editing ? editing[f] : draft[f]}
                  onChange={e => editing ? setEditing({ ...editing, [f]: e.target.value }) : setDraft({ ...draft, [f]: e.target.value })}
                  required />
              </div>
            )))}
            <div className="adm-field">
              <label>Позиция</label>
              <input type="number" value={editing ? editing.position : draft.position}
                onChange={e => editing ? setEditing({ ...editing, position: Number(e.target.value) }) : setDraft({ ...draft, position: Number(e.target.value) })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="adm-btn">{editing ? 'Сохранить' : 'Создать'}</button>
              {editing && <button type="button" className="adm-btn secondary" onClick={() => setEditing(null)}>Отмена</button>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
