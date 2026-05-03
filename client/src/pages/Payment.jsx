import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../store.js';
import { api, formatPrice } from '../api.js';
import {
  cardMask, validateCard, detectCardBrand,
  expMask, validateExp,
  cvcMask, validateCVC,
  cardNameMask, validateCardName
} from '../utils/forms.js';

export default function Payment() {
  const items = useCart(s => s.items);
  const total = useCart(s => s.total());
  const clear = useCart(s => s.clear);
  const navigate = useNavigate();
  const checkout = JSON.parse(sessionStorage.getItem('checkout') || '{}');

  const [card, setCard] = useState('');
  const [exp, setExp] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState({});
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const errs = {
    card: validateCard(card),
    exp: validateExp(exp),
    code: validateCVC(code),
    name: validateCardName(name)
  };
  const hasErrs = Object.values(errs).some(Boolean);
  const brand = detectCardBrand(card);

  const submit = async (e) => {
    e.preventDefault();
    setTouched({ card: true, exp: true, code: true, name: true });
    if (!checkout.first_name) return navigate('/checkout');
    if (hasErrs) return;
    setBusy(true); setErr('');
    try {
      const order = await api.post('/orders', {
        ...checkout,
        items: items.map(i => ({ product_id: i.product_id, size: i.size, qty: i.qty })),
        payment_method: 'card'
      });
      clear();
      sessionStorage.removeItem('checkout');
      navigate('/order/' + order.id + '/success');
    } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const fld = (k) => 'input-line' + (touched[k] && errs[k] ? ' invalid' : '');
  const blur = (k) => () => setTouched(t => ({ ...t, [k]: true }));

  return (
    <main className="container" style={{ paddingBottom: 100 }}>
      <nav className="breadcrumb">
        <Link to="/">Главная</Link>
        <span className="sep">—</span>
        <Link to="/cart">Корзина</Link>
        <span className="sep">—</span>
        <span className="current">Оплата</span>
      </nav>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 60 }} className="payment-grid">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontFamily: 'Unbounded', fontWeight: 800, fontSize: 'clamp(22px,3vw,32px)', textTransform: 'uppercase', margin: '0 0 32px' }}>
            Оплатить картой
          </h1>

          <CardPreview number={card} name={name} exp={exp} brand={brand} />

          <form onSubmit={submit} style={{ marginTop: 30 }} noValidate>
            <div className="field"><label className="field-label">
              Номер карты {brand && <span style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 0, textTransform: 'uppercase' }}>{brand}</span>}
            </label>
              <input className={fld('card')} inputMode="numeric" autoComplete="cc-number"
                value={card} onChange={e => setCard(cardMask(e.target.value))}
                onBlur={blur('card')} placeholder="0000 0000 0000 0000" />
              {touched.card && errs.card && <div className="field-error">{errs.card}</div>}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div className="field"><label className="field-label">Срок</label>
                <input className={fld('exp')} inputMode="numeric" autoComplete="cc-exp"
                  value={exp} onChange={e => setExp(expMask(e.target.value))}
                  onBlur={blur('exp')} placeholder="MM/ГГ" />
                {touched.exp && errs.exp && <div className="field-error">{errs.exp}</div>}
              </div>
              <div className="field"><label className="field-label">CVC</label>
                <input className={fld('code')} inputMode="numeric" autoComplete="cc-csc" type="password"
                  value={code} onChange={e => setCode(cvcMask(e.target.value))}
                  onBlur={blur('code')} placeholder="•••" />
                {touched.code && errs.code && <div className="field-error">{errs.code}</div>}
              </div>
            </div>
            <div className="field"><label className="field-label">Имя владельца</label>
              <input className={fld('name')} autoComplete="cc-name"
                value={name} onChange={e => setName(cardNameMask(e.target.value))}
                onBlur={blur('name')} placeholder="ANDREY KREMNEV" />
              {touched.name && errs.name && <div className="field-error">{errs.name}</div>}
            </div>
            {err && <div className="alert" style={{ marginBottom: 18 }}>{err}</div>}
            <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginTop: 24, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'JetBrains Mono', fontWeight: 800, fontSize: 24 }}>{formatPrice(total)}</div>
              <button className="btn btn-primary" style={{ flex: 1, minWidth: 180 }} disabled={busy}>
                {busy ? 'Обработка...' : 'Оплатить'}
              </button>
            </div>
            <div className="field-hint" style={{ marginTop: 14, textAlign: 'center' }}>
              🔒 Демо-оплата. Используйте, например, 4242 4242 4242 4242 (Visa, Luhn-валидный)
            </div>
          </form>
        </motion.div>

        <motion.div initial={{ scale: 1.05, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: .8 }}
          style={{ borderRadius: 4, overflow: 'hidden', height: '100%', minHeight: 600 }}>
          <img src="https://placehold.co/800x1100/121212/eaeaea?text=SHIPPING+WORLDWIDE"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
        </motion.div>
      </div>
      <style>{`
        @media (max-width: 900px) { .payment-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </main>
  );
}

function CardPreview({ number, name, exp, brand }) {
  const display = number || '';
  const padded = (display + ' '.repeat(19)).slice(0, 19).split('').map(ch => ch === ' ' ? ' ' : (ch.match(/\d/) ? ch : '•')).join('');
  const final = display.length === 0 ? '•••• •••• •••• ••••' : padded.replace(/\s$/, '').padEnd(19, '•');
  return (
    <motion.div
      whileHover={{ rotateY: 8, rotateX: -4 }}
      transition={{ type: 'spring', stiffness: 200 }}
      style={{
        width: '100%', maxWidth: 420,
        aspectRatio: '1.586/1',
        background: 'linear-gradient(135deg, #1f1f1f, #000)',
        color: '#fff',
        borderRadius: 16,
        padding: 28,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        boxShadow: '0 30px 60px -20px rgba(0,0,0,.4)',
        position: 'relative', overflow: 'hidden'
      }}>
      <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, background: 'radial-gradient(circle, rgba(255,58,31,.4), transparent 70%)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: 'Unbounded', fontWeight: 800, letterSpacing: '0.04em' }}>TOMMYSINNY</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <div style={{ width: 40, height: 30, background: 'linear-gradient(135deg, #c89c2b, #fde6a0)', borderRadius: 4 }} />
          {brand && <div style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', opacity: .8 }}>{brand}</div>}
        </div>
      </div>
      <div style={{ fontFamily: 'JetBrains Mono', fontSize: 22, letterSpacing: '0.08em', wordSpacing: '0.2em' }}>
        {final}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono', fontSize: 13 }}>
        <div>{(name || 'YOUR NAME').slice(0, 26)}</div>
        <div>{exp || 'MM/ГГ'}</div>
      </div>
    </motion.div>
  );
}
