"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();
      const cleanConfirmPassword = confirmPassword.trim();

      if (!cleanEmail || !cleanPassword) {
        setErrorMessage("Please enter your email and password.");
        return;
      }

      if (mode === "signup") {
        if (cleanPassword.length < 6) {
          setErrorMessage("Password must have at least 6 characters.");
          return;
        }

        if (cleanPassword !== cleanConfirmPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }

        const { error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        setMessage(
          "Account created. Check your email if email confirmation is enabled."
        );

        setTimeout(() => {
          router.push("/fr");
          router.refresh();
        }, 1200);

        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/fr");
      router.refresh();
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "28px 20px",
        background:
          "radial-gradient(circle at top left, rgba(166,210,255,0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          minHeight: "calc(100vh - 56px)",
          display: "grid",
          gridTemplateColumns: "1.02fr 0.98fr",
          gap: 24,
          alignItems: "stretch",
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,0.86)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(148,163,184,0.14)",
            borderRadius: 30,
            boxShadow: "0 20px 60px rgba(15,23,42,0.06)",
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <a
              href="/fr"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                textDecoration: "none",
                color: "#334155",
                fontWeight: 700,
                marginBottom: 22,
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  display: "grid",
                  placeItems: "center",
                  background: "#0f172a",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 800,
                }}
              >
                SB
              </span>
              Back to homepage
            </a>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(239,248,255,0.96)",
                border: "1px solid rgba(148,163,184,0.16)",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "#2563eb",
                  boxShadow: "0 0 0 6px rgba(37,99,235,0.12)",
                }}
              />
              Secure access
            </div>

            <p
              style={{
                fontSize: 12,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7288a3",
                marginBottom: 10,
                fontWeight: 800,
              }}
            >
              Smart Baby System
            </p>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 58px)",
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
                color: "#0f172a",
                marginBottom: 14,
                maxWidth: 640,
              }}
            >
              {mode === "login"
                ? "Welcome back."
                : "Create your account."}
            </h1>

            <p
              style={{
                color: "#5b6b7e",
                fontSize: 17,
                lineHeight: 1.8,
                maxWidth: 660,
                marginBottom: 22,
              }}
            >
              {mode === "login"
                ? "Sign in to access your personalized baby dashboard, your saved profile, AI-powered guidance and daily tracking modules."
                : "Create your Smart Baby System account and start building a calmer, more connected parenting experience."}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
                marginBottom: 22,
              }}
            >
              {[
                {
                  title: "Secure login",
                  text: "Your account gives you access to your saved baby data and personalized experience.",
                },
                {
                  title: "AI guidance",
                  text: "Sleep, food and care suggestions become more useful when everything is connected.",
                },
                {
                  title: "One ecosystem",
                  text: "Dashboard, modules and marketplace all work together inside one premium product.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: 16,
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(148,163,184,0.14)",
                    boxShadow: "0 14px 34px rgba(15,23,42,0.04)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: 8,
                      fontSize: 16,
                      color: "#0f172a",
                    }}
                  >
                    {item.title}
                  </strong>
                  <p
                    style={{
                      margin: 0,
                      color: "#607082",
                      lineHeight: 1.7,
                      fontSize: 14,
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: 22,
              borderRadius: 24,
              background:
                "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#7288a3",
              }}
            >
              Why parents use it
            </p>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {[
                "Track sleep, food and care in one place",
                "Turn daily activity into clearer AI-powered insights",
                "Build calmer routines with more confidence",
              ].map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: 14,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid #e5edf5",
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: "#0f172a",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 13,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#334155",
                      lineHeight: 1.7,
                      fontSize: 14,
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            background: "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
            color: "#fff",
            borderRadius: 30,
            boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
            padding: 30,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#93c5fd",
                marginBottom: 12,
              }}
            >
              {mode === "login" ? "Account access" : "New account"}
            </p>

            <h2
              style={{
                fontSize: 34,
                lineHeight: 1.08,
                marginBottom: 10,
                color: "#fff",
              }}
            >
              {mode === "login"
                ? "Access your premium parenting dashboard"
                : "Start your Smart Baby System journey"}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                fontSize: 15,
                marginBottom: 22,
              }}
            >
              {mode === "login"
                ? "Sign in to continue with your saved data, plan selection and personalized dashboard."
                : "Create an account to save your profile, continue onboarding and unlock the full system."}
            </p>

            <div
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 20,
                background: "rgba(255,255,255,0.08)",
                padding: 6,
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setMessage("");
                  setErrorMessage("");
                }}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  background: mode === "login" ? "#ffffff" : "transparent",
                  color: mode === "login" ? "#0f172a" : "#cbd5e1",
                  boxShadow:
                    mode === "login"
                      ? "0 8px 24px rgba(15,23,42,0.14)"
                      : "none",
                }}
              >
                Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setMessage("");
                  setErrorMessage("");
                }}
                style={{
                  flex: 1,
                  border: "none",
                  borderRadius: 12,
                  padding: "12px 14px",
                  fontWeight: 800,
                  cursor: "pointer",
                  background: mode === "signup" ? "#ffffff" : "transparent",
                  color: mode === "signup" ? "#0f172a" : "#cbd5e1",
                  boxShadow:
                    mode === "signup"
                      ? "0 8px 24px rgba(15,23,42,0.14)"
                      : "none",
                }}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
              <div>
                <label htmlFor="email" style={darkLabelStyle}>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  style={darkInputStyle}
                />
              </div>

              <div>
                <label htmlFor="password" style={darkLabelStyle}>
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  style={darkInputStyle}
                />
              </div>

              {mode === "signup" && (
                <div>
                  <label htmlFor="confirmPassword" style={darkLabelStyle}>
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat your password"
                    style={darkInputStyle}
                  />
                </div>
              )}

              {message ? (
                <div
                  style={{
                    background: "rgba(16,185,129,0.12)",
                    color: "#d1fae5",
                    border: "1px solid rgba(16,185,129,0.28)",
                    borderRadius: 16,
                    padding: "12px 14px",
                    fontSize: 14,
                  }}
                >
                  {message}
                </div>
              ) : null}

              {errorMessage ? (
                <div
                  style={{
                    background: "rgba(244,63,94,0.12)",
                    color: "#fecdd3",
                    border: "1px solid rgba(244,63,94,0.24)",
                    borderRadius: 16,
                    padding: "12px 14px",
                    fontSize: 14,
                  }}
                >
                  {errorMessage}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: 6,
                  border: "none",
                  borderRadius: 16,
                  padding: "15px 18px",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  background: "#ffffff",
                  color: "#0f172a",
                  opacity: loading ? 0.72 : 1,
                  boxShadow: "0 12px 30px rgba(15,23,42,0.18)",
                }}
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                  ? "Login"
                  : "Create account"}
              </button>
            </form>
          </div>

          <div
            style={{
              marginTop: 22,
              padding: 20,
              borderRadius: 22,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#93c5fd",
              }}
            >
              After login
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              {[
                "Continue with your selected plan",
                "Open your personalized dashboard",
                "Access sleep, food, care and AI guidance",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    color: "#e2e8f0",
                    lineHeight: 1.65,
                    fontSize: 14,
                  }}
                >
                  • {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const darkLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 800,
  color: "#ffffff",
};

const darkInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 16,
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  outline: "none",
  fontSize: 15,
};