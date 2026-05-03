import React from 'react';
import { Link } from 'react-router-dom';
// logo SVG used directly via <img>
import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="ticker">
        <div className="ticker-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i}>
              <span>TOMMYSINNY®</span>
              <span className="dot" />
              <span>HAPPY 25</span>
              <span className="dot" />
              <span>LAST CHANCE®</span>
              <span className="dot" />
              <span>NEW DROP</span>
              <span className="dot" />
            </span>
          ))}
        </div>
      </div>
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/logo.svg" alt="TommySinny" className="footer-logo" />
        </div>
        <div className="footer-col">
          <div className="fc-title">КАТАЛОГ</div>
          <Link to="/catalog/jackets">Куртки и верхняя одежда</Link>
          <Link to="/catalog/t-shirts">Футболки</Link>
          <Link to="/catalog/hoodies">Худи</Link>
          <Link to="/catalog/pants">Штаны</Link>
          <Link to="/catalog/accessories">Сумки и аксессуары</Link>
          <Link to="/catalog/popular">Популярные товары</Link>
        </div>
        <div className="footer-col">
          <div className="fc-title">КАРТА САЙТА</div>
          <Link to="/account">Войти в личный кабинет</Link>
          <Link to="/cart">Корзина</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} TOMMYSINNY®. Все права защищены.</span>
        <span>MADE WITH LOVE × TommySinny Lab</span>
      </div>
    </footer>
  );
}
