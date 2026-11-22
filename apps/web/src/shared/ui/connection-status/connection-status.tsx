import { LoaderCircle, WifiOff } from "lucide-react";

export type ConnectionStatusProps = {
  state: "offline" | "reconnecting";
  text: string;
};

export function ConnectionStatus({ state, text }: ConnectionStatusProps) {
  const Icon = state === "offline" ? WifiOff : LoaderCircle;

  return (
    <span className="bg-muted text-muted-foreground box-border inline-flex max-w-full min-w-0 items-start gap-[6px] rounded-[var(--radius-sm)] py-[6px] pr-[14px] pl-[10px] align-middle [font:var(--type-caption)]">
      <Icon
        aria-hidden="true"
        size={16}
        strokeWidth={1.5}
        className={`mt-[var(--space-2)] size-[16px] shrink-0 ${state === "reconnecting" ? "animate-spin motion-reduce:animate-none" : ""}`}
      />
      <span className="min-w-0 [overflow-wrap:anywhere]">{text}</span>
    </span>
  );
}
