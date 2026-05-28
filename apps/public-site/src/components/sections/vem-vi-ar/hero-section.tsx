import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";

export function HeroSection() {
  return (
    <section className="relative bg-brand-navy text-white overflow-hidden">
      <div className="pointer-events-none absolute -bottom-48 [mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] [-webkit-mask-image:linear-gradient(to_bottom,black_0%,transparent_55%)] -left-48 h-[500px] w-[500px] rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
      <div className="container-page relative py-20 md:py-28">
        <ScrollReveal>
          <p className="text-xs font-body font-medium text-brand-red-bright tracking-widest uppercase mb-4">
            Om oss
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
            Vem vi är
          </h1>
          <p className="text-lg text-white/75 max-w-xl leading-relaxed">
            Boost by FC Rosengård är en idéburen organisation med bas i Malmö.
            Vi arbetar för att öka inkluderingen i samhället genom att stötta
            unga arbetssökande, närma oss arbetsgivare och skapa metoder som
            stöttar unga.
          </p>
        </ScrollReveal>
      </div>
      <WaveDivider from="navy" to="surface" />
    </section>
  );
}
