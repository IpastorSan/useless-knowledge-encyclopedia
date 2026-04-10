import { getAllArticles } from "./articles";
import { GraphData, GraphLink, GraphNode } from "./interfaces";

export async function buildGraphData(): Promise<GraphData> {
  const articles = await getAllArticles();

  const nodes: GraphNode[] = articles.map((article) => ({
    id: article.slug,
    name: article.title,
    category: article.category,
    val: 1,
  }));

  const slugSet = new Set(articles.map((a) => a.slug));
  const linkMap = new Map<string, GraphLink>();

  function linkKey(a: string, b: string): string {
    return [a, b].sort().join("--");
  }

  // Explicit links from relatedSlugs (bidirectional, strength 1.0)
  for (const article of articles) {
    for (const related of article.relatedSlugs) {
      if (!slugSet.has(related)) continue;
      const key = linkKey(article.slug, related);
      if (!linkMap.has(key)) {
        linkMap.set(key, {
          source: article.slug,
          target: related,
          type: "explicit",
          strength: 1.0,
        });
      }
    }
  }

  // Shared-tag links (require 2+ shared tags)
  for (let i = 0; i < articles.length; i++) {
    for (let j = i + 1; j < articles.length; j++) {
      const a = articles[i];
      const b = articles[j];
      const key = linkKey(a.slug, b.slug);

      // Skip if explicit link already exists
      if (linkMap.has(key)) continue;

      const aTags = new Set(a.tags.map((t) => t.slug));
      const sharedCount = b.tags.filter((t) => aTags.has(t.slug)).length;

      if (sharedCount >= 2) {
        const strength = Math.min(0.3 + (sharedCount - 2) * 0.1, 0.7);
        linkMap.set(key, {
          source: a.slug,
          target: b.slug,
          type: "shared-tags",
          strength,
        });
      }
    }
  }

  const links = Array.from(linkMap.values());

  // Calculate node size based on connection count
  const connectionCount = new Map<string, number>();
  for (const link of links) {
    connectionCount.set(
      link.source,
      (connectionCount.get(link.source) || 0) + 1
    );
    connectionCount.set(
      link.target,
      (connectionCount.get(link.target) || 0) + 1
    );
  }

  for (const node of nodes) {
    node.val = 1 + (connectionCount.get(node.id) || 0);
  }

  return { nodes, links };
}

export function filterGraphForArticle(
  graphData: GraphData,
  slug: string
): GraphData {
  const connectedSlugs = new Set<string>([slug]);

  for (const link of graphData.links) {
    if (link.source === slug) connectedSlugs.add(link.target);
    if (link.target === slug) connectedSlugs.add(link.source);
  }

  return {
    nodes: graphData.nodes.filter((n) => connectedSlugs.has(n.id)),
    links: graphData.links.filter(
      (l) => connectedSlugs.has(l.source) && connectedSlugs.has(l.target)
    ),
  };
}
