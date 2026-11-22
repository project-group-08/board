import { Pencil } from "lucide-react";

export type EditLockLabelProps = {
  text: string;
  backgroundColor?: string;
  textColor?: string;
};

export function EditLockLabel({
  text,
  backgroundColor,
  textColor,
}: EditLockLabelProps) {
  return (
    <span
      className="text-background box-border inline-flex max-w-full min-w-0 items-start gap-[var(--space-4)] rounded-[var(--radius-xs)] bg-[var(--color-success)] px-[6px] py-[var(--space-2)] align-middle font-sans text-[13px]/[20px] font-medium"
      style={{ backgroundColor, color: textColor }}
    >
      <Pencil
        aria-hidden="true"
        size={16}
        strokeWidth={1.5}
        className="mt-[var(--space-2)] size-[16px] shrink-0"
      />
      <span className="min-w-0 [overflow-wrap:anywhere]">{text}</span>
    </span>
  );
}
