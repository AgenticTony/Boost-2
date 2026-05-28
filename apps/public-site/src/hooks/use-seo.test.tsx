import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { useSeo } from "./use-seo";

function renderWithHelmet(ui: React.ReactElement) {
  return render(<HelmetProvider>{ui}</HelmetProvider>);
}

function SeoTestPage(props: Parameters<typeof useSeo>[0]) {
  return <>{useSeo(props)}</>;
}

describe("useSeo", () => {
  it("renders title and description meta tags", () => {
    renderWithHelmet(
      <SeoTestPage title="Kontakt" description="Kontakta oss" />,
    );

    // Helmet renders into document head asynchronously
    // We check the helmet state via the rendered output
    const helmet = document.querySelector('meta[name="description"]');
    expect(helmet?.getAttribute("content")).toBe("Kontakta oss");
  });

  it("renders OpenGraph tags", () => {
    renderWithHelmet(
      <SeoTestPage title="Om oss" description="Om Boost" image="/og.png" />,
    );

    const ogTitle = document.querySelector('meta[property="og:title"]');
    expect(ogTitle?.getAttribute("content")).toContain("Om oss");

    const ogImage = document.querySelector('meta[property="og:image"]');
    expect(ogImage?.getAttribute("content")).toBe("/og.png");

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    expect(ogLocale?.getAttribute("content")).toBe("sv_SE");
  });

  it("renders canonical URL when provided", () => {
    renderWithHelmet(
      <SeoTestPage title="Test" description="Test" canonical="/kontakt" />,
    );

    const canonical = document.querySelector('link[rel="canonical"]');
    expect(canonical?.getAttribute("href")).toBe(
      "https://boostbyfcr.se/kontakt",
    );
  });

  it("strips the static SEO fallback from index.html so tags are not duplicated", () => {
    // Stand in for the hardcoded tags in index.html. Helmet appends rather than
    // replacing them, so without this cleanup every page carries two of each -
    // the generic one first, which is the one Google is likeliest to take.
    const stale = document.createElement("meta");
    stale.setAttribute("data-static-seo", "");
    stale.setAttribute("name", "description");
    stale.setAttribute("content", "generic fallback");
    document.head.appendChild(stale);

    renderWithHelmet(
      <SeoTestPage title="Kontakt" description="Kontakta oss" />,
    );

    expect(document.querySelectorAll("head [data-static-seo]")).toHaveLength(0);
  });

  it("omits the robots tag by default so normal pages stay indexable", () => {
    renderWithHelmet(
      <SeoTestPage title="Kontakt" description="Kontakta oss" />,
    );

    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("renders noindex,follow when noindex is set", () => {
    renderWithHelmet(
      <SeoTestPage
        title="Sidan hittades inte"
        description="Finns inte"
        noindex
      />,
    );

    const robots = document.querySelector('meta[name="robots"]');
    expect(robots?.getAttribute("content")).toBe("noindex, follow");
  });

  it("renders og:url alongside the canonical", () => {
    // Regression guard: these two used to share one conditional wrapping a
    // fragment. react-helmet-async does not traverse fragment children, so it
    // emitted the <link> and dropped the <meta> - og:url was missing on every
    // page. Assert both, not just the canonical.
    renderWithHelmet(
      <SeoTestPage title="Test" description="Test" canonical="/kontakt" />,
    );

    expect(
      document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    ).toBe("https://boostbyfcr.se/kontakt");
    expect(
      document
        .querySelector('meta[property="og:url"]')
        ?.getAttribute("content"),
    ).toBe("https://boostbyfcr.se/kontakt");
  });

  it("renders JSON-LD structured data", () => {
    renderWithHelmet(<SeoTestPage title="Test" description="Test" />);

    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    const parsed = JSON.parse(scripts[0].textContent || "{}");
    expect(parsed["@type"]).toBe("NGO");
    expect(parsed.name).toBe("Boost by FC Rosengård");
  });

  it("includes custom JSON-LD when provided", () => {
    renderWithHelmet(
      <SeoTestPage
        title="Test"
        description="Test"
        jsonLd={{ "@type": "WebPage", name: "Test Page" }}
      />,
    );

    const scripts = document.querySelectorAll(
      'script[type="application/ld+json"]',
    );
    expect(scripts.length).toBe(2);
  });
});
