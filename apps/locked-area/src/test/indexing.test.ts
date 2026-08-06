import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * The members area must stay out of search engines.
 *
 * public/_redirects serves the SPA shell with HTTP 200 for every unmatched
 * path, so an unknown URL is a soft 404 - it renders "not found" while
 * claiming to be a real page. That is precisely the shape crawlers index
 * enthusiastically, so these two files are the only thing keeping the area
 * out of results if a link ever leaks.
 *
 * Asserted against the files on disk rather than a rendered document: both
 * are static assets that never pass through React, so nothing else in the
 * suite would notice them being removed.
 */
// vitest roots the process at the app directory. import.meta.url is not a
// file: URL under the jsdom environment, so it cannot be used here.
const appRoot = process.cwd();

function read(relativePath: string) {
  return readFileSync(resolve(appRoot, relativePath), "utf8");
}

describe("search engine exclusion", () => {
  it("ships a robots.txt that disallows everything", () => {
    expect(existsSync(resolve(appRoot, "public/robots.txt"))).toBe(true);

    const robots = read("public/robots.txt");
    expect(robots).toMatch(/^\s*User-agent:\s*\*/m);
    expect(robots).toMatch(/^\s*Disallow:\s*\/\s*$/m);
  });

  it("declares noindex in the HTML shell", () => {
    const html = read("index.html");
    const robotsMeta = html.match(
      /<meta\s+name="robots"\s+content="([^"]+)"\s*\/?>/i,
    );

    expect(robotsMeta).not.toBeNull();
    expect(robotsMeta?.[1]).toContain("noindex");
  });

  it("keeps every VITE_-prefixed variable free of secrets", () => {
    // VITE_ values are inlined verbatim into the public bundle. The example
    // file is the contract for what the client is allowed to see, so nothing
    // token-shaped may appear under that prefix.
    const example = read(".env.example");
    const vitePrefixed = [...example.matchAll(/^VITE_[A-Z0-9_]+/gm)].map(
      (m) => m[0],
    );

    expect(vitePrefixed).toEqual([
      "VITE_SUPABASE_URL",
      "VITE_SUPABASE_ANON_KEY",
    ]);
    expect(vitePrefixed).not.toContain("VITE_HYGRAPH_TOKEN_LOCKED");
    for (const name of vitePrefixed) {
      expect(name).not.toMatch(/TOKEN|SECRET|SERVICE_ROLE|PASSWORD/);
    }
  });
});
