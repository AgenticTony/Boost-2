import { describe, it, expect } from "vitest";
import { readFileSync, globSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Asserts the parts of the shell that live in index.css and index.html rather
 * than in React, and which no component test would notice going missing.
 */
const appRoot = process.cwd();
const read = (p: string) => readFileSync(resolve(appRoot, p), "utf8");

describe("index.html shell", () => {
  const html = read("index.html");

  it("has a skip link pointing at the main landmark", () => {
    // The .skip-to-content styles were in index.css from the start; only this
    // anchor was missing, so the app shipped dead CSS and no skip link.
    expect(html).toMatch(
      /<a[^>]+href="#main-content"[^>]*class="skip-to-content"/,
    );
  });

  it("targets a main landmark that actually exists", () => {
    const app = read("src/App.tsx");
    expect(app).toContain('id="main-content"');
  });

  it("declares exactly one main landmark in the whole app", () => {
    // Both page-layout.tsx and handbook-reader.tsx used to render their own
    // <main> inside the one App.tsx provides. Nested main landmarks are
    // invalid, and they leave the skip link aimed at the wrong element.
    //
    // Scans every source file rather than a hand-listed few: the second
    // offender was in a page, which a curated list would have missed - and did.
    const stripComments = (src: string) =>
      src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");

    const files = globSync("src/**/*.tsx", { cwd: appRoot }).filter(
      (f) => !f.includes(".test."),
    );

    const offenders = files.filter((file) =>
      /<main[\s>]/.test(stripComments(read(file))),
    );

    expect(offenders).toEqual(["src/App.tsx"]);
  });

  it("ships a favicon that exists", () => {
    const icon = html.match(/<link[^>]+rel="icon"[^>]+href="([^"]+)"/);
    expect(icon).not.toBeNull();
    expect(() => read(`public${icon![1]}`)).not.toThrow();
  });

  it("preloads the fonts it references, and they exist", () => {
    const preloads = [
      ...html.matchAll(/rel="preload"[\s\S]*?href="([^"]+\.woff2)"/g),
    ].map((m) => m[1]);
    expect(preloads.length).toBeGreaterThan(0);
    for (const href of preloads) {
      expect(() => read(`public${href}`)).not.toThrow();
    }
  });

  it("paints something before hydration", () => {
    const root = html.match(/<div id="root">([\s\S]*?)<\/div>\s*<script/);
    expect(root?.[1].trim().length ?? 0).toBeGreaterThan(0);
  });

  it("sets a theme colour", () => {
    expect(html).toMatch(/<meta name="theme-color"/);
  });

  it("emits no Open Graph or Twitter tags", () => {
    // Every page here is private. Giving unfurlers a title, description and
    // image would preview exactly what the login screen protects.
    expect(html).not.toMatch(/property="og:/);
    expect(html).not.toMatch(/name="twitter:/);
  });
});

describe("design tokens", () => {
  it("keeps index.css byte-identical to public-site's", () => {
    // The two apps share one design system; a token added to one and not the
    // other is how they drift apart.
    const ours = read("src/index.css");
    const theirs = read("../public-site/src/index.css");
    expect(ours).toBe(theirs);
  });
});
