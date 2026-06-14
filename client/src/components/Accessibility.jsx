import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useA11y } from '../store.js';
import './Accessibility.css';

const FONTS = [
  { key: 'normal', label: 'А', size: 15 },
  { key: 'large',  label: 'А', size: 19 },
  { key: 'xlarge', label: 'А', size: 24 }
];

const SCHEMES = [
  { key: 'mono',  label: 'Ч/Б',     bg: '#ffffff', ink: '#000000' },
  { key: 'dark',  label: 'Инверсия', bg: '#000000', ink: '#ffec3d' },
  { key: 'beige', label: 'Бежевый',  bg: '#f7f1e1', ink: '#4a3a23' }
];

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function Accessibility() {
  const {
    enabled, panelOpen, font, scheme, spacing, images,
    togglePanel, closePanel, setFont, setScheme, setSpacing, setImages, reset
  } = useA11y();
  const ref = useRef(null);

  // закрытие по клику вне панели и по Escape
  useEffect(() => {
    if (!panelOpen) return;
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) closePanel(); };
    const onKey = (e) => { if (e.key === 'Escape') closePanel(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [panelOpen, closePanel]);

  return (
    <div className="a11y" ref={ref}>
      <button
        className={'hr-btn a11y-btn' + (enabled ? ' is-active' : '')}
        onClick={togglePanel}
        aria-label="Версия для слабовидящих"
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
      >
        <EyeIcon />
      </button>

      <AnimatePresence>
        {panelOpen && (
          <motion.div
            className="a11y-panel"
            role="dialog"
            aria-label="Настройки версии для слабовидящих"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'tween', duration: .22, ease: [.4, 0, .2, 1] }}
          >
            <div className="a11y-head">
              <span className="a11y-title">Версия для слабовидящих</span>
              <button className="a11y-x" onClick={closePanel} aria-label="Закрыть">×</button>
            </div>

            <div className="a11y-group">
              <div className="a11y-group-label">Размер шрифта</div>
              <div className="a11y-opts">
                {FONTS.map(f => (
                  <button
                    key={f.key}
                    className={'a11y-opt a11y-font' + (font === f.key ? ' is-on' : '')}
                    style={{ fontSize: f.size }}
                    onClick={() => setFont(f.key)}
                    aria-pressed={font === f.key}
                  >{f.label}</button>
                ))}
              </div>
            </div>

            <div className="a11y-group">
              <div className="a11y-group-label">Цветовая схема</div>
              <div className="a11y-opts">
                {SCHEMES.map(s => (
                  <button
                    key={s.key}
                    className={'a11y-opt a11y-scheme' + (scheme === s.key ? ' is-on' : '')}
                    onClick={() => setScheme(s.key)}
                    aria-pressed={scheme === s.key}
                  >
                    <span className="a11y-swatch" style={{ background: s.bg, color: s.ink, borderColor: s.ink }}>А</span>
                    <span className="a11y-swatch-label">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="a11y-group">
              <div className="a11y-group-label">Межбуквенный интервал</div>
              <div className="a11y-opts">
                <button className={'a11y-opt' + (spacing === 'normal' ? ' is-on' : '')}
                  onClick={() => setSpacing('normal')} aria-pressed={spacing === 'normal'}>Обычный</button>
                <button className={'a11y-opt' + (spacing === 'wide' ? ' is-on' : '')}
                  onClick={() => setSpacing('wide')} aria-pressed={spacing === 'wide'}>Большой</button>
              </div>
            </div>

            <div className="a11y-group">
              <div className="a11y-group-label">Изображения</div>
              <div className="a11y-opts">
                <button className={'a11y-opt' + (images === 'on' ? ' is-on' : '')}
                  onClick={() => setImages('on')} aria-pressed={images === 'on'}>Цветные</button>
                <button className={'a11y-opt' + (images === 'off' ? ' is-on' : '')}
                  onClick={() => setImages('off')} aria-pressed={images === 'off'}>Ч/Б</button>
              </div>
            </div>

            <button className="a11y-reset" onClick={reset}>Вернуться к обычной версии</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
