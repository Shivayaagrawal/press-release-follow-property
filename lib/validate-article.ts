import type {
  ArticleType,
  ChangeDirection,
  City,
  PriceData,
} from "@/types/article";

export interface CreateArticlePayload {
  title: string;
  body: string;
  excerpt?: string;
  city: City;
  type: ArticleType;
  tags?: string[];
  isFeatured?: boolean;
  isBreaking?: boolean;
  author?: string;
  publishedAt?: string;
  priceData?: PriceData;
}

const CITIES: City[] = ["Delhi", "Gurgaon", "Noida", "NCR"];
const TYPES: ArticleType[] = [
  "Residential",
  "Commercial",
  "Govt",
  "Metro",
  "Rates",
  "Buyers",
  "Sellers",
  "Investors",
];

export function validateCreatePayload(
  body: unknown
): { ok: true; data: CreateArticlePayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be JSON" };
  }

  const b = body as Record<string, unknown>;

  if (typeof b.title !== "string" || !b.title.trim()) {
    return { ok: false, error: "title is required" };
  }
  if (typeof b.body !== "string" || !b.body.trim()) {
    return { ok: false, error: "body is required" };
  }
  if (typeof b.city !== "string" || !CITIES.includes(b.city as City)) {
    return { ok: false, error: `city must be one of: ${CITIES.join(", ")}` };
  }
  if (typeof b.type !== "string" || !TYPES.includes(b.type as ArticleType)) {
    return { ok: false, error: `type must be one of: ${TYPES.join(", ")}` };
  }

  let tags: string[] = [];
  if (b.tags !== undefined) {
    if (!Array.isArray(b.tags)) {
      return { ok: false, error: "tags must be an array of strings" };
    }
    tags = b.tags.filter((t): t is string => typeof t === "string");
  }

  let priceData: PriceData | undefined;
  if (b.priceData !== undefined && b.priceData !== null) {
    const pd = b.priceData as Record<string, unknown>;
    if (
      typeof pd.area !== "string" ||
      typeof pd.ratePerSqft !== "number" ||
      typeof pd.changePercent !== "number" ||
      (pd.changeDirection !== "up" && pd.changeDirection !== "down")
    ) {
      return {
        ok: false,
        error: "priceData requires area, ratePerSqft, changePercent, changeDirection (up|down)",
      };
    }
    priceData = {
      area: pd.area,
      ratePerSqft: pd.ratePerSqft,
      changePercent: pd.changePercent,
      changeDirection: pd.changeDirection as ChangeDirection,
    };
  }

  return {
    ok: true,
    data: {
      title: b.title.trim(),
      body: b.body.trim(),
      excerpt: typeof b.excerpt === "string" ? b.excerpt.trim() : undefined,
      city: b.city as City,
      type: b.type as ArticleType,
      tags,
      isFeatured: Boolean(b.isFeatured),
      isBreaking: Boolean(b.isBreaking),
      author: typeof b.author === "string" ? b.author.trim() : "Property Desk",
      publishedAt:
        typeof b.publishedAt === "string" ? b.publishedAt : undefined,
      priceData,
    },
  };
}
