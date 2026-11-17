import type { ReactElement } from "react";

import { IconTile } from "../icon-tile";

type FeatureCardCommonProps = {
  title: string;
  description?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
};

export type FeatureCardProps = FeatureCardCommonProps &
  (
    | { variant: "icon"; icon: ReactElement; media?: never }
    | {
        variant: "media-top" | "media-bottom";
        media: ReactElement;
        icon?: never;
      }
  );

export function FeatureCard(props: FeatureCardProps) {
  const { title, description, as: Heading = "h3", variant } = props;
  const media = variant !== "icon" && (
    <div className="w-full overflow-hidden rounded-[var(--radius-md)]">
      {props.media}
    </div>
  );

  return (
    <div className="border-border bg-background box-border flex w-full min-w-0 flex-col gap-[var(--space-12)] rounded-[var(--radius-lg)] border p-[calc(var(--space-24)-1px)]">
      {variant === "icon" && <IconTile icon={props.icon} />}
      {variant === "media-top" && media}
      <Heading className="text-foreground [font:var(--type-heading-3)]">
        {title}
      </Heading>
      {description && (
        <p className="text-muted-foreground [font:var(--type-body)]">
          {description}
        </p>
      )}
      {variant === "media-bottom" && media}
    </div>
  );
}
