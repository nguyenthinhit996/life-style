'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

/* ─────────────────────────────────────────────────────
   Idle poses the rabbit can have while stopped
───────────────────────────────────────────────────── */
type Pose = 'run' | 'sit' | 'sniff' | 'sleep' | 'eartwitch'

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
   pose:   changes body/leg/eye shape while idle
───────────────────────────────────────────────────── */
function RabbitSVG({ gender, pose }: { gender: 'male' | 'female'; pose: Pose }) {
  const isFemale = gender === 'female'
  const gradId   = `rFur-${gender}`

  const furLight    = isFemale ? '#f5ede0' : '#d8cabb'
  const furDark     = isFemale ? '#c8a882' : '#8a7460'
  const bodyStroke  = isFemale ? '#d4b896' : '#9e8a76'
  const legFar      = isFemale ? '#c8b09a' : '#948070'
  const legNear     = isFemale ? '#d8c0aa' : '#a89080'
  const earOuter    = isFemale ? '#e8d8c8' : '#b8a898'
  const earInner    = isFemale ? '#f4b8c0' : '#d89090'
  const noseColor   = isFemale ? '#e06878' : '#c05868'
  const blushOpacity = isFemale ? 0.28 : 0.12

  const isSleep = pose === 'sleep'
  const isSit   = pose === 'sit'
  const isSniff = pose === 'sniff'
  const isEar   = pose === 'eartwitch'

  // Sitting/sleeping: body shifts down slightly, rounder
  const bodyRY  = (isSit || isSleep) ? 10 : 11
  const bodyCY  = (isSit || isSleep) ? 32  : 30
  // Head dips for sniff/sleep
  const headCY  = isSleep ? 24 : isSniff ? 23 : 21
  // Sleeping eyes are closed (thin line), sniffing eyes are squinted
  const eyeR    = isSleep ? 0.6 : 3.4

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
        <g transform={isSit || isSleep ? 'translate(10,36)' : 'translate(15,38)'}>
          {/* sitting: leg tucked flat under body */}
          {(isSit || isSleep)
            ? <path d="M0,0 C4,1 8,2 12,1" stroke={legFar} strokeWidth="3.6" strokeLinecap="round" fill="none" />
            : <path d="M0,0 C-3,2 1,5 0,9" stroke={legFar} strokeWidth="3.6" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values={pose === 'run' ? BACK_A : '0,0,0'} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
              </path>
          }
        </g>

        {/* ── FAR front leg ── */}
        <g transform={isSit || isSleep ? 'translate(26,36)' : 'translate(30,38)'}>
          {(isSit || isSleep)
            ? <path d="M0,0 C2,2 4,4 4,7" stroke={legFar} strokeWidth="2.8" strokeLinecap="round" fill="none" />
            : <path d="M0,0 C1,3 1,5 2,8" stroke={legFar} strokeWidth="2.8" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values={pose === 'run' ? FRONT_A : '0,0,0'} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
              </path>
          }
        </g>

        {/* ── COTTONTAIL ── */}
        <circle cx="5.5" cy="26" r="5.8" fill={furLight} opacity={0.9} />
        <circle cx="5"   cy="25" r="4"   fill="white" />

        {/* ── BODY ── */}
        <ellipse cx="21" cy={bodyCY} rx="16" ry={bodyRY} fill={`url(#${gradId})`} />
        <ellipse cx="20" cy={bodyCY + 3} rx="10" ry="5" fill={furLight} opacity={0.35} />

        {/* ── NEAR back leg ── */}
        <g transform={isSit || isSleep ? 'translate(8,37)' : 'translate(12,38)'}>
          {(isSit || isSleep)
            ? <path d="M0,0 C5,1 10,2 14,1" stroke={legNear} strokeWidth="4.6" strokeLinecap="round" fill="none" />
            : <path d="M0,0 C-3,2 1,5 0,9" stroke={legNear} strokeWidth="4.6" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values={pose === 'run' ? BACK_B : '0,0,0'} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
              </path>
          }
        </g>

        {/* ── NEAR front leg ── */}
        <g transform={isSit || isSleep ? 'translate(23,36)' : 'translate(27,38)'}>
          {(isSit || isSleep)
            ? <path d="M0,0 C2,2 5,4 5,7" stroke={legNear} strokeWidth="3.6" strokeLinecap="round" fill="none" />
            : <path d="M0,0 C1,3 1,5 2,8" stroke={legNear} strokeWidth="3.6" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values={pose === 'run' ? FRONT_B : '0,0,0'} keyTimes="0; 0.5; 1" dur={LEG_DUR} repeatCount="indefinite" />
              </path>
          }
        </g>

        {/* ── BACK EAR ── */}
        {/* ear-twitch: back ear rotates more */}
        <ellipse cx="35" cy="3"  rx="3.8" ry="12"
          fill={earOuter}
          transform={isEar ? 'rotate(-28 35 16)' : 'rotate(-14 35 16)'}>
          {isEar && <animateTransform attributeName="transform" type="rotate"
            values="-14,35,16; -32,35,16; -14,35,16; -28,35,16; -14,35,16"
            keyTimes="0; 0.25; 0.5; 0.75; 1" dur="0.9s" repeatCount="indefinite" />}
        </ellipse>
        <ellipse cx="35" cy="3"  rx="2"   ry="7.5"
          fill={earInner} opacity={0.8}
          transform={isEar ? 'rotate(-28 35 16)' : 'rotate(-14 35 16)'}>
          {isEar && <animateTransform attributeName="transform" type="rotate"
            values="-14,35,16; -32,35,16; -14,35,16; -28,35,16; -14,35,16"
            keyTimes="0; 0.25; 0.5; 0.75; 1" dur="0.9s" repeatCount="indefinite" />}
        </ellipse>

        {/* sleeping: droopy ear lays flat */}
        {isSleep && (
          <ellipse cx="35" cy="3" rx="3.8" ry="12" fill={earOuter} transform="rotate(55 35 16)" opacity={0.8} />
        )}

        {/* ── HEAD ── */}
        <circle cx="37" cy={headCY} r="12" fill={`url(#${gradId})`} />
        <circle cx="35" cy={headCY - 2} r="9"  fill={furLight} opacity={0.18} />

        {/* ── FRONT EAR ── */}
        {/* sleep: front ear also flops */}
        {isSleep
          ? <ellipse cx="40" cy="2" rx="4.6" ry="13.5" fill={earOuter} transform="rotate(50 40 16)" opacity={0.8} />
          : <ellipse cx="40" cy="2"  rx="4.6" ry="13.5" fill={earOuter} transform="rotate(8 40 16)" />
        }
        {!isSleep && <ellipse cx="40" cy="2" rx="2.5" ry="9" fill={earInner} opacity={0.85} transform="rotate(8 40 16)" />}

        {/* Female bow */}
        {isFemale && !isSleep && (
          <g transform="translate(43, -3) rotate(8)">
            <ellipse cx="-3" cy="0" rx="3.2" ry="1.8" fill="#f472b6" opacity={0.9} transform="rotate(-30)" />
            <ellipse cx=" 3" cy="0" rx="3.2" ry="1.8" fill="#f472b6" opacity={0.9} transform="rotate( 30)" />
            <circle  cx="0"  cy="0" r="1.4"  fill="#ec4899" />
          </g>
        )}

        {/* ── EYE ── */}
        {isSleep
          /* closed: two thin curved lines */
          ? <>
              <path d={`M${41} ${headCY-3} Q${44} ${headCY-4.5} ${47} ${headCY-3}`}
                stroke="#160e1e" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              {/* Z Z Z sleep bubbles */}
              <text x="50" y={headCY - 8} fontSize="5" fill={furLight} opacity={0.7} fontWeight="bold">z</text>
              <text x="53" y={headCY - 12} fontSize="4" fill={furLight} opacity={0.5} fontWeight="bold">z</text>
            </>
          : isSniff
          /* sniffing: eye half-closed */
          ? <>
              <ellipse cx={44} cy={headCY - 3} rx="3.4" ry="2" fill="#160e1e" />
              <circle cx={45.2} cy={headCY - 4} r="1.0" fill="white" />
            </>
          : /* normal */
            <>
              <circle cx="44"   cy={headCY - 3} r="3.4" fill="#160e1e" />
              <circle cx="45.2" cy={headCY - 4.2} r="1.2" fill="white" />
              <circle cx="43"   cy={headCY - 1.9} r="0.5" fill="white" opacity={0.5} />
            </>
        }

        {/* female lashes */}
        {isFemale && !isSleep && <>
          <line x1="45.5" y1={headCY-5.5} x2="46.8" y2={headCY-7}   stroke="#160e1e" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="47"   y1={headCY-4.8} x2="48.5" y2={headCY-5.8} stroke="#160e1e" strokeWidth="0.7" strokeLinecap="round" />
          <line x1="47.8" y1={headCY-3.5} x2="49.5" y2={headCY-4}   stroke="#160e1e" strokeWidth="0.7" strokeLinecap="round" />
        </>}

        {/* ── NOSE ── sniff: nose twitches (CSS animation on wrapper) */}
        <ellipse cx="49.5" cy={headCY + 1.5} rx={isSniff ? 2.6 : 2} ry="1.4" fill={noseColor} />
        <path d={`M48.5 ${headCY+3} Q49.6 ${headCY+5} 50.8 ${headCY+3}`}
          stroke={noseColor} strokeWidth="0.9" strokeLinecap="round" fill="none" />

        {/* ── CHEEK BLUSH ── */}
        <ellipse cx="45.5" cy={headCY + 4} rx="3.2" ry="1.8" fill="#ff8090" opacity={blushOpacity} />

        {/* ── WHISKERS ── */}
        <line x1="50" y1={headCY+0}   x2="55.5" y2={headCY-2}   stroke={bodyStroke} strokeWidth="0.7" opacity="0.75" />
        <line x1="50" y1={headCY+1.5} x2="55.5" y2={headCY+1.5} stroke={bodyStroke} strokeWidth="0.7" opacity="0.75" />
        <line x1="50" y1={headCY+3}   x2="55.5" y2={headCY+4.5} stroke={bodyStroke} strokeWidth="0.7" opacity="0.75" />
      </g>
    </svg>
  )
}

/* ─────────────────────────────────────────────────────
   Hook: independent random movement + idle poses
───────────────────────────────────────────────────── */
const IDLE_POSES: Pose[] = ['sit', 'sniff', 'sleep', 'eartwitch']

function useRabbitMove(
  trackRef:  React.RefObject<HTMLSpanElement | null>,
  runnerRef: React.RefObject<HTMLSpanElement | null>,
  flipRef:   React.RefObject<HTMLSpanElement | null>,
  rabbitW:   number,
  initDelay: number,
  setPose:   (p: Pose) => void,
  frozen:    boolean,
) {
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const posRef    = useRef(0)
  const frozenRef = useRef(frozen)
  const moveRef   = useRef<(() => void) | null>(null)

  // Define the move loop once
  useEffect(() => {
    const move = () => {
      if (frozenRef.current) return

      const track  = trackRef.current
      const runner = runnerRef.current
      const flip   = flipRef.current
      if (!track || !runner || !flip) return

      const maxX = Math.max(0, track.offsetWidth - rabbitW)
      if (maxX <= 0) { timerRef.current = setTimeout(move, 500); return }

      const doIdle = Math.random() < 0.4
      if (doIdle) {
        const idlePose = IDLE_POSES[Math.floor(Math.random() * IDLE_POSES.length)]
        setPose(idlePose)
        const idleDur = 1800 + Math.random() * 2200
        timerRef.current = setTimeout(() => {
          if (frozenRef.current) return
          setPose('run')
          timerRef.current = setTimeout(move, 400)
        }, idleDur)
        return
      }

      const targetX = Math.random() * maxX
      const goRight = targetX >= posRef.current
      const dist    = Math.abs(targetX - posRef.current)
      const dur     = Math.max(600, (dist / 80) * 1000)

      setPose('run')
      runner.style.transition = `transform ${dur}ms linear`
      runner.style.transform  = `translateX(${targetX}px)`
      flip.style.transition   = 'none'
      flip.style.transform    = `scaleX(${goRight ? 1 : -1})`
      runner.classList.add('rab-moving')
      posRef.current = targetX

      timerRef.current = setTimeout(() => {
        runner.classList.remove('rab-moving')
        if (frozenRef.current) return
        timerRef.current = setTimeout(move, 1000 + Math.random() * 2000)
      }, dur)
    }

    moveRef.current = move
    if (!frozenRef.current) timerRef.current = setTimeout(move, initDelay)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // React to frozen changes (route changes)
  useEffect(() => {
    frozenRef.current = frozen
    if (frozen) {
      if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
      const runner = runnerRef.current
      if (runner) runner.classList.remove('rab-moving')
      setPose('sleep')
    } else {
      // Waking up — restart move loop after a short stretch
      if (moveRef.current) {
        timerRef.current = setTimeout(moveRef.current, 1000)
      }
    }
  }, [frozen]) // eslint-disable-line react-hooks/exhaustive-deps
}

/* ─────────────────────────────────────────────────────
   Main component — two rabbits on the same track
───────────────────────────────────────────────────── */
// Routes where the user is reading/concentrating — rabbits sleep
function useIsReading() {
  const pathname = usePathname()
  // blog post pages and series chapter pages
  return /^\/blog\/(?!$)/.test(pathname ?? '')
}

export default function NavRabbit() {
  const isReading = useIsReading()
  const [hovered, setHovered] = useState(false)

  // Frozen only when on a reading page AND user is not hovering
  const frozen = isReading && !hovered

  const trackRef      = useRef<HTMLSpanElement>(null)
  const maleRef       = useRef<HTMLSpanElement>(null)
  const maleFlipRef   = useRef<HTMLSpanElement>(null)
  const femaleRef     = useRef<HTMLSpanElement>(null)
  const femaleFlipRef = useRef<HTMLSpanElement>(null)

  const [malePose,   setMalePose]   = useState<Pose>('sit')
  const [femalePose, setFemalePose] = useState<Pose>('sniff')

  useRabbitMove(trackRef, maleRef,   maleFlipRef,   46, 800,  setMalePose,   frozen)
  useRabbitMove(trackRef, femaleRef, femaleFlipRef, 46, 2200, setFemalePose, frozen)

  return (
    <span
      ref={trackRef}
      className="relative block h-full w-full overflow-visible"
      role="img"
      aria-label="Male and female rabbits"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{`
        .rab-moving .rab-bi {
          animation: rab-bounce 0.5s ease-in-out infinite;
        }
        @keyframes rab-bounce {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-2px); }
        }
        .rab-sniff .rab-bi {
          animation: rab-sniff 0.7s ease-in-out infinite;
        }
        @keyframes rab-sniff {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          40%     { transform: translateY(1px) rotate(3deg); }
        }
      `}</style>

      {/* Male rabbit */}
      <span ref={maleRef} style={{ position: 'absolute', bottom: '4px', transform: 'translateX(0px)', willChange: 'transform' }}>
        <span ref={maleFlipRef} style={{ display: 'block', transform: 'scaleX(1)' }}>
          <span className={`rab-bi block${malePose === 'sniff' ? ' rab-sniff-inner' : ''}`}>
            <RabbitSVG gender="male" pose={malePose} />
          </span>
        </span>
      </span>

      {/* Female rabbit */}
      <span ref={femaleRef} style={{ position: 'absolute', bottom: '4px', transform: 'translateX(60px)', willChange: 'transform' }}>
        <span ref={femaleFlipRef} style={{ display: 'block', transform: 'scaleX(-1)' }}>
          <span className={`rab-bi block${femalePose === 'sniff' ? ' rab-sniff-inner' : ''}`}>
            <RabbitSVG gender="female" pose={femalePose} />
          </span>
        </span>
      </span>
    </span>
  )
}

