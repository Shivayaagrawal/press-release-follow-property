export type City = "Delhi" | "Gurgaon" | "Noida" | "NCR";
export type ArticleType =
  | "Residential"
  | "Commercial"
  | "Govt"
  | "Metro"
  | "Rates"
  | "Buyers"
  | "Sellers"
  | "Investors";

export type ChangeDirection = "up" | "down";

export interface PriceData {
  area: string;
  ratePerSqft: number;
  changePercent: number;
  changeDirection: ChangeDirection;
}

export interface Article {
  _id: string;
  title: string;
  body: string;
  excerpt?: string;
  city: City;
  type: ArticleType;
  tags: string[];
  isFeatured: boolean;
  isBreaking: boolean;
  author: string;
  publishedAt: string;
  priceData?: PriceData;
}

export interface RateSnapshot {
  city: City;
  area: string;
  ratePerSqft: number;
  changePercent: number;
  changeDirection: ChangeDirection;
}

export const CITIES: City[] = ["Delhi", "Gurgaon", "Noida"];
export const ARTICLE_TYPES: ArticleType[] = [
  "Residential",
  "Commercial",
  "Govt",
  "Metro",
  "Rates",
  "Buyers",
  "Sellers",
  "Investors",
];

export function tagClass(tag: string): string {
  const map: Record<string, string> = {
    Delhi: "tag-dark",
    Gurgaon: "tag-dark",
    Noida: "tag-dark",
    NCR: "tag-dark",
    Govt: "tag-govt",
    DDA: "tag-govt",
    RERA: "tag-govt",
    Residential: "tag-res",
    Sellers: "tag-res",
    Commercial: "tag-com",
    "Film City": "tag-com",
    Metro: "tag-metro",
    Rates: "tag-rate",
    Buyers: "tag-buyer",
    Investors: "tag-buyer",
  };
  return map[tag] ?? "tag-dark";
}

export function formatAge(publishedAt: string): string {
  const diff = Date.now() - new Date(publishedAt).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days`;
  return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""}`;
}

export function formatDate(): string {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
