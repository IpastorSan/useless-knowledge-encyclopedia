"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-latex";

interface BlogPostContentProps {
  html: string;
}

export function BlogPostContent({ html }: BlogPostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      Prism.highlightAllUnder(contentRef.current);

      // Make external links open in new tab
      const links = contentRef.current.querySelectorAll("a");
      links.forEach((link) => {
        if (
          link.hostname !== window.location.hostname &&
          !link.getAttribute("target")
        ) {
          link.setAttribute("target", "_blank");
          link.setAttribute("rel", "noopener noreferrer");
        }
      });
    }
  }, [html]);

  return (
    <div
      ref={contentRef}
      className="prose prose-lg max-w-none
        prose-headings:font-heading prose-headings:font-bold prose-headings:text-foreground
        prose-p:text-foreground/90 prose-p:leading-relaxed
        prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        prose-code:text-primary prose-code:font-mono
        prose-pre:bg-[oklch(0.20_0.015_55)] prose-pre:rounded-xl
        prose-img:rounded-xl prose-img:shadow-md
        prose-table:border prose-th:bg-muted prose-th:p-3 prose-td:p-3
        prose-hr:border-border
        prose-li:text-foreground/90"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
