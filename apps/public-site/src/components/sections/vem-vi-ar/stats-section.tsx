import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import { CountUp } from "@/components/ui/count-up";

const stats = [
  { number: 7500, label: "Unga som varit hos oss" },
  { number: 3800, label: "Fått arbete eller studier" },
  { text: "8 av 10", label: "Nöjda deltagare" },
  { text: "2003", label: "Sedan starten" },
];

export function StatsSection() {
  return (
    <section className="bg-brand-navy text-white overflow-hidden">
      <WaveDivider from="surface" to="navy" mirror />
      <div className="container-page py-14 md:py-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <ScrollReveal direction="left">
            <div>
              <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold leading-tight mb-6">
                Så här mycket har vi hunnit
              </h2>
              <p className="text-white/75 leading-relaxed max-w-md">
                Bakom varje siffra finns en människa som tagit ett steg framåt.
                Sedan 2003 har tusentals unga kommit till oss - och tusentals
                har gått vidare.
              </p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.1} direction="right">
                <div className="rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/10 p-5">
                  <p className="text-3xl md:text-4xl font-display font-extrabold text-brand-red-bright tracking-tight">
                    {stat.number ? <CountUp target={stat.number} /> : stat.text}
                  </p>
                  <p className="mt-1.5 text-white/60 text-sm">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
      <WaveDivider from="navy" to="white" />
    </section>
  );
}
