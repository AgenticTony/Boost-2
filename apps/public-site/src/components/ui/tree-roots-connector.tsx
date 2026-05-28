/**
 * TreeRootsConnector - an organic SVG illustration of tree roots/branches
 * that visually connects the three track cards. Positioned absolutely on
 * the left side of the tracks section.
 */
export function TreeRootsConnector() {
  return (
    <svg
      viewBox="0 0 60 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-6 md:left-[7%] top-0 bottom-0 w-[60px] h-full pointer-events-none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      {/* Main trunk line */}
      <path
        d="M30 0 C30 80, 28 120, 30 200 C32 280, 27 320, 30 400 C33 480, 28 520, 30 600"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.12"
        className="text-brand-navy"
      />

      {/* Branch node 1 - top (between hero + card 1) */}
      <circle cx="30" cy="100" r="4" className="fill-brand-navy/15" />
      {/* Small branch left */}
      <path
        d="M30 100 C22 90, 15 85, 8 80"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.10"
        className="text-brand-navy"
      />
      {/* Small branch right */}
      <path
        d="M30 100 C38 92, 44 88, 50 84"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.10"
        className="text-brand-navy"
      />

      {/* Branch node 2 - middle (between card 1 + card 2) */}
      <circle cx="30" cy="300" r="4" className="fill-brand-blue-light/25" />
      {/* Branch left */}
      <path
        d="M30 300 C20 288, 12 282, 5 278"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.10"
        className="text-brand-blue-light"
      />
      {/* Branch right */}
      <path
        d="M30 300 C40 290, 46 286, 52 282"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.10"
        className="text-brand-blue-light"
      />

      {/* Branch node 3 - bottom (between card 2 + card 3) */}
      <circle cx="30" cy="500" r="4" className="fill-brand-red/15" />
      {/* Branch left */}
      <path
        d="M30 500 C22 512, 14 518, 6 522"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.10"
        className="text-brand-red"
      />
      {/* Branch right */}
      <path
        d="M30 500 C38 510, 45 516, 52 520"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.10"
        className="text-brand-red"
      />

      {/* Root tendrils at base */}
      <path
        d="M30 580 C24 590, 16 596, 8 600"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
        className="text-brand-navy"
      />
      <path
        d="M30 580 C36 592, 42 598, 50 600"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.08"
        className="text-brand-navy"
      />
    </svg>
  );
}
