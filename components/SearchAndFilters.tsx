"use client";

import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article, ArticleCategory } from "@/lib/interfaces";
import { getCategoryColor } from "@/lib/utils";

const ALL_CATEGORIES: ArticleCategory[] = [
  "Science",
  "Physics",
  "Mathematics",
  "AI",
  "Humanities",
  "Psychology",
  "Art",
  "Philosophy",
];

interface SearchAndFiltersProps {
  articles: Article[];
  onFilter: (filtered: Article[]) => void;
}

export function SearchAndFilters({ articles, onFilter }: SearchAndFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const query = searchParams.get("q") || "";
  const selectedCategory = searchParams.get("category") || "";
  const selectedTags = searchParams.get("tags")?.split(",").filter(Boolean) || [];

  const allTags = useMemo(() => {
    const tagMap = new Map<string, string>();
    for (const article of articles) {
      for (const tag of article.tags) {
        if (!tagMap.has(tag.slug)) {
          tagMap.set(tag.slug, tag.name);
        }
      }
    }
    return Array.from(tagMap.entries()).map(([slug, name]) => ({ slug, name }));
  }, [articles]);

  const availableCategories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category));
    return ALL_CATEGORIES.filter((c) => cats.has(c));
  }, [articles]);

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      const str = params.toString();
      router.replace(str ? `?${str}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  // Filter articles based on current params
  const filtered = useMemo(() => {
    let result = articles;

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.subtitle.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      result = result.filter((a) =>
        selectedTags.every((t) => a.tags.some((at) => at.slug === t))
      );
    }

    return result;
  }, [articles, query, selectedCategory, selectedTags]);

  // Notify parent of filter changes
  useMemo(() => {
    onFilter(filtered);
  }, [filtered, onFilter]);

  const hasFilters = query || selectedCategory || selectedTags.length > 0;

  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search articles..."
          value={query}
          onChange={(e) => updateParams({ q: e.target.value || null })}
          className="pl-10"
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category) => {
          const isActive = selectedCategory === category;
          const color = getCategoryColor(category);
          return (
            <Badge
              key={category}
              variant={isActive ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              style={
                isActive
                  ? { backgroundColor: color, borderColor: color, color: "white" }
                  : { borderColor: `${color}50`, color }
              }
              onClick={() =>
                updateParams({
                  category: isActive ? null : category,
                })
              }
            >
              {category}
            </Badge>
          );
        })}
      </div>

      {/* Tag filters */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isActive = selectedTags.includes(tag.slug);
            return (
              <Badge
                key={tag.slug}
                variant={isActive ? "default" : "secondary"}
                className="cursor-pointer text-xs"
                onClick={() => {
                  const next = isActive
                    ? selectedTags.filter((t) => t !== tag.slug)
                    : [...selectedTags, tag.slug];
                  updateParams({
                    tags: next.length > 0 ? next.join(",") : null,
                  });
                }}
              >
                {tag.name}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Clear filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => updateParams({ q: null, category: null, tags: null })}
          className="text-muted-foreground"
        >
          <X className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
