import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Landmark, Handshake, Users } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/** BEAT 5: Bridge by FCR - Floating glass card */
export function BridgeSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <ScrollReveal direction="left">
      <section className="relative bg-brand-navy text-white overflow-hidden">
        {/* Visible red organic shape */}
        <div
          className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-red/15 blur-[80px]"
          aria-hidden="true"
        />

        <div className="container-page relative py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left: Text content */}
            <div className="min-w-0">
              <p className="text-xs font-body font-medium text-white tracking-widest uppercase mb-5">
                ESF-projekt
              </p>
              <h2 className="text-2xl md:text-4xl font-display font-extrabold mb-3 leading-tight">
                Är du mellan 18-29 år och inskriven på Arbetsförmedlingen?
              </h2>
              <p className="text-xl font-display font-semibold text-brand-blue-light mb-6">
                Anmäl dig till Bridge by FC Rosengård
              </p>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>
                  Bridge by FC Rosengård är ett ESF‑finansierat projekt för unga
                  vuxna som vill hitta vägar vidare mot arbete eller studier. Vi
                  vet att det kan vara svårt att navigera bland alla
                  möjligheter, och därför erbjuder vi stöd som utgår från dina
                  mål och förutsättningar.
                </p>
                <p>
                  Med Boostmodellen som grund kombinerar vi vägledning, stöd i
                  studier, studiebesök, motivationshöjande insatser och
                  hälsofrämjande aktiviteter. Du får hjälp med allt som rör
                  arbetssökande - från CV och intervjuträning till att förstå
                  arbetsmarknaden.
                </p>
              </div>
              <div className="mt-8">
                <Button
                  asChild
                  className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full h-12 px-8 shadow-lg shadow-brand-red/20 hover:shadow-brand-red/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <Link to="/anmal-dig2">
                    Anmäl dig till Bridge
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: Floating glass card */}
            <motion.div
              initial={
                prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }
              }
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="min-w-0 space-y-6"
            >
              {/* Fact chips - defined card panel */}
              <div className="rounded-2xl bg-white/6 backdrop-blur-sm border border-white/10 overflow-hidden">
                {/* Red accent bar */}
                <div className="h-1 bg-linear-to-r from-brand-red via-brand-red/60 to-transparent" />
                <div className="grid grid-cols-3 gap-0 divide-x divide-white/10">
                  {[
                    {
                      icon: <Users className="h-5 w-5 text-brand-red-bright" />,
                      value: "18-29",
                      sub: "år",
                    },
                    {
                      icon: (
                        <Landmark className="h-5 w-5 text-brand-red-bright" />
                      ),
                      value: "ESF",
                      sub: "finansierat",
                    },
                    {
                      icon: (
                        <Handshake className="h-5 w-5 text-brand-red-bright" />
                      ),
                      value: "AF",
                      sub: "samarbete",
                    },
                  ].map((chip, i) => (
                    <motion.div
                      key={chip.value}
                      initial={
                        prefersReducedMotion ? false : { opacity: 0, y: 10 }
                      }
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                      className="flex flex-col items-center justify-center py-6 px-2 sm:px-3"
                    >
                      <div className="mb-2">{chip.icon}</div>
                      <span className="text-lg sm:text-xl font-display font-extrabold text-white">
                        {chip.value}
                      </span>
                      <span className="text-xs text-white/60 mt-0.5">
                        {chip.sub}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Vision quote */}
              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-sm p-6 border border-white/10 border-l-4 border-l-brand-red">
                <p className="text-xs font-medium text-white/60 uppercase tracking-wider mb-2">
                  Vår vision
                </p>
                <p className="text-white/75 leading-relaxed italic text-lg">
                  "En inkluderande arbetsmarknad som tar tillvara på alla
                  individers drömmar, kompetenser och vilja att bidra."
                </p>
              </div>

              {/* Funder logos - credentials row */}
              <div className="rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 overflow-hidden">
                <div className="h-1 bg-linear-to-r from-brand-red via-brand-red/60 to-transparent" />
                <div className="p-5">
                  <p className="text-xs font-body font-medium text-white/60 text-center mb-4">
                    Finansieras och stöds av
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                    {[
                      {
                        alt: "EU Socialfonden",
                        src: "/images/eu-logo-jordbruksfonden.webp",
                        className:
                          "h-12 sm:h-16 md:h-20 max-w-[90px] sm:max-w-[130px]",
                      },
                      {
                        alt: "Arbetsförmedlingen",
                        src: "/images/af-logo.webp",
                        className:
                          "h-14 sm:h-22 md:h-[6.5rem] max-w-[120px] sm:max-w-[180px]",
                      },
                      {
                        alt: "FC Rosengård",
                        src: "/images/FCR_logo_2014_CMYK.webp",
                        className:
                          "h-12 sm:h-16 md:h-20 max-w-[90px] sm:max-w-[130px]",
                      },
                    ].map((logo) => (
                      <img
                        key={logo.alt}
                        src={logo.src}
                        alt={logo.alt}
                        loading="lazy"
                        decoding="async"
                        className={`w-auto object-contain hover:scale-105 transition-transform duration-300 ${logo.className}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
