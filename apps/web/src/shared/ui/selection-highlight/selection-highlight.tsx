import type { ReactNode } from "react";

export type SelectionHighlightProps = {
  children: ReactNode;
  label: string;
};

export function SelectionHighlight({
  children,
  label,
}: SelectionHighlightProps) {
  return (
    <span className="relative inline-block px-[12px] whitespace-nowrap">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[2px] bg-[var(--color-accent-soft)] shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]"
      >
        <span className="bg-background absolute -top-[4px] -left-[4px] size-[8px] rounded-[1px] shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]" />
        <span className="bg-background absolute -top-[4px] -right-[4px] size-[8px] rounded-[1px] shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]" />
        <span className="bg-background absolute -bottom-[4px] -left-[4px] size-[8px] rounded-[1px] shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]" />
        <span className="bg-background absolute -right-[4px] -bottom-[4px] size-[8px] rounded-[1px] shadow-[inset_0_0_0_1.5px_var(--color-accent-solid)]" />
        <svg
          className="text-accent-solid absolute top-0 left-full size-[16px]"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M.36.907C.33.831.32.747.34.665.35.584.39.509.45.451.51.392.58.353.67.337.75.322.83.331.91.364L14.24 5.781C14.32 5.814 14.39 5.872 14.44 5.946 14.48 6.02 14.5 6.107 14.5 6.194 14.49 6.282 14.46 6.365 14.4 6.432 14.35 6.5 14.27 6.548 14.19 6.57L9.08 7.887C8.8 7.961 8.53 8.111 8.32 8.321 8.11 8.531 7.96 8.794 7.89 9.082L6.57 14.187C6.55 14.272 6.5 14.348 6.43 14.404 6.37 14.459 6.28 14.493 6.19 14.498 6.11 14.504 6.02 14.482 5.95 14.436 5.87 14.39 5.81 14.321 5.78 14.24L.36.907Z"
            fill="currentColor"
          />
        </svg>
        <span className="bg-accent-solid text-accent-foreground absolute top-[17px] left-[calc(100%+13px)] rounded-[8px] px-[8px] py-[4px] tracking-normal [font:var(--type-caption)]">
          {label}
        </span>
      </span>
      <span className="relative">{children}</span>
    </span>
  );
}
