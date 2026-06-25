import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractShield AI",
  description: "Review smarter. Sign with confidence.",
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
