import { Check } from "lucide-react";

export type CheckItemProps = {
  text: string;
};

export function CheckItem({ text }: CheckItemProps) {
  return (
    <div className="text-foreground flex w-full min-w-0 items-center gap-[var(--space-12)] [font:var(--type-body)]">
      <Check
        aria-hidden="true"
        size={16}
        strokeWidth={2.25}
        className="text-muted-foreground size-[16px] shrink-0"
      />
      <span className="min-w-0">{text}</span>
    </div>
  );
}
