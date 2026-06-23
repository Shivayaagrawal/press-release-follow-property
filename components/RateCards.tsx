import type { RateSnapshot } from "@/types/article";

interface RateCardsProps {
  rates: RateSnapshot[];
}

function cardClass(city: string): string {
  if (city === "Noida") return "rate-card noida";
  if (city === "Delhi") return "rate-card delhi";
  return "rate-card";
}

export default function RateCards({ rates }: RateCardsProps) {
  return (
    <div className="rates-row">
      {rates.map((rate) => (
        <div key={rate.city} className={cardClass(rate.city)}>
          <div className="rc-city">
            {rate.city} · {rate.area}
          </div>
          <div className="rc-num">₹{rate.ratePerSqft.toLocaleString("en-IN")}</div>
          <div className="rc-unit">per sq.ft · June 2026</div>
          <div className={`rc-chg ${rate.changeDirection === "up" ? "up" : "dn"}`}>
            {rate.changeDirection === "up" ? "⇧" : "⇩"} {rate.changePercent}% this month
          </div>
        </div>
      ))}
    </div>
  );
}
