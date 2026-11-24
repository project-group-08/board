import type { ReactNode } from "react";

export type SiteHeaderProps = {
  brand: ReactNode;
  navigation: ReactNode;
  navigationLabel: string;
  themeAction: ReactNode;
  actions: ReactNode;
};

export function SiteHeader({
  brand,
  navigation,
  navigationLabel,
  themeAction,
  actions,
}: SiteHeaderProps) {
  return (
    <header className="border-border bg-background h-13 box-border flex w-full mx-auto max-w-[1120px] min-w-0 items-center rounded-[var(--radius-lg)] border py-[calc(var(--space-8)-1px)] pr-[calc(var(--space-8)-1px)] pl-[calc(var(--space-16)-1px)] shadow-[var(--shadow-floating)] relative">
      <div className="flex shrink-0 items-center gap-[var(--space-24)]">
        <div>{brand}</div>
        <span aria-hidden="true" className="bg-border h-[20px] w-px shrink-0" />
        <nav aria-label={navigationLabel}>{navigation}</nav>
      </div>
      <div className="flex ml-auto shrink-0 items-center">
        {themeAction}
        <span
          aria-hidden="true"
          className="bg-border ml-[var(--space-8)] h-[20px] w-px shrink-0"
        />
        {actions}
      </div>
    </header>
  );
}
