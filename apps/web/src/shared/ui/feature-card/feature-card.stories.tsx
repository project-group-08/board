import type { Meta, StoryObj } from "@storybook/react";
import { ZoomIn } from "lucide-react";
import NextImage from "next/image";

import { FeatureCard } from "./feature-card";
const togetherImage = new URL(
  "./story-assets/scene-together-light.png",
  import.meta.url,
).href;
const historyImage = new URL(
  "./story-assets/scene-history-light.png",
  import.meta.url,
).href;

const meta = {
  title: "UI/Feature Card",
  component: FeatureCard,
  args: {
    variant: "icon",
    title: "Заголовок",
    description: "Описание",
    icon: <ZoomIn strokeWidth={2.25} />,
  },
  argTypes: { icon: { control: false }, media: { control: false } },
  parameters: {
    docs: {
      description: {
        component:
          "Медиа само определяет размеры и доступность: потребитель задаёт ширину, высоту или пропорции и подходящий alt либо другую семантику. Карточка предоставляет доступную ширину и обрезает содержимое со скруглением 12 px.",
      },
    },
  },
} satisfies Meta<typeof FeatureCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const placeholder = (
  <div
    aria-hidden="true"
    style={{
      width: "100%",
      aspectRatio: "688 / 324",
      background:
        "linear-gradient(155deg, var(--color-muted), var(--color-surface))",
    }}
  />
);
const bottomPlaceholder = (
  <div
    aria-hidden="true"
    style={{
      width: "100%",
      aspectRatio: "688 / 280",
      background:
        "linear-gradient(158deg, var(--color-muted), var(--color-surface))",
    }}
  />
);
const exampleImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="688" height="280" viewBox="0 0 688 280"><rect width="688" height="280" fill="#e4e4e7"/><circle cx="344" cy="140" r="70" fill="#a1a1aa"/></svg>')}`;

export const Icon: Story = {
  render: (args) => (
    <div style={{ width: "min(100%, 368px)" }}>
      <FeatureCard {...args} />
    </div>
  ),
};

export const MediaTop: Story = {
  render: () => (
    <div style={{ width: "min(100%, 736px)" }}>
      <FeatureCard
        variant="media-top"
        title="Заголовок"
        description="Описание"
        media={placeholder}
      />
    </div>
  ),
};

export const MediaBottom: Story = {
  render: () => (
    <div style={{ width: "min(100%, 736px)" }}>
      <FeatureCard
        variant="media-bottom"
        title="Заголовок"
        description="Описание"
        media={bottomPlaceholder}
      />
    </div>
  ),
};

export const Image: Story = {
  render: () => (
    <div style={{ width: "min(100%, 736px)" }}>
      <FeatureCard
        variant="media-bottom"
        title="Изображение"
        description="Декоративное изображение с собственными пропорциями."
        media={
          <NextImage
            src={exampleImage}
            alt=""
            unoptimized
            width={688}
            height={280}
            style={{ display: "block", width: "100%", height: "auto" }}
          />
        }
      />
    </div>
  ),
};

export const LandingExamples: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Изображения предоставлены для светлой темы. В тёмной теме показаны те же светлые файлы.",
      },
    },
  },
  render: () => (
    <div>
      <p className="text-muted-foreground mb-[var(--space-16)] [font:var(--type-body-s)]">
        Изображения для светлой темы; для тёмной темы нужны отдельные ресурсы.
      </p>
      <div className="flex flex-wrap items-start gap-[var(--space-16)]">
        <div style={{ width: "min(100%, 736px)" }}>
          <FeatureCard
            variant="media-bottom"
            title="Изменения сразу у всех"
            description="Чужие правки появляются без перезагрузки страницы. Вы видите курсоры участников и тех, кто сейчас на доске"
            media={
              <NextImage
                src={togetherImage}
                alt="Доска ретроспективы с заметками и курсорами участников"
                unoptimized
                width={688}
                height={328}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            }
          />
        </div>
        <div style={{ width: "min(100%, 368px)" }}>
          <FeatureCard
            variant="media-bottom"
            title="Работа не потеряется"
            description="После обрыва связи доска сама подтянет последние изменения. Прошлые версии можно открыть и восстановить, а удалённые доски лежат в корзине"
            media={
              <NextImage
                src={historyImage}
                alt="Уведомление о восстановлении связи и список версий доски"
                unoptimized
                width={320}
                height={280}
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            }
          />
        </div>
      </div>
    </div>
  ),
};

export const WithoutDescription: Story = {
  render: () => (
    <div style={{ width: "min(100%, 736px)" }}>
      <FeatureCard variant="media-top" title="Заголовок" media={placeholder} />
    </div>
  ),
};

export const Narrow: Story = {
  render: () => (
    <div style={{ width: "min(100%, 280px)" }}>
      <FeatureCard
        variant="media-bottom"
        title="Общее пространство для идей и совместной работы"
        description="Обсуждайте планы, собирайте идеи и двигайтесь вперёд вместе с командой."
        media={bottomPlaceholder}
      />
    </div>
  ),
};
