import { LayoutGrid } from "lucide-react";
import type { ReactNode } from "react";

import { Skeleton } from "../skeleton";

export type BoardCardProps =
  | {
      loading: true;
      href?: never;
      title?: never;
      meta?: never;
      preview?: never;
      menu?: never;
    }
  | {
      loading?: false;
      href: string;
      title: string;
      meta: string;
      preview?: ReactNode;
      menu?: ReactNode;
    };

const frameClass =
  "border-border bg-background box-border grid w-full min-w-0 rounded-[var(--radius-lg)] border p-[7px]";
const previewClass =
  "bg-muted aspect-[252/152] w-full overflow-hidden rounded-[var(--radius-md)]";

export function BoardCard(props: BoardCardProps) {
  if (props.loading) {
    return (
      <output className={frameClass} aria-label="Загрузка доски">
        <Skeleton className={previewClass} />
        <div className="flex flex-col gap-[var(--space-4)] px-[var(--space-8)] pt-[var(--space-12)] pb-[var(--space-4)]">
          <Skeleton className="h-[20px] w-3/4" />
          <Skeleton className="h-[20px] w-1/2" />
        </div>
      </output>
    );
  }

  return (
    <div
      className={`${frameClass} hover:border-dot has-[>a:focus-visible]:border-accent hover:shadow-[var(--shadow-floating)] has-[>a:focus-visible]:shadow-[var(--shadow-focus)]`}
    >
      <a
        href={props.href}
        className="col-start-1 row-start-1 min-w-0 rounded-[var(--radius-md)] outline-none"
      >
        <div className={previewClass}>
          {props.preview ?? (
            <span
              aria-hidden="true"
              className="text-muted-foreground flex h-full items-center justify-center"
            >
              <LayoutGrid size={16} strokeWidth={1.5} />
            </span>
          )}
        </div>
        <div
          className={`flex min-w-0 flex-col gap-[var(--space-4)] pt-[var(--space-12)] pb-[var(--space-4)] pl-[var(--space-8)] ${props.menu ? "pr-[48px]" : "pr-[var(--space-8)]"}`}
        >
          <span className="text-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)]">
            {props.title}
          </span>
          <span className="text-muted-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-caption)]">
            {props.meta}
          </span>
        </div>
      </a>
      {props.menu && (
        <div className="pointer-events-none col-start-1 row-start-1 flex min-w-0 flex-col">
          <div
            aria-hidden="true"
            className="aspect-[252/152] w-full shrink-0"
          />
          <div className="flex justify-end pt-[var(--space-8)] pr-[var(--space-8)]">
            <div className="pointer-events-auto">{props.menu}</div>
          </div>
        </div>
      )}
    </div>
  );
}
