import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import {
  ArrowRight,
  Briefcase,
  BookOpen,
  Heart,
  CheckCircle,
} from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const faqItems = [
  {
    q: "Om jag vill plugga?",
    a: "På Boost har vi både pedagoger och studie- och yrkesvägledare som du kan träffa hos oss. Du kan få både hjälp med att studera enskilda ämnen som matte eller svenska, förbereda dig inför högskoleprovet eller söka till utbildningar. Visste du att vi också har körkortsteori på Boost?",
  },
  {
    q: "Är era deltagare nöjda?",
    a: "Vi hoppas det! I en enkät som en extern utvärderare gjorde fick vi 8 av 10 på en nöjdhetsskala. Vi lyssnar hela tiden på våra deltagare och försöker att anpassa vad vi gör och erbjuder för att det ska passa våra deltagare.",
  },
  {
    q: "Om jag inte vet vad jag vill göra i framtiden, kan ni hjälpa mig?",
    a: "Absolut! Det är vanligt att deltagare som kommer till oss är osäkra på vad de vill jobba med. När du träffar din vägledare eller någon här på Boost kan du diskutera olika möjligheter och vägar. Vi har också workshops som handlar om just att få dig att komma på vad du vill.",
  },
  {
    q: "Samarbetar ni med Arbetsförmedlingen?",
    a: "Vi samarbetar nära med arbetsförmedlingen. De anvisar dig som arbetssökande till oss så att vi kan ge dig stöd. Våra vägledare ger sedan återkoppling till dem om hur det går för dig. Om du behöver stöd i kontakten med exempelvis kommunen så finns vi med dig.",
  },
];

const tracks = [
  {
    icon: Briefcase,
    title: "Arbetsspåret",
    body: "Intensivt stöd med personlig vägledare, CV-bygge, intervjuträning och direkt kontakt med arbetsgivare.",
  },
  {
    icon: BookOpen,
    title: "Studiespåret",
    body: "Studier i din egen takt med legitimerade lärare och individuell studieplanering. Inga klasser, inga klockor.",
  },
  {
    icon: Heart,
    title: "Hälsospåret",
    body: "Fysisk träning, kostworkshops och samtal om välmående. För att du ska orka ta nästa steg.",
  },
];

export default function ArbetssokandePage() {
  const seo = useSeo({
    title: "Arbetssökande",
    description:
      "På Boost hjälper vi dig att stärka dig själv och din kompetens så att du lättare kommer in på arbetsmarknaden.",
    canonical: "/arbetssokande",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)]">
          <img
            src="/images/Arbetssoekande1.jpg"
            alt="Person som tar steget in i arbetslivet med stöd från Boost"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-32 h-80 w-80 rounded-full bg-brand-navy/8 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              För arbetssökande
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Väx på ditt sätt hos oss
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed mb-8">
              På Boost hjälper vi dig att stärka dig själv och din kompetens så
              att du lättare kommer in på arbetsmarknaden. Oavsett om du vill
              jobba eller studera anpassar vi våra insatser efter dina mål och
              behov.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/anmal-dig2">
                Anmäl dig här <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Vårt arbetssätt */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-6">
              Vårt arbetssätt
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <div className="space-y-5 text-text-muted leading-relaxed">
              <p>
                Alla är bra på olika saker och har olika mål i livet. Därför går
                det inte heller att behandla alla samma på samma sätt. Det är vi
                medvetna om på Boost. När du kommer till oss väljer du vilket
                stöd du vill ha så att de aktiviteter du deltar i anpassade för
                just dig. Du får en personlig vägledare som hjälper dig att göra
                en plan för din tid hos oss, och att sätta upp mål för
                framtiden.
              </p>
              <p>
                Som deltagare i Boost får du själv vara med och ta ett stort
                ansvar för vad du gör när du är här. Du får också utveckla din
                förmåga att se möjligheter, ta initiativ, lösa problem och göra
                handling av dina idéer. Till din hjälp har du våra vägledare,
                pedagoger och all annan personal hos oss som peppar och pushar
                dig mot dina mål.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Three tracks */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <ScrollReveal>
            <p className="text-sm font-body font-medium text-brand-navy tracking-widest uppercase mb-3">
              Tre spår - samma mål
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-12">
              Välj ditt spår
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
            {tracks.map((track, i) => (
              <ScrollReveal key={track.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-border/60 p-8 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-navy text-white mb-5">
                    <track.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-text mb-2">
                    {track.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {track.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-2xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-10">
              Vanliga frågor
            </h2>
          </ScrollReveal>
          <div className="space-y-0">
            {faqItems.map((item, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div
                  className={i > 0 ? "border-t border-border pt-8 mt-8" : ""}
                >
                  <h3 className="font-display font-semibold text-base md:text-lg text-text mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-brand-red shrink-0" />
                    {item.q}
                  </h3>
                  <p className="text-text-muted leading-relaxed pl-6">
                    {item.a}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy text-white overflow-hidden border-b-4 border-b-brand-red">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page pt-4 pb-16 md:pt-6 md:pb-24 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4">
              Redo att ta steget?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Vi finns här för dig. Berätta vad du behöver - så hittar vi vägen
              tillsammans.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/anmal-dig2">
                Anmäl dig idag <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
