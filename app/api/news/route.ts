import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { verifyApiKey, unauthorizedResponse } from "@/lib/auth";
import { validateCreatePayload } from "@/lib/validate-article";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

function serializeArticle(doc: Record<string, unknown>) {
  return {
    _id: String(doc._id),
    title: doc.title,
    body: doc.body,
    excerpt: doc.excerpt ?? null,
    city: doc.city,
    type: doc.type,
    tags: doc.tags ?? [],
    isFeatured: doc.isFeatured ?? false,
    isBreaking: doc.isBreaking ?? false,
    author: doc.author ?? "Property Desk",
    publishedAt: (doc.publishedAt as Date).toISOString(),
    priceData: doc.priceData ?? null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const city = searchParams.get("city") ?? undefined;
    const type = searchParams.get("type") ?? undefined;
    const featured = searchParams.get("featured");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);

    if (!process.env.MONGODB_URI) {
      let articles = await getArticles({
        city: city ?? "All Cities",
        type: type ?? "All",
      });
      if (featured === "true") {
        articles = articles.filter((a) => a.isFeatured);
      }
      return NextResponse.json({
        articles: articles.slice(0, limit),
        count: Math.min(articles.length, limit),
        source: "fallback",
      });
    }

    await connectDB();

    const filter: Record<string, unknown> = {};
    if (city && city !== "All" && city !== "All Cities") filter.city = city;
    if (type && type !== "All") {
      if (type === "Govt & Infra") filter.type = "Govt";
      else filter.type = type;
    }
    if (featured === "true") filter.isFeatured = true;

    const docs = await Article.find(filter)
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      articles: docs.map((d) => serializeArticle(d as Record<string, unknown>)),
      count: docs.length,
      source: "mongodb",
    });
  } catch (error) {
    console.error("GET /api/news error:", error);
    const articles = await getArticles({});
    return NextResponse.json({
      articles: articles.slice(0, 20),
      count: articles.length,
      source: "fallback",
      error: "Database unavailable — serving cached edition",
    });
  }
}

export async function POST(request: NextRequest) {
  if (!verifyApiKey(request)) {
    return unauthorizedResponse();
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { error: "MONGODB_URI is not configured" },
      { status: 503 }
    );
  }

  try {
    const json: unknown = await request.json();
    const validated = validateCreatePayload(json);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    await connectDB();

    const doc = await Article.create({
      ...validated.data,
      publishedAt: validated.data.publishedAt
        ? new Date(validated.data.publishedAt)
        : new Date(),
    });

    return NextResponse.json(
      serializeArticle(doc.toObject() as Record<string, unknown>),
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/news error:", error);
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 });
  }
}
