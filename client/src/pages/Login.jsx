import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../store.js';
import { phoneMask, validatePhone } from '../utils/forms.js';

export default function Login() {
  const [phone, setPhone] = useState(phoneMask(''));
  const [touched, setTouched] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const { startAuth } = useAuth();
  const navigate = useNavigate();

  const phoneErr = validatePhone(phone);
  const showPhoneErr = touched && phoneErr;

  const submit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (phoneErr) return;
    setErr('');
    setBusy(true);
    try {
      const r = await startAuth(phone);
      if (r.needsProfile) navigate('/register');
      else navigate('/account');
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  return (
    <div className="auth-layout">
      <motion.div className="auth-side"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, ease: [.2,.6,.2,1] }}>
        <div className="auth-form-wrap">
          <Link to="/" style={{ display: 'inline-block', marginBottom: 60 }}>
            <Logo size={28} />
          </Link>

          <nav className="breadcrumb" style={{ paddingTop: 0, marginBottom: 24 }}>
            <Link to="/">Главная</Link>
            <span className="sep">—</span>
            <Link to="/login">Личный кабинет</Link>
            <span className="sep">—</span>
            <span className="current">Регистрация</span>
          </nav>

          <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(20px, 5.4vw, 28px)', textTransform: 'uppercase', letterSpacing: '-0.01em', margin: '0 0 32px', lineHeight: 1.1 }}>
            войти или<br/>зарегистрироваться
          </h1>

          <form onSubmit={submit} noValidate>
            <div className="field">
              <label className="field-label">Номер телефона</label>
              <input
                className={'input-line' + (showPhoneErr ? ' invalid' : '')}
                inputMode="tel"
                autoComplete="tel"
                value={phone}
                onChange={e => setPhone(phoneMask(e.target.value))}
                onBlur={() => setTouched(true)}
                placeholder="+7 (___) ___-__-__" />
              {showPhoneErr ? <div className="field-error">{phoneErr}</div>
                : <div className="field-hint">Мы отправим SMS с подтверждением (демо: код не нужен)</div>}
            </div>
            {err && <div className="alert" style={{ marginBottom: 18 }}>{err}</div>}
            <button className="btn btn-primary btn-block" disabled={busy}>
              {busy ? 'Подождите...' : 'Продолжить'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 24, lineHeight: 1.6 }}>
            Нажимая «Продолжить» вы соглашаетесь с условиями обработки персональных данных.
          </p>
        </div>
      </motion.div>
      <motion.div className="auth-image"
        initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: [.7,0,.2,1] }}>
        <img src="https://placehold.co/1000x1400/2a2a2a/eaeaea?text=TOMMYSINNY+%E2%80%A2+CREW" alt="" />
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
