import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BlogPostContent } from "@/components/BlogPostContent";
import { ArticleCard } from "@/components/ArticleCard";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getAllArticles,
} from "@/lib/articles";
import { buildGraphData, filterGraphForArticle } from "@/lib/graph";
import { formatDate, getCategoryColor } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.subtitle,
    keywords: post.tags?.map((tag) => tag.name) || [],
    openGraph: {
      title: `${post.title} | Useless Knowledge Encyclopedia`,
      description: post.seo?.description || post.subtitle,
      type: "article",
      publishedTime: post.date,
      authors: ["Ignacio Pastor Sanchez"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.seo?.description || post.subtitle,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);

  if (!post) {
    notFound();
  }

  const allArticles = await getAllArticles();
  const relatedArticles = allArticles
    .filter((a) => post.relatedSlugs.includes(a.slug))
    .slice(0, 3);

  const graphData = await buildGraphData();
  const miniGraph = filterGraphForArticle(graphData, slug);

  const categoryColor = getCategoryColor(post.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.seo?.description || post.subtitle,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Ignacio Pastor Sanchez",
    },
    publisher: {
      "@type": "Person",
      name: "Ignacio Pastor Sanchez",
    },
    keywords: post.tags?.map((t) => t.name).join(", "),
  };

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <div className="container mx-auto px-4 pt-8 pb-12">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Articles
            </Link>
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Category + Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant="outline"
              style={{
                borderColor: categoryColor,
                color: categoryColor,
                backgroundColor: `${categoryColor}10`,
              }}
            >
              {post.category}
            </Badge>
            {post.tags?.map((tag) => (
              <Badge key={tag.slug} variant="secondary" className="text-xs">
                {tag.name}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-muted-foreground mb-6">{post.subtitle}</p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pb-8 border-b">
            <span className="font-medium text-foreground">
              Ignacio Pastor Sanchez
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.date)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime} min read
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <BlogPostContent html={post.content} />
        </div>
      </div>

      {/* Mini Graph */}
      {miniGraph.nodes.length > 1 && (
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-heading font-bold mb-4">
              Connected Ideas
            </h3>
            <div className="border rounded-xl overflow-hidden bg-card">
              <KnowledgeGraph
                graphData={miniGraph}
                height={250}
                highlightSlug={slug}
                mini
              />
            </div>
          </div>
        </div>
      )}

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div className="bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-xl font-heading font-bold mb-6">
                Related Articles
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Back */}
      <div className="container mx-auto px-4 py-12 text-center">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Articles
          </Link>
        </Button>
      </div>
    </article>
  );
}
