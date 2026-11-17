import type { ReactNode } from "react";

export type SectionDescriptionProps = {
  children: ReactNode;
  tone?: "on-inverse";
};

export function SectionDescription({
  children,
  tone,
}: SectionDescriptionProps) {
  return (
    <p
      className={`[font:var(--type-body-l)] ${tone === "on-inverse" ? "text-inverse-foreground" : "text-muted-foreground"}`}
    >
      {children}
    </p>
  );
}
