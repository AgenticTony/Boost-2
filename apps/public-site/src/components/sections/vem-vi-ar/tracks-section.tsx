import { Link } from "react-router-dom";
import { BookOpen, Briefcase, Heart, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const tracks = [
  {
    href: "/studier",
    icon: BookOpen,
    headline: "Studiespåret",
    body: "På Boost erbjuder vi en flexibel och anpassningsbar studiemiljö som skiljer sig från skolan. Vi tittar på dina behov och erbjuder enskilda möten med pedagoger för att hjälpa dig gå igenom betyg, studieplanering och vägledning inom utbildningssystemet.",
    cardBg: "bg-brand-navy/[0.03]",
    iconBg: "bg-brand-navy/10",
    iconText: "text-brand-navy",
  },
  {
    href: "/arbetssokande",
    icon: Briefcase,
    headline: "Arbetsspåret",
    body: "Våra aktiviteter i arbetsspåret ger dig verktyg och kunskap för att navigera på arbetsmarknaden och utvecklas i din karriär. Finslipa ditt CV, behärska intervjuer och lär dig att söka arbete på ett kvalitativt sätt.",
    cardBg: "bg-brand-red/[0.03]",
    iconBg: "bg-brand-red/10",
    iconText: "text-brand-red",
  },
  {
    href: "/halsosparet",
    icon: Heart,
    headline: "Hälsospåret",
    body: "I hälsospåret arbetar vi för att främja din hälsa och välmående. Få hjälp att skapa goda rutiner, sätta mål och Boosta ditt självförtroende. Vi arbetar med alla sidor av hälsan - fysisk aktivitet, psykisk hälsa och kulturella aktiviteter.",
    cardBg: "bg-brand-blue-light/20",
    iconBg: "bg-brand-blue-light/30",
    iconText: "text-brand-navy",
  },
];

export function TracksSection() {
  return (
    <section className="py-16 md:py-24 bg-surface">
      <div className="container-page">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-4">
              Våra spår
            </h2>
            <p className="text-text-muted max-w-xl leading-relaxed mx-auto">
              Vi arbetar i tre spår som hänger ihop och gör det enkelt att
              snabbt växla mellan dem utifrån vad deltagaren behöver i stunden.
            </p>
          </div>
        </ScrollReveal>
        <div className="grid md:grid-cols-3 gap-8 md:gap-10">
          {tracks.map((track, i) => (
            <ScrollReveal key={track.headline} delay={i * 0.1}>
              <Link
                to={track.href}
                className={`group ${track.cardBg} rounded-2xl p-8 md:p-10 border border-border/40 hover:shadow-lg hover:border-brand-navy/20 transition-all duration-300 hover:-translate-y-1 block h-full`}
              >
                <div
                  className={`inline-flex items-center justify-center h-20 w-20 rounded-2xl ${track.iconBg} ${track.iconText} mb-6`}
                >
                  <track.icon className="h-10 w-10" />
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-text mb-3 leading-snug">
                  {track.headline}
                </h3>
                <p className="text-text-muted leading-relaxed mb-5">
                  {track.body}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy group-hover:gap-2.5 transition-all">
                  Läs mer <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
