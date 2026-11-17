import type { ReactNode } from "react";

export type HeroTitleProps = {
  children: ReactNode;
};

export function HeroTitle({ children }: HeroTitleProps) {
  return (
    <h1 className="text-foreground tracking-[var(--tracking-display)] [font:var(--type-display)]">
      {children}
    </h1>
  );
}
