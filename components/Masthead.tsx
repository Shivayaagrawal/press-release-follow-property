import { formatDate } from "@/types/article";

export default function Masthead() {
  return (
    <div className="masthead">
      <div className="mast-top">
        <span>Est. 2024 · NCR Property Intelligence</span>
        <span>Vol. XII · No. 47 · {formatDate()}</span>
        <span>Delhi · Gurgaon · Noida</span>
      </div>
      <div className="paper-name">Follow Property</div>
      <div className="paper-tagline">
        The Independent Voice of NCR Real Estate — Delhi · Gurgaon · Noida
      </div>
    </div>
  );
}
