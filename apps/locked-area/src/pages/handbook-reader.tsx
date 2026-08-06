import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Printer,
  Search,
  CheckCircle2,
  Circle,
  StickyNote,
  Download,
  BarChart3,
  Share2,
} from 'lucide-react';
import { InfoBanner } from '../components/InfoBanner';
import { GuideSection } from '../components/GuideSection';
import { FutureFeatures } from '../components/FutureFeatures';

interface TocItemProps {
  number: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

const TOCItem = ({ number, title, isActive, onClick, isCompleted }: TocItemProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-input transition-all duration-200 ${
      isActive
        ? 'bg-brand-red/10 border border-brand-red/30'
        : 'hover:bg-white/5 border border-transparent'
    }`}
  >
    {isCompleted ? (
      <CheckCircle2 className="w-4 h-4 text-brand-red flex-shrink-0" />
    ) : (
      <Circle className="w-4 h-4 text-white/60 flex-shrink-0" />
    )}
    <span className={`text-sm font-medium ${isActive ? 'text-brand-red' : 'text-white'}`}>
      {number}. {title}
    </span>
  </button>
);

export const HandbookReader = () => {
  const { id } = useParams<{ id: string }>();
  const [activeChapter, setActiveChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const handbookInfo = {
    title: 'Metodhandbok för Ledare',
    subtitle: 'Boost by FC Rosengård — Träningsmetodik & Vägledning',
    author: 'Boost Team',
    lastUpdated: '2026-06-15',
    readTime: '45 min',
    totalChapters: 8,
  };

  const chapters = [
    { title: 'Introduktion till Boost-metoden', content: 'Boost-metoden är en helhetsinriktad träningsfilosofi...' },
    { title: 'Grundprinciper & Värderingar', content: 'De fem grundprinciperna...' },
    { title: 'Träningsupplägg & Struktur', content: 'Hur du strukturerar en typisk träningsvecka...' },
    { title: 'Övningsbiblioteket', content: 'Så här navigerar du i övningsbiblioteket...' },
    { title: 'Kommunikation med Deltagare', content: 'Bästa praxis för att bygga förtroende...' },
    { title: 'Säkerhet & Riskhantering', content: 'Riktlinjer för att säkerställa en trygg miljö...' },
    { title: 'Utvärdering & Uppföljning', content: 'Metoder för att mäta framsteg...' },
    { title: 'Resurser & Fortbildning', content: 'Fortsatta lärandemöjligheter...' },
  ];

  const guideSteps = [
    { title: 'Välj kapitel i innehållsförteckningen', description: 'Använd menyn till vänster för att hoppa till ett specifikt kapitel.' },
    { title: 'Läs och navigera', description: 'Använd pilknapparna längst ner för att gå till nästa eller föregående kapitel.' },
    { title: 'Markera som läst', description: 'Klicka på "Markera som läst" för att spara din framsteg och se hur långt du kommit.' },
    { title: 'Skriv ut eller dela', description: 'Använd knapparna för att skriva ut kapitlet eller dela en länk till handboken.' },
  ];

  const futureFeatures = [
    { icon: Search, title: 'Avancerad Sökning', description: 'Fulltextsökning i hela handboken för att snabbt hitta det du söker.', status: 'Kommer Q3 2026' },
    { icon: StickyNote, title: 'Personliga Anteckningar', description: 'Lägg till egna kommentarer till varje kapitel.', status: 'Kommer Q3 2026' },
    { icon: Share2, title: 'Dela Kapitel', description: 'Dela enskilda kapitel med andra ledare i ditt team.', status: 'Kommer Q4 2026' },
    { icon: Download, title: 'PDF-export', description: 'Ladda ner hela handboken som PDF för offline-läsning.', status: 'Kommer Q4 2026' },
    { icon: Printer, title: 'Utskriftsvänligt Format', description: 'Optimerad layout för utskrift av enskilda kapitel.', status: 'Kommer 2027' },
    { icon: BarChart3, title: 'Lässtatistik', description: 'Se din läsframsteg över tid.', status: 'Kommer 2027' },
  ];

  const toggleComplete = (index: number) => {
    setCompletedChapters((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const progress = Math.round((completedChapters.length / chapters.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: handbookInfo.title,
      text: handbookInfo.subtitle,
      url,
    };
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed — fall back silently.
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Länk kopierad till urklipp.');
      } catch {
        // Clipboard unavailable — ignore silently.
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Progress Bar */}
      <div className="bg-surface-dark border-b border-white/10">
        <div className="container-page py-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/20 rounded-pill h-2 overflow-hidden">
              <div
                className="bg-brand-gold h-full rounded-pill transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-white/70 text-sm font-medium whitespace-nowrap">
              {completedChapters.length}/{chapters.length} kapitel
            </span>
            <span className="text-brand-gold text-sm font-bold whitespace-nowrap">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-80 bg-surface-dark border-r border-white/10 min-h-[calc(100vh-64px)] overflow-y-auto sticky top-0 self-start">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6">
              <BookOpen className="w-5 h-5 text-brand-gold" />
              <h2 className="text-white font-display font-semibold">Innehållsförteckning</h2>
            </div>
            <nav className="space-y-1">
              {chapters.map((chapter, index) => (
                <TOCItem
                  key={index}
                  number={index + 1}
                  title={chapter.title}
                  isActive={activeChapter === index}
                  isCompleted={completedChapters.includes(index)}
                  onClick={() => setActiveChapter(index)}
                />
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-dark opacity-50 pointer-events-none" />
            <div className="absolute top-20 right-10 w-64 h-64 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
            <div className="container-page relative py-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-brand-red/10 text-brand-red text-xs font-medium rounded-pill">
                    Handbok #{id}
                  </span>
                  <span className="text-text-muted text-sm">{handbookInfo.readTime} lästid</span>
                </div>
                <h1 className="text-text text-3xl md:text-4xl font-display font-bold mb-3">
                  {handbookInfo.title}
                </h1>
                <p className="text-text-muted text-lg mb-6">{handbookInfo.subtitle}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{handbookInfo.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Uppdaterad {handbookInfo.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{handbookInfo.totalChapters} kapitel</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Chapter Content */}
          <section className="container-page py-12">
            <div className="max-w-3xl">
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <span className="text-brand-red text-sm font-medium">
                    Kapitel {activeChapter + 1} av {chapters.length}
                  </span>
                  <h2 className="text-text text-2xl font-display font-bold mt-1">
                    {chapters[activeChapter].title}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => toggleComplete(activeChapter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-input text-sm font-medium transition-all flex-shrink-0 ${
                    completedChapters.includes(activeChapter)
                      ? 'bg-brand-red/10 text-brand-red border border-brand-red/30'
                      : 'bg-white text-text-muted border border-border hover:text-text'
                  }`}
                >
                  {completedChapters.includes(activeChapter) ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                  {completedChapters.includes(activeChapter) ? 'Avklarat' : 'Markera som läst'}
                </button>
              </div>

              <div className="bg-white border border-border rounded-card p-8 shadow-sm">
                <p className="text-text-muted text-lg leading-relaxed mb-6">
                  {chapters[activeChapter].content}
                </p>
                <p className="text-text-muted leading-relaxed">
                  Detta är exempelinnehåll för kapitlet. Fullständigt innehåll publiceras här när
                  handboken är importerad från Hygraph CMS.
                </p>
                <div className="mt-8">
                  <InfoBanner
                    title="Kommer snart"
                    description="Fullständigt innehåll med bilder, videor och interaktiva element laddas från Hygraph CMS."
                  />
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-2 mt-8 pt-8 border-t border-border">
                <button
                  type="button"
                  onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                  disabled={activeChapter === 0}
                  className="flex items-center gap-2 px-5 py-3 bg-white border border-border rounded-input text-text hover:border-brand-red/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-brand-red" />
                  <span className="text-sm font-medium">Föregående</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleShare}
                    aria-label="Dela handbok"
                    title="Dela"
                    className="p-2 hover:bg-white rounded-input border border-transparent hover:border-border text-brand-red transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    aria-label="Skriv ut handbok"
                    title="Skriv ut"
                    className="p-2 hover:bg-white rounded-input border border-transparent hover:border-border text-brand-red transition-colors"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
                  disabled={activeChapter === chapters.length - 1}
                  className="flex items-center gap-2 px-5 py-3 bg-brand-navy hover:bg-brand-navy/90 rounded-input text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="text-sm font-medium">Nästa kapitel</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          <GuideSection
            title="Så här använder du Handboken"
            subtitle="Följ dessa steg för att få ut mest av din läsning"
            steps={guideSteps}
          />

          <FutureFeatures
            title="Kommande Funktioner"
            subtitle="Handboks-läsaren kommer förbättras med fler verktyg för en bättre upplevelse."
            features={futureFeatures}
          />
        </main>
      </div>
    </div>
  );
};

export default HandbookReader;
