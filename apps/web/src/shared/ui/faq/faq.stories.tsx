import type { Meta, StoryObj } from "@storybook/react";

import { Faq } from ".";

const meta = { title: "UI/Faq" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const items = [
  {
    value: "draft",
    question: "Как создаётся черновик?",
    answer: "Опишите задачу, и сервис подготовит черновик схемы.",
  },
  {
    value: "team",
    question: "Можно ли работать командой?",
    answer: "Да, доску можно использовать совместно.",
  },
] as const;

export const Closed: Story = {
  render: () => (
    <div style={{ width: "min(100%, 800px)" }}>
      <Faq.Root>
        <Faq.Item {...items[0]} />
      </Faq.Root>
    </div>
  ),
};

export const Open: Story = {
  render: () => (
    <div style={{ width: "min(100%, 800px)" }}>
      <Faq.Root defaultValue={["draft"]}>
        <Faq.Item {...items[0]} />
      </Faq.Root>
    </div>
  ),
};

export const Single: Story = {
  render: () => (
    <div style={{ width: "min(100%, 800px)" }}>
      <Faq.Root>
        {items.map((item) => (
          <Faq.Item key={item.value} {...item} />
        ))}
      </Faq.Root>
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ width: "min(100%, 800px)" }}>
      <Faq.Root multiple>
        {items.map((item) => (
          <Faq.Item key={item.value} {...item} />
        ))}
      </Faq.Root>
    </div>
  ),
};

export const Narrow: Story = {
  render: () => (
    <div style={{ width: "min(100%, 220px)" }}>
      <Faq.Root defaultValue={["long"]}>
        <Faq.Item
          value="long"
          question="Как создать и обсудить с командой подробный черновик схемы для нового проекта?"
          answer="Опишите задачу, пригласите коллег на доску и вместе обсудите предложенную схему и следующие шаги."
        />
      </Faq.Root>
    </div>
  ),
};

export const LandingComposition: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Допущение по макету лендинга: линия и вертикальные отступы заданы внешним контейнером, а не FAQ Item.",
      },
    },
  },
  render: () => (
    <div
      style={{ width: "min(100%, 736px)", background: "var(--color-surface)" }}
    >
      <p
        style={{
          font: "var(--type-caption)",
          color: "var(--color-muted-foreground)",
          marginBottom: 24,
        }}
      >
        Допущение: линия и вертикальные отступы принадлежат контейнеру.
      </p>
      <div
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingTop: "calc(var(--space-20) - 1px)",
          paddingBottom: "var(--space-20)",
        }}
      >
        <Faq.Root defaultValue={["transfer"]}>
          <Faq.Item
            value="transfer"
            question="Можно ли перенести доски из другого сервиса?"
            answer="Пока нет, доски создаются с нуля"
          />
        </Faq.Root>
      </div>
    </div>
  ),
};
