import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { ArrowRight, Dumbbell, Apple, Moon, Brain } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const features = [
  {
    icon: Dumbbell,
    title: "Fysisk träning",
    body: "Gymträning, klättring, thaiboxning och mer. Du provar aktiviteter du kanske aldrig testat, utmanar dig fysiskt och märker snabbt vad kroppen klarar av - och tycker om.",
  },
  {
    icon: Apple,
    title: "Kost och näring",
    body: "Vi håller workshops om vad du äter och hur det påverkar din energi, koncentration och humör. Inga dieter, inga pekpinnar - bara faktabaserad kunskap du faktiskt kan använda.",
  },
  {
    icon: Moon,
    title: "Sömn och återhämtning",
    body: "Sömnbrist påverkar allt - från motivation till minnesfunktion. Vi pratar om varför sömn är avgörande och ger dig konkreta verktyg för att förbättra den.",
  },
  {
    icon: Brain,
    title: "Psykiskt välmående",
    body: "I öppna samtal och workshops pratar vi om stress, självförtroende, motivation och hur träning påverkar ditt mående. Du är inte ensam om det du känner - och det ska du inte behöva vara.",
  },
];

export default function HalsosparetPage() {
  const seo = useSeo({
    title: "Hälsospåret",
    description:
      "Fysisk träning, kostworkshops, sömnstöd och samtal om välmående. För att orka ta nästa steg måste du må bra.",
    canonical: "/halsosparet",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)]">
          <img
            src="/images/Haelsospaaret3.jpeg"
            alt="Hälsa och rörelse - deltagare tränar tillsammans"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -right-32 h-96 w-96 rounded-full bg-brand-navy/10 blur-3xl" />
        <div className="pointer-events-none absolute -top-32 -left-32 h-80 w-80 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              Hälsospåret
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Kropp och knopp i balans
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              För att orka ta nästa steg måste du må bra. Vi hjälper dig dit.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Intro - 2-col with image */}
      <section className="relative py-16 md:py-24 bg-white overflow-hidden">
        {/* Tree of life - Anna's requested health/roots symbol, soft background motif */}
        <img
          src="/images/illustration-tree-of-life.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute right-[-5rem] md:right-[4%] top-1/2 -translate-y-1/2 w-[22rem] md:w-[30rem] max-w-none opacity-[0.08] select-none"
          loading="lazy"
          decoding="async"
        />
        <div className="container-page relative">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-6">
                Hälsa är inte ett sidospår - det är grunden
              </h2>
              <p className="text-text-muted leading-relaxed">
                Forskningen är tydlig: ohälsa och arbetslöshet förstärker
                varandra i en negativ spiral. Det vet vi på Boost - och det är
                varför hälsa är en lika stor del av vår verksamhet som studier
                och jobbsökning. Hälsospåret är för dig som vill röra på
                kroppen, äta bättre, sova bättre eller bara hitta ett sammanhang
                där du trivs.
              </p>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 rounded-3xl bg-brand-red/10 -rotate-1" />
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brand-blue-light/20" />
                  <img
                    src="/images/Haelsospaaret2.jpeg"
                    alt="Deltagare i Hälsospåret - träning och gemenskap"
                    className="relative w-full h-auto rounded-3xl shadow-lg object-cover max-h-72"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Stats bar - glass chips */}
      <section className="bg-brand-navy text-white overflow-hidden">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              { label: "Träning ingår", emoji: "Fysisk" },
              { label: "Workshops", emoji: "Kost" },
              { label: "Om välmående", emoji: "Samtal" },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 py-6 px-4">
                  <p className="text-2xl md:text-3xl font-display font-extrabold text-brand-red-bright tracking-tight">
                    {stat.emoji}
                  </p>
                  <p className="mt-2 text-white/60 text-xs md:text-sm">
                    {stat.label}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
        <WaveDivider from="navy" to="surface" />
      </section>

      {/* Features grid */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text mb-12">
              Det här ingår i hälsospåret
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
            {features.map((f, i) => (
              <ScrollReveal key={f.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-border/60 p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-navy text-white mb-5">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-text mb-2">
                    {f.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy text-white overflow-hidden border-b-4 border-b-brand-red">
        <WaveDivider from="surface" to="navy" mirror />
        <div className="container-page pt-4 pb-16 md:pt-6 md:pb-24 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4">
              En trygg plats att börja från
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Hälsospåret är inte ett program du måste prestera i. Det är en
              plats att hitta energi, gemenskap och tron på att du kan.
              Välkommen som du är.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/anmal-dig2">
                Börja din resa <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
