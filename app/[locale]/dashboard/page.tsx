"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, getMessages, isValidLocale } from "../../../lib/i18n";

type PlanTier = "basic" | "premium" | "elite";

type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

type SleepEntry = {
  id: number;
  start: string;
  end: string;
  duration: string;
  quality: string;
  note: string;
  createdAt: string;
};

type FoodEntry = {
  id: number;
  time: string;
  type: string;
  amount: string;
  note: string;
  createdAt: string;
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
const SLEEP_STORAGE_KEY = "sb_sleep_entries";
const FOOD_STORAGE_KEY = "sb_food_entries";
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

function getRecommendedWakeWindow(ageMonths: number) {
  if (ageMonths <= 3) return 90;
  if (ageMonths <= 6) return 120;
  if (ageMonths <= 9) return 150;
  if (ageMonths <= 12) return 180;
  if (ageMonths <= 18) return 240;
  return 300;
}

function timeToMinutes(time: string) {
  if (!time || !time.includes(":")) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function parseDuration(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function extractReactionFromFoodNote(note: string) {
  const match = note.match(/Reaction:\s*([^|]+)/i);
  return match ? match[1].trim() : "Unknown";
}

function extractFoodFromFoodNote(note: string) {
  const match = note.match(/Food:\s*([^|]+)/i);
  return match ? match[1].trim() : "";
}

function average(numbers: number[]) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

export default function DashboardPage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale = isValidLocale(rawLocale) ? rawLocale : defaultLocale;
  const t = getMessages(locale);

  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [todayLabel, setTodayLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [foodHistory, setFoodHistory] = useState<FoodEntry[]>([]);
  const [careHistory, setCareHistory] = useState<CareEntry[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.trim() || "";
    setAiQuestion(q);

    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as BabyProfile;
        setProfile(parsed);
      }
    } catch {
      // ignore invalid profile
    }

    try {
      const savedSleepHistory = localStorage.getItem(SLEEP_STORAGE_KEY);
      if (savedSleepHistory) {
        const parsed = JSON.parse(savedSleepHistory) as SleepEntry[];
        setSleepHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore invalid sleep history
    }

    try {
      const savedFoodHistory = localStorage.getItem(FOOD_STORAGE_KEY);
      if (savedFoodHistory) {
        const parsed = JSON.parse(savedFoodHistory) as FoodEntry[];
        setFoodHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore invalid food history
    }

    try {
      const savedCareHistory = localStorage.getItem(CARE_STORAGE_KEY);
      if (savedCareHistory) {
        const parsed = JSON.parse(savedCareHistory) as CareEntry[];
        setCareHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore invalid care history
    }

    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
    if (savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite") {
      setSelectedPlan(savedPlan);
    }

    setTodayLabel(getTodayLabel());
  }, []);

  function choosePlan(plan: PlanTier) {
    setSelectedPlan(plan);
    if (typeof window !== "undefined") {
      localStorage.setItem(PLAN_STORAGE_KEY, plan);
    }
  }

  function handleAskAgain() {
    const cleanQuestion = aiInput.trim();
    if (!cleanQuestion || typeof window === "undefined") return;
    window.location.href = `/${locale}/dashboard?q=${encodeURIComponent(cleanQuestion)}`;
  }

  const babyName = profile?.babyName || "Your baby";
  const ageMonths = Number(profile?.ageMonths || 0);
  const bedtime = profile?.bedtime || "-";
  const mainConcern = profile?.mainConcern || "Not set";
  const notes = profile?.notes || "No extra notes added yet.";

  const sleepDurations = useMemo(() => {
    return sleepHistory
      .map((entry) => parseDuration(entry.duration))
      .filter((value) => value > 0);
  }, [sleepHistory]);

  const averageSleepDuration = useMemo(() => {
    return Math.round(average(sleepDurations));
  }, [sleepDurations]);

  const sleepQualities = useMemo(() => {
    return sleepHistory.map((entry) => entry.quality);
  }, [sleepHistory]);

  const foodReactions = useMemo(() => {
    return foodHistory.map((entry) => extractReactionFromFoodNote(entry.note));
  }, [foodHistory]);

  const recentFoods = useMemo(() => {
    return foodHistory
      .map((entry) => extractFoodFromFoodNote(entry.note))
      .filter(Boolean)
      .slice(0, 3);
  }, [foodHistory]);

  const careStatuses = useMemo(() => {
    return careHistory.map((entry) => entry.status);
  }, [careHistory]);

  const sleepInsight = useMemo(() => {
    if (!ageMonths || sleepHistory.length === 0) {
      return {
        title: "Sleep data is still building",
        subtitle: "Add recent naps to unlock stronger sleep predictions.",
        nextSleepTime: "-",
        rhythm: "No rhythm detected yet",
      };
    }

    const wakeWindow = getRecommendedWakeWindow(ageMonths);
    const napStartTimes = sleepHistory.map((entry) => timeToMinutes(entry.start));
    const averageNapStart =
      napStartTimes.reduce((sum, value) => sum + value, 0) / napStartTimes.length;

    const predictedNextSleep = averageNapStart + wakeWindow;
    const nextSleepTime = minutesToTime(Math.round(predictedNextSleep));

    const minStart = Math.min(...napStartTimes);
    const maxStart = Math.max(...napStartTimes);
    const spread = maxStart - minStart;

    let rhythm = "Stable";
    if (spread > 90) rhythm = "Irregular";
    else if (spread > 45) rhythm = "Slightly varied";

    return {
      title: `Next likely sleep around ${nextSleepTime}`,
      subtitle: "Predicted from recent nap history and age-based wake windows.",
      nextSleepTime,
      rhythm,
    };
  }, [sleepHistory, ageMonths]);

  const sleepScore = useMemo(() => {
    if (sleepHistory.length === 0) return 0;

    const avgDuration = average(sleepDurations);

    let score = 60;
    if (avgDuration >= 60) score += 20;
    else if (avgDuration >= 45) score += 12;
    else score -= 8;

    const excellentCount = sleepHistory.filter((entry) => entry.quality === "Excellent").length;
    const goodCount = sleepHistory.filter((entry) => entry.quality === "Good").length;
    const lightCount = sleepHistory.filter((entry) => entry.quality === "Light").length;
    const poorCount = sleepHistory.filter((entry) => entry.quality === "Poor").length;

    score += excellentCount * 8;
    score += goodCount * 5;
    score -= lightCount * 4;
    score -= poorCount * 8;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [sleepHistory, sleepDurations]);

  const foodInsight = useMemo(() => {
    if (foodHistory.length === 0) {
      return {
        title: "Food data is still building",
        subtitle: "Add meals and reactions to unlock clearer feeding patterns.",
        reactionSignal: "No data yet",
      };
    }

    const sensitiveCount = foodReactions.filter((entry) => entry === "Sensitive").length;
    const unsureCount = foodReactions.filter((entry) => entry === "Unsure").length;

    let reactionSignal = "Mostly positive";
    if (sensitiveCount >= 2) reactionSignal = "Sensitivity pattern detected";
    else if (unsureCount >= 2) reactionSignal = "Mixed reactions";

    return {
      title: "Meal rhythm is becoming clearer",
      subtitle: "Recent food logs help reveal consistency and reaction trends.",
      reactionSignal,
    };
  }, [foodHistory, foodReactions]);

  const foodScore = useMemo(() => {
    if (foodHistory.length === 0) return 0;

    let score = 60;

    const goodCount = foodReactions.filter((entry) => entry === "Good").length;
    const unsureCount = foodReactions.filter((entry) => entry === "Unsure").length;
    const sensitiveCount = foodReactions.filter((entry) => entry === "Sensitive").length;

    score += goodCount * 7;
    score -= unsureCount * 4;
    score -= sensitiveCount * 8;

    const uniqueMealTypes = new Set(foodHistory.map((entry) => entry.type)).size;
    score += uniqueMealTypes * 3;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [foodHistory, foodReactions]);

  const careInsight = useMemo(() => {
    if (careHistory.length === 0) {
      return {
        title: "Care data is still building",
        subtitle: "Add care actions to reveal routine consistency.",
        consistencySignal: "No data yet",
      };
    }

    const difficultCount = careHistory.filter((entry) => entry.status === "Difficult").length;
    const partialCount = careHistory.filter((entry) => entry.status === "Partial").length;

    let consistencySignal = "Mostly consistent";
    if (difficultCount >= 2) consistencySignal = "Repeated difficulty detected";
    else if (partialCount >= 2) consistencySignal = "Mixed consistency";

    return {
      title: "Routine consistency is getting clearer",
      subtitle: "Recent care logs show how stable daily routines feel.",
      consistencySignal,
    };
  }, [careHistory]);

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

  const aiAssistant = useMemo(() => {
    if (!aiQuestion) {
      return {
        title: "Ask something to unlock AI guidance",
        message:
          "Ask about sleep, food or care and the dashboard will adapt today’s guidance using your real logs.",
        plan: null as string[] | null,
        eliteInsights: null as string[] | null,
      };
    }

    const q = aiQuestion.toLowerCase();

    const poorSleepCount = sleepQualities.filter((entry) => entry === "Poor").length;
    const lightSleepCount = sleepQualities.filter((entry) => entry === "Light").length;
    const sensitiveFoodCount = foodReactions.filter((entry) => entry === "Sensitive").length;
    const unsureFoodCount = foodReactions.filter((entry) => entry === "Unsure").length;
    const difficultCareCount = careStatuses.filter((entry) => entry === "Difficult").length;
    const partialCareCount = careStatuses.filter((entry) => entry === "Partial").length;

    const profileContext = [
      `${babyName} is ${ageMonths || "unknown"} months old`,
      bedtime !== "-" ? `usual bedtime is ${bedtime}` : null,
      mainConcern !== "Not set" ? `main concern is ${mainConcern}` : null,
    ]
      .filter(Boolean)
      .join(", ");

    if (q.includes("sleep") || q.includes("nap") || q.includes("night")) {
      let title = "Sleep guidance based on real logs";
      let message = `${profileContext}. `;
      let plan = [
        "Keep the next sleep window calm and predictable",
        "Reduce stimulation before the next nap or bedtime",
        "Protect bedtime if daytime sleep remains short",
      ];
      let eliteInsights = [
        "Sleep quality can be more important than clock time on difficult days",
        "Repeated short naps often affect the whole second half of the day",
      ];

      if (sleepHistory.length === 0) {
        message += "There are no saved sleep logs yet, so the advice is still general.";
      } else {
        message += `You currently have ${sleepHistory.length} sleep log(s), average nap duration is ${averageSleepDuration || "-"} minutes, and the next likely sleep window is around ${sleepInsight.nextSleepTime}. `;

        if (poorSleepCount >= 2) {
          message += "Recent sleep quality looks weak, so overtiredness may be building.";
          plan = [
            "Start the calming routine earlier today",
            "Avoid stretching wake windows too much",
            "Prioritize an earlier bedtime if the day stays difficult",
          ];
          eliteInsights = [
            "Repeated poor-quality naps often suggest the reset should happen earlier, not later",
            "When sleep quality drops, bedtime protection becomes more important than pushing routine goals",
          ];
        } else if (lightSleepCount >= 2) {
          message += "Recent naps look light, which can make rhythm less restorative.";
          plan = [
            "Watch carefully for early tired cues",
            "Keep the environment quieter before the next sleep",
            "Avoid too much stimulation between naps",
          ];
          eliteInsights = [
            "Light naps can look acceptable on paper but still leave sleep pressure unresolved",
            "A smoother transition may help more than changing the clock drastically",
          ];
        } else if (averageSleepDuration > 0 && averageSleepDuration < 45) {
          message += "Average naps are shorter than ideal for stability today.";
          plan = [
            "Protect bedtime strongly tonight",
            "Keep the day rhythm simpler",
            "Avoid stacking too many stimulating moments late in the day",
          ];
        } else {
          message += "Recent sleep data looks fairly usable and rhythm appears more stable.";
        }
      }

      return { title, message, plan, eliteInsights };
    }

    if (q.includes("food") || q.includes("eat") || q.includes("meal") || q.includes("hungry")) {
      let title = "Food guidance based on real logs";
      let message = `${profileContext}. `;
      let plan = [
        "Keep meals predictable today",
        "Avoid introducing too many new foods at once",
        "Track reactions calmly after meals",
      ];
      let eliteInsights = [
        "Simple meals make patterns easier to understand",
        "Meal rhythm often reduces stress more than adding variety too fast",
      ];

      if (foodHistory.length === 0) {
        message += "There are no saved food logs yet, so the advice is still general.";
      } else {
        message += `You currently have ${foodHistory.length} food log(s). `;
        if (recentFoods.length > 0) {
          message += `Recent foods include ${recentFoods.join(", ")}. `;
        }

        if (sensitiveFoodCount >= 2) {
          message += "Recent logs show repeated sensitive reactions.";
          plan = [
            "Keep meals simpler today",
            "Avoid stacking multiple uncertain foods",
            "Log timing and reaction carefully after meals",
          ];
          eliteInsights = [
            "Repeated sensitive reactions are easier to interpret when meal variety is reduced",
            "Reaction timing can be as important as the specific food itself",
          ];
        } else if (unsureFoodCount >= 2) {
          message += "Recent reactions look mixed or unclear.";
          plan = [
            "Keep food choices more predictable today",
            "Use smaller portions if needed",
            "Track whether the same foods repeat unclear reactions",
          ];
        } else {
          message += "Recent food data looks calmer and more stable.";
        }
      }

      return { title, message, plan, eliteInsights };
    }

    if (
      q.includes("care") ||
      q.includes("routine") ||
      q.includes("bath") ||
      q.includes("diaper")
    ) {
      let title = "Care guidance based on real logs";
      let message = `${profileContext}. `;
      let plan = [
        "Keep the order of routine steps predictable today",
        "Reduce unnecessary variation between care moments",
        "Use calmer transitions around more difficult moments",
      ];
      let eliteInsights = [
        "Consistency usually helps more than adding more complexity",
        "Repeated care friction often appears when the whole day feels overloaded",
      ];

      if (careHistory.length === 0) {
        message += "There are no saved care logs yet, so the advice is still general.";
      } else {
        message += `You currently have ${careHistory.length} care log(s). `;

        if (difficultCareCount >= 2) {
          message += "Recent care logs show repeated difficult routine moments.";
          plan = [
            "Simplify routines today",
            "Prepare each care step before starting",
            "Slow transitions down instead of rushing through them",
          ];
          eliteInsights = [
            "Repeated difficult moments often reflect fatigue, overstimulation or timing issues",
            "Routine simplification is often more effective than trying to perfect every step",
          ];
        } else if (partialCareCount >= 2) {
          message += "Recent care consistency looks mixed.";
          plan = [
            "Keep the same routine order today",
            "Reduce optional changes in the schedule",
            "Focus on one calmer repeated structure",
          ];
        } else {
          message += "Recent care logs look mostly stable.";
        }
      }

      return { title, message, plan, eliteInsights };
    }

    return {
      title: "Smart guidance based on your real dashboard data",
      message: `${profileContext}. Sleep logs: ${sleepHistory.length}, food logs: ${foodHistory.length}, care logs: ${careHistory.length}. The system is using real module data to guide today’s decisions.`,
      plan: [
        "Keep current routines stable",
        "Watch for repeating patterns across modules",
        "Avoid changing too many things on the same day",
      ],
      eliteInsights: [
        "Cross-module patterns are often more useful than one isolated log",
        "A calmer repeatable system beats a perfect but complicated one",
      ],
    };
  }, [
    aiQuestion,
    babyName,
    ageMonths,
    bedtime,
    mainConcern,
    sleepHistory,
    foodHistory,
    careHistory,
    averageSleepDuration,
    sleepInsight.nextSleepTime,
    sleepQualities,
    foodReactions,
    careStatuses,
    recentFoods,
  ]);

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

  const totalLogs = sleepHistory.length + foodHistory.length + careHistory.length;
  const combinedScore =
    totalLogs === 0 ? 0 : Math.round((sleepScore + foodScore + careScore) / 3);

  return (
    <AppModuleLayout
      active="dashboard"
      title={`${t.dashboard.welcomeBack}, ${babyName}`}
      subtitle="One premium view for sleep, food, care and AI-guided daily clarity."
      label={t.dashboard.unifiedOverview}
      currentFocusTitle={t.dashboard.mainDashboard}
      currentFocusText={t.dashboard.overviewText}
      dateLabel={todayLabel || "Loading..."}
    >
      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">Subscription</p>
            <h3>{t.dashboard.currentPlan}</h3>
            <p className="neoDash__panelText">{t.dashboard.choosePlan}</p>
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
            <p>Essential access and short AI guidance.</p>
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
            <p>Unlock full AI action plans across modules.</p>
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
            <p>Full plans plus deeper advanced AI insights.</p>
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

      <div className="neoDash__heroGrid">
        <article className="neoDash__heroCard">
          <p className="neoDash__label">Main overview</p>
          <h2>{babyName}&apos;s daily system at a glance</h2>
          <p>
            {babyName} is currently on the{" "}
            <strong style={{ textTransform: "capitalize" }}>{selectedPlan}</strong> plan.
            You have <strong>{totalLogs}</strong> total logs across sleep, food and care.
          </p>

          <div className="neoDash__miniStats">
            <div className="neoDash__miniStat">
              <span>Bedtime</span>
              <strong>{bedtime}</strong>
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
          <p className="neoDash__label">Daily health score</p>
          <div className="neoDash__scoreNumber">{combinedScore}</div>
          <p className="neoDash__scoreText">
            Combined score from sleep, food and care consistency.
          </p>
        </article>
      </div>

      {aiQuestion ? (
        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">Central AI Assistant</p>
              <h3>{aiAssistant.title}</h3>
              <p className="neoDash__panelText">
                Based on your question, the unified dashboard adapted today&apos;s guidance
                using real module data.
              </p>
            </div>
          </div>

          <div className="neoDash__card" style={{ marginTop: 0 }}>
            <p className="neoDash__label">Your question</p>
            <h3>{aiQuestion}</h3>
            <p>{aiAssistant.message}</p>

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
                  Unlock the full AI action plan for this question.
                </p>
              </div>
            )}

            {planAccess.canSeePlan && aiAssistant.plan && (
              <div style={{ marginTop: "16px" }}>
                <p className="neoDash__label">AI action plan</p>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {aiAssistant.plan.map((step, i) => (
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
                  Unlock advanced AI insights across the full system.
                </p>
              </div>
            )}

            {planAccess.canSeeEliteInsights && aiAssistant.eliteInsights && (
              <div style={{ marginTop: "16px" }}>
                <p className="neoDash__label">Elite insights</p>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {aiAssistant.eliteInsights.map((item, i) => (
                    <div key={i}>✦ {item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">Ask AI from dashboard</p>
            <h3>Refine today&apos;s context</h3>
            <p className="neoDash__panelText">
              Ask about sleep, food or care to adapt the whole system.
            </p>
          </div>
        </div>

        <div className="neoDash__form">
          <div className="neoDash__formGrid">
            <label style={{ gridColumn: "1 / -1" }}>
              <span>Your question</span>
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAskAgain();
                }}
                placeholder="e.g. Why is my baby not sleeping well?"
              />
            </label>
          </div>

          <div className="neoDash__formActions">
            <button type="button" className="neoDash__primaryBtn" onClick={handleAskAgain}>
              Ask AI
            </button>
          </div>
        </div>
      </section>

      <div className="neoDash__summaryGrid">
        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Sleep score</p>
          <strong>{sleepScore}</strong>
          <span>{sleepInsight.title}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Food score</p>
          <strong>{foodScore}</strong>
          <span>{foodInsight.reactionSignal}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Care score</p>
          <strong>{careScore}</strong>
          <span>{careInsight.consistencySignal}</span>
        </article>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <a
          href={`/${locale}/sleep`}
          className="neoDash__card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="neoDash__label">Sleep module</p>
          <h3>🌙 {sleepInsight.title}</h3>
          <p>{sleepInsight.subtitle}</p>
          <div style={{ marginTop: "12px" }}>
            <strong>Rhythm:</strong> {sleepInsight.rhythm}
          </div>
          <div style={{ marginTop: "10px", color: "#2563eb", fontWeight: 600 }}>
            Open Sleep →
          </div>
        </a>

        <a
          href={`/${locale}/food`}
          className="neoDash__card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="neoDash__label">Food module</p>
          <h3>🍼 {foodInsight.title}</h3>
          <p>{foodInsight.subtitle}</p>
          <div style={{ marginTop: "12px" }}>
            <strong>Reaction signal:</strong> {foodInsight.reactionSignal}
          </div>
          <div style={{ marginTop: "10px", color: "#2563eb", fontWeight: 600 }}>
            Open Food →
          </div>
        </a>

        <a
          href={`/${locale}/care`}
          className="neoDash__card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="neoDash__label">Care module</p>
          <h3>💙 {careInsight.title}</h3>
          <p>{careInsight.subtitle}</p>
          <div style={{ marginTop: "12px" }}>
            <strong>Consistency:</strong> {careInsight.consistencySignal}
          </div>
          <div style={{ marginTop: "10px", color: "#2563eb", fontWeight: 600 }}>
            Open Care →
          </div>
        </a>
      </div>

      <div className="neoDash__contentGrid" style={{ marginTop: "20px" }}>
        <article className="neoDash__card">
          <p className="neoDash__label">Profile summary</p>
          <h3>Current profile context</h3>
          <p>
            Plan: <strong style={{ textTransform: "capitalize" }}>{selectedPlan}</strong>
          </p>
          <p>Bedtime: {bedtime}</p>
          <p>Main concern: {mainConcern}</p>
        </article>

        <article className="neoDash__card">
          <p className="neoDash__label">Parent notes</p>
          <h3>Saved context</h3>
          <p>{notes}</p>
        </article>
      </div>
    </AppModuleLayout>
  );
}