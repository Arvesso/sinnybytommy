import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api.js';
import ProductCard from '../components/ProductCard.jsx';
// crest replaced with /logo.svg
import './Home.css';

export default function Home() {
  const [data, setData] = useState(null);
  useEffect(() => { api.get('/home').then(setData); }, []);

  if (!data) return <div className="spinner" />;

  return (
    <main>
      <Hero slides={data.slides} />
      <PopularSection products={data.popular} />
      <Lookbook items={data.lookbook} />
      <AboutBrand markImage={data.about?.mark_image} sideImage={data.about?.side_image} />
      <Celebrities items={data.celebrities} />
    </main>
  );
}

function Hero({ slides }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    const t = setInterval(() => setI(v => (v + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length, paused]);

  if (!slides.length) return null;
  const current = slides[i];

  return (
    <section className="hero"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <AnimatePresence>
        <motion.div className="hero-slide" key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .9, ease: 'easeOut' }}>
          <img src={current.image} alt={current.title} />
          <div className="hero-vignette" />
        </motion.div>
      </AnimatePresence>

      <div className="hero-content">
        <div className="hero-eyebrow">{current.subtitle}</div>
        <motion.h1 key={i + '-t'}
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .55, ease: 'easeOut' }}>
          {current.title}
        </motion.h1>
        <Link to={current.link || '/catalog/jackets'} className="btn btn-primary hero-cta">
          смотреть коллекцию →
        </Link>
      </div>

      <div className="hero-arrows">
        <button onClick={() => setI(v => (v - 1 + slides.length) % slides.length)} aria-label="prev">←</button>
        <button onClick={() => setI(v => (v + 1) % slides.length)} aria-label="next">→</button>
      </div>
      <div className="hero-dots">
        {slides.map((_, n) => (
          <button key={n} onClick={() => setI(n)} className={n === i ? 'active' : ''} aria-label={`slide ${n+1}`} />
        ))}
      </div>
      <div className="hero-scroll">SCROLL ↓</div>
    </section>
  );
}

function PopularSection({ products }) {
  const [page, setPage] = useState(0);
  const perPage = 4;
  const max = Math.ceil(products.length / perPage);
  const visible = products.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">DROP 25 — IN STOCK</span>
          <h2 className="section-title">Популярные товары</h2>
        </div>
        <div className="slider-controls">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} aria-label="prev">←</button>
          <button onClick={() => setPage(p => Math.min(max - 1, p + 1))} disabled={page >= max - 1} aria-label="next">→</button>
        </div>
      </div>
      <div className="grid-popular">
        <div key={page} className="grid-popular-inner">
          {visible.map((p, i) => <ProductCard key={p.id + '-' + page} product={p} index={i} />)}
        </div>
      </div>
      <div className="center-row">
        <Link to="/catalog/popular" className="btn">В каталог →</Link>
      </div>
    </section>
  );
}

function Lookbook({ items }) {
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">SS25 / FALL EDITORIAL</span>
          <h2 className="section-title">Лукбук</h2>
        </div>
      </div>
      <div className="lookbook">
        {items.map((item, i) => (
          <div key={item.id} className="lookbook-item reveal" style={{ '--reveal-delay': `${i * 0.08}s` }}>
            <div className="lookbook-img">
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className="lookbook-overlay">
                <span>{item.title}</span>
              </div>
            </div>
            <div className="lookbook-cap">{item.title}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AboutBrand({ markImage, sideImage }) {
  return (
    <section className="container section about-section">
      <div className="section-head">
        <div>
          <span className="eyebrow">MANIFESTO / EST. 2024</span>
          <h2 className="section-title">О бренде</h2>
        </div>
      </div>
      <div className="about-card">
        <div className="about-mark">
          <img src={markImage || 'https://placehold.co/600x600/0a0a0a/2a2a2a?text=%E2%9C%A6'} alt="" loading="lazy" />
        </div>
        <div className="about-text">
          <div className="about-text-head">
            <img src="/logo.svg" alt="" className="about-text-crest" />
            <span className="about-text-title">TOMMYSINNY</span>
            <img src="/logo-2.svg" alt="" className="about-text-crest" />
          </div>
          <p>
            <b>TOMMYSINNY</b> — это не просто одежда. Это социальный эксперимент
            и сатира на современную культуру потребления, гламур и стритвир-индустрию.
          </p>
          <p>
            Бренд строится на парадоксе: сознательное использование «кричащего»,
            «провинциального гламура» и мем-эстетики нулевых, возведённых
            в абсолют и упакованных в дорогой, качественный продукт. Это высмеивание
            трендов через их максимальное, абсурдное преувеличение.
          </p>
          <Link to="/catalog/popular" className="btn about-cta">Ты уже в семье →</Link>
        </div>
        <div className="about-side">
          <img src={sideImage || 'https://placehold.co/700x900/0a0a0a/eaeaea?text=TOMMYSINNY+CREW'} alt="crew" loading="lazy" />
        </div>
      </div>
    </section>
  );
}

function Celebrities({ items }) {
  return (
    <section className="container section">
      <div className="section-head">
        <div>
          <span className="eyebrow">SEEN ON</span>
          <h2 className="section-title">Селебрити</h2>
        </div>
      </div>
      <div className="celebs">
        {items.map((c, i) => (
          <div key={c.id} className="celeb reveal" style={{ '--reveal-delay': `${i * 0.06}s` }}>
            <img src={c.image} alt={c.name} loading="lazy" />
            <div className="celeb-name">{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
