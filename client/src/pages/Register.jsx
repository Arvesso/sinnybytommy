import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../store.js';
import { validateName } from '../utils/forms.js';

export default function Register() {
  const { user, complete } = useAuth();
  const [first, setFirst] = useState(user?.first_name || '');
  const [last, setLast] = useState(user?.last_name || '');
  const [touched, setTouched] = useState({});
  const [news, setNews] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" />;

  const errs = {
    first: validateName(first, 'Имя'),
    last: validateName(last, 'Фамилия')
  };
  const hasErrs = Object.values(errs).some(Boolean);

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ first: true, last: true });
    if (hasErrs) return;
    setErr(''); setBusy(true);
    try {
      await complete({ first_name: first, last_name: last, newsletter: news });
      navigate('/account');
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="auth-layout">
      <motion.div className="auth-side"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [.2,.6,.2,1] }}>
        <div className="auth-form-wrap">
          <Link to="/" style={{ display: 'inline-block', marginBottom: 60 }}><Logo size={28} /></Link>
          <nav className="breadcrumb" style={{ paddingTop: 0, marginBottom: 24 }}>
            <Link to="/">Главная</Link>
            <span className="sep">—</span>
            <Link to="/login">Личный кабинет</Link>
            <span className="sep">—</span>
            <span className="current">Регистрация</span>
          </nav>
          <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(22px, 5.4vw, 28px)', textTransform: 'uppercase', margin: '0 0 32px', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
            завершите регистрацию
          </h1>
          <form onSubmit={submit} noValidate>
            <div className="field">
              <label className="field-label">Имя</label>
              <input
                className={'input-line' + (touched.first && errs.first ? ' invalid' : '')}
                autoComplete="given-name"
                value={first} onChange={e => setFirst(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, first: true }))} />
              {touched.first && errs.first && <div className="field-error">{errs.first}</div>}
            </div>
            <div className="field">
              <label className="field-label">Фамилия</label>
              <input
                className={'input-line' + (touched.last && errs.last ? ' invalid' : '')}
                autoComplete="family-name"
                value={last} onChange={e => setLast(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, last: true }))} />
              {touched.last && errs.last && <div className="field-error">{errs.last}</div>}
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.7, margin: '14px 0 22px' }}>
              Нажимая кнопку «Продолжить», я подтверждаю, что прочитал(а) и принимаю условия покупки и понимаю информацию об использовании моих персональных данных.
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" checked={news} onChange={e => setNews(e.target.checked)} style={{ width: 18, height: 18 }} />
              Я хочу получать информацию о новинках TommySinny
            </label>
            {err && <div className="alert" style={{ marginBottom: 18 }}>{err}</div>}
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Подождите...' : 'Продолжить'}
            </button>
          </form>
        </div>
      </motion.div>
      <motion.div className="auth-image"
        initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
        <img src="https://placehold.co/1000x1400/2a2a2a/eaeaea?text=WELCOME+TO+THE+FAMILY" alt="" />
      </motion.div>
      <style>{`
        .auth-layout { min-height: 100vh; display: grid; grid-template-columns: 1fr 1.1fr; background: var(--bg); }
        .auth-side { padding: 40px; display: flex; align-items: flex-start; min-width: 0; }
        .auth-form-wrap { max-width: 460px; width: 100%; margin: 40px auto 0; }
        .auth-image { background: var(--ink); position: relative; overflow: hidden; }
        .auth-image img { width: 100%; height: 100%; object-fit: cover; }
        @media (max-width: 900px) {
          .auth-layout { grid-template-columns: 1fr; }
          .auth-image { display: none; }
        }
        @media (max-width: 520px) {
          .auth-side { padding: 24px 18px; }
          .auth-form-wrap { margin-top: 16px; }
        }
      `}</style>
    </div>
  );
}
