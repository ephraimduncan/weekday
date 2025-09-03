"use client";

import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { CheckIcon, CopyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CodeBlockContextType = {
  code: string;
};

const CodeBlockContext = createContext<CodeBlockContextType>({
  code: "",
});

export type CodeBlockProps = HTMLAttributes<HTMLDivElement> & {
  code: string;
  language: string;
  children?: ReactNode;
  showLineNumbers?: boolean;
};

export const CodeBlock = ({
  children,
  className,
  code,
  language,
  showLineNumbers = false,
  ...props
}: CodeBlockProps) => (
  <CodeBlockContext.Provider value={{ code }}>
    <div
      className={cn(
        "bg-background text-foreground relative w-full overflow-hidden rounded-md border",
        className,
      )}
      {...props}
    >
      <div className="relative">
        <SyntaxHighlighter
          className="overflow-hidden dark:hidden"
          style={oneLight}
          codeTagProps={{
            className: "font-mono text-sm",
          }}
          customStyle={{
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            fontSize: "0.875rem",
            margin: 0,
            padding: "1rem",
          }}
          language={language}
          lineNumberStyle={{
            color: "hsl(var(--muted-foreground))",
            minWidth: "2.5rem",
            paddingRight: "1rem",
          }}
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>
        <SyntaxHighlighter
          className="hidden overflow-hidden dark:block"
          style={oneDark}
          codeTagProps={{
            className: "font-mono text-sm",
          }}
          customStyle={{
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            fontSize: "0.875rem",
            margin: 0,
            padding: "1rem",
          }}
          language={language}
          lineNumberStyle={{
            color: "hsl(var(--muted-foreground))",
            minWidth: "2.5rem",
            paddingRight: "1rem",
          }}
          showLineNumbers={showLineNumbers}
        >
          {code}
        </SyntaxHighlighter>
        {children && (
          <div className="absolute top-2 right-2 flex items-center gap-2">
            {children}
          </div>
        )}
      </div>
    </div>
  </CodeBlockContext.Provider>
);

export type CodeBlockCopyButtonProps = ComponentProps<typeof Button> & {
  timeout?: number;
  onCopy?: () => void;
  onError?: (error: Error) => void;
};

export const CodeBlockCopyButton = ({
  children,
  className,
  timeout = 2000,
  onCopy,
  onError,
  ...props
}: CodeBlockCopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const { code } = useContext(CodeBlockContext);

  const copyToClipboard = async () => {
    if (typeof window === "undefined" || !navigator.clipboard.writeText) {
      onError?.(new Error("Clipboard API not available"));
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const Icon = isCopied ? CheckIcon : CopyIcon;

  return (
    <Button
      size="icon"
      variant="ghost"
      className={cn("shrink-0", className)}
      onClick={copyToClipboard}
      {...props}
    >
      {children ?? <Icon size={14} />}
    </Button>
  );
};
