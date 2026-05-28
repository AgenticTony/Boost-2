import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useSeo } from "@/hooks/use-seo";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function NotFoundPage() {
  // useSeo returns <Helmet> JSX - it has to be rendered, not just called.
  // Calling it bare (the pattern everywhere else in src/pages) silently drops
  // every tag it builds. See the note in use-seo.tsx.
  const seo = useSeo({
    title: "Sidan hittades inte",
    description: "Sidan du letar efter finns inte eller har flyttat.",
    noindex: true,
  });

  return (
    <>
      {seo}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-brand-navy/5 blur-3xl" />
        <div className="container-page text-center max-w-lg relative">
          <ScrollReveal>
            {/* brand-red, not brand-red-bright: this is the one place the red sits
              on the light page surface instead of navy, where red-bright is
              only 2.05:1 (large text needs 3:1). brand-red gives 4.98:1. */}
            <p className="text-6xl md:text-7xl font-display font-extrabold text-brand-red mb-4">
              404
            </p>
            <h1 className="text-3xl md:text-4xl font-display font-extrabold text-text mb-4">
              Sidan hittades inte
            </h1>
            <p className="text-text-muted leading-relaxed mb-8">
              Det verkar som att den här sidan inte finns - eller har flyttat.
              Låt oss hjälpa dig hitta rätt.
            </p>
            <Button
              asChild
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/">
                Tillbaka till startsidan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
