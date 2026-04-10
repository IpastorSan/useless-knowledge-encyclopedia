import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Article } from "@/lib/interfaces";
import { formatDate, getCategoryColor } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const categoryColor = getCategoryColor(article.category);

  return (
    <Link href={`/blog/${article.slug}`}>
      <Card className="h-full transition-all duration-300 hover:shadow-warm hover:-translate-y-0.5 hover:border-primary/30">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-xs font-medium"
              style={{
                borderColor: categoryColor,
                color: categoryColor,
                backgroundColor: `${categoryColor}10`,
              }}
            >
              {article.category}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {article.subtitle}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readingTime} min read
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag.slug}
                variant="secondary"
                className="text-xs"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
