/**
 * Domain types — mirror the planned Supabase schema (see docs/TECHNICAL_ARCHITECTURE.md).
 * The public site reads these via the accessors in lib/content.ts. When the Supabase
 * backend lands (Phase 6+), those accessors swap to live queries with no page changes.
 */

export type ImageAsset = {
  src: string;
  alt: string;
  /** true = 3D design visualisation, not a photo of completed work */
  isRender?: boolean;
  width?: number;
  height?: number;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type Faq = {
  question: string;
  answer: string;
  category?: string;
};

export type Service = {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  category: ServiceCategory;
  heroImage?: ImageAsset;
  gallery?: ImageAsset[];
  benefits: string[];
  process?: ProcessStep[];
  faqs?: Faq[];
  /** Real starting price if supplied by client, otherwise undefined → "Get Quote". */
  priceText?: string;
  featured?: boolean;
  published: boolean;
  seoTitle?: string;
  seoDescription?: string;
};

export type ServiceCategory =
  | "Residential Interiors"
  | "Technical Services"
  | "Custom Furniture"
  | "Kitchen & Surface Works"
  | "Safety & Smart Home"
  | "Commercial Interiors";

export type Project = {
  slug: string;
  title: string;
  category: "residential" | "commercial";
  summary: string;
  description: string;
  style?: string;
  scope?: string[];
  materials?: string[];
  /** Only shown when verified with the client. */
  location?: string;
  completionInfo?: string;
  cover: ImageAsset;
  gallery: ImageAsset[];
  featured?: boolean;
  published: boolean;
};

export type Testimonial = {
  clientName: string;
  location?: string;
  serviceType?: string;
  rating: number;
  text: string;
  photo?: ImageAsset;
  published: boolean;
};

export type LeaderRole =
  | "Founder"
  | "Co-Founder / Promoter"
  | "Managing Director"
  | "CEO"
  | "CFO"
  | "Founder and CEO"
  | "Mentor";

export type Leader = {
  name: string;
  roleType: LeaderRole;
  bio: string;
  photo?: ImageAsset;
  expertise?: string[];
  published: boolean;
};

export type ContactDetails = {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: string | null;
  mapsEmbedUrl: string | null;
  workingHours: string | null;
  socials: { label: string; href: string }[];
};

export type WhyChooseItem = { title: string; description: string };
