import { Mail, Phone } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";

export default function PressMediaPage() {
  const seo = useSeo({
    title: "Press & media",
    description:
      "Pressinformation och kontaktpersoner för Boost by FC Rosengård.",
    canonical: "/press-media",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-32 h-80 w-80 rounded-full bg-brand-navy/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              Press
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Press & media
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Frågor om Boost? Vi berättar gärna mer om vad vi gör och varför.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text mb-6">
              Mediainformation - Boost by FC Rosengård
            </h2>
            <div className="space-y-5 text-text-muted leading-relaxed mb-10">
              <p>
                Boost by FC Rosengård är en idéburen organisation som sedan 2003
                har hjälpt tusentals unga i Malmö att hitta sin plats på
                arbetsmarknaden. Vi erbjuder stöd inom tre huvudsakliga spår -
                arbete, studier och hälsa - och finansieras bland annat av EU:s
                Socialfond, Allmänna Arvsfonden och Malmö stad.
              </p>
              <p>
                Vi samarbetar med Arbetsförmedlingen, Malmö stad och ett brett
                nätverk av arbetsgivare för att skapa reella möjligheter för
                varje individ.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow h-full">
                <h3 className="font-display font-semibold text-text mb-4">
                  Presskontakt
                </h3>
                <div className="space-y-3">
                  <p className="text-text-muted text-sm">
                    Anna Nettrup - Projektledare
                  </p>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Mail className="h-4 w-4 text-brand-red" />
                    <a
                      href="mailto:anna.nettrup@boostbyfcr.se"
                      className="hover:text-brand-navy transition-colors"
                    >
                      anna.nettrup@boostbyfcr.se
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Phone className="h-4 w-4 text-brand-red" />
                    <a
                      href="tel:+46709921766"
                      className="hover:text-brand-navy transition-colors"
                    >
                      070-992 17 66
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="bg-white rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm hover:shadow-md transition-shadow h-full">
                <h3 className="font-display font-semibold text-text mb-4">
                  Samarbeten
                </h3>
                <div className="space-y-3">
                  <p className="text-text-muted text-sm">
                    Käthe Andersson - Samarbetssansvarig
                  </p>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Mail className="h-4 w-4 text-brand-red" />
                    <a
                      href="mailto:kathe.andersson@boostbyfcr.se"
                      className="hover:text-brand-navy transition-colors"
                    >
                      kathe.andersson@boostbyfcr.se
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Phone className="h-4 w-4 text-brand-red" />
                    <a
                      href="tel:+46721645345"
                      className="hover:text-brand-navy transition-colors"
                    >
                      072-164 53 45
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
