import type { ReactNode } from "react";

export type IconTileProps = {
  icon: ReactNode;
};

export function IconTile({ icon }: IconTileProps) {
  return (
    <span
      aria-hidden="true"
      className="bg-muted text-foreground inline-flex size-[32px] shrink-0 items-center justify-center rounded-[var(--radius-md)]"
    >
      <span className="inline-flex size-[16px] shrink-0 [&_svg]:size-full">
        {icon}
      </span>
    </span>
  );
}
