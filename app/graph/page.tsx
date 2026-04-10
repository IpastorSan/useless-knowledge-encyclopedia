import { Metadata } from "next";
import { buildGraphData } from "@/lib/graph";
import { KnowledgeGraph } from "@/components/KnowledgeGraph";
import { GraphLegend } from "@/components/GraphLegend";

export const metadata: Metadata = {
  title: "Knowledge Graph",
  description:
    "Explore the connections between ideas in the Useless Knowledge Encyclopedia. An interactive visualization of how topics relate.",
};

export default async function GraphPage() {
  const graphData = await buildGraphData();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-heading font-bold mb-2">
          Knowledge Graph
        </h1>
        <p className="text-muted-foreground">
          An interactive map of how ideas connect across the encyclopedia. Click
          a node to read the article. Drag to rearrange.
        </p>
      </div>

      <div className="relative border rounded-xl overflow-hidden bg-card">
        <KnowledgeGraph graphData={graphData} height={600} />
        <div className="absolute bottom-4 left-4">
          <GraphLegend />
        </div>
      </div>
    </div>
  );
}
