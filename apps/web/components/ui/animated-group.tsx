"use client";
import React, { type ReactNode } from "react";

import { type Variants, motion } from "motion/react";

export type AnimatedGroupProps = {
  children: ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  asChild?: keyof React.JSX.IntrinsicElements;
  className?: string;
  preset?: PresetType;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
};

export type PresetType =
  | "blur"
  | "blur-slide"
  | "bounce"
  | "fade"
  | "flip"
  | "rotate"
  | "scale"
  | "slide"
  | "swing"
  | "zoom";

const defaultContainerVariants: Variants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const presetVariants: Record<PresetType, Variants> = {
  blur: {
    hidden: { filter: "blur(4px)" },
    visible: { filter: "blur(0px)" },
  },
  "blur-slide": {
    hidden: { filter: "blur(4px)", y: 20 },
    visible: { filter: "blur(0px)", y: 0 },
  },
  bounce: {
    hidden: { y: -50 },
    visible: {
      transition: { damping: 10, stiffness: 400, type: "spring" },
      y: 0,
    },
  },
  fade: {},
  flip: {
    hidden: { rotateX: -90 },
    visible: {
      rotateX: 0,
      transition: { damping: 20, stiffness: 300, type: "spring" },
    },
  },
  rotate: {
    hidden: { rotate: -180 },
    visible: {
      rotate: 0,
      transition: { damping: 15, stiffness: 200, type: "spring" },
    },
  },
  scale: {
    hidden: { scale: 0.8 },
    visible: { scale: 1 },
  },
  slide: {
    hidden: { y: 20 },
    visible: { y: 0 },
  },
  swing: {
    hidden: { rotate: -10 },
    visible: {
      rotate: 0,
      transition: { damping: 8, stiffness: 300, type: "spring" },
    },
  },
  zoom: {
    hidden: { scale: 0.5 },
    visible: {
      scale: 1,
      transition: { damping: 20, stiffness: 300, type: "spring" },
    },
  },
};

const addDefaultVariants = (variants: Variants) => ({
  hidden: { ...defaultItemVariants.hidden, ...variants.hidden },
  visible: { ...defaultItemVariants.visible, ...variants.visible },
});

function AnimatedGroup({
  as = "div",
  asChild = "div",
  children,
  className,
  preset,
  variants,
}: AnimatedGroupProps) {
  const selectedVariants = {
    container: addDefaultVariants(defaultContainerVariants),
    item: addDefaultVariants(preset ? presetVariants[preset] : {}),
  };
  const containerVariants = variants?.container || selectedVariants.container;
  const itemVariants = variants?.item || selectedVariants.item;

  const MotionComponent = React.useMemo(() => {
    return motion[as as keyof typeof motion] as any;
  }, [as]);

  const MotionChild = React.useMemo(() => {
    return motion[asChild as keyof typeof motion] as any;
  }, [asChild]);

  return (
    <MotionComponent
      className={className}
      animate="visible"
      initial="hidden"
      variants={containerVariants}
    >
      {React.Children.map(children, (child, index) => (
        <MotionChild key={index} variants={itemVariants}>
          {child}
        </MotionChild>
      ))}
    </MotionComponent>
  );
}

export { AnimatedGroup };
