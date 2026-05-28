import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, BookOpen, Heart } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TreeRootsConnector } from "@/components/ui/tree-roots-connector";

/* ─── Track card variants (each unique) ─── */

function TrackCardWork() {
  return (
    <ScrollReveal delay={0}>
      <Link
        to="/arbetssokande"
        className="group block relative bg-brand-navy/[0.03] hover:bg-brand-navy/[0.06] rounded-[2rem] border-l-4 border-brand-navy overflow-hidden transition-all duration-300 cursor-pointer"
      >
        <span
          className="absolute top-4 right-8 md:right-12 font-display font-extrabold text-[6rem] md:text-[9rem] leading-none select-none pointer-events-none text-brand-navy/[0.07]"
          aria-hidden="true"
        >
          01
        </span>
        <div className="flex flex-col md:flex-row">
          {/* Photo */}
          <div className="relative w-full md:w-64 lg:w-72 flex-shrink-0">
            <img
              src="/images/Arbetsspaaret.webp"
              alt="Två personer samarbetar vid en dator - arbetsspåret"
              width={1260}
              height={839}
              className="w-full h-48 md:h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-navy/[0.03] md:block hidden" />
          </div>
          {/* Content */}
          <div className="px-8 py-10 md:px-12 md:py-14 flex-1">
            <div className="relative flex flex-col gap-6">
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-brand-navy/10 text-brand-navy mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <p className="text-xs font-display font-semibold uppercase tracking-widest text-brand-navy">
                  Karriär & arbetsmarknad
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-display font-extrabold text-text leading-tight mb-4">
                  Arbetsspåret
                </h3>
                <p className="text-text-muted leading-relaxed mb-6 text-base">
                  Våra aktiviteter i arbetsspåret ger dig verktyg och kunskap
                  för att navigera på arbetsmarknaden. Finslipa ditt CV,
                  behärska intervjuer och lär dig att söka arbete på ett
                  kvalitativt sätt. Vi har också regelbundna träffar med
                  arbetsgivare.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy group-hover:gap-3 transition-all duration-300">
                  Läs mer om arbetsspåret
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

function TrackCardStudy() {
  return (
    <ScrollReveal delay={0.1}>
      <Link
        to="/studier"
        className="group block relative bg-brand-blue-light/20 hover:bg-brand-blue-light/30 rounded-4xl border-l-4 border-brand-blue-light overflow-hidden lg:ml-6 transition-all duration-300 cursor-pointer"
      >
        <span
          className="absolute top-4 left-8 md:left-12 font-display font-extrabold text-[6rem] md:text-[9rem] leading-none select-none pointer-events-none text-brand-blue-light/40"
          aria-hidden="true"
        >
          02
        </span>
        <div className="flex flex-col md:flex-row-reverse">
          {/* Photo */}
          <div className="relative w-full md:w-64 lg:w-72 shrink-0">
            <img
              src="/images/Studiespaaret.webp"
              alt="Grupp i samarbetsmöte - studiespåret"
              width={1260}
              height={839}
              className="w-full h-48 md:h-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-brand-blue-light/10 md:block hidden" />
          </div>
          {/* Content */}
          <div className="px-8 py-10 md:pl-80 md:pr-12 md:py-14 flex-1">
            <div className="relative flex flex-col gap-6">
              <div className="shrink-0 pl-16 md:pl-0">
                <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-brand-blue-light/30 text-brand-navy mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <p className="text-xs font-display font-semibold uppercase tracking-widest text-brand-navy">
                  Lärande & vägledning
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-display font-extrabold text-text leading-tight mb-4">
                  Studiespåret
                </h3>
                <p className="text-text-muted leading-relaxed mb-6 text-base">
                  Flexibel studiemiljö med enskilda möten med pedagoger. Gå
                  igenom betyg, studieplanering och vägledning. Två dagar i
                  veckan har vi studieverkstaden.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy group-hover:gap-3 transition-all duration-300">
                  Läs mer om studiespåret
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

function TrackCardHealth() {
  return (
    <ScrollReveal delay={0.2}>
      <Link
        to="/halsosparet"
        className="group block relative overflow-hidden rounded-4xl border-l-4 border-brand-red cursor-pointer"
      >
        <span
          className="absolute top-4 right-8 md:right-12 z-10 font-display font-extrabold text-[6rem] md:text-[9rem] leading-none select-none pointer-events-none text-brand-red/10"
          aria-hidden="true"
        >
          03
        </span>
        <div className="flex flex-col md:flex-row">
          {/* Photo - left side */}
          <div className="relative w-full md:w-64 lg:w-72 shrink-0">
            <img
              src="/images/fcr-sport.webp"
              alt="Grupp spelar innebandy - hälsospåret"
              width={1260}
              height={840}
              className="w-full h-48 md:h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          {/* Content */}
          <div className="relative bg-brand-red/3 hover:bg-brand-red/6 px-8 py-10 md:px-12 md:py-14 flex-1 transition-colors duration-300">
            <div className="flex flex-col gap-6">
              <div className="shrink-0">
                <div className="inline-flex items-center justify-center h-14 w-14 md:h-16 md:w-16 rounded-2xl bg-brand-red/10 text-brand-red mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <p className="text-xs font-display font-semibold uppercase tracking-widest text-brand-red">
                  Välmående & självförtroende
                </p>
              </div>
              <div className="flex-1 max-w-xl">
                <h3 className="text-2xl md:text-3xl lg:text-[2rem] font-display font-extrabold text-text leading-tight mb-4">
                  Hälsospåret
                </h3>
                <p className="text-text-muted leading-relaxed mb-6 text-base">
                  Främja din hälsa och välmående. Skapa goda rutiner, sätta mål
                  och Boosta ditt självförtroende - fysisk aktivitet, psykisk
                  hälsa och kultur.
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-red group-hover:gap-3 transition-all duration-300">
                  Läs mer om hälsospåret
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

/** BEAT 4: Three Tracks - Each card unique */
export function TracksSection() {
  return (
    <section
      id="program"
      className="py-20 md:py-28 bg-white relative overflow-hidden"
    >
      <TreeRootsConnector />

      <div className="container-page relative">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="text-sm font-body font-medium text-brand-red tracking-widest uppercase mb-4">
            Tre vägar framåt
          </p>
          <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-5">
            Våra tre spår
          </h2>
          <p className="text-text-muted leading-relaxed text-lg">
            Som ett träd växer från en gemensam rot men sträcker sig åt olika
            håll, erbjuder vi tre spår som alla utgår från samma värdegrund -
            varje individs unika potential.
          </p>
        </div>

        <div className="space-y-6 md:space-y-8">
          <TrackCardWork />
          <TrackCardStudy />
          <TrackCardHealth />
        </div>
      </div>
    </section>
  );
}
