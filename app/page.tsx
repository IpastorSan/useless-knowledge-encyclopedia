import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArticleCard } from "@/components/ArticleCard";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { getArticles } from "@/lib/articles";
import { buildGraphData } from "@/lib/graph";
import { CATEGORY_COLORS } from "@/lib/utils";
import { ArticleCategory } from "@/lib/interfaces";

export default async function HomePage() {
  const recentArticles = await getArticles(6);
  const graphData = await buildGraphData();

  const categories = Object.entries(CATEGORY_COLORS) as [
    ArticleCategory,
    string,
  ][];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.95_0.03_65)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full border-2 border-primary bg-primary/5 flex items-center justify-center">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4 tracking-tight">
            Useless Knowledge
            <br />
            <span className="text-primary">Encyclopedia</span>
          </h1>

          <p className="text-lg text-muted-foreground italic mb-2">
            &ldquo;Pugnatio contra putredinem cerebri&rdquo;
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Fighting against brainrot &mdash; one essay at a time
          </p>

          <div className="flex justify-center mb-8">
            <div className="w-16 h-0.5 bg-accent rounded-full" />
          </div>

          <div className="flex justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/blog">
                Read Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/graph">Explore the Graph</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-heading font-bold">
                Recent Essays
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link href="/blog">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentArticles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Knowledge Graph Preview */}
      {graphData.nodes.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading font-bold mb-2">
                Knowledge Graph
              </h2>
              <p className="text-muted-foreground text-sm">
                How the ideas connect. Click a node to read the article.
              </p>
            </div>
            <div className="border rounded-xl overflow-hidden bg-card">
              <KnowledgeGraph graphData={graphData} height={350} mini />
            </div>
            <div className="text-center mt-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/graph">Open full graph</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-heading font-bold mb-6 text-center">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map(([category, color]) => (
              <Link key={category} href={`/blog?category=${category}`}>
                <Badge
                  variant="outline"
                  className="text-sm py-1.5 px-4 cursor-pointer transition-colors hover:opacity-80"
                  style={{
                    borderColor: color,
                    color: color,
                  }}
                >
                  {category}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
