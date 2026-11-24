import type { ReactNode } from "react";

export type SectionDescriptionProps = {
  children: ReactNode;
  tone?: "on-inverse";
  align?: "center" | "left";
  className?: string;
};

export function SectionDescription({
  children,
  tone,
  align = "left",
  className,
}: SectionDescriptionProps) {
  return (
    <p
      className={`[font:var(--type-body-l)] ${tone === "on-inverse" ? "text-inverse-foreground" : "text-muted-foreground"} ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {children}
    </p>
  );
}
