'use client'

import { useEffect, useRef } from 'react'

/* ─────────────────────────────────────────────────────
   Shared leg animation timing for running bounce
───────────────────────────────────────────────────── */
const LEG_DUR  = '0.46s'
const BACK_A   = '-18,0,0; 16,0,0; -18,0,0'
const BACK_B   = '16,0,0; -18,0,0; 16,0,0'
const FRONT_A  = '16,0,0; -18,0,0; 16,0,0'
const FRONT_B  = '-18,0,0; 16,0,0; -18,0,0'

/* ─────────────────────────────────────────────────────
   RabbitSVG — reusable rabbit drawing
   gender: 'male'  → darker gray-brown fur, plain
           'female'→ lighter warm beige, small bow on ear
───────────────────────────────────────────────────── */
function RabbitSVG({ gender }: { gender: 'male' | 'female' }) {
  const isFemale = gender === 'female'
  const gradId   = `rFur-${gender}`

  // Male: darker taupe. Female: warm soft beige
  const furLight = isFemale ? '#f5ede0' : '#d8cabb'
  const furDark  = isFemale ? '#c8a882' : '#8a7460'
  const bodyStroke  = isFemale ? '#d4b896' : '#9e8a76'
  const legFar      = isFemale ? '#c8b09a' : '#948070'
  const legNear     = isFemale ? '#d8c0aa' : '#a89080'
  const earOuter    = isFemale ? '#e8d8c8' : '#b8a898'
  const earInner    = isFemale ? '#f4b8c0' : '#d89090'
  const noseColor   = isFemale ? '#e06878' : '#c05868'
  const blushOpacity = isFemale ? 0.28 : 0.12

  return (
    <svg
      width="46"
      height="42"
      viewBox="0 -10 56 52"
      overflow="visible"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={gradId} cx="42%" cy="36%" r="62%">
          <stop offset="0%" stopColor={furLight} />
          <stop offset="100%" stopColor={furDark} />
        </radialGradient>
      </defs>

      <g>
        {/* ── FAR back leg ── */}
        <g transform="translate(15,38)">
          <path d="M0,0 C-3,2 1,5 0,9" stroke={legFar} strokeWidth="3.6" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="rotate"
              values={BACK_A} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
          </path>
        </g>

        {/* ── FAR front leg ── */}
        <g transform="translate(30,38)">
          <path d="M0,0 C1,3 1,5 2,8" stroke={legFar} strokeWidth="2.8" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="rotate"
              values={FRONT_A} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
          </path>
        </g>

        {/* ── COTTONTAIL ── */}
        <circle cx="5.5" cy="26" r="5.8" fill={furLight} opacity={0.9} />
        <circle cx="5"   cy="25" r="4"   fill="white" />

        {/* ── BODY ── */}
        <ellipse cx="21" cy="30" rx="16" ry="11" fill={`url(#${gradId})`} />
        {/* subtle belly highlight */}
        <ellipse cx="20" cy="33" rx="10" ry="5" fill={furLight} opacity={0.35} />

        {/* ── NEAR back leg ── */}
        <g transform="translate(12,38)">
          <path d="M0,0 C-3,2 1,5 0,9" stroke={legNear} strokeWidth="4.6" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="rotate"
              values={BACK_B} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
          </path>
        </g>

        {/* ── NEAR front leg ── */}
        <g transform="translate(27,38)">
          <path d="M0,0 C1,3 1,5 2,8" stroke={legNear} strokeWidth="3.6" strokeLinecap="round" fill="none">
            <animateTransform attributeName="transform" type="rotate"
              values={FRONT_B} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
          </path>
        </g>

        {/* ── BACK EAR ── */}
        <ellipse cx="35" cy="3"  rx="3.8" ry="12"  fill={earOuter} transform="rotate(-14 35 16)" />
        <ellipse cx="35" cy="3"  rx="2"   ry="7.5" fill={earInner} opacity={0.8} transform="rotate(-14 35 16)" />

        {/* ── HEAD ── */}
        <circle cx="37" cy="21" r="12" fill={`url(#${gradId})`} />
        {/* subtle head shading */}
        <circle cx="35" cy="19" r="9"  fill={furLight} opacity={0.18} />

        {/* ── FRONT EAR ── */}
        <ellipse cx="40" cy="2"  rx="4.6" ry="13.5" fill={earOuter} transform="rotate(8 40 16)" />
        <ellipse cx="40" cy="2"  rx="2.5" ry="9"    fill={earInner} opacity={0.85} transform="rotate(8 40 16)" />

        {/* Female bow on front ear */}
        {isFemale && (
          <g transform="translate(43, -3) rotate(8)">
            <ellipse cx="-3" cy="0" rx="3.2" ry="1.8" fill="#f472b6" opacity={0.9} transform="rotate(-30)" />
            <ellipse cx=" 3" cy="0" rx="3.2" ry="1.8" fill="#f472b6" opacity={0.9} transform="rotate( 30)" />
            <circle  cx="0"  cy="0" r="1.4"  fill="#ec4899" />
          </g>
        )}

        {/* ── EYE ── */}
        <circle cx="44"   cy="18.5" r="3.4" fill="#160e1e" />
        <circle cx="45.2" cy="17.3" r="1.2" fill="white" />
        <circle cx="43"   cy="19.6" r="0.5" fill="white" opacity={0.5} />
        {/* female lashes */}
        {isFemale && <>
          <line x1="45.5" y1="15.5" x2="46.8" y2="14"   stroke="#160e1e" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="47"   y1="16.2" x2="48.5" y2="15.2" stroke="#160e1e" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="47.8" y1="17.5" x2="49.5" y2="17"   stroke="#160e1e" strokeWidth="0.7" strokeLinecap="round" />
        </>}

        {/* ── NOSE ── */}
        <ellipse cx="49.5" cy="22.5" rx="2" ry="1.4" fill={noseColor} />
        <path d="M48.5 24 Q49.6 26 50.8 24" stroke={noseColor} strokeWidth="0.9" strokeLinecap="round" fill="none" />

        {/* ── CHEEK BLUSH ── */}
        <ellipse cx="45.5" cy="25" rx="3.2" ry="1.8" fill="#ff8090" opacity={blushOpacity} />

        {/* ── WHISKERS ── */}
        <line x1="50" y1="21"   x2="55.5" y2="19"   stroke={bodyStroke} strokeWidth="0.7" opacity="0.75" />
        <line x1="50" y1="22.5" x2="55.5" y2="22.5" stroke={bodyStroke} strokeWidth="0.7" opacity="0.75" />
        <line x1="50" y1="24"   x2="55.5" y2="25.5" stroke={bodyStroke} strokeWidth="0.7" opacity="0.75" />
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────
   Hook: independent random movement for one rabbit
───────────────────────────────────────────────────── */
function useRabbitMove(
  trackRef: React.RefObject<HTMLSpanElement | null>,
  runnerRef: React.RefObject<HTMLSpanElement | null>,
  rabbitW: number,
  initDelay: number,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const posRef   = useRef(0)

  useEffect(() => {
    const move = () => {
      const track  = trackRef.current
      const runner = runnerRef.current
      if (!track || !runner) return

      const maxX = Math.max(0, track.offsetWidth - rabbitW)
      if (maxX <= 0) { timerRef.current = setTimeout(move, 500); return }

      const targetX = Math.random() * maxX
      const goRight = targetX >= posRef.current
      const dist    = Math.abs(targetX - posRef.current)
      const dur     = Math.max(300, (dist / 140) * 1000)

      runner.style.transition = `transform ${dur}ms linear`
      runner.style.transform  = `translateX(${targetX}px) scaleX(${goRight ? 1 : -1})`
      runner.classList.add('rab-moving')
      posRef.current = targetX

      timerRef.current = setTimeout(() => {
        runner.classList.remove('rab-moving')
        timerRef.current = setTimeout(move, Math.random() * 1200 + 300)
      }, dur)
    }

    timerRef.current = setTimeout(move, initDelay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

/* ─────────────────────────────────────────────────────
   Main component — two rabbits on the same track
───────────────────────────────────────────────────── */
export default function NavRabbit() {
  const trackRef   = useRef<HTMLSpanElement>(null)
  const maleRef    = useRef<HTMLSpanElement>(null)
  const femaleRef  = useRef<HTMLSpanElement>(null)

  useRabbitMove(trackRef, maleRef,   46, 300)
  useRabbitMove(trackRef, femaleRef, 46, 1400)

  return (
    <span
      ref={trackRef}
      className="relative block h-full w-full overflow-visible"
      role="img"
      aria-label="Male and female rabbits running"
    >
      <style>{`
        .rab-moving .rab-bi {
          animation: rab-bounce 0.3s ease-in-out infinite;
        }
        @keyframes rab-bounce {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-2px); }
        }
      `}</style>

      {/* Male rabbit — darker, starts left */}
      <span ref={maleRef} style={{ position: 'absolute', bottom: '-6px', transform: 'translateX(0px) scaleX(1)', willChange: 'transform' }}>
        <span className="rab-bi block"><RabbitSVG gender="male" /></span>
      </span>

      {/* Female rabbit — lighter with bow, starts right */}
      <span ref={femaleRef} style={{ position: 'absolute', bottom: '-6px', transform: 'translateX(60px) scaleX(-1)', willChange: 'transform' }}>
        <span className="rab-bi block"><RabbitSVG gender="female" /></span>
      </span>
    </span>
  )
}

