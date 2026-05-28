import { GraphQLClient } from "graphql-request";
import type { ApiAdapter } from "./adapter";
import type { NewsArticle, TimelineEntry, Resource, OpenPosition, TeamMember } from "@/types";
import type { RegistrationFormData, ContactFormData } from "@/types/forms";

// ─── Hygraph field mapping ─────────────────────────────────────────
/**
 * These interfaces match the Hygraph schema the backend team is building.
 * Field names use camelCase - backend must match these exactly.
 * If field names differ, only the GraphQL queries below need updating.
 */
interface HygraphNews {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  tag?: { slug: string; name: string } | null;
  preview: string;
  content: { raw: string | RichTextNode } | string;
  coverImage?: { url: string };
}

interface HygraphTimeline {
  id: string;
  year: number;
  projectName: string;
  description: string;
  funder?: string;
  image?: { url: string; altText?: string };
}

interface HygraphResource {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  file?: { url: string; fileName?: string; fileSize?: number };
  fileType?: string;
  isPublic: boolean;
}

interface HygraphOpenPosition {
  id: string;
  title: string;
  slug: string;
  preview: string;
  content: { raw: string };
  image?: { url: string };
}

interface HygraphTeamMember {
  id: string;
  name: string;
  title: string;
  email?: string;
  image?: { url: string };
}

// ─── GraphQL queries ────────────────────────────────────────────────

const NEWS_FRAGMENT = `
fragment NewsFields on NewsItem {
  id
  slug
  title
  publishedAt
  tag { slug name }
  preview
  content { raw }
  coverImage { url }
}`;

const TIMELINE_FRAGMENT = `
fragment TimelineFields on TimelineEntry {
  id
  year
  projectName
  description
  funder
  image { url altText }
}`;

const RESOURCE_FRAGMENT = `
fragment ResourceFields on Resource {
  id
  title
  slug
  category
  description
  file { url fileName fileSize }
  fileType
  isPublic
}`;

// Hygraph's default query stage is DRAFT - pass stage: PUBLISHED or you silently
// fetch draft content (publishedAt null). https://github.com/hygraph/hygraph-examples/issues/266
const FETCH_NEWS = `
${NEWS_FRAGMENT}
query FetchNews {
  newsItems(stage: PUBLISHED, orderBy: publishedAt_DESC) {
    ...NewsFields
  }
}`;

const FETCH_NEWS_BY_SLUG = `
${NEWS_FRAGMENT}
query FetchNewsBySlug($slug: String!) {
  newsItem(stage: PUBLISHED, where: { slug: $slug }) {
    ...NewsFields
  }
}`;

const FETCH_TIMELINE = `
${TIMELINE_FRAGMENT}
query FetchTimeline {
  timelineEntries(stage: PUBLISHED, orderBy: year_ASC) {
    ...TimelineFields
  }
}`;

const FETCH_RESOURCES = `
${RESOURCE_FRAGMENT}
query FetchResources {
  resources(stage: PUBLISHED, where: { isPublic: true }) {
    ...ResourceFields
  }
}`;

const FETCH_RESOURCES_BY_CATEGORY = `
${RESOURCE_FRAGMENT}
query FetchResourcesByCategory($category: String!) {
  resources(stage: PUBLISHED, where: { category: $category, isPublic: true }) {
    ...ResourceFields
  }
}`;

const FETCH_OPEN_POSITIONS = `
query FetchOpenPositions {
  openPositions(stage: PUBLISHED, orderBy: publishedAt_DESC) {
    id
    title
    slug
    preview
    content { raw }
    image { url }
  }
}`;

const FETCH_TEAM_MEMBERS = `
query FetchTeamMembers {
  teamMembers(stage: PUBLISHED) {
    id
    name
    title
    email
    image { url }
  }
}`;

// ─── Mappers ────────────────────────────────────────────────────────

/**
 * Hygraph Rich Text `raw` is a serialized JSON AST (Lexical-style), not plain
 * text. Flatten it to readable plain text - block nodes become paragraphs
 * joined by a blank line, matching the article page's "\n\n" renderer.
 *
 * Falls back to the raw string when it is not valid JSON (e.g. plain-text CMS
 * fields or mock data), so non-rich fields keep working unchanged.
 *
 * Trade-off: preserves text content, not formatting (headings/lists lose
 * structure). Swap for a full rich-text renderer later if the CMS needs it.
 */
interface RichTextNode {
  type?: string;
  text?: string;
  children?: RichTextNode[];
}

function collectText(node: RichTextNode): string {
  if (node.text != null) return node.text;
  if (node.children) return node.children.map(collectText).join("");
  return "";
}

export function richTextToPlainText(raw: string | RichTextNode): string {
  // Hygraph returns RichText `raw` as a PARSED object (the AST), not a string.
  // Older paths / mocks may pass a serialized JSON string - handle both so the
  // article page's `body.split("\n\n")` renderer always gets a string.
  let ast: RichTextNode;
  if (typeof raw === "string") {
    try {
      ast = JSON.parse(raw) as RichTextNode;
    } catch {
      return raw;
    }
  } else if (raw && typeof raw === "object") {
    ast = raw;
  } else {
    return "";
  }
  const blocks = (ast.children ?? [])
    .map(collectText)
    .map((block) => block.trim())
    .filter(Boolean);
  return blocks.length > 0 ? blocks.join("\n\n") : "";
}

function mapBody(content: HygraphNews["content"]): string {
  if (typeof content === "string") return content;
  return content?.raw ? richTextToPlainText(content.raw) : "";
}

export function mapNews(raw: HygraphNews): NewsArticle {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    publishedAt: raw.publishedAt,
    category: raw.tag?.slug ?? "",
    excerpt: raw.preview,
    body: mapBody(raw.content),
    imageUrl: raw.coverImage?.url,
  };
}

export function mapTimeline(raw: HygraphTimeline): TimelineEntry {
  return {
    id: raw.id,
    year: raw.year,
    projectName: raw.projectName,
    description: raw.description,
    funder: raw.funder,
    imageUrl: raw.image?.url,
    imageAlt: raw.image?.altText,
  };
}

export function mapResource(raw: HygraphResource): Resource {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    category: raw.category,
    description: raw.description,
    fileUrl: raw.file?.url,
    fileName: raw.file?.fileName,
    fileSize: raw.file?.fileSize,
    fileType: raw.fileType,
    isPublic: raw.isPublic,
  };
}

export function mapOpenPosition(raw: HygraphOpenPosition): OpenPosition {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    preview: raw.preview,
    body: raw.content?.raw ? richTextToPlainText(raw.content.raw) : raw.preview,
    imageUrl: raw.image?.url,
  };
}

export function mapTeamMember(raw: HygraphTeamMember): TeamMember {
  return {
    id: raw.id,
    name: raw.name,
    title: raw.title,
    email: raw.email,
    imageUrl: raw.image?.url,
  };
}

// ─── Adapter factory ────────────────────────────────────────────────

/**
 * Create a Hygraph-backed API adapter.
 *
 * @param endpoint - Hygraph Content API URL (e.g. https://eu-west-2.cdn.hygraph.com/content/.../master)
 * @param token    - Permanent Auth Token (optional for public content)
 */
export function createHygraphAdapter(
  endpoint: string,
  token?: string,
): ApiAdapter {
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const client = new GraphQLClient(endpoint, { headers });

  return {
    async fetchNews() {
      const data = await client.request<{ newsItems: HygraphNews[] }>(
        FETCH_NEWS,
      );
      return data.newsItems.map(mapNews);
    },

    async fetchNewsBySlug(slug) {
      const data = await client.request<{ newsItem: HygraphNews | null }>(
        FETCH_NEWS_BY_SLUG,
        { slug },
      );
      return data.newsItem ? mapNews(data.newsItem) : null;
    },

    async fetchTimeline() {
      const data = await client.request<{
        timelineEntries: HygraphTimeline[];
      }>(FETCH_TIMELINE);
      return data.timelineEntries.map(mapTimeline);
    },

    async fetchResources() {
      const data = await client.request<{ resources: HygraphResource[] }>(
        FETCH_RESOURCES,
      );
      return data.resources.map(mapResource);
    },

    async fetchResourcesByCategory(category) {
      if (category === "alla") return this.fetchResources();
      const data = await client.request<{ resources: HygraphResource[] }>(
        FETCH_RESOURCES_BY_CATEGORY,
        { category },
      );
      return data.resources.map(mapResource);
    },

    async fetchOpenPositions() {
      const data = await client.request<{
        openPositions: HygraphOpenPosition[];
      }>(FETCH_OPEN_POSITIONS);
      return data.openPositions.map(mapOpenPosition);
    },

    async fetchTeamMembers() {
      const data = await client.request<{
        teamMembers: HygraphTeamMember[];
      }>(FETCH_TEAM_MEMBERS);
      return data.teamMembers.map(mapTeamMember);
    },

    // Forms are not CMS-backed. Registration stays a no-op pending a backend;
    // contact posts to the Cloudflare contact-worker (see VITE_CONTACT_WORKER_URL).
    // delivered=false signals to the UI that nothing was actually sent.
    async submitRegistration(_data: RegistrationFormData) {
      console.warn(
        "[hygraph-adapter] submitRegistration: no backend endpoint yet",
      );
      return { success: true, delivered: false };
    },

    async submitContact(data: ContactFormData) {
      // The contact-worker URL is a public browser endpoint (not a secret), so
      // the production default is baked in here. VITE_CONTACT_WORKER_URL overrides
      // it for staging/dev or if the worker moves (see .env.example).
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
        if (!res.ok) {
          console.error(
            "[hygraph-adapter] submitContact: worker returned",
            res.status,
          );
          return { success: false, delivered: false };
        }
        const json = (await res.json()) as { success?: boolean };
        const delivered = json.success === true;
        return { success: delivered, delivered };
      } catch (err) {
        console.error("[hygraph-adapter] submitContact failed:", err);
        return { success: false, delivered: false };
      }
    },
  };
}
