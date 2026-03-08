'use client'

/**
 * NavRabbit — a cute animated rabbit that runs left ↔ right in the navbar.
 *
 * Animation layers:
 *  1. CSS: `.rab-runner` slides the rabbit across the container width and
 *     flips it (scaleX) at each end so it always faces its direction of travel.
 *  2. SVG <animateTransform> on <g>: gentle two-beat body hop in sync with legs.
 *  3. SVG <animateTransform> on each leg rect: alternating bounding-gait lift
 *     (front pair + back pair swap every half-cycle).
 *  4. SVG <animateTransform> on ears: slow tilt that coincides with direction
 *     reversals.
 */
export default function NavRabbit() {
  return (
    <span
      className="relative flex h-12 w-24 shrink-0 items-end overflow-visible"
      role="img"
      aria-label="Running rabbit"
    >
      <style>{`
        .rab-track {
          position: absolute;
          bottom: 0;
          animation: rab-go 4s ease-in-out infinite;
        }
        @keyframes rab-go {
          0%,4%   { transform: translateX(0px)  scaleX(1);  }
          44%     { transform: translateX(52px) scaleX(1);  }
          50%,54% { transform: translateX(52px) scaleX(-1); }
          96%     { transform: translateX(0px)  scaleX(-1); }
          100%    { transform: translateX(0px)  scaleX(1);  }
        }
      `}</style>

      <span className="rab-track">
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
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-5; 0,0; 0,-5; 0,0"
              keyTimes="0; 0.15; 0.4; 0.65; 1"
              dur="0.52s"
              repeatCount="indefinite"
            />

            {/* FAR back leg: hip at (17,38), thigh sweeps back, hock sweeps forward */}
            <g transform="translate(17,38)">
              <path d="M0,0 C-4,4 3,10 1,19" stroke="#b8ad9a" strokeWidth="4.5" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values="-26,0,0; 22,0,0; -26,0,0"
                  keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
              </path>
            </g>

            {/* FAR front leg: shoulder at (30,38), slender near-vertical */}
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

            {/* NEAR back leg: opposite phase to far back leg */}
            <g transform="translate(14,38)">
              <path d="M0,0 C-4,4 3,10 1,19" stroke="#ccc0ac" strokeWidth="5.5" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values="22,0,0; -26,0,0; 22,0,0"
                  keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
              </path>
            </g>

            {/* NEAR front leg: opposite phase to far front leg */}
            <g transform="translate(27,38)">
              <path d="M0,0 C2,5 1,11 3,17" stroke="#ccc0ac" strokeWidth="4.5" strokeLinecap="round" fill="none">
                <animateTransform attributeName="transform" type="rotate"
                  values="-26,0,0; 22,0,0; -26,0,0"
                  keyTimes="0; 0.5; 1" dur="0.52s" repeatCount="indefinite" />
              </path>
            </g>

            {/* BACK EAR: darker, leans slightly backward, rotated around base */}
            <ellipse cx="35" cy="4" rx="4"   ry="13"  fill="#bdb19d" transform="rotate(-14 35 17)" />
            <ellipse cx="35" cy="4" rx="2.2" ry="8.5" fill="#f09aaa" transform="rotate(-14 35 17)" />

            {/* HEAD */}
            <circle cx="38" cy="21" r="12" fill="url(#rFur)" />

            {/* FRONT EAR: slightly longer, tilted forward */}
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
  )
}
