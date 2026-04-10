"use client";

import { useState, useCallback } from "react";
import { Article } from "@/lib/interfaces";
import { ArticleCard } from "@/components/ArticleCard";
import { SearchAndFilters } from "@/components/SearchAndFilters";

interface ArticleListContentProps {
  articles: Article[];
}

export function ArticleListContent({ articles }: ArticleListContentProps) {
  const [filtered, setFiltered] = useState<Article[]>(articles);

  const handleFilter = useCallback((result: Article[]) => {
    setFiltered(result);
  }, []);

  return (
    <div>
      <SearchAndFilters articles={articles} onFilter={handleFilter} />

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-1">No articles found.</p>
          <p className="text-sm">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
