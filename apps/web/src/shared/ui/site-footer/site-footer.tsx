import type { ReactNode } from "react";

export type SiteFooterProps = {
  brand: ReactNode;
  copyright: ReactNode;
};

export function SiteFooter({ brand, copyright }: SiteFooterProps) {
  return (
    <footer className="border-border w-full border-t">
      <div className="mx-auto flex w-[calc(100%-40px)] max-w-[1120px] flex-col items-start justify-between gap-[var(--space-4)] pt-[calc(var(--space-24)-1px)] pb-[var(--space-32)] md:w-[calc(100%-80px)] md:flex-row md:items-center md:gap-[var(--space-24)] md:pb-[var(--space-24)]">
        <div className="text-foreground max-w-full min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)]">
          {brand}
        </div>
        <div className="text-muted-foreground max-w-full min-w-0 [overflow-wrap:anywhere] [font:var(--type-caption)]">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
