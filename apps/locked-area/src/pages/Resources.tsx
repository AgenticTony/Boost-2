import {
  Heart,
  Phone,
  AlertTriangle,
  ExternalLink,
  Mail,
  BookOpen,
  Clock,
  MapPin,
  MessageSquare,
  Shield,
  type LucideIcon
} from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { SectionDivider } from '../components/SectionDivider';
import { InfoBanner } from '../components/InfoBanner';
import { GuideSection } from '../components/GuideSection';
import { FutureFeatures } from '../components/FutureFeatures';

// ── Types ─────────────────────────────────────────────────
interface ResourceCardProps {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: string;
  href?: string;
  linkText: string;
  external?: boolean;
}

// ── Resource card component ──────────────────────────
const ResourceCard = ({ icon: Icon, title, description, href, linkText, badge, external }: ResourceCardProps) => {
  const linkClasses =
    'inline-flex items-center gap-2 text-brand-red hover:text-brand-red/80 text-sm font-medium transition-colors';

  return (
    <div className="bg-white border border-border rounded-card p-6 hover:border-brand-red/30 transition-all duration-300 shadow-sm flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-brand-red/10 rounded-input flex items-center justify-center">
          <Icon className="w-6 h-6 text-brand-red" />
        </div>
        {badge && (
          <span className="px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-medium rounded-pill">
            {badge}
          </span>
        )}
      </div>
      <h3 className="text-text font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-text-muted text-sm mb-4 leading-relaxed flex-1">{description}</p>
      {href ? (
        <a
          href={href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className={linkClasses}
        >
          {linkText}
          <ExternalLink className="w-4 h-4" />
        </a>
      ) : (
        <span className="text-text-muted text-sm italic">{linkText}</span>
      )}
    </div>
  );
};

export const Resources = () => {
  const resources: ResourceCardProps[] = [
    {
      icon: AlertTriangle,
      title: 'Akut hjälp',
      description:
        'Vid akuta situationer som kräver omedelbar assistans — ring 112. Detta gäller olyckor, allvarlig skada eller om någon är i fara.',
      href: 'tel:112',
      linkText: 'Ring 112',
      badge: 'Akut',
      external: false,
    },
    {
      icon: Phone,
      title: 'Stödlinjen',
      description:
        'Behöver du någon att prata med? Stödlinjen vänder sig till både deltagare och ledare och erbjuder vägledning, samtal och rådgivning.',
      href: undefined,
      linkText: 'Nummer publiceras snart',
    },
    {
      icon: Mail,
      title: 'Kontakta oss via e-post',
      description:
        'Skicka ett mejl till Boost-teamet med frågor om programmet, träning eller deltagande. Vi besvarar ditt meddelande så snart vi kan.',
      href: 'mailto:kontakt@boostbyfcr.se',
      linkText: 'Skicka e-post',
      external: false,
    },
  ];

  const guideSteps = [
    {
      title: 'Hitta rätt resurs',
      description:
        'Läs igenom korten ovan för att hitta den typ av stöd du behöver — oavsett om det gäller akut hjälp, en stödsamtal eller allmänna frågor.'
    },
    {
      title: 'Klicka för att ta kontakt',
      description:
        'Varje resurs har en direktlänk. Klicka på "Ring" för att slå numret, eller "Skicka e-post" för att öppna din e-postklient.'
    },
    {
      title: 'Spara för senare',
      description:
        'Bokmärk den här sidan i din webbläsare för snabb åtkomst. Du kan också spara enskilda nummer i telefonens kontakter för framtida bruk.'
    },
    {
      title: 'Dela med andra',
      description:
        'Om du känner någon som behöver stöd, dela gärna dessa resurser. Informationen här är till för alla Boost-deltagare och deras familjer.'
    }
  ];

  const futureFeatures = [
    {
      icon: BookOpen,
      title: 'Resursbibliotek',
      description: 'Nedladdningsbara PDF:er, guider och dokument för träning och personlig utveckling.',
      status: 'Kommer Q3 2026'
    },
    {
      icon: Heart,
      title: 'Mental hälsa',
      description: 'Artiklar, övningar och professionella kontakter med fokus på välmående och mental hälsa.',
      status: 'Kommer Q4 2026'
    },
    {
      icon: Shield,
      title: 'Säkerhetsriktlinjer',
      description: 'Omfattande säkerhetsrutiner och beredskapsplaner för alla aktiviteter.',
      status: 'Kommer Q4 2026'
    },
    {
      icon: MapPin,
      title: 'Lokala partners',
      description: 'Karta och förteckning över lokala organisationer, mottagningar och stödcenter.',
      status: 'Kommer 2027'
    },
    {
      icon: MessageSquare,
      title: 'Direktmeddelanden',
      description: 'Skicka säkra meddelanden direkt till vår personal från den här sidan.',
      status: 'Kommer 2027'
    },
    {
      icon: Clock,
      title: 'Boka tid',
      description: 'Boka samtal eller möten med personal via en integrerad kalender.',
      status: 'Kommer 2027'
    }
  ];

  return (
    <PageLayout
      title="Resurser & Kontakter"
      subtitle="Här hittar du viktiga kontakter, stödlinjer och resurser för dig som deltar i Boost by FC Rosengård. Oavsett om du behöver någon att prata med eller snabb hjälp — vi finns här för dig."
      badge="Stöd & Hjälp"
      heroIcon={Heart}
    >
      {/* Resources Grid */}
      <section className="container-page py-12">
        <SectionDivider label="Tillgängliga Resurser" />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-8">
          <InfoBanner
            title="Alla resurser är konfidentiella"
            description="Dina samtal och kontakter hanteras med fullständig sekretess. Ingen information delas med tredje part utan ditt medgivande."
          />
        </div>
      </section>

      {/* Guide */}
      <GuideSection
        title="Så här använder du den här sidan"
        subtitle="Följ dessa steg för att snabbt hitta och använda resurserna"
        steps={guideSteps}
      />

      {/* Future Features */}
      <FutureFeatures
        title="Kommande Funktioner"
        subtitle="Resurser-sidan kommer växa med fler verktyg och funktioner. Här är vad vi planerar att lägga till framöver."
        features={futureFeatures}
      />
    </PageLayout>
  );
};

export default Resources;

