import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Clock,
  Target,
  BookOpen,
  Filter,
  Info,
  X,
  Dumbbell,
  Layers,
  Award,
  Zap,
  ChevronRight,
  Users,
  Star,
} from "lucide-react";
import { useExercises } from "@/hooks/use-exercises";
import { DIFFICULTIES, type Exercise } from "@/types/exercise";
import { ContentError } from "@/api/adapter";
import { GuideSection } from "@/components/guide-section";
import { FutureFeatures } from "@/components/future-features";
import { Spinner } from "@/components/ui/spinner";
import { PageHero } from "@/components/layout/page-hero";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Seo } from "@/components/seo";

export default function Library() {
  const { data, isLoading, error } = useExercises();
  const exercises = data ?? [];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [showInfo, setShowInfo] = useState(true);

  const difficulties = ["all", ...DIFFICULTIES];

  const q = searchQuery.toLowerCase();
  const filteredExercises = exercises.filter((ex: Exercise) => {
    const matchesSearch =
      ex.title.toLowerCase().includes(q) ||
      ex.description.toLowerCase().includes(q) ||
      ex.muscleGroups.some((group) => group.toLowerCase().includes(q));
    const matchesDifficulty =
      selectedDifficulty === "all" || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const guideSteps = [
    {
      title: "Sök efter övningar",
      description:
        "Använd sökfältet för att hitta specifika övningar eller muskelgrupper. Du kan söka på övningens namn, färdighet eller fokusområde.",
    },
    {
      title: "Filtrera efter svårighetsgrad",
      description:
        "Välj Lätt, Medel eller Svår för att hitta övningar som matchar din grupps nivå. Alla nivåer visar samtliga övningar.",
    },
    {
      title: "Utforska detaljer",
      description:
        "Klicka på 'Visa övning' för att se detaljerad instruktion, bilder, video och tips för genomförande.",
    },
    {
      title: "Spara favoriter",
      description:
        "Markera övningar som favoriter för snabb åtkomst. Dina favoriter sparas och är tillgängliga från alla enheter.",
    },
  ];

  const futureFeatures = [
    {
      icon: Search,
      title: "Avancerad Filtrering",
      description:
        "Filtrera på ålder, gruppstorlek, utrustning och träningsfokus.",
      status: "Kommer Q3 2026",
    },
    {
      icon: Star,
      title: "Favoriter & Samlingar",
      description: "Skapa egna övningspass och spara dem som samlingar.",
      status: "Kommer Q3 2026",
    },
    {
      icon: BookOpen,
      title: "Träningsplaner",
      description: "Färdiga träningsplaner för olika åldrar och nivåer.",
      status: "Kommer Q4 2026",
    },
    {
      icon: Users,
      title: "Dela med Teamet",
      description: "Dela övningar och planer med andra ledare i ditt team.",
      status: "Kommer Q4 2026",
    },
    {
      icon: Clock,
      title: "Tidsplanering",
      description: "Planera hela träningspass med tidsangivelser och pauser.",
      status: "Kommer 2027",
    },
    {
      icon: Dumbbell,
      title: "Videoövningar",
      description:
        "Se instruktionsvideor för varje övning direkt i biblioteket.",
      status: "Kommer 2027",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="pt-32 flex justify-center items-center">
          <Spinner size="lg" tone="accent" label="Laddar övningar" />
        </div>
      </div>
    );
  }

  if (error) {
    // "Nobody has published anything yet" and "the fetch failed" look the same
    // to a member otherwise, and only one of them is worth reporting to
    // support. The edge function returns 503/not_configured until the Hygraph
    // models exist and its secrets are set.
    const notConfigured =
      error instanceof ContentError && error.isNotConfigured;

    return (
      <div className="min-h-screen bg-surface">
        <div className="container-page pt-32">
          <div
            className={cn(
              "rounded-card p-6 text-center border",
              notConfigured
                ? "bg-surface-dark/5 border-border"
                : "bg-error/10 border-error/20 text-error",
            )}
          >
            <Info className="w-12 h-12 mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-display font-semibold mb-2">
              {notConfigured
                ? "Inga övningar publicerade ännu"
                : "Kunde inte ladda övningar"}
            </h3>
            <p className="text-text-muted">
              {notConfigured
                ? "Materialet läggs in inom kort. Titta gärna in igen senare."
                : "Försök igen senare eller kontakta support."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      <Seo
        title="Bibliotek"
        description="Övningar och metodmaterial för Boost-ledare."
      />
      <PageHero
        accent="red"
        icon={BookOpen}
        badge="Övningsbibliotek"
        title={
          <>
            Ditt kompletta{" "}
            <span className="text-brand-red">träningsbibliotek</span>
          </>
        }
        subtitle="Utforska vårt bibliotek med professionellt utvecklade övningar för alla nivåer. Filtrera efter svårighetsgrad, sök efter muskelgrupper och hitta de perfekta övningarna för ditt träningsprogram."
      >
        <div className="flex flex-wrap gap-4">
          {[
            { icon: Layers, label: `${exercises.length} övningar` },
            { icon: Award, label: "Alla nivåer" },
            { icon: Zap, label: "Expertguidade" },
          ].map(({ icon: StatIcon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-card rounded-input px-4 py-2 border border-border shadow-sm"
            >
              <StatIcon className="w-5 h-5 text-brand-red" aria-hidden="true" />
              <span className="text-sm font-medium text-text">{label}</span>
            </div>
          ))}
        </div>
      </PageHero>

      {/* Info Banner */}
      {showInfo && (
        <div className="bg-brand-red/5 border-b border-brand-red/20">
          <div className="container-page py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-brand-red/10 rounded-pill flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-brand-red" />
              </div>
              <div className="flex-1">
                <p className="text-text text-sm">
                  <span className="font-semibold">
                    Så här använder du biblioteket:
                  </span>{" "}
                  Använd sökfältet för att hitta specifika övningar eller
                  muskelgrupper. Filtrera efter svårighetsgrad för att hitta
                  övningar som matchar din nivå. Klicka på &quot;Visa
                  övning&quot; för detaljerad instruktion.
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                aria-label="Stäng meddelande"
                className="text-text-muted hover:text-text transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Section.
          top-16 rather than top-0: the header is also sticky at top-0 with a
          higher z-index, so this bar slid underneath it and disappeared.
          16 = the header's h-16. */}
      <div className="sticky top-16 z-30 bg-card border-b border-border shadow-sm">
        <div className="container-page py-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                icon={Search}
                placeholder="Sök övningar, muskelgrupper..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Sök övningar"
                className="py-3"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-text-muted" />
              <div className="flex gap-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={cn(
                      "px-4 py-2 rounded-input text-sm font-semibold transition-all",
                      selectedDifficulty === diff
                        ? "bg-brand-navy text-white shadow-sm"
                        : "bg-white text-text-muted hover:text-text border border-border",
                    )}
                  >
                    {diff === "all" ? "Alla" : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="container-page py-8">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white rounded-pill flex items-center justify-center mx-auto mb-4 border border-border">
              <Search className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-xl font-display font-semibold text-text mb-2">
              Inga övningar hittades
            </h3>
            <p className="text-text-muted">
              Försök med en annan sökning eller filter.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-text-muted text-sm">
                Visar{" "}
                <span className="font-semibold text-text">
                  {filteredExercises.length}
                </span>{" "}
                övningar
                {searchQuery && (
                  <span>
                    {" "}
                    för &quot;
                    <span className="font-semibold">{searchQuery}</span>&quot;
                  </span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise: Exercise) => (
                // The card was a <div> with onClick wrapping a real <button>:
                // unreachable by keyboard, invisible to screen readers as a
                // control, and nested interactive content. It is now an inert
                // container whose single link stretches over the whole card,
                // so the click target is unchanged but there is exactly one
                // focusable element per card.
                <article
                  key={exercise.id}
                  aria-labelledby={`exercise-${exercise.id}-title`}
                  className="group relative bg-card rounded-card border border-border overflow-hidden hover:shadow-lg hover:border-brand-red/30 transition-all duration-300 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-navy"
                >
                  {/* Card Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-brand-navy to-surface flex items-center justify-center overflow-hidden">
                    <Dumbbell className="w-16 h-16 text-white/30 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-pill text-xs font-bold ${
                          exercise.difficulty === "Lätt"
                            ? "bg-success/20 text-success"
                            : exercise.difficulty === "Medel"
                              ? "bg-brand-gold/20 text-brand-gold"
                              : "bg-brand-red/20 text-brand-red"
                        }`}
                      >
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3
                      id={`exercise-${exercise.id}-title`}
                      className="text-lg font-display font-bold text-text mb-2 group-hover:text-brand-red transition-colors"
                    >
                      {exercise.title}
                    </h3>
                    <p className="text-text-muted text-sm mb-4 line-clamp-2 leading-relaxed">
                      {exercise.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.durationMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-text-muted">
                        <Target className="w-4 h-4" />
                        <span>
                          {exercise.muscleGroups[0] ?? "Hela kroppen"}
                        </span>
                      </div>
                    </div>

                    {/* after:inset-0 stretches this link across the whole
                        card, so the entire surface stays clickable without a
                        second control competing for focus. */}
                    <Link
                      to={`/exercise/${exercise.id}`}
                      aria-label={`Visa övning: ${exercise.title}`}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-brand-red text-white rounded-input font-semibold hover:bg-brand-red/90 transition-colors group-hover:shadow-lg after:absolute after:inset-0 after:content-['']"
                    >
                      Visa övning
                      <ChevronRight
                        className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Guide Section */}
      <GuideSection
        title="Så här använder du biblioteket"
        subtitle="Följ dessa steg för att hitta och använda övningar effektivt"
        steps={guideSteps}
      />

      {/* Future Features */}
      <FutureFeatures
        title="Kommande Funktioner"
        subtitle="Biblioteket kommer växa med fler verktyg för att göra din träningsplanering ännu bättre."
        features={futureFeatures}
      />
    </div>
  );
}
