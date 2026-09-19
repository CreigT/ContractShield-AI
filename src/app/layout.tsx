import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://contract-shield-ai-iota.vercel.app";
const title = "ContractShield AI";
const description =
  "Upload a business contract and get a plain-English risk review before you sign. A product of Creignificent LLC.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | ContractShield AI",
  },
  description,
  applicationName: "ContractShield AI",
  keywords: ["contract review", "small business", "AI", "Creignificent LLC"],
  authors: [{ name: "Creignificent LLC" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "ContractShield AI",
    title: "Review Smarter. Sign with Confidence.",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Review Smarter. Sign with Confidence.",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
