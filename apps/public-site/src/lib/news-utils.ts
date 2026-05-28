export const categoryLabels: Record<string, string> = {
  alla: "Alla",
  projekt: "Projekt",
  resultat: "Resultat",
  team: "Team",
  samarbeten: "Samarbeten",
};

export const categoryColors: Record<string, string> = {
  projekt: "bg-brand-navy text-white",
  resultat: "bg-brand-red text-white",
  team: "bg-brand-navy text-white",
  samarbeten: "bg-brand-navy text-white",
};

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
