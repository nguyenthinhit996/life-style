'use client'

import { useMemo } from 'react'

// Deterministic PRNG — same output on server + client (no hydration mismatch)
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
const PETALS = ['#fde68a', '#fcd34d', '#f9a8d4', '#f472b6', '#bfdbfe', '#93c5fd', '#fca5a5', '#fdba74', '#d8b4fe', '#ffffff']

export default function NavGrass() {
  const { blades, flowers } = useMemo(() => {
    const rng = seededRng(20260308)
    const W = 1200

    const blades = Array.from({ length: 90 }, (_, i) => ({
      x:     rng() * W,
      h:     9  + rng() * 16,          // height 9–25
      lean:  (rng() - 0.5) * 12,       // lean –6 to +6
      color: GREENS[Math.floor(rng() * GREENS.length)],
      sw:    1  + rng() * 1.4,         // stroke 1–2.4
      dur:   1.6 + rng() * 2.2,        // sway period 1.6–3.8s
      delay: rng() * 4,
      dir:   i % 2,                    // alternate sway direction
    }))

    const flowers = Array.from({ length: 20 }, () => ({
      x:      40 + rng() * (W - 80),
      stemH:  14 + rng() * 12,          // stem 14–26
      color:  PETALS[Math.floor(rng() * PETALS.length)],
      petals: 4 + Math.floor(rng() * 3), // 4–6 petals
      size:   2.2 + rng() * 2,
      dur:    2  + rng() * 2.5,
      delay:  rng() * 4,
    }))

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
        @keyframes sw-l { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-9deg)} }
        @keyframes sw-r { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate( 9deg)} }
        @keyframes fl-bob { 0%,100%{transform:rotate(0deg)} 33%{transform:rotate(6deg)} 66%{transform:rotate(-6deg)} }
      `}</style>

      <svg
        viewBox="0 0 1200 28"
        preserveAspectRatio="xMidYMax slice"
        width="100%"
        height="26"
        overflow="visible"
      >
        {/* Grass blades */}
        {blades.map((b, i) => (
          <path
            key={i}
            className="gb"
            d={`M${b.x},28 Q${b.x + b.lean},${28 - b.h * 0.55} ${b.x + b.lean * 1.6},${28 - b.h}`}
            stroke={b.color}
            strokeWidth={b.sw}
            fill="none"
            strokeLinecap="round"
            style={{ animation: `${b.dir ? 'sw-r' : 'sw-l'} ${b.dur}s ${b.delay}s ease-in-out infinite` }}
          />
        ))}

        {/* Flowers */}
        {flowers.map((f, i) => {
          const cx = f.x
          const cy = 28 - f.stemH
          return (
            <g
              key={i}
              className="fl"
              style={{ animation: `fl-bob ${f.dur}s ${f.delay}s ease-in-out infinite` }}
            >
              {/* stem */}
              <line x1={cx} y1={28} x2={cx} y2={cy} stroke="#15803d" strokeWidth="1.3" strokeLinecap="round" />
              {/* petals */}
              {Array.from({ length: f.petals }, (_, p) => {
                const angle = (p * (360 / f.petals) - 90) * (Math.PI / 180)
                const px = cx + Math.cos(angle) * (f.size + 1.8)
                const py = cy + Math.sin(angle) * (f.size + 1.8)
                return (
                  <ellipse
                    key={p}
                    cx={px} cy={py}
                    rx={f.size} ry={f.size * 0.6}
                    fill={f.color}
                    opacity={0.92}
                    transform={`rotate(${p * (360 / f.petals)}, ${px}, ${py})`}
                  />
                )
              })}
              {/* center */}
              <circle cx={cx} cy={cy} r={f.size * 0.75} fill="#fef08a" />
              <circle cx={cx} cy={cy} r={f.size * 0.35} fill="#fb923c" opacity={0.7} />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
