import { CountUp } from "@/components/ui/count-up";

/** BEAT 2: Impact Stats - Count-up numbers */
export function ImpactStatsSection() {
  return (
    <section className="relative bg-brand-navy text-white py-6 md:py-10">
      <div className="container-page relative">
        <p className="text-center text-white/75 text-sm md:text-base font-body tracking-wide mb-6 md:mb-10">
          Bakom varje siffra finns en människa som tagit ett steg framåt
        </p>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 max-w-4xl mx-auto mb-8">
          {/* 7 500 */}
          <div className="text-center relative">
            {/* Bullseye circle behind number */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-52 md:h-52 rounded-full border-2 border-brand-red/20 pointer-events-none"
              aria-hidden="true"
            />
            <p className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter leading-none">
              <CountUp target={7500} duration={2} className="text-white" />
            </p>
            <div className="relative mt-3 h-px w-10 bg-brand-red/60 mx-auto mb-3" />
            <p className="relative text-white/70 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
              unga har varit hos oss sedan starten 2003
            </p>
          </div>

          {/* 3 800 */}
          <div className="text-center relative">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-52 md:h-52 rounded-full border-2 border-white/10 pointer-events-none"
              aria-hidden="true"
            />
            <p className="relative text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter leading-none">
              <CountUp target={3800} duration={2} className="text-brand-gold" />
            </p>
            <div className="relative mt-3 h-px w-10 bg-white/30 mx-auto mb-3" />
            <p className="relative text-white/70 text-sm md:text-base leading-relaxed max-w-xs mx-auto">
              har gått vidare till arbete eller studier
            </p>
          </div>
        </div>

        {/* Supporting stats */}
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-white/75 text-sm">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-red/60" />8 av 10
            nöjda deltagare
          </span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            Verksamma sedan 2003
          </span>
        </div>
      </div>
    </section>
  );
}
