import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Article } from "@/models/Article";
import { FALLBACK_ARTICLES } from "@/lib/data";
import { formatAge, formatDate, tagClass } from "@/types/article";
import type { Article as ArticleType } from "@/types/article";
import PaperShell, { EditionFooter } from "@/components/PaperShell";

async function getArticle(id: string): Promise<ArticleType | null> {
  const fallback = FALLBACK_ARTICLES.find((a) => a._id === id);
  if (!process.env.MONGODB_URI) return fallback ?? null;

  try {
    await connectDB();
    const doc = await Article.findById(id).lean();
    if (!doc || Array.isArray(doc)) return fallback ?? null;
    return {
      _id: String(doc._id),
      title: doc.title as string,
      body: doc.body as string,
      excerpt: (doc.excerpt as string) ?? undefined,
      city: doc.city as ArticleType["city"],
      type: doc.type as ArticleType["type"],
      tags: (doc.tags as string[]) ?? [],
      isFeatured: Boolean(doc.isFeatured),
      isBreaking: Boolean(doc.isBreaking),
      author: (doc.author as string) ?? "Property Desk",
      publishedAt: (doc.publishedAt as Date).toISOString(),
      priceData: doc.priceData as ArticleType["priceData"],
    };
  } catch {
    return fallback ?? null;
  }
}

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const article = await getArticle(params.id);
  if (!article) notFound();

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextEdition = tomorrow.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <PaperShell footer={<EditionFooter nextEdition={nextEdition} />}>
      <div style={{ marginBottom: "1rem", borderBottom: "1px solid #c0ae84", paddingBottom: "0.5rem" }}>
        <Link href="/" className="act-btn" style={{ marginTop: 0 }}>
          ← Back to edition
        </Link>
      </div>

      <article className="card feat">
        <div className="eyebrow">
          {[article.city, article.type, ...article.tags]
            .filter((v, i, arr) => arr.indexOf(v) === i)
            .slice(0, 5)
            .map((tag) => (
              <span key={tag} className={`tag ${tagClass(tag)}`}>
                {tag}
              </span>
            ))}
          <span className="age">
            {formatAge(article.publishedAt)} · {formatDate()}
          </span>
        </div>

        <h1 className="hl hl-lg">{article.title}</h1>
        <div className="byline">{article.author}</div>

        {article.priceData && (
          <div className="rate-inline">
            <div className="rc-city">
              {article.city} · {article.priceData.area}
            </div>
            <div className="rc-num">
              ₹{article.priceData.ratePerSqft.toLocaleString("en-IN")}/sq.ft
            </div>
            <div className={`rc-chg ${article.priceData.changeDirection === "up" ? "up" : "dn"}`}>
              {article.priceData.changeDirection === "up" ? "⇧" : "⇩"}{" "}
              {article.priceData.changePercent}% this month
            </div>
          </div>
        )}

        {article.body.split("\n\n").map((para, i) => (
          <p key={i} className="body-text" style={{ fontStyle: "normal", marginBottom: "1rem" }}>
            {para}
          </p>
        ))}
      </article>
    </PaperShell>
  );
}
