"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import type { ReactNode } from "react";
import { getMessages, isValidLocale, defaultLocale } from "../lib/i18n";

type ActiveModule = "dashboard" | "sleep" | "food" | "care";

type AppModuleLayoutProps = {
  active: ActiveModule;
  title: string;
  subtitle: string;
  label?: string;
  children: ReactNode;
  currentFocusTitle?: string;
  currentFocusText?: string;
  rightActionHref?: string;
  rightActionLabel?: string;
  dateLabel?: string;
};

export default function AppModuleLayout({
  active,
  title,
  subtitle,
  label,
  children,
  currentFocusTitle = "Smart Baby System",
  currentFocusText = "Premium navigation unified across the app.",
  rightActionHref = "/onboarding",
  rightActionLabel,
  dateLabel
}: AppModuleLayoutProps) {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getMessages(locale);

  const withLocale = (path: string) => `/${locale}${path}`;

  return (
    <main className="neoDash">
      <aside className="neoDash__sidebar">
        <div>
          <div className="neoDash__brand">
            <div className="neoDash__logo">SB</div>
            <div>
              <p className="neoDash__brandTitle">Smart Baby</p>
              <span className="neoDash__brandSub">System</span>
            </div>
          </div>

          <nav className="neoDash__nav">
            <Link
              href={withLocale("/dashboard")}
              className={`neoDash__navItem ${active === "dashboard" ? "neoDash__navItem--active" : ""}`}
            >
              <span>✨</span>
              <span>{t.nav.mainDashboard}</span>
            </Link>

            <Link
              href={withLocale("/sleep")}
              className={`neoDash__navItem ${active === "sleep" ? "neoDash__navItem--active" : ""}`}
            >
              <span>🌙</span>
              <span>{t.nav.sleepModule}</span>
            </Link>

            <Link
              href={withLocale("/food")}
              className={`neoDash__navItem ${active === "food" ? "neoDash__navItem--active" : ""}`}
            >
              <span>🍼</span>
              <span>{t.nav.foodModule}</span>
            </Link>

            <Link
              href={withLocale("/care")}
              className={`neoDash__navItem ${active === "care" ? "neoDash__navItem--active" : ""}`}
            >
              <span>💙</span>
              <span>{t.nav.careModule}</span>
            </Link>

            <Link href={withLocale("/onboarding")} className="neoDash__navItem">
              <span>✏️</span>
              <span>{t.nav.editProfile}</span>
            </Link>
          </nav>
        </div>

        <div className="neoDash__sidebarCard">
          <p className="neoDash__label">{t.common.currentFocus}</p>
          <h3>{currentFocusTitle}</h3>
          <p>{currentFocusText}</p>
        </div>
      </aside>

      <section className="neoDash__main">
        <div className="neoDash__topline">
          <div>
            <p className="neoDash__label">{label ?? t.common.todayOverview}</p>
            <h1>{title}</h1>
            <p className="neoDash__subtitle">{subtitle}</p>
          </div>

          <div className="neoDash__topActions">
            <div className="neoDash__dateChip">{dateLabel ?? t.common.loading}</div>
            <Link href={withLocale(rightActionHref)} className="neoDash__primaryBtn">
              {rightActionLabel ?? t.nav.editProfile}
            </Link>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}