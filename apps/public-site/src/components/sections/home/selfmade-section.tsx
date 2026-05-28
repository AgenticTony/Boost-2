import { motion, useReducedMotion } from "framer-motion";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/** BEAT 7: Progress / Selfmade & Strong */
export function SelfmadeSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-gradient-to-b from-white via-white to-brand-blue-light/10 overflow-hidden">
      <div className="container-page py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <ScrollReveal>
            <div className="relative">
              <motion.div
                className="relative"
                initial={
                  prefersReducedMotion ? false : { scale: 0.95, opacity: 0 }
                }
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                <div className="absolute -inset-4 rounded-3xl bg-brand-red/10 -rotate-1" />
                <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-brand-blue-light/20" />
                <img
                  src="/images/tree_selfmade.png"
                  alt="Selfmade & Strong - gruppvägledning för personlig utveckling"
                  className="relative w-full h-auto rounded-3xl shadow-lg"
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
            </div>
          </ScrollReveal>

          <div className="lg:pl-24">
            <div className="mb-8">
              <p className="text-sm font-body font-medium text-brand-navy tracking-widest uppercase mb-3">
                Allmänna Arvsfonden
              </p>
              <h2 className="text-3xl md:text-[2.5rem] font-display font-extrabold text-text leading-tight mb-4">
                Selfmade & Strong
              </h2>
              <p className="text-brand-red font-display font-semibold text-lg mb-4">
                Progress by FCR
              </p>
              <div className="space-y-4 text-text-muted leading-relaxed">
                <p>
                  Med stöd från <strong>Allmänna Arvsfonden</strong> driver vi
                  Progress by FCR, där vi tar fram en handbok i programmet{" "}
                  <strong>Selfmade & Strong</strong>. Programmet syftar till att
                  öka ungas motivation och förbättra deras hälsa.
                </p>
                <p>
                  Selfmade & Strong sker genom gruppvägledning och är anpassad
                  för unga med olika bakgrunder och utmaningar. Fokus ligger på
                  att stärka varje individ så att de kan växa utifrån sina egna
                  förutsättningar.
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { label: "Ökad motivation till arbete" },
                { label: "Stärkt hälsomedvetenhet" },
                { label: "Fler med tydliga framtidsmål" },
              ].map((result) => (
                <div
                  key={result.label}
                  className="flex items-start gap-2 text-sm text-text-muted"
                >
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-red shrink-0" />
                  {result.label}
                </div>
              ))}
            </div>

            {/* Themes card */}
            <div className="rounded-4xl bg-brand-navy/3 p-8 border border-brand-navy/4">
              <h3 className="font-display font-semibold text-lg text-text mb-6">
                Teman i programmet
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  "Förhållningssätt",
                  "Självkänsla & självförtroende",
                  "Motivation",
                  "Målsättning",
                  "Personligt ledarskap",
                ].map((theme) => (
                  <div
                    key={theme}
                    className="flex items-center gap-2 text-sm text-text-muted"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-navy/40 shrink-0" />
                    {theme}
                  </div>
                ))}
              </div>
            </div>

            {/* Participant quote */}
            <div className="mt-8 pl-4 border-l-4 border-brand-red/40">
              <p className="text-text-muted italic leading-relaxed text-base">
                "Jag tar med mig bättre självförtroende och en känsla av att jag
                faktiskt kan påverka min egen framtid."
              </p>
              <p className="text-sm text-text-muted mt-2 font-medium">
                - Albin, deltagare
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
