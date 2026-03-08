// Server component — renders once on the server, no client JS.
// Positions are deterministic and never change between refreshes.

// ─── Data generated with a random seed each server render ───────────────────
// Server component = no hydration, so Math.random() is safe here.
// Positions will be different on every page refresh.

function seededRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(s ^ (s >>> 15), 0x2c1b3c6d)
    s = Math.imul(s ^ (s >>> 12), 0x297a2d39)
    s ^= s >>> 15
    return (s >>> 0) / 0x100000000
  }
}

// Filled tapered blade: wider at base, pointed at tip, with natural lean
function bladePath(cx: number, base: number, h: number, lean: number, w: number): string {
  const c1x = cx - w * 0.3,  c1y = base - h * 0.4
  const c2x = cx + lean * 0.6, c2y = base - h * 0.8
  const tx  = cx + lean,       ty  = base - h
  return (
    `M ${cx - w} ${base} ` +
    `C ${c1x - 0.6} ${c1y}, ${c2x - 0.8} ${c2y}, ${tx} ${ty} ` +
    `C ${c2x + 0.8} ${c2y}, ${c1x + 0.6} ${c1y}, ${cx + w} ${base} Z`
  )
}

const BACK_C  = ['#0e2d14', '#10351a', '#12401e', '#143822']
const MID_C   = ['#1a5e2a', '#1f6b30', '#237438', '#1c6332']
const FRONT_C = ['#2d904a', '#359e52', '#3da85a', '#44b060', '#30985a']

const FLOWER_PALETTES = [
  { outer: '#fde68a', center: '#f59e0b', dot: '#92400e' },
  { outer: '#f9a8d4', center: '#fbbf24', dot: '#db2777' },
  { outer: '#c4b5fd', center: '#fef08a', dot: '#7c3aed' },
  { outer: '#fca5a5', center: '#fef08a', dot: '#dc2626' },
  { outer: '#93c5fd', center: '#fef9c3', dot: '#2563eb' },
  { outer: '#6ee7b7', center: '#fef9c3', dot: '#059669' },
  { outer: '#fdba74', center: '#fef08a', dot: '#ea580c' },
  { outer: '#ffffff', center: '#fef9c3', dot: '#86efac' },
]

// ─── Static scene data ───────────────────────────────────────────────────────
const W = 1200

function buildScene() {
  const rng = seededRng(Math.floor(Math.random() * 0xFFFFFF))

  const back = Array.from({ length: 35 }, () => ({
    x:     rng() * W,
    h:     6  + rng() * 9,
    lean:  (rng() - 0.5) * 14,
    color: BACK_C[Math.floor(rng() * BACK_C.length)],
    w:     1.1 + rng() * 1.1,
    dur:   2.2 + rng() * 2.8,
    delay: rng() * 6,
    dir:   Math.floor(rng() * 2),
  }))

  const mid = Array.from({ length: 28 }, () => ({
    x:     rng() * W,
    h:     11 + rng() * 11,
    lean:  (rng() - 0.5) * 18,
    color: MID_C[Math.floor(rng() * MID_C.length)],
    w:     1.3 + rng() * 1.3,
    dur:   1.9 + rng() * 2.2,
    delay: rng() * 6,
    dir:   Math.floor(rng() * 2),
  }))

  const front = Array.from({ length: 22 }, () => ({
    x:     rng() * W,
    h:     15 + rng() * 13,
    lean:  (rng() - 0.5) * 20,
    color: FRONT_C[Math.floor(rng() * FRONT_C.length)],
    w:     1.5 + rng() * 1.5,
    dur:   1.6 + rng() * 2.0,
    delay: rng() * 6,
    dir:   Math.floor(rng() * 2),
  }))

  const flowers = Array.from({ length: 10 }, () => {
    const size = 0.8 + rng() * 4.8
    return {
      x:       50 + rng() * (W - 100),
      stemH:   10 + size * 2.6 + rng() * 4,
      palette: FLOWER_PALETTES[Math.floor(rng() * FLOWER_PALETTES.length)],
      petals:  5 + Math.floor(rng() * 3),
      size,
      dur:     2.0 + rng() * 2.0,
      delay:   rng() * 5,
    }
  })

  return { back, mid, front, flowers }
}

// Generated once per client mount — new layout on each page load
const { back: BACK_BLADES, mid: MID_BLADES, front: FRONT_BLADES, flowers: FLOWERS } = buildScene()
// ────────────────────────────────────────────────────────────────────────────

export default function NavGrass() {
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 overflow-visible"
      aria-hidden="true"
    >
      <style>{`
        .gb { transform-origin: 50% 100%; transform-box: fill-box; }
        .fl { transform-origin: 50% 100%; transform-box: fill-box; }
        @keyframes sw-l  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-7deg)} }
        @keyframes sw-r  { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate( 7deg)} }
        @keyframes fl-bob { 0%,100%{transform:rotate(0deg)} 45%{transform:rotate(5deg)} 75%{transform:rotate(-4deg)} }
      `}</style>

      <svg
        viewBox="0 0 1200 34"
        preserveAspectRatio="xMidYMax slice"
        width="100%"
        height="28"
        overflow="visible"
      >
        {/* Back grass — dark, short, creates depth */}
        {BACK_BLADES.map((b, i) => (
          <path
            key={`bk${i}`}
            className="gb"
            d={bladePath(b.x, 34, b.h, b.lean, b.w)}
            fill={b.color}
            opacity={0.78}
            style={{ animation: `${b.dir ? 'sw-r' : 'sw-l'} ${b.dur}s ${b.delay}s ease-in-out infinite` }}
          />
        ))}

        {/* Flowers — between back and mid grass */}
        {FLOWERS.map((f, i) => {
          const cx = f.x, base = 34, cy = base - f.stemH
          return (
            <g
              key={`fl${i}`}
              className="fl"
              style={{ animation: `fl-bob ${f.dur}s ${f.delay}s ease-in-out infinite` }}
            >
              <line x1={cx} y1={base} x2={cx} y2={cy}
                stroke="#196a28" strokeWidth={0.7 + f.size * 0.1} strokeLinecap="round" />
              {Array.from({ length: f.petals }, (_, p) => (
                <ellipse key={p}
                  cx={cx} cy={cy - f.size * 1.05}
                  rx={f.size * 0.6} ry={f.size * 1.5}
                  fill={f.palette.outer} opacity={0.92}
                  transform={`rotate(${p * (360 / f.petals)}, ${cx}, ${cy})`}
                />
              ))}
              <circle cx={cx} cy={cy} r={f.size * 0.78} fill={f.palette.center} />
              <circle cx={cx} cy={cy} r={f.size * 0.46} fill={f.palette.dot} opacity={0.82} />
              <circle cx={cx - f.size * 0.18} cy={cy - f.size * 0.18} r={f.size * 0.14} fill="white" opacity={0.5} />
            </g>
          )
        })}

        {/* Mid grass */}
        {MID_BLADES.map((b, i) => (
          <path
            key={`md${i}`}
            className="gb"
            d={bladePath(b.x, 34, b.h, b.lean, b.w)}
            fill={b.color}
            opacity={0.88}
            style={{ animation: `${b.dir ? 'sw-r' : 'sw-l'} ${b.dur}s ${b.delay}s ease-in-out infinite` }}
          />
        ))}

        {/* Front grass — brightest, tallest, most prominent */}
        {FRONT_BLADES.map((b, i) => (
          <path
            key={`ft${i}`}
            className="gb"
            d={bladePath(b.x, 34, b.h, b.lean, b.w)}
            fill={b.color}
            style={{ animation: `${b.dir ? 'sw-r' : 'sw-l'} ${b.dur}s ${b.delay}s ease-in-out infinite` }}
          />
        ))}
      </svg>
    </div>
  )
}
