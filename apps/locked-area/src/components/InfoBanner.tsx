import { Info } from "lucide-react";

export const InfoBanner = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-surface-dark/5 border border-border border-dashed rounded-card p-5 flex items-start gap-4">
    <Info className="w-5 h-5 text-brand-navy flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-text text-sm font-medium mb-1">{title}</p>
      <p className="text-text-muted text-sm">{description}</p>
    </div>
  </div>
);
