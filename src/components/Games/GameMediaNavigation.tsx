import React, { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const Variants = cva(
  "absolute  top-1/2 transform -translate-y-1/2  bg-neutral-800 bg_opacity-50 rounded-2xl",
  {
    variants: {
      variant: {
        left: "left-4",
        right: "right-4",
      },
    },
    defaultVariants: {
      variant: "left",
    },
  }
);

export interface Props extends VariantProps<typeof Variants> {
  children: ReactNode;
  className?: string;
}

function GameMediaNavigation({ children, variant, className }: Props) {
  return <div className={cn(Variants({ variant, className }))}>{children}</div>;
}

export default GameMediaNavigation;
