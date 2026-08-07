import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { InfoBanner } from "@/components/info-banner";
import { Seo } from "@/components/seo";

export default function ExerciseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface font-body">
      <Seo title="Övning" description="Detaljerad övningsbeskrivning." />
      <div className="container-page py-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-text-muted hover:text-text transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till biblioteket
        </button>

        <div className="max-w-3xl">
          <div className="bg-white rounded-card border border-border p-8 md:p-10 shadow-sm">
            <h1 className="text-2xl font-display font-bold text-text mb-4">
              Övningsdetaljer
            </h1>
            <InfoBanner
              title="Innehåll kommer snart"
              description={`Detaljerad övningsinformation hämtas från Hygraph. Den här sidan visar för närvarande en platshållare. Övning ID: ${id}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
