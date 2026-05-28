import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { WaveDivider } from "@/components/ui/wave-divider";

/* ─── Staggered word entrance for hero headline ─── */
function StaggeredLine({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  return (
    <motion.span
      className="block"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.span>
  );
}

/** BEAT 1: Hero - Asymmetric split + parallax */
export function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-brand-navy text-white overflow-hidden">
      {/* Visible decorative blob (opacity 0.12, not invisible) */}
      <div
        className="pointer-events-none absolute -top-20 right-0 w-[600px] h-[600px] rounded-full bg-brand-red/12 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container-page relative py-12 md:py-16 lg:py-20">
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-12 items-center">
          {/* Left: Text */}
          <div>
            <StaggeredLine delay={0}>
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-4 w-4 text-brand-gold" />
                <p className="text-sm font-body font-medium text-brand-gold tracking-widest uppercase">
                  Sedan 2003
                </p>
              </div>
            </StaggeredLine>

            <h1 className="text-[2.75rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[5rem] font-display font-extrabold leading-[1.1] tracking-tight mb-8">
              <StaggeredLine delay={0.15}>Tillsammans</StaggeredLine>
              <StaggeredLine delay={0.3}>
                <span className="text-brand-gold">öppnar vi</span>
              </StaggeredLine>
              <StaggeredLine delay={0.45}>vägar framåt</StaggeredLine>
            </h1>

            <StaggeredLine delay={0.6}>
              <p className="text-lg md:text-xl leading-relaxed text-white/70 max-w-lg mb-10">
                Vi bygger förutsättningar som ger unga möjlighet att utvecklas,
                hitta riktning och forma sin framtid.
              </p>
            </StaggeredLine>

            <StaggeredLine delay={0.8}>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 text-base shadow-lg shadow-brand-red/25 hover:shadow-brand-red/40 hover:scale-[1.02] transition-all duration-300"
                >
                  <Link to="/anmal-dig2">Anmälan</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-8 h-14 text-base font-display bg-transparent border border-white/20 hover:border-white/40 transition-all duration-300"
                >
                  <a href="#program">Se vad vi erbjuder</a>
                </Button>
              </div>
            </StaggeredLine>
          </div>

          {/* Right: Photo with parallax, bleeds to edge on desktop */}
          <div className="hidden lg:block relative">
            {prefersReducedMotion ? (
              <div className="relative aspect-[3/4] rounded-l-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/10 max-w-[420px] ml-auto">
                <img
                  src="/images/deltagare_boostbyfcr_pa_trappa.jpg"
                  alt="Unga deltagare utomhus på Boost"
                  width={840}
                  height={1260}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/20 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-brand-navy/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-display font-bold text-sm shadow-lg">
                  Bli en del av Boost
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="relative max-w-[420px] ml-auto"
              >
                <ParallaxImage
                  src="/images/deltagare_boostbyfcr_pa_trappa.jpg"
                  alt="Unga deltagare utomhus på Boost"
                  speed={0.3}
                  width={840}
                  height={1260}
                  className="aspect-[3/4] rounded-l-[2rem] shadow-2xl ring-1 ring-white/10"
                />
                <div className="absolute inset-0 rounded-l-[2rem] bg-gradient-to-t from-brand-navy/20 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-brand-navy/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-display font-bold text-sm shadow-lg">
                  Bli en del av Boost
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <WaveDivider from="navy" to="navy" />
    </section>
  );
}
