"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales } from "../lib/i18n";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, "") || "/";

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${pathWithoutLocale}`}
          style={{
            padding: "8px 12px",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.25)",
            textDecoration: "none",
            color: "#0f172a",
            background: "#fff",
            fontWeight: 700,
            fontSize: "13px",
          }}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}