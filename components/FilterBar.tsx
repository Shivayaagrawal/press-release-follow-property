"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CITIES = ["All Cities", "Delhi", "Gurgaon", "Noida"];
const TOPICS = [
  "All",
  "Residential",
  "Commercial",
  "Govt & Infra",
  "Metro",
  "Rates",
  "Buyers",
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCity = searchParams.get("city") ?? "All Cities";
  const activeType = searchParams.get("type") ?? "All";

  const setFilter = useCallback(
    (key: "city" | "type", value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (
        (key === "city" && value === "All Cities") ||
        (key === "type" && value === "All")
      ) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.push(qs ? `/?${qs}` : "/", { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <div className="filter-section">
      <span className="f-group-label">City</span>
      {CITIES.map((city) => (
        <button
          key={city}
          type="button"
          className={`fb-city ${activeCity === city ? "active" : ""}`}
          onClick={() => setFilter("city", city)}
        >
          {city}
        </button>
      ))}
      <div className="f-sep" />
      <span className="f-group-label">Topic</span>
      {TOPICS.map((topic) => (
        <button
          key={topic}
          type="button"
          className={`fb-type ${activeType === topic ? "active" : ""}`}
          onClick={() => setFilter("type", topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
}
