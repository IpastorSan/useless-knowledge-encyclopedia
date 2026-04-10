import { Metadata } from "next";
import { Suspense } from "react";
import { getAllArticles } from "@/lib/articles";
import { ArticleListContent } from "@/components/ArticleListContent";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Browse all essays in the Useless Knowledge Encyclopedia. Science, math, AI, humanities, and more.",
  openGraph: {
    title: "Articles | Useless Knowledge Encyclopedia",
    description:
      "Browse all essays. Science, math, AI, humanities, and more.",
  },
};

export default async function BlogPage() {
  const articles = await getAllArticles();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">All Articles</h1>
        <p className="text-muted-foreground">
          {articles.length} essay{articles.length !== 1 ? "s" : ""} and counting.
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ArticleListContent articles={articles} />
      </Suspense>
    </div>
  );
}
