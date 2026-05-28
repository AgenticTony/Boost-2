import { ScrollReveal } from "@/components/ui/scroll-reveal";

const successFactors = [
  {
    title: "Vi bygger våra insatser på långsiktiga samarbeten",
    body: "Med Arbetsförmedlingen, kommuner och arbetsgivare. Genom partnerskapet med Arbetsförmedlingen kan vi nå personer som behöver stöd, även när de själva inte söker det aktivt. Det gör att vi kan arbeta mer träffsäkert och inkluderande. Samtidigt är arbetsgivarna helt avgörande. Utan deras engagemang skulle vår verksamhet stanna upp.",
  },
  {
    title:
      "Vi möter varje deltagare med ett inkluderande och välkomnande förhållningssätt",
    body: "Som del av civilsamhället har vi en annan ingång än myndigheter. Vi kompletterar deras arbete genom att skapa miljöer där människor kan landa, växa och pröva nytt. Hos oss ska det vara enkelt att kliva in - oavsett bakgrund, erfarenheter eller var man befinner sig i livet.",
  },
  {
    title: "Holistiskt - på riktigt",
    body: "Vi möter varje människa som individ, med respekt för hela hennes livssituation. För oss betyder holistiskt på riktigt att vi börjar där personen är, inte där vi tycker att hen borde vara. Vi lyssnar, stöttar och bygger möjligheter tillsammans.",
  },
  {
    title: "One-stop shop",
    body: "Hos oss finns allt samlat på ett ställe. Vi arbetar i tre spår som hänger ihop och gör det enkelt att snabbt växla mellan dem utifrån vad deltagaren behöver i stunden. Det betyder mindre krångel, kortare avstånd till rätt stöd och en smidigare väg framåt.",
  },
];

export function SuccessFactorsSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-page">
        <ScrollReveal>
          <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-4">
            Framgångsfaktorer
          </h2>
          <p className="text-text-muted mb-12 max-w-2xl leading-relaxed">
            I våra projekt och initiativ arbetar vi hela tiden för att möta
            samhällets ständigt föränderliga behov och för att vässa vårt
            arbetssätt och metoder. Genom åren har vi, och oberoende
            utvärderare, kunnat peka på ett par faktorer som gör verksamheten
            framgångsrik:
          </p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
          {successFactors.map((factor, i) => (
            <ScrollReveal key={factor.title} delay={i * 0.1}>
              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border/60 hover:shadow-md transition-all duration-300 h-full">
                <h3 className="font-display font-semibold text-lg text-text mb-3 italic">
                  {factor.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {factor.body}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
