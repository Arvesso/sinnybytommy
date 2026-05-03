import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useCart, useUI } from '../store.js';
import { api } from '../api.js';
import Logo from './Logo.jsx';
import './Header.css';

export default function Header() {
  const { user } = useAuth();
  const cartCount = useCart(s => s.count());
  const { menuOpen, setMenu } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen || !query) { setResults([]); return; }
    const t = setTimeout(async () => {
      try {
        const list = await api.get('/products?q=' + encodeURIComponent(query) + '&limit=8');
        setResults(list);
      } catch {}
    }, 250);
    return () => clearTimeout(t);
  }, [query, searchOpen]);

  return (
    <>
      <header className={'site-header' + (scrolled ? ' scrolled' : '')}>
        <div className="header-inner">
          <button className="menu-btn" onClick={() => setMenu(true)} aria-label="Меню">
            <span /><span /><span />
          </button>

          <Link to="/" className="brand" aria-label="TommySinny">
            <span className="brand-desktop"><Logo size={36} variant="mirror" /></span>
            <span className="brand-mobile">TOMMYSINNY</span>
          </Link>

          <div className="header-right">
            <button className="hr-btn search-btn" onClick={() => setSearchOpen(true)}>
              <span className="hr-label">поиск</span>
              <span className="hr-line" />
            </button>
            <Link to={user ? '/account' : '/login'} className="hr-btn account-btn">
              <span className="hr-label-full">{user ? (user.first_name?.toUpperCase() || 'КАБИНЕТ') : 'войти в кабинет'}</span>
              <span className="hr-label-short">{user ? (user.first_name?.toUpperCase() || 'КАБИНЕТ') : 'вход'}</span>
            </Link>
            <Link to="/cart" className="hr-btn cart-btn">
              <span className="hr-label-full">корзина</span>
              <span className="hr-label-short">cart</span>
              {cartCount > 0 && <span className="cart-pill">{cartCount}</span>}
            </Link>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && <SideMenu onClose={() => setMenu(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && (
          <motion.div className="search-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="search-panel"
              initial={{ y: -40 }} animate={{ y: 0 }} exit={{ y: -40 }}
              transition={{ type: 'tween', duration: .35, ease: [.7, 0, .2, 1] }}>
              <div className="search-head">
                <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
                  placeholder="Что ищем?" />
                <button onClick={() => { setSearchOpen(false); setQuery(''); }}>×</button>
              </div>
              {results.length > 0 && (
                <div className="search-results">
                  {results.map(p => (
                    <Link key={p.id} to={`/product/${p.id}`}
                      onClick={() => { setSearchOpen(false); setQuery(''); }}>
                      <img src={p.image} alt="" />
                      <div>
                        <div className="sr-name">{p.name}</div>
                        <div className="sr-variant">{p.variant}</div>
                      </div>
                      <div className="sr-price">{new Intl.NumberFormat('ru').format(p.price)}₽</div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SideMenu({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: '/catalog/jackets', label: 'Куртки и верхняя одежда' },
    { to: '/catalog/t-shirts', label: 'Футболки' },
    { to: '/catalog/hoodies', label: 'Худи' },
    { to: '/catalog/pants', label: 'Штаны' },
    { to: '/catalog/accessories', label: 'Сумки и аксессуары' },
    { to: '/catalog/popular', label: 'Популярные товары' }
  ];

  return (
    <motion.div className="side-menu-wrap"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}>
      <motion.aside className="side-menu" onClick={e => e.stopPropagation()}
        initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
        transition={{ type: 'tween', duration: .45, ease: [.7, 0, .2, 1] }}>
        <button className="sm-close" onClick={onClose}>×</button>
        <div className="sm-eyebrow">КАТАЛОГ</div>
        <nav className="sm-nav">
          {links.map((l, i) => (
            <motion.div key={l.to}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 + i * 0.05 }}>
              <Link to={l.to} onClick={onClose}>{l.label}</Link>
            </motion.div>
          ))}
        </nav>
        <div className="sm-eyebrow" style={{ marginTop: 48 }}>АККАУНТ</div>
        <nav className="sm-nav small">
          {user ? (
            <>
              <Link to="/account" onClick={onClose}>Личный кабинет</Link>
              {user.is_admin && <Link to="/admin" onClick={onClose}>Админ-панель</Link>}
              <button onClick={async () => { await logout(); onClose(); navigate('/'); }}>Выйти</button>
            </>
          ) : (
            <Link to="/login" onClick={onClose}>Войти / зарегистрироваться</Link>
          )}
          <Link to="/cart" onClick={onClose}>Корзина</Link>
        </nav>
      </motion.aside>
    </motion.div>
  );
}
