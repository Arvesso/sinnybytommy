import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store.js';
import { Crest } from '../../components/Logo.jsx';
import './admin.css';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const items = [
    { to: '/admin', label: 'Дашборд', icon: '◈', end: true },
    { to: '/admin/products', label: 'Товары', icon: '☰' },
    { to: '/admin/categories', label: 'Категории', icon: '⊟' },
    { to: '/admin/orders', label: 'Заказы', icon: '✦' },
    { to: '/admin/users', label: 'Пользователи', icon: '◉' },
    { to: '/admin/content', label: 'Главная', icon: '✺' }
  ];

  return (
    <div className={'admin-shell' + (menuOpen ? ' menu-open' : '')}>
      <header className="admin-topbar">
        <button className="admin-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Меню">
          <span /><span /><span />
        </button>
        <div className="admin-topbar-title">TommySinny — Admin</div>
      </header>
      {menuOpen && <div className="admin-backdrop" onClick={() => setMenuOpen(false)} />}
      <aside className="admin-sidebar">
        <Link to="/" className="admin-brand" aria-label="TommySinny — на сайт">
          <Crest size={32} invert />
        </Link>
        <div className="admin-greeting">
          <div className="eyebrow">Панель</div>
          <div style={{ fontWeight: 700, marginTop: 4 }}>{user?.first_name || 'Админ'}</div>
        </div>
        <nav className="admin-nav">
          {items.map(it => (
            <NavLink key={it.to} to={it.to} end={it.end}>
              <span className="ic">{it.icon}</span>
              <span>{it.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="admin-foot">
          <Link to="/" className="muted-btn">← На сайт</Link>
          <button className="muted-btn" onClick={async () => { await logout(); navigate('/'); }}>Выйти</button>
        </div>
      </aside>
      <main className="admin-main" key={location.pathname}>
        <Outlet />
      </main>
    </div>
  );
}
