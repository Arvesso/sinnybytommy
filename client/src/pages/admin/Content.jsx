import React, { useEffect, useState } from 'react';
import { api } from '../../api.js';

const TABS = [
  { id: 'slides', label: 'Hero-слайды', table: 'slides', fields: ['title', 'subtitle', 'image', 'link', 'position'] },
  { id: 'lookbook', label: 'Лукбук', table: 'lookbook', fields: ['title', 'image', 'position'] },
  { id: 'celebrities', label: 'Селебрити', table: 'celebrities', fields: ['name', 'image', 'position'] },
  { id: 'about', label: 'О бренде', kind: 'settings' }
];

export default function Content() {
  const [tab, setTab] = useState(TABS[0]);
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = () => {
    if (tab.kind === 'settings') return;
    api.get('/admin/' + tab.table).then(setList);
  };
  useEffect(() => { setEditing(null); load(); }, [tab]);

  const onSave = async (e) => {
    e.preventDefault();
    if (editing.id) await api.put('/admin/' + tab.table + '/' + editing.id, editing);
    else await api.post('/admin/' + tab.table, editing);
    setEditing(null);
    load();
  };

  const onDelete = async (id) => {
    if (!confirm('Удалить?')) return;
    await api.del('/admin/' + tab.table + '/' + id);
    load();
  };

  const onUpload = async (file) => {
    if (!file) return;
    const r = await api.upload(file);
    setEditing(e => ({ ...e, image: r.url }));
  };

  const newItem = () => {
    const blank = {};
    tab.fields.forEach(f => { blank[f] = f === 'position' ? list.length : ''; });
    setEditing(blank);
  };

  return (
    <>
      <h1>Контент главной</h1>
      <p className="admin-sub">Редактируйте hero-слайдер, лукбук и блок селебрити</p>

      <div className="adm-toolbar">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {TABS.map(t => (
            <button key={t.id} className={'adm-btn tiny ' + (tab.id === t.id ? '' : 'secondary')} onClick={() => setTab(t)}>{t.label}</button>
          ))}
        </div>
        {tab.kind !== 'settings' && <button className="adm-btn" onClick={newItem}>+ Добавить</button>}
      </div>

      {tab.kind === 'settings' && <AboutSettings />}
      {tab.kind === 'settings' ? null : null}

      {tab.kind !== 'settings' && (
      <div className="dash-2col" style={{ display: 'grid', gridTemplateColumns: editing ? '1.4fr 1fr' : '1fr', gap: 18 }}>
        <div className="admin-card">
          <table className="admin-table">
            <thead><tr><th></th>{tab.fields.filter(f => f !== 'image').map(f => <th key={f}>{f}</th>)}<th></th></tr></thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id}>
                  <td><div className="ph">{item.image && <img src={item.image} alt="" />}</div></td>
                  {tab.fields.filter(f => f !== 'image').map(f => <td key={f}>{item[f]}</td>)}
                  <td className="actions">
                    <button className="adm-btn secondary tiny" onClick={() => setEditing({ ...item })}>Изменить</button>
                    <button className="adm-btn danger tiny" onClick={() => onDelete(item.id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {editing && (
          <div className="admin-card">
            <h2>{editing.id ? 'Редактировать' : 'Создать'}</h2>
            <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tab.fields.map(f => (
                <div key={f} className="adm-field">
                  <label>{f}</label>
                  {f === 'image' ? (
                    <>
                      <input value={editing[f] || ''} onChange={e => setEditing({ ...editing, [f]: e.target.value })} placeholder="URL или /uploads/..." />
                      <label className="adm-btn secondary tiny" style={{ marginTop: 6, cursor: 'pointer', display: 'inline-block' }}>
                        Загрузить файл
                        <input type="file" hidden accept="image/*" onChange={e => onUpload(e.target.files[0])} />
                      </label>
                      {editing[f] && <div className="ph" style={{ marginTop: 8, width: 100, height: 100 }}><img src={editing[f]} alt="" /></div>}
                    </>
                  ) : f === 'position' ? (
                    <input type="number" value={editing[f] || 0} onChange={e => setEditing({ ...editing, [f]: Number(e.target.value) })} />
                  ) : (
                    <input value={editing[f] || ''} onChange={e => setEditing({ ...editing, [f]: e.target.value })} />
                  )}
                </div>
              ))}
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="adm-btn">Сохранить</button>
                <button type="button" className="adm-btn secondary" onClick={() => setEditing(null)}>Отмена</button>
              </div>
            </form>
          </div>
        )}
      </div>
      )}
    </>
  );
}

function AboutSettings() {
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(s => setData({
      about_mark_image: s.about_mark_image || '',
      about_side_image: s.about_side_image || ''
    }));
  }, []);

  const upload = async (key, file) => {
    if (!file) return;
    const r = await api.upload(file);
    setData(d => ({ ...d, [key]: r.url }));
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    await api.put('/admin/settings', data);
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!data) return <div className="spinner" />;

  const fields = [
    { key: 'about_mark_image', label: 'Левая картинка (декоративный знак)' },
    { key: 'about_side_image', label: 'Правая картинка (фото команды)' }
  ];

  return (
    <div className="admin-card" style={{ maxWidth: 900 }}>
      <h2>Изображения блока «О бренде»</h2>
      <p style={{ color: '#909090', fontSize: 13, marginTop: -8, marginBottom: 18 }}>
        Замените их на реальные фото — изменения появятся на главной сразу после сохранения.
      </p>
      <form onSubmit={save} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {fields.map(f => (
          <div key={f.key} className="adm-field">
            <label>{f.label}</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 160, height: 160, background: '#1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, overflow: 'hidden', flex: '0 0 160px' }}>
                {data[f.key]
                  ? <img src={data[f.key]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ color: '#666', fontSize: 12 }}>нет фото</span>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input value={data[f.key]} onChange={e => setData({ ...data, [f.key]: e.target.value })} placeholder="URL или /uploads/..." />
                <label className="adm-btn secondary" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>
                  Загрузить файл
                  <input type="file" hidden accept="image/*" onChange={e => upload(f.key, e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
          <button className="adm-btn" disabled={busy}>{busy ? 'Сохраняем...' : 'Сохранить'}</button>
          {saved && <span style={{ color: '#2db771', fontSize: 13 }}>✓ Сохранено</span>}
        </div>
      </form>
    </div>
  );
}
