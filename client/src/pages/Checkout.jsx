import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart, useAuth } from '../store.js';
import { formatPrice } from '../api.js';
import { phoneMask, validatePhone, validateName, validateAddress } from '../utils/forms.js';

export default function Checkout() {
  const { user } = useAuth();
  const items = useCart(s => s.items);
  const total = useCart(s => s.total());
  const [first, setFirst] = useState(user?.first_name || '');
  const [last, setLast] = useState(user?.last_name || '');
  const [phone, setPhone] = useState(phoneMask(user?.phone || ''));
  const [address, setAddress] = useState('');
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  const errs = {
    first: validateName(first, 'Имя'),
    last: validateName(last, 'Фамилия'),
    phone: validatePhone(phone),
    address: validateAddress(address)
  };
  const hasErrs = Object.values(errs).some(Boolean);

  const submit = (e) => {
    e.preventDefault();
    setTouched({ first: true, last: true, phone: true, address: true });
    if (hasErrs) return;
    sessionStorage.setItem('checkout', JSON.stringify({ first_name: first, last_name: last, phone, address }));
    navigate('/payment');
  };

  const fld = (k) => 'input-line' + (touched[k] && errs[k] ? ' invalid' : '');
  const blur = (k) => () => setTouched(t => ({ ...t, [k]: true }));

  if (items.length === 0) return (
    <main className="container" style={{ textAlign: 'center', padding: '120px 0' }}>
      <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Корзина пуста</p>
      <Link to="/" className="btn">К покупкам</Link>
    </main>
  );

  return (
    <main className="container" style={{ paddingBottom: 100 }}>
      <nav className="breadcrumb">
        <Link to="/">Главная</Link>
        <span className="sep">—</span>
        <Link to="/cart">Корзина</Link>
        <span className="sep">—</span>
        <span className="current">Оформление заказа</span>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60 }} className="checkout-grid">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', textTransform: 'uppercase', margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            Заполните данные для оформления заказа
          </h1>
          <form onSubmit={submit} noValidate>
            <div className="field"><label className="field-label">Имя</label>
              <input className={fld('first')} autoComplete="given-name" value={first}
                onChange={e => setFirst(e.target.value)} onBlur={blur('first')} />
              {touched.first && errs.first && <div className="field-error">{errs.first}</div>}
            </div>
            <div className="field"><label className="field-label">Фамилия</label>
              <input className={fld('last')} autoComplete="family-name" value={last}
                onChange={e => setLast(e.target.value)} onBlur={blur('last')} />
              {touched.last && errs.last && <div className="field-error">{errs.last}</div>}
            </div>
            <div className="field"><label className="field-label">Номер телефона</label>
              <input className={fld('phone')} inputMode="tel" autoComplete="tel" value={phone}
                onChange={e => setPhone(phoneMask(e.target.value))} onBlur={blur('phone')}
                placeholder="+7 (___) ___-__-__" />
              {touched.phone && errs.phone && <div className="field-error">{errs.phone}</div>}
            </div>
            <div className="field"><label className="field-label">Адрес доставки</label>
              <input className={fld('address')} autoComplete="street-address" value={address}
                onChange={e => setAddress(e.target.value)} onBlur={blur('address')}
                placeholder="Город, улица, дом, квартира" />
              {touched.address && errs.address && <div className="field-error">{errs.address}</div>}
            </div>
            <div style={{ background: 'var(--bg-soft)', padding: 18, borderRadius: 4, fontSize: 13, lineHeight: 1.6 }}>
              <b>Способ оплаты:</b> Банковской картой, СБП, TPay, SberPay, иностранной картой и Долями.
            </div>
            <button className="btn btn-primary btn-block" style={{ marginTop: 30 }}>
              Перейти к оплате →
            </button>
          </form>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ background: 'var(--bg-soft)', padding: 24, borderRadius: 4 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Ваш заказ</div>
              {items.map((it, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                  <div style={{ width: 60, height: 60, background: '#fff', flex: '0 0 60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={it.image} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </div>
                  <div style={{ flex: 1, fontSize: 13 }}>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    <div style={{ color: 'var(--muted)', fontSize: 11 }}>{it.variant} • {it.size} × {it.qty}</div>
                  </div>
                  <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, fontSize: 13 }}>
                    {formatPrice(it.price * it.qty)}
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 18 }}>
                <span style={{ fontFamily: 'Unbounded', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>Итого</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 22 }}>{formatPrice(total)}</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', letterSpacing: '0.18em', textTransform: 'uppercase' }}>* до вычета налогов</div>
            </div>
          </div>
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 900px) { .checkout-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </main>
  );
}
