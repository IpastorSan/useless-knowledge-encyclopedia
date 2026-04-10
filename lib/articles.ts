import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import readingTime from "reading-time";
import {
  Article,
  ArticleFull,
  ArticleCategory,
  ArticleTag,
} from "./interfaces";

const ARTICLES_DIRECTORY = path.join(process.cwd(), "content/articles");

interface FrontMatter {
  title: string;
  subtitle: string;
  date: string;
  tags: string[];
  category: ArticleCategory;
  coverImage?: string;
  readingTime?: number;
  relatedSlugs?: string[];
  seo?: {
    title?: string;
    description?: string;
  };
}

function parseTags(tags: string[]): ArticleTag[] {
  return tags.map((tag) => ({
    name: tag,
    slug: tag.toLowerCase().replace(/\s+/g, "-"),
  }));
}

function getMarkdownFiles(): string[] {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) {
    return [];
  }
  return fs
    .readdirSync(ARTICLES_DIRECTORY)
    .filter((file) => file.endsWith(".md"));
}

export async function getAllArticles(): Promise<Article[]> {
  const files = getMarkdownFiles();

  const articles = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(ARTICLES_DIRECTORY, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const frontMatter = data as FrontMatter;

    const readTime =
      frontMatter.readingTime ?? Math.ceil(readingTime(content).minutes);

    return {
      title: frontMatter.title,
      slug,
      subtitle: frontMatter.subtitle,
      date: frontMatter.date,
      tags: parseTags(frontMatter.tags || []),
      category: frontMatter.category,
      coverImage: frontMatter.coverImage,
      readingTime: readTime,
      relatedSlugs: frontMatter.relatedSlugs || [],
    };
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export async function getArticles(limit: number = 6): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.slice(0, limit);
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleFull | null> {
  const filePath = path.join(ARTICLES_DIRECTORY, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const frontMatter = data as FrontMatter;

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  const readTime =
    frontMatter.readingTime ?? Math.ceil(readingTime(content).minutes);

  return {
    title: frontMatter.title,
    slug,
    subtitle: frontMatter.subtitle,
    date: frontMatter.date,
    tags: parseTags(frontMatter.tags || []),
    category: frontMatter.category,
    coverImage: frontMatter.coverImage,
    readingTime: readTime,
    relatedSlugs: frontMatter.relatedSlugs || [],
    content: contentHtml,
    seo: frontMatter.seo
      ? {
          title: frontMatter.seo.title || frontMatter.title,
          description: frontMatter.seo.description || frontMatter.subtitle,
        }
      : undefined,
  };
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const files = getMarkdownFiles();
  return files.map((file) => file.replace(/\.md$/, ""));
}

export async function getArticlesByCategory(
  category: ArticleCategory
): Promise<Article[]> {
  const allArticles = await getAllArticles();
  return allArticles.filter((a) => a.category === category);
}

export async function getAllCategories(): Promise<ArticleCategory[]> {
  const allArticles = await getAllArticles();
  const categories = new Set(allArticles.map((a) => a.category));
  return Array.from(categories);
}

export async function getAllTags(): Promise<ArticleTag[]> {
  const allArticles = await getAllArticles();
  const tagMap = new Map<string, ArticleTag>();
  for (const article of allArticles) {
    for (const tag of article.tags) {
      if (!tagMap.has(tag.slug)) {
        tagMap.set(tag.slug, tag);
      }
    }
  }
  return Array.from(tagMap.values());
}
