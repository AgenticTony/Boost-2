import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { WaveDivider } from "@/components/ui/wave-divider";
import {
  ArrowRight,
  Users,
  CheckCircle,
  UserCheck,
  Target,
  Building,
  Landmark,
  Handshake,
} from "lucide-react";
import { useSeo } from "@/hooks/use-seo";

const eligibility = [
  "18-29 år",
  "Inskriven på Arbetsförmedlingen",
  "Vill ha intensivt stöd",
];
const includes = [
  "Personlig vägledare",
  "CV + intervjuträning",
  "Samarbete med Arbetsförmedlingen",
  "Stöd under hela processen",
];
const methods = [
  {
    icon: UserCheck,
    title: "Individuellt anpassat",
    body: "Vi utgår från din situation, dina mål och din takt. Ingen standardlösning - bara det som fungerar för dig.",
  },
  {
    icon: Target,
    title: "Holistiskt angreppssätt",
    body: "Vi ser hela människan. Arbete, studier och hälsa hänger ihop - därför får du tillgång till alla tre spåren.",
  },
  {
    icon: Building,
    title: "Samarbete med myndigheter",
    body: "Vi jobbar nära Arbetsförmedlingen och Malmö stad för att du ska få rätt stöd från alla håll.",
  },
];

export default function BridgePage() {
  const seo = useSeo({
    title: "Bridge by FCR",
    description:
      "ESF-finansierat projekt för dig som är 18-29 år och inskriven på Arbetsförmedlingen. Intensivt stöd mot arbete eller studier.",
    canonical: "/bridge",
  });

  return (
    <>
      {seo}
      {/* Hero */}
      <section className="relative bg-brand-navy text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <ScrollReveal direction="left">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 rounded-pill px-4 py-1.5 text-xs font-body font-medium text-brand-red-bright mb-6">
                  <Users className="h-3.5 w-3.5" />
                  ESF-projekt
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-display font-extrabold leading-tight mb-4">
                  Bridge by FCR
                </h1>
                <p className="text-lg text-white/75 max-w-xl leading-relaxed">
                  Är du 18-29 och inskriven på Arbetsförmedlingen? Då kan du
                  delta i vårt ESF-finansierade projekt som ger dig intensivt
                  stöd mot arbete eller studier.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="hidden lg:flex flex-col justify-center gap-6">
                {/* Fact chips - unified card */}
                <div className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="h-1 bg-linear-to-r from-brand-red via-brand-red/60 to-transparent" />
                  <div className="grid grid-cols-3 gap-0 divide-x divide-white/10">
                    {[
                      {
                        icon: <Users className="h-5 w-5 text-brand-red" />,
                        value: "18-29",
                        sub: "år",
                      },
                      {
                        icon: <Landmark className="h-5 w-5 text-brand-red" />,
                        value: "ESF",
                        sub: "finansierat",
                      },
                      {
                        icon: <Handshake className="h-5 w-5 text-brand-red" />,
                        value: "AF",
                        sub: "samarbete",
                      },
                    ].map((chip) => (
                      <div
                        key={chip.value}
                        className="flex flex-col items-center justify-center py-6 px-3"
                      >
                        <div className="mb-2">{chip.icon}</div>
                        <span className="text-xl font-display font-extrabold text-white">
                          {chip.value}
                        </span>
                        <span className="text-xs text-white/60 mt-0.5">
                          {chip.sub}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Funder logos - unified card */}
                <div className="rounded-2xl bg-white/[0.06] backdrop-blur-sm border border-white/10 overflow-hidden">
                  <div className="h-1 bg-linear-to-r from-brand-red via-brand-red/60 to-transparent" />
                  <p className="text-xs text-white/60 text-center pt-4 pb-2 uppercase tracking-wider">
                    Finansieras och stöds av
                  </p>
                  <div className="grid grid-cols-3 gap-0 divide-x divide-white/10">
                    {[
                      {
                        alt: "EU Socialfonden",
                        src: "/images/eu-logo-jordbruksfonden.webp",
                      },
                      {
                        alt: "Malmö Stad",
                        src: "/images/malmostad-logo2013-inv.png",
                      },
                      {
                        alt: "FC Rosengård",
                        src: "/images/FCR_logo_2014_CMYK.webp",
                      },
                    ].map((logo) => (
                      <div
                        key={logo.alt}
                        className="flex items-center justify-center py-5 px-4"
                      >
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className="h-14 max-w-[110px] w-auto object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        <WaveDivider from="navy" to="white" />
      </section>

      {/* Vad är Bridge? */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-page">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text leading-tight mb-6">
                  Vad är Bridge by FCR?
                </h2>
                <div className="space-y-5 text-text-muted leading-relaxed">
                  <p>
                    Bridge by FCR är vårt ESF-finansierade projekt som ger dig
                    intensivt stöd mot arbete eller studier. Vi samarbetar nära
                    med Arbetsförmedlingen och Malmö stad, och finns här för att
                    fylla det glapp som annars är svårt att navigera på egen
                    hand.
                  </p>
                  <p>
                    Genom Bridge får du tillgång till alla tre spår -
                    Arbetsspåret, Studiespåret och Hälsospåret - med en
                    personlig vägledare som hjälper dig lägga en plan utifrån
                    just din situation.
                  </p>
                </div>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="space-y-6">
                <div className="bg-brand-navy text-white rounded-2xl p-6 md:p-8">
                  <h3 className="font-display font-semibold text-lg mb-5">
                    Passar det här mig?
                  </h3>
                  <ul className="space-y-3">
                    {eligibility.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-brand-red-bright shrink-0" />
                        <span className="text-white/90">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-surface rounded-2xl p-8 md:p-10 border border-border/60">
                  <h3 className="font-display font-semibold text-lg text-text mb-5">
                    Det här ingår
                  </h3>
                  <ul className="space-y-3">
                    {includes.map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-brand-navy shrink-0" />
                        <span className="text-text-muted">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <ScrollReveal>
            <h2 className="text-3xl md:text-[2.75rem] font-display font-extrabold text-text mb-12">
              Så arbetar vi
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {methods.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl border border-border/60 p-8 md:p-10 shadow-sm hover:shadow-lg transition-all duration-300 h-full">
                  <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-navy text-white mb-5">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-text mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Funders bar */}
      <section className="py-10 border-b border-border/60 bg-white">
        <div className="container-page text-center">
          <ScrollReveal>
            <h3 className="font-display font-semibold text-text mb-3">
              Bridge by FCR finansieras av Europeiska Unionen
            </h3>
            <p className="text-text-muted leading-relaxed max-w-xl mx-auto mb-8">
              Det här projektet har mottagit finansiering från Europeiska
              Socialfonden.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {[
                {
                  alt: "EU Socialfonden",
                  src: "/images/eu-logo-jordbruksfonden.webp",
                  className: "h-14 w-auto",
                },
                {
                  alt: "Arbetsförmedlingen",
                  src: "/images/af-logo.webp",
                  className: "h-10 w-auto",
                },
                {
                  alt: "Malmö Stad",
                  src: "/images/malmostad-logo2013-inv.png",
                  className: "h-12 w-auto",
                },
              ].map((logo) => (
                <div
                  key={logo.alt}
                  className="flex items-center justify-center py-5 px-6 rounded-xl bg-brand-navy"
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className={`${logo.className} object-contain`}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-brand-navy text-white overflow-hidden border-b-4 border-b-brand-red">
        <WaveDivider from="white" to="navy" mirror />
        <div className="container-page pt-4 pb-16 md:pt-6 md:pb-24 text-center">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold mb-4">
              Är Bridge något för dig?
            </h2>
            <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-8">
              Det tar tre minuter att anmäla sig. Vi hör av oss inom en
              arbetsdag.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-brand-red text-white hover:bg-brand-red/90 font-display font-semibold rounded-full px-10 h-14 shadow-lg shadow-brand-red/25 hover:scale-[1.02] transition-all duration-300"
            >
              <Link to="/anmal-dig2">
                Anmäl dig till Bridge <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
