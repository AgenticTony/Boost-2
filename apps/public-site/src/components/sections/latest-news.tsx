import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryLabels, categoryColors } from "@/lib/news-utils";
import { useNews } from "@/hooks/use-news";

export function LatestNews() {
  const { data: articles = [], isLoading: loading, error } = useNews();
  const errorMsg = error ? "Kunde inte ladda nyheter." : null;

  if (errorMsg) {
    return (
      <section className="py-12 md:py-16">
        <div className="container-page text-center">
          <p className="text-text-muted">{errorMsg}</p>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="py-12 md:py-16">
        <div className="container-page">
          <div className="h-64 animate-pulse bg-muted/40 rounded-2xl" />
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  const displayed = articles.slice(0, 3);

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container-page">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-1 w-8 rounded-full bg-brand-red" />
              <p className="text-sm font-body font-medium text-brand-navy tracking-widest uppercase">
                Aktuellt
              </p>
            </div>
            <h2 className="text-3xl md:text-[2.5rem] font-display font-extrabold text-text leading-tight">
              Senaste från Boost
            </h2>
          </div>
          <Link
            to="/nyheter"
            className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
          >
            Se alla nyheter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayed.map((article) => (
            <Link
              key={article.id}
              to={`/nyheter/${article.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-border/60 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
            >
              {article.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.imageUrl}
                    alt={article.imageAlt || article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[article.category] ||
                      "bg-muted text-text-muted"
                    }`}
                  >
                    {categoryLabels[article.category] || article.category}
                  </span>
                  <span className="text-xs text-text-muted">
                    {new Date(article.publishedAt).toLocaleDateString("sv-SE", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg text-text mb-2 line-clamp-2 leading-snug">
                  {article.title}
                </h3>
                {article.excerpt && (
                  <p className="text-sm text-text-muted leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="md:hidden mt-8 text-center">
          <Link
            to="/nyheter"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
          >
            Se alla nyheter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
