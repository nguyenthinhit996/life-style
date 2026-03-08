'use client'

import { useMemo } from 'react'

function seededRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d)
    s = Math.imul(s ^ (s >>> 12), 0x297a2d39)
    s ^= s >>> 15
    return (s >>> 0) / 0x100000000
  }
}

// Dark-back layer → mid layer → bright front layer
const GRASS_LAYERS = [
  { count: 30, hRange: [14, 22], colors: ['#1a3a1f', '#1d4a24', '#14532d'], sw: [1.0, 1.6] },
  { count: 40, hRange: [10, 18], colors: ['#166534', '#15803d', '#1a5c2a'], sw: [0.8, 1.4] },
  { count: 35, hRange: [7,  15], colors: ['#16a34a', '#22c55e', '#4ade80'], sw: [0.7, 1.2] },
]

// Bellflower palette — bluish-purple inspired by the reference image
const BELL_OUTER  = ['#818cf8', '#7c3aed', '#a78bfa', '#6366f1', '#8b5cf6', '#93c5fd']
const BELL_INNER  = ['#c7d2fe', '#ddd6fe', '#bfdbfe', '#e0e7ff', '#ede9fe']

export default function NavGrass() {
  const { layers, bells } = useMemo(() => {
    const rng  = seededRng(20260308)
    const W    = 1200
    const BASE = 32   // svg bottom y

    // Build multiple grass layers (back → front)
    const layers = GRASS_LAYERS.map(({ count, hRange, colors, sw }) =>
      Array.from({ length: count }, (_, i) => ({
        x:     rng() * W,
        h:     hRange[0] + rng() * (hRange[1] - hRange[0]),
        lean:  (rng() - 0.5) * 14,
        color: colors[Math.floor(rng() * colors.length)],
        sw:    sw[0] + rng() * (sw[1] - sw[0]),
        dur:   1.6 + rng() * 2.4,
        delay: rng() * 5,
        dir:   i % 2,
      }))
    )

    // Bellflowers: arching stem + drooping bell at the tip
    const bells = Array.from({ length: 12 }, () => {
      const size   = 1.6 + rng() * 3.8          // 1.6 (tiny) → 5.4 (big)
      const stemH  = 12  + size * 3.2 + rng() * 5
      const archX  = (rng() - 0.5) * stemH * 0.6  // how far the arch leans
      return {
        x:       60  + rng() * (W - 120),
        stemH,
        archX,
        outer:   BELL_OUTER[Math.floor(rng() * BELL_OUTER.length)],
        inner:   BELL_INNER[Math.floor(rng() * BELL_INNER.length)],
        size,
        dur:     2.2 + rng() * 2.4,
        delay:   rng() * 5,
        // small leaf nub midway on stem
        hasLeaf: rng() > 0.4,
        leafSide: rng() > 0.5 ? 1 : -1,
        leafPos: 0.4 + rng() * 0.25,
      }
    })

    return { layers, bells }
  }, [])

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-visible"
      aria-hidden="true"
    >
      <style>{`
        .gb  { transform-origin: 50% 100%; transform-box: fill-box; }
        .bfl { transform-origin: 50% 100%; transform-box: fill-box; }
        @keyframes sw-l  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-9deg)} }
        @keyframes sw-r  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate( 9deg)} }
        @keyframes bell-sway { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(6deg)} 70%{transform:rotate(-5deg)} }
      `}</style>

      <svg
        viewBox="0 0 1200 36"
        preserveAspectRatio="xMidYMax slice"
        width="100%"
        height="32"
        overflow="visible"
      >
        {/* Render grass back→front then bellflowers on top */}
        {layers.map((blades, li) =>
          blades.map((b, i) => (
            <path
              key={`${li}-${i}`}
              className="gb"
              d={`M${b.x},36 Q${b.x + b.lean * 0.6},${36 - b.h * 0.55} ${b.x + b.lean},${36 - b.h}`}
              stroke={b.color}
              strokeWidth={b.sw}
              fill="none"
              strokeLinecap="round"
              style={{ animation: `${b.dir ? 'sw-r' : 'sw-l'} ${b.dur}s ${b.delay}s ease-in-out infinite` }}
            />
          ))
        )}

        {/* Bellflowers */}
        {bells.map((f, i) => {
          const BASE_Y = 36
          // Cubic bezier arch stem: starts at base, curves to tip
          const tx = f.x + f.archX           // tip x
          const ty = BASE_Y - f.stemH        // tip y
          const c1x = f.x
          const c1y = BASE_Y - f.stemH * 0.4
          const c2x = tx
          const c2y = ty + f.stemH * 0.35
          const stemPath = `M${f.x},${BASE_Y} C${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`

          // Leaf position along the bezier (approx linear interp for simplicity)
          const lp   = f.leafPos
          const lx   = f.x * (1 - lp) + tx * lp
          const ly   = BASE_Y * (1 - lp) + ty * lp
          const lr   = (1.4 + f.size * 0.5)

          // Bell shape: flared bottom, narrower neck, petal lobes at rim
          const bw  = f.size * 1.8   // bell half-width at rim
          const bh  = f.size * 2.4   // bell height
          // bell hangs below the tip
          const bellPath =
            `M${tx},${ty}` +
            ` C${tx - bw * 0.4},${ty + bh * 0.3} ${tx - bw},${ty + bh * 0.6} ${tx - bw},${ty + bh}` +
            ` Q${tx},${ty + bh * 1.28} ${tx + bw},${ty + bh}` +
            ` C${tx + bw},${ty + bh * 0.6} ${tx + bw * 0.4},${ty + bh * 0.3} ${tx},${ty}` +
            ` Z`

          return (
            <g
              key={i}
              className="bfl"
              style={{ animation: `bell-sway ${f.dur}s ${f.delay}s ease-in-out infinite` }}
            >
              {/* arching stem */}
              <path d={stemPath} stroke="#15803d" strokeWidth={0.8 + f.size * 0.13}
                fill="none" strokeLinecap="round" />

              {/* small leaf nub */}
              {f.hasLeaf && (
                <ellipse cx={lx + f.leafSide * lr * 0.7} cy={ly}
                  rx={lr} ry={lr * 0.45}
                  fill="#16a34a" opacity={0.8}
                  transform={`rotate(${f.leafSide * 36}, ${lx}, ${ly})`}
                />
              )}

              {/* bell outer */}
              <path d={bellPath} fill={f.outer} opacity={0.88} />
              {/* bell inner highlight */}
              <ellipse
                cx={tx} cy={ty + bh * 0.55}
                rx={bw * 0.52} ry={bh * 0.42}
                fill={f.inner} opacity={0.55}
              />
              {/* rim petal lobes — 5 small arcs at the bell opening */}
              {Array.from({ length: 5 }, (_, p) => {
                const a = ((p / 5) * Math.PI * 2) - Math.PI / 2
                const lobe_r = bw * 0.38
                return (
                  <circle key={p}
                    cx={tx + Math.cos(a) * bw * 0.82}
                    cy={ty + bh + Math.sin(a) * bw * 0.38}
                    r={lobe_r}
                    fill={f.outer}
                    opacity={0.7}
                  />
                )
              })}
              {/* stamen dot */}
              <circle cx={tx} cy={ty + bh * 0.72} r={f.size * 0.22} fill="white" opacity={0.6} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}


const GREENS = ['#14532d', '#166534', '#15803d', '#16a34a', '#22c55e', '#4ade80']

// Each palette: outer petal, inner petal (lighter), highlight tip, center, inner dot
const PALETTES = [
  { outer: '#fde68a', inner: '#fef9c3', tip: '#fffbeb', center: '#f59e0b', dot: '#b45309' }, // sunflower
  { outer: '#f9a8d4', inner: '#fce7f3', tip: '#fdf2f8', center: '#fef08a', dot: '#fb923c' }, // pink daisy
  { outer: '#93c5fd', inner: '#dbeafe', tip: '#eff6ff', center: '#fef9c3', dot: '#fcd34d' }, // blue
  { outer: '#d8b4fe', inner: '#f3e8ff', tip: '#faf5ff', center: '#fef08a', dot: '#a21caf' }, // lavender
  { outer: '#6ee7b7', inner: '#d1fae5', tip: '#ecfdf5', center: '#fef9c3', dot: '#059669' }, // mint
  { outer: '#fca5a5', inner: '#fee2e2', tip: '#fff1f2', center: '#fef08a', dot: '#dc2626' }, // coral
  { outer: '#fdba74', inner: '#ffedd5', tip: '#fff7ed', center: '#fef08a', dot: '#ea580c' }, // orange
  { outer: '#f0abfc', inner: '#fae8ff', tip: '#fdf4ff', center: '#d9f99d', dot: '#15803d' }, // orchid
  { outer: '#ffffff', inner: '#f1f5f9', tip: '#f8fafc', center: '#fef9c3', dot: '#86efac' }, // white
  { outer: '#fcd34d', inner: '#fef9c3', tip: '#fffbeb', center: '#ef4444', dot: '#991b1b' }, // marigold
]
