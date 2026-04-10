"use client";

import type { CSSProperties, FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";

type Locale = "en" | "fr";
type AuthMode = "login" | "signup";

const PROFILE_STORAGE_KEY = "smart-baby-profile";
const PLAN_STORAGE_KEY = "smart-baby-plan-tier";

const copy = {
  en: {
    badge: "Smart Baby System",
    title: "Welcome back",
    subtitle:
      "Log in or create your account to sync your baby data securely and continue your premium parenting experience.",
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
    signupSuccess:
      "Account created. Check your email if confirmation is enabled.",
    genericError: "Something went wrong. Please try again.",
    missingSupabase:
      "Supabase is not configured yet. Authentication is unavailable right now.",
    backHome: "Back to home",
    checkingSession: "Checking your session...",
    checkingSubtitle: "Preparing the best next step for your account.",
    secureAccess: "Secure access",
    sideTitleLogin: "Access your premium parenting dashboard",
    sideTitleSignup: "Start your Smart Baby System journey",
    sideTextLogin:
      "Sign in to continue with your saved data, selected plan and personalized dashboard.",
    sideTextSignup:
      "Create an account to save your profile, continue onboarding and unlock the full system.",
    afterLogin: "After login",
    afterLoginItems: [
      "New account → onboarding",
      "Existing user with profile → dashboard",
      "Access sleep, food, care and AI guidance",
    ],
  },
  fr: {
    badge: "Smart Baby System",
    title: "Bon retour",
    subtitle:
      "Connectez-vous ou créez votre compte pour synchroniser les données de votre bébé en toute sécurité et continuer votre expérience premium.",
    loginTab: "Connexion",
    signupTab: "Créer un compte",
    email: "Email",
    password: "Mot de passe",
    confirmPassword: "Confirmer le mot de passe",
    loginButton: "Se connecter",
    signupButton: "Créer un compte",
    loadingLogin: "Connexion...",
    loadingSignup: "Création du compte...",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    loginSuccess: "Connexion réussie. Redirection...",
    signupSuccess:
      "Compte créé. Vérifiez votre email si la confirmation est activée.",
    genericError: "Une erreur est survenue. Veuillez réessayer.",
    missingSupabase:
      "Supabase n'est pas encore configuré. L'authentification est indisponible pour le moment.",
    backHome: "Retour à l'accueil",
    checkingSession: "Vérification de votre session...",
    checkingSubtitle:
      "Préparation de la meilleure étape suivante pour votre compte.",
    secureAccess: "Accès sécurisé",
    sideTitleLogin: "Accédez à votre dashboard parental premium",
    sideTitleSignup: "Commencez votre parcours Smart Baby System",
    sideTextLogin:
      "Connectez-vous pour continuer avec vos données enregistrées, votre formule choisie et votre dashboard personnalisé.",
    sideTextSignup:
      "Créez un compte pour enregistrer votre profil, continuer l'onboarding et débloquer tout le système.",
    afterLogin: "Après connexion",
    afterLoginItems: [
      "Nouveau compte → onboarding",
      "Utilisateur existant avec profil → dashboard",
      "Accès au sommeil, à l'alimentation, aux soins et à la guidance IA",
    ],
  },
} as const;

function hasSavedProfile(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as {
      babyName?: string;
      ageMonths?: string;
      bedtime?: string;
      mainConcern?: string;
      notes?: string;
    };

    return Boolean(
      parsed?.babyName ||
        parsed?.ageMonths ||
        parsed?.bedtime ||
        parsed?.mainConcern ||
        parsed?.notes
    );
  } catch {
    return false;
  }
}

function getSavedPlan(): "basic" | "premium" | "elite" {
  if (typeof window === "undefined") return "premium";

  const plan = localStorage.getItem(PLAN_STORAGE_KEY);
  if (plan === "basic" || plan === "premium" || plan === "elite") return plan;
  return "premium";
}

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();

  const rawLocale =
    typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const supabase = useMemo(() => createSupabaseClient(), []);
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const client = supabase;

      if (!client) {
        if (mounted) setCheckingSession(false);
        return;
      }

      try {
        const { data, error } = await client.auth.getSession();

        if (error) {
          if (mounted) setCheckingSession(false);
          return;
        }

        if (data.session) {
          const destination = hasSavedProfile()
            ? `/${locale}/dashboard`
            : `/${locale}/onboarding?plan=${getSavedPlan()}`;

          router.replace(destination);
          router.refresh();
          return;
        }
      } catch {
        // ignore
      }

      if (mounted) setCheckingSession(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [locale, router, supabase]);

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

    if (mode === "signup" && password.trim() !== confirmPassword.trim()) {
      setMessage(t.passwordMismatch);
      setMessageType("error");
      return;
    }

    setIsSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (mode === "signup") {
        const selectedPlan = getSavedPlan();

        const { error } = await client.auth.signUp({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (error) {
          setMessage(error.message || t.genericError);
          setMessageType("error");
          return;
        }

        setMessage(t.signupSuccess);
        setMessageType("success");

        setTimeout(() => {
          router.push(`/${locale}/onboarding?plan=${selectedPlan}`);
          router.refresh();
        }, 1200);

        return;
      }

      const { error } = await client.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (error) {
        setMessage(error.message || t.genericError);
        setMessageType("error");
        return;
      }

      setMessage(t.loginSuccess);
      setMessageType("success");

      const destination = hasSavedProfile()
        ? `/${locale}/dashboard`
        : `/${locale}/onboarding?plan=${getSavedPlan()}`;

      router.push(destination);
      router.refresh();
    } catch (error) {
      console.error("Auth error:", error);
      setMessage(t.genericError);
      setMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkingSession) {
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
            maxWidth: "460px",
            background: "rgba(255,255,255,0.92)",
            border: "1px solid rgba(255,255,255,0.7)",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
            backdropFilter: "blur(12px)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              display: "grid",
              placeItems: "center",
              background: "#0f172a",
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              margin: "0 auto 14px",
            }}
          >
            SB
          </div>

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
              fontSize: "28px",
              lineHeight: 1.12,
              margin: 0,
              color: "#0f172a",
            }}
          >
            {t.checkingSession}
          </h1>

          <p
            style={{
              marginTop: "12px",
              fontSize: "14px",
              lineHeight: 1.7,
              color: "#475569",
            }}
          >
            {t.checkingSubtitle}
          </p>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background:
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          minHeight: "calc(100vh - 48px)",
          display: "grid",
          gridTemplateColumns: "1.02fr 0.98fr",
          gap: "24px",
          alignItems: "stretch",
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,0.86)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(148,163,184,0.14)",
            borderRadius: "30px",
            boxShadow: "0 20px 60px rgba(15,23,42,0.06)",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <a
              href={`/${locale}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                color: "#334155",
                fontWeight: 700,
                marginBottom: "22px",
              }}
            >
              <span
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "12px",
                  display: "grid",
                  placeItems: "center",
                  background: "#0f172a",
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 800,
                }}
              >
                SB
              </span>
              {t.backHome}
            </a>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                borderRadius: "999px",
                background: "rgba(239,248,255,0.96)",
                border: "1px solid rgba(148,163,184,0.16)",
                color: "#2563eb",
                fontWeight: 700,
                fontSize: "13px",
                marginBottom: "18px",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  background: "#2563eb",
                  boxShadow: "0 0 0 6px rgba(37,99,235,0.12)",
                }}
              />
              {t.secureAccess}
            </div>

            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#7288a3",
                marginBottom: "10px",
                fontWeight: 800,
              }}
            >
              {t.badge}
            </p>

            <h1
              style={{
                fontSize: "clamp(36px, 5vw, 58px)",
                lineHeight: 1.02,
                letterSpacing: "-0.05em",
                color: "#0f172a",
                marginBottom: "14px",
                maxWidth: "640px",
              }}
            >
              {mode === "login" ? t.title : t.signupTab}
            </h1>

            <p
              style={{
                color: "#5b6b7e",
                fontSize: "17px",
                lineHeight: 1.8,
                maxWidth: "660px",
                marginBottom: "22px",
              }}
            >
              {t.subtitle}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "12px",
                marginBottom: "22px",
              }}
            >
              {[
                {
                  title: locale === "fr" ? "Connexion sécurisée" : "Secure login",
                  text:
                    locale === "fr"
                      ? "Votre compte vous donne accès à vos données bébé enregistrées et à votre expérience personnalisée."
                      : "Your account gives you access to your saved baby data and personalized experience.",
                },
                {
                  title: locale === "fr" ? "Guidance IA" : "AI guidance",
                  text:
                    locale === "fr"
                      ? "Les suggestions sommeil, alimentation et soins deviennent plus utiles quand tout est connecté."
                      : "Sleep, food and care suggestions become more useful when everything is connected.",
                },
                {
                  title: locale === "fr" ? "Un seul écosystème" : "One ecosystem",
                  text:
                    locale === "fr"
                      ? "Dashboard, modules et marketplace fonctionnent ensemble dans un seul produit premium."
                      : "Dashboard, modules and marketplace all work together inside one premium product.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  style={{
                    padding: "16px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid rgba(148,163,184,0.14)",
                    boxShadow: "0 14px 34px rgba(15,23,42,0.04)",
                  }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "8px",
                      fontSize: "16px",
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
                      fontSize: "14px",
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
              padding: "22px",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
              border: "1px solid rgba(148,163,184,0.16)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#7288a3",
              }}
            >
              {locale === "fr" ? "Pourquoi les parents l'utilisent" : "Why parents use it"}
            </p>

            <div style={{ display: "grid", gap: "12px" }}>
              {(
                locale === "fr"
                  ? [
                      "Suivre le sommeil, l'alimentation et les soins au même endroit",
                      "Transformer l'activité quotidienne en insights IA plus clairs",
                      "Construire des routines plus sereines avec plus de confiance",
                    ]
                  : [
                      "Track sleep, food and care in one place",
                      "Turn daily activity into clearer AI-powered insights",
                      "Build calmer routines with more confidence",
                    ]
              ).map((item, index) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: "12px",
                    alignItems: "flex-start",
                    padding: "14px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid #e5edf5",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "999px",
                      display: "grid",
                      placeItems: "center",
                      background: "#0f172a",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "13px",
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
                      fontSize: "14px",
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
            borderRadius: "30px",
            boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#93c5fd",
                marginBottom: "12px",
              }}
            >
              {mode === "login"
                ? locale === "fr"
                  ? "Accès au compte"
                  : "Account access"
                : locale === "fr"
                  ? "Nouveau compte"
                  : "New account"}
            </p>

            <h2
              style={{
                fontSize: "34px",
                lineHeight: 1.08,
                marginBottom: "10px",
                color: "#fff",
              }}
            >
              {mode === "login" ? t.sideTitleLogin : t.sideTitleSignup}
            </h2>

            <p
              style={{
                color: "#cbd5e1",
                lineHeight: 1.8,
                fontSize: "15px",
                marginBottom: "22px",
              }}
            >
              {mode === "login" ? t.sideTextLogin : t.sideTextSignup}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginBottom: "20px",
                background: "rgba(255,255,255,0.08)",
                padding: "6px",
                borderRadius: "16px",
                border: "1px solid rgba(255,255,255,0.08)",
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
                  flex: 1,
                  border: "none",
                  borderRadius: "12px",
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
                  flex: 1,
                  border: "none",
                  borderRadius: "12px",
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
                {t.signupTab}
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              <label style={{ display: "grid", gap: "8px" }}>
                <span style={darkLabelStyle}>{t.email}</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  style={darkInputStyle}
                />
              </label>

              <label style={{ display: "grid", gap: "8px" }}>
                <span style={darkLabelStyle}>{t.password}</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  style={darkInputStyle}
                />
              </label>

              {mode === "signup" ? (
                <label style={{ display: "grid", gap: "8px" }}>
                  <span style={darkLabelStyle}>{t.confirmPassword}</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    style={darkInputStyle}
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
                  background: "#ffffff",
                  color: "#0f172a",
                  padding: "14px 18px",
                  fontSize: "14px",
                  fontWeight: 800,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.7 : 1,
                  boxShadow: "0 12px 30px rgba(15,23,42,0.18)",
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
                        ? "rgba(34,197,94,0.12)"
                        : "rgba(239,68,68,0.12)",
                    color: messageType === "success" ? "#d1fae5" : "#fecdd3",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {message}
                </div>
              ) : null}
            </form>
          </div>

          <div
            style={{
              marginTop: "22px",
              padding: "20px",
              borderRadius: "22px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#93c5fd",
              }}
            >
              {t.afterLogin}
            </p>

            <div style={{ display: "grid", gap: "10px" }}>
              {t.afterLoginItems.map((item) => (
                <div
                  key={item}
                  style={{
                    color: "#e2e8f0",
                    lineHeight: 1.65,
                    fontSize: "14px",
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

const darkLabelStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#ffffff",
};

const darkInputStyle: CSSProperties = {
  width: "100%",
  padding: "13px 14px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  outline: "none",
  fontSize: "15px",
};