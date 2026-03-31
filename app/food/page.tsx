"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AppModuleLayout from "../../components/AppModuleLayout";

type PlanTier = "basic" | "premium" | "elite";

type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

type FoodEntry = {
  id: number;
  time: string;
  type: string;
  amount: string;
  note: string;
  createdAt: string;
};

const PROFILE_STORAGE_KEY = "sb_profile";
const FOOD_STORAGE_KEY = "sb_food_entries";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

function getTodayLabel() {
  const now = new Date();
  return now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getFoodStage(ageMonths: number) {
  if (ageMonths <= 4) return "Milk-focused stage";
  if (ageMonths <= 6) return "Early solids stage";
  if (ageMonths <= 9) return "Exploration stage";
  if (ageMonths <= 12) return "Structured meals stage";
  if (ageMonths <= 18) return "Expanding food variety";
  return "Toddler meal rhythm";
}

function extractReactionFromNote(note: string) {
  const match = note.match(/Reaction:\s*([^|]+)/i);
  return match ? match[1].trim() : "Unknown";
}

function extractFoodFromNote(note: string) {
  const match = note.match(/Food:\s*([^|]+)/i);
  return match ? match[1].trim() : "";
}

export default function FoodPage() {
  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [todayLabel, setTodayLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");

  const [foodForm, setFoodForm] = useState({
    mealTime: "",
    mealType: "",
    food: "",
    quantity: "",
    reaction: "",
  });

  const [foodHistory, setFoodHistory] = useState<FoodEntry[]>([]);
  const [aiFoodInput, setAiFoodInput] = useState("");

  useEffect(() => {
    const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
    const savedFoodHistory = localStorage.getItem(FOOD_STORAGE_KEY);
    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY) as PlanTier | null;

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile) as BabyProfile;
        setProfile(parsed);
      } catch {
        // ignore invalid profile
      }
    }

    if (savedFoodHistory) {
      try {
        const parsed = JSON.parse(savedFoodHistory) as FoodEntry[];
        setFoodHistory(Array.isArray(parsed) ? parsed : []);
      } catch {
        // ignore invalid food history
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

  function handleFoodSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !foodForm.mealTime ||
      !foodForm.mealType ||
      !foodForm.quantity
    ) {
      return;
    }

    const noteParts: string[] = [];

    if (foodForm.food.trim()) {
      noteParts.push(`Food: ${foodForm.food.trim()}`);
    }

    if (foodForm.reaction.trim()) {
      noteParts.push(`Reaction: ${foodForm.reaction.trim()}`);
    }

    const newEntry: FoodEntry = {
      id: Date.now(),
      time: foodForm.mealTime,
      type: foodForm.mealType,
      amount: foodForm.quantity,
      note: noteParts.join(" | "),
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(FOOD_STORAGE_KEY) || "[]") as FoodEntry[];
    const updatedHistory = [newEntry, ...existing].slice(0, 12);

    setFoodHistory(updatedHistory);
    localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(updatedHistory));

    setFoodForm({
      mealTime: "",
      mealType: "",
      food: "",
      quantity: "",
      reaction: "",
    });
  }

  function clearFoodHistory() {
    localStorage.removeItem(FOOD_STORAGE_KEY);
    setFoodHistory([]);
  }

  const babyName = profile?.babyName || "Your baby";
  const ageMonths = Number(profile?.ageMonths || 0);
  const mainConcern = profile?.mainConcern || "Not set";
  const notes = profile?.notes || "No extra notes added yet.";

  const foodStage = useMemo(() => getFoodStage(ageMonths), [ageMonths]);

  const foodInsight = useMemo(() => {
    if (foodHistory.length === 0) {
      return {
        title: "Add food logs to unlock feeding insights",
        description:
          "Once you save meals and reactions, the system can highlight rhythm, consistency and possible food signals.",
        action: "Log the most recent meals below.",
        rhythmStatus: "No feeding pattern available yet.",
        averageMeals: "-",
        reactionSignal: "No data yet",
      };
    }

    const reactions = foodHistory.map((entry) => extractReactionFromNote(entry.note));
    const goodCount = reactions.filter((r) => r === "Good").length;
    const unsureCount = reactions.filter((r) => r === "Unsure").length;
    const sensitiveCount = reactions.filter((r) => r === "Sensitive").length;

    let rhythmStatus = "Feeding rhythm looks fairly stable.";
    if (foodHistory.length <= 2) rhythmStatus = "Still building feeding rhythm data.";
    if (sensitiveCount >= 2) rhythmStatus = "Repeated sensitive reactions detected.";
    else if (unsureCount >= 2) rhythmStatus = "Some unclear reactions may need attention.";

    let reactionSignal = "Mostly positive response so far.";
    if (sensitiveCount >= 2) reactionSignal = "Potential sensitivity pattern detected.";
    else if (unsureCount >= 2) reactionSignal = "Mixed reactions detected.";
    else if (goodCount === foodHistory.length) reactionSignal = "No unusual reaction pattern detected.";

    return {
      title: `${babyName}'s feeding pattern is becoming clearer`,
      description:
        `${foodStage} • ${foodHistory.length} recent food logs saved. The system is tracking meal rhythm, variety and reaction consistency.`,
      action:
        sensitiveCount >= 2
          ? "Keep meals simpler today and avoid introducing too many new foods."
          : "Keep meal timing consistent and continue tracking reactions calmly.",
      rhythmStatus,
      averageMeals: `${foodHistory.length} recent logs`,
      reactionSignal,
    };
  }, [foodHistory, babyName, foodStage]);

  const foodScore = useMemo(() => {
    if (foodHistory.length === 0) return 0;

    let score = 60;

    const reactions = foodHistory.map((entry) => extractReactionFromNote(entry.note));
    const goodCount = reactions.filter((entry) => entry === "Good").length;
    const unsureCount = reactions.filter((entry) => entry === "Unsure").length;
    const sensitiveCount = reactions.filter((entry) => entry === "Sensitive").length;

    score += goodCount * 7;
    score -= unsureCount * 4;
    score -= sensitiveCount * 8;

    const uniqueMealTypes = new Set(foodHistory.map((entry) => entry.type)).size;
    score += uniqueMealTypes * 3;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [foodHistory]);

  const aiFoodAssistant = useMemo(() => {
    const q = aiFoodInput.trim().toLowerCase();

    if (!q) {
      return {
        title: "Ask food AI for smarter meal guidance",
        message:
          "You can ask about meal rhythm, reactions, food ideas or quantity concerns.",
        plan: null as string[] | null,
        eliteInsights: null as string[] | null,
      };
    }

    if (q.includes("eat") || q.includes("food") || q.includes("meal") || q.includes("hungry")) {
      return {
        title: "Meal guidance activated",
        message:
          "The system is focusing on meal rhythm, simpler feeding structure and reaction clarity.",
        plan: [
          "Keep meals calm and predictable today",
          "Avoid too many new foods at once",
          "Track any reaction after meals",
          "Protect nap timing around feeding",
        ],
        eliteInsights: [
          "Meal simplicity can make reaction tracking much clearer",
          "Structured feeding often reduces confusion between hunger and tiredness",
          "Repeated neutral reactions are more useful than one perfect meal",
        ],
      };
    }

    if (q.includes("reaction") || q.includes("allergy") || q.includes("sensitive")) {
      return {
        title: "Reaction monitoring focus",
        message:
          "The system is prioritizing reaction clarity and lower-noise food tracking.",
        plan: [
          "Reduce food variety temporarily",
          "Log reaction timing carefully",
          "Keep portions moderate",
          "Avoid stacking multiple uncertain foods",
        ],
        eliteInsights: [
          "Reaction patterns are easier to interpret when meals stay simple",
          "Timing of reaction matters almost as much as the food itself",
          "Consistency across 2–3 days often reveals more than a single meal",
        ],
      };
    }

    if (q.includes("quantity") || q.includes("portion") || q.includes("enough")) {
      return {
        title: "Portion guidance focus",
        message:
          "The system is focusing on portions, meal balance and reading appetite cues more calmly.",
        plan: [
          "Use appetite cues instead of forcing fixed amounts",
          "Offer smaller portions and repeat if needed",
          "Keep feeding pressure low",
          "Balance meal timing with energy and naps",
        ],
        eliteInsights: [
          "Appetite can vary naturally day to day without meaning a problem",
          "A calmer feeding environment often improves intake more than larger portions",
          "Pattern tracking is more valuable than one unusually small meal",
        ],
      };
    }

    return {
      title: "Food AI context ready",
      message:
        "Your question has been added to the food module. The system will adapt guidance around meals and reactions.",
      plan: [
        "Keep structure simple",
        "Track meals consistently",
        "Observe reactions calmly",
      ],
      eliteInsights: [
        "Food rhythm matters as much as food choice",
        "Consistency makes reaction patterns easier to understand",
        "Useful tracking should reduce stress, not increase it",
      ],
    };
  }, [aiFoodInput]);

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
      active="food"
      title="Food module"
      subtitle="A cleaner premium view for meal rhythm, feeding consistency and reaction clarity."
      label="Today’s food overview"
      currentFocusTitle="Food tracking"
      currentFocusText="Meals, rhythm, reactions and smarter feeding insights."
      dateLabel={todayLabel || "Loading..."}
    >
      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">Subscription</p>
            <h3>Your current plan</h3>
            <p className="neoDash__panelText">
              Choose a plan to unlock deeper food AI guidance.
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
            <p>Short food AI guidance and essential logs.</p>
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
            <p>Unlock full food action plans and better structure.</p>
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
            <p>Full plan plus advanced feeding insights.</p>
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
          <p className="neoDash__label">Main food insight</p>
          <h2>{foodInsight.title}</h2>
          <p>{foodInsight.description}</p>

          <div className="neoDash__miniStats">
            <div className="neoDash__miniStat">
              <span>Food stage</span>
              <strong>{foodStage}</strong>
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
          <p className="neoDash__label">Food score</p>
          <div className="neoDash__scoreNumber">{foodScore}</div>
          <p className="neoDash__scoreText">
            {foodHistory.length === 0
              ? "No data yet"
              : foodScore >= 80
              ? "Excellent feeding rhythm"
              : foodScore >= 65
              ? "Good food pattern overall"
              : "Needs closer observation"}
          </p>
        </article>
      </div>

      <div className="neoDash__summaryGrid">
        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Meal rhythm</p>
          <strong>{foodInsight.rhythmStatus}</strong>
          <span>Consistency over recent logs</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Recent logs</p>
          <strong>{foodInsight.averageMeals}</strong>
          <span>Tracked meals</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">Reaction signal</p>
          <strong>{foodInsight.reactionSignal}</strong>
          <span>Food response overview</span>
        </article>
      </div>

      <div className="neoDash__contentGrid">
        <article className="neoDash__card">
          <p className="neoDash__label">What to do next</p>
          <h3>Feeding recommendation</h3>
          <p>{foodInsight.action}</p>
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
            <p className="neoDash__label">Food AI assistant</p>
            <h3>{aiFoodAssistant.title}</h3>
            <p className="neoDash__panelText">
              Ask about meals, reactions, food ideas or quantity concerns.
            </p>
          </div>
        </div>

        <div className="neoDash__form">
          <div className="neoDash__formGrid">
            <label style={{ gridColumn: "1 / -1" }}>
              <span>Your food question</span>
              <input
                type="text"
                value={aiFoodInput}
                onChange={(e) => setAiFoodInput(e.target.value)}
                placeholder="e.g. What should my baby eat today?"
              />
            </label>
          </div>
        </div>

        <div className="neoDash__card" style={{ marginTop: "20px" }}>
          <p className="neoDash__label">AI message</p>
          <h3>{aiFoodAssistant.title}</h3>
          <p>{aiFoodAssistant.message}</p>

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
                Unlock the full food action plan for this question.
              </p>
            </div>
          )}

          {planAccess.canSeePlan && aiFoodAssistant.plan && (
            <div style={{ marginTop: "16px" }}>
              <p className="neoDash__label">Food action plan</p>
              <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                {aiFoodAssistant.plan.map((step, i) => (
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
                Unlock deeper feeding insights and advanced AI suggestions.
              </p>
            </div>
          )}

          {planAccess.canSeeEliteInsights && aiFoodAssistant.eliteInsights && (
            <div style={{ marginTop: "16px" }}>
              <p className="neoDash__label">Elite insights</p>
              <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                {aiFoodAssistant.eliteInsights.map((item, i) => (
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
            <p className="neoDash__label">Daily food log</p>
            <h3>Add recent meals</h3>
            <p className="neoDash__panelText">
              Better logs create better meal rhythm and reaction insights.
            </p>
          </div>
        </div>

        <form className="neoDash__form" onSubmit={handleFoodSubmit}>
          <div className="neoDash__formGrid">
            <label>
              <span>Meal time</span>
              <input
                type="time"
                value={foodForm.mealTime}
                onChange={(e) =>
                  setFoodForm((prev) => ({ ...prev, mealTime: e.target.value }))
                }
              />
            </label>

            <label>
              <span>Meal type</span>
              <select
                value={foodForm.mealType}
                onChange={(e) =>
                  setFoodForm((prev) => ({ ...prev, mealType: e.target.value }))
                }
              >
                <option value="">Select type</option>
                <option value="Milk">Milk</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snack">Snack</option>
                <option value="Puree">Puree</option>
              </select>
            </label>

            <label>
              <span>Food</span>
              <input
                type="text"
                placeholder="e.g. Carrot puree"
                value={foodForm.food}
                onChange={(e) =>
                  setFoodForm((prev) => ({ ...prev, food: e.target.value }))
                }
              />
            </label>

            <label>
              <span>Quantity</span>
              <input
                type="text"
                placeholder="e.g. 120 ml / 6 spoons"
                value={foodForm.quantity}
                onChange={(e) =>
                  setFoodForm((prev) => ({ ...prev, quantity: e.target.value }))
                }
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>Reaction</span>
              <select
                value={foodForm.reaction}
                onChange={(e) =>
                  setFoodForm((prev) => ({ ...prev, reaction: e.target.value }))
                }
              >
                <option value="">Select reaction</option>
                <option value="Good">Good</option>
                <option value="Unsure">Unsure</option>
                <option value="Sensitive">Sensitive</option>
              </select>
            </label>
          </div>

          <div className="neoDash__formActions">
            <button type="submit" className="neoDash__primaryBtn">
              Save food log
            </button>
            <button
              type="button"
              className="neoDash__secondaryBtn"
              onClick={clearFoodHistory}
            >
              Clear history
            </button>
          </div>
        </form>
      </section>

      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">Recent food history</p>
            <h3>{foodHistory.length} / 12 saved</h3>
          </div>
        </div>

        {foodHistory.length === 0 ? (
          <div className="neoDash__empty">No meals saved yet. Add the first one above.</div>
        ) : (
          <div className="neoDash__historyList">
            {foodHistory.map((entry) => {
              const foodName = extractFoodFromNote(entry.note);
              const reaction = extractReactionFromNote(entry.note);

              return (
                <div key={entry.id} className="neoDash__historyItem">
                  <div>
                    <strong>{entry.type}</strong>
                    <p>
                      {entry.time}
                      {foodName ? ` • ${foodName}` : ""}
                    </p>
                  </div>
                  <div>
                    <strong>{entry.amount}</strong>
                    <p>Reaction: {reaction}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppModuleLayout>
  );
}