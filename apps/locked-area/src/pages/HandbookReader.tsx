import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  User,
  Calendar,
  Bookmark,
  Share2,
  Printer,
  Search,
  CheckCircle2,
  Circle,
  StickyNote,
  Download,
  BarChart3
} from 'lucide-react';
import { InfoBanner } from '../components/InfoBanner';
import { GuideSection } from '../components/GuideSection';
import { FutureFeatures } from '../components/FutureFeatures';

const TOCItem = ({ number, title, isActive, onClick, isCompleted }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-accent/10 border border-accent/30' 
        : 'hover:bg-surface-dark/50 border border-transparent'
    }`}
  >
    {isCompleted ? (
      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
    ) : (
      <Circle className="w-4 h-4 text-muted flex-shrink-0" />
    )}
    <span className={`text-sm font-medium ${isActive ? 'text-accent' : 'text-text'}`}>
      {number}. {title}
    </span>
  </button>
);

export const HandbookReader = () => {
  const { id } = useParams<{ id: string }>();
  const [activeChapter, setActiveChapter] = useState(0);
  const sidebarOpen = true;  // ← changed from useState
  const fullscreen = false;  // ← changed from useState
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const handbookInfo = {
    title: "Metodhandbok för Ledare",
    subtitle: "Boost by FC Rosengård — Träningsmetodik & Vägledning",
    author: "Boost Team",
    lastUpdated: "2026-06-15",
    readTime: "45 min",
    totalChapters: 8
  };

  const chapters = [
    { title: "Introduktion till Boost-metoden", content: "Boost-metoden är en helhetsinriktad träningsfilosofi..." },
    { title: "Grundprinciper & Värderingar", content: "De fem grundprinciperna..." },
    { title: "Träningsupplägg & Struktur", content: "Hur du strukturerar en typisk träningsvecka..." },
    { title: "Övningsbiblioteket", content: "Så här navigerar du i övningsbiblioteket..." },
    { title: "Kommunikation med Deltagare", content: "Bästa praxis för att bygga förtroende..." },
    { title: "Säkerhet & Riskhantering", content: "Riktlinjer för att säkerställa en trygg miljö..." },
    { title: "Utvärdering & Uppföljning", content: "Metoder för att mäta framsteg..." },
    { title: "Resurser & Fortbildning", content: "Fortsatta lärandemöjligheter..." }
  ];

  const guideSteps = [
    { title: "Välj kapitel i innehållsförteckningen", description: "Använd menyn till vänster..." },
    { title: "Läs och navigera", description: "Använd pilknapparna längst ner..." },
    { title: "Spara och dela", description: "Klicka på bokmärkesikonen..." },
    { title: "Sök i handboken", description: "Använd sökfältet för att snabbt hitta..." }
  ];

  const futureFeatures = [
    { icon: Search, title: "Avancerad Sökning", description: "Fulltextsökning...", status: "Kommer Q3 2026" },
    { icon: StickyNote, title: "Personliga Anteckningar", description: "Lägg till egna kommentarer...", status: "Kommer Q3 2026" },
    { icon: Share2, title: "Dela Kapitel", description: "Dela enskilda kapitel...", status: "Kommer Q4 2026" },
    { icon: Download, title: "PDF-export", description: "Ladda ner hela handboken...", status: "Kommer Q4 2026" },
    { icon: Printer, title: "Utskriftsvänligt Format", description: "Optimerad layout...", status: "Kommer 2027" },
    { icon: BarChart3, title: "Lässtatistik", description: "Se din läsframsteg...", status: "Kommer 2027" }
  ];

  const toggleComplete = (index: number) => {
    setCompletedChapters(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const progress = Math.round((completedChapters.length / chapters.length) * 100);

  return (
    <div className="min-h-screen bg-surface">
      {/* REMOVED: Internal header - App.tsx Header handles this */}

      {/* Progress Bar */}
      <div className="bg-surface-dark border-b border">
        <div className="max-w-container mx-auto px-6 md:px-12 py-3">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-surface-input rounded-full h-2 overflow-hidden">
              <div 
                className="bg-accent h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-muted text-sm font-medium whitespace-nowrap">
              {completedChapters.length}/{chapters.length} kapitel
            </span>
            <span className="text-accent text-sm font-bold whitespace-nowrap">
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Table of Contents */}
        {sidebarOpen && (
          <aside className="w-80 bg-surface-dark border-r border min-h-[calc(100vh-64px)] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-5 h-5 text-accent" />
                <h2 className="text-text font-semibold">Innehållsförteckning</h2>
              </div>
              <div className="space-y-1">
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
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${fullscreen ? 'max-w-4xl mx-auto' : ''}`}>
          {/* ... rest of content ... */}
          
          {/* Hero */}
          <section className="relative overflow-hidden border-b border">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-dark opacity-50" />
            <div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="max-w-container mx-auto px-6 md:px-12 relative py-12">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-pill">
                    Handbok #{id}
                  </span>
                  <span className="text-muted text-sm">{handbookInfo.readTime} lästid</span>
                </div>
                <h1 className="text-text text-3xl md:text-4xl font-bold mb-3">
                  {handbookInfo.title}
                </h1>
                <p className="text-secondary text-lg mb-6">{handbookInfo.subtitle}</p>
                <div className="flex flex-wrap items-center gap-6 text-sm text-muted">
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
          <section className="max-w-container mx-auto px-6 md:px-12 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-accent text-sm font-medium">
                    Kapitel {activeChapter + 1} av {chapters.length}
                  </span>
                  <h2 className="text-text text-2xl font-bold mt-1">
                    {chapters[activeChapter].title}
                  </h2>
                </div>
                <button
                  onClick={() => toggleComplete(activeChapter)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    completedChapters.includes(activeChapter)
                      ? 'bg-accent/10 text-accent border border-accent/30'
                      : 'bg-surface-input text-muted border border hover:text-text'
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

              <div className="prose prose-invert max-w-none">
                <div className="bg-surface-card border border rounded-card p-8">
                  <p className="text-secondary text-lg leading-relaxed mb-6">
                    {chapters[activeChapter].content}
                  </p>
                  <p className="text-secondary leading-relaxed">
                    Detta är exempelinnehåll för kapitlet...
                  </p>
                  <div className="mt-8">
                    <InfoBanner 
                      title="Kommer snart"
                      description="Fullständigt innehåll med bilder, videor och interaktiva element laddas från Hygraph CMS."
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-8 border-t border">
                <button
                  onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))}
                  disabled={activeChapter === 0}
                  className="flex items-center gap-2 px-5 py-3 bg-surface-input border border rounded-lg text-text hover:border-accent disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-boost-red-bright" />
                  <span className="text-sm font-medium">Föregående</span>
                </button>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-surface-card rounded-lg transition-colors" title="Bokmärk">
                    <Bookmark className="w-5 h-5 text-boost-red-bright" />
                  </button>
                  <button className="p-2 hover:bg-surface-card rounded-lg transition-colors" title="Dela">
                    <Share2 className="w-5 h-5 text-boost-red-bright" />
                  </button>
                  <button className="p-2 hover:bg-surface-card rounded-lg transition-colors" title="Skriv ut">
                    <Printer className="w-5 h-5 text-boost-red-bright" />
                  </button>
                </div>
                <button
                  onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
                  disabled={activeChapter === chapters.length - 1}
                  className="flex items-center gap-2 px-5 py-3 bg-accent hover:bg-accent-hover rounded-lg text-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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