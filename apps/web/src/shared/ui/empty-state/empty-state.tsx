import type { ReactElement } from "react";
import { twMerge } from "tailwind-merge";

import { IconTile } from "../icon-tile";

export type EmptyStateProps = {
  icon: ReactElement;
  title: string;
  description: string;
  action?: ReactElement;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  as: Heading = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div
      className={twMerge(
        "flex w-full min-w-0 flex-col items-center gap-[var(--space-16)] py-[var(--space-48)] text-center",
        className,
      )}
    >
      <IconTile icon={icon} />
      <div className="flex w-full min-w-0 flex-col gap-[var(--space-4)] [overflow-wrap:anywhere]">
        <Heading className="text-foreground [font:var(--type-heading-3)]">
          {title}
        </Heading>
        <p className="text-muted-foreground [font:var(--type-body-s)]">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}
