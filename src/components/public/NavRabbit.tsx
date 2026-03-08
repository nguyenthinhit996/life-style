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
      className="relative flex h-7 w-14 shrink-0 items-end overflow-hidden"
      role="img"
      aria-label="Running rabbit"
    >
      {/* Keyframes injected here so no global CSS writes are needed */}
      <style>{`
        .rab-runner {
          position: absolute;
          bottom: 0;
          /* slide left→right, pause, flip, slide right→left, pause, flip back */
          animation: rab-run 4s ease-in-out infinite;
        }
        @keyframes rab-run {
          0%   { transform: translateX(0px)  scaleX(1);  }
          5%   { transform: translateX(0px)  scaleX(1);  }
          43%  { transform: translateX(28px) scaleX(1);  }
          50%  { transform: translateX(28px) scaleX(-1); }
          55%  { transform: translateX(28px) scaleX(-1); }
          93%  { transform: translateX(0px)  scaleX(-1); }
          100% { transform: translateX(0px)  scaleX(1);  }
        }
      `}</style>

      <span className="rab-runner">
        {/*
          viewBox "0 0 20 26":
            – rabbit sits from y≈0 (ear tips) to y≈25 (leg bottoms)
            – width 20 fits tail(x≈2)…nose(x≈18)
        */}
        <svg
          width="20"
          height="26"
          viewBox="0 0 20 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* ── BODY GROUP (hops as a whole) ─────────────────────────────────── */}
          <g>
            {/* 2-beat hop: up at 0.125 & 0.625, down at 0.375 & 0.875 */}
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0,0; 0,-3; 0,0; 0,-3; 0,0"
              keyTimes="0; 0.125; 0.375; 0.625; 1"
              dur="0.46s"
              repeatCount="indefinite"
            />

            {/* ── EARS ────────────────────────────────────────────────────────── */}
            {/* Left ear — pivots at base (~12, 9) */}
            <ellipse cx="12" cy="4.5" rx="2" ry="5" fill="#c4b5fd">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0,12,9; -14,12,9; 0,12,9"
                keyTimes="0; 0.5; 1"
                dur="4s"
                repeatCount="indefinite"
              />
            </ellipse>
            {/* Right ear — pivots at base (~15, 9) */}
            <ellipse cx="15.5" cy="4" rx="2" ry="5.5" fill="#a78bfa">
              <animateTransform
                attributeName="transform"
                type="rotate"
                values="0,15.5,9; -14,15.5,9; 0,15.5,9"
                keyTimes="0; 0.5; 1"
                dur="4s"
                repeatCount="indefinite"
                begin="0.2s"
              />
            </ellipse>

            {/* ── HEAD ────────────────────────────────────────────────────────── */}
            <circle cx="13.5" cy="12" r="5" fill="#ede9fe" />

            {/* Eye */}
            <circle cx="15.8" cy="10.5" r="1.3" fill="#2d1b69" />
            <circle cx="16.2" cy="10.0" r="0.4" fill="white" />

            {/* Nose */}
            <ellipse cx="18" cy="13" rx="0.9" ry="0.6" fill="#fbcfe8" />

            {/* ── BODY ────────────────────────────────────────────────────────── */}
            <ellipse cx="8.5" cy="17.5" rx="6" ry="4" fill="#ede9fe" />

            {/* ── TAIL ────────────────────────────────────────────────────────── */}
            <circle cx="2.5" cy="16" r="2.5" fill="#ddd6fe" />

            {/* ── LEGS (bounding gait: front pair + back pair alternate) ──────── */}

            {/* Front leg A — up at t=0,0.5 */}
            <rect x="12.5" y="21" width="2.5" height="4" rx="1.2" fill="#c4b5fd">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="1,-3; 0,0; 1,-3; 0,0; 1,-3"
                keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur="0.46s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Front leg B — up at t=0,0.5 (together with A) */}
            <rect x="15" y="21" width="2" height="4" rx="1" fill="#c4b5fd">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-1,-3; 0,0; -1,-3; 0,0; -1,-3"
                keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur="0.46s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Back leg A — up at t=0.25, 0.75 (opposite phase to front) */}
            <rect x="6" y="21" width="2.5" height="4" rx="1.2" fill="#a78bfa">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; -1,-3; 0,0; -1,-3; 0,0"
                keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur="0.46s"
                repeatCount="indefinite"
              />
            </rect>

            {/* Back leg B — up at t=0.25, 0.75 (together with A) */}
            <rect x="8.5" y="21" width="2" height="4" rx="1" fill="#a78bfa">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0,0; 1,-3; 0,0; 1,-3; 0,0"
                keyTimes="0; 0.25; 0.5; 0.75; 1"
                dur="0.46s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
        </svg>
      </span>
    </span>
  )
}
