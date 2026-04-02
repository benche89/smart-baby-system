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

  const activeItem = navItems.find((item) => item.key === active);
  const breadcrumbLabel = activeItem?.label || "Module";

  return (
    <div className="neoDash">
      <aside className="neoSidebar">
        <div className="neoSidebar__top">
          <Link href={`/${locale}`} className="neoBrand">
            <span className="neoBrand__dot" />
            <span>Smart Baby System</span>
          </Link>

          <div className="neoSidebarActions">
            <Link href={`/${locale}`} className="neoGlassButton">
              <span className="neoGlassButton__icon">⌂</span>
              <span>Home</span>
            </Link>

            <Link href={`/${locale}/dashboard`} className="neoGlassButton neoGlassButton--secondary">
              <span className="neoGlassButton__icon">←</span>
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        <nav className="neoNav">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={`neoNav__item ${active === item.key ? "is-active" : ""}`}
            >
              <span className="neoNav__pill" />
              <span>{item.label}</span>
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
        <header className="neoHero neoHero--premium">
          <div className="neoHeroTopline">
            <div className="neoBreadcrumb">
              <Link href={`/${locale}`} className="neoBreadcrumb__link">
                Home
              </Link>
              <span className="neoBreadcrumb__sep">/</span>
              <Link href={`/${locale}/dashboard`} className="neoBreadcrumb__link">
                Dashboard
              </Link>
              <span className="neoBreadcrumb__sep">/</span>
              <span className="neoBreadcrumb__current">{breadcrumbLabel}</span>
            </div>

            {dateLabel ? <div className="neoHero__dateBadge">{dateLabel}</div> : null}
          </div>

          {(title || subtitle) && (
            <div className="neoHero__content">
              {title ? <h1 className="neoHero__title">{title}</h1> : null}
              {subtitle ? <p className="neoHero__subtitle">{subtitle}</p> : null}
            </div>
          )}
        </header>

        <div className="neoMain__content">{children}</div>
      </main>
    </div>
  );
}