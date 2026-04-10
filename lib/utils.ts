import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ArticleCategory } from "./interfaces"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  Science: "#996B1F",
  Mathematics: "#9A4A2B",
  AI: "#1B7D72",
  Humanities: "#A83820",
  Psychology: "#8D7520",
  Art: "#A62E30",
  Philosophy: "#4D7A3A",
  Physics: "#7A5A18",
}

export function getCategoryColor(category: ArticleCategory): string {
  return CATEGORY_COLORS[category] || "#6B7280"
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
