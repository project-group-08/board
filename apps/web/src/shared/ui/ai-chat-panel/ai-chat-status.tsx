import { CircleAlert, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";

export type AiChatStatusProps = {
  variant: "loading" | "error" | "notice";
  children: ReactNode;
};

export function AiChatStatus({ variant, children }: AiChatStatusProps) {
  const Icon = variant === "loading" ? LoaderCircle : CircleAlert;
  const appearance = {
    loading: "text-muted-foreground",
    error: "text-destructive",
    notice: "bg-muted text-foreground rounded-[var(--radius-sm)] p-[12px]",
  }[variant];

  return (
    <div
      className={`flex min-w-0 items-start gap-[8px] [font:var(--type-body-s)] ${appearance}`}
    >
      <Icon
        aria-hidden="true"
        strokeWidth={1.5}
        className={`mt-[2px] size-[16px] shrink-0 ${variant === "notice" ? "text-muted-foreground" : ""} ${variant === "loading" ? "animate-spin motion-reduce:animate-none" : ""}`}
      />
      <div className="min-w-0 [overflow-wrap:anywhere] whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}
