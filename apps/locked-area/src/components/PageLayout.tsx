import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export const PageLayout = ({ 
  children, 
  title, 
  subtitle, 
  badge,
  showBack = false,
  backText = "Tillbaka",
  backTo,
  heroIcon: HeroIcon
}: { 
  children: ReactNode; 
  title?: string; 
  subtitle?: string; 
  badge?: string;
  showBack?: boolean;
  backText?: string;
  backTo?: string;
  heroIcon?: React.ElementType;
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface">
      {showBack && (
        <header className="bg-surface-dark border-b border sticky top-0 z-50">
          <div className="max-w-container mx-auto px-6 md:px-12 py-4">
            <button 
              onClick={() => backTo ? navigate(backTo) : navigate(-1)}
              className="flex items-center gap-2 text-secondary hover:text-text transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm font-medium">{backText}</span>
            </button>
          </div>
        </header>
      )}

      {(title || subtitle) && (
        <section className="relative overflow-hidden border-b border">
          <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-surface-dark opacity-50" />
          <div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
          <div className="max-w-container mx-auto px-6 md:px-12 relative py-16 md:py-20">
            <div className="max-w-3xl">
              {(badge || HeroIcon) && (
                <div className="flex items-center gap-2 mb-4">
                  {HeroIcon && (
                    <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                      <HeroIcon className="w-5 h-5 text-accent" />
                    </div>
                  )}
                  {badge && (
                    <span className="text-accent text-sm font-medium uppercase tracking-wider">
                      {badge}
                    </span>
                  )}
                </div>
              )}
              {title && (
                <h1 className="text-text text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-secondary text-lg leading-relaxed max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      <main>{children}</main>
    </div>
  );
};
