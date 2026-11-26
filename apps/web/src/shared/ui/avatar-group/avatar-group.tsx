import { Children, type ReactNode } from "react";

export type AvatarGroupProps = {
  label: string;
  children: ReactNode;
  more?: { text: string; label: string };
};

const itemClass = "relative flex w-[26px] shrink-0 last:w-[32px]";
const circleClass =
  "inline-flex size-[32px] items-center justify-center rounded-full shadow-[0_0_0_2px_var(--color-background)]";

export function AvatarGroup({ label, children, more }: AvatarGroupProps) {
  return (
    <ul aria-label={label} className="inline-flex list-none items-center p-0">
      {Children.map(children, (child) =>
        child == null || typeof child === "boolean" ? null : (
          <li className={itemClass}>
            <span className={circleClass}>{child}</span>
          </li>
        ),
      )}
      {more && (
        <li aria-label={more.label} className={itemClass}>
          <span
            aria-hidden="true"
            className={`${circleClass} bg-muted text-muted-foreground font-sans text-[13px]/[20px] font-medium`}
          >
            {more.text}
          </span>
        </li>
      )}
    </ul>
  );
}
