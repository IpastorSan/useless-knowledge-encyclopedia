import Link from "next/link";
import { BookOpen, Rss } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground italic">
              &ldquo;Pugnatio contra putredinem cerebri&rdquo;
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/feed.xml"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Rss className="h-4 w-4" />
              RSS
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">
            Fighting against brainrot since 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
