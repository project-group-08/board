import { ArrowRight, Group, Moon, ZoomInIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/ui/button";
import { CheckItem } from "@/shared/ui/check-item";
import { Faq } from "@/shared/ui/faq";
import { FeatureCard } from "@/shared/ui/feature-card";
import { IconButton } from "@/shared/ui/icon-button";
import { NavLink } from "@/shared/ui/nav-link";
import { SectionDescription } from "@/shared/ui/section-description";
import { SectionTitle } from "@/shared/ui/section-title";
import { SiteFooter } from "@/shared/ui/site-footer";
import { SiteHeader } from "@/shared/ui/site-header";

import { LandingSection } from "./landing-section";

const focus =
  "focus-visible:outline-2 focus-visible:outline-transparent focus-visible:shadow-[var(--shadow-focus)]";

const nav = [
  { label: "Возможности", link: "features" },
  { label: "ИИ", link: "ai" },
  { label: "Совместная работа", link: "teamwork" },
  { label: "Вопросы", link: "faq" },
];
export function LandingPage() {
  return (
    <div className="bg-(--color-background)">
      <div className="relative isolate pt-(--space-16)">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-20 h-[640px] bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-foreground)_10%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-foreground)_10%,transparent)_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_75%_at_50%_40%,#000_45%,transparent_100%)] bg-size-[24px_24px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[640px] bg-[radial-gradient(800px_313px_at_50%_214px,var(--color-background)_0%,var(--color-background)_55%,transparent_80%,var(--color-background)_100%)]"
        />
        <div className="px-3">
          <SiteHeader
            brand={
              <Link
                href="/"
                className={`text-foreground whitespace-nowrap [font:var(--type-heading-3)] ${focus}`}
              >
                Tabula
              </Link>
            }
            navigationLabel="Основная навигация"
            navigation={
              <ul className="m-0 flex list-none items-center gap-[var(--space-24)] p-0">
                {nav.map(({ label, link }) => (
                  <li key={label} className="flex w-full items-center">
                    <NavLink
                      href={`#${link}`}
                      className="text-muted-foreground flex justify-start w-auto [font:var(--type-label)]"
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            }
            themeAction={
              <IconButton
                aria-label="Переключить тему"
                className="text-foreground rounded-0 border-border rounded-[22px] size-9 border-0"
              >
                <Moon strokeWidth={2.25} />
              </IconButton>
            }
            actions={
              <div className="flex gap-(--space-8) w-auto">
                <Button
                  variant="ghost"
                  size="large"
                  className={`text-foreground inline-flex h-[36px] items-center px-[var(--space-24)] [font:var(--type-label)] ${focus}`}
                >
                  Войти
                </Button>{" "}
                <Button variant="accent">Начать</Button>
              </div>
            }
          />
        </div>
        <main className="flex flex-col">
          <section className="mx-auto max-w-[1120px] px-[20px] pb-(--space-48) min-[600px]:px-[40px] min-[600px]:pb-(--space-64) min-[1013px]:pb-0 min-[1200px]:px-0">
            <div>
              <div className="mx-auto mt-(--space-48) flex max-w-[350px] flex-col gap-(--space-24) text-center min-[600px]:mt-[72px] min-[600px]:max-w-[688px] min-[810px]:max-w-full min-[1013px]:mt-[92px]">
                <h1 className="text-foreground mx-auto max-w-[688px] font-sans text-[36px]/[40px] font-medium tracking-[-0.03em] tracking-[var(--tracking-display)] min-[600px]:[font:var(--type-display)] min-[810px]:max-w-[705px]">
                  <span className="mx-auto block max-w-[234px] min-[600px]:max-w-[389px] min-[810px]:inline min-[810px]:max-w-full">
                    Доска, где команда и ИИ
                  </span>{" "}
                  проектируют вместе
                </h1>
                <p className="text-muted-foreground mx-auto max-w-[620px] [font:var(--type-body-l)] min-[810px]:max-w-full">
                  Команда проектирует и обсуждает решения, а ИИ собирает
                  черновики и группирует идеи
                </p>
                <div className="m-auto mt-(--space-8) flex w-full flex-col gap-(--space-12) min-[600px]:w-auto min-[600px]:flex-row">
                  <Button
                    variant="accent"
                    size="large"
                    trailingIcon={<ArrowRight />}
                    className="w-full min-[600px]:flex-1"
                  >
                    Создать доску
                  </Button>
                  <Button
                    variant="ghost"
                    size="large"
                    className="w-full min-[600px]:flex-1"
                  >
                    Посмотреть возможности
                  </Button>
                </div>
              </div>
              <Image
                src="/images/preview.png"
                alt="Пример доски Tabula"
                width={1120}
                height={720}
                className="mt-(--space-32) h-auto w-full rounded-[20px] shadow-[0_24px_32px_-8px_rgb(0_0_0_/_0.06),0_1px_3px_0_rgb(0_0_0_/_0.06)] min-[600px]:mt-(--space-48) min-[1013px]:mt-[52px]"
                priority
              />
            </div>
          </section>
          <LandingSection id="features" className="mx-auto max-w-[1120px]">
            <div className="flex flex-col gap-(--space-32) min-[600px]:gap-[40px] min-[1013px]:gap-(--space-48) min-[1013px]:pt-(--space-96)">
              <div>
                <SectionTitle
                  label="01 / Возможности"
                  title="Доска для схем, идей и планов"
                  align="center"
                  className="text-left min-[600px]:text-center"
                  adaptiveSize="font-sans text-[28px]/[36px] font-medium tracking-[-0.02em] min-[600px]:[font:var(--type-heading-2)] min-[600px]:tracking-[var(--tracking-heading-2)]"
                />
                <SectionDescription
                  align="center"
                  className="mt-(--space-16) text-left min-[600px]:text-center"
                >
                  Текст, стикеры, фигуры, изображения и даже аудио в одном месте
                  <br />
                  Связывайте их стрелками и собирайте в группы
                </SectionDescription>
              </div>
              <div className="grid h-auto grid-cols-1 grid-rows-1 gap-(--space-16) min-[1013px]:h-[448px] min-[1013px]:grid-cols-[736fr_368fr] min-[1013px]:grid-rows-[minmax(0,1fr)_minmax(0,1fr)]">
                <div className="min-[1013px]:row-span-2 min-[773px]:[&>*]:h-full">
                  <FeatureCard
                    variant="media-top"
                    media={
                      <Image
                        src="/images/connections.png"
                        alt="Пример связывания элементов стрелками"
                        width={688}
                        height={324}
                        className="w-full"
                      />
                    }
                    title="Элементы и связи"
                    description="Соединяйте элементы линиями и стрелками. Сдвинете один, и связи последуют за ним"
                  />
                </div>
                <div className="flex flex-col gap-(--space-16) min-[600px]:flex-row min-[773px]:h-full min-[1013px]:row-span-2 min-[1013px]:flex-col">
                  <div className="min-w-0 min-[600px]:flex-1 min-[773px]:min-h-0 [&>*]:h-full">
                    <FeatureCard
                      variant="icon"
                      icon={<ZoomInIcon />}
                      title="Бесконечный холст"
                      description="Места хватит на любую схему. Двигайте и масштабируйте холст, а несколько элементов переносите, копируйте или удаляйте вместе"
                    />
                  </div>
                  <div className="min-w-0 min-[600px]:flex-1 min-[773px]:min-h-0 [&>*]:h-full">
                    <FeatureCard
                      variant="icon"
                      icon={<Group />}
                      title="Группы"
                      description="Объедините связанные элементы в группу и переставляйте их разом"
                    />
                  </div>
                </div>
              </div>
            </div>
          </LandingSection>
          <LandingSection
            id="ai"
            spacing="margin"
            className="border-border border bg-(--color-surface)"
          >
            <div className="mx-auto grid max-w-[1120px] grid-cols-1 items-center gap-(--space-32) py-(--space-64) min-[600px]:gap-[40px] min-[600px]:py-(--space-80) min-[1013px]:grid-cols-[528fr_528fr] min-[1013px]:gap-(--space-64) min-[1013px]:py-(--space-96)">
              <div className="flex flex-col">
                <SectionTitle
                  label="02 / ИИ"
                  title={
                    <>
                      ИИ работает
                      <br />с вашей доской
                    </>
                  }
                  align="left"
                  adaptiveSize="font-sans text-[28px]/[36px] font-medium tracking-[-0.02em] min-[600px]:[font:var(--type-heading-2)] min-[600px]:tracking-[var(--tracking-heading-2)]"
                />

                <SectionDescription align="left" className="mt-(--space-24)">
                  Опишите идею, концепцию своими словами, и ИИ соберёт черновик
                  прямо на доске. Он учитывает то, что уже лежит на холсте,
                  а результат сначала показывает вам: применить
                  его или отказаться, решаете вы
                </SectionDescription>
                <div className="mt-(--space-24) flex flex-col gap-(--space-12)">
                  <CheckItem text="Создаст черновик схемы по описанию" />
                  <CheckItem text="Накидает идеи для мозгового штурма на стикеры" />
                  <CheckItem text="Разложит стикеры по группам в выделенной области" />
                  <CheckItem text="Подведёт итог и подскажет, что добавить" />
                </div>
              </div>
              <Image
                src="/images/ai.png"
                width={528}
                height={400}
                alt="Возможности ИИ применимые к доске"
                className="justify-self-center"
              />
            </div>
          </LandingSection>
          <LandingSection id="teamwork" className="mx-auto max-w-[1120px]">
            <div className="flex flex-col gap-(--space-32) min-[600px]:gap-[40px] min-[1013px]:gap-(--space-48) min-[1013px]:pt-(--space-96)">
              <div>
                <SectionTitle
                  label="03 / Совместная работа"
                  title="Вся команда на одной доске"
                  className="text-left min-[600px]:text-center"
                  align="center"
                  adaptiveSize="font-sans text-[28px]/[36px] font-medium tracking-[-0.02em] min-[600px]:[font:var(--type-heading-2)] min-[600px]:tracking-[var(--tracking-heading-2)]"
                />
                <SectionDescription
                  align="center"
                  className="mt-(--space-16) text-left min-[600px]:text-center"
                >
                  Все правят одновременно, и ничего не теряется,
                  даже если пропал интернет
                </SectionDescription>
              </div>
              <div className="grid grid-cols-1 gap-(--space-16) min-[1013px]:grid-cols-[736fr_368fr]">
                <FeatureCard
                  variant="media-bottom"
                  media={
                    <Image
                      src="/images/together.png"
                      alt="Массовое пользование доской"
                      width={688}
                      height={328}
                      className="h-full w-full"
                    />
                  }
                  title="Изменения сразу у всех"
                  description="Чужие правки появляются без перезагрузки страницы. Вы видите курсоры участников и тех, кто сейчас на доске"
                />
                <FeatureCard
                  variant="media-bottom"
                  media={
                    <Image
                      src="/images/history.png"
                      alt="Сохраненная история изменений доски"
                      width={320}
                      height={280}
                      className="h-full max-h-[350px] w-full max-w-[400px] justify-self-center min-[1013px]:max-h-[280px] min-[1013px]:max-w-[320px]"
                    />
                  }
                  title="Работа не потеряется"
                  description="После обрыва связи доска сама подтянет последние изменения. Прошлые версии можно открыть и восстановить, а удалённые доски лежат в корзине"
                />
              </div>
            </div>
          </LandingSection>
          <LandingSection
            id="faq"
            spacing="margin"
            className="border-border border bg-(--color-surface)"
          >
            <div className="mx-auto max-w-[1120px] py-(--space-64) min-[600px]:py-(--space-80) min-[1013px]:py-(--space-96)">
              <div className="grid grid-cols-1 items-start gap-(--space-32) min-[1013px]:grid-cols-[320fr_736fr] min-[1013px]:gap-(--space-64)">
                <SectionTitle
                  label="04 / Вопросы"
                  title="Частые вопросы"
                  align="left"
                  adaptiveSize="font-sans text-[28px]/[36px] font-medium tracking-[-0.02em] min-[600px]:[font:var(--type-heading-2)] min-[600px]:tracking-[var(--tracking-heading-2)]"
                />
                <div className="self-center border-y border-(--color-divider) py-[20px]">
                  <Faq.Root>
                    <Faq.Item
                      value="transfer"
                      question="Можно ли перенести доски из другого сервиса?"
                      answer="Пока нет, доски создаются с нуля"
                    />
                  </Faq.Root>
                </div>
              </div>
            </div>
          </LandingSection>
          <LandingSection>
            <div className="bg-inverse text-inverse-foreground relative isolate mx-auto mb-(--space-64) flex min-h-[320px] w-full max-w-[1120px] items-center justify-center overflow-hidden rounded-(--radius-lg) px-[20px] min-[600px]:mb-(--space-80) min-[600px]:px-[40px] min-[1013px]:mb-[92px] min-[1200px]:px-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(560px_200px_at_560px_130px,var(--color-inverse)_0%,var(--color-inverse)_50%,transparent_75%,color-mix(in_srgb,var(--color-inverse)_75%,transparent)_100%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-inverse-foreground)_8%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_srgb,var(--color-inverse-foreground)_8%,transparent)_1px,transparent_1px)] bg-size-[24px_24px]"
              />
              <div className="relative flex w-full flex-col items-center gap-(--space-16)">
                <SectionTitle
                  title="Соберите команду у одной доски"
                  align="center"
                  tone="on-inverse"
                  adaptiveSize="font-sans text-[28px]/[36px] font-medium tracking-[-0.02em] min-[600px]:[font:var(--type-heading-2)] min-[600px]:tracking-[var(--tracking-heading-2)]"
                />
                <SectionDescription
                  align="center"
                  tone="on-inverse"
                  className="max-w-[310px] min-[600px]:max-w-[390px]"
                >
                  Создайте доску, отправьте ссылку коллегам и попросите ИИ
                  набросать первый черновик
                </SectionDescription>
                <Button
                  className="mt-(--space-16) w-full min-[600px]:w-auto"
                  variant="accent"
                  size="large"
                  trailingIcon={<ArrowRight />}
                >
                  Создать доску
                </Button>
              </div>
            </div>
          </LandingSection>
        </main>
      </div>

      <SiteFooter
        brand="Tabula"
        copyright="© 2026 Tabula. Все права защищены"
        className="px-[20px] min-[600px]:px-[40px] min-[1200px]:px-0"
        adaptive
      />
    </div>
  );
}
