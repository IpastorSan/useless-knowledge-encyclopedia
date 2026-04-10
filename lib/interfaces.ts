export interface ArticleTag {
  name: string;
  slug: string;
}

export type ArticleCategory =
  | "Science"
  | "Mathematics"
  | "AI"
  | "Humanities"
  | "Psychology"
  | "Art"
  | "Philosophy"
  | "Physics";

export interface Article {
  title: string;
  slug: string;
  subtitle: string;
  date: string;
  tags: ArticleTag[];
  category: ArticleCategory;
  coverImage?: string;
  readingTime: number;
  relatedSlugs: string[];
}

export interface ArticleFull extends Article {
  content: string;
  seo?: {
    title: string;
    description: string;
  };
}

export interface GraphNode {
  id: string;
  name: string;
  category: ArticleCategory;
  val: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type: "explicit" | "shared-tags";
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}
