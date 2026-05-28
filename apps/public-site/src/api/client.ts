/**
 * API client - barrel re-export.
 *
 * All functions delegate to the active adapter.
 * Set VITE_USE_HYGRAPH=true to switch from mock to Hygraph.
 * Pages import from here and never touch the adapter directly.
 */

// ─── Adapter singleton ───
import type { ApiAdapter } from "./adapter";
import { createMockAdapter } from "./mock-adapter";
import { createHygraphAdapter } from "./hygraph-adapter";

// Hygraph is on by default in production builds; dev opts in via VITE_USE_HYGRAPH=true.
const useHygraph =
  import.meta.env.PROD || import.meta.env.VITE_USE_HYGRAPH === "true";

// Public, read-only CDN URL (the browser calls it directly). Override via
// VITE_HYGRAPH_ENDPOINT (e.g. a staging project), or set it to "" to force mock data.
const DEFAULT_HYGRAPH_ENDPOINT =
  "https://eu-west-2.cdn.hygraph.com/content/cmq1xlnd2022t07w9jmsfkk5o/master";
const endpoint = import.meta.env.VITE_HYGRAPH_ENDPOINT ?? DEFAULT_HYGRAPH_ENDPOINT;

/**
 * Wrap a primary adapter so any failed read degrades to the fallback adapter,
 * keeping the site contented even if Hygraph is misconfigured or unreachable.
 * Form submissions are not covered (they are no-ops pending a backend in both
 * adapters) and pass straight through to the primary.
 */
export function createResilientAdapter(
  primary: ApiAdapter,
  fallback: ApiAdapter,
): ApiAdapter {
  const withFallback = <T>(
    label: string,
    run: () => Promise<T>,
    fallbackRun: () => Promise<T>,
  ): Promise<T> =>
    run().catch((error) => {
      console.warn(`[api] ${label} failed, falling back to mock data`, error);
      return fallbackRun();
    });

  return {
    fetchNews: () =>
      withFallback("fetchNews", primary.fetchNews, fallback.fetchNews),
    fetchNewsBySlug: (slug) =>
      withFallback(
        "fetchNewsBySlug",
        () => primary.fetchNewsBySlug(slug),
        () => fallback.fetchNewsBySlug(slug),
      ),
    fetchTimeline: () =>
      withFallback(
        "fetchTimeline",
        primary.fetchTimeline,
        fallback.fetchTimeline,
      ),
    fetchResources: () =>
      withFallback(
        "fetchResources",
        primary.fetchResources,
        fallback.fetchResources,
      ),
    fetchResourcesByCategory: (category) =>
      withFallback(
        "fetchResourcesByCategory",
        () => primary.fetchResourcesByCategory(category),
        () => fallback.fetchResourcesByCategory(category),
      ),
    fetchOpenPositions: () =>
      withFallback(
        "fetchOpenPositions",
        primary.fetchOpenPositions,
        fallback.fetchOpenPositions,
      ),
    fetchTeamMembers: () =>
      withFallback(
        "fetchTeamMembers",
        primary.fetchTeamMembers,
        fallback.fetchTeamMembers,
      ),
    submitRegistration: (data) => primary.submitRegistration(data),
    submitContact: (data) => primary.submitContact(data),
  };
}

const adapter: ApiAdapter = (() => {
  if (!useHygraph) return createMockAdapter();
  if (!endpoint) {
    console.warn("[api] VITE_HYGRAPH_ENDPOINT is empty - using mock data");
    return createMockAdapter();
  }
  return createResilientAdapter(
    createHygraphAdapter(endpoint, import.meta.env.VITE_HYGRAPH_TOKEN),
    createMockAdapter(),
  );
})();

// ─── Types ───
export type { NewsArticle, TimelineEntry, Resource, OpenPosition, TeamMember } from "@/types";
export type { RegistrationFormData, ContactFormData } from "@/types/forms";

// ─── Data functions ───

export const fetchNews = () => adapter.fetchNews();
export const fetchNewsBySlug = (slug: string) => adapter.fetchNewsBySlug(slug);
export const fetchTimeline = () => adapter.fetchTimeline();
export const fetchResources = () => adapter.fetchResources();
export const fetchResourcesByCategory = (category: string) =>
  adapter.fetchResourcesByCategory(category);
export const fetchOpenPositions = () => adapter.fetchOpenPositions();
export const fetchTeamMembers = () => adapter.fetchTeamMembers();
export const submitRegistration = (
  data: Parameters<typeof adapter.submitRegistration>[0],
) => adapter.submitRegistration(data);
export const submitContact = (
  data: Parameters<typeof adapter.submitContact>[0],
) => adapter.submitContact(data);

// ─── Category helpers (re-exported for convenience) ───

export { resourceCategoryLabels, formatFileSize } from "@/lib/resource-utils";
