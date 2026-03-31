import Link from "next/link";
import { notFound } from "next/navigation";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { defaultLocale, getMessages, isValidLocale } from "../../lib/i18n";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const t = getMessages(locale);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
        color: "#0f172a",
      }}
    >
      <section
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "28px 20px 80px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "14px",
                background: "#0f172a",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
              }}
            >
              SB
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: "18px" }}>Smart Baby</div>
              <div style={{ color: "#64748b", fontSize: "14px" }}>System</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <LanguageSwitcher />
            <Link
              href={`/${locale}/onboarding`}
              style={{
                textDecoration: "none",
                padding: "12px 18px",
                borderRadius: "999px",
                background: "#0f172a",
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {t.nav.startFree}
            </Link>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "28px",
            alignItems: "center",
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "999px",
                background: "rgba(79,140,255,0.12)",
                color: "#2563eb",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {t.home.badge}
            </p>

            <h1
              style={{
                margin: "18px 0 16px",
                fontSize: "64px",
                lineHeight: 0.98,
                letterSpacing: "-0.04em",
              }}
            >
              {t.home.title1}
              <br />
              {t.home.title2}
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: "760px",
                fontSize: "18px",
                lineHeight: 1.75,
                color: "#475569",
              }}
            >
              {t.home.subtitle}
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                marginTop: "28px",
              }}
            >
              <Link
                href={`/${locale}/onboarding`}
                style={{
                  textDecoration: "none",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow: "0 14px 34px rgba(15,23,42,0.14)",
                }}
              >
                {t.home.startFree}
              </Link>

              <Link
                href={`/${locale}/dashboard`}
                style={{
                  textDecoration: "none",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  background: "#fff",
                  color: "#0f172a",
                  border: "1px solid rgba(148,163,184,0.24)",
                  fontWeight: 700,
                }}
              >
                {t.home.openApp}
              </Link>

              <Link
                href="/marketplace"
                style={{
                  textDecoration: "none",
                  padding: "14px 22px",
                  borderRadius: "999px",
                  background: "#eef4ff",
                  color: "#2563eb",
                  border: "1px solid rgba(37,99,235,0.14)",
                  fontWeight: 700,
                }}
              >
                {t.home.exploreMarketplace}
              </Link>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(148,163,184,0.18)",
              borderRadius: "30px",
              padding: "24px",
              boxShadow: "0 22px 60px rgba(15,23,42,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              }}
            >
              <div style={cardStyle}>
                <div style={cardLabelStyle}>Sleep</div>
                <div style={cardTitleStyle}>Smarter rhythm</div>
                <div style={cardTextStyle}>Daily sleep logs, rhythm visibility and AI-guided clarity.</div>
              </div>

              <div style={cardStyle}>
                <div style={cardLabelStyle}>Food</div>
                <div style={cardTitleStyle}>Clear meal patterns</div>
                <div style={cardTextStyle}>Track meals, reactions and build confidence with routine data.</div>
              </div>

              <div style={cardStyle}>
                <div style={cardLabelStyle}>Care</div>
                <div style={cardTitleStyle}>Stable routines</div>
                <div style={cardTextStyle}>Bring daily care into one clean, premium system.</div>
              </div>

              <div style={cardStyle}>
                <div style={cardLabelStyle}>AI</div>
                <div style={cardTitleStyle}>Useful guidance</div>
                <div style={cardTextStyle}>One assistant connecting sleep, food and care context.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const cardStyle = {
  background: "#fff",
  borderRadius: "22px",
  padding: "18px",
  border: "1px solid rgba(148,163,184,0.16)",
};

const cardLabelStyle = {
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
  color: "#64748b",
};

const cardTitleStyle = {
  marginTop: "8px",
  fontSize: "20px",
  fontWeight: 800,
  color: "#0f172a",
};

const cardTextStyle = {
  marginTop: "8px",
  fontSize: "14px",
  lineHeight: 1.7,
  color: "#475569",
};