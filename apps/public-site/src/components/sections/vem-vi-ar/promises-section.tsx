import { ScrollReveal } from "@/components/ui/scroll-reveal";

const promises = [
  {
    iconSrc: "/images/promise-inkluderande.png",
    iconAlt: "Inkludering - alla är välkomna",
    title: "Vi är inkluderande - alla är välkomna och alla kan",
    body: "Vi sätter individen i centrum och tror på varje människas inre kapacitet och vilja. Vi ser hela människan och ger alla en chans att utvecklas utifrån sina egna mål och drömmar.",
  },
  {
    iconSrc: "/images/promise-passionsdrivna.png",
    iconAlt: "Passion och värme",
    title: "Vi är passionsdrivna med ett varmt engagemang",
    body: "Med vår passion, glöd och värme skapar vi en gemenskap, en välkomnande och varm atmosfär. Vi förmedlar framtidstro och en kraft att förändra.",
  },
  {
    iconSrc: "/images/promise-handlingskraft.png",
    iconAlt: "Handlingskraft och varaktiga resultat",
    title: "Vi visar handlingskraft och skapar varaktiga resultat",
    body: "Vi är målinriktade, envisa, vi ger inte upp. Genom att vi ser lösningar istället för problem, genom vårt professionella driv och genom vår breda kompetens gör vi det möjligt för människor att växa och utvecklas.",
  },
  {
    iconSrc: "/images/promise-inspirerar.png",
    iconAlt: "Inspiration och nytänkande",
    title: "Vi inspirerar och tänker nytt",
    body: "Vi utmanar och förändrar genom nya perspektiv, annorlunda infallsvinklar, idérikedom och flexibilitet. Genom nytänkande lösningar växer modet och känslan av att allt är möjligt.",
  },
  {
    iconSrc: "/images/promise-kopplarsaman.png",
    iconAlt: "Samverkan och samarbete",
    title: "Vi kopplar samman och arbetar tätt ihop med andra",
    body: "Vi uppmuntrar till stärkt samverkan och att lära av varandra. Via vår flexibilitet och att vi samverkar i allt vi gör är vi en katalysator för samhällsförändring. Vi är ett viktigt komplement till det offentliga och en värdefull partner till det privata näringslivet.",
  },
];

const bgColors = [
  "bg-brand-navy/[0.03]",
  "bg-brand-blue-light/20",
  "bg-brand-navy/[0.03]",
  "bg-brand-blue-light/20",
  "bg-brand-navy/[0.03]",
];

export function PromisesSection() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container-page">
        <ScrollReveal>
          <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-14 text-center">
            Våra löften
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {promises.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.08}>
              <div
                className={`${bgColors[i % bgColors.length]} rounded-2xl p-5 md:p-6 hover:shadow-md transition-all duration-300 h-full`}
              >
                <img
                  src={p.iconSrc}
                  alt={p.iconAlt}
                  className="h-14 w-14 md:h-16 md:w-16 object-contain mb-4"
                  loading="lazy"
                  decoding="async"
                />
                <h3 className="font-display font-bold text-sm md:text-base text-text mb-2">
                  {p.title}
                </h3>
                <p className="text-xs md:text-sm text-text-muted leading-relaxed">
                  {p.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
