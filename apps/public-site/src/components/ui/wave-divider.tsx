/**
 * Wave divider between two full-width sections.
 *
 * A divider is a transition between TWO colours, so it takes both. `from` is
 * the colour above the wave, `to` is the colour below it - always, regardless
 * of where the component sits or which way the wave bows:
 *
 *     <WaveDivider from="surface" to="navy" />   // light section -> navy section
 *     <WaveDivider from="navy" to="white" />     // navy section -> white section
 *
 * The previous API took a single `color` and an optional `bg`, and which side
 * the fill landed on depended on a `flip` flag. That made it easy to get
 * backwards, and it was: every in-section divider on the site painted #FFFFFF
 * above the wave while the section above was #FAF8F5, leaving a visible band
 * and a hard horizontal line. Stating both colours makes that mistake
 * impossible - if `from` matches the section above, there is nothing to see.
 *
 * `mirror` flips the wave horizontally for visual variety. It only changes the
 * shape, never which side is filled, so it cannot reintroduce a seam.
 */

const TOKENS: Record<string, string> = {
  navy: "#072D59",
  white: "#FFFFFF",
  surface: "#FAF8F5",
};

const resolve = (c: string) => TOKENS[c] ?? c;

/**
 * Asymmetric crests, deliberately not a repeating sine.
 * The old path was two identical mirrored periods, which read as a generated
 * wave rather than a drawn one. These crests differ in width and height so the
 * curve never visibly repeats across the full width.
 */
const CREST =
  "M0 34C130 21 268 16 404 27C540 38 636 55 782 53C928 51 1046 31 1188 26C1288 22 1372 30 1440 35V64H0V34Z";

/** Same curve lifted ~7 units, so it peeks above the main one as a soft echo. */
const CREST_ECHO =
  "M0 27C140 15 280 11 420 22C560 33 650 50 800 48C950 46 1064 26 1204 21C1300 18 1378 26 1440 30V64H0V27Z";

export function WaveDivider({
  from,
  to,
  layered = true,
  mirror = false,
}: {
  /** Colour above the wave - match the section immediately above. */
  from: "navy" | "white" | "surface" | (string & {});
  /** Colour below the wave - match the section immediately below. */
  to: "navy" | "white" | "surface" | (string & {});
  /** Draw the softer echo wave behind the main crest. */
  layered?: boolean;
  /** Mirror horizontally. Shape only - never affects which side is filled. */
  mirror?: boolean;
}) {
  const above = resolve(from);
  const below = resolve(to);

  return (
    <div
      // `relative` is load-bearing. Section heroes place decorative
      // `absolute ... bg-brand-navy/10 blur-3xl` circles before the divider,
      // and absolutely positioned siblings paint over a static one - so the
      // glow tinted the wave (white 255,255,255 -> 231,234,239) and then
      // stopped dead at the section's overflow-hidden edge, which is exactly
      // where the divider ends. That abrupt stop was the line running across
      // the bottom of every navy hero. Positioning the divider puts it above
      // the glows, so the wave keeps its own colour.
      className="relative w-full leading-[0]"
      // preserveAspectRatio="none" with h-auto gives the SVG a fractional
      // height (1280 x 64/1440 = 56.9px), so its top and bottom rows are
      // antialiased and blend with whatever is behind them. This gradient puts
      // `from` behind the top edge and `to` behind the bottom edge, so both
      // blends are colour-on-same-colour and no hairline can appear.
      //
      // Relying on the next section to cover the bleed (a negative margin) does
      // not work: a divider at the top of a section is followed by that
      // section's own transparent content div, which paints nothing. That is
      // what left a pale line across the navy under the "Vill du vara en del av
      // det har?" wave.
      style={{
        background: `linear-gradient(to bottom, ${above} 0 2px, ${below} 2px 100%)`,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 64"
        xmlns="http://www.w3.org/2000/svg"
        // `block` matters: an inline SVG sits on the text baseline and leaves a
        // sub-pixel gap under it, which shows up as a hairline between sections.
        className={`block w-full h-auto ${mirror ? "-scale-x-100" : ""}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        {/* Height 58, not the full 64. The crest never dips below y=55, so this
            still covers every pixel above the wave - but it stops short of the
            box edge. Running it to 64 put white underneath the crest's own
            antialiased bottom row, which composited to a pale navy line one
            pixel above the section below (measured 28,63,103 against 7,45,89).
            Below y=58 the only things painted are the crest and the container
            gradient, both `to`, so the edge blends into itself. */}
        <rect width="1440" height="58" fill={above} />
        {layered && <path d={CREST_ECHO} fill={below} opacity="0.22" />}
        <path d={CREST} fill={below} />
      </svg>
    </div>
  );
}
