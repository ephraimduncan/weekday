"use client";
import React from "react";

import {
  type TargetAndTransition,
  type Transition,
  type Variant,
  type Variants,
  AnimatePresence,
  motion,
} from "motion/react";

import { cn } from "@/lib/utils";

export type PerType = "char" | "line" | "word";

export type PresetType = "blur" | "fade" | "fade-in-blur" | "scale" | "slide";

export type TextEffectProps = {
  children: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  containerTransition?: Transition;
  delay?: number;
  per?: PerType;
  preset?: PresetType;
  segmentTransition?: Transition;
  segmentWrapperClassName?: string;
  speedReveal?: number;
  speedSegment?: number;
  style?: React.CSSProperties;
  trigger?: boolean;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  line: 0.1,
  word: 0.05,
};

const defaultContainerVariants: Variants = {
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const defaultItemVariants: Variants = {
  exit: { opacity: 0 },
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0 },
      hidden: { filter: "blur(12px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0 },
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
  },
  "fade-in-blur": {
    container: defaultContainerVariants,
    item: {
      exit: { filter: "blur(12px)", opacity: 0, y: 20 },
      hidden: { filter: "blur(12px)", opacity: 0, y: 20 },
      visible: { filter: "blur(0px)", opacity: 1, y: 0 },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, scale: 0 },
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      exit: { opacity: 0, y: 20 },
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
  },
};

const AnimationComponent: React.FC<{
  per: "char" | "line" | "word";
  segment: string;
  variants: Variants;
  segmentWrapperClassName?: string;
}> = React.memo(({ per, segment, segmentWrapperClassName, variants }) => {
  const content =
    per === "line" ? (
      <motion.span className="block" variants={variants}>
        {segment}
      </motion.span>
    ) : per === "word" ? (
      <motion.span
        className="inline-block whitespace-pre"
        aria-hidden="true"
        variants={variants}
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className="inline-block whitespace-pre">
        {segment.split("").map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            className="inline-block whitespace-pre"
            aria-hidden="true"
            variants={variants}
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === "line" ? "block" : "inline-block";

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = "AnimationComponent";

const splitText = (text: string, per: "char" | "line" | "word") => {
  if (per === "line") return text.split("\n");
  return text.split(/(\s+)/);
};

const hasTransition = (
  variant: Variant,
): variant is TargetAndTransition & { transition?: Transition } => {
  return (
    typeof variant === "object" && variant !== null && "transition" in variant
  );
};

const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition },
): Variants => {
  if (!transition) return baseVariants;

  const { exit: _, ...mainTransition } = transition;

  return {
    ...baseVariants,
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(baseVariants.exit && hasTransition(baseVariants.exit)
          ? baseVariants.exit.transition
          : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(baseVariants.visible && hasTransition(baseVariants.visible)
          ? baseVariants.visible.transition
          : {}),
        ...mainTransition,
      },
    },
  };
};

export function TextEffect({
  as = "p",
  children,
  className,
  containerTransition,
  delay = 0,
  per = "word",
  preset = "fade",
  segmentTransition,
  segmentWrapperClassName,
  speedReveal = 1,
  speedSegment = 1,
  style,
  trigger = true,
  variants,
  onAnimationComplete,
  onAnimationStart,
}: TextEffectProps) {
  const segments = splitText(children, per);
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const baseVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const stagger = defaultStaggerTimes[per] / speedReveal;

  const baseDuration = 0.3 / speedSegment;

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.staggerChildren
    : undefined;

  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.delayChildren
    : undefined;

  const computedVariants = {
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        delayChildren: customDelay ?? delay,
        staggerChildren: customStagger ?? stagger,
        ...containerTransition,
        exit: {
          staggerChildren: customStagger ?? stagger,
          staggerDirection: -1,
        },
      },
    ),
    item: createVariantsWithTransition(variants?.item || baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition,
    }),
  };

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <MotionTag
          className={className}
          style={style}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          animate="visible"
          exit="exit"
          initial="hidden"
          variants={computedVariants.container}
        >
          {per !== "line" ? <span className="sr-only">{children}</span> : null}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              per={per}
              segment={segment}
              segmentWrapperClassName={segmentWrapperClassName}
              variants={computedVariants.item}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
