import type { ReactNode, ComponentType } from "react";
import { Cookie, Settings, ShieldCheck, FilePenLine, Mail } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { useSeo } from "@/hooks/use-seo";

/* ─── Reusable section wrapper ─── */
function PolicySection({
  id,
  icon: Icon,
  title,
  bgClass = "",
  children,
}: {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  bgClass?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`py-12 md:py-16 ${bgClass}`}>
      <div className="container-page max-w-3xl">
        <div className="flex items-start gap-5 mb-6">
          <div className="inline-flex items-center justify-center h-14 w-14 shrink-0 rounded-2xl bg-brand-navy/10 text-brand-navy">
            <Icon className="h-7 w-7" />
          </div>
          <h2 className="pt-3 text-2xl font-display font-extrabold text-text">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

/* ─── Custom bullet list ─── */
function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-navy/40" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ─── Page ─── */
export default function CookiepolicyPage() {
  const seo = useSeo({
    title: "Cookiepolicy",
    description:
      "Hur vi använder cookies och liknande tekniker på vår hemsida.",
    canonical: "/cookiepolicy",
  });

  return (
    <>
      {seo}
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <h1 className="mb-4 text-4xl font-display font-extrabold leading-tight md:text-5xl lg:text-[3.5rem]">
            Cookiepolicy
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-white/75">
            Hur vi använder cookies och liknande tekniker på vår hemsida.
          </p>
        </div>
      </section>

      {/* ── Intro ── */}
      <ScrollReveal>
        <section className="py-12 md:py-16">
          <div className="container-page max-w-3xl">
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                Boost by FC Rosengård använder cookies och liknande tekniker på
                vår hemsida för att den ska fungera på bästa sätt, för att
                förbättra din användarupplevelse och för att samla in statistik
                om hur hemsidan används.
              </p>
              <p>
                Denna cookiepolicy förklarar vilka typer av cookies vi använder,
                syftet med dem och hur du kan hantera dina inställningar. För
                mer information om hur vi behandlar dina personuppgifter, se vår{" "}
                <a
                  href="/dataskyddspolicy"
                  className="text-brand-navy font-medium underline underline-offset-2"
                >
                  dataskyddspolicy
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── §1 Vad är cookies ── */}
      <ScrollReveal>
        <PolicySection
          id="vad-ar-cookies"
          icon={Cookie}
          title="1. Vad är cookies?"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Cookies är små textfiler som placeras på din enhet när du besöker
              en hemsida. De gör det möjligt för hemsidan att komma ihåg dina
              handlingar och preferenser under en viss tid (till exempel
              inloggningsuppgifter, språk, teckenstorlek och andra preferenser),
              så att du inte behöver återange dem varje gång du går tillbaka
              till hemsidan eller bläddrar från en sida till en annan.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §2 Typer av cookies ── */}
      <ScrollReveal>
        <PolicySection
          id="typer"
          icon={Settings}
          title="2. Vilka typer av cookies använder vi?"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>Vi använder följande kategorier av cookies på vår hemsida:</p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Nödvändiga cookies
            </h3>
            <p>
              Dessa cookies är nödvändiga för att hemsidan ska fungera och kan
              inte stängas av i våra system. De sparas vanligtvis endast som
              svar på åtgärder som du gör och som motsvarar en begäran om
              tjänster, till exempel inställning av dina preferenser för
              integritet, inloggning eller ifyllning av formulär.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Analys- och prestandacookies
            </h3>
            <p>
              Dessa cookies låter oss räkna besök och trafikkällor så att vi kan
              mäta och förbättra prestandan på vår hemsida. De hjälper oss att
              veta vilka sidor som är mest och minst populära och se hur
              besökare navigerar på webbplatsen. All information som samlas in
              av dessa cookies är aggregerad och anonym.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Funktionella cookies
            </h3>
            <p>
              Dessa cookies gör det möjligt för hemsidan att tillhandahålla
              förbättrad funktionalitet och personalisering. De kan sättas av
              oss eller av tredjepartsleverantörer vars tjänster vi har lagt
              till på våra sidor.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §3 Tredjepartstjänster ── */}
      <ScrollReveal>
        <PolicySection
          id="tredjepart"
          icon={ShieldCheck}
          title="3. Tredjepartstjänster"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Vi använder följande tredjepartstjänster som kan placera cookies
              på din enhet:
            </p>
            <BulletList
              items={[
                "Google Analytics - för att samla in anonym statistik om hur hemsidan används",
                "Cookiebot - för att hantera ditt samtycke till cookies",
              ]}
            />
            <p>
              Dessa tjänster behandlar data i enlighet med sina egna
              integritetspolicys. Vi har begränsat den information som delas med
              dessa tjänster till vad som är nödvändigt för respektive syfte.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §4 Hantera cookies ── */}
      <ScrollReveal>
        <PolicySection
          id="hantera"
          icon={Settings}
          title="4. Hur hanterar du cookies?"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Du kan när som helst ändra dina cookie-inställningar genom att
              använda cookie-hanteraren på vår hemsida. Du kan också styra eller
              radera cookies i din webbläsares inställningar.
            </p>
            <p>
              Observera att om du inaktiverar nödvändiga cookies kan det påverka
              hemsidans funktionalitet.
            </p>
            <BulletList
              items={[
                "Google Chrome: Inställningar → Integritet och säkerhet → Cookies",
                "Safari: Inställningar → Integritet → Hantera webbplatsdata",
                "Firefox: Inställningar → Integritet och säkerhet → Kakor",
                "Microsoft Edge: Inställningar → Webbplatsbehörigheter → Cookies",
              ]}
            />
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §5 Ändringar ── */}
      <ScrollReveal>
        <PolicySection
          id="andringar"
          icon={FilePenLine}
          title="5. Ändringar i cookiepolicyn"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Boost by FC Rosengård förbehåller sig rätten att när som helst
              ändra denna cookiepolicy genom att publicera den nya, reviderade,
              policyn på webbplatsen. Vi rekommenderar att du regelbundet
              granskar denna sida för att hålla dig uppdaterad om eventuella
              ändringar.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §6 Kontakt ── */}
      <ScrollReveal>
        <PolicySection
          id="kontakt"
          icon={Mail}
          title="6. Kontakta oss"
          bgClass="bg-muted/60"
        >
          <div className="text-text-muted leading-relaxed">
            <p>
              Om du har frågor om vår användning av cookies kan du kontakta oss
              på{" "}
              <a
                href="mailto:dataskydd@boostbyfcr.se"
                className="text-brand-navy hover:underline"
              >
                dataskydd@boostbyfcr.se
              </a>
              .
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>
    </>
  );
}
