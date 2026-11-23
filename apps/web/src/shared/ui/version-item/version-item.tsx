"use client";

import { Badge } from "../badge";

export type VersionItemProps = {
  title: string;
  author: string;
  selected: boolean;
  currentLabel?: string;
  lineTop?: boolean;
  lineBottom?: boolean;
  onSelect: () => void;
};

export function VersionItem({
  title,
  author,
  selected,
  currentLabel,
  lineTop = false,
  lineBottom = false,
  onSelect,
}: VersionItemProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={[title, currentLabel, author].filter(Boolean).join(" ")}
      onClick={onSelect}
      className={`text-foreground hover:bg-muted relative box-border block w-full min-w-0 cursor-pointer rounded-[var(--radius-sm)] py-[var(--space-8)] pr-[var(--space-8)] pl-[var(--space-32)] text-left focus-visible:z-10 focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-2 focus-visible:outline-transparent ${selected ? "bg-muted" : ""}`}
    >
      <span aria-hidden="true">
        {lineTop && (
          <span
            data-slot="line-top"
            className="bg-border absolute top-0 left-[15.5px] h-[14px] w-px"
          />
        )}
        {lineBottom && (
          <span
            data-slot="line-bottom"
            className="bg-border absolute top-[22px] bottom-0 left-[15.5px] w-px"
          />
        )}
        <span
          data-slot="marker"
          className={`absolute top-[14px] left-[12px] size-[8px] rounded-full border-[1.5px] ${selected ? "border-foreground bg-foreground" : "border-muted-foreground bg-background"}`}
        />
      </span>
      <span className="flex min-w-0 flex-col gap-[var(--space-4)]">
        <span className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-8)] gap-y-[var(--space-4)]">
          <span className="line-clamp-2 min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)]">
            {title}
          </span>
          {currentLabel && <Badge>{currentLabel}</Badge>}
        </span>
        <span className="text-muted-foreground line-clamp-2 min-w-0 [overflow-wrap:anywhere] [font:var(--type-caption)]">
          {author}
        </span>
      </span>
    </button>
  );
}
