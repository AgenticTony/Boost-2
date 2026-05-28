import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { formatDate, categoryLabels } from "@/lib/news-utils";
import { useNewsBySlug } from "@/hooks/use-news-by-slug";
import { useSeo } from "@/hooks/use-seo";

export default function NyheterSlugPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading: loading, error } = useNewsBySlug(slug);
  const errorMsg = error ? "Kunde inte ladda artikeln." : null;
  const notFound = !loading && !error && !article;

  // Rendered in every branch below, not just the article one: the loading and
  // error states are what a crawler sees if Hygraph is slow or down, and they
  // still need a title and description.
  const seo = useSeo(
    article
      ? {
          title: article.title,
          description: article.excerpt || article.title,
          canonical: `/nyheter/${slug}`,
          image: article.imageUrl || undefined,
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.excerpt || article.title,
            image: article.imageUrl,
            datePublished: article.publishedAt,
            author: article.author
              ? { "@type": "Person", name: article.author }
              : { "@type": "Organization", name: "Boost by FC Rosengård" },
            publisher: {
              "@type": "Organization",
              name: "Boost by FC Rosengård",
              logo: {
                "@type": "ImageObject",
                url: "https://boostbyfcr.se/images/boost-logo.png",
              },
            },
          },
        }
      : {
          title: "Nyheter",
          description: "Senaste nytt från Boost by FC Rosengård",
        },
  );

  if (errorMsg) {
    return (
      <>
        {seo}
        <div className="container-page py-20 text-center">
          <p className="text-text-muted mb-4">{errorMsg}</p>
          <Link
            to="/nyheter"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Tillbaka till nyheter
          </Link>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        {seo}
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="h-8 w-32 animate-pulse bg-muted/40 rounded" />
            <div className="h-12 animate-pulse bg-muted/40 rounded" />
            <div className="h-64 animate-pulse bg-muted/40 rounded" />
          </div>
        </div>
      </>
    );
  }

  if (notFound || !article) {
    return (
      <>
        {seo}
        <div className="container-page py-20 text-center">
          <h1 className="text-3xl font-display font-extrabold text-text mb-4">
            Artikeln hittades inte
          </h1>
          <Link
            to="/nyheter"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
          >
            <ArrowLeft className="h-4 w-4" /> Tillbaka till nyheter
          </Link>
        </div>
      </>
    );
  }

  // After guards, article is narrowed to defined
  return (
    <>
      {seo}
      <article>
        {article.imageUrl && (
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.imageAlt || article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}
        <div className="container-page py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/nyheter"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline mb-8"
            >
              <ArrowLeft className="h-4 w-4" /> Alla nyheter
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-navy text-white">
                {categoryLabels[article.category] || article.category}
              </span>
              <span className="text-sm text-text-muted">
                {formatDate(article.publishedAt)}
              </span>
              {article.author && (
                <span className="text-sm text-text-muted">
                  &middot; {article.author}
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text leading-tight mb-8">
              {article.title}
            </h1>
            {article.body && (
              <div className="prose prose-sm max-w-none text-text-muted leading-relaxed">
                {article.body.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
