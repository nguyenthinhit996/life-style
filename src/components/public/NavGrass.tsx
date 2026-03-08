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

export default function NavGrass() {
  const { blades, flowers } = useMemo(() => {
    const rng = seededRng(20260308)
    const W = 1200

    const blades = Array.from({ length: 28 }, (_, i) => ({
      x:     rng() * W,
      h:     7  + rng() * 12,
      lean:  (rng() - 0.5) * 10,
      color: GREENS[Math.floor(rng() * GREENS.length)],
      sw:    1  + rng() * 1.2,
      dur:   1.8 + rng() * 2,
      delay: rng() * 4,
      dir:   i % 2,
    }))

    const flowers = Array.from({ length: 10 }, () => {
      const size    = 1.2 + rng() * 4.3          // 1.2 (tiny) → 5.5 (big)
      const palette = PALETTES[Math.floor(rng() * PALETTES.length)]
      return {
        x:        60 + rng() * (W - 120),
        stemH:    10 + size * 2.2 + rng() * 4,   // taller stem for bigger flowers
        palette,
        petals:   5  + Math.floor(rng() * 4),     // 5–8 petals
        size,
        dur:      2  + rng() * 2.2,
        delay:    rng() * 5,
        hasLeaf:  rng() > 0.45,
        leafSide: rng() > 0.5 ? 1 : -1,
        leafPos:  0.38 + rng() * 0.3,             // 38–68% up the stem
      }
    })

    return { blades, flowers }
  }, [])

  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-visible"
      aria-hidden="true"
    >
      <style>{`
        .gb { transform-origin: 50% 100%; transform-box: fill-box; }
        .fl { transform-origin: 50% 100%; transform-box: fill-box; }
        @keyframes sw-l { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-8deg)} }
        @keyframes sw-r { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate( 8deg)} }
        @keyframes fl-bob { 0%,100%{transform:rotate(0deg)} 40%{transform:rotate(7deg)} 70%{transform:rotate(-5deg)} }
      `}</style>

      <svg
        viewBox="0 0 1200 32"
        preserveAspectRatio="xMidYMax slice"
        width="100%"
        height="28"
        overflow="visible"
      >
        {/* Grass blades */}
        {blades.map((b, i) => (
          <path
            key={i}
            className="gb"
            d={`M${b.x},32 Q${b.x + b.lean},${32 - b.h * 0.55} ${b.x + b.lean * 1.6},${32 - b.h}`}
            stroke={b.color}
            strokeWidth={b.sw}
            fill="none"
            strokeLinecap="round"
            style={{ animation: `${b.dir ? 'sw-r' : 'sw-l'} ${b.dur}s ${b.delay}s ease-in-out infinite` }}
          />
        ))}

        {/* Flowers */}
        {flowers.map((f, i) => {
          const cx   = f.x
          const base = 32
          const cy   = base - f.stemH
          const leafY = base - f.stemH * f.leafPos
          const lx   = cx + f.leafSide * (2.5 + f.size * 0.6)
          const ly   = leafY - f.size * 0.6

          return (
            <g
              key={i}
              className="fl"
              style={{ animation: `fl-bob ${f.dur}s ${f.delay}s ease-in-out infinite` }}
            >
              {/* stem */}
              <line x1={cx} y1={base} x2={cx} y2={cy}
                stroke="#15803d" strokeWidth={0.9 + f.size * 0.15} strokeLinecap="round" />

              {/* optional leaf */}
              {f.hasLeaf && (
                <ellipse
                  cx={lx} cy={ly}
                  rx={1.8 + f.size * 0.55} ry={0.9 + f.size * 0.28}
                  fill="#16a34a"
                  opacity={0.85}
                  transform={`rotate(${f.leafSide * 38}, ${cx}, ${leafY})`}
                />
              )}

              {/* outer petals — elongated ellipses rotated around flower center */}
              {Array.from({ length: f.petals }, (_, p) => (
                <ellipse
                  key={p}
                  cx={cx}
                  cy={cy - f.size * 1.15}
                  rx={f.size * 0.7}
                  ry={f.size * 1.7}
                  fill={f.palette.outer}
                  opacity={0.93}
                  transform={`rotate(${p * (360 / f.petals)}, ${cx}, ${cy})`}
                />
              ))}

              {/* inner petals — shorter, lighter, offset 0.5 turn */}
              {Array.from({ length: f.petals }, (_, p) => (
                <ellipse
                  key={p}
                  cx={cx}
                  cy={cy - f.size * 0.75}
                  rx={f.size * 0.45}
                  ry={f.size * 1.05}
                  fill={f.palette.inner}
                  opacity={0.7}
                  transform={`rotate(${p * (360 / f.petals) + 180 / f.petals}, ${cx}, ${cy})`}
                />
              ))}

              {/* petal highlight tips — tiny white shimmer at each tip */}
              {Array.from({ length: f.petals }, (_, p) => (
                <circle
                  key={p}
                  cx={cx + Math.cos((p * (360 / f.petals) - 90) * (Math.PI / 180)) * f.size * 1.9}
                  cy={cy + Math.sin((p * (360 / f.petals) - 90) * (Math.PI / 180)) * f.size * 1.9}
                  r={f.size * 0.28}
                  fill={f.palette.tip}
                  opacity={0.6}
                />
              ))}

              {/* center glow ring */}
              <circle cx={cx} cy={cy} r={f.size * 0.95} fill={f.palette.center} opacity={0.6} />
              {/* center disc */}
              <circle cx={cx} cy={cy} r={f.size * 0.7}  fill={f.palette.center} />
              {/* center shadow */}
              <circle cx={cx} cy={cy} r={f.size * 0.42} fill={f.palette.dot} opacity={0.75} />
              {/* center shine */}
              <circle
                cx={cx - f.size * 0.2}
                cy={cy - f.size * 0.2}
                r={f.size * 0.18}
                fill="white"
                opacity={0.55}
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
