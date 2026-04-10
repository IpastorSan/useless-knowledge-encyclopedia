@AGENTS.md

# Useless Knowledge Encyclopedia

## Overview

A personal blog/encyclopedia for active learning through essays on diverse topics. Built with Next.js 16, Tailwind CSS v4, and shadcn/ui.

## Commands

- `npm run dev` — Start dev server with Turbopack
- `npm run build` — Production build
- `npm run lint` — ESLint

## Architecture

- **Next.js App Router** with TypeScript
- **Tailwind CSS v4** (CSS-first config in `globals.css`, no `tailwind.config.ts`)
- **shadcn/ui** (radix-nova style)
- **Markdown blog** (no backend) — articles in `content/articles/` parsed with `gray-matter` + `remark`
- **Knowledge graph** — `react-force-graph-2d` visualization of article relationships

## Content System

Articles are markdown files in `content/articles/`. Required frontmatter:

```yaml
title: "Article Title"
subtitle: "Brief description"
date: "YYYY-MM-DD"
category: "Physics"  # One of: Science, Mathematics, AI, Humanities, Psychology, Art, Philosophy, Physics
tags: ["tag1", "tag2"]
relatedSlugs: ["other-article-slug"]  # Optional, for knowledge graph edges
readingTime: 8  # Optional, auto-calculated if omitted
seo:  # Optional
  title: "SEO title"
  description: "SEO description"
```

## Key Files

- `lib/articles.ts` — Article parsing and retrieval
- `lib/graph.ts` — Knowledge graph data builder
- `lib/interfaces.ts` — TypeScript types
- `lib/utils.ts` — Utilities + category colors
- `components/KnowledgeGraph.tsx` — Force-directed graph visualization
- `components/BlogPostContent.tsx` — Markdown renderer with syntax highlighting
- `components/SearchAndFilters.tsx` — Article search and filtering

## Graph System

Articles connect via:
1. **Explicit links** — `relatedSlugs` in frontmatter (solid lines in graph)
2. **Shared tags** — Auto-computed when 2+ tags overlap (dashed lines in graph)
