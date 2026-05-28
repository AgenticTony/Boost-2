import type { NewsArticle, TimelineEntry, Resource, OpenPosition, TeamMember } from "@/types";
import type { RegistrationFormData, ContactFormData } from "@/types/forms";

/**
 * Swappable API adapter - switch implementation without touching pages.
 * Mock adapter is active now; Hygraph adapter replaces it in Sprint 3.
 */
export interface ApiAdapter {
  fetchNews(): Promise<NewsArticle[]>;
  fetchNewsBySlug(slug: string): Promise<NewsArticle | null>;
  fetchTimeline(): Promise<TimelineEntry[]>;
  fetchResources(): Promise<Resource[]>;
  fetchResourcesByCategory(category: string): Promise<Resource[]>;
  fetchOpenPositions(): Promise<OpenPosition[]>;
  fetchTeamMembers(): Promise<TeamMember[]>;
  // `delivered` is true only when the submission reached a real backend.
  // Until one exists, adapters return delivered=false so the UI can show an
  // honest "not actually sent" notice instead of a misleading success.
  submitRegistration(
    data: RegistrationFormData,
  ): Promise<{ success: boolean; delivered: boolean }>;
  submitContact(
    data: ContactFormData,
  ): Promise<{ success: boolean; delivered: boolean }>;
}
