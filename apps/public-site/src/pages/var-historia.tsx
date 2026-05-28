import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { ArrowRight } from "lucide-react";
import { useTimeline } from "@/hooks/use-timeline";
import { useSeo } from "@/hooks/use-seo";

export default function VarHistoriaPage() {
  const { data: timeline = [], isLoading: loading, error } = useTimeline();
  const errorMsg = error ? "Kunde inte ladda tidslinjen." : null;

  const seo = useSeo({
    title: "Vår historia",
    description:
      "Över 20 år av att skapa förändring - från en idé i Rosengård till en organisation som hjälper hundratals unga varje år.",
    canonical: "/var-historia",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute -bottom-48 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-48 h-[500px] w-[500px] rounded-full bg-brand-red/8 blur-3xl" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-navy/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              Vår historia
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Vi har funnits sedan 2003
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Från en idé i Rosengård till en organisation som hjälper
              hundratals unga varje år.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-12">
              Vår resa i korthet
            </h2>
          </ScrollReveal>
          <div className="relative">
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-border" />
            <div className="space-y-10">
              {loading && (
                <p className="text-text-muted pl-12">Laddar tidslinje…</p>
              )}
              {errorMsg && <p className="text-destructive pl-12">{errorMsg}</p>}
              {!loading &&
                !errorMsg &&
                timeline.map((entry, i) => (
                  <ScrollReveal key={entry.id} delay={i * 0.06}>
                    <div className="relative pl-12">
                      <div className="absolute left-0 top-1.5 h-10 w-10 rounded-full bg-brand-red flex items-center justify-center shadow-md">
                        <span className="text-xs font-display font-extrabold text-white">
                          {entry.year}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-text mb-2">
                        {entry.projectName}
                      </h3>
                      <p className="text-text-muted leading-relaxed text-sm">
                        {entry.description}
                      </p>
                      {entry.funder && (
                        <span className="inline-block mt-2 px-3 py-1 bg-surface text-text-muted text-xs rounded-full border border-border/60">
                          {entry.funder}
                        </span>
                      )}
                    </div>
                  </ScrollReveal>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy text-white overflow-hidden border-b-4 border-b-brand-red">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page pt-4 pb-16 md:pt-6 md:pb-24 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4">
              Vill du vara en del av nästa kapitel?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Vi letar alltid efter människor som vill bidra - som deltagare,
              samarbetspartner eller kollega.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
              >
                <Link to="/anmal-dig2">
                  Anmäl dig <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 font-display bg-transparent transition-all duration-300"
              >
                <Link to="/kontakt">Kontakta oss</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
