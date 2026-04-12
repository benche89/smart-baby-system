import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

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
      <body>
        {children}

        {/* 🔥 VERCEL ANALYTICS */}
        <Analytics />

        <footer
          style={{
            marginTop: "60px",
            padding: "40px 20px",
            borderTop: "1px solid #e5e7eb",
            background: "#ffffff",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#111827",
              }}
            >
              Smart Baby System
            </h3>

            <p
              style={{
                fontSize: "14px",
                opacity: 0.7,
                marginTop: "8px",
                color: "#4b5563",
              }}
            >
              Calm. Confident. In control.
            </p>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                flexWrap: "wrap",
                fontSize: "14px",
              }}
            >
              <a
                href="/fr/privacy"
                style={{ color: "#111827", textDecoration: "none" }}
              >
                Privacy
              </a>
              <a
                href="/fr/terms"
                style={{ color: "#111827", textDecoration: "none" }}
              >
                Terms
              </a>
              <a
                href="/fr/disclaimer"
                style={{ color: "#111827", textDecoration: "none" }}
              >
                Disclaimer
              </a>
            </div>

            <p
              style={{
                fontSize: "12px",
                opacity: 0.6,
                marginTop: "20px",
                color: "#6b7280",
                maxWidth: "700px",
                marginInline: "auto",
              }}
            >
              This application provides AI-generated insights and does not
              replace professional medical advice.
            </p>

            <p
              style={{
                fontSize: "12px",
                opacity: 0.5,
                marginTop: "10px",
                color: "#9ca3af",
              }}
            >
              © {new Date().getFullYear()} Smart Baby System. All rights
              reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}