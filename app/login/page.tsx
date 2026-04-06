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

      if (!cleanEmail || !cleanPassword) {
        setErrorMessage("Please enter your email and password.");
        return;
      }

      if (mode === "signup") {
        if (cleanPassword.length < 6) {
          setErrorMessage("Password must have at least 6 characters.");
          return;
        }

        if (cleanPassword !== confirmPassword.trim()) {
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
          router.push("/dashboard");
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

      router.push("/dashboard");
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
        display: "grid",
        placeItems: "center",
        padding: "24px",
        background:
          "radial-gradient(circle at top left, rgba(166,210,255,0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(14px)",
          border: "1px solid rgba(15,23,42,0.08)",
          borderRadius: 24,
          boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
          padding: 28,
        }}
      >
        <div style={{ marginBottom: 22 }}>
          <p
            style={{
              fontSize: 12,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#64748b",
              marginBottom: 10,
              fontWeight: 700,
            }}
          >
            Smart Baby System
          </p>

          <h1
            style={{
              fontSize: 32,
              lineHeight: 1.1,
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 10,
            }}
          >
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>

          <p
            style={{
              color: "#475569",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            {mode === "login"
              ? "Sign in to access your baby dashboard, insights and tracking modules."
              : "Create your Smart Baby System account and start saving your baby data securely."}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 20,
            background: "#f8fafc",
            padding: 6,
            borderRadius: 14,
            border: "1px solid rgba(15,23,42,0.06)",
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
              borderRadius: 10,
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
              background: mode === "login" ? "#ffffff" : "transparent",
              color: "#0f172a",
              boxShadow:
                mode === "login" ? "0 8px 24px rgba(15,23,42,0.06)" : "none",
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
              borderRadius: 10,
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
              background: mode === "signup" ? "#ffffff" : "transparent",
              color: "#0f172a",
              boxShadow:
                mode === "signup" ? "0 8px 24px rgba(15,23,42,0.06)" : "none",
            }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14 }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: "block",
                marginBottom: 8,
                fontSize: 14,
                fontWeight: 700,
                color: "#0f172a",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              style={inputStyle}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label
                htmlFor="confirmPassword"
                style={{
                  display: "block",
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                Confirm password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                style={inputStyle}
              />
            </div>
          )}

          {message ? (
            <div
              style={{
                background: "#ecfeff",
                color: "#155e75",
                border: "1px solid #a5f3fc",
                borderRadius: 14,
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
                background: "#fff1f2",
                color: "#be123c",
                border: "1px solid #fecdd3",
                borderRadius: 14,
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
              marginTop: 4,
              border: "none",
              borderRadius: 14,
              padding: "14px 18px",
              fontWeight: 800,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              background: "#0f172a",
              color: "#ffffff",
              opacity: loading ? 0.7 : 1,
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
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: 14,
  border: "1px solid rgba(15,23,42,0.10)",
  background: "#ffffff",
  color: "#0f172a",
  outline: "none",
  fontSize: 15,
};