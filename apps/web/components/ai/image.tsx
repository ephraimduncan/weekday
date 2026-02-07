import type { GeneratedFile } from "ai";

import { cn } from "@/lib/utils";

export type ImageProps = GeneratedFile & {
  alt?: string;
  className?: string;
};

export const Image = ({
  base64,
  mediaType,
  uint8Array,
  ...props
}: ImageProps) => (
  <img
    {...props}
    className={cn(
      "h-auto max-w-full overflow-hidden rounded-md",
      props.className,
    )}
    alt={props.alt}
    src={`data:${mediaType};base64,${base64}`}
  />
);
