import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Island+ | Enter The Exclusive",
  description: "The Caribbean Premium Creator Network. A private creator ecosystem where communities thrive. Join exclusive creators, unlock premium content, and become part of elite communities.",
  keywords: ["creators", "premium content", "exclusive community", "subscriptions", "live streaming"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
