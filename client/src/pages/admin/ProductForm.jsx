import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../api.js';

const empty = { category_id: '', name: '', variant: '', price: 0, image: '', sizes: 'S,M,L,XL', description: '', is_popular: 0, in_stock: 1 };

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cats, setCats] = useState([]);
  const [data, setData] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.get('/admin/categories').then(setCats);
    if (id) api.get('/products/' + id).then(setData);
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const payload = { ...data, price: Number(data.price), category_id: data.category_id || null };
      if (id) await api.put('/admin/products/' + id, payload);
      else await api.post('/admin/products', payload);
      navigate('/admin/products');
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const onFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const r = await api.upload(file);
      setData(d => ({ ...d, image: r.url }));
    } catch (e) { setErr(e.message); } finally { setUploading(false); }
  };

  return (
    <>
      <h1>{id ? 'Редактирование товара' : 'Новый товар'}</h1>
      <p className="admin-sub"><Link to="/admin/products" style={{ color: '#909090' }}>← К списку товаров</Link></p>

      <div className="admin-card" style={{ maxWidth: 1000 }}>
        <form onSubmit={submit} className="adm-form">
          <div className="adm-field">
            <label>Название</label>
            <input value={data.name} onChange={e => setData({ ...data, name: e.target.value })} required />
          </div>
          <div className="adm-field">
            <label>Вариант / цвет</label>
            <input value={data.variant} onChange={e => setData({ ...data, variant: e.target.value })} />
          </div>
          <div className="adm-field">
            <label>Категория</label>
            <select value={data.category_id || ''} onChange={e => setData({ ...data, category_id: e.target.value })}>
              <option value="">— без категории —</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="adm-field">
            <label>Цена (₽)</label>
            <input type="number" min="0" value={data.price} onChange={e => setData({ ...data, price: e.target.value })} required />
          </div>
          <div className="adm-field full">
            <label>Размеры (через запятую)</label>
            <input value={data.sizes} onChange={e => setData({ ...data, sizes: e.target.value })} placeholder="S,M,L,XL или one size" />
          </div>
          <div className="adm-field full">
            <label>Описание</label>
            <textarea rows="4" value={data.description} onChange={e => setData({ ...data, description: e.target.value })} />
          </div>
          <div className="adm-field full">
            <label>Изображение</label>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 140, height: 140, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, padding: 8, flex: '0 0 140px' }}>
                {data.image ? <img src={data.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <span style={{ color: '#aaa', fontSize: 12 }}>нет фото</span>}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input value={data.image} onChange={e => setData({ ...data, image: e.target.value })} placeholder="URL или /uploads/..." />
                <label className="adm-btn secondary" style={{ display: 'inline-block', textAlign: 'center', cursor: 'pointer' }}>
                  {uploading ? 'Загрузка...' : 'Загрузить файл'}
                  <input type="file" accept="image/*" hidden onChange={e => onFile(e.target.files[0])} />
                </label>
              </div>
            </div>
          </div>
          <div className="adm-field">
            <label>В наличии</label>
            <select value={data.in_stock ? '1' : '0'} onChange={e => setData({ ...data, in_stock: e.target.value === '1' ? 1 : 0 })}>
              <option value="1">Да</option>
              <option value="0">Нет</option>
            </select>
          </div>
          <div className="adm-field">
            <label>Популярный</label>
            <select value={data.is_popular ? '1' : '0'} onChange={e => setData({ ...data, is_popular: e.target.value === '1' ? 1 : 0 })}>
              <option value="0">Нет</option>
              <option value="1">Да — показать на главной</option>
            </select>
          </div>
          {err && <div className="full" style={{ background: '#3a0e0e', color: '#ff8e8e', padding: 12, borderRadius: 6 }}>{err}</div>}
          <div className="full" style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
            <Link to="/admin/products" className="adm-btn secondary">Отмена</Link>
            <button className="adm-btn" disabled={busy}>{busy ? 'Сохраняем...' : 'Сохранить'}</button>
          </div>
        </form>
      </div>
    </>
  );
}
