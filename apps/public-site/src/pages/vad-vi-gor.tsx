import {
  Factory,
  GraduationCap,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const branches = [
  {
    icon: Factory,
    title: "Fabriken",
    body: "Beprövade lösningar till offentlig sektor - etablerade metoder som vi vet fungerar.",
    points: [
      "Upphandlade arbetsmarknadstjänster",
      "Samverkansformer som IOP",
      "Projekt med beprövade metoder",
    ],
  },
  {
    icon: GraduationCap,
    title: "Akademin",
    body: "Tjugo års erfarenhet delad med andra - utbildning, stöd och administration.",
    points: [
      "Föreläsningar och workshops",
      "Projektplanering och ansökningsskrivande",
      "Projektadministration och redovisning",
    ],
  },
  {
    icon: FlaskConical,
    title: "Labbet",
    body: "Innovation och nya metoder - morgondagens lösningar i nära samverkan.",
    points: [
      "Nya metoder och samarbeten",
      "Nya målgrupper och insatser",
      "Projektform med externa partners",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Lyssna",
    body: "Vi börjar alltid med att förståbehovet - från individ, organisation eller samhälle.",
  },
  {
    number: "02",
    title: "Designa",
    body: "Vi väljer rätt gren och metod - Fabriken, Akademin eller Labbet.",
  },
  {
    number: "03",
    title: "Genomföra",
    body: "Vi levererar med professionell drift, engagemang och transparens.",
  },
  {
    number: "04",
    title: "Följa upp",
    body: "Vi mäter resultat, samlar lärdomar och utvecklar vår verksamhet.",
  },
];

export default function VadViGorPage() {
  const seo = useSeo({
    title: "Vad vi gör",
    description:
      "En organisation - tre sätt att skapa förändring. Fabriken, Akademin och Labbet.",
    canonical: "/vad-vi-gor",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-32 h-80 w-80 rounded-full bg-brand-navy/8 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              En organisation, tre spår
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Vi delar in vår verksamhet i tre grenar - alla med samma mål,
              olika metoder.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Branch cards */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page">
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {branches.map((branch, i) => (
              <ScrollReveal key={branch.title} delay={i * 0.1}>
                <div className="bg-surface rounded-2xl border border-border/60 p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-red text-white mb-6">
                    <branch.icon className="h-6 w-6" />
                  </div>
                  <h2 className="font-display font-bold text-2xl text-text mb-3">
                    {branch.title}
                  </h2>
                  <p className="text-text-muted leading-relaxed mb-5">
                    {branch.body}
                  </p>
                  <ul className="space-y-2">
                    {branch.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm text-text-muted"
                      >
                        <CheckCircle2 className="h-4 w-4 text-brand-red mt-0.5 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <ScrollReveal>
            <p className="text-sm font-body font-medium text-brand-red tracking-widest uppercase mb-4">
              Vårt arbetssätt
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-14">
              Så här jobbar vi
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <div className="relative bg-white rounded-2xl border border-border/60 p-6 md:p-8 h-full">
                  <span className="text-5xl font-display font-extrabold text-brand-red/10 absolute top-4 right-6">
                    {step.number}
                  </span>
                  <div className="relative">
                    <span className="inline-block text-xs font-display font-bold text-brand-red bg-brand-red/10 rounded-full px-3 py-1 mb-4">
                      Steg {step.number}
                    </span>
                    <h3 className="font-display font-bold text-lg text-text mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {step.body}
                    </p>
                  </div>
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
              Vill du veta mer?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Hör av dig så berättar vi hur Fabriken, Akademin eller Labbet kan
              passa er.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
              >
                <Link to="/kontakt">
                  Kontakta oss <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 font-display bg-transparent transition-all duration-300"
              >
                <Link to="/vem-vi-ar">Om oss</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
