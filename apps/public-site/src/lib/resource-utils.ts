export const resourceCategoryLabels: Record<string, string> = {
  alla: "Alla",
  normer: "Normer",
  halsa: "Hälsa",
  arbetsmarknad: "Arbetsmarknad",
  handbocker: "Handböcker",
};

export const resourceCategoryColors: Record<string, string> = {
  normer: "bg-purple-100 text-purple-800",
  halsa: "bg-emerald-100 text-emerald-800",
  arbetsmarknad: "bg-amber-100 text-amber-800",
  handbocker: "bg-blue-100 text-blue-800",
};

export const resourceCategoryIcons: Record<string, string> = {
  normer: "MessageSquare",
  halsa: "Heart",
  arbetsmarknad: "Briefcase",
  handbocker: "BookOpen",
};

export function formatFileSize(bytes: number | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileExtension(
  filename: string | undefined,
): string | undefined {
  if (!filename) return undefined;
  const parts = filename.split(".");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : undefined;
}
