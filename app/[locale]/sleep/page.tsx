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

type SleepEntry = {
  id: number;
  start: string;
  end: string;
  duration: string;
  quality: string;
  note: string;
  createdAt: string;
};

const PROFILE_STORAGE_KEY = "sb_profile";
const SLEEP_STORAGE_KEY = "sb_sleep_entries";
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

function getSleepStage(ageMonths: number) {
  if (ageMonths <= 3) return "Newborn sleep rhythm";
  if (ageMonths <= 6) return "Developing nap structure";
  if (ageMonths <= 9) return "More stable daily rhythm";
  if (ageMonths <= 12) return "Structured sleep windows";
  if (ageMonths <= 18) return "Consistent bedtime building";
  return "Toddler rhythm support";
}

function parseDuration(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function calculateDurationFromTimes(start: string, end: string) {
  if (!start || !end) return "";

  let startMinutes = timeToMinutes(start);
  let endMinutes = timeToMinutes(end);

  if (endMinutes < startMinutes) {
    endMinutes += 1440;
  }

  return String(endMinutes - startMinutes);
}

export default function SleepPage() {
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [todayLabel, setTodayLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");

  const [sleepForm, setSleepForm] = useState({
    start: "",
    end: "",
    duration: "",
    quality: "",
    note: "",
  });

  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [aiSleepInput, setAiSleepInput] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    const savedSleepHistory = localStorage.getItem(SLEEP_STORAGE_KEY);
    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY) as PlanTier | null;

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as BabyProfile;
        setProfile(parsed);
      } catch {
        // ignore invalid profile
      }
    }

    if (savedSleepHistory) {
      try {
        const parsed = JSON.parse(savedSleepHistory) as SleepEntry[];
        setSleepHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        // ignore invalid history
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

  function handleSleepSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const finalDuration =
      sleepForm.duration || calculateDurationFromTimes(sleepForm.start, sleepForm.end);

    if (!sleepForm.start || !finalDuration || !sleepForm.quality) return;

    const newEntry: SleepEntry = {
      id: Date.now(),
      start: sleepForm.start,
      end: sleepForm.end,
      duration: finalDuration,
      quality: sleepForm.quality,
      note: sleepForm.note,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(SLEEP_STORAGE_KEY) || "[]") as SleepEntry[];
    const updatedHistory = [newEntry, ...existing].slice(0, 12);

    setSleepHistory(updatedHistory);
    localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(updatedHistory));

    setSleepForm({
      start: "",
      end: "",
      duration: "",
      quality: "",
      note: "",
    });
  }

  function clearSleepHistory() {
    localStorage.removeItem(SLEEP_STORAGE_KEY);
    setSleepHistory([]);
  }

  const babyName = profile?.babyName || "Your baby";
  const ageMonths = Number(profile?.ageMonths || 0);
  const bedtime = profile?.bedtime || "-";
  const notes = profile?.notes || "No extra notes added yet.";

  const sleepStage = useMemo(() => getSleepStage(ageMonths), [ageMonths]);

  const sleepInsight = useMemo(() => {
    if (!ageMonths || sleepHistory.length === 0) {
      return {
        title: "Add sleep logs to unlock smarter sleep insights",
        description:
          "Once you save naps, the system can compare rhythm quality, wake windows and likely next sleep timing.",
        action: "Log recent naps below to build more accurate sleep guidance.",
        rhythmStatus: "No sleep rhythm available yet.",
        averageNapDuration: "-",
        nextSleepTime: "-",
      };
    }

    const recommendedWakeWindow = getRecommendedWakeWindow(ageMonths);
    const napStartTimes = sleepHistory.map((entry) => timeToMinutes(entry.start));
    const napDurations = sleepHistory.map((entry) => parseDuration(entry.duration));
    const qualities = sleepHistory.map((entry) => entry.quality);

    const averageNapStart =
      napStartTimes.reduce((sum, value) => sum + value, 0) / napStartTimes.length;

    const averageNapDuration =
      napDurations.reduce((sum, value) => sum + value, 0) / napDurations.length;

    const predictedNextSleep = averageNapStart + recommendedWakeWindow;
    const formattedNextSleep = minutesToTime(Math.round(predictedNextSleep));

    const minStart = Math.min(...napStartTimes);
    const maxStart = Math.max(...napStartTimes);
    const spread = maxStart - minStart;

    let rhythmStatus = "Sleep rhythm looks fairly stable.";
    if (spread > 90) rhythmStatus = "Sleep rhythm looks a bit irregular.";
    else if (spread > 45) rhythmStatus = "Sleep rhythm shows some variation.";

    let description = `${babyName} may need sleep again around ${formattedNextSleep}, based on recent nap timing and age-based wake windows.`;
    let action = "Try to keep the environment calm as that time approaches.";

    const poorCount = qualities.filter((quality) => quality === "Poor").length;
    const lightCount = qualities.filter((quality) => quality === "Light").length;
    const excellentCount = qualities.filter((quality) => quality === "Excellent").length;

    if (poorCount >= 2) {
      description += " Recent logs suggest sleep quality may be dropping.";
      action = "Start the calming routine slightly earlier today.";
    } else if (lightCount >= 2) {
      description += " Recent naps seem lighter and less restorative.";
      action = "Watch closely for tired signs before the expected window.";
    } else if (excellentCount >= 2) {
      description += " Recent naps look restorative and well-timed.";
      action = "Keep the same rhythm if today stays similar.";
    }

    if (averageNapDuration < 45) {
      description += " Average nap duration is shorter than ideal.";
      action = "Protect bedtime and reduce overstimulation later today.";
    }

    return {
      title: `${babyName} may need sleep around ${formattedNextSleep}`,
      description,
      action,
      rhythmStatus,
      averageNapDuration: `${Math.round(averageNapDuration)} min`,
      nextSleepTime: formattedNextSleep,
    };
  }, [sleepHistory, ageMonths, babyName]);

  const sleepScore = useMemo(() => {
    if (sleepHistory.length === 0) return 0;

    const durations = sleepHistory.map((entry) => parseDuration(entry.duration));
    const avgDuration = durations.reduce((sum, value) => sum + value, 0) / durations.length;

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
  }, [sleepHistory]);

  const aiSleepAssistant = useMemo(() => {
    const q = aiSleepInput.trim().toLowerCase();

    if (!q) {
      return {
        title: "Ask sleep AI for smarter guidance",
        message:
          "You can ask about naps, night waking, bedtime, wake windows or overtiredness.",
        plan: null as string[] | null,
        eliteInsights: null as string[] | null,
      };
    }

    if (q.includes("sleep") || q.includes("nap") || q.includes("night")) {
      return {
        title: "Sleep optimization activated",
        message:
          "The system is prioritizing nap timing, sleep pressure and calmer transitions.",
        plan: [
          "Watch for tired cues earlier than usual",
          "Reduce stimulation before the next nap",
          "Keep the pre-sleep routine consistent",
          "Protect bedtime if naps stay short",
        ],
        eliteInsights: [
          "Nap quality may matter more than duration alone on difficult days",
          "A slightly earlier reset often helps more than stretching wake windows",
          "Short naps can quietly affect the whole second half of the day",
        ],
      };
    }

    if (q.includes("bedtime") || q.includes("late") || q.includes("overtired")) {
      return {
        title: "Bedtime adjustment focus",
        message:
          "The system is focusing on overtiredness prevention and a smoother evening structure.",
        plan: [
          "Protect the final wake window",
          "Reduce evening stimulation earlier",
          "Use the same calm pre-bed pattern",
          "Prioritize a slightly earlier bedtime if needed",
        ],
        eliteInsights: [
          "Evening rhythm often depends on the last nap more than bedtime alone",
          "Overtiredness can look like resistance instead of obvious sleepiness",
          "A calmer last hour can improve both falling asleep and staying asleep",
        ],
      };
    }

    if (q.includes("wake") || q.includes("early") || q.includes("morning")) {
      return {
        title: "Early waking support",
        message:
          "The system is focusing on sleep pressure balance and protecting overnight rhythm.",
        plan: [
          "Avoid pushing the first nap too early",
          "Keep the morning calm and predictable",
          "Watch the previous day’s nap and bedtime balance",
          "Track whether early waking repeats consistently",
        ],
        eliteInsights: [
          "Early waking often connects to the entire previous day, not just the morning",
          "First nap timing can influence whether early waking gets reinforced",
          "Repeated early starts are easier to understand with 2–3 days of logs",
        ],
      };
    }

    return {
      title: "Sleep AI context ready",
      message:
        "Your question has been added to the sleep module. The system will adapt guidance around rhythm, cues and consistency.",
      plan: [
        "Protect current rhythm",
        "Observe cues calmly",
        "Avoid sudden sleep changes",
      ],
      eliteInsights: [
        "Sleep improvement usually comes from consistent patterns, not one perfect day",
        "The clearest sleep systems reduce stress for parents too",
        "Useful tracking should support calm decisions, not constant guessing",
      ],
    };
  }, [aiSleepInput]);

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
    <AppModuleLayout
      active="sleep"
      title="Sleep module"
      subtitle="A premium view for nap rhythm, bedtime balance and smarter sleep decisions."
      label="Today’s sleep overview"
      currentFocusTitle="Sleep tracking"
      currentFocusText="Rhythm, wake windows, bedtime and calmer sleep guidance."
      dateLabel={todayLabel || "Loading..."}
    >
      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">Subscription</p>
            <h3>Your current plan</h3>
            <p className="neoDash__panelText">
              Choose a plan to unlock deeper sleep AI guidance.
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
            <p>Short sleep AI guidance and essential logs.</p>
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
            <p>Unlock full sleep action plans and better rhythm guidance.</p>
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
            <p>Full plan plus advanced sleep insights.</p>
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
          <p className="neoDash__label">Main sleep insight</p>
          <h2>{sleepInsight.title}</h2>
          <p>{sleepInsight.description}</p>

          <div className="neoDash__miniStats">
            <div className="neoDash__miniStat">
              <span>Sleep stage</span>
              <strong>{sleepStage}</strong>
            </div>
            <div className="neoDash__miniStat">
              <span>Bedtime</span>
              <strong>{bedtime}</strong>
            </div>
            <div className="neoDash__miniStat">
              <span>Baby age</span>
              <strong>{ageMonths || "-"} months</strong>
            </div>
          </div>
        </article>

        <article className="neoDash__scoreCard">
          <p className="neoDash__label">Sleep score</p>
          <div className="neoDash__scoreNumber">{sleepScore}</div>
          <p className="neoDash__scoreText">
            {sleepHistory.length === 0
              ? "No data yet"
              : sleepScore >= 80
              ? "Excellent rhythm today"
              : sleepScore >= 65
              ? "Good rhythm overall"
              : "Needs attention"}
          </p>
        </article>
      </div>

      <div className="neoDash__summaryGrid">
        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Next likely sleep</p>
          <strong>{sleepInsight.nextSleepTime}</strong>
          <span>Predicted from recent naps</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Average nap duration</p>
          <strong>{sleepInsight.averageNapDuration}</strong>
          <span>Based on saved naps</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Rhythm status</p>
          <strong>{sleepInsight.rhythmStatus}</strong>
          <span>Sleep stability over time</span>
        </article>
      </div>

      <div className="neoDash__contentGrid">
        <article className="neoDash__card">
          <p className="neoDash__label">What to do next</p>
          <h3>Sleep recommendation</h3>
          <p>{sleepInsight.action}</p>
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
            <p className="neoDash__label">Sleep AI assistant</p>
            <h3>{aiSleepAssistant.title}</h3>
            <p className="neoDash__panelText">
              Ask about naps, bedtime, night waking or overtiredness.
            </p>
          </div>
        </div>

        <div className="neoDash__form">
          <div className="neoDash__formGrid">
            <label style={{ gridColumn: "1 / -1" }}>
              <span>Your sleep question</span>
              <input
                type="text"
                value={aiSleepInput}
                onChange={(e) => setAiSleepInput(e.target.value)}
                placeholder="e.g. Why is my baby not sleeping well?"
              />
            </label>
          </div>
        </div>

        <div className="neoDash__card" style={{ marginTop: "20px" }}>
          <p className="neoDash__label">AI message</p>
          <h3>{aiSleepAssistant.title}</h3>
          <p>{aiSleepAssistant.message}</p>

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
                Unlock the full sleep action plan for this question.
              </p>
            </div>
          )}

          {planAccess.canSeePlan && aiSleepAssistant.plan && (
            <div style={{ marginTop: "16px" }}>
              <p className="neoDash__label">Sleep action plan</p>
              <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                {aiSleepAssistant.plan.map((step, i) => (
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
                Unlock deeper sleep insights and advanced AI suggestions.
              </p>
            </div>
          )}

          {planAccess.canSeeEliteInsights && aiSleepAssistant.eliteInsights && (
            <div style={{ marginTop: "16px" }}>
              <p className="neoDash__label">Elite insights</p>
              <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                {aiSleepAssistant.eliteInsights.map((item, i) => (
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
            <p className="neoDash__label">Daily sleep log</p>
            <h3>Add recent naps</h3>
            <p className="neoDash__panelText">
              Better sleep logs create better rhythm and wake-window guidance.
            </p>
          </div>
        </div>

        <form className="neoDash__form" onSubmit={handleSleepSubmit}>
          <div className="neoDash__formGrid">
            <label>
              <span>Nap started at</span>
              <input
                type="time"
                value={sleepForm.start}
                onChange={(e) =>
                  setSleepForm((prev) => ({ ...prev, start: e.target.value }))
                }
              />
            </label>

            <label>
              <span>Nap ended at</span>
              <input
                type="time"
                value={sleepForm.end}
                onChange={(e) =>
                  setSleepForm((prev) => ({
                    ...prev,
                    end: e.target.value,
                    duration: calculateDurationFromTimes(prev.start, e.target.value),
                  }))
                }
              />
            </label>

            <label>
              <span>Nap duration (minutes)</span>
              <input
                type="number"
                placeholder="60"
                value={sleepForm.duration}
                onChange={(e) =>
                  setSleepForm((prev) => ({ ...prev, duration: e.target.value }))
                }
              />
            </label>

            <label>
              <span>Sleep quality</span>
              <select
                value={sleepForm.quality}
                onChange={(e) =>
                  setSleepForm((prev) => ({ ...prev, quality: e.target.value }))
                }
              >
                <option value="">Select quality</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Light">Light</option>
                <option value="Poor">Poor</option>
              </select>
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>Note</span>
              <textarea
                value={sleepForm.note}
                onChange={(e) =>
                  setSleepForm((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="Anything useful about this nap..."
                rows={4}
              />
            </label>
          </div>

          <div className="neoDash__formActions">
            <button type="submit" className="neoDash__primaryBtn">
              Save sleep log
            </button>
            <button
              type="button"
              className="neoDash__secondaryBtn"
              onClick={clearSleepHistory}
            >
              Clear history
            </button>
          </div>
        </form>
      </section>

      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">Recent sleep history</p>
            <h3>{sleepHistory.length} / 12 saved</h3>
          </div>
        </div>

        {sleepHistory.length === 0 ? (
          <div className="neoDash__empty">No naps saved yet. Add the first one above.</div>
        ) : (
          <div className="neoDash__historyList">
            {sleepHistory.map((entry) => (
              <div key={entry.id} className="neoDash__historyItem">
                <div>
                  <strong>Nap</strong>
                  <p>
                    {entry.start}
                    {entry.end ? ` - ${entry.end}` : ""} • {entry.quality}
                  </p>
                </div>
                <div>
                  <strong>{entry.duration} min</strong>
                  <p>{entry.note ? entry.note : "Sleep log"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppModuleLayout>
  );
}