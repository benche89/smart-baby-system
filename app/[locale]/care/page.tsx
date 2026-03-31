"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AppModuleLayout from "../../../components/AppModuleLayout";

type PlanTier = "basic" | "premium" | "elite";

type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

type CareEntry = {
  id: number;
  time: string;
  careType: string;
  status: string;
  note: string;
  createdAt: string;
};

const PROFILE_STORAGE_KEY = "sb_profile";
const CARE_STORAGE_KEY = "sb_care_entries";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

function getTodayLabel() {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getCareStage(ageMonths: number) {
  if (ageMonths <= 3) return "Early newborn care rhythm";
  if (ageMonths <= 6) return "Developing daily care routine";
  if (ageMonths <= 9) return "More structured care rhythm";
  if (ageMonths <= 12) return "Stable routine-building stage";
  if (ageMonths <= 18) return "Expanding daily consistency";
  return "Toddler routine support";
}

export default function CarePage() {
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [todayLabel, setTodayLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");

  const [careForm, setCareForm] = useState({
    time: "",
    careType: "",
    status: "",
    note: "",
  });

  const [careHistory, setCareHistory] = useState<CareEntry[]>([]);
  const [aiCareInput, setAiCareInput] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    const savedCareHistory = localStorage.getItem(CARE_STORAGE_KEY);
    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY) as PlanTier | null;

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as BabyProfile;
        setProfile(parsed);
      } catch {
        // ignore invalid profile
      }
    }

    if (savedCareHistory) {
      try {
        const parsed = JSON.parse(savedCareHistory) as CareEntry[];
        setCareHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        // ignore invalid care history
      }
    }

    if (savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite") {
      setSelectedPlan(savedPlan);
    }

    setTodayLabel(getTodayLabel());
  }, []);

  function choosePlan(plan: PlanTier) {
    setSelectedPlan(plan);
    localStorage.setItem(PLAN_STORAGE_KEY, plan);
  }

  function handleCareSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!careForm.time || !careForm.careType || !careForm.status) return;

    const newEntry: CareEntry = {
      id: Date.now(),
      time: careForm.time,
      careType: careForm.careType,
      status: careForm.status,
      note: careForm.note,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(CARE_STORAGE_KEY) || "[]") as CareEntry[];
    const updatedHistory = [newEntry, ...existing].slice(0, 12);

    setCareHistory(updatedHistory);
    localStorage.setItem(CARE_STORAGE_KEY, JSON.stringify(updatedHistory));

    setCareForm({
      time: "",
      careType: "",
      status: "",
      note: "",
    });
  }

  function clearCareHistory() {
    localStorage.removeItem(CARE_STORAGE_KEY);
    setCareHistory([]);
  }

  const babyName = profile?.babyName || "Your baby";
  const ageMonths = Number(profile?.ageMonths || 0);
  const mainConcern = profile?.mainConcern || "Not set";
  const notes = profile?.notes || "No extra notes added yet.";

  const careStage = useMemo(() => getCareStage(ageMonths), [ageMonths]);

  const careInsight = useMemo(() => {
    if (careHistory.length === 0) {
      return {
        title: "Add care logs to unlock routine insights",
        description:
          "Once you save care activities, the system can reveal consistency patterns, routine gaps and useful daily signals.",
        action: "Log the most recent care activities below.",
        rhythmStatus: "No care pattern available yet.",
        totalEntries: "-",
        consistencySignal: "No data yet",
        recentWindow: "-",
      };
    }

    const completedCount = careHistory.filter((entry) => entry.status === "Completed").length;
    const partialCount = careHistory.filter((entry) => entry.status === "Partial").length;
    const difficultCount = careHistory.filter((entry) => entry.status === "Difficult").length;

    const times = careHistory
      .map((entry) => entry.time)
      .filter(Boolean)
      .sort();

    let rhythmStatus = "Daily care routine looks fairly stable.";
    if (careHistory.length <= 2) rhythmStatus = "Still building care routine data.";
    if (difficultCount >= 2) rhythmStatus = "Some friction detected in daily care routines.";
    else if (partialCount >= 2) rhythmStatus = "Routine consistency looks mixed.";

    let consistencySignal = "Care flow looks mostly consistent.";
    if (difficultCount >= 2) consistencySignal = "Repeated difficulty signals detected.";
    else if (partialCount >= 2) consistencySignal = "Some care routines may need simplification.";
    else if (completedCount === careHistory.length) consistencySignal =
      "Strong consistency across recent care logs.";

    const uniqueCareTypes = new Set(careHistory.map((entry) => entry.careType)).size;

    return {
      title: `${babyName}'s routine consistency is becoming clearer`,
      description:
        `${careStage} • ${careHistory.length} recent care logs saved. The system is observing timing, consistency and routine friction.`,
      action:
        difficultCount >= 2
          ? "Reduce routine complexity today and use calmer transitions."
          : "Keep routines predictable and continue tracking daily essentials clearly.",
      rhythmStatus,
      totalEntries: `${careHistory.length} recent logs`,
      consistencySignal,
      varietySignal: `${uniqueCareTypes} care type(s) recently tracked`,
      recentWindow:
        times.length > 0 ? `${times[0]} → ${times[times.length - 1]}` : "-",
    };
  }, [careHistory, babyName, careStage]);

  const careScore = useMemo(() => {
    if (careHistory.length === 0) return 0;

    let score = 60;

    const completedCount = careHistory.filter((entry) => entry.status === "Completed").length;
    const partialCount = careHistory.filter((entry) => entry.status === "Partial").length;
    const difficultCount = careHistory.filter((entry) => entry.status === "Difficult").length;

    score += completedCount * 6;
    score -= partialCount * 3;
    score -= difficultCount * 7;

    const uniqueCareTypes = new Set(careHistory.map((entry) => entry.careType)).size;
    score += uniqueCareTypes * 2;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [careHistory]);

  const aiCareAssistant = useMemo(() => {
    const q = aiCareInput.trim().toLowerCase();

    if (!q) {
      return {
        title: "Ask care AI for smarter routine guidance",
        message:
          "You can ask about routines, bath time, diapers, consistency or calming transitions.",
        plan: null as string[] | null,
        eliteInsights: null as string[] | null,
      };
    }

    if (q.includes("routine") || q.includes("care") || q.includes("schedule")) {
      return {
        title: "Routine guidance activated",
        message:
          "The system is focusing on calmer structure, more predictable transitions and routine consistency.",
        plan: [
          "Keep the same order of care activities today",
          "Reduce unnecessary variation in routine",
          "Use calm transitions between care steps",
          "Protect the moments before naps and bedtime",
        ],
        eliteInsights: [
          "Predictability often matters more than complexity",
          "Small repeated routines can reduce overall daily stress",
          "A stable sequence helps babies anticipate what comes next",
        ],
      };
    }

    if (q.includes("bath") || q.includes("washing") || q.includes("hygiene")) {
      return {
        title: "Bath & hygiene support",
        message:
          "The system is prioritizing comfort, calm pacing and reducing friction in hygiene routines.",
        plan: [
          "Keep bath timing predictable",
          "Reduce stimulation before and after bath",
          "Use the same calming sequence",
          "Track whether bath affects sleep positively or negatively",
        ],
        eliteInsights: [
          "The routine around bath may matter more than bath itself",
          "Evening overstimulation can make bath feel harder than it is",
          "Tracking bath timing next to sleep can reveal useful patterns",
        ],
      };
    }

    if (q.includes("diaper") || q.includes("nappy") || q.includes("change")) {
      return {
        title: "Diaper routine support",
        message:
          "The system is focusing on smoother diaper changes and reducing resistance during care moments.",
        plan: [
          "Keep the setup ready before starting",
          "Use the same calm sequence each time",
          "Reduce distractions and rushing",
          "Track if resistance appears more at certain times of day",
        ],
        eliteInsights: [
          "Repeated difficulty at the same time can indicate fatigue or overstimulation",
          "Predictable preparation reduces friction during changes",
          "Routine consistency often improves cooperation gradually",
        ],
      };
    }

    return {
      title: "Care AI context ready",
      message:
        "Your question has been added to the care module. The system will adapt routine guidance around consistency and daily essentials.",
      plan: [
        "Keep care structure simple",
        "Track routine moments consistently",
        "Use calmer transitions",
      ],
      eliteInsights: [
        "Consistency reduces decision fatigue for parents too",
        "Routine clarity is more useful than trying to optimize everything at once",
        "The best care systems are calm enough to repeat daily",
      ],
    };
  }, [aiCareInput]);

  const planAccess = {
    basic: {
      canSeePlan: false,
      canSeeEliteInsights: false,
    },
    premium: {
      canSeePlan: true,
      canSeeEliteInsights: false,
    },
    elite: {
      canSeePlan: true,
      canSeeEliteInsights: true,
    },
  }[selectedPlan];

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
            <a href="/dashboard" className="neoDash__navItem">
              <span>🌙</span>
              <span>Sleep Dashboard</span>
            </a>
            <a href="/food" className="neoDash__navItem">
              <span>🍼</span>
              <span>Food Module</span>
            </a>
            <a href="/care" className="neoDash__navItem neoDash__navItem--active">
              <span>💙</span>
              <span>Care Module</span>
            </a>
            <a href="/onboarding" className="neoDash__navItem">
              <span>✏️</span>
              <span>Edit Profile</span>
            </a>
          </nav>
        </div>

        <div className="neoDash__sidebarCard">
          <p className="neoDash__label">Current focus</p>
          <h3>Care tracking</h3>
          <p>Routines, consistency, hygiene and calmer daily flow.</p>
        </div>
      </aside>

      <section className="neoDash__main">
        <div className="neoDash__topline">
          <div>
            <p className="neoDash__label">Today&apos;s care overview</p>
            <h1>Care module</h1>
            <p className="neoDash__subtitle">
              A premium view for routines, consistency, daily essentials and smoother care guidance.
            </p>
          </div>

          <div className="neoDash__topActions">
            <div className="neoDash__dateChip">{todayLabel || "Loading..."}</div>
            <a href="/onboarding" className="neoDash__primaryBtn">
              Edit profile
            </a>
          </div>
        </div>

        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">Subscription</p>
              <h3>Your current plan</h3>
              <p className="neoDash__panelText">
                Choose a plan to unlock deeper care AI guidance.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <div
              className="neoDash__card"
              style={{
                border:
                  selectedPlan === "basic"
                    ? "2px solid #0f172a"
                    : "1px solid rgba(148,163,184,0.2)",
              }}
            >
              <p className="neoDash__label">Basic</p>
              <h3>€7 / month</h3>
              <p>Short care AI guidance and essential routine logs.</p>
              <button
                type="button"
                className="neoDash__secondaryBtn"
                onClick={() => choosePlan("basic")}
                style={{ marginTop: "12px" }}
              >
                {selectedPlan === "basic" ? "Selected" : "Choose Basic"}
              </button>
            </div>

            <div
              className="neoDash__card"
              style={{
                border:
                  selectedPlan === "premium"
                    ? "2px solid #0f172a"
                    : "1px solid rgba(148,163,184,0.2)",
              }}
            >
              <p className="neoDash__label">Premium</p>
              <h3>€11 / month</h3>
              <p>Unlock full care action plans and smarter structure.</p>
              <button
                type="button"
                className="neoDash__primaryBtn"
                onClick={() => choosePlan("premium")}
                style={{ marginTop: "12px" }}
              >
                {selectedPlan === "premium" ? "Selected" : "Choose Premium"}
              </button>
            </div>

            <div
              className="neoDash__card"
              style={{
                border:
                  selectedPlan === "elite"
                    ? "2px solid #0f172a"
                    : "1px solid rgba(148,163,184,0.2)",
              }}
            >
              <p className="neoDash__label">Elite</p>
              <h3>€15 / month</h3>
              <p>Full plan plus advanced routine insights.</p>
              <button
                type="button"
                className="neoDash__secondaryBtn"
                onClick={() => choosePlan("elite")}
                style={{ marginTop: "12px" }}
              >
                {selectedPlan === "elite" ? "Selected" : "Choose Elite"}
              </button>
            </div>
          </div>
        </section>

        <div className="neoDash__moduleRow">
          <a href="/dashboard" className="neoDash__module">
            <span className="neoDash__moduleIconWrap">🌙</span>
            <div>
              <strong>Sleep</strong>
              <p>Predictions and rhythm</p>
            </div>
          </a>

          <a href="/food" className="neoDash__module">
            <span className="neoDash__moduleIconWrap">🍼</span>
            <div>
              <strong>Food</strong>
              <p>Meals and reactions</p>
            </div>
          </a>

          <a href="/care" className="neoDash__module neoDash__module--active">
            <span className="neoDash__moduleIconWrap">💙</span>
            <div>
              <strong>Care</strong>
              <p>Daily essentials</p>
            </div>
          </a>
        </div>

        <div className="neoDash__heroGrid">
          <article className="neoDash__heroCard">
            <p className="neoDash__label">Main care insight</p>
            <h2>{careInsight.title}</h2>
            <p>{careInsight.description}</p>

            <div className="neoDash__miniStats">
              <div className="neoDash__miniStat">
                <span>Care stage</span>
                <strong>{careStage}</strong>
              </div>
              <div className="neoDash__miniStat">
                <span>Main concern</span>
                <strong>{mainConcern}</strong>
              </div>
              <div className="neoDash__miniStat">
                <span>Baby age</span>
                <strong>{ageMonths || "-"} months</strong>
              </div>
            </div>
          </article>

          <article className="neoDash__scoreCard">
            <p className="neoDash__label">Care score</p>
            <div className="neoDash__scoreNumber">{careScore}</div>
            <p className="neoDash__scoreText">
              {careHistory.length === 0
                ? "No data yet"
                : careScore >= 80
                ? "Excellent care consistency"
                : careScore >= 65
                ? "Good routine stability"
                : "Needs closer observation"}
            </p>
          </article>
        </div>

        <div className="neoDash__summaryGrid">
          <article className="neoDash__summaryCard">
            <p className="neoDash__label">Routine status</p>
            <strong>{careInsight.rhythmStatus}</strong>
            <span>Consistency over recent logs</span>
          </article>

          <article className="neoDash__summaryCard">
            <p className="neoDash__label">Recent logs</p>
            <strong>{careInsight.totalEntries}</strong>
            <span>Tracked care actions</span>
          </article>

          <article className="neoDash__summaryCard">
            <p className="neoDash__label">Consistency signal</p>
            <strong>{careInsight.consistencySignal}</strong>
            <span>Routine flow overview</span>
          </article>
        </div>

        <div className="neoDash__contentGrid">
          <article className="neoDash__card">
            <p className="neoDash__label">What to do next</p>
            <h3>Care recommendation</h3>
            <p>{careInsight.action}</p>
          </article>

          <article className="neoDash__card">
            <p className="neoDash__label">Parent notes</p>
            <h3>Additional context</h3>
            <p>{notes}</p>
          </article>
        </div>

        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">Care AI assistant</p>
              <h3>{aiCareAssistant.title}</h3>
              <p className="neoDash__panelText">
                Ask about routines, bath time, diaper changes or consistency.
              </p>
            </div>
          </div>

          <div className="neoDash__form">
            <div className="neoDash__formGrid">
              <label style={{ gridColumn: "1 / -1" }}>
                <span>Your care question</span>
                <input
                  type="text"
                  value={aiCareInput}
                  onChange={(e) => setAiCareInput(e.target.value)}
                  placeholder="e.g. How can I improve baby routine?"
                />
              </label>
            </div>
          </div>

          <div className="neoDash__card" style={{ marginTop: "20px" }}>
            <p className="neoDash__label">AI message</p>
            <h3>{aiCareAssistant.title}</h3>
            <p>{aiCareAssistant.message}</p>

            {!planAccess.canSeePlan && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                <strong>Upgrade to Premium</strong>
                <p style={{ marginTop: "6px" }}>
                  Unlock the full care action plan for this question.
                </p>
              </div>
            )}

            {planAccess.canSeePlan && aiCareAssistant.plan && (
              <div style={{ marginTop: "16px" }}>
                <p className="neoDash__label">Care action plan</p>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {aiCareAssistant.plan.map((step, i) => (
                    <div key={i}>• {step}</div>
                  ))}
                </div>
              </div>
            )}

            {planAccess.canSeePlan && !planAccess.canSeeEliteInsights && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                <strong>Upgrade to Elite</strong>
                <p style={{ marginTop: "6px" }}>
                  Unlock deeper routine insights and advanced care AI suggestions.
                </p>
              </div>
            )}

            {planAccess.canSeeEliteInsights && aiCareAssistant.eliteInsights && (
              <div style={{ marginTop: "16px" }}>
                <p className="neoDash__label">Elite insights</p>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {aiCareAssistant.eliteInsights.map((item, i) => (
                    <div key={i}>✦ {item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">Daily care log</p>
              <h3>Add recent care actions</h3>
              <p className="neoDash__panelText">
                Better routine logs create better consistency insights.
              </p>
            </div>
          </div>

          <form className="neoDash__form" onSubmit={handleCareSubmit}>
            <div className="neoDash__formGrid">
              <label>
                <span>Time</span>
                <input
                  type="time"
                  value={careForm.time}
                  onChange={(e) =>
                    setCareForm((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </label>

              <label>
                <span>Care type</span>
                <select
                  value={careForm.careType}
                  onChange={(e) =>
                    setCareForm((prev) => ({ ...prev, careType: e.target.value }))
                  }
                >
                  <option value="">Select type</option>
                  <option value="Diaper change">Diaper change</option>
                  <option value="Bath">Bath</option>
                  <option value="Hygiene">Hygiene</option>
                  <option value="Routine reset">Routine reset</option>
                  <option value="Calming routine">Calming routine</option>
                  <option value="Getting ready">Getting ready</option>
                </select>
              </label>

              <label>
                <span>Status</span>
                <select
                  value={careForm.status}
                  onChange={(e) =>
                    setCareForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option value="">Select status</option>
                  <option value="Completed">Completed</option>
                  <option value="Partial">Partial</option>
                  <option value="Difficult">Difficult</option>
                </select>
              </label>

              <label>
                <span>Note</span>
                <input
                  type="text"
                  placeholder="e.g. calmer than yesterday"
                  value={careForm.note}
                  onChange={(e) =>
                    setCareForm((prev) => ({ ...prev, note: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="neoDash__formActions">
              <button type="submit" className="neoDash__primaryBtn">
                Save care log
              </button>
              <button
                type="button"
                className="neoDash__secondaryBtn"
                onClick={clearCareHistory}
              >
                Clear history
              </button>
            </div>
          </form>
        </section>

        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">Recent care history</p>
              <h3>{careHistory.length} / 12 saved</h3>
            </div>
          </div>

          {careHistory.length === 0 ? (
            <div className="neoDash__empty">
              No care actions saved yet. Add the first one above.
            </div>
          ) : (
            <div className="neoDash__historyList">
              {careHistory.map((entry) => (
                <div key={entry.id} className="neoDash__historyItem">
                  <div>
                    <strong>{entry.careType}</strong>
                    <p>
                      {entry.time} {entry.note ? `• ${entry.note}` : ""}
                    </p>
                  </div>
                  <div>
                    <strong>{entry.status}</strong>
                    <p>Routine log</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}