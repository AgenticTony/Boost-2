export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  publishedAt: string;
  category: string;
  excerpt: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  author?: string;
}

export interface TimelineEntry {
  id: string;
  year: number;
  projectName: string;
  description: string;
  funder?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  isPublic: boolean;
}

export interface OpenPosition {
  id: string;
  title: string;
  slug: string;
  preview: string;
  body: string;
  imageUrl?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  email?: string;
  imageUrl?: string;
}
