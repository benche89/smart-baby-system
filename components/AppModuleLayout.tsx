"use client";

import Link from "next/link";
import type { ReactNode } from "react";

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
  label = "Today's overview",
  children,
  currentFocusTitle = "Smart Baby System",
  currentFocusText = "Premium navigation unified across the app.",
  rightActionHref = "/onboarding",
  rightActionLabel = "Edit profile",
  dateLabel = "Loading...",
}: AppModuleLayoutProps) {
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
              href="/dashboard"
              className={`neoDash__navItem ${
                active === "dashboard" ? "neoDash__navItem--active" : ""
              }`}
            >
              <span>✨</span>
              <span>Main Dashboard</span>
            </Link>

            <Link
              href="/sleep"
              className={`neoDash__navItem ${
                active === "sleep" ? "neoDash__navItem--active" : ""
              }`}
            >
              <span>🌙</span>
              <span>Sleep Module</span>
            </Link>

            <Link
              href="/food"
              className={`neoDash__navItem ${
                active === "food" ? "neoDash__navItem--active" : ""
              }`}
            >
              <span>🍼</span>
              <span>Food Module</span>
            </Link>

            <Link
              href="/care"
              className={`neoDash__navItem ${
                active === "care" ? "neoDash__navItem--active" : ""
              }`}
            >
              <span>💙</span>
              <span>Care Module</span>
            </Link>

            <Link href="/onboarding" className="neoDash__navItem">
              <span>✏️</span>
              <span>Edit Profile</span>
            </Link>
          </nav>
        </div>

        <div className="neoDash__sidebarCard">
          <p className="neoDash__label">Current focus</p>
          <h3>{currentFocusTitle}</h3>
          <p>{currentFocusText}</p>
        </div>
      </aside>

      <section className="neoDash__main">
        <div className="neoDash__topline">
          <div>
            <p className="neoDash__label">{label}</p>
            <h1>{title}</h1>
            <p className="neoDash__subtitle">{subtitle}</p>
          </div>

          <div className="neoDash__topActions">
            <div className="neoDash__dateChip">{dateLabel}</div>
            <Link href={rightActionHref} className="neoDash__primaryBtn">
              {rightActionLabel}
            </Link>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}