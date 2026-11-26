"use client";

import { Avatar as BaseAvatar } from "@base-ui/react/avatar";

export type AvatarProps = {
  src?: string;
  name: string;
  fallback: string;
  size?: "default" | "large";
};

export function Avatar({ src, name, fallback, size = "default" }: AvatarProps) {
  return (
    <BaseAvatar.Root
      key={src}
      render={<figure />}
      aria-label={name}
      className={`bg-muted text-foreground inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full align-middle ${
        size === "large"
          ? "size-[64px] [font:var(--type-heading-3)]"
          : "size-[32px] [font:var(--type-label)]"
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
