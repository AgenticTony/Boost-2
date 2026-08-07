import { Helmet } from "react-helmet-async";

const SITE_NAME = "Boost by FC Rosengård";

export interface SeoProps {
  /** Page title, without the site suffix. */
  title: string;
  description?: string;
}

/**
 * Per-page title and description for the members area.
 *
 * Deliberately much smaller than public-site's equivalent. That one carries
 * Open Graph tags, Twitter cards, canonical URLs and JSON-LD, all of which
 * exist to make a page share and rank well. Nothing here should be shared or
 * ranked, so emitting them would be pure noise - and an og:image for a locked
 * page is an invitation to look.
 *
 * `noindex, nofollow` is unconditional rather than a prop for the same reason:
 * there is no page in this app that should ever be indexed, so it is not a
 * per-page decision. It repeats the static tag in index.html, which covers
 * crawlers that never execute JavaScript.
 *
 * A component, not a hook. public-site names its equivalent `useSeo`, and its
 * own doc comment concedes it is not a hook - that name is kept there only for
 * back-compat with existing imports. The `use` prefix makes ESLint enforce the
 * rules of hooks, so any page calling it after an early return fails lint.
 * New code has no back-compat to honour, so it gets the honest name.
 *
 * @example
 *   <Seo title="Bibliotek" description="Övningar och metodmaterial." />
 */
export function Seo({ title, description }: SeoProps) {
  return (
    <Helmet>
      <title>{`${title} | ${SITE_NAME}`}</title>
      {description && <meta name="description" content={description} />}
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
}
