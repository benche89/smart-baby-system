"use client";

import { FormEvent, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";

type Locale = "en" | "fr";
type AuthMode = "login" | "signup";

const copy = {
  en: {
    badge: "Smart Baby System",
    title: "Welcome back",
    subtitle: "Log in or create your account to sync your baby data securely.",
    loginTab: "Log in",
    signupTab: "Create account",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm password",
    loginButton: "Log in",
    signupButton: "Create account",
    loadingLogin: "Logging in...",
    loadingSignup: "Creating account...",
    passwordMismatch: "Passwords do not match.",
    loginSuccess: "Login successful. Redirecting...",
    signupSuccess: "Account created. Check your email to confirm your address.",
    genericError: "Something went wrong. Please try again.",
    missingSupabase:
      "Supabase is not configured yet. Authentication is unavailable right now.",
    backHome: "Back to home",
  },
  fr: {
    badge: "Smart Baby System",
    title: "Bon retour",
    subtitle:
      "Connectez-vous ou creez votre compte pour synchroniser les donnees de votre bebe en toute securite.",
    loginTab: "Connexion",
    signupTab: "Creer un compte",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    loginButton: "Se connecter",
    signupButton: "Creer un compte",
    loadingLogin: "Connexion...",
    loadingSignup: "Creation du compte...",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    loginSuccess: "Connexion reussie. Redirection...",
    signupSuccess: "Compte cree. Verifiez votre email pour confirmer votre adresse.",
    genericError: "Une erreur est survenue. Veuillez reessayer.",
    missingSupabase:
      "Supabase n'est pas encore configure. L'authentification est indisponible pour le moment.",
    backHome: "Retour a l'accueil",
  },
} as const;

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();

  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const supabase = useMemo(() => createSupabaseClient(), []);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const client = supabase;

    if (!client) {
      setMessage(t.missingSupabase);
      setMessageType("error");
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setMessage(t.passwordMismatch);
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "signup") {
        const { error } = await client.auth.signUp({
          email,
          password,
        });

        if (error) {
          setMessage(error.message || t.genericError);
          setMessageType("error");
          return;
        }

        setMessage(t.signupSuccess);
        setMessageType("success");
        return;
      }

      const { error } = await client.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message || t.genericError);
        setMessageType("error");
        return;
      }

      setMessage(t.loginSuccess);
      setMessageType("success");
      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(t.genericError);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
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
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(255,255,255,0.7)",
          borderRadius: "28px",
          padding: "28px",
          boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div style={{ marginBottom: "22px" }}>
          <p
            style={{
              display: "inline-flex",
              padding: "6px 12px",
              borderRadius: "999px",
              background: "#e0f2fe",
              color: "#0369a1",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {t.badge}
          </p>

          <h1
            style={{
              fontSize: "30px",
              lineHeight: 1.15,
              margin: 0,
              color: "#0f172a",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              marginTop: "10px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "#475569",
            }}
          >
            {t.subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
            marginBottom: "22px",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
              setMessageType("");
            }}
            style={{
              border: mode === "login" ? "2px solid #0f172a" : "1px solid rgba(148,163,184,0.25)",
              background: mode === "login" ? "#0f172a" : "#ffffff",
              color: mode === "login" ? "#ffffff" : "#0f172a",
              borderRadius: "16px",
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t.loginTab}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setMessage("");
              setMessageType("");
            }}
            style={{
              border: mode === "signup" ? "2px solid #0f172a" : "1px solid rgba(148,163,184,0.25)",
              background: mode === "signup" ? "#0f172a" : "#ffffff",
              color: mode === "signup" ? "#ffffff" : "#0f172a",
              borderRadius: "16px",
              padding: "12px 14px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {t.signupTab}
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>
              {t.email}
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                borderRadius: "16px",
                border: "1px solid #cbd5e1",
                padding: "14px 16px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </label>

          <label style={{ display: "grid", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>
              {t.password}
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                borderRadius: "16px",
                border: "1px solid #cbd5e1",
                padding: "14px 16px",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </label>

          {mode === "signup" ? (
            <label style={{ display: "grid", gap: "8px" }}>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "#334155" }}>
                {t.confirmPassword}
              </span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                style={{
                  borderRadius: "16px",
                  border: "1px solid #cbd5e1",
                  padding: "14px 16px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
            </label>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: "6px",
              border: "none",
              borderRadius: "16px",
              background: "#0f172a",
              color: "#ffffff",
              padding: "14px 18px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: isSubmitting ? "not-allowed" : "pointer",
              opacity: isSubmitting ? 0.7 : 1,
            }}
          >
            {isSubmitting
              ? mode === "signup"
                ? t.loadingSignup
                : t.loadingLogin
              : mode === "signup"
                ? t.signupButton
                : t.loginButton}
          </button>

          {message ? (
            <div
              style={{
                padding: "14px 16px",
                borderRadius: "16px",
                border:
                  messageType === "success"
                    ? "1px solid rgba(34,197,94,0.25)"
                    : "1px solid rgba(239,68,68,0.25)",
                background:
                  messageType === "success"
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                color: messageType === "success" ? "#166534" : "#991b1b",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          ) : null}
        </form>

        <div style={{ marginTop: "18px" }}>
          <a
            href={`/${locale}`}
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "14px",
            }}
          >
            {t.backHome}
          </a>
        </div>
      </section>
    </main>
  );
}