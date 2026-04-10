import { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About",
  description:
    "About the Useless Knowledge Encyclopedia - fighting against brainrot through active learning.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* About the project */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold">
            About the Encyclopedia
          </h1>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <p>
            The <strong>Useless Knowledge Encyclopedia</strong> is a personal
            project born from a simple idea: the best way to learn something is
            to write about it.
          </p>

          <p>
            In an age of infinite scrolling and shrinking attention spans, this
            is my small rebellion. Each essay here is the result of diving deep
            into a topic &mdash; physics, mathematics, artificial intelligence,
            philosophy, psychology, art, or whatever catches my curiosity &mdash;
            and trying to explain it in a way that&apos;s both rigorous and
            actually enjoyable to read.
          </p>

          <h2 className="font-heading">The Motto</h2>

          <blockquote>
            <p>
              <em>&ldquo;Pugnatio contra putredinem cerebri&rdquo;</em>
            </p>
          </blockquote>

          <p>
            Latin for &ldquo;fighting against brainrot.&rdquo; It sounds much
            more dignified in a dead language, which is exactly the kind of
            energy this project is going for: taking learning seriously without
            taking ourselves too seriously.
          </p>

          <p>
            Think of it as a university that only offers electives you&apos;d
            actually want to take.
          </p>

          <h2 className="font-heading">The Knowledge Graph</h2>

          <p>
            One of the things I find most fascinating about knowledge is how
            everything connects. The{" "}
            <Link href="/graph" className="text-primary hover:underline">
              knowledge graph
            </Link>{" "}
            on this site visualizes the relationships between articles &mdash;
            how entropy connects to information theory, how neural networks
            relate to calculus, how philosophy touches everything.
          </p>

          <p>
            It&apos;s a living map that grows with every new essay.
          </p>
        </div>

        {/* About the author */}
        <div className="border-t pt-12">
          <h2 className="text-2xl font-heading font-bold mb-4">
            About the Author
          </h2>

          <div className="prose prose-lg max-w-none">
            <p>
              Hi, I&apos;m <strong>Ignacio Pastor Sanchez</strong>. I&apos;m a
              software engineer who believes that curiosity is the most
              underrated skill. When I&apos;m not writing code, I&apos;m
              probably reading about something completely unrelated to my job and
              thinking &ldquo;I should write about this.&rdquo;
            </p>

            <p>This encyclopedia is the result of those impulses.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/blog">
              Start Reading
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
