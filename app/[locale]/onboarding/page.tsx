"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";

type PlanTier = "basic" | "premium" | "elite";
type Locale = "en" | "fr";

type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

const PROFILE_STORAGE_KEY = "sb_profile";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

const copy = {
  en: {
    backHome: "Back to homepage",
    badge: "Personalized onboarding",
    title: "Set up your baby profile",
    subtitle:
      "This takes less than 2 minutes and helps Smart Baby System personalize sleep, food, care and AI guidance.",
    selectedPlan: "Selected plan",
    planHelper:
      "You can change this later. Your onboarding will continue with the selected plan experience.",
    plans: {
      basic: {
        name: "Basic",
        price: "€7 / month",
        text: "A simple starting point for daily tracking.",
        tag: "Essential access",
        features: [
          "Basic sleep tracking",
          "Simple food logs",
          "Care overview",
          "Short AI guidance",
        ],
      },
      premium: {
        name: "Premium",
        price: "€11 / month",
        text: "The best balance of guidance, AI and planning.",
        tag: "Most popular",
        features: [
          "Advanced sleep insights",
          "Food patterns and reactions",
          "Smarter care summaries",
          "Full AI action plan",
          "Premium dashboard experience",
        ],
      },
      elite: {
        name: "Elite",
        price: "€15 / month",
        text: "The deepest guidance and highest-value experience.",
        tag: "Full experience",
        features: [
          "Everything in Premium",
          "Advanced AI guidance",
          "Full tracking and optimization",
          "Priority insights",
        ],
      },
    },
    steps: {
      profile: "Profile",
      routine: "Routine",
      goals: "Goals",
    },
    labels: {
      babyName: "Baby name",
      ageMonths: "Age in months",
      bedtime: "Usual bedtime",
      mainConcern: "Main concern right now",
      notes: "Extra notes",
    },
    placeholders: {
      babyName: "e.g. Emma",
      ageMonths: "e.g. 8",
      bedtime: "e.g. 19:30",
      mainConcern: "e.g. Sleep regression, feeding rhythm, daily routine",
      notes:
        "Anything useful for the AI to understand your current situation.",
    },
    helper: {
      babyName: "This helps personalize the experience.",
      ageMonths: "Used to adapt sleep, food and care guidance.",
      bedtime: "Helps the system understand your daily rhythm.",
      mainConcern: "The system will focus more on this area first.",
      notes: "Optional, but useful for better context.",
    },
    concernOptions: {
      chooseOne: "Choose one",
      sleepRhythm: "Sleep rhythm",
      shortNaps: "Short naps",
      nightWaking: "Night waking",
      foodReactions: "Food reactions",
      feedingRoutine: "Feeding routine",
      dailyRoutine: "Daily routine",
      generalSupport: "General support",
    },
    benefitTitle: "What you unlock after onboarding",
    benefits: [
      "A more personalized dashboard",
      "Stronger sleep, food and care suggestions",
      "Better AI context from day one",
    ],
    trustTitle: "Why this matters",
    trustText:
      "Smart Baby System is more useful when it understands your baby’s age, rhythm and current priorities before giving suggestions.",
    previewTitle: "What happens next",
    previewSteps: [
      "Your profile is saved securely",
      "Your selected plan is applied",
      "You continue to your personalized dashboard",
    ],
    whatYouGet: "What you get",
    save: "Save and continue",
    saving: "Saving...",
    skip: "Skip for now",
    errors: {
      age: "Please enter a valid age in months.",
      general: "Something went wrong. Please try again.",
    },
  },
  fr: {
    backHome: "Retour à l’accueil",
    badge: "Onboarding personnalisé",
    title: "Configurez le profil de votre bébé",
    subtitle:
      "Cela prend moins de 2 minutes et aide Smart Baby System à personnaliser le sommeil, l’alimentation, les soins et la guidance IA.",
    selectedPlan: "Formule sélectionnée",
    planHelper:
      "Vous pourrez la modifier plus tard. L’onboarding continue avec l’expérience liée à la formule choisie.",
    plans: {
      basic: {
        name: "Basic",
        price: "€7 / mois",
        text: "Un point de départ simple pour le suivi quotidien.",
        tag: "Accès essentiel",
        features: [
          "Suivi sommeil de base",
          "Logs repas simples",
          "Vue générale des soins",
          "Guidance IA courte",
        ],
      },
      premium: {
        name: "Premium",
        price: "€11 / mois",
        text: "Le meilleur équilibre entre guidance, IA et planification.",
        tag: "Le plus populaire",
        features: [
          "Insights sommeil avancés",
          "Schémas alimentaires et réactions",
          "Résumés soins plus intelligents",
          "Plan d’action IA complet",
          "Expérience dashboard premium",
        ],
      },
      elite: {
        name: "Elite",
        price: "€15 / mois",
        text: "La guidance la plus approfondie et l’expérience la plus complète.",
        tag: "Expérience complète",
        features: [
          "Tout ce qui est dans Premium",
          "Guidance IA avancée",
          "Suivi et optimisation complets",
          "Insights prioritaires",
        ],
      },
    },
    steps: {
      profile: "Profil",
      routine: "Routine",
      goals: "Objectifs",
    },
    labels: {
      babyName: "Nom du bébé",
      ageMonths: "Âge en mois",
      bedtime: "Heure habituelle du coucher",
      mainConcern: "Préoccupation principale du moment",
      notes: "Notes supplémentaires",
    },
    placeholders: {
      babyName: "ex. Emma",
      ageMonths: "ex. 8",
      bedtime: "ex. 19:30",
      mainConcern: "ex. Régression du sommeil, rythme alimentaire, routine",
      notes:
        "Tout élément utile pour que l’IA comprenne mieux votre situation actuelle.",
    },
    helper: {
      babyName: "Cela aide à personnaliser l’expérience.",
      ageMonths:
        "Utilisé pour adapter la guidance sommeil, alimentation et soins.",
      bedtime: "Aide le système à comprendre votre rythme quotidien.",
      mainConcern:
        "Le système se concentrera davantage sur cette zone au départ.",
      notes: "Optionnel, mais utile pour un meilleur contexte.",
    },
    concernOptions: {
      chooseOne: "Choisissez une option",
      sleepRhythm: "Rythme de sommeil",
      shortNaps: "Siestes courtes",
      nightWaking: "Réveils nocturnes",
      foodReactions: "Réactions alimentaires",
      feedingRoutine: "Routine alimentaire",
      dailyRoutine: "Routine quotidienne",
      generalSupport: "Support général",
    },
    benefitTitle: "Ce que vous débloquez après l’onboarding",
    benefits: [
      "Un dashboard plus personnalisé",
      "De meilleures suggestions sommeil, alimentation et soins",
      "Un meilleur contexte IA dès le premier jour",
    ],
    trustTitle: "Pourquoi c’est important",
    trustText:
      "Smart Baby System est plus utile lorsqu’il comprend l’âge, le rythme et les priorités actuelles de votre bébé avant de proposer des suggestions.",
    previewTitle: "Ce qui se passe ensuite",
    previewSteps: [
      "Votre profil est enregistré en sécurité",
      "Votre formule sélectionnée est appliquée",
      "Vous continuez vers votre dashboard personnalisé",
    ],
    whatYouGet: "Ce que vous obtenez",
    save: "Enregistrer et continuer",
    saving: "Enregistrement...",
    skip: "Passer pour l’instant",
    errors: {
      age: "Veuillez entrer un âge valide en mois.",
      general: "Une erreur est survenue. Veuillez réessayer.",
    },
  },
} as const;

function getPlanFromUrl(): PlanTier {
  if (typeof window === "undefined") return "premium";
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("plan");
  if (fromUrl === "basic" || fromUrl === "premium" || fromUrl === "elite") {
    return fromUrl;
  }

  const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
  if (savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite") {
    return savedPlan;
  }

  return "premium";
}

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function update() {
      setIsMobile(window.innerWidth <= breakpoint);
    }

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);

  return isMobile;
}

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useIsMobile();

  const rawLocale =
    typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("premium");
  const [isReady, setIsReady] = useState(false);

  const [form, setForm] = useState<BabyProfile>({
    babyName: "",
    ageMonths: "",
    bedtime: "",
    mainConcern: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const normalizedPlan = getPlanFromUrl();
    setSelectedPlan(normalizedPlan);
    localStorage.setItem(PLAN_STORAGE_KEY, normalizedPlan);

    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as Partial<BabyProfile>;
        setForm({
          babyName: parsed.babyName ?? "",
          ageMonths: parsed.ageMonths ?? "",
          bedtime: parsed.bedtime ?? "",
          mainConcern: parsed.mainConcern ?? "",
          notes: parsed.notes ?? "",
        });
      } catch {
        // ignore invalid saved data
      }
    }

    setIsReady(true);
  }, []);

  function choosePlan(plan: PlanTier) {
    setSelectedPlan(plan);
    if (typeof window !== "undefined") {
      localStorage.setItem(PLAN_STORAGE_KEY, plan);
    }
  }

  function updateField<K extends keyof BabyProfile>(
    key: K,
    value: BabyProfile[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      if (form.ageMonths.trim()) {
        const age = Number(form.ageMonths);
        if (Number.isNaN(age) || age < 0 || age > 72) {
          setErrorMessage(t.errors.age);
          setLoading(false);
          return;
        }
      }

      if (typeof window !== "undefined") {
        const profileData: BabyProfile = {
          babyName: form.babyName,
          ageMonths: form.ageMonths,
          bedtime: form.bedtime,
          mainConcern: form.mainConcern,
          notes: form.notes,
        };

        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
        localStorage.setItem(PLAN_STORAGE_KEY, selectedPlan);
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setErrorMessage(t.errors.general);
      setLoading(false);
    }
  }

  const plan = useMemo(() => t.plans[selectedPlan], [selectedPlan, t.plans]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
        padding: isMobile ? "20px 14px" : "32px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "stretch" : "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "22px",
            flexDirection: isMobile ? "column" : "row",
          }}
        >
          <a
            href={`/${locale}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "#334155",
              fontWeight: 700,
              width: isMobile ? "100%" : "auto",
            }}
          >
            <span
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                background: "#0f172a",
                color: "#fff",
                fontSize: "13px",
                fontWeight: 800,
                flexShrink: 0,
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
              background: "rgba(255,255,255,0.82)",
              border: "1px solid rgba(148,163,184,0.16)",
              color: "#475569",
              fontWeight: 700,
              fontSize: "13px",
              width: isMobile ? "fit-content" : "auto",
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
            {t.badge}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: isMobile ? "1fr" : "1.08fr 0.92fr",
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(148,163,184,0.16)",
              borderRadius: isMobile ? "24px" : "30px",
              padding: isMobile ? "20px" : "28px",
              boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#7288a3",
                  marginBottom: "10px",
                }}
              >
                Smart Baby System
              </p>

              <h1
                style={{
                  margin: "0 0 12px",
                  fontSize: isMobile ? "34px" : "clamp(34px, 4.8vw, 56px)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.05em",
                  color: "#0f172a",
                  maxWidth: "760px",
                }}
              >
                {t.title}
              </h1>

              <p
                style={{
                  margin: 0,
                  fontSize: isMobile ? "15px" : "17px",
                  lineHeight: 1.8,
                  color: "#5b6b7e",
                  maxWidth: "760px",
                }}
              >
                {t.subtitle}
              </p>
            </div>

            <div
              style={{
                marginBottom: "22px",
                padding: isMobile ? "16px" : "18px",
                borderRadius: "22px",
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
                {t.selectedPlan}
              </p>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  gridTemplateColumns: isMobile
                    ? "1fr"
                    : "repeat(3, minmax(0, 1fr))",
                }}
              >
                {(["basic", "premium", "elite"] as PlanTier[]).map((item) => {
                  const active = item === selectedPlan;
                  const itemContent = t.plans[item];

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => choosePlan(item)}
                      style={{
                        borderRadius: "20px",
                        padding: "16px",
                        textAlign: "left",
                        border: active
                          ? "1px solid rgba(37,99,235,0.24)"
                          : "1px solid rgba(148,163,184,0.14)",
                        background: active ? "rgba(239,248,255,0.96)" : "#fff",
                        boxShadow: active
                          ? "0 16px 34px rgba(37,99,235,0.08)"
                          : "0 10px 24px rgba(15,23,42,0.03)",
                        cursor: "pointer",
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "999px",
                            background: active ? "#2563eb" : "#cbd5e1",
                            flexShrink: 0,
                          }}
                        />
                        <strong
                          style={{
                            fontSize: "16px",
                            color: "#0f172a",
                          }}
                        >
                          {itemContent.name}
                        </strong>
                      </div>

                      <div
                        style={{
                          fontSize: "24px",
                          fontWeight: 800,
                          color: "#0f172a",
                          marginBottom: "6px",
                        }}
                      >
                        {itemContent.price.split(" / ")[0]}
                      </div>

                      <p
                        style={{
                          margin: 0,
                          color: "#64748b",
                          fontSize: "14px",
                          lineHeight: 1.65,
                        }}
                      >
                        {itemContent.tag}
                      </p>
                    </button>
                  );
                })}
              </div>

              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "#64748b",
                }}
              >
                {t.planHelper}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(3, minmax(0, 1fr))",
                marginBottom: "22px",
              }}
            >
              {[t.steps.profile, t.steps.routine, t.steps.goals].map(
                (item, index) => (
                  <div
                    key={item}
                    style={{
                      padding: "14px",
                      borderRadius: "18px",
                      background: "rgba(255,255,255,0.84)",
                      border: "1px solid rgba(148,163,184,0.14)",
                    }}
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "999px",
                        display: "grid",
                        placeItems: "center",
                        marginBottom: "10px",
                        background: "#0f172a",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "13px",
                      }}
                    >
                      {index + 1}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "#0f172a",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      {item}
                    </p>
                  </div>
                )
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                }}
              >
                <Field
                  label={t.labels.babyName}
                  helper={t.helper.babyName}
                  value={form.babyName}
                  placeholder={t.placeholders.babyName}
                  onChange={(value) => updateField("babyName", value)}
                />

                <div
                  style={{
                    display: "grid",
                    gap: "16px",
                    gridTemplateColumns: isMobile
                      ? "1fr"
                      : "repeat(2, minmax(0, 1fr))",
                  }}
                >
                  <Field
                    label={t.labels.ageMonths}
                    helper={t.helper.ageMonths}
                    value={form.ageMonths}
                    placeholder={t.placeholders.ageMonths}
                    onChange={(value) => updateField("ageMonths", value)}
                    inputMode="numeric"
                  />

                  <Field
                    label={t.labels.bedtime}
                    helper={t.helper.bedtime}
                    value={form.bedtime}
                    placeholder={t.placeholders.bedtime}
                    onChange={(value) => updateField("bedtime", value)}
                    type="time"
                  />
                </div>

                <SelectField
                  label={t.labels.mainConcern}
                  helper={t.helper.mainConcern}
                  value={form.mainConcern}
                  onChange={(value) => updateField("mainConcern", value)}
                  options={[
                    { value: "", label: t.concernOptions.chooseOne },
                    {
                      value: t.concernOptions.sleepRhythm,
                      label: t.concernOptions.sleepRhythm,
                    },
                    {
                      value: t.concernOptions.shortNaps,
                      label: t.concernOptions.shortNaps,
                    },
                    {
                      value: t.concernOptions.nightWaking,
                      label: t.concernOptions.nightWaking,
                    },
                    {
                      value: t.concernOptions.foodReactions,
                      label: t.concernOptions.foodReactions,
                    },
                    {
                      value: t.concernOptions.feedingRoutine,
                      label: t.concernOptions.feedingRoutine,
                    },
                    {
                      value: t.concernOptions.dailyRoutine,
                      label: t.concernOptions.dailyRoutine,
                    },
                    {
                      value: t.concernOptions.generalSupport,
                      label: t.concernOptions.generalSupport,
                    },
                  ]}
                />

                <TextAreaField
                  label={t.labels.notes}
                  helper={t.helper.notes}
                  value={form.notes}
                  placeholder={t.placeholders.notes}
                  onChange={(value) => updateField("notes", value)}
                />
              </div>

              {errorMessage ? (
                <div
                  style={{
                    marginTop: "18px",
                    background: "#fff1f2",
                    color: "#be123c",
                    border: "1px solid #fecdd3",
                    borderRadius: "16px",
                    padding: "12px 14px",
                    fontSize: "14px",
                  }}
                >
                  {errorMessage}
                </div>
              ) : null}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginTop: "24px",
                  flexDirection: isMobile ? "column" : "row",
                }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...primaryButtonStyle,
                    opacity: loading ? 0.72 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {loading ? t.saving : t.save}
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/${locale}/dashboard`)}
                  style={{
                    ...secondaryButtonStyle,
                    width: isMobile ? "100%" : "auto",
                  }}
                >
                  {t.skip}
                </button>
              </div>
            </form>
          </section>

          <aside
            style={{
              background: "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
              color: "#fff",
              borderRadius: isMobile ? "24px" : "30px",
              padding: isMobile ? "20px" : "28px",
              boxShadow: "0 22px 60px rgba(15,23,42,0.18)",
              minHeight: "100%",
              display: "grid",
              gap: "18px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#93c5fd",
                }}
              >
                {t.selectedPlan}
              </p>

              <h2
                style={{
                  margin: "12px 0 6px",
                  fontSize: isMobile ? "28px" : "34px",
                  lineHeight: 1.1,
                  wordBreak: "break-word",
                }}
              >
                {isReady ? plan.name : "Loading..."}
              </h2>

              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {isReady ? plan.price : ""}
              </p>

              <p
                style={{
                  margin: 0,
                  lineHeight: 1.7,
                  color: "#cbd5e1",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                {isReady ? plan.text : ""}
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "22px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#93c5fd",
                }}
              >
                {t.whatYouGet}
              </p>

              <div style={{ display: "grid", gap: "10px" }}>
                {isReady &&
                  plan.features.map((feature) => (
                    <div
                      key={feature}
                      style={{
                        color: "#e2e8f0",
                        lineHeight: 1.6,
                        fontSize: "14px",
                        wordBreak: "break-word",
                      }}
                    >
                      • {feature}
                    </div>
                  ))}
              </div>
            </div>

            <div
              style={{
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
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#93c5fd",
                }}
              >
                {t.trustTitle}
              </p>

              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  lineHeight: 1.7,
                  fontSize: "15px",
                }}
              >
                {t.trustText}
              </p>
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "22px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p
                style={{
                  margin: "0 0 12px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#93c5fd",
                }}
              >
                {t.previewTitle}
              </p>

              <div style={{ display: "grid", gap: "10px" }}>
                {t.previewSteps.map((item, index) => (
                  <div
                    key={item}
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "flex-start",
                      color: "#e2e8f0",
                      lineHeight: 1.6,
                      fontSize: "14px",
                    }}
                  >
                    <span
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "999px",
                        display: "grid",
                        placeItems: "center",
                        background: "rgba(255,255,255,0.14)",
                        color: "#fff",
                        fontWeight: 800,
                        fontSize: "12px",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  helper,
  value,
  placeholder,
  onChange,
  type = "text",
  inputMode,
}: {
  label: string;
  helper: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span style={labelStyle}>{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
      <span style={helperStyle}>{helper}</span>
    </label>
  );
}

function SelectField({
  label,
  helper,
  value,
  onChange,
  options,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span style={labelStyle}>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        {options.map((option) => (
          <option key={`${option.value}-${option.label}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span style={helperStyle}>{helper}</span>
    </label>
  );
}

function TextAreaField({
  label,
  helper,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  helper: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span style={labelStyle}>{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={5}
        style={{
          ...inputStyle,
          resize: "vertical",
          minHeight: "120px",
          paddingTop: "14px",
        }}
      />
      <span style={helperStyle}>{helper}</span>
    </label>
  );
}

const labelStyle: CSSProperties = {
  fontSize: "14px",
  fontWeight: 700,
  color: "#0f172a",
};

const helperStyle: CSSProperties = {
  fontSize: "13px",
  color: "#64748b",
  lineHeight: 1.6,
};

const inputStyle: CSSProperties = {
  width: "100%",
  border: "1px solid rgba(148,163,184,0.22)",
  borderRadius: "16px",
  padding: "13px 14px",
  fontSize: "14px",
  outline: "none",
  background: "#fff",
  color: "#0f172a",
};

const primaryButtonStyle: CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "14px 22px",
  background: "#0f172a",
  color: "#fff",
  fontWeight: 800,
  cursor: "pointer",
  boxShadow: "0 12px 30px rgba(15,23,42,0.16)",
};

const secondaryButtonStyle: CSSProperties = {
  borderRadius: "999px",
  padding: "14px 22px",
  background: "#fff",
  color: "#0f172a",
  border: "1px solid rgba(148,163,184,0.25)",
  fontWeight: 800,
  cursor: "pointer",
};