import type { ReactNode } from "react";

export type AiChatMessageProps = {
  variant: "user" | "assistant";
  children: ReactNode;
};

export function AiChatMessage({ variant, children }: AiChatMessageProps) {
  return (
    <div
      className={variant === "user" ? "flex min-w-0 justify-end" : "min-w-0"}
    >
      <div
        className={
          variant === "user"
            ? "bg-muted max-w-[260px] min-w-0 rounded-[var(--radius-md)] px-[12px] py-[8px] [overflow-wrap:anywhere] whitespace-pre-wrap [font:var(--type-body-s)]"
            : "min-w-0 [overflow-wrap:anywhere] whitespace-pre-wrap [font:var(--type-body-s)]"
        }
      >
        {children}
      </div>
    </div>
  );
}
