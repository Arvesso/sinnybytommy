import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';

const SPECIAL = {
  popular: 'Популярные товары',
  jackets: 'Куртки и верхняя одежда',
  't-shirts': 'Футболки',
  hoodies: 'Худи',
  pants: 'Штаны',
  accessories: 'Сумки и аксессуары'
};

export default function Catalog() {
  const { slug } = useParams();
  const [products, setProducts] = useState(null);
  const [sort, setSort] = useState('default');
  const title = SPECIAL[slug] || 'Каталог';

  useEffect(() => {
    setProducts(null);
    const url = slug === 'popular' ? '/products?popular=1' : '/products?category=' + slug;
    api.get(url).then(setProducts);
  }, [slug]);

  const sorted = (products || []).slice().sort((a, b) => {
    if (sort === 'price-asc') return a.price - b.price;
    if (sort === 'price-desc') return b.price - a.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link to="/">Главная</Link>
        <span className="sep">—</span>
        <span className="current">{title}</span>
      </nav>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
        <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 48px)', margin: 0, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
          {title}
        </h1>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center' }}>
          <span style={{ fontSize: 12, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            {products ? `${products.length} товаров` : '...'}
          </span>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ border: '1px solid var(--ink)', background: 'transparent', padding: '8px 14px', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
            <option value="default">по умолчанию</option>
            <option value="price-asc">цена ↑</option>
            <option value="price-desc">цена ↓</option>
            <option value="name">название</option>
          </select>
        </div>
      </div>

      {products === null ? <div className="spinner" /> :
        products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ fontSize: 18, color: 'var(--muted)' }}>В этой категории пока ничего нет.</p>
          </div>
        ) : (
          <div className="grid-products">
            {sorted.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )
      }
    </main>
  );
}
