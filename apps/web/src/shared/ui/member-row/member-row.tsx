import type { ReactNode } from "react";

import { Avatar } from "../avatar";

export type MemberRowProps = {
  name: string;
  email: string;
  avatarSrc?: string;
  avatarFallback: string;
  identityBadge?: ReactNode;
  pending?: boolean;
  roleContent?: ReactNode;
  action?: ReactNode;
};

export function MemberRow({
  name,
  email,
  avatarSrc,
  avatarFallback,
  identityBadge,
  pending = false,
  roleContent,
  action,
}: MemberRowProps) {
  return (
    <div className="@container w-full min-w-0">
      <div
        data-slot="member-row"
        className="hover:bg-muted grid min-h-[64px] min-w-0 grid-cols-[minmax(0,1fr)_minmax(0,auto)] items-center gap-x-[var(--space-16)] gap-y-[var(--space-8)] px-[var(--space-16)] py-[var(--space-12)] @min-[720px]:grid-cols-[minmax(0,1fr)_200px_32px] @min-[720px]:gap-y-0"
      >
        <div className="col-span-2 flex min-w-0 items-center gap-[var(--space-12)] @min-[720px]:col-span-1">
          <div className={pending ? "shrink-0 opacity-50" : "shrink-0"}>
            <Avatar name={name} fallback={avatarFallback} src={avatarSrc} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-8)]">
              <span
                className={`line-clamp-2 max-w-full min-w-0 [overflow-wrap:anywhere] [font:var(--type-label)] ${
                  pending ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {name}
              </span>
              {identityBadge}
            </div>
            <span className="text-muted-foreground line-clamp-2 min-w-0 [overflow-wrap:anywhere] [font:var(--type-caption)]">
              {email}
            </span>
          </div>
        </div>
        <div className="text-muted-foreground min-w-0 [overflow-wrap:anywhere] [font:var(--type-body-s)]">
          {roleContent}
        </div>
        <div className="min-w-0 justify-self-end [overflow-wrap:anywhere]">
          {action}
        </div>
      </div>
    </div>
  );
}
