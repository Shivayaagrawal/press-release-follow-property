import type { TickerItem } from "@/lib/articles";

interface TickerBarProps {
  items: TickerItem[];
}

export default function TickerBar({ items }: TickerBarProps) {
  const loop = [...items, ...items];

  return (
    <div className="ticker-outer">
      <div className="ticker-track">
        {loop.map((item, i) => (
          <span key={`${item.code}-${item.area}-${i}`}>
            <span className="t-gold">{item.code}</span> {item.area}&nbsp;₹
            {item.rate.toLocaleString("en-IN")}/sqft&nbsp;
            <span className={item.dir === "up" ? "t-up" : "t-dn"}>
              {item.dir === "up" ? "⇧" : "⇩"} {item.change}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
