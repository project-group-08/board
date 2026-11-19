"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import { Check, ChevronRight } from "lucide-react";
import { createContext, useContext } from "react";
import type { ComponentProps, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const itemClass =
  "data-[highlighted]:bg-muted box-border flex min-h-[32px] min-w-0 cursor-default items-center gap-[8px] rounded-[var(--radius-sm)] px-[8px] py-[6px] text-left [font:var(--type-body-s)] outline-none select-none data-[disabled]:opacity-50";

type ItemContentProps = {
  children?: ReactNode;
  icon?: ReactNode;
  shortcut?: string;
};

function ItemContent({ children, icon, shortcut }: ItemContentProps) {
  return (
    <>
      {icon && (
        <span
          aria-hidden="true"
          className="inline-flex size-[16px] shrink-0 [&_svg]:size-full"
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1 [overflow-wrap:anywhere]">
        {children}
      </span>
      {shortcut && (
        <span
          aria-hidden="true"
          className="text-muted-foreground shrink-0 [font:var(--type-mono)]"
        >
          {shortcut}
        </span>
      )}
    </>
  );
}

export function Menu(props: Omit<BaseMenu.Root.Props, "modal">) {
  return <BaseMenu.Root {...props} modal={false} />;
}

export const MenuTrigger = BaseMenu.Trigger;
export const MenuSub = BaseMenu.SubmenuRoot;

const MenuRadioCheckSideContext = createContext<"left" | "right">("left");

type MenuRadioGroupProps<Value extends NonNullable<unknown> | null> = Omit<
  ComponentProps<typeof BaseMenu.RadioGroup>,
  "value" | "defaultValue" | "onValueChange"
> & {
  value: Value;
  checkSide?: "left" | "right";
  onValueChange: (
    value: Value,
    details: BaseMenu.RadioGroup.ChangeEventDetails,
  ) => void;
};

export function MenuRadioGroup<Value extends NonNullable<unknown> | null>({
  checkSide = "left",
  ...props
}: MenuRadioGroupProps<Value>) {
  return (
    <MenuRadioCheckSideContext.Provider value={checkSide}>
      <BaseMenu.RadioGroup {...props} />
    </MenuRadioCheckSideContext.Provider>
  );
}

type ContentProps = Omit<BaseMenu.Popup.Props, "className"> & {
  className?: string;
  side?: BaseMenu.Positioner.Props["side"];
  align?: BaseMenu.Positioner.Props["align"];
  sideOffset?: number;
};

function Content({
  className,
  side,
  align = "start",
  sideOffset = 4,
  ...props
}: ContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        collisionPadding={8}
        className="z-50 max-w-[var(--available-width)] outline-none"
      >
        <BaseMenu.Popup
          {...props}
          className={twMerge(
            "border-border bg-background text-foreground box-border max-h-[var(--available-height)] w-[192px] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-y-auto rounded-[var(--radius-md)] border p-[4px] shadow-[var(--shadow-floating)] outline-none transition-[opacity,scale] duration-150 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
        />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export function MenuContent(props: ContentProps) {
  return <Content side="bottom" {...props} />;
}

export function MenuSubContent(props: ContentProps) {
  return <Content side="inline-end" {...props} />;
}

type MenuItemProps = Omit<
  BaseMenu.Item.Props,
  "className" | "children" | "closeOnClick"
> &
  ItemContentProps & { className?: string; destructive?: boolean };

export function MenuItem({
  children,
  icon,
  shortcut,
  className,
  destructive = false,
  ...props
}: MenuItemProps) {
  return (
    <BaseMenu.Item
      {...props}
      closeOnClick
      className={twMerge(
        itemClass,
        destructive
          ? "text-destructive"
          : "text-foreground [&>span:first-child[aria-hidden=true]]:text-muted-foreground",
        className,
      )}
    >
      <ItemContent icon={icon} shortcut={shortcut}>
        {children}
      </ItemContent>
    </BaseMenu.Item>
  );
}

export function MenuSeparator(
  props: Omit<BaseMenu.Separator.Props, "className"> & { className?: string },
) {
  const { className, ...rest } = props;
  return (
    <BaseMenu.Separator
      {...rest}
      className={twMerge("bg-border my-[4px] h-px", className)}
    />
  );
}

type RadioItemProps = Omit<
  BaseMenu.RadioItem.Props,
  "className" | "children" | "closeOnClick"
> &
  ItemContentProps & { className?: string };

export function MenuRadioItem({
  children,
  icon,
  shortcut,
  className,
  ...props
}: RadioItemProps) {
  const checkSide = useContext(MenuRadioCheckSideContext);
  const indicator = (
    <span
      aria-hidden="true"
      className="inline-flex size-[16px] shrink-0 items-center justify-center"
    >
      <BaseMenu.RadioItemIndicator>
        <Check size={16} strokeWidth={2.25} />
      </BaseMenu.RadioItemIndicator>
    </span>
  );
  return (
    <BaseMenu.RadioItem
      {...props}
      closeOnClick
      className={twMerge(itemClass, "text-foreground", className)}
    >
      {checkSide === "left" && indicator}
      <ItemContent icon={icon} shortcut={shortcut}>
        {children}
      </ItemContent>
      {checkSide === "right" && indicator}
    </BaseMenu.RadioItem>
  );
}

type SubTriggerProps = Omit<
  BaseMenu.SubmenuTrigger.Props,
  "className" | "children"
> &
  ItemContentProps & { className?: string };

export function MenuSubTrigger({
  children,
  icon,
  shortcut,
  className,
  openOnHover = false,
  ...props
}: SubTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger
      {...props}
      openOnHover={openOnHover}
      className={twMerge(
        itemClass,
        "text-foreground [&>span:first-child[aria-hidden=true]]:text-muted-foreground",
        className,
      )}
    >
      <ItemContent icon={icon} shortcut={shortcut}>
        {children}
      </ItemContent>
      <ChevronRight
        aria-hidden="true"
        size={16}
        strokeWidth={2.25}
        className="text-muted-foreground shrink-0 rtl:rotate-180"
      />
    </BaseMenu.SubmenuTrigger>
  );
}
