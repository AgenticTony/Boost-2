import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { WaveDivider } from "./wave-divider";

/**
 * The bug these guard against: the divider used to take a single colour, and
 * which side it landed on depended on a `flip` flag. Every in-section divider
 * ended up painting #FFFFFF above the wave while the section above was
 * #FAF8F5, leaving a white band and a hard horizontal line.
 */
function setup(ui: React.ReactElement) {
  const { container } = render(ui);
  const wrapper = container.firstElementChild as HTMLElement;
  const svg = wrapper.querySelector("svg")!;
  const paths = [...svg.querySelectorAll("path")];
  const rect = svg.querySelector("rect")!;
  return { wrapper, svg, paths, rect };
}

describe("WaveDivider", () => {
  it("paints `from` above the wave and `to` below it", () => {
    const { rect, paths } = setup(<WaveDivider from="surface" to="navy" />);

    // Everything above the crest is the backing rect.
    expect(rect.getAttribute("fill")).toBe("#FAF8F5");
    // Every crest path is the colour of the section below.
    paths.forEach((p) => expect(p.getAttribute("fill")).toBe("#072D59"));
  });

  it("stops the backing rect short of the box edge", () => {
    // Running it the full 64 puts `from` underneath the crest's own
    // antialiased bottom row, which composites to a hairline against the
    // section below. The crest never dips past y=55, so 58 still covers
    // everything above the wave.
    const { rect } = setup(<WaveDivider from="white" to="navy" />);

    const h = Number(rect.getAttribute("height"));
    expect(h).toBeGreaterThan(55);
    expect(h).toBeLessThan(64);
  });

  it("backs each edge with the colour on that side, so neither can bleed", () => {
    const { wrapper } = setup(<WaveDivider from="surface" to="navy" />);

    // from behind the top edge, to behind the bottom edge
    expect(wrapper.style.background).toMatch(
      /linear-gradient\(.*250, 248, 245.*7, 45, 89.*\)/,
    );
  });

  it("is positioned, so hero glow overlays cannot paint over the wave", () => {
    // Heroes place `absolute ... blur-3xl` circles before the divider. Against
    // a static divider those paint on top, tint the wave, then clip at the
    // section's overflow-hidden edge - a hard line across the divider.
    const { wrapper } = setup(<WaveDivider from="navy" to="white" />);

    expect(wrapper.className).toContain("relative");
  });

  it("resolves raw hex values as well as token names", () => {
    const { rect, paths } = setup(<WaveDivider from="#123456" to="#abcdef" />);

    expect(rect.getAttribute("fill")).toBe("#123456");
    expect(paths[paths.length - 1].getAttribute("fill")).toBe("#abcdef");
  });

  it("mirror changes only the shape, never which side is filled", () => {
    const plain = setup(<WaveDivider from="navy" to="white" />);
    const mirrored = setup(<WaveDivider from="navy" to="white" mirror />);

    expect(mirrored.wrapper.style.background).toBe(
      plain.wrapper.style.background,
    );
    expect(mirrored.paths.at(-1)!.getAttribute("fill")).toBe(
      plain.paths.at(-1)!.getAttribute("fill"),
    );
    expect(mirrored.svg.getAttribute("class")).toContain("-scale-x-100");
    expect(plain.svg.getAttribute("class")).not.toContain("-scale-x-100");
  });

  it("draws the echo wave behind the crest, and can omit it", () => {
    expect(setup(<WaveDivider from="navy" to="white" />).paths).toHaveLength(2);
    expect(
      setup(<WaveDivider from="navy" to="white" layered={false} />).paths,
    ).toHaveLength(1);
  });

  it("is hidden from assistive tech", () => {
    const { wrapper } = setup(<WaveDivider from="navy" to="white" />);
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });
});
