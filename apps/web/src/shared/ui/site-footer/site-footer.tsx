import type { ReactNode } from "react";

export type SiteFooterProps = {
  brand: ReactNode;
  copyright: ReactNode;
  className?: string;
  adaptive?: boolean;
};

export function SiteFooter({
  brand,
  copyright,
  className = "",
  adaptive,
}: SiteFooterProps) {
  return (
    <footer className={`border-border w-full border-t ${className}`}>
      <div
        className={
          adaptive
            ? "mx-auto flex max-w-[1120px] flex-col items-start justify-between pt-[calc(var(--space-24)-1px)] pb-[var(--space-24)] min-[600px]:flex-row min-[600px]:items-center"
            : "mx-auto flex max-w-[1120px] items-center justify-between pt-[calc(var(--space-24)-1px)] pb-[var(--space-24)]"
        }
      >
        <div className="text-foreground [font:var(--type-label)]">{brand}</div>
        <div className="text-muted-foreground [font:var(--type-caption)]">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
