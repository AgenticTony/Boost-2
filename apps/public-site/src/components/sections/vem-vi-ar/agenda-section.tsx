import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const agendaGoals = [
  {
    title: "Rättvis rekrytering",
    body: "Vi arbetar aktivt med att bryta rekryteringsnormer - så att namn och adress aldrig ska avgöra vem som får en chans.",
  },
  {
    title: "Utbildning för alla",
    body: "Vi stöttar unga vuxna att slutföra sin gymnasieutbildning och hitta rätt väg vidare - i sin egen takt.",
  },
  {
    title: "Hälsa som grund",
    body: "Vi vet att ohälsa och arbetslöshet förstärker varandra. Därför är hälsa inte ett sidospår hos oss - det är en kärninsats.",
  },
  {
    title: "Jämställdhet",
    body: "Vi utmanar normer kring vilka jobb kvinnor och män förväntas ta - och hjälper arbetsgivare att rekrytera mer rättvist.",
  },
  {
    title: "Inkludering",
    body: "Alla är välkomna hos oss. Oavsett bakgrund, språk eller erfarenhet - vi möter varje människa med öppenhet och respekt.",
  },
  {
    title: "Samverkan",
    body: "Inga förändringar sker ensamt. Vi samarbetar med Malmö stad, Arbetsförmedlingen, näringsliv och idéburen sektor.",
  },
];

export function AgendaSection() {
  return (
    <>
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page">
          <ScrollReveal>
            <p className="text-sm font-body font-medium text-brand-navy tracking-widest uppercase mb-4">
              Agenda 2030
            </p>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-4">
              Boost och Agenda 2030
            </h2>
            <p className="text-text-muted mb-14 max-w-xl leading-relaxed">
              FN:s Agenda 2030 sätter ord på det vi gjort sedan dag ett. Här är
              hur vi bidrar.
            </p>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agendaGoals.map((goal, i) => (
              <ScrollReveal key={goal.title} delay={i * 0.08}>
                <div className="group bg-surface rounded-2xl p-6 border border-border/60 hover:border-brand-navy/30 hover:shadow-md transition-all h-full">
                  <h3 className="font-display font-semibold text-text mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {goal.body}
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
              Vill du vara en del av det här?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Vi söker människor som tror på vad vi tror på. Kom och gör
              skillnad.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/kontakt">
                Kontakta oss <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
