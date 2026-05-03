import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../api.js';

export default function ProductCard({ product, index = 0 }) {
  const delay = Math.min(index * 0.04, 0.32);
  return (
    <Link
      to={`/product/${product.id}`}
      className="product-card reveal"
      style={{ '--reveal-delay': `${delay}s` }}
    >
      {product.is_popular ? <span className="popular-badge">Популярное</span> : null}
      <div className="img-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
      </div>
      <div className="info">
        <div className="name">{product.name}<br/>{product.variant}</div>
        <div className="price">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
}
