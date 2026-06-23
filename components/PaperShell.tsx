import Link from "next/link";

interface PaperShellProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function PaperShell({ children, footer }: PaperShellProps) {
  return (
    <div className="paper-wrap">
      <div className="paper">
        <div className="inner">
          {children}
          {footer}
        </div>
      </div>
    </div>
  );
}

export function EditionFooter({ nextEdition }: { nextEdition: string }) {
  return (
    <div className="footer">
      <span>followproperty.in</span>
      <span>Next edition — {nextEdition}</span>
      <span>
        <Link href="/admin">Desk</Link> · Delhi · Gurgaon · Noida
      </span>
    </div>
  );
}
