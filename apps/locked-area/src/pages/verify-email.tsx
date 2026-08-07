import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Seo } from "@/components/seo";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body">
      <Seo title="E-post verifierad" />
      <div className="bg-white rounded-card border border-border p-8 text-center max-w-md shadow-md">
        <div className="w-12 h-12 rounded-input bg-success/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-success" />
        </div>
        <h2 className="text-xl font-display font-bold text-text mb-2">
          E-post verifierad!
        </h2>
        <p className="text-text-muted text-sm mb-6">
          Din e-post är verifierad! Du kan nu logga in.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-6 py-2.5 rounded-cta transition-all"
        >
          Till inloggning
        </Link>
      </div>
    </div>
  );
}
