import { useSeo } from "@/hooks/use-seo";
import { WaveDivider } from "@/components/ui/wave-divider";
import { LatestNews } from "@/components/sections/latest-news";
import { HeroSection } from "@/components/sections/home/hero-section";
import { ImpactStatsSection } from "@/components/sections/home/impact-stats-section";
import { PromiseSection } from "@/components/sections/home/promise-section";
import { TracksSection } from "@/components/sections/home/tracks-section";
import { BridgeSection } from "@/components/sections/home/bridge-section";
import { AboutBoostSection } from "@/components/sections/home/about-boost-section";
import { SelfmadeSection } from "@/components/sections/home/selfmade-section";
import { FunderLogoBar } from "@/components/sections/home/funder-logo-bar";

export default function HomePage() {
  const seo = useSeo({
    title: "Hem",
    description:
      "Tillsammans bygger vi förutsättningar som ger unga möjlighet att utvecklas, hitta riktning och forma sin framtid.",
    canonical: "/",
  });

  return (
    <>
      {seo}
      <HeroSection />
      <ImpactStatsSection />
      <WaveDivider from="navy" to="surface" mirror />
      <PromiseSection />
      <TracksSection />
      <BridgeSection />
      <WaveDivider from="navy" to="white" mirror />
      <AboutBoostSection />
      <SelfmadeSection />
      <LatestNews />
      <FunderLogoBar />
    </>
  );
}
