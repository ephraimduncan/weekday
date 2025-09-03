"use client";

import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type ActionsProps = ComponentProps<"div">;

export const Actions = ({ children, className, ...props }: ActionsProps) => (
  <div className={cn("flex items-center gap-1", className)} {...props}>
    {children}
  </div>
);

export type ActionProps = ComponentProps<typeof Button> & {
  label?: string;
  tooltip?: string;
};

export const Action = ({
  children,
  className,
  label,
  size = "sm",
  tooltip,
  variant = "ghost",
  ...props
}: ActionProps) => {
  const button = (
    <Button
      size={size}
      variant={variant}
      className={cn(
        "text-muted-foreground hover:text-foreground relative size-9 p-1.5",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
      <span className="sr-only">{label || tooltip}</span>
    </Button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p>{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};
