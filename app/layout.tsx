import type { Metadata } from "next";
import { Source_Serif_4, Lora, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Useless Knowledge Encyclopedia",
    template: "%s | Useless Knowledge Encyclopedia",
  },
  description:
    "An encyclopedia of essays exploring science, mathematics, AI, humanities, philosophy, and more. Fighting against brainrot through active learning.",
  keywords: [
    "essays",
    "science",
    "mathematics",
    "AI",
    "philosophy",
    "learning",
    "encyclopedia",
  ],
  authors: [{ name: "Ignacio Pastor Sanchez" }],
  openGraph: {
    title: "Useless Knowledge Encyclopedia",
    description:
      "Fighting against brainrot through active learning. Essays on science, math, AI, and more.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Useless Knowledge Encyclopedia",
    description:
      "Fighting against brainrot through active learning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sourceSerif.variable} ${lora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
