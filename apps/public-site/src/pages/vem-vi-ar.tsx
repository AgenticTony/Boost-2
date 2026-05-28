import { useSeo } from "@/hooks/use-seo";
import { HeroSection } from "@/components/sections/vem-vi-ar/hero-section";
import { PromisesSection } from "@/components/sections/vem-vi-ar/promises-section";
import { StatsSection } from "@/components/sections/vem-vi-ar/stats-section";
import { WhatWeDoSection } from "@/components/sections/vem-vi-ar/what-we-do-section";
import { TracksSection } from "@/components/sections/vem-vi-ar/tracks-section";
import { SuccessFactorsSection } from "@/components/sections/vem-vi-ar/success-factors-section";
import { TeamSection } from "@/components/sections/vem-vi-ar/team-section";
import { AgendaSection } from "@/components/sections/vem-vi-ar/agenda-section";

export default function VemViArPage() {
  const seo = useSeo({
    title: "Om oss",
    description:
      "Boost by FC Rosengård - idéburen organisation med bas i Malmö sedan 2003. Vi arbetar för att öka inkluderingen i samhället.",
    canonical: "/vem-vi-ar",
  });

  return (
    <>
      {seo}
      <HeroSection />
      <PromisesSection />
      <StatsSection />
      <WhatWeDoSection />
      <TracksSection />
      <SuccessFactorsSection />
      <TeamSection />
      <AgendaSection />
    </>
  );
}
