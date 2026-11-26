import { ReactNode } from "react";

export type SectionTitleProps = {
  title: string | ReactNode;
  label?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  tone?: "on-inverse";
  className?: string;
  adaptiveSize?: string;
};

export function SectionTitle({
  title,
  label,
  align = "left",
  as: Heading = "h2",
  tone,
  className,
  adaptiveSize
}: SectionTitleProps) {
  const colorClass =
    tone === "on-inverse" ? "text-inverse-foreground" : "text-foreground";

  return (
    <div
      className={`w-full min-w-0 ${align === "center" ? "text-center" : "text-left"} ${className}`}
    >
      {label && (
        <p
          className={`mb-[var(--space-8)] [font:var(--type-mono)] ${tone === "on-inverse" ? "text-inverse-foreground" : "text-muted-foreground"}`}
        >
          {label}
        </p>
      )}
      <Heading
        className={`tracking-[var(--tracking-heading-2)] [font:var(--type-heading-2-mobile)] md:[font:var(--type-heading-2)] ${tone === "on-inverse" ? "text-inverse-foreground" : "text-foreground"}`}
      >
        {title}
      </Heading>
    </div>
  );
}
