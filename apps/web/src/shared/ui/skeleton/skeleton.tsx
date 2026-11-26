import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={twMerge(
        clsx(
          "bg-muted rounded-[var(--radius-xs)] motion-safe:animate-pulse",
          className,
        ),
      )}
    />
  );
}
