import { useState } from 'react';
import { 
  Lightbulb,
  BookOpen,
  Clock,
  ChevronRight,
  Tag,
  Eye,
  Star,
  Search,
  Filter
} from 'lucide-react';
import { PageLayout } from '../components/PageLayout';
import { SectionDivider } from '../components/SectionDivider';
import { InfoBanner } from '../components/InfoBanner';
import { GuideSection } from '../components/GuideSection';
import { FutureFeatures } from '../components/FutureFeatures';

// Article card component with RED category icon
const ArticleCard = ({ title, description, category, readTime, views, rating, tags }: any) => (
  <div className="bg-surface-card border border rounded-card p-6 hover:border-accent transition-all duration-300 group cursor-pointer">
    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 bg-boost-red/10 rounded-xl flex items-center justify-center">
        <BookOpen className="w-6 h-6 text-boost-red-bright" />
      </div>
      <span className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-pill">
        {category}
      </span>
    </div>

    <h3 className="text-text font-semibold text-lg mb-2 group-hover:text-accent transition-colors">
      {title}
    </h3>
    <p className="text-secondary text-sm mb-4 leading-relaxed line-clamp-2">
      {description}
    </p>

    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag: string, i: number) => (
        <span key={i} className="flex items-center gap-1 px-2 py-1 bg-surface-input text-secondary text-xs rounded-lg">
          <Tag className="w-3 h-3" />
          {tag}
        </span>
      ))}
    </div>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 text-muted text-sm">
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{readTime}</span>
        </div>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span>{views}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{rating}</span>
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
    </div>
  </div>
);

export const KnowledgeSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Alla');

  const articles = [
    {
      title: "Mental Träning för Unga Idrottare",
      description: "Lär dig tekniker för att bygga mental styrka, hantera prestationsångest och utveckla ett vinnande mindset hos unga fotbollsspelare.",
      category: "Mental Hälsa",
      readTime: "8 min",
      views: "1.2k",
      rating: "4.9",
      tags: ["Mental Styrka", "Prestation", "Ungdom"]
    },
    {
      title: "Kost & Näring för Optimal Prestation",
      description: "En guide till rätt kost för unga idrottare. Vad ska de äta före, under och efter träning för bästa resultat och återhämtning?",
      category: "Kost & Hälsa",
      readTime: "12 min",
      views: "890",
      rating: "4.7",
      tags: ["Kost", "Näring", "Återhämtning"]
    },
    {
      title: "Skadeförebyggande Träning",
      description: "Viktiga övningar och rutiner för att minimera skaderisker. Fokus på uppvärmning, stretchning och styrketräning för unga spelare.",
      category: "Fysisk Träning",
      readTime: "10 min",
      views: "650",
      rating: "4.8",
      tags: ["Skador", "Förebyggande", "Styrka"]
    },
    {
      title: "Lagbygge och Team Dynamics",
      description: "Strategier för att skapa ett starkt lag, hantera konflikter och bygga en positiv lagkultur där alla känner sig inkluderade.",
      category: "Ledarskap",
      readTime: "15 min",
      views: "430",
      rating: "4.6",
      tags: ["Team", "Kommunikation", "Inkludering"]
    },
    {
      title: "Föräldraengagemang i Föreningen",
      description: "Så här involverar du föräldrar på ett konstruktivt sätt. Tips för kommunikation, förväntningshantering och samarbete.",
      category: "Ledarskap",
      readTime: "7 min",
      views: "320",
      rating: "4.5",
      tags: ["Föräldrar", "Engagemang", "Kommunikation"]
    },
    {
      title: "Grundläggande Taktik för U-lag",
      description: "En introduktion till fotbollstaktik anpassad för unga spelare. Formationer, presspel och övergångar förklarat enkelt.",
      category: "Taktik",
      readTime: "11 min",
      views: "780",
      rating: "4.8",
      tags: ["Taktik", "Formationer", "Grundläggande"]
    }
  ];

  const categories = ['Alla', 'Mental Hälsa', 'Kost & Hälsa', 'Fysisk Träning', 'Ledarskap', 'Taktik'];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'Alla' || article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const guideSteps = [
    {
      title: "Sök och filtrera artiklar",
      description: "Använd sökfältet för att hitta specifika ämnen eller nyckelord. Filtrera efter kategori för att fokusera på områden som intresserar dig mest."
    },
    {
      title: "Läs och lär",
      description: "Klicka på en artikel för att läsa hela innehållet. Varje artikel är skriven av experter och innehåller praktiska tips du kan applicera direkt."
    },
    {
      title: "Spara för senare",
      description: "Markera artiklar som favoriter för att enkelt hitta tillbaka till dem. Dina sparade artiklar synkas över alla dina enheter."
    },
    {
      title: "Dela med kollegor",
      description: "Dela intressanta artiklar med andra ledare i ditt nätverk. Tillsammans växer vi som förening och tränare."
    }
  ];

  const futureFeatures = [
    {
      icon: Search,
      title: "Avancerad Sökning",
      description: "Sök i artikeltext, filter på författare, datum och läsningstid.",
      status: "Kommer Q3 2026"
    },
    {
      icon: Star,
      title: "Favoriter & Samlingar",
      description: "Skapa egna samlingar av artiklar och spara för framtida referens.",
      status: "Kommer Q3 2026"
    },
    {
      icon: BookOpen,
      title: "Ljudversioner",
      description: "Lyssna på artiklar som poddar under träning eller i bilen.",
      status: "Kommer Q4 2026"
    },
    {
      icon: Filter,
      title: "Personliga Rekommendationer",
      description: "Få artiklar rekommenderade baserat på dina intressen och läsvanor.",
      status: "Kommer Q4 2026"
    },
    {
      icon: Lightbulb,
      title: "Quiz & Kunskapstester",
      description: "Testa dina kunskaper med interaktiva quiz efter varje artikel.",
      status: "Kommer 2027"
    },
    {
      icon: Tag,
      title: "Expertkommentarer",
      description: "Läs kommentarer och tillägg från experter direkt i artiklarna.",
      status: "Kommer 2027"
    }
  ];

  return (
    <PageLayout
      title="Kunskapsbanken"
      subtitle="Utforska vår samling av artiklar, guider och expertinnehåll inom träning, ledarskap, mental hälsa och mer. Allt skapat för att hjälpa dig bli en ännu bättre ledare."
      badge="Lärande & Utveckling"
      heroIcon={Lightbulb}
    >
      {/* Search & Filters */}
      <section className="max-w-container mx-auto px-6 md:px-12 py-12">
        <SectionDivider label="Utforska Artiklar" />

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Sök artiklar, ämnen, nyckelord..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-surface-input border border-light text-text placeholder:text-muted rounded-input focus:border-accent focus:outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-3 rounded-input text-sm font-medium transition-all ${
                  categoryFilter === cat
                    ? 'bg-accent text-surface'
                    : 'bg-surface-input text-secondary border border hover:text-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-secondary text-sm">
            Visar <span className="text-text font-semibold">{filteredArticles.length}</span> artiklar
            {categoryFilter !== 'Alla' && <span> — Kategori: <span className="text-accent">{categoryFilter}</span></span>}
          </p>
          <div className="flex items-center gap-2 text-muted text-sm">
            <Lightbulb className="w-4 h-4" />
            <span>Expertinnehåll</span>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article, index) => (
            <ArticleCard key={index} {...article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-text font-medium mb-2">Inga artiklar hittades</p>
            <p className="text-secondary text-sm">Prova att ändra din sökning eller filter</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mt-8">
          <InfoBanner 
            title="Innehåll uppdateras regelbundet"
            description="Vårt kunskapsteam publicerar nya artiklar varje vecka. Allt innehåll är granskat av experter inom idrott, psykologi och ledarskap."
          />
        </div>
      </section>

      {/* Guide */}
      <GuideSection
        title="Så här använder du Kunskapsbanken"
        subtitle="Följ dessa steg för att få ut mest av ditt lärande"
        steps={guideSteps}
      />

      {/* Future Features */}
      <FutureFeatures
        title="Kommande Funktioner"
        subtitle="Kunskapsbanken kommer växa med fler verktyg för ditt kontinuerliga lärande."
        features={futureFeatures}
      />
    </PageLayout>
  );
};