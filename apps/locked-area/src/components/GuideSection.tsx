import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface GuideStep {
  title: string;
  description: string;
}

export const GuideSection = ({ title, subtitle, steps }: { title: string; subtitle: string; steps: GuideStep[] }) => {
  const [openStep, setOpenStep] = useState(1);

  return (
    <section className="bg-surface-dark/5 py-16 border-t border-border">
      <div className="container-page">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-brand-navy text-sm font-medium uppercase tracking-wider">Guide</span>
            <h2 className="text-text text-3xl font-bold mt-2 mb-4">{title}</h2>
            <p className="text-text-muted">{subtitle}</p>
          </div>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={index} className="border border-border rounded-card overflow-hidden">
                <button
                  onClick={() => setOpenStep(openStep === index + 1 ? 0 : index + 1)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-dark/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-brand-navy text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-text font-medium">{step.title}</span>
                  </div>
                  {openStep === index + 1 ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                {openStep === index + 1 && (
                  <div className="px-5 pb-5">
                    <p className="text-text-muted text-sm leading-relaxed ml-12">{step.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
