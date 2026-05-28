import { Quote } from "lucide-react";
import { PromiseIcons } from "@/components/sections/promise-icons";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

/** BEAT 3: Promise / Quote - Calm breather */
export function PromiseSection() {
  return (
    <ScrollReveal>
      <section className="py-16 md:py-24 bg-surface">
        <div className="container-page">
          <div className="max-w-3xl mx-auto text-center">
            <Quote className="h-10 w-10 text-brand-red/20 mx-auto mb-6" />
            <blockquote className="text-2xl md:text-4xl lg:text-[2.75rem] font-display font-extrabold text-text leading-snug mb-8">
              Varje ung människa bär på en{" "}
              <span className="text-brand-red">unik potential</span> - det är
              vår uppgift att hjälpa dem att hitta den
            </blockquote>
            <div className="flex items-center justify-center gap-3 mb-12">
              <div className="h-px w-12 bg-brand-navy/20" />
              <p className="text-sm font-body font-medium text-text-muted">
                Våra löften
              </p>
              <div className="h-px w-12 bg-brand-navy/20" />
            </div>
            <PromiseIcons />
          </div>
        </div>
      </section>
    </ScrollReveal>
  );
}
