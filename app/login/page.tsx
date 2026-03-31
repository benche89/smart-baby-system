"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    localStorage.setItem("smartBabyLoggedIn", "true");
    localStorage.setItem("smartBabyUserEmail", form.email.trim());

    setError("");
    router.push("/dashboard");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
        padding: "32px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1120px",
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "1.05fr 0.95fr",
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(148,163,184,0.16)",
            borderRadius: "28px",
            padding: "32px",
            boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              textDecoration: "none",
              color: "#0f172a",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                background: "#0f172a",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 800,
                fontSize: "14px",
                letterSpacing: "0.08em",
              }}
            >
              SB
            </div>

            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Smart Baby
              </p>
              <span
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                }}
              >
                System
              </span>
            </div>
          </a>

          <div style={{ marginBottom: "26px" }}>
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#4f8cff",
              }}
            >
              Welcome back
            </p>

            <h1
              style={{
                margin: "12px 0 10px",
                fontSize: "42px",
                lineHeight: 1.05,
                color: "#0f172a",
              }}
            >
              Log in to your premium parenting dashboard
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: "620px",
              }}
            >
              Access your baby’s sleep, food, care and AI guidance in one calm,
              premium experience.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              <label style={{ display: "grid", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Email address
                </span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                  style={inputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: "8px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Password
                </span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  style={inputStyle}
                />
              </label>
            </div>

            {error ? (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px 14px",
                  borderRadius: "14px",
                  background: "#fff1f2",
                  border: "1px solid #fecdd3",
                  color: "#be123c",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              <button
                type="submit"
                style={{
                  border: "none",
                  borderRadius: "999px",
                  padding: "14px 22px",
                  background: "#0f172a",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 12px 30px rgba(15,23,42,0.16)",
                }}
              >
                Log in
              </button>

              <button
                type="button"
                onClick={() => router.push("/onboarding")}
                style={{
                  borderRadius: "999px",
                  padding: "14px 22px",
                  background: "#fff",
                  color: "#0f172a",
                  border: "1px solid rgba(148,163,184,0.25)",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Create account
              </button>
            </div>
          </form>

          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(148,163,184,0.16)",
              display: "flex",
              justifyContent: "space-between",
              gap: "16px",
              flexWrap: "wrap",
              color: "#64748b",
              fontSize: "14px",
            }}
          >
            <a href="/" style={{ color: "#64748b", textDecoration: "none" }}>
              ← Back to homepage
            </a>
            <a href="/onboarding" style={{ color: "#64748b", textDecoration: "none" }}>
              New here? Start onboarding
            </a>
          </div>
        </section>

        <aside
          style={{
            background: "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
            color: "#fff",
            borderRadius: "28px",
            padding: "32px",
            boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
            minHeight: "100%",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#93c5fd",
            }}
          >
            Inside the app
          </p>

          <h2
            style={{
              margin: "12px 0 10px",
              fontSize: "34px",
              lineHeight: 1.1,
            }}
          >
            One login. Full parenting system.
          </h2>

          <p
            style={{
              margin: "0 0 20px",
              lineHeight: 1.7,
              color: "#cbd5e1",
            }}
          >
            Access your full ecosystem: unified dashboard, AI guidance, sleep,
            food and care modules — all connected in one premium experience.
          </p>

          <div
            style={{
              display: "grid",
              gap: "14px",
            }}
          >
            <div style={featureCardStyle}>
              <p style={featureLabelStyle}>Dashboard</p>
              <h3 style={featureTitleStyle}>Unified overview</h3>
              <p style={featureTextStyle}>
                See your baby’s day at a glance with scores, insights and fast module access.
              </p>
            </div>

            <div style={featureCardStyle}>
              <p style={featureLabelStyle}>AI</p>
              <h3 style={featureTitleStyle}>Context-aware guidance</h3>
              <p style={featureTextStyle}>
                Ask one question and adapt today’s rhythm, meals or care plan.
              </p>
            </div>

            <div style={featureCardStyle}>
              <p style={featureLabelStyle}>Modules</p>
              <h3 style={featureTitleStyle}>Sleep · Food · Care</h3>
              <p style={featureTextStyle}>
                Track what matters daily without switching between separate tools.
              </p>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "18px",
              borderRadius: "22px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#93c5fd",
              }}
            >
              Demo note
            </p>
            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.7,
              }}
            >
              This login is a premium front-end flow. For now, it stores a simple
              logged-in state locally so the app feels complete while you build the product.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid rgba(148,163,184,0.22)",
  borderRadius: "16px",
  padding: "13px 14px",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
  color: "#0f172a",
};

const featureCardStyle: React.CSSProperties = {
  padding: "18px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const featureLabelStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "#93c5fd",
};

const featureTitleStyle: React.CSSProperties = {
  margin: "0 0 8px",
  fontSize: "20px",
  lineHeight: 1.2,
};

const featureTextStyle: React.CSSProperties = {
  margin: 0,
  color: "#cbd5e1",
  lineHeight: 1.7,
};