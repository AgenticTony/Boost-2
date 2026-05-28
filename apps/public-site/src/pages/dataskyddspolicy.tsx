import type { ReactNode, ComponentType } from "react";
import {
  ClipboardList,
  Settings,
  Users,
  Globe,
  Clock,
  ShieldCheck,
  Cookie,
  FilePenLine,
  Mail,
  MapPin,
} from "lucide-react";
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
export default function DataskyddspolicyPage() {
  const seo = useSeo({
    title: "Dataskyddspolicy",
    description:
      "Hur vi hanterar och skyddar din personliga information i enlighet med GDPR.",
    canonical: "/dataskyddspolicy",
  });

  return (
    <>
      {seo}
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="container-page relative py-20 md:py-28">
          <h1 className="mb-4 text-4xl font-display font-extrabold leading-tight md:text-5xl lg:text-[3.5rem]">
            Dataskyddspolicy
          </h1>
          <p className="max-w-lg text-lg leading-relaxed text-white/75">
            Vi värnar om din personliga integritet.
          </p>
        </div>
      </section>

      {/* ── Intro ── */}
      <ScrollReveal>
        <section className="py-12 md:py-16">
          <div className="container-page max-w-3xl">
            <h2 className="mb-4 text-2xl font-display font-extrabold text-text">
              Parter och ansvar för behandlingen av dina personuppgifter
            </h2>
            <div className="space-y-4 text-text-muted leading-relaxed">
              <p>
                Boost by FC Rosengård (802516-4461) har som ändamål att bedriva
                allmännyttig social hjälpverksamhet, utbildningsverksamhet eller
                annan likvärdig allmännyttig verksamhet, ge stöd till olika
                utsatta målgrupper. Boost by FC Rosengård är
                personuppgiftsansvarig för behandlingen av personuppgifter som
                sker inom ramen för föreningens verksamhet.
              </p>
              <p>
                Denna dataskyddspolicy förklarar hur vi samlar in och använder
                dina personuppgifter. Den beskriver också dina rättigheter
                gentemot oss och hur du kan göra dina rättigheter gällande. Du
                kan alltid kontakta oss vid frågor kring integritets- och
                dataskydd genom att skicka ett e-postmeddelande till oss på{" "}
                <a
                  href="mailto:dataskydd@boostbyfcr.se"
                  /* Underlined at rest, not just on hover: this link sits inside a
                     paragraph of muted body text, and colour alone only separates
                     it by 2.01:1 - below the 3:1 WCAG needs when colour is the
                     sole cue (SC 1.4.1 Use of Colour). */
                  className="text-brand-navy font-medium underline underline-offset-2"
                >
                  dataskydd@boostbyfcr.se
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Inline TOC ── */}
      <ScrollReveal>
        <section className="pb-12 md:pb-16">
          <div className="container-page max-w-3xl">
            <div className="rounded-2xl border border-border/60 bg-muted/60 p-6 md:p-8">
              <h2 className="mb-4 font-display font-semibold text-text">
                Innehåll
              </h2>
              <nav aria-label="Innehållsförteckning">
                <ol className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <li>
                    <a
                      href="#information"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      1. Vilken information samlar vi in?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#behandling"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      2. Vad gör vi med din information?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#delning"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      3. Vilka kan vi dela din information till?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#eu-ees"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      4. Var behandlar vi dina personuppgifter?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#lagring"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      5. Hur länge sparar vi dina personuppgifter?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#rattigheter"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      6. Vilka är mina rättigheter?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#cookies"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      7. Cookies och liknande tekniker
                    </a>
                  </li>
                  <li>
                    <a
                      href="#andringar"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      8. Ändringar i policyn
                    </a>
                  </li>
                  <li>
                    <a
                      href="#kontakt"
                      className="text-text-muted transition-colors hover:text-brand-navy"
                    >
                      9. Kontakta oss
                    </a>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── §1 Information collection ── */}
      <ScrollReveal>
        <PolicySection
          id="information"
          icon={ClipboardList}
          title="1. Vilken information samlar vi in?"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Information du ger till oss
            </h3>
            <p>
              Du kan direkt eller indirekt komma att ge oss information om dig
              själv på ett antal sätt. Till exempel:
            </p>
            <BulletList
              items={[
                "När du anmäler dig till någon av våra verksamheter",
                "När du deltar i någon av våra verksamheter",
                "När du besöker vår hemsida eller våra sociala medier",
              ]}
            />
            <p>Detta kan vara:</p>
            <BulletList
              items={[
                "Namn, födelsedatum, personnummer",
                "Adress",
                "Telefonnummer",
                "Arbetslivserfarenhet och studieresultat",
                "Dina myndighetskontakter",
                "Intressen",
              ]}
            />

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Information vi samlar in
            </h3>
            <p>
              Utöver den information du aktivt ger till oss kan vi samla in
              följande information:
            </p>
            <BulletList
              items={[
                "Uppgifter om ditt deltagande (närvaro, resultat) när du deltar i någon av våra verksamheter",
                "Information om hur du använder våra digitala verktyg när du är inne på dessa",
                "Enhetsinformation - t.ex. IP-adress, språkinställningar, webbläsarinställningar, tidszon, operativsystem, plattform och skärmupplösning när du är inne på vår hemsida",
              ]}
            />
            <p>
              Informationen du ger oss, såväl som den vi samlar in är generellt
              sett nödvändig för kunna delta i verksamhet som arrangeras av oss,
              medan den övriga informationen vi samlar in generellt sett är
              nödvändig för andra syften, såsom beskrivet nedan.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §2 Data processing (table) ── */}
      <ScrollReveal>
        <PolicySection
          id="behandling"
          icon={Settings}
          title="2. Vad gör vi med din information?"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              All data används för att tillhandahålla, utföra och förbättra vår
              verksamhet. Vi behandlar personuppgifter för följande syften
              baserat på följande lagliga grunder:
            </p>

            <div className="overflow-x-auto rounded-2xl border border-border/60 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-brand-navy/[0.04]">
                    <th className="px-5 py-3 font-display font-semibold text-text">
                      Ändamål med behandling
                    </th>
                    <th className="px-5 py-3 font-display font-semibold text-text">
                      Laglig grund
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">Deltagande i verksamhet</td>
                    <td className="px-5 py-3">Intresseavvägning</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">Insamling av kontaktuppgifter</td>
                    <td className="px-5 py-3">
                      Samtycke (deltagare) / Intresseavvägning
                      (samverkansparter)
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      För att följa lagstiftning, såsom bokföringslagar
                    </td>
                    <td className="px-5 py-3">Rättslig förpliktelse</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">Ansökan om bidrag</td>
                    <td className="px-5 py-3">Rättslig förpliktelse</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      Sammanställning av statistik och uppföljning
                    </td>
                    <td className="px-5 py-3">
                      Rättslig förpliktelse / Allmänt intresse
                    </td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">Besök på vår hemsida</td>
                    <td className="px-5 py-3">Intresseavvägning</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">
                      Publicering av material på hemsida och sociala medier
                    </td>
                    <td className="px-5 py-3">Samtycke</td>
                  </tr>
                  <tr className="transition-colors hover:bg-muted/30">
                    <td className="px-5 py-3">Utskick av nyhetsbrev</td>
                    <td className="px-5 py-3">Samtycke</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §3 Third-party sharing ── */}
      <ScrollReveal>
        <PolicySection
          id="delning"
          icon={Users}
          title="3. Vilka kan vi komma att dela din information till?"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Vi kan komma att överföra till, eller dela din information med,
              utvalda tredje parter, enligt följande. Vi vidtar rimliga legala,
              tekniska och organisatoriska åtgärder för att säkerställa att din
              data hanteras säkert och med en adekvat skyddsnivå vid överföring
              till eller delning med sådana utvalda tredje parter.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Leverantörer och underleverantörer
            </h3>
            <p>
              Vi kan komma att dela dina personuppgifter till leverantörer eller
              underleverantörer för utförandet av våra åtaganden gentemot dig
              och för andra syften som framgår i denna dataskyddspolicy.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Medlemsorganisationer och samverkansparter
            </h3>
            <p>
              Vi kan komma att dela din information med den samverkanspart som
              vi arrangerar den verksamhet du deltar i för att de ska kunna
              administrera ditt deltagande. För de personuppgifter som delas med
              samverkanspart gäller partens dataskyddspolicy och
              personuppgiftshantering.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Myndigheter
            </h3>
            <p>
              Vi kan komma att lämna nödvändig information till myndigheter
              såsom Arbetsförmedlingen, Malmö stad, Svenska ESF-rådet,
              Statistiska centralbyrån eller andra myndigheter om vi är skyldiga
              att göra det enligt lag, förordning eller ett allmänt intresse.
            </p>

            {/* "Not selling" callout */}
            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Vad vi inte kommer att göra med din data
            </h3>
            <div className="rounded-xl border border-brand-red/20 bg-brand-red-light p-5">
              <p className="text-sm leading-relaxed text-text">
                Vi kommer inte att sälja dina personuppgifter till tredje part.
              </p>
            </div>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §4 Data location ── */}
      <ScrollReveal>
        <PolicySection
          id="eu-ees"
          icon={Globe}
          title="4. Var behandlar vi dina personuppgifter?"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Vi strävar efter att behandla din data inom EU/EES. I de fall data
              kan komma att överföras till, och behandlas i, land utanför EU/EES
              vidtar vi rimliga legala, tekniska och organisatoriska åtgärder
              för att säkerställa att din data hanteras säkert och med en
              adekvat skyddsnivå jämförbar med och i samma nivå som det skydd
              som erbjuds inom EU/EES.
            </p>
            <p>
              Vi använder oss idag av tjänster som Google tillhandahåller. Detta
              kan medföra att data överförs till, och behandlas i, land utanför
              EU/EES. Google är dock certifierad enligt Privacy Shield, vilket
              innebär att de kan anses behandla data på en jämförbar skyddsnivå.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §5 Data retention ── */}
      <ScrollReveal>
        <PolicySection
          id="lagring"
          icon={Clock}
          title="5. Hur länge sparar vi dina personuppgifter?"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Vi sparar din data endast så länge som det är nödvändigt för att
              utföra våra åtaganden gentemot dig och så länge det krävs enligt
              lagstadgade lagringstider. När vi sparar din data för andra syften
              än för våra åtaganden gentemot dig sparar vi datan endast så länge
              som det är nödvändigt och/eller lagstadgat för respektive syfte.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §6 Your rights ── */}
      <ScrollReveal>
        <PolicySection
          id="rattigheter"
          icon={ShieldCheck}
          title="6. Vilka är mina rättigheter?"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Rätt att få tillgång till din data
            </h3>
            <p>
              Du kan begära en kopia av de uppgifter du skulle vilja veta och
              verifiera den information vi har om dig. Kopian är gratis att
              begära.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Rätt till rättelse
            </h3>
            <p>
              Du har rätt att få dina personuppgifter korrigerade om de är
              felaktiga, ofullständiga eller missvisande och rätt att begränsa
              behandlingen av personuppgifterna tills de blir ändrade.
            </p>

            <h3 className="mt-6 mb-3 font-display font-semibold text-text">
              Rätt att bli raderad (&quot;rätten att bli bortglömd&quot;)
            </h3>
            <p>
              Du har rätt att begära radering av dina personuppgifter för de
              fall att datan inte längre är nödvändig för det syfte den blev
              insamlad för. Det kan dock finnas legala skyldigheter för Boost by
              FC Rosengård, som hindrar oss från att omedelbart radera delar av
              din data. Dessa skyldigheter kan komma från exempelvis bokförings-
              och skattelagstiftning och förordningar från myndigheter Boost by
              FC Rosengård har ingått avtal med. Vad vi då gör är att blockera
              den data som vi är skyldiga att spara, från att kunna användas
              till andra syften än att uppfylla sådana legala skyldigheter.
            </p>
            <p>
              Du har också rätt att dra in ett samtycke, motsätta dig
              automatiskt beslutsfattande, profilering och invända mot
              direktmarknadsföring.
            </p>
            <p>
              Du kan när som helst utöva dina rättigheter genom att begära
              tillgång till och rättelse eller radering av personuppgifter,
              begära begränsning av behandling eller invända mot behandling.
              Kontakta oss på{" "}
              <a
                href="mailto:dataskydd@boostbyfcr.se"
                className="text-brand-navy hover:underline"
              >
                dataskydd@boostbyfcr.se
              </a>{" "}
              för att utöva dina rättigheter.
            </p>
            <p>
              Vidare har du rätt att ge klagomål på vår behandling av
              personuppgifter till Datainspektionen genom att besöka{" "}
              <a
                href="https://www.datainspektionen.se"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-navy hover:underline"
              >
                www.datainspektionen.se
              </a>
              .
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §7 Cookies ── */}
      <ScrollReveal>
        <PolicySection
          id="cookies"
          icon={Cookie}
          title="7. Hur är det med cookies och liknande tekniker?"
          bgClass="bg-muted/60"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Vi använder cookies och liknande spårningstekniker i våra
              webbtjänster. För mer information om hur Boost by FC Rosengård
              använder cookies och liknande, se vår information om cookies på{" "}
              <a
                href="https://www.boostbyfcr.se/cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-navy hover:underline"
              >
                www.boostbyfcr.se/cookies
              </a>
              .
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §8 Policy changes ── */}
      <ScrollReveal>
        <PolicySection
          id="andringar"
          icon={FilePenLine}
          title="8. Ändringar i policyn"
        >
          <div className="space-y-4 text-text-muted leading-relaxed">
            <p>
              Boost by FC Rosengård förbehåller sig rätten att när som helst
              ändra denna integritetspolicy genom att publicera den nya,
              reviderade, policyn på webbplatsen.
            </p>
          </div>
        </PolicySection>
      </ScrollReveal>

      {/* ── §9 Contact CTA ── */}
      <ScrollReveal>
        <PolicySection
          id="kontakt"
          icon={Mail}
          title="9. Kontakta oss"
          bgClass="bg-muted/60"
        >
          <div className="mb-8 text-text-muted leading-relaxed">
            <p>
              Om du har frågor kan du kontakta oss genom e-post till{" "}
              <a
                href="mailto:dataskydd@boostbyfcr.se"
                className="text-brand-navy hover:underline"
              >
                dataskydd@boostbyfcr.se
              </a>{" "}
              eller brev till Boost by FC Rosengård, Lantmannagatan 32 B, 214 48
              Malmö.
            </p>
          </div>

          {/* Contact card */}
          <div className="rounded-2xl border border-border/60 bg-white p-6 md:p-8">
            <h3 className="mb-5 font-display text-lg font-semibold text-text">
              Dataskyddsfrågor
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-semibold text-text">E-post</p>
                  <a
                    href="mailto:dataskydd@boostbyfcr.se"
                    className="text-sm text-text-muted transition-colors hover:text-brand-navy"
                  >
                    dataskydd@boostbyfcr.se
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-semibold text-text">
                    Postadress
                  </p>
                  <p className="text-sm text-text-muted">
                    Boost by FC Rosengård, Lantmannagatan 32 B, 214 48 Malmö
                  </p>
                </div>
              </div>
            </div>
          </div>
        </PolicySection>
      </ScrollReveal>
    </>
  );
}
