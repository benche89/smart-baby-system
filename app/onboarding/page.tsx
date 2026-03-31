"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";

type PlanTier = "basic" | "premium" | "elite";

type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

const PROFILE_STORAGE_KEY = "sb_profile";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

const PLAN_CONTENT: Record<
  PlanTier,
  {
    title: string;
    price: string;
    subtitle: string;
    features: string[];
  }
> = {
  basic: {
    title: "Basic",
    price: "€7 / month",
    subtitle: "A simple entry point for parents who want the essentials.",
    features: [
      "Basic sleep tracking",
      "Simple food logs",
      "Care overview",
      "Short AI guidance",
    ],
  },
  premium: {
    title: "Premium",
    price: "€11 / month",
    subtitle: "Better insights, smarter suggestions and a fuller parenting system.",
    features: [
      "Advanced sleep insights",
      "Food patterns and reactions",
      "Smarter care summaries",
      "Full AI action plan",
      "Premium dashboard experience",
    ],
  },
  elite: {
    title: "Elite",
    price: "€15 / month",
    subtitle: "For families who want the most complete and premium experience.",
    features: [
      "Everything in Premium",
      "Advanced AI guidance",
      "Full tracking and optimization",
      "Priority insights",
    ],
  },
};

export default function OnboardingPage() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("premium");
  const [isReady, setIsReady] = useState(false);

  const [form, setForm] = useState<BabyProfile>({
    babyName: "",
    ageMonths: "",
    bedtime: "",
    mainConcern: "",
    notes: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const planFromUrl = params.get("plan");
    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);

    const normalizedPlan: PlanTier =
      planFromUrl === "basic" || planFromUrl === "premium" || planFromUrl === "elite"
        ? planFromUrl
        : savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite"
          ? savedPlan
          : "premium";

    setSelectedPlan(normalizedPlan);
    localStorage.setItem(PLAN_STORAGE_KEY, normalizedPlan);

    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as BabyProfile;
        setForm({
          babyName: parsed.babyName || "",
          ageMonths: parsed.ageMonths || "",
          bedtime: parsed.bedtime || "",
          mainConcern: parsed.mainConcern || "",
          notes: parsed.notes || "",
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

    router.push("/dashboard");
  }

  const plan = useMemo(() => PLAN_CONTENT[selectedPlan], [selectedPlan]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(166, 210, 255, 0.18), transparent 26%), linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%)",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          display: "grid",
          gap: "24px",
          gridTemplateColumns: "1.1fr 0.9fr",
        }}
      >
        <section
          style={{
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(148,163,184,0.16)",
            borderRadius: "28px",
            padding: "28px",
            boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
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
              Smart Baby System
            </p>

            <h1
              style={{
                margin: "10px 0 10px",
                fontSize: "40px",
                lineHeight: 1.05,
                color: "#0f172a",
              }}
            >
              Set up your premium parenting profile
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#475569",
                maxWidth: "760px",
              }}
            >
              Add a few key details so Smart Baby System can personalize sleep, food and care
              guidance for your baby.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "14px",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              marginBottom: "24px",
            }}
          >
            <button
              type="button"
              onClick={() => choosePlan("basic")}
              style={{
                borderRadius: "20px",
                padding: "18px",
                textAlign: "left",
                border:
                  selectedPlan === "basic"
                    ? "2px solid #0f172a"
                    : "1px solid rgba(148,163,184,0.22)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Basic
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                €7
              </div>

              <div style={{ marginTop: "6px", color: "#64748b", fontSize: "14px" }}>
                Essential access
              </div>
            </button>

            <button
              type="button"
              onClick={() => choosePlan("premium")}
              style={{
                borderRadius: "20px",
                padding: "18px",
                textAlign: "left",
                border:
                  selectedPlan === "premium"
                    ? "2px solid #0f172a"
                    : "1px solid rgba(148,163,184,0.22)",
                background: selectedPlan === "premium" ? "#0f172a" : "#fff",
                color: selectedPlan === "premium" ? "#fff" : "#0f172a",
                cursor: "pointer",
                boxShadow:
                  selectedPlan === "premium" ? "0 18px 40px rgba(15,23,42,0.16)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: selectedPlan === "premium" ? "#cbd5e1" : "#64748b",
                }}
              >
                Premium
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "28px",
                  fontWeight: 700,
                }}
              >
                €11
              </div>

              <div
                style={{
                  marginTop: "6px",
                  color: selectedPlan === "premium" ? "#cbd5e1" : "#64748b",
                  fontSize: "14px",
                }}
              >
                Most popular
              </div>
            </button>

            <button
              type="button"
              onClick={() => choosePlan("elite")}
              style={{
                borderRadius: "20px",
                padding: "18px",
                textAlign: "left",
                border:
                  selectedPlan === "elite"
                    ? "2px solid #0f172a"
                    : "1px solid rgba(148,163,184,0.22)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#64748b",
                }}
              >
                Elite
              </div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                €15
              </div>

              <div style={{ marginTop: "6px", color: "#64748b", fontSize: "14px" }}>
                Full experience
              </div>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
                  Baby name
                </span>

                <input
                  type="text"
                  value={form.babyName}
                  onChange={(e) => setForm((prev) => ({ ...prev, babyName: e.target.value }))}
                  placeholder="e.g. Emma"
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
                  Age in months
                </span>

                <input
                  type="number"
                  value={form.ageMonths}
                  onChange={(e) => setForm((prev) => ({ ...prev, ageMonths: e.target.value }))}
                  placeholder="e.g. 8"
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
                  Usual bedtime
                </span>

                <input
                  type="time"
                  value={form.bedtime}
                  onChange={(e) => setForm((prev) => ({ ...prev, bedtime: e.target.value }))}
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
                  Main concern
                </span>

                <select
                  value={form.mainConcern}
                  onChange={(e) => setForm((prev) => ({ ...prev, mainConcern: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="">Choose one</option>
                  <option value="Sleep rhythm">Sleep rhythm</option>
                  <option value="Short naps">Short naps</option>
                  <option value="Night waking">Night waking</option>
                  <option value="Food reactions">Food reactions</option>
                  <option value="Feeding routine">Feeding routine</option>
                  <option value="Daily routine">Daily routine</option>
                  <option value="General support">General support</option>
                </select>
              </label>

              <label
                style={{
                  display: "grid",
                  gap: "8px",
                  gridColumn: "1 / -1",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#0f172a",
                  }}
                >
                  Notes
                </span>

                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Anything useful about naps, meals, allergies, routines, signals..."
                  rows={5}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: "120px",
                    paddingTop: "14px",
                  }}
                />
              </label>
            </div>

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
                Save profile & open dashboard
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
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
                Skip for now
              </button>
            </div>
          </form>
        </section>

        <aside
          style={{
            background: "linear-gradient(180deg, #0f172a 0%, #172554 100%)",
            color: "#fff",
            borderRadius: "28px",
            padding: "28px",
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
            Selected plan
          </p>

          <h2
            style={{
              margin: "12px 0 6px",
              fontSize: "34px",
              lineHeight: 1.1,
            }}
          >
            {isReady ? plan.title : "Loading..."}
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
              margin: "0 0 20px",
              lineHeight: 1.7,
              color: "#cbd5e1",
            }}
          >
            {isReady ? plan.subtitle : ""}
          </p>

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
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#93c5fd",
              }}
            >
              What you get
            </p>

            <div style={{ display: "grid", gap: "10px" }}>
              {isReady &&
                plan.features.map((feature) => (
                  <div key={feature} style={{ color: "#e2e8f0", lineHeight: 1.5 }}>
                    • {feature}
                  </div>
                ))}
            </div>
          </div>

          <div
            style={{
              marginTop: "18px",
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
              Why this matters
            </p>

            <p
              style={{
                margin: 0,
                color: "#cbd5e1",
                lineHeight: 1.7,
              }}
            >
              The better your profile, the more useful the dashboard becomes. Sleep guidance,
              food patterns and care suggestions work best when the system understands your
              baby&apos;s real context.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

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