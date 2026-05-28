import { LucideIcon } from "lucide-react";

interface FutureFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  status: string;
}

export const FutureFeatures = ({ title, subtitle, features }: { title: string; subtitle: string; features: FutureFeature[] }) => (
  <section className="max-w-container mx-auto px-6 md:px-12 py-16">
    <div className="text-center mb-10">
      <span className="text-accent text-sm font-medium uppercase tracking-wider">Vägvisare</span>
      <h2 className="text-text text-3xl font-bold mt-2 mb-4">{title}</h2>
      <p className="text-secondary max-w-2xl mx-auto">{subtitle}</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
      {features.map((feature, index) => (
        <div key={index} className="bg-surface-dark/50 border border border-dashed rounded-xl p-5 opacity-70 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-boost-red/10 rounded-lg flex items-center justify-center">
              <feature.icon className="w-5 h-5 text-boost-red-bright" />
            </div>
            <div>
              <h4 className="text-text font-medium text-sm">{feature.title}</h4>
              <span className="text-xs text-muted">{feature.status}</span>
            </div>
          </div>
          <p className="text-secondary text-xs leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);
