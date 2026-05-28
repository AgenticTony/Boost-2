import { ScrollReveal } from "@/components/ui/scroll-reveal";

export function IntroSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="max-w-3xl space-y-5 text-text-muted leading-relaxed">
              <p>
                Vi har sedan starten 2003 stöttat tusentals, framförallt unga,
                att börja arbeta eller studera.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right">
            <div className="hidden lg:flex justify-center">
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/illustration-heart-tree.jpg"
                  alt="Hjärtträd med rötter - symbol för tillväxt, hälsa och gemenskap"
                  className="w-full h-auto rounded-xl object-contain max-h-56 mx-auto"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
