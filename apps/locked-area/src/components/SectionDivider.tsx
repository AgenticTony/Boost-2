export const SectionDivider = ({ label }: { label: string }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="h-px flex-1 bg-border" />
    <span className="text-muted text-sm font-medium uppercase tracking-wider">{label}</span>
    <div className="h-px flex-1 bg-border" />
  </div>
);
