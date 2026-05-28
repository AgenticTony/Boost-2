import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

/**
 * Drop the generic SEO tags hardcoded in index.html.
 *
 * Those exist only for crawlers that do not execute JavaScript (Facebook,
 * LinkedIn, Slack, WhatsApp), which would otherwise unfurl a shared link with
 * no card at all. Helmet appends rather than replaces them, so once React is
 * running the head would carry two of every tag - the generic one first, which
 * is the one Google is most likely to take. Removing them here leaves exactly
 * one set: the page's own. Crawlers that never run JS never reach this code
 * and still see the static fallback.
 */
function useStripStaticSeoFallback() {
  useEffect(() => {
    document
      .querySelectorAll("head [data-static-seo]")
      .forEach((el) => el.remove());
  }, []);
}

const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Boost by FC Rosengård",
  url: "https://boostbyfcr.se",
  logo: "https://boostbyfcr.se/images/boost-logo.png",
  description:
    "Idéburen organisation med bas i Malmö sedan 2003. Vi arbetar för att öka inkluderingen i samhället.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Norra Grängesbergsgatan 15",
    addressLocality: "Malmö",
    postalCode: "214 50",
    addressCountry: "SE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "info@boostbyfcr.se",
    telephone: "+46-70-992-17-66",
    contactType: "customer service",
  },
  foundingDate: "2003",
  sameAs: [
    "https://www.instagram.com/boostbyfcrosengard/",
    "https://www.linkedin.com/company/boost-by-fc-rosengard/",
    "https://www.facebook.com/boostbyfcrosengard/",
  ],
};

type SeoProps = {
  title: string;
  description: string;
  /** Relative path for canonical URL (e.g. "/kontakt"). Prepended with site origin. */
  canonical?: string;
  /** Full URL to the og:image for social sharing. */
  image?: string;
  /**
   * Keep the page out of search results. Emits `noindex, follow` so crawlers
   * drop the URL but still crawl onward through its links.
   *
   * Needed because Cloudflare Pages serves the SPA shell with HTTP 200 for
   * every unmatched path (`/*  /index.html  200`), so an unknown URL is a
   * soft 404 - the 404 page renders, but the status code says "this is a real
   * page" and Google will happily index arbitrary junk URLs.
   */
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
};

/**
 * Renders page-specific <Helmet> meta tags and JSON-LD structured data.
 *
 * Despite the `use` prefix this is not a React hook - it returns JSX.
 * Kept as a function for backwards compatibility with existing page imports.
 *
 * @example
 *   useSeo({ title: "Kontakt", description: "..." })
 */
export function useSeo({
  title,
  description,
  canonical,
  image,
  noindex,
  jsonLd,
}: SeoProps) {
  useStripStaticSeoFallback();

  const structuredData = jsonLd ? [ORG_JSON_LD, jsonLd] : [ORG_JSON_LD];
  const siteOrigin = "https://boostbyfcr.se";
  // 1200x630 PNG. Must be a raster format at an absolute URL - Facebook,
  // LinkedIn and X all reject SVG og:images, and relative paths outright.
  const defaultImage = `${siteOrigin}/images/og-image.png`;
  const fullTitle = `${title} | Boost by FC Rosengård`;
  const shareImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:site_name" content="Boost by FC Rosengård" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="sv_SE" />
      <meta property="og:image" content={shareImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={shareImage} />
      {/* Two sibling conditionals, NOT one conditional wrapping a fragment.
          react-helmet-async does not walk into <>...</> children: it took the
          <link> and silently dropped the <meta>, so og:url was missing on
          every page while the canonical rendered fine. Keep these flat. */}
      {canonical && <link rel="canonical" href={`${siteOrigin}${canonical}`} />}
      {canonical && (
        <meta property="og:url" content={`${siteOrigin}${canonical}`} />
      )}
      {structuredData.map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data).replace(/<\//g, "<\\/"),
          }}
        />
      ))}
    </Helmet>
  );
}
