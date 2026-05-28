import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSeo } from "@/hooks/use-seo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";

const faqSections = [
  {
    heading: "Om Boost",
    items: [
      {
        q: "Vad är Boost by FC Rosengård?",
        a: "Boost är en idéburen organisation i Malmö som sedan 2003 hjälper unga att ta sig in på arbetsmarknaden eller börja studera. Vi erbjuder tre huvudspår - Arbete, Studier och Hälsa - och anpassar stödet efter varje persons unika situation.",
      },
      {
        q: "Vem kan delta?",
        a: "Våra program vänder sig främst till unga vuxna som står långt från arbetsmarknaden. Du behöver inte ha något specifika förkunskaper eller ha allt klart för dig - du behöver bara vilja ta ett steg framåt.",
      },
      {
        q: "Hur mycket kostar det?",
        a: "Ingenting. Alla våra program är gratis för deltagare. Vi finansieras av EU:s Socialfond, Allmänna Arvsfonden, Malmö stad och andra partners.",
      },
      {
        q: "Måste jag välja ett spår direkt?",
        a: "Nej. Många deltagare börjar utan att veta exakt vad de vill göra. Din personliga vägledare hjälper dig att utforska olika vägar och hitta det som passar dig. Du kan också delta i insatser från flera spår samtidigt.",
      },
    ],
  },
  {
    heading: "Arbete & studier",
    items: [
      {
        q: "Hur stor är chansen att jag får jobb om jag kommer till er?",
        a: "Stor. Vi har ett brett nätverk av arbetsgivare som aktivt kontaktar oss när de ska rekrytera - och vi gör allt vi kan för att lyfta fram de deltagare som är redo. Varje år går 200 till 300 av våra deltagare vidare till anställning.",
      },
      {
        q: "Vad händer om jag hellre vill börja studera?",
        a: "Då hjälper vi dig med det. Hos oss finns legitimerade lärare och studie-/yrkesvägledare som stöttar dig med allt från enskilda ämnen som matte och svenska, till förberedelse inför högskoleprovet eller ansökan till Komvux och folkhögskola. Varje år lämnar 100 till 150 deltagare Boost för att börja studera.",
      },
      {
        q: "Jag vet inte vad jag vill göra. Kan ni hjälpa mig?",
        a: "Absolut - och du är långt ifrån ensam om det. Att komma till oss utan en klar riktning är helt okej. Din vägledare hjälper dig att utforska vad du är bra på, vad som motiverar dig och vilka vägar som finns framåt. Vi har också workshops som är just för det här.",
      },
      {
        q: "Hur hjälper ni mig mot mitt drömyrke?",
        a: "Vilken typ av hjälp du behöver beror på vad ditt mål är - men vi börjar alltid med att lyssna. Sedan hjälper vi dig lägga en konkret plan: vilken utbildning som passar, hur du bygger nätverk i rätt bransch och hur du hittar en praktikplats som öppnar dörrar.",
      },
    ],
  },
  {
    heading: "Praktiskt",
    items: [
      {
        q: "Hur anmäler jag mig?",
        a: "Det tar tre minuter via formuläret på vår webbplats. Du behöver bara ange namn, kontaktuppgifter och vilket spår du är intresserad av. En vägledare hör av sig inom en arbetsdag.",
      },
      {
        q: "Hur lång tid tar ett program?",
        a: "Det finns ingen fast längd. Vissa deltagare är hos oss i några månader, andra i över ett år. Vi anpassar tiden efter dina mål och din situation. Det är du som bestämmer takten.",
      },
      {
        q: "Samarbetar ni med Arbetsförmedlingen och kommunen?",
        a: "Ja. Vi jobbar nära både Arbetsförmedlingen och Malmö stad. De anvisar deltagare till oss och vi rapporterar regelbundet om hur det går - så att du alltid har rätt stöd runt dig.",
      },
      {
        q: "Var finns ni?",
        a: "Vi ligger på Norra Grängesbergsgatan 15 i Malmö - mitt i Rosengård. Kom förbi, ring eller skicka ett mejl så pratar vi om hur vi kan hjälpa just dig.",
      },
      {
        q: "Är era deltagare nöjda?",
        a: "Det verkar så. I en oberoende utvärdering fick vi 8 av 10 på nöjdhetsskalan. Vi är stolta över det - och vi vill bli bättre. Vi lyssnar kontinuerligt på våra deltagare för att förstå vad vi kan göra annorlunda.",
      },
    ],
  },
];

export default function VanligaFragorPage() {
  const seo = useSeo({
    title: "Vanliga frågor",
    description:
      "Svaren på det du undrar - och några du kanske inte visste att du hade.",
    canonical: "/vanliga-fragor",
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
              Frågor & svar
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
              Vanliga frågor
            </h1>
            <p className="text-lg text-white/75 max-w-lg leading-relaxed">
              Svaren på det du undrar - och några du kanske inte visste att du
              hade.
            </p>
          </ScrollReveal>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* FAQ sections */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page max-w-2xl">
          {faqSections.map((section, si) => (
            <ScrollReveal key={section.heading} delay={si * 0.1}>
              <div className={si > 0 ? "mt-12" : ""}>
                <h2 className="text-xl font-display font-bold text-text mb-2">
                  {section.heading}
                </h2>
                <Accordion type="single" collapsible className="mt-2">
                  {section.items.map((item) => (
                    <AccordionItem key={item.q} value={item.q}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-text-muted leading-relaxed">
                          {item.a}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy text-white overflow-hidden border-b-4 border-b-brand-red">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page pt-4 pb-16 md:pt-6 md:pb-24 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4">
              Hittade du inte svaret?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Skicka ett mejl eller ring oss - vi svarar gärna.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                asChild
                className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
              >
                <Link to="/kontakt">
                  Kontakta oss <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                className="border-2 border-white/30 text-white hover:bg-white/10 rounded-full px-10 h-14 font-display bg-transparent transition-all duration-300"
              >
                <Link to="/anmal-dig2">
                  Anmäl dig <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
