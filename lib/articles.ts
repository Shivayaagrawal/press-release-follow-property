import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import type { Article as ArticleType, RateSnapshot, City } from "@/types/article";
import { FALLBACK_ARTICLES, FALLBACK_RATES, TICKER_ITEMS } from "@/lib/data";

export interface TickerItem {
  code: string;
  area: string;
  rate: number;
  change: number;
  dir: "up" | "down";
}

const CITY_CODES: Record<string, string> = {
  Gurgaon: "GGN",
  Noida: "NOI",
  Delhi: "DEL",
  NCR: "NCR",
};

function articleToTickerItem(
  city: City,
  priceData: NonNullable<ArticleType["priceData"]>
): TickerItem {
  return {
    code: CITY_CODES[city] ?? "NCR",
    area: priceData.area,
    rate: priceData.ratePerSqft,
    change: priceData.changePercent,
    dir: priceData.changeDirection,
  };
}

export async function getArticles(filters?: {
  city?: string;
  type?: string;
}): Promise<ArticleType[]> {
  if (!process.env.MONGODB_URI) {
    return filterFallbackArticles(filters);
  }

  try {
    await connectDB();
    const filter: Record<string, string> = {};
    if (filters?.city && filters.city !== "All Cities") {
      filter.city = filters.city;
    }
    if (filters?.type && filters.type !== "All") {
      filter.type = filters.type === "Govt & Infra" ? "Govt" : filters.type;
    }

    const docs = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .limit(20)
      .lean();

    if (docs.length === 0) return filterFallbackArticles(filters);

    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title as string,
      body: d.body as string,
      excerpt: (d.excerpt as string) ?? undefined,
      city: d.city as ArticleType["city"],
      type: d.type as ArticleType["type"],
      tags: (d.tags as string[]) ?? [],
      isFeatured: Boolean(d.isFeatured),
      isBreaking: Boolean(d.isBreaking),
      author: (d.author as string) ?? "Property Desk",
      publishedAt: (d.publishedAt as Date).toISOString(),
      priceData: d.priceData as ArticleType["priceData"],
    }));
  } catch {
    return filterFallbackArticles(filters);
  }
}

function filterFallbackArticles(filters?: {
  city?: string;
  type?: string;
}): ArticleType[] {
  let articles = [...FALLBACK_ARTICLES];
  if (filters?.city && filters.city !== "All Cities") {
    articles = articles.filter((a) => a.city === filters.city);
  }
  if (filters?.type && filters.type !== "All") {
    const type = filters.type === "Govt & Infra" ? "Govt" : filters.type;
    articles = articles.filter((a) => a.type === type);
  }
  return articles;
}

export async function getRateSnapshots(): Promise<RateSnapshot[]> {
  if (!process.env.MONGODB_URI) return FALLBACK_RATES;

  try {
    await connectDB();
    const withRates = await Article.find({ priceData: { $exists: true } })
      .sort({ publishedAt: -1 })
      .limit(10)
      .lean();

    const byCity = new Map<string, RateSnapshot>();
    for (const doc of withRates) {
      const city = doc.city as RateSnapshot["city"];
      if (!byCity.has(city) && doc.priceData) {
        byCity.set(city, {
          city,
          area: doc.priceData.area,
          ratePerSqft: doc.priceData.ratePerSqft,
          changePercent: doc.priceData.changePercent,
          changeDirection: doc.priceData.changeDirection,
        });
      }
    }

    const order: RateSnapshot["city"][] = ["Gurgaon", "Noida", "Delhi"];
    const rates = order
      .map((c) => byCity.get(c))
      .filter(Boolean) as RateSnapshot[];

    return rates.length >= 3 ? rates : FALLBACK_RATES;
  } catch {
    return FALLBACK_RATES;
  }
}

export async function getBreakingHeadlines(): Promise<string[]> {
  if (!process.env.MONGODB_URI) {
    return FALLBACK_ARTICLES.filter((a) => a.isBreaking).map((a) => a.title);
  }

  try {
    await connectDB();
    const docs = await Article.find({ isBreaking: true })
      .sort({ publishedAt: -1 })
      .limit(5)
      .lean();
    if (docs.length === 0) {
      return FALLBACK_ARTICLES.filter((a) => a.isBreaking).map((a) => a.title);
    }
    return docs.map((d) => d.title as string);
  } catch {
    return FALLBACK_ARTICLES.filter((a) => a.isBreaking).map((a) => a.title);
  }
}

export async function getTickerItems(): Promise<TickerItem[]> {
  const fromFallback = (): TickerItem[] => {
    const fromArticles = FALLBACK_ARTICLES.filter((a) => a.priceData).map((a) =>
      articleToTickerItem(a.city, a.priceData!)
    );
    return fromArticles.length >= 3 ? fromArticles : TICKER_ITEMS;
  };

  if (!process.env.MONGODB_URI) return fromFallback();

  try {
    await connectDB();
    const docs = await Article.find({ "priceData.ratePerSqft": { $exists: true } })
      .sort({ publishedAt: -1 })
      .limit(12)
      .lean();

    if (docs.length === 0) return fromFallback();

    const items: TickerItem[] = [];
    const seen = new Set<string>();

    for (const doc of docs) {
      if (!doc.priceData) continue;
      const key = `${doc.city}-${doc.priceData.area}`;
      if (seen.has(key)) continue;
      seen.add(key);
      items.push(
        articleToTickerItem(
          doc.city as City,
          doc.priceData as NonNullable<ArticleType["priceData"]>
        )
      );
    }

    return items.length >= 3 ? items : fromFallback();
  } catch {
    return fromFallback();
  }
}
