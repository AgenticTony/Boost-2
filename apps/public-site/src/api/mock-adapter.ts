import type { ApiAdapter } from "./adapter";
import { mockNewsArticles, mockTimeline, mockResources } from "./mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function createMockAdapter(): ApiAdapter {
  return {
    async fetchNews() {
      await delay(100);
      return mockNewsArticles;
    },

    async fetchNewsBySlug(slug) {
      await delay(100);
      return mockNewsArticles.find((a) => a.slug === slug) ?? null;
    },

    async fetchTimeline() {
      await delay(100);
      return mockTimeline;
    },

    async fetchResources() {
      await delay(100);
      return mockResources;
    },

    async fetchResourcesByCategory(category) {
      await delay(100);
      if (category === "alla") return mockResources;
      return mockResources.filter((r) => r.category === category);
    },

    async fetchOpenPositions() {
      await delay(100);
      return [];
    },

    async fetchTeamMembers() {
      await delay(100);
      return [];
    },

    async submitRegistration(_data) {
      await delay(800);
      // No backend yet: success keeps the happy path, delivered=false tells the
      // UI this wasn't actually sent anywhere.
      return { success: true, delivered: false };
    },

    async submitContact(data) {
      // Real submission even in mock mode - the contact form should always send.
      // (Other endpoints stay mock while Hygraph has no data.) The worker URL is
      // a public browser endpoint; the production default is baked in here and
      // VITE_CONTACT_WORKER_URL overrides it for staging/dev.
      const url =
        import.meta.env.VITE_CONTACT_WORKER_URL ||
        "https://contact-worker.moh17670s.workers.dev";
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          }),
        });
        if (!res.ok) return { success: false, delivered: false };
        const json = (await res.json()) as { success?: boolean };
        const delivered = json.success === true;
        return { success: delivered, delivered };
      } catch {
        return { success: false, delivered: false };
      }
    },
  };
}
