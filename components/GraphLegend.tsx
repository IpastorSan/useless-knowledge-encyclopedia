import { CATEGORY_COLORS } from "@/lib/utils";
import { ArticleCategory } from "@/lib/interfaces";

const categories = Object.entries(CATEGORY_COLORS) as [ArticleCategory, string][];

export function GraphLegend() {
  return (
    <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-3 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground mb-2">Categories</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {categories.map(([category, color]) => (
          <div key={category} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground">{category}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-2 pt-2 border-t">
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0 border-t-2 border-foreground/30 inline-block" />
          <span className="text-xs text-muted-foreground">Direct link</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-6 h-0 border-t-2 border-dashed border-foreground/20 inline-block" />
          <span className="text-xs text-muted-foreground">Shared tags</span>
        </div>
      </div>
    </div>
  );
}
