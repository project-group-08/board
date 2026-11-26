"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";

export type WorkspaceMarkProps = {
  name: string;
  fallback: string;
  src?: string;
  size?: "default" | "large";
};

export function WorkspaceMark({
  name,
  fallback,
  src,
  size = "default",
}: WorkspaceMarkProps) {
  return (
    <BaseAvatar.Root
      key={src}
      render={<figure />}
      aria-label={name}
      className={`bg-inverse text-inverse-foreground inline-flex shrink-0 items-center justify-center overflow-hidden align-middle ${
        size === "large"
          ? "size-[64px] rounded-[var(--radius-md)] [letter-spacing:var(--tracking-title)] [font:var(--type-title)]"
          : "size-[32px] rounded-[var(--radius-sm)] [font:var(--type-label)]"
      }`}
    >
      {src && (
        <BaseAvatar.Image
          src={src}
          alt=""
          aria-hidden="true"
          className="size-full object-cover"
        />
      )}
      <BaseAvatar.Fallback aria-hidden="true">{fallback}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
