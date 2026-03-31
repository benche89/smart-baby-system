import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smart Baby System",
  description: "AI-powered baby insights for calmer parenting decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
