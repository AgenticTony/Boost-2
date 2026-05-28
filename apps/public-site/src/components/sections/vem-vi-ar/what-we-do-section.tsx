import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function WhatWeDoSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-page max-w-3xl">
        <ScrollReveal>
          <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-6">
            Det här gör vi
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <div className="space-y-5 text-text-muted leading-relaxed">
            <p>
              Vi är en idéburen organisation med social inriktning och vår idé
              grundar sig i tanken att det finns ett glapp i det stöd som
              samhället ger till de som står utanför arbetsmarknaden. Det finns
              jobb och det finns utbildningar men utmaningen ligger i att
              förbereda och motivera arbetssökande så att de framgångsrikt kan
              navigera bland alla dessa möjligheter.
            </p>
            <p>
              På Boost lägger vi fokus på deltagarnas egna drivkrafter och
              ansvarstagande och har ett arbetssätt som präglas av engagemang
              och personligt bemötande. Genom att jobba med deltagarnas
              kompetenser och färdigheter, tillsammans med hälsa, motivation och
              framtidstro förbereder vi dem inför arbetslivet.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
