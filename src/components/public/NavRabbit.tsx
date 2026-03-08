'use client'

import { useEffect, useRef } from 'react'

export default function NavRabbit() {
  const trackRef = useRef<HTMLSpanElement>(null)
  const runnerRef = useRef<HTMLSpanElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const posRef = useRef(0)

  useEffect(() => {
    const RABBIT_W = 44

    const move = () => {
      const track = trackRef.current
      const runner = runnerRef.current
      if (!track || !runner) return

      const maxX = Math.max(0, track.offsetWidth - RABBIT_W)
      if (maxX <= 0) {
        timerRef.current = setTimeout(move, 500)
        return
      }

      // Pick a random destination
      const targetX = Math.random() * maxX
      const goRight = targetX >= posRef.current
      const dist = Math.abs(targetX - posRef.current)

      // ~150 px/s running speed
      const duration = Math.max(300, (dist / 150) * 1000)

      runner.style.transition = `transform ${duration}ms linear`
      runner.style.transform = `translateX(${targetX}px) scaleX(${goRight ? 1 : -1})`
      runner.classList.add('rab-moving')
      posRef.current = targetX

      // Arrive → pause a moment → pick next destination
      timerRef.current = setTimeout(() => {
        runner.classList.remove('rab-moving')
        const pause = Math.random() * 900 + 200
        timerRef.current = setTimeout(move, pause)
      }, duration)
    }

    timerRef.current = setTimeout(move, 400)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <span
      ref={trackRef}
      className="relative block h-full w-full overflow-visible"
      role="img"
      aria-label="Running rabbit"
    >
      <style>{`
        .rab-moving .rab-bi {
          animation: rab-run-bounce 0.28s ease-in-out infinite;
        }
        @keyframes rab-run-bounce {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(-2px); }
        }
      `}</style>

      <span
        ref={runnerRef}
        style={{
          position: 'absolute',
          bottom: 0,
          transform: 'translateX(0px) scaleX(1)',
          willChange: 'transform',
        }}
      >
        <span className="rab-bi block">
          <svg
            width="44"
            height="46"
            viewBox="0 -14 56 66"
            overflow="visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="rFur" cx="42%" cy="36%" r="62%">
                <stop offset="0%" stopColor="#f4f0e6" />
                <stop offset="100%" stopColor="#ccc0ac" />
              </radialGradient>
            </defs>

            <g>
              {/* FAR back leg: hip at (17,38) */}
              <g transform="translate(17,38)">
                <path d="M0,0 C-4,4 3,10 1,19" stroke="#b8ad9a" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="rotate"
                    values="-26,0,0; 22,0,0; -26,0,0"
                    keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
                </path>
              </g>

              {/* FAR front leg: shoulder at (30,38) */}
              <g transform="translate(30,38)">
                <path d="M0,0 C2,5 1,11 3,17" stroke="#b8ad9a" strokeWidth="3.5" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="rotate"
                    values="22,0,0; -26,0,0; 22,0,0"
                    keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
                </path>
              </g>

              {/* FLUFFY COTTONTAIL */}
              <circle cx="5.5" cy="26" r="6.5" fill="#f8f5ef" />
              <circle cx="5"   cy="25" r="4.5" fill="white"   />

              {/* BODY */}
              <ellipse cx="22" cy="29" rx="17" ry="12" fill="url(#rFur)" />

              {/* NEAR back leg: opposite phase */}
              <g transform="translate(14,38)">
                <path d="M0,0 C-4,4 3,10 1,19" stroke="#ccc0ac" strokeWidth="5.5" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="rotate"
                    values="22,0,0; -26,0,0; 22,0,0"
                    keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
                </path>
              </g>

              {/* NEAR front leg: opposite phase */}
              <g transform="translate(27,38)">
                <path d="M0,0 C2,5 1,11 3,17" stroke="#ccc0ac" strokeWidth="4.5" strokeLinecap="round" fill="none">
                  <animateTransform attributeName="transform" type="rotate"
                    values="-26,0,0; 22,0,0; -26,0,0"
                    keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
                </path>
              </g>

              {/* BACK EAR */}
              <ellipse cx="35" cy="4" rx="4"   ry="13"  fill="#bdb19d" transform="rotate(-14 35 17)" />
              <ellipse cx="35" cy="4" rx="2.2" ry="8.5" fill="#f09aaa" transform="rotate(-14 35 17)" />

              {/* HEAD */}
              <circle cx="38" cy="21" r="12" fill="url(#rFur)" />

              {/* FRONT EAR */}
              <ellipse cx="41" cy="3" rx="5"   ry="14"  fill="#e8dece" transform="rotate(8 41 17)" />
              <ellipse cx="41" cy="3" rx="2.8" ry="9.5" fill="#f4a8b8" transform="rotate(8 41 17)" />

              {/* EYE */}
              <circle cx="44.5" cy="18"   r="3.5" fill="#160e1e" />
              <circle cx="45.8" cy="16.8" r="1.3" fill="white"   />
              <circle cx="43.6" cy="19.8" r="0.6" fill="white" opacity="0.55" />

              {/* NOSE */}
              <ellipse cx="50" cy="22.5" rx="2.2" ry="1.5" fill="#cc6070" />

              {/* SMILE */}
              <path d="M49 24 Q50.2 26.5 51.5 24" stroke="#aa4862" strokeWidth="1" strokeLinecap="round" fill="none" />

              {/* CHEEK BLUSH */}
              <ellipse cx="46" cy="25" rx="3.5" ry="2" fill="#ff8090" opacity="0.2" />

              {/* WHISKERS */}
              <line x1="50.5" y1="21"   x2="55.5" y2="19"   stroke="#c4b8a4" strokeWidth="0.8" opacity="0.8" />
              <line x1="50.5" y1="22.5" x2="55.5" y2="22.5" stroke="#c4b8a4" strokeWidth="0.8" opacity="0.8" />
              <line x1="50.5" y1="24"   x2="55.5" y2="26"   stroke="#c4b8a4" strokeWidth="0.8" opacity="0.8" />
            </g>
          </svg>
        </span>
      </span>
    </span>
  )
}
