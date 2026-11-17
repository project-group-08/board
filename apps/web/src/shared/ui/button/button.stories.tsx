import type { Meta, StoryObj } from "@storybook/react";
import { ArrowRight, Plus } from "lucide-react";
import NextLink from "next/link";

import { Button, buttonVariants, type ButtonProps } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  args: { children: "Начать" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "accent", "outline", "ghost", "destructive"],
    },
    size: { control: "select", options: ["default", "large", "small"] },
    leadingIcon: { control: false },
    trailingIcon: { control: false },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const LeadingIcon: Story = {
  args: { children: "Новая доска", leadingIcon: <Plus strokeWidth={2.25} /> },
};
export const TrailingIcon: Story = {
  args: {
    children: "Продолжить",
    trailingIcon: <ArrowRight strokeWidth={2.25} />,
  },
};
export const BothIcons: Story = {
  args: {
    children: "Новая доска",
    leadingIcon: <Plus strokeWidth={2.25} />,
    trailingIcon: <ArrowRight strokeWidth={2.25} />,
  },
};
export const Link: Story = {
  render: () => (
    <NextLink
      href="/boards"
      className={buttonVariants({ variant: "accent", size: "large" })}
    >
      Открыть доски
    </NextLink>
  ),
};
export const FullWidth: Story = {
  render: () => (
    <div style={{ width: "min(100%, 400px)" }}>
      <Button className="w-full">Продолжить</Button>
    </div>
  ),
};
export const Disabled: Story = { args: { disabled: true } };
export const Loading: Story = { args: { loading: true } };

// export const Cascade: Story = {
// 	render: () => (
// 		<div style={{ width: 400 }}>
// 			<Button hidden>Скрыт атрибутом</Button>
// 			<Button className="hidden">Скрыт классом</Button>
// 			<Button className="h-12 rounded-none w-full">48 px · без скругления</Button>
// 			<Button className="hover:bg-red-500 focus-visible:shadow-none">Hover / focus</Button>
// 		</div>
// 	),
// };

const variants = [
  "primary",
  "accent",
  "outline",
  "ghost",
  "destructive",
] as const;
const sizes = ["default", "large", "small"] as const;
const states = ["default", "hover", "focus", "disabled", "loading"] as const;

export const Matrix: Story = {
  parameters: {
    pseudo: {
      hover: '[data-matrix-state="hover"]',
      focusVisible: '[data-matrix-state="focus"]',
    },
  },
  render: () => (
    <div style={{ maxWidth: 1440 }}>
      <h1 style={{ font: "var(--type-title)" }}>
        Button · сравнение с макетом
      </h1>
      <p style={{ font: "var(--type-body-s)" }}>
        Hover и focus-visible показаны одновременно для сравнения. Реальные
        взаимодействия доступны в Playground.
      </p>
      {sizes.map((size) => (
        <section
          key={size}
          style={{
            overflowX: "auto",
            marginTop: 32,
            background: "var(--color-surface)",
            borderRadius: 12,
            padding: 32,
          }}
        >
          <h2 style={{ font: "var(--type-label)", marginBottom: 16 }}>
            {size} · {size === "default" ? 36 : size === "large" ? 40 : 32} px
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 160px)",
              gap: "20px 24px",
              alignItems: "center",
            }}
          >
            <span />
            {states.map((state) => (
              <span
                key={state}
                style={{
                  font: "var(--type-mono)",
                  color: "var(--color-muted-foreground)",
                }}
              >
                {state}
              </span>
            ))}
            {variants.map((variant) => [
              <span
                key={variant}
                style={{
                  font: "var(--type-mono)",
                  color: "var(--color-muted-foreground)",
                }}
              >
                {variant}
              </span>,
              ...states.map((state) => {
                const props: ButtonProps = {
                  variant,
                  size,
                  disabled: state === "disabled",
                  loading: state === "loading",
                };
                return (
                  <div key={`${variant}-${state}`}>
                    <Button {...props} data-matrix-state={state}>
                      Начать
                    </Button>
                  </div>
                );
              }),
            ])}
          </div>
        </section>
      ))}
      <div style={{ marginTop: 32 }}>
        <Button leadingIcon={<Plus strokeWidth={2.25} />}>Новая доска</Button>
      </div>
    </div>
  ),
};
