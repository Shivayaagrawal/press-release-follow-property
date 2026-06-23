"use client";

import { useState } from "react";
import Link from "next/link";
import { ARTICLE_TYPES, CITIES } from "@/types/article";
import type { ArticleType, City } from "@/types/article";

const STORAGE_KEY = "follow-property-admin-key";

export default function AdminForm() {
  const [apiKey, setApiKey] = useState("");
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [city, setCity] = useState<City>("Noida");
  const [type, setType] = useState<ArticleType>("Govt");
  const [tags, setTags] = useState("");
  const [author, setAuthor] = useState("Property Desk");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [rateArea, setRateArea] = useState("");
  const [ratePerSqft, setRatePerSqft] = useState("");
  const [changePercent, setChangePercent] = useState("");
  const [changeDirection, setChangeDirection] = useState<"up" | "down">("up");

  function loadKey() {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) setApiKey(saved);
  }

  function saveKey() {
    sessionStorage.setItem(STORAGE_KEY, apiKey);
    setStatus({ type: "ok", msg: "API key saved for this session." });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const key = apiKey || sessionStorage.getItem(STORAGE_KEY) || "";
    if (!key) {
      setStatus({ type: "err", msg: "Enter your admin API key first." });
      setLoading(false);
      return;
    }

    const payload: Record<string, unknown> = {
      title,
      body,
      excerpt: excerpt || undefined,
      city,
      type,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author,
      isFeatured,
      isBreaking,
    };

    if (rateArea && ratePerSqft) {
      payload.priceData = {
        area: rateArea,
        ratePerSqft: parseFloat(ratePerSqft),
        changePercent: parseFloat(changePercent) || 0,
        changeDirection,
      };
    }

    try {
      const res = await fetch("/api/news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
        },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; _id?: string };

      if (!res.ok) {
        setStatus({ type: "err", msg: data.error ?? "Publish failed" });
      } else {
        setStatus({
          type: "ok",
          msg: `Published. Article ID: ${data._id?.slice(0, 8)}…`,
        });
        setTitle("");
        setBody("");
        setExcerpt("");
        setTags("");
        setRateArea("");
        setRatePerSqft("");
        setChangePercent("");
      }
    } catch {
      setStatus({ type: "err", msg: "Network error — could not reach API." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-panel">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-playfair text-xl font-black text-ink">Editorial Desk</h2>
          <p className="text-[11px] italic text-[#7a6848]">
            Submit press releases to MongoDB via POST /api/news
          </p>
        </div>
        <Link href="/" className="act-btn mt-0 self-start">
          ← Front page
        </Link>
      </div>

      <div className="card mb-4">
        <label className="admin-label" htmlFor="apiKey">
          Admin API Key
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="apiKey"
            type="password"
            className="admin-input flex-1"
            placeholder="Set ADMIN_API_KEY from .env.local"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            onFocus={loadKey}
          />
          <button type="button" className="admin-btn" onClick={saveKey}>
            Save key
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`mb-4 border px-3 py-2 text-[11px] ${
            status.type === "ok" ?
              "border-forest bg-[#e8f0e8] text-forest"
            : "border-terracotta bg-[#f5ebe5] text-terracotta"
          }`}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="card">
          <label className="admin-label" htmlFor="title">
            Headline *
          </label>
          <input
            id="title"
            required
            className="admin-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="admin-label mt-3" htmlFor="excerpt">
            Deck / Excerpt
          </label>
          <input
            id="excerpt"
            className="admin-input"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <label className="admin-label mt-3" htmlFor="body">
            Body *
          </label>
          <textarea
            id="body"
            required
            rows={8}
            className="admin-input admin-textarea"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          <label className="admin-label mt-3" htmlFor="author">
            Byline
          </label>
          <input
            id="author"
            className="admin-input"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="card">
            <label className="admin-label" htmlFor="city">
              City *
            </label>
            <select
              id="city"
              className="admin-input"
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
              <option value="NCR">NCR</option>
            </select>

            <label className="admin-label mt-3" htmlFor="type">
              Type *
            </label>
            <select
              id="type"
              className="admin-input"
              value={type}
              onChange={(e) => setType(e.target.value as ArticleType)}
            >
              {ARTICLE_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <label className="admin-label mt-3" htmlFor="tags">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              className="admin-input"
              placeholder="Noida, Metro, Buyers"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <div className="mt-4 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-[11px] text-ink">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Featured story
              </label>
              <label className="flex items-center gap-2 text-[11px] text-ink">
                <input
                  type="checkbox"
                  checked={isBreaking}
                  onChange={(e) => setIsBreaking(e.target.checked)}
                />
                Breaking ticker
              </label>
            </div>
          </div>

          <div className="card">
            <p className="admin-label mb-2">Optional rate data (feeds ticker & rate cards)</p>
            <label className="admin-label" htmlFor="rateArea">
              Micro-market / Area
            </label>
            <input
              id="rateArea"
              className="admin-input"
              placeholder="Sector 150"
              value={rateArea}
              onChange={(e) => setRateArea(e.target.value)}
            />
            <label className="admin-label mt-3" htmlFor="ratePerSqft">
              Rate per sq.ft (₹)
            </label>
            <input
              id="ratePerSqft"
              type="number"
              className="admin-input"
              value={ratePerSqft}
              onChange={(e) => setRatePerSqft(e.target.value)}
            />
            <label className="admin-label mt-3" htmlFor="changePercent">
              Change %
            </label>
            <input
              id="changePercent"
              type="number"
              step="0.1"
              className="admin-input"
              value={changePercent}
              onChange={(e) => setChangePercent(e.target.value)}
            />
            <label className="admin-label mt-3" htmlFor="changeDir">
              Direction
            </label>
            <select
              id="changeDir"
              className="admin-input"
              value={changeDirection}
              onChange={(e) => setChangeDirection(e.target.value as "up" | "down")}
            >
              <option value="up">Up</option>
              <option value="down">Down</option>
            </select>
          </div>
        </div>

        <button type="submit" className="admin-btn admin-btn-primary w-full sm:w-auto" disabled={loading}>
          {loading ? "Publishing…" : "Publish to edition →"}
        </button>
      </form>
    </div>
  );
}
