import { Suspense } from "react";
import Masthead from "@/components/Masthead";
import TickerBar from "@/components/TickerBar";
import FilterBar from "@/components/FilterBar";
import BreakingBar from "@/components/BreakingBar";
import RateCards from "@/components/RateCards";
import ArticleCard from "@/components/ArticleCard";
import NewsRefresh from "@/components/NewsRefresh";
import PaperShell, { EditionFooter } from "@/components/PaperShell";
import {
  getArticles,
  getBreakingHeadlines,
  getRateSnapshots,
  getTickerItems,
} from "@/lib/articles";

export const dynamic = "force-dynamic";

interface HomeProps {
  searchParams: { city?: string; type?: string };
}

export default async function Home({ searchParams }: HomeProps) {
  const city = searchParams.city ?? "All Cities";
  const type = searchParams.type ?? "All";

  const [articles, rates, breaking, tickerItems] = await Promise.all([
    getArticles({ city, type }),
    getRateSnapshots(),
    getBreakingHeadlines(),
    getTickerItems(),
  ]);

  const featured = articles.find((a) => a.isFeatured) ?? articles[0];
  const rest = articles.filter((a) => a._id !== featured?._id);
  const leftMid = rest.slice(0, 2);
  const leftBottom = rest.slice(2, 4);
  const sidebar = rest.slice(4, 9);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextEdition = tomorrow.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <NewsRefresh />
      <PaperShell footer={<EditionFooter nextEdition={nextEdition} />}>
        <Masthead />
        <TickerBar items={tickerItems} />

        <Suspense fallback={<div className="filter-section" style={{ minHeight: 40 }} />}>
          <FilterBar />
        </Suspense>

        <BreakingBar headlines={breaking} />
        <RateCards rates={rates} />

        {articles.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "2rem" }}>
            <div className="hl hl-md">No stories match these filters.</div>
            <div className="body-text">Try selecting All Cities and All topics.</div>
          </div>
        ) : (
          <div className="main-grid">
            <div className="col-left">
              {featured && <ArticleCard article={featured} size="lg" featured />}
              {leftMid.length > 0 && (
                <div className="two-col">
                  {leftMid.map((a) => (
                    <ArticleCard key={a._id} article={a} size="md" />
                  ))}
                </div>
              )}
              {leftBottom.map((a) => (
                <ArticleCard key={a._id} article={a} size="md" />
              ))}
            </div>

            <div className="col-right">
              <div className="section-head">
                <hr />
                <span>Latest Reports</span>
                <hr />
              </div>
              {sidebar.map((a) => (
                <ArticleCard key={a._id} article={a} size="sm" />
              ))}
            </div>
          </div>
        )}
      </PaperShell>
    </>
  );
}
