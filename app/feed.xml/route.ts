import { getAllArticles } from "@/lib/articles";

export async function GET() {
  const articles = await getAllArticles();
  const baseUrl = "https://useless-knowledge.dev";

  const items = articles
    .map(
      (article) => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${baseUrl}/blog/${article.slug}</link>
      <description><![CDATA[${article.subtitle}]]></description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}/blog/${article.slug}</guid>
      <category>${article.category}</category>
      ${article.tags.map((t) => `<category>${t.name}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const feed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Useless Knowledge Encyclopedia</title>
    <link>${baseUrl}</link>
    <description>Fighting against brainrot through active learning. Essays on science, math, AI, humanities, and more.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(feed.trim(), {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
