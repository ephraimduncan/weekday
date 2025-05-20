"use client";

import { useEffect, useState } from "react";

import { type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ScrollButtonProps = {
  containerRef: React.RefObject<HTMLElement | null>;
  scrollRef: React.RefObject<HTMLElement | null>;
  className?: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  threshold?: number;
  variant?: VariantProps<typeof buttonVariants>["variant"];
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function ScrollButton({
  className,
  containerRef,
  scrollRef,
  size = "sm",
  threshold = 100,
  variant = "outline",
  ...props
}: ScrollButtonProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { clientHeight, scrollHeight, scrollTop } = containerRef.current;
        setIsVisible(scrollTop + clientHeight < scrollHeight - threshold);
      }
    };

    const container = containerRef.current;

    if (container) {
      container.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [containerRef, threshold]);

  const handleScroll = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        behavior: "smooth",
        top: containerRef.current.scrollHeight,
      });
    }
  };

  return (
    <Button
      size={size}
      variant={variant}
      className={cn(
        "h-8 w-8 rounded-full transition-all duration-150 ease-out",
        isVisible
          ? "translate-y-0 scale-100 opacity-100"
          : "pointer-events-none translate-y-4 scale-95 opacity-0",
        className,
      )}
      onClick={handleScroll}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
    </Button>
  );
}

export { ScrollButton };
