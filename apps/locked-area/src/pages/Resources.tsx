import { 
  Heart, 
  Phone, 
  Globe, 
  AlertTriangle,
  ExternalLink,
  Shield,
  BookOpen,
  Clock,
  MapPin,
  MessageSquare,
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
  link: string;
  linkText: string;
}

// ── Resource card component with RED icon ──────────────
const ResourceCard = ({ icon: Icon, title, description, link, linkText, badge }: ResourceCardProps) => (
  <div className="bg-surface-card border border rounded-card p-6 hover:border-accent transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-boost-red/10 rounded-xl flex items-center justify-center">
        <Icon className="w-6 h-6 text-boost-red-bright" />
      </div>
      {badge && (
        <span className="px-3 py-1 bg-boost-red/20 text-boost-red-bright text-xs font-medium rounded-pill">
          {badge}
        </span>
      )}
    </div>
    <h3 className="text-text font-semibold text-lg mb-2">{title}</h3>
    <p className="text-secondary text-sm mb-4 leading-relaxed">{description}</p>
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-accent hover:text-accent-hover text-sm font-medium transition-colors"
    >
      {linkText}
      <ExternalLink className="w-4 h-4" />
    </a>
  </div>
);

export const Resources = () => {
  const resources = [
    {
      icon: Phone,
      title: "Support Line",
      description: "Need someone to talk to? Our support line is available for participants and leaders. Get guidance, ask questions, or just have a conversation.",
      link: "tel:123-456",
      linkText: "Call 123-456",
      badge: "24/7"
    },
    {
      icon: Globe,
      title: "Online Help Center",
      description: "Browse our comprehensive help center with FAQs, guides, and articles about the Boost program, training methods, and participant resources.",
      link: "#",
      linkText: "Visit Help Center"
    },
    {
      icon: AlertTriangle,
      title: "Emergency Contact",
      description: "For urgent situations requiring immediate assistance. This line connects you directly to our emergency response team.",
      link: "tel:112",
      linkText: "Call Emergency",
      badge: "URGENT"
    }
  ];

  const guideSteps = [
    {
      title: "Find the right resource",
      description: "Browse the cards above to find the support you need. Each card shows the type of help available — whether it's a phone call, online information, or emergency assistance."
    },
    {
      title: "Click to connect",
      description: "Each resource has a direct link. Click 'Call' to dial the number, or 'Visit' to open the online help center in a new tab. All external links open safely."
    },
    {
      title: "Save for later",
      description: "Bookmark this page in your browser for quick access. You can also save individual numbers to your phone contacts for faster reach in the future."
    },
    {
      title: "Share with others",
      description: "If you know someone who needs support, share these resources. The information here is available to all Boost participants and their families."
    }
  ];

  const futureFeatures = [
    {
      icon: BookOpen,
      title: "Resource Library",
      description: "Downloadable PDFs, guides, and documents for training and personal development.",
      status: "Coming Q3 2026"
    },
    {
      icon: Heart,
      title: "Mental Health Hub",
      description: "Articles, exercises, and professional contacts focused on mental well-being.",
      status: "Coming Q4 2026"
    },
    {
      icon: Shield,
      title: "Safety Guidelines",
      description: "Comprehensive safety protocols and emergency procedures for all activities.",
      status: "Coming Q4 2026"
    },
    {
      icon: MapPin,
      title: "Local Partners",
      description: "Map and directory of local organizations, clinics, and support centers.",
      status: "Coming 2027"
    },
    {
      icon: MessageSquare,
      title: "Direct Messaging",
      description: "Send secure messages to support staff directly from this page.",
      status: "Coming 2027"
    },
    {
      icon: Clock,
      title: "Appointment Booking",
      description: "Schedule calls or meetings with support staff through an integrated calendar.",
      status: "Coming 2027"
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
      <section className="max-w-container mx-auto px-6 md:px-12 py-12">
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