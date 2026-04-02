"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { useParams } from "next/navigation";

type ActiveModule = "dashboard" | "sleep" | "food" | "care" | "profile";
type Locale = "en" | "fr";

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
  const locale: Locale =
    Array.isArray(rawLocale)
      ? ((rawLocale[0] as Locale) || "en")
      : ((rawLocale as Locale) || "en");

  const navItems: Array<{
    key: ActiveModule;
    href: string;
    label: string;
    icon: string;
  }> =
    locale === "fr"
      ? [
          { key: "dashboard", href: `/${locale}/dashboard`, label: "Tableau principal", icon: "✨" },
          { key: "profile", href: `/${locale}/profile`, label: "Modifier le profil", icon: "👶" },
          { key: "sleep", href: `/${locale}/sleep`, label: "Module sommeil", icon: "🌙" },
          { key: "food", href: `/${locale}/food`, label: "Module alimentation", icon: "🍼" },
          { key: "care", href: `/${locale}/care`, label: "Module soins", icon: "💙" },
        ]
      : [
          { key: "dashboard", href: `/${locale}/dashboard`, label: "Main dashboard", icon: "✨" },
          { key: "profile", href: `/${locale}/profile`, label: "Edit profile", icon: "👶" },
          { key: "sleep", href: `/${locale}/sleep`, label: "Sleep module", icon: "🌙" },
          { key: "food", href: `/${locale}/food`, label: "Food module", icon: "🍼" },
          { key: "care", href: `/${locale}/care`, label: "Care module", icon: "💙" },
        ];

  return (
    <div className="neoDash">
      <aside className="neoDash__sidebar">
        <div>
          <div className="neoDash__brand">
            <div className="neoDash__logo">SB</div>
            <div>
              <div className="neoDash__brandTitle">Smart Baby</div>
              <div className="neoDash__brandSub">System</div>
            </div>
          </div>

          <nav className="neoDash__nav">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`neoDash__navItem ${
                  active === item.key ? "neoDash__navItem--active" : ""
                }`}
              >
                <span className="neoDash__navEmoji" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {(label || currentFocusTitle || currentFocusText) && (
          <div className="neoDash__sidebarCard">
            {label ? <p className="neoDash__label">{label}</p> : null}
            {currentFocusTitle ? <h3>{currentFocusTitle}</h3> : null}
            {currentFocusText ? <p>{currentFocusText}</p> : null}
          </div>
        )}
      </aside>

      <main className="neoDash__main">
        <section className="neoDash__topline">
          <div>
            {title ? <h1>{title}</h1> : null}
            {subtitle ? <p className="neoDash__subtitle">{subtitle}</p> : null}
          </div>

          <div className="neoDash__topActions">
            {dateLabel ? <div className="neoDash__dateChip">{dateLabel}</div> : null}

            <Link href={`/${locale}`} className="neoDash__secondaryBtn">
              {locale === "fr" ? "Accueil" : "Home"}
            </Link>

            {active !== "dashboard" ? (
              <Link href={`/${locale}/dashboard`} className="neoDash__primaryBtn">
                Dashboard
              </Link>
            ) : null}
          </div>
        </section>

        {children}
      </main>
    </div>
  );
}