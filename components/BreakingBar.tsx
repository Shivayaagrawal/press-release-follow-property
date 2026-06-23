import { BREAKING_HEADLINES } from "@/lib/data";

interface BreakingBarProps {
  headlines?: string[];
}

export default function BreakingBar({ headlines }: BreakingBarProps) {
  const items = headlines?.length ? headlines : BREAKING_HEADLINES;
  const text = items.join(" · ");

  return (
    <div className="breaking">
      <span className="breaking-label">Breaking</span>
      <span className="dot" />
      <span className="breaking-text">{text}</span>
      <span className="dot" />
    </div>
  );
}
