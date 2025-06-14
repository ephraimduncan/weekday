import { memo, useId, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";

import { marked } from "marked";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

import { CodeBlock, CodeBlockCode } from "./code-block";

export type MarkdownProps = {
  children: string;
  id?: string;
  className?: string;
  components?: Partial<Components>;
};

// SECURITY: Sanitize markdown content to prevent XSS and data exfiltration
function sanitizeMarkdown(content: string): string {
  // Remove potentially dangerous image tags that could be used for data exfiltration
  const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
  let sanitized = content.replace(imagePattern, (match, altText, url) => {
    // Only allow safe image sources
    const safeImageSources = [
      /^data:image\//,
      /^https:\/\/images\.unsplash\.com/,
      /^https:\/\/via\.placeholder\.com/,
      // Add other trusted image domains as needed
    ];
    
    const isSafeUrl = safeImageSources.some(pattern => pattern.test(url));
    
    if (isSafeUrl) {
      return match; // Keep safe images
    } else {
      return `[Image removed for security: ${altText || 'untitled'}]`;
    }
  });
  
  // Remove potentially dangerous HTML/script tags if they somehow get through
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '[Script removed for security]');
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '[Iframe removed for security]');
  
  // Remove data: URLs that could be used for exfiltration (except safe image data URLs)
  sanitized = sanitized.replace(/\[([^\]]*)\]\(data:(?!image\/)[^)]+\)/g, '[Link removed for security: $1]');
  
  return sanitized;
}

function parseMarkdownIntoBlocks(markdown: string): string[] {
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

function extractLanguage(className?: string): string {
  if (!className) return "plaintext";
  const match = className.match(/language-(\w+)/);
  return match && match[1] ? match[1] : "plaintext";
}

const INITIAL_COMPONENTS: Partial<Components> = {
  code: function CodeComponent({ children, className, ...props }) {
    const isInline =
      !props.node?.position?.start.line ||
      props.node?.position?.start.line === props.node?.position?.end.line;

    if (isInline) {
      return (
        <span
          className={cn(
            "bg-primary-foreground rounded-sm px-1 font-mono text-sm",
            className,
          )}
          {...props}
        >
          {children}
        </span>
      );
    }

    const language = extractLanguage(className);

    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    );
  },
  pre: function PreComponent({ children }) {
    return <>{children}</>;
  },
  // SECURITY: Override link component to add security attributes
  a: function LinkComponent({ href, children, ...props }) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        {...props}
      >
        {children}
      </a>
    );
  },
  // SECURITY: Override image component to add security attributes
  img: function ImageComponent({ src, alt, ...props }) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        {...props}
      />
    );
  },
};

const MemoizedMarkdownBlock = memo(
  function MarkdownBlock({
    components = INITIAL_COMPONENTS,
    content,
  }: {
    content: string;
    components?: Partial<Components>;
  }) {
    return (
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm, remarkBreaks]}
      >
        {content}
      </ReactMarkdown>
    );
  },
  function propsAreEqual(prevProps, nextProps) {
    return prevProps.content === nextProps.content;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

function MarkdownComponent({
  id,
  children,
  className,
  components = INITIAL_COMPONENTS,
}: MarkdownProps) {
  const generatedId = useId();
  const blockId = id ?? generatedId;
  
  // SECURITY: Sanitize content before processing
  const sanitizedChildren = sanitizeMarkdown(children);
  const blocks = useMemo(() => parseMarkdownIntoBlocks(sanitizedChildren), [sanitizedChildren]);

  return (
    <div className={className}>
      {blocks.map((block, index) => (
        <MemoizedMarkdownBlock
          key={`${blockId}-block-${index}`}
          components={components}
          content={block}
        />
      ))}
    </div>
  );
}

const Markdown = memo(MarkdownComponent);
Markdown.displayName = "Markdown";

export { Markdown };
