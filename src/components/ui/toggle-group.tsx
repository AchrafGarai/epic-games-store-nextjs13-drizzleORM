"use client";
import * as React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
const toggleGroupVariants = cva(
  "flex gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        inline: "flex-col w-full ",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const toggleItemVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
      align: {
        default: "justify-center",
        left: "justify-start",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const ToggleGroupRoot = React.forwardRef<
  React.ElementRef<typeof ToggleGroup.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroup.Root> &
    VariantProps<typeof toggleGroupVariants>
>(({ className, variant, ...props }, ref) => (
  <ToggleGroup.Root
    ref={ref}
    className={cn(toggleGroupVariants({ variant, className }))}
    {...props}
  />
));
ToggleGroupRoot.displayName = ToggleGroup.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroup.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroup.Item> &
    VariantProps<typeof toggleItemVariants>
>(({ className, variant, align, size, ...props }, ref) => (
  <ToggleGroup.Item
    ref={ref}
    className={cn(toggleItemVariants({ variant, size, align, className }))}
    {...props}
  >
    {props.children}
  </ToggleGroup.Item>
));

ToggleGroupItem.displayName = ToggleGroup.Item.displayName;

export {
  ToggleGroupRoot,
  ToggleGroupItem,
  toggleItemVariants,
  toggleGroupVariants,
};
