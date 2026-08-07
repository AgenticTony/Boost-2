import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Target, Dumbbell, PlayCircle } from "lucide-react";
import { useExercise } from "@/hooks/use-exercises";
import { ContentError } from "@/api/adapter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert } from "@/components/ui/alert";
import { InfoBanner } from "@/components/info-banner";
import { Seo } from "@/components/seo";
import { cn } from "@/lib/utils";

const DIFFICULTY_STYLES: Record<string, string> = {
  Lätt: "bg-success/20 text-success",
  Medel: "bg-brand-gold/20 text-brand-gold",
  Svår: "bg-brand-red/20 text-brand-red",
};

function BackLink() {
  return (
    <Link
      to="/"
      className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-6"
    >
      <ArrowLeft className="w-4 h-4" aria-hidden="true" />
      Tillbaka till biblioteket
    </Link>
  );
}

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: exercise, isLoading, error } = useExercise(id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Spinner size="lg" tone="accent" label="Laddar övning" />
      </div>
    );
  }

  if (error) {
    const notConfigured =
      error instanceof ContentError && error.isNotConfigured;

    return (
      <div className="min-h-screen bg-surface font-body">
        <Seo title="Övning" />
        <div className="container-page py-8">
          <BackLink />
          <Alert variant={notConfigured ? "info" : "error"}>
            {notConfigured
              ? "Materialet är inte publicerat ännu."
              : "Kunde inte hämta övningen. Försök igen."}
          </Alert>
        </div>
      </div>
    );
  }

  // A slug that matches nothing resolves to null rather than throwing, so this
  // is an ordinary not-found rather than a failure.
  if (!exercise) {
    return (
      <div className="min-h-screen bg-surface font-body">
        <Seo title="Övningen hittades inte" />
        <div className="container-page py-8">
          <BackLink />
          <Card className="p-8 text-center max-w-xl">
            <h1 className="text-2xl font-display font-bold text-text mb-3">
              Övningen hittades inte
            </h1>
            <p className="text-text-muted leading-relaxed mb-8">
              Länken kan vara gammal, eller så har övningen tagits bort.
            </p>
            <Button asChild>
              <Link to="/">Till biblioteket</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      <Seo title={exercise.title} description={exercise.description} />

      <div className="container-page py-8">
        <BackLink />

        <div className="max-w-3xl">
          <Card className="overflow-hidden">
            {exercise.imageUrl ? (
              <img
                src={exercise.imageUrl}
                alt=""
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="h-48 bg-gradient-to-br from-brand-navy to-surface flex items-center justify-center">
                <Dumbbell
                  className="w-16 h-16 text-white/30"
                  aria-hidden="true"
                />
              </div>
            )}

            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={cn(
                    "px-3 py-1 rounded-pill text-xs font-bold",
                    DIFFICULTY_STYLES[exercise.difficulty] ??
                      "bg-brand-navy/10 text-brand-navy",
                  )}
                >
                  {exercise.difficulty}
                </span>
                {exercise.durationMinutes > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <Clock className="w-4 h-4" aria-hidden="true" />
                    {exercise.durationMinutes} min
                  </span>
                )}
                {exercise.muscleGroups.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-text-muted">
                    <Target className="w-4 h-4" aria-hidden="true" />
                    {exercise.muscleGroups.join(", ")}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-display font-bold text-text mb-4">
                {exercise.title}
              </h1>

              {exercise.description && (
                <p className="text-text-muted text-lg leading-relaxed mb-8">
                  {exercise.description}
                </p>
              )}

              {exercise.steps.length > 0 ? (
                <>
                  <h2 className="font-display font-semibold text-xl text-text mt-8 mb-3">
                    Så här gör du
                  </h2>
                  {/* Hygraph stores `steps` as a Json array of strings, so this
                      renders as real list markup. The earlier design assumed
                      rich text and would have needed dangerouslySetInnerHTML -
                      the actual schema removes that surface entirely. */}
                  <ol className="list-decimal pl-6 space-y-2 text-text leading-relaxed">
                    {exercise.steps.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </>
              ) : (
                <InfoBanner
                  title="Instruktioner saknas"
                  description="Den här övningen har ingen beskriven instruktion ännu."
                />
              )}

              {exercise.videoUrl && (
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 text-brand-red hover:text-brand-red/80 font-medium"
                >
                  <PlayCircle className="w-5 h-5" aria-hidden="true" />
                  Se instruktionsvideo
                  <span className="sr-only">(öppnas i ny flik)</span>
                </a>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
