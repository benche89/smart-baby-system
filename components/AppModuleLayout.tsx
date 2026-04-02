"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useParams } from "next/navigation";

type ActiveModule = "dashboard" | "sleep" | "food" | "care" | "profile";

type AppModuleLayoutProps = {
  children: ReactNode;
  active?: ActiveModule;
  title?: string;
  subtitle?: string;
  label?: string;
  currentFocusTitle?: string;
  currentFocusText?: string;
  dateLabel?: string;
};

export default function AppModuleLayout({
  children,
  active,
  title,
  subtitle,
  label,
  currentFocusTitle,
  currentFocusText,
  dateLabel,
}: AppModuleLayoutProps) {
  const params = useParams();
  const rawLocale = params?.locale;
  const locale = Array.isArray(rawLocale) ? rawLocale[0] : rawLocale || "en";

  const navItems: Array<{ key: ActiveModule; href: string; label: string }> = [
    { key: "dashboard", href: `/${locale}/dashboard`, label: "Dashboard" },
    { key: "sleep", href: `/${locale}/sleep`, label: "Sleep" },
    { key: "food", href: `/${locale}/food`, label: "Food" },
    { key: "care", href: `/${locale}/care`, label: "Care" },
    { key: "profile", href: `/${locale}/profile`, label: "Profile" },
  ];

  return (
    <div className="neoDash">
      <aside className="neoSidebar">
        <div className="neoSidebar__top">
          <Link href={`/${locale}`} className="neoBrand">
            Smart Baby System
          </Link>

          <Link href={`/${locale}`} className="neoHomeButton">
            ← Home
          </Link>
        </div>

        <nav className="neoNav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`neoNav__item ${active === item.key ? "is-active" : ""}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {(label || currentFocusTitle || currentFocusText) && (
          <div className="neoSidebarCard">
            {label ? <span className="neoSidebarCard__label">{label}</span> : null}
            {currentFocusTitle ? (
              <h3 className="neoSidebarCard__title">{currentFocusTitle}</h3>
            ) : null}
            {currentFocusText ? (
              <p className="neoSidebarCard__text">{currentFocusText}</p>
            ) : null}
          </div>
        )}
      </aside>

      <main className="neoMain">
        {(title || subtitle || dateLabel) && (
          <header className="neoHero">
            {dateLabel ? <p className="neoHero__date">{dateLabel}</p> : null}
            {title ? <h1 className="neoHero__title">{title}</h1> : null}
            {subtitle ? <p className="neoHero__subtitle">{subtitle}</p> : null}
          </header>
        )}

        <div className="neoMain__content">{children}</div>
      </main>
    </div>
  );
}