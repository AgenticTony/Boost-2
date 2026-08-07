import { BookOpen, UserCircle, BarChart3, type LucideIcon } from "lucide-react";

const FEATURES: Array<{ icon: LucideIcon; title: string; caption: string }> = [
  {
    icon: BookOpen,
    title: "Övningar & Handbok",
    caption: "Strukturerat metodmaterial",
  },
  {
    icon: UserCircle,
    title: "Kunskapsmaterial",
    caption: "För deltagare och handledare",
  },
  {
    icon: BarChart3,
    title: "Resultat & Uppföljning",
    caption: "Följ din utveckling",
  },
];

const STATS = [
  { value: "3 800+", label: "DELTAGARE" },
  { value: "20+", label: "ÅRS ERFARENHET" },
  { value: "98%", label: "NÖJDHET" },
];

/**
 * Marketing panel beside the auth card. Presentational only - it holds no
 * form state, which is why it can sit outside the login page's logic entirely.
 *
 * Hidden below `lg`, where the auth card takes the full width.
 */
export function AuthHero() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative bg-surface-dark">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/images/deltagare_boostbyfcr_pa_trappa.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-brand-navy/80" />
      </div>

      <div className="relative z-10 flex flex-col justify-between p-12 text-white">
        <div>
          <img
            src="/images/logo_boostbyfcr_dark.png"
            alt="Boost by FC Rosengård"
            className="h-10 mb-8"
          />
          <p className="text-brand-gold text-sm font-medium mb-4 tracking-wider">
            ✦ SEDAN 2003
          </p>
          <h1 className="text-4xl font-display font-bold mb-2 leading-tight">
            Tillsammans öppnar
            <br />
            <span className="text-brand-gold">vi vägar framåt</span>
          </h1>
          <p className="text-white/70 max-w-md mt-4 text-sm leading-relaxed">
            Vi bygger förutsättningar som ger unga möjlighet att utvecklas,
            hitta riktning och forma sin framtid.
          </p>
        </div>

        <div className="space-y-4">
          {FEATURES.map(({ icon: Icon, title, caption }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-input bg-white/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-brand-gold" aria-hidden="true" />
              </div>
              <div>
                <p className="font-medium text-sm">{title}</p>
                <p className="text-xs text-white/60">{caption}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-brand-gold">{value}</p>
              <p className="text-xs text-white/60 tracking-wider">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
