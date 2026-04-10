import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-heading font-bold mb-4">Article Not Found</h1>
      <p className="text-muted-foreground mb-8">
        This essay doesn&apos;t exist yet. Maybe you should write it?
      </p>
      <Button asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Browse All Articles
        </Link>
      </Button>
    </div>
  );
}
