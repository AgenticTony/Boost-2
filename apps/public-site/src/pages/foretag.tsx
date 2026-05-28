import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Megaphone,
  ClipboardList,
  Users,
  CheckCircle,
  Phone,
  Mic,
  Network,
  ArrowRight,
} from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";

const offerings = [
  {
    icon: Mic,
    title: "Föreläsningar",
    body: "Inspirerande föreläsningar om inkludering, normer på arbetsmarknaden och psykisk hälsa.",
  },
  {
    icon: Users,
    title: "Workshops & utbildning",
    body: "Interaktiva workshops med konkreta verktyg - från rekrytering utan fördomar till dialog om välmående.",
  },
  {
    icon: Network,
    title: "Nätverk & samverkan",
    body: "Bli del av ett nätverk av arbetsgivare som vill bidra till ett mer inkluderande Malmö.",
  },
];

const steps = [
  {
    icon: MessageSquare,
    label: "Inledning",
    body: "Vi sätter oss ner med dig och lyssnar. Vilken tjänst gäller det? Vad söker du i en kandidat? Vilka värderingar är viktiga för er?",
  },
  {
    icon: Megaphone,
    label: "Annonsering",
    body: "Utifrån din kravprofil tar vi fram en skräddarsydd annons och söker aktivt bland våra deltagare. Vi känner dem - det är en stor fördel.",
  },
  {
    icon: ClipboardList,
    label: "Urval",
    body: "Vi gör en grundlig screening och presenterar ett hanterbart urval av kandidater. Du slipper sållaprocessen - vi gör den åt dig.",
  },
  {
    icon: Users,
    label: "Intervju",
    body: "Du intervjuar slutkandidaterna, hos oss eller hos er. Vi finns med som stöd om du vill det.",
  },
  {
    icon: CheckCircle,
    label: "Beslut",
    body: "När du valt ser vi till att onboardingprocessen sätts igång smidigt - inklusive eventuell kontakt med Arbetsförmedlingen.",
  },
  {
    icon: Phone,
    label: "Uppföljning",
    body: "Vi följer upp regelbundet under de första månaderna för att säkerställa att allt fungerar - för er båda.",
  },
];

export default function ForetagPage() {
  const seo = useSeo({
    title: "Arbetsgivare",
    description:
      "Samarbeta med Boost - föreläsningar, workshops och inkluderande rekrytering för arbetsgivare som vill göra skillnad.",
    canonical: "/foretag",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)]">
          <img
            src="/images/hero-foretag.jpg"
            alt="Samarbete mellan Boost och lokala arbetsgivare"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-32 h-80 w-80 rounded-full bg-brand-navy/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              För arbetsgivare
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Tillsammans öppnar vi dörrar till arbetsmarknaden
            </h1>
            <p className="text-lg text-white/75 max-w-xl leading-relaxed">
              Vill du och din organisation vara med och se till att skapa
              förutsättningar för att alla ska kunna ta sig in på
              arbetsmarknaden? Vi vet att - precis som för våra deltagare - så
              är också arbetsgivarnas behov olika.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Offerings */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page">
          <ScrollReveal>
            <p className="text-text-muted leading-relaxed max-w-2xl mb-8">
              Samarbeten med Boost by FCR kan se olika ut - från att vi hjälper
              dig i din rekrytering, till föreläsningar eller att du träffar en
              av våra deltagare.
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red tracking-widest uppercase mb-4">
              Vårt erbjudande
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-12">
              Så kan vi samarbeta
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-3 gap-6 md:gap-8">
            {offerings.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-brand-navy text-white mb-5">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-text mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button
              asChild
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/kontakt?amne=foretag">
                Berätta om ert uppdrag <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recruitment steps */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red tracking-widest uppercase mb-4">
              Rekrytering
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text mb-12">
              Hitta din nästa medarbetare
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {steps.map((step, i) => (
              <ScrollReveal key={step.label} delay={i * 0.08}>
                <div className="relative bg-white rounded-2xl p-6 md:p-8 border border-border/60 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center h-12 w-12 rounded-full bg-brand-red text-white font-display font-extrabold text-lg shadow-md shadow-brand-red/20">
                      {i + 1}
                    </span>
                    <div className="h-11 w-11 rounded-xl bg-brand-navy text-white flex items-center justify-center">
                      <step.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-text mb-2">
                    {step.label}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {step.body}
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
              Redo att samarbeta?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Kontakta Käthe för att prata om hur vi kan hjälpa er hitta rätt
              personer - och göra skillnad tillsammans.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
              >
                <a href="mailto:kathe.andersson@boostbyfcr.se">
                  Skicka ett mejl <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button
                asChild
                className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 font-display bg-transparent transition-all duration-300"
              >
                <Link to="/kontakt?amne=Företagssamarbete">Kontakta oss</Link>
              </Button>
            </div>
            <p className="text-sm text-white/60 mt-6">
              Käthe Andersson - kathe.andersson@boostbyfcr.se - 072-164 53 45
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
