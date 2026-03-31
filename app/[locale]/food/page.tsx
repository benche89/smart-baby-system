"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";

type Locale = "en" | "fr";
type PlanTier = "basic" | "premium" | "elite";

type FoodEntry = {
  id: number;
  time: string;
  type: string;
  amount: string;
  note: string;
  createdAt: string;
};

const FOOD_STORAGE_KEY = "sb_food_entries";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

const copy = {
  en: {
    title: "Food module",
    subtitle:
      "Track meals, reactions and feeding patterns to make daily nutrition decisions clearer.",
    label: "Food intelligence",
    focusTitle: "Food tracking",
    focusText: "Meals, reactions and calmer feeding visibility.",
    addLabel: "Add food log",
    addTitle: "Log a meal",
    addText: "Save meals and reactions so the system can reveal patterns more clearly.",
    time: "Meal time",
    type: "Meal type",
    amount: "Amount",
    reaction: "Reaction",
    food: "Food",
    note: "Notes",
    save: "Save food log",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    bottle: "Bottle",
    good: "Good",
    unsure: "Unsure",
    sensitive: "Sensitive",
    totalLogs: "Total logs",
    recentReaction: "Recent reaction",
    mealVariety: "Meal variety",
    premiumTitle: "Premium food insights",
    premiumText:
      "Premium and Elite plans help parents understand repetition, sensitivity signals and calmer meal structure.",
    premiumLocked: "Upgrade to Premium to unlock better food pattern analysis.",
    eliteLocked: "Upgrade to Elite for deeper feeding insights.",
    insightTitle: "Food overview",
    insightText: "Simple food tracking makes reactions easier to understand.",
    recentLogs: "Recent food logs",
    noLogs: "No food logs yet.",
    delete: "Delete",
    placeholderFood: "e.g. banana, porridge, yogurt",
    placeholderNotes: "Short note about reaction, context or appetite..."
  },
  fr: {
    title: "Module alimentation",
    subtitle:
      "Suivez les repas, les réactions et les habitudes alimentaires pour rendre les décisions nutritionnelles quotidiennes plus claires.",
    label: "Intelligence alimentation",
    focusTitle: "Suivi de l’alimentation",
    focusText: "Repas, réactions et meilleure visibilité alimentaire.",
    addLabel: "Ajouter un log repas",
    addTitle: "Enregistrer un repas",
    addText:
      "Enregistrez les repas et les réactions afin que le système révèle plus clairement les schémas.",
    time: "Heure du repas",
    type: "Type de repas",
    amount: "Quantité",
    reaction: "Réaction",
    food: "Aliment",
    note: "Notes",
    save: "Enregistrer le log repas",
    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation",
    bottle: "Biberon",
    good: "Bonne",
    unsure: "Incertaine",
    sensitive: "Sensible",
    totalLogs: "Nombre de logs",
    recentReaction: "Réaction récente",
    mealVariety: "Variété des repas",
    premiumTitle: "Insights alimentation Premium",
    premiumText:
      "Les plans Premium et Elite aident les parents à comprendre la répétition, les signaux de sensibilité et une structure de repas plus calme.",
    premiumLocked:
      "Passez à Premium pour débloquer une meilleure analyse des schémas alimentaires.",
    eliteLocked: "Passez à Elite pour des insights alimentaires plus poussés.",
    insightTitle: "Vue d’ensemble de l’alimentation",
    insightText:
      "Un suivi alimentaire simple rend les réactions plus faciles à comprendre.",
    recentLogs: "Logs alimentation récents",
    noLogs: "Aucun log alimentation pour le moment.",
    delete: "Supprimer",
    placeholderFood: "ex. banane, porridge, yaourt",
    placeholderNotes: "Courte note sur la réaction, le contexte ou l’appétit..."
  },
} as const;

function getTodayLabel(locale: Locale) {
  return new Date().toLocaleDateString(locale === "fr" ? "fr-BE" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function extractReaction(note: string, fallbackGood: string) {
  const match = note.match(/Reaction:\s*([^|]+)/i);
  return match ? match[1].trim() : fallbackGood;
}

function extractFood(note: string) {
  const match = note.match(/Food:\s*([^|]+)/i);
  return match ? match[1].trim() : "";
}

export default function FoodPage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [dateLabel, setDateLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");
  const [foodHistory, setFoodHistory] = useState<FoodEntry[]>([]);
  const [form, setForm] = useState({
    time: "",
    type: locale === "fr" ? "Petit-déjeuner" : "Breakfast",
    amount: "",
    food: "",
    reaction: locale === "fr" ? "Bonne" : "Good",
    note: "",
  });

  useEffect(() => {
    setDateLabel(getTodayLabel(locale));

    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
    if (savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite") {
      setSelectedPlan(savedPlan);
    }

    try {
      const saved = localStorage.getItem(FOOD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FoodEntry[];
        setFoodHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore invalid storage
    }
  }, [locale]);

  function persist(entries: FoodEntry[]) {
    setFoodHistory(entries);
    localStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(entries));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.time || !form.type || !form.amount || !form.food) return;

    const combinedNote = `Food: ${form.food} | Reaction: ${form.reaction}${form.note ? ` | ${form.note}` : ""}`;

    const entry: FoodEntry = {
      id: Date.now(),
      time: form.time,
      type: form.type,
      amount: form.amount,
      note: combinedNote,
      createdAt: new Date().toISOString(),
    };

    persist([entry, ...foodHistory]);

    setForm({
      time: "",
      type: locale === "fr" ? "Petit-déjeuner" : "Breakfast",
      amount: "",
      food: "",
      reaction: locale === "fr" ? "Bonne" : "Good",
      note: "",
    });
  }

  function deleteEntry(id: number) {
    persist(foodHistory.filter((entry) => entry.id !== id));
  }

  const reactions = useMemo(
    () => foodHistory.map((entry) => extractReaction(entry.note, t.good)),
    [foodHistory, t.good]
  );

  const recentReaction = reactions[0] ?? "-";
  const mealVariety = new Set(foodHistory.map((entry) => entry.type)).size;

  const premiumUnlocked = selectedPlan === "premium" || selectedPlan === "elite";
  const eliteUnlocked = selectedPlan === "elite";

  const advancedSignal = useMemo(() => {
    const sensitiveCount = reactions.filter((r) => r === t.sensitive).length;
    const unsureCount = reactions.filter((r) => r === t.unsure).length;

    if (sensitiveCount >= 2) {
      return locale === "fr"
        ? "Sensibilité répétée détectée — simplifier les repas."
        : "Repeated sensitivity detected — simplify meals.";
    }

    if (unsureCount >= 2) {
      return locale === "fr"
        ? "Réactions mixtes — garder une structure simple."
        : "Mixed reactions — keep the structure simple.";
    }

    return locale === "fr"
      ? "Le rythme alimentaire semble plutôt stable."
      : "Food rhythm looks fairly stable.";
  }, [reactions, t.sensitive, t.unsure, locale]);

  return (
    <AppModuleLayout
      active="food"
      title={t.title}
      subtitle={t.subtitle}
      label={t.label}
      currentFocusTitle={t.focusTitle}
      currentFocusText={t.focusText}
      dateLabel={dateLabel}
    >
      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">{t.addLabel}</p>
            <h3>{t.addTitle}</h3>
            <p className="neoDash__panelText">{t.addText}</p>
          </div>
        </div>

        <form className="neoDash__form" onSubmit={handleSubmit}>
          <div className="neoDash__formGrid">
            <label>
              <span>{t.time}</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
              />
            </label>

            <label>
              <span>{t.type}</span>
              <select
                value={form.type}
                onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              >
                <option value={t.breakfast}>{t.breakfast}</option>
                <option value={t.lunch}>{t.lunch}</option>
                <option value={t.dinner}>{t.dinner}</option>
                <option value={t.snack}>{t.snack}</option>
                <option value={t.bottle}>{t.bottle}</option>
              </select>
            </label>

            <label>
              <span>{t.amount}</span>
              <input
                type="text"
                value={form.amount}
                onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="120 ml / small bowl"
              />
            </label>

            <label>
              <span>{t.reaction}</span>
              <select
                value={form.reaction}
                onChange={(e) => setForm((prev) => ({ ...prev, reaction: e.target.value }))}
              >
                <option value={t.good}>{t.good}</option>
                <option value={t.unsure}>{t.unsure}</option>
                <option value={t.sensitive}>{t.sensitive}</option>
              </select>
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.food}</span>
              <input
                type="text"
                value={form.food}
                onChange={(e) => setForm((prev) => ({ ...prev, food: e.target.value }))}
                placeholder={t.placeholderFood}
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.note}</span>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder={t.placeholderNotes}
              />
            </label>
          </div>

          <div className="neoDash__formActions">
            <button type="submit" className="neoDash__primaryBtn">
              {t.save}
            </button>
          </div>
        </form>
      </section>

      <div className="neoDash__summaryGrid">
        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.totalLogs}</p>
          <strong>{foodHistory.length}</strong>
          <span>{t.insightTitle}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.recentReaction}</p>
          <strong>{recentReaction}</strong>
          <span>{t.insightText}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.mealVariety}</p>
          <strong>{mealVariety}</strong>
          <span>{t.insightText}</span>
        </article>
      </div>

      <div className="neoDash__contentGrid">
        <article className="neoDash__card">
          <p className="neoDash__label">{t.premiumTitle}</p>
          <h3>{t.insightTitle}</h3>
          <p>{t.premiumText}</p>

          {!premiumUnlocked ? (
            <div style={lockedBoxStyle}>{t.premiumLocked}</div>
          ) : (
            <div style={infoBoxStyle}>{advancedSignal}</div>
          )}

          {premiumUnlocked && !eliteUnlocked ? (
            <div style={{ ...lockedBoxStyle, marginTop: "12px" }}>{t.eliteLocked}</div>
          ) : null}
        </article>

        <article className="neoDash__card">
          <p className="neoDash__label">{t.recentLogs}</p>
          <h3>{t.insightTitle}</h3>

          {foodHistory.length === 0 ? (
            <p>{t.noLogs}</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {foodHistory.slice(0, 6).map((entry) => (
                <div key={entry.id} style={logRowStyle}>
                  <div>
                    <strong>
                      {entry.time} • {entry.type}
                    </strong>
                    <p style={smallTextStyle}>{entry.amount}</p>
                    <p style={smallTextStyle}>{extractFood(entry.note)}</p>
                    <p style={smallTextStyle}>{extractReaction(entry.note, t.good)}</p>
                    {entry.note ? <p style={smallTextStyle}>{entry.note}</p> : null}
                  </div>

                  <button
                    type="button"
                    className="neoDash__secondaryBtn"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    {t.delete}
                  </button>
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </AppModuleLayout>
  );
}

const lockedBoxStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "16px",
  background: "#f8fafc",
  border: "1px solid rgba(148,163,184,0.2)",
};

const infoBoxStyle: React.CSSProperties = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(239,246,255,0.9)",
  border: "1px solid rgba(96,165,250,0.25)",
};

const logRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  alignItems: "flex-start",
  padding: "14px",
  borderRadius: "16px",
  background: "#fff",
  border: "1px solid rgba(148,163,184,0.14)",
};

const smallTextStyle: React.CSSProperties = {
  marginTop: "4px",
  color: "#64748b",
  lineHeight: 1.5,
};