import type { ReactNode } from "react";

export type SiteFooterProps = {
  brand: ReactNode;
  copyright: ReactNode;
};

export function SiteFooter({ brand, copyright }: SiteFooterProps) {
  return (
    <footer className="border-border w-full border-t">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between pt-[calc(var(--space-24)-1px)] pb-[var(--space-24)]">
        <div className="text-foreground [font:var(--type-label)]">{brand}</div>
        <div className="text-muted-foreground [font:var(--type-caption)]">
          {copyright}
        </div>
      </div>
    </footer>
  );
}
