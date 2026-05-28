import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Star
} from 'lucide-react';
import { useExercises } from '../hooks/useExercises';
import { useAuth } from '../auth/useAuth';
import { GuideSection } from '../components/GuideSection';
import { FutureFeatures } from '../components/FutureFeatures';

export default function Library() {
  const { data: exercises, isLoading, error } = useExercises();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showInfo, setShowInfo] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const difficulties = ['all', 'Lätt', 'Medel', 'Svår'];

  const filteredExercises = exercises.filter((ex: any) => {
    const matchesSearch = ex.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ex.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ex.muscleGroups?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || ex.difficulty === selectedDifficulty;
    return matchesSearch && matchesDifficulty;
  });

  const handleExerciseClick = (id: string) => {
    navigate(`/exercise/${id}`);
  };

  const guideSteps = [
    {
      title: "Sök efter övningar",
      description: "Använd sökfältet för att hitta specifika övningar eller muskelgrupper. Du kan söka på övningens namn, färdighet eller fokusområde."
    },
    {
      title: "Filtrera efter svårighetsgrad",
      description: "Välj Lätt, Medel eller Svår för att hitta övningar som matchar din grupps nivå. Alla nivåer visar samtliga övningar."
    },
    {
      title: "Utforska detaljer",
      description: "Klicka på 'Visa övning' för att se detaljerad instruktion, bilder, video och tips för genomförande."
    },
    {
      title: "Spara favoriter",
      description: "Markera övningar som favoriter för snabb åtkomst. Dina favoriter sparas och är tillgängliga från alla enheter."
    }
  ];

  const futureFeatures = [
    {
      icon: Search,
      title: "Avancerad Filtrering",
      description: "Filtrera på ålder, gruppstorlek, utrustning och träningsfokus.",
      status: "Kommer Q3 2026"
    },
    {
      icon: Star,
      title: "Favoriter & Samlingar",
      description: "Skapa egna övningspass och spara dem som samlingar.",
      status: "Kommer Q3 2026"
    },
    {
      icon: BookOpen,
      title: "Träningsplaner",
      description: "Färdiga träningsplaner för olika åldrar och nivåer.",
      status: "Kommer Q4 2026"
    },
    {
      icon: Users,
      title: "Dela med Teamet",
      description: "Dela övningar och planer med andra ledare i ditt team.",
      status: "Kommer Q4 2026"
    },
    {
      icon: Clock,
      title: "Tidsplanering",
      description: "Planera hela träningspass med tidsangivelser och pauser.",
      status: "Kommer 2027"
    },
    {
      icon: Dumbbell,
      title: "Videoövningar",
      description: "Se instruktionsvideor för varje övning direkt i biblioteket.",
      status: "Kommer 2027"
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="pt-32 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface">
        <div className="pt-32 px-4 max-w-container mx-auto">
          <div className="bg-boost-red/10 border border-boost-red/20 rounded-xl p-6 text-boost-red-bright text-center">
            <Info className="w-12 h-12 mx-auto mb-4 text-boost-red-bright" />
            <h3 className="text-lg font-semibold mb-2">Kunde inte ladda övningar</h3>
            <p className="text-secondary">Försök igen senare eller kontakta support.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Hero Section - Consistent dark blue */}
      <div className="relative bg-surface overflow-hidden border-b border">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-boost-blue-light/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="relative max-w-container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <span className="text-accent text-sm font-semibold uppercase tracking-wider">Övningsbibliotek</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-text">
              Ditt kompletta <span className="text-accent">träningsbibliotek</span>
            </h1>
            <p className="text-lg text-secondary mb-8 leading-relaxed">
              Utforska vårt bibliotek med professionellt utvecklade övningar för alla nivåer. 
              Filtrera efter svårighetsgrad, sök efter muskelgrupper och hitta de perfekta övningarna för ditt träningsprogram.
            </p>

            {/* Stats with RED icons */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-surface-card rounded-lg px-4 py-2 border border">
                <Layers className="w-5 h-5 text-boost-red-bright" />
                <span className="text-sm font-medium text-text">{exercises.length} övningar</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-card rounded-lg px-4 py-2 border border">
                <Award className="w-5 h-5 text-boost-red-bright" />
                <span className="text-sm font-medium text-text">Alla nivåer</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-card rounded-lg px-4 py-2 border border">
                <Zap className="w-5 h-5 text-boost-red-bright" />
                <span className="text-sm font-medium text-text">Expertguidade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {showInfo && (
        <div className="bg-accent/10 border-b border-accent/20">
          <div className="max-w-container mx-auto px-6 md:px-12 py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-accent" />
              </div>
              <div className="flex-1">
                <p className="text-text text-sm">
                  <span className="font-semibold">Så här använder du biblioteket:</span> Använd sökfältet för att hitta specifika övningar eller muskelgrupper. 
                  Filtrera efter svårighetsgrad för att hitta övningar som matchar din nivå. Klicka på "Visa övning" för detaljerad instruktion.
                </p>
              </div>
              <button 
                onClick={() => setShowInfo(false)}
                className="text-muted hover:text-text transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter Section */}
      <div className="sticky top-0 z-30 bg-surface-dark border-b border shadow-sm">
        <div className="max-w-container mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
              <input
                type="text"
                placeholder="Sök övningar, muskelgrupper..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-input border border-light rounded-xl focus:outline-none focus:border-accent transition-all text-text placeholder:text-muted"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted" />
              <div className="flex gap-1">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      selectedDifficulty === diff
                        ? 'bg-accent text-surface shadow-md'
                        : 'bg-surface-input text-secondary hover:text-text border border'
                    }`}
                  >
                    {diff === 'all' ? 'Alla' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="max-w-container mx-auto px-6 md:px-12 py-8">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-surface-card rounded-full flex items-center justify-center mx-auto mb-4 border border">
              <Search className="w-10 h-10 text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">Inga övningar hittades</h3>
            <p className="text-secondary">Försök med en annan sökning eller filter.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-secondary text-sm">
                Visar <span className="font-semibold text-text">{filteredExercises.length}</span> övningar
                {searchQuery && <span> för "<span className="font-semibold">{searchQuery}</span>"</span>}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise: any) => (
                <div 
                  key={exercise.id} 
                  className="group bg-surface-card rounded-2xl border border overflow-hidden hover:shadow-lg hover:border-accent/30 transition-all duration-300 cursor-pointer"
                  onClick={() => handleExerciseClick(exercise.id)}
                >
                  {/* Card Image Placeholder */}
                  <div className="relative h-48 bg-gradient-to-br from-surface-dark to-surface flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/0 transition-all"></div>
                    <Dumbbell className="w-16 h-16 text-accent/30 group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        exercise.difficulty === 'Lätt' ? 'bg-success/20 text-success' :
                        exercise.difficulty === 'Medel' ? 'bg-accent/20 text-accent' :
                        'bg-boost-red/20 text-boost-red-bright'
                      }`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-text mb-2 group-hover:text-accent transition-colors">
                      {exercise.title}
                    </h3>
                    <p className="text-secondary text-sm mb-4 line-clamp-2 leading-relaxed">
                      {exercise.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <Clock className="w-4 h-4" />
                        <span>{exercise.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-muted">
                        <Target className="w-4 h-4" />
                        <span>{exercise.muscleGroups?.split(',')[0] || 'Hela kroppen'}</span>
                      </div>
                    </div>

                    <button 
                      className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-surface rounded-xl font-semibold hover:bg-accent-hover transition-colors group-hover:shadow-lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExerciseClick(exercise.id);
                      }}
                    >
                      Visa övning
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
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