import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intersection Observer Demo",
  description: "Learn how to use Intersection Observer API with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
