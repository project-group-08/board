import { render, screen } from "@testing-library/react";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { describe, expect, it } from "vitest";

import { FeatureCard } from ".";
import type { FeatureCardProps } from ".";

// Type-level checks for the variant contract; this function is not executed.
function checkVariantTypes() {
  // @ts-expect-error icon is required for the icon variant
  const noIcon: FeatureCardProps = { variant: "icon", title: "Title" };
  // @ts-expect-error media is required for media variants
  const noMedia: FeatureCardProps = { variant: "media-top", title: "Title" };
  // @ts-expect-error icon and media cannot be mixed
  const mixed: FeatureCardProps = {
    variant: "media-bottom",
    title: "Title",
    icon: <ZoomIn />,
    media: <Image src="/example.png" width={1} height={1} alt="" unoptimized />,
  };
  return [noIcon, noMedia, mixed];
}
void checkVariantTypes;

describe("FeatureCard", () => {
  it("renders a decorative IconTile before title and description", () => {
    const { container } = render(
      <FeatureCard
        variant="icon"
        title="Заголовок"
        description="Описание"
        icon={<ZoomIn aria-label="Иконка" />}
      />,
    );
    const card = container.firstElementChild!;
    const heading = screen.getByRole("heading", {
      name: "Заголовок",
      level: 3,
    });
    expect([...card.children]).toEqual([
      card.querySelector('[aria-hidden="true"]'),
      heading,
      screen.getByText("Описание"),
    ]);
    expect(
      card.querySelector("svg")?.closest('[aria-hidden="true"]'),
    ).toBeTruthy();
    expect(
      screen.queryByRole("img", { name: "Иконка" }),
    ).not.toBeInTheDocument();
    expect(card).not.toHaveAttribute("role");
    expect(card).not.toHaveAttribute("tabindex");
  });

  it.each(["media-top", "media-bottom"] as const)(
    "preserves media accessibility and order for %s",
    (variant) => {
      const { container } = render(
        <FeatureCard
          variant={variant}
          title="Заголовок"
          description="Описание"
          media={
            <Image
              src="/example.png"
              width={1}
              height={1}
              alt="Пример"
              unoptimized
            />
          }
        />,
      );
      const card = container.firstElementChild!;
      const image = screen.getByRole("img", { name: "Пример" });
      const media = image.parentElement!;
      const heading = screen.getByRole("heading", { name: "Заголовок" });
      const description = screen.getByText("Описание");
      expect(media.closest('[aria-hidden="true"]')).toBeNull();
      expect([...card.children]).toEqual(
        variant === "media-top"
          ? [media, heading, description]
          : [heading, description, media],
      );
      expect(media).toHaveClass(
        "w-full",
        "overflow-hidden",
        "rounded-[var(--radius-md)]",
      );
      expect(media.className).not.toMatch(
        /(?:^|\s)(?:aspect-|absolute|relative)/,
      );
      expect(media.style.aspectRatio).toBe("");
      expect(media.style.position).toBe("");
      expect(media.firstElementChild).toBe(image);
    },
  );

  it("omits description entirely and supports a different heading level", () => {
    const { container, rerender } = render(
      <FeatureCard
        variant="media-bottom"
        title="Заголовок"
        as="h2"
        media={
          <Image src="/example.png" width={1} height={1} alt="" unoptimized />
        }
      />,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Заголовок" }),
    ).toBeInTheDocument();
    expect(container.firstElementChild?.children).toHaveLength(2);
    expect(container.querySelector("p")).toBeNull();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    rerender(
      <FeatureCard
        variant="media-bottom"
        title="Заголовок"
        description=""
        media={
          <Image src="/example.png" width={1} height={1} alt="" unoptimized />
        }
      />,
    );
    expect(container.firstElementChild?.children).toHaveLength(2);
  });
});
