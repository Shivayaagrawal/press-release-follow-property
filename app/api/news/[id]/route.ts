import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const doc = await Article.findById(params.id).lean();

    if (!doc || Array.isArray(doc)) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error) {
    console.error("GET /api/news/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
  }
}
