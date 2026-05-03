import React from 'react';

// /public/logo.svg   — single dragon (head facing right toward the wordmark)
// /public/logo-2.svg — mirrored dragon (head facing left toward the wordmark)
// Header layout: [logo.svg]  TOMMYSINNY  [logo-2.svg]

const ASPECT = 97 / 43;

export default function Logo({ size = 28, invert = false }) {
  const dragonW = Math.round(size * ASPECT);
  return (
    <span className={'ts-logo' + (invert ? ' is-inverted' : '')} style={{ height: size }}>
      <img src="/logo.svg" alt="" aria-hidden="true"
        className="ts-logo-dragon" width={dragonW} height={size} draggable="false" />
      <span className="ts-logo-text" style={{ fontSize: Math.round(size * 0.7) }}>TOMMYSINNY</span>
      <img src="/logo-2.svg" alt="TOMMYSINNY"
        className="ts-logo-dragon" width={dragonW} height={size} draggable="false" />
    </span>
  );
}

// Standalone single dragon for decorative spots
export function Crest({ size = 28, mirror = false, invert = false }) {
  const dragonW = Math.round(size * ASPECT);
  return (
    <img
      src={mirror ? '/logo-2.svg' : '/logo.svg'}
      alt=""
      aria-hidden="true"
      width={dragonW}
      height={size}
      className={'ts-logo-dragon' + (invert ? ' is-inverted' : '')}
      draggable="false"
    />
  );
}
