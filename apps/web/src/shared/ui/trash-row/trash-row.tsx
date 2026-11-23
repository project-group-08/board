import type { ReactNode } from "react";

export type TrashRowProps = {
  name: string;
  deletedBy: string;
  deletedAt: string;
  restoreAction: ReactNode;
};

export function TrashRow({
  name,
  deletedBy,
  deletedAt,
  restoreAction,
}: TrashRowProps) {
  return (
    <div className="@container w-full min-w-0">
      <div
        data-slot="trash-row"
        className="hover:bg-muted grid min-h-[56px] min-w-0 grid-cols-1 items-center gap-[var(--space-8)] px-[var(--space-16)] py-[var(--space-12)] @min-[720px]:grid-cols-[minmax(0,1fr)_200px_183px_128px] @min-[720px]:gap-[var(--space-16)]"
      >
        <span className="text-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)]">
          {name}
        </span>
        <span className="text-muted-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-body-s)]">
          {deletedBy}
        </span>
        <span className="text-muted-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-body-s)]">
          {deletedAt}
        </span>
        <div className="min-w-0 justify-self-start @min-[720px]:justify-self-end">
          {restoreAction}
        </div>
      </div>
    </div>
  );
}
