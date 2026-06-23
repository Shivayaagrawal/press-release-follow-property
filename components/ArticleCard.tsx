import Link from "next/link";
import type { Article } from "@/types/article";
import { formatAge, tagClass } from "@/types/article";

interface ArticleCardProps {
  article: Article;
  size?: "lg" | "md" | "sm";
  featured?: boolean;
}

interface Action {
  label: string;
  href: string;
}

function getActions(
  article: Article,
  featured: boolean,
  size: "lg" | "md" | "sm"
): Action[] {
  const href = `/article/${article._id}`;

  if (featured) {
    const actions: Action[] = [{ label: "Full analysis →", href }];
    if (article.priceData) {
      actions.push({ label: "Sector price map →", href });
    }
    return actions;
  }

  if (article.type === "Metro") {
    return [{ label: "Compare sector prices →", href }];
  }

  if (size === "sm") {
    if (article.tags.includes("DDA")) {
      return [{ label: "Registration guide →", href }];
    }
    if (article.type === "Sellers") {
      return [{ label: "Compare sectors →", href }];
    }
    return [];
  }

  return [{ label: "Full analysis →", href }];
}

export default function ArticleCard({
  article,
  size = "md",
  featured = false,
}: ArticleCardProps) {
  const hlClass =
    size === "lg" ? "hl-lg" : size === "sm" ? "hl-sm" : "hl-md";
  const text = article.excerpt ?? article.body;
  const maxLen = featured ? 380 : size === "sm" ? 160 : 220;
  const snippet =
    text.length > maxLen ? `${text.slice(0, maxLen).trim()}…` : text;

  const displayTags = [
    article.type === "Govt" ? "Govt" : article.type,
    ...(article.tags.includes("DDA") ? ["DDA"] : []),
    ...(article.tags.includes("RERA") ? ["RERA"] : []),
    ...(article.tags.includes("Film City") ? ["Film City"] : []),
    article.city !== "NCR" ? article.city : null,
    ...article.tags.filter(
      (t) =>
        !["DDA", "RERA", "Film City"].includes(t) &&
        t !== article.city &&
        t !== article.type &&
        t !== "Govt"
    ),
  ]
    .filter(Boolean)
    .slice(0, 4) as string[];

  const actions = getActions(article, featured, size);

  return (
    <article className={`card ${featured ? "feat" : ""}`}>
      <div className="eyebrow">
        {displayTags.map((tag) => (
          <span key={tag} className={`tag ${tagClass(tag)}`}>
            {tag}
          </span>
        ))}
        <span className="age">{formatAge(article.publishedAt)}</span>
      </div>
      <div className={`hl ${hlClass}`}>{article.title}</div>
      <div className="byline">{article.author}</div>
      <div className="body-text">{snippet}</div>
      {actions.length > 0 && (
        <>
          <hr className="rule" />
          {actions.map((action) => (
            <Link key={action.label} href={action.href} className="act-btn">
              {action.label}
            </Link>
          ))}
        </>
      )}
    </article>
  );
}
