import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { CountUp } from "@/components/ui/count-up";
import {
  ArrowRight,
  FileCheck,
  GraduationCap,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const features = [
  {
    icon: FileCheck,
    title: "Betygsöversyn",
    body: "Vi går igenom dina betyg och hjälper dig förstå vad du saknar, vad som är möjligt att komplettera och hur du snabbast tar dig till nästa steg.",
  },
  {
    icon: GraduationCap,
    title: "Individuell studieplanering",
    body: "Tillsammans med en lärare lägger vi upp en plan som passar din situation - oavsett om du vill klara gymnasiet, läsa upp enstaka ämnen eller förbereda dig inför ett högskoleprov.",
  },
  {
    icon: MapPin,
    title: "Studiebesök och vägledning",
    body: "Osäker på vilken skola som passar dig? Vi följer med på studiebesök till Komvux, folkhögskolor och andra utbildningar så att du kan fatta ett välgrundat beslut.",
  },
  {
    icon: MessageSquare,
    title: "Språkförstärkande aktiviteter",
    body: "För dig som vill stärka din svenska erbjuder vi riktade aktiviteter som bygger på din vardag och dina mål - inte på ett generiskt kursupplägg.",
  },
];

export default function StudierPage() {
  const seo = useSeo({
    title: "Studiespåret",
    description:
      "Studier i din egen takt med legitimerade lärare och individuell studieplanering. Flexibelt, personligt och utan prestationsångest.",
    canonical: "/studier",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_52%,transparent_84%)]">
          <img
            src="/images/Studiespaaret.jpg"
            alt="Studiedeltagare i fokus vid Boosts studieverksamhet"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="pointer-events-none absolute -bottom-48 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-48 h-[500px] w-[500px] rounded-full bg-brand-navy/8 blur-3xl" />
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <ScrollReveal>
            <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
              Studiespåret
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Studier på dina villkor
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Flexibelt, personligt och utan prestationsångest.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Intro */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-3xl">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-6">
              Det här är inte som skolan
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p className="text-text-muted leading-relaxed">
              På Boost studerar du i din egen takt, med tätt stöd från
              legitimerade lärare som anpassar sig efter dig - inte tvärtom. Vi
              erbjuder inga klasser, inga klockor och inga krav på att hänga med
              alla andra. Vi börjar med var du faktiskt befinner dig, och jobbar
              därifrån.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-brand-navy text-white overflow-hidden">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page py-12 md:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 text-center">
            {[
              {
                number: 150,
                label: "Börjar studera varje år",
              },
              {
                text: "Legitimerade",
                label: "Lärare",
              },
              {
                text: "Individuell",
                label: "Studieplan",
              },
            ].map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 py-6 px-4">
                  <p className="text-2xl md:text-3xl font-display font-extrabold text-brand-red-bright tracking-tight">
                    {stat.number ? (
                      <CountUp target={stat.number} suffix="+" />
                    ) : (
                      stat.text
                    )}
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
              Det här kan vi hjälpa dig med
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
              Vi följer dig hela vägen
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Från den dag du börjar hos oss, till den dag du kliver in genom
              dörrarna på din nya skola - vi är med dig varje steg.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/anmal-dig2">
                Börja din studieresa <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
