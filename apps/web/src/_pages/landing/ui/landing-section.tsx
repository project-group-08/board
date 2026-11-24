import type { ReactNode } from "react";

type LandingSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  spacing?: "margin" | "padding";
};

export function LandingSection({
  children,
  className = "",
  id,
  spacing = "padding",
}: LandingSectionProps) {
  const spacingClassName =
    spacing === "margin"
      ? "mt-(--space-64) min-[600px]:mt-(--space-80) min-[1013px]:mt-(--space-96)"
      : "pt-(--space-64) min-[600px]:pt-(--space-80) min-[1013px]:pt-(--space-96)";

  return (
    <section
      id={id}
      className={`px-[20px] min-[600px]:px-[40px] min-[1200px]:px-0 ${spacingClassName} ${className}`}
    >
      {children}
    </section>
  );
}
