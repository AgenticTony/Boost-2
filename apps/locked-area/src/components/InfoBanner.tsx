import { Info } from "lucide-react";

export const InfoBanner = ({ title, description }: { title: string; description: string }) => (
  <div className="bg-surface-dark/50 border border border-dashed rounded-xl p-5 flex items-start gap-4">
    <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
    <div>
      <p className="text-text text-sm font-medium mb-1">{title}</p>
      <p className="text-secondary text-sm">{description}</p>
    </div>
  </div>
);
