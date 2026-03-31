"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";

type Locale = "en" | "fr";
type PlanTier = "basic" | "premium" | "elite";

type SleepEntry = {
  id: number;
  start: string;
  end: string;
  duration: string;
  quality: string;
  note: string;
  createdAt: string;
};

const SLEEP_STORAGE_KEY = "sb_sleep_entries";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

const copy = {
  en: {
    title: "Sleep module",
    subtitle:
      "Track naps, understand rhythm and improve daily sleep decisions with a calmer system.",
    label: "Sleep intelligence",
    focusTitle: "Sleep tracking",
    focusText: "Logs, rhythm clarity and premium sleep guidance.",
    addLabel: "Add sleep log",
    addTitle: "Log a nap or sleep window",
    addText: "Save recent sleep data to improve rhythm visibility and dashboard intelligence.",
    start: "Start time",
    end: "End time",
    duration: "Duration (minutes)",
    quality: "Sleep quality",
    note: "Notes",
    save: "Save sleep log",
    qualityOptions: ["Excellent", "Good", "Light", "Poor"],
    insightTitle: "Sleep overview",
    insightText: "A cleaner view of rhythm helps the whole day feel more predictable.",
    totalLogs: "Total logs",
    averageNap: "Average nap",
    lastQuality: "Last quality",
    premiumTitle: "Premium sleep insights",
    premiumText:
      "Parents on Premium or Elite can unlock stronger rhythm interpretation and clearer planning.",
    premiumLocked: "Upgrade to Premium to unlock deeper sleep planning.",
    eliteLocked: "Upgrade to Elite for advanced sleep insights.",
    advancedTitle: "Advanced rhythm signal",
    advancedText:
      "Recent sleep quality and duration suggest whether today needs stronger bedtime protection.",
    recentLogs: "Recent sleep logs",
    noLogs: "No sleep logs yet.",
    delete: "Delete",
    placeholder: "Short note about mood, wake window, environment..."
  },
  fr: {
    title: "Module sommeil",
    subtitle:
      "Suivez les siestes, comprenez le rythme et améliorez les décisions quotidiennes liées au sommeil avec un système plus apaisant.",
    label: "Intelligence sommeil",
    focusTitle: "Suivi du sommeil",
    focusText: "Logs, clarté du rythme et guidance sommeil premium.",
    addLabel: "Ajouter un log sommeil",
    addTitle: "Enregistrer une sieste ou une période de sommeil",
    addText:
      "Enregistrez les données récentes de sommeil pour améliorer la visibilité du rythme et l’intelligence du dashboard.",
    start: "Heure de début",
    end: "Heure de fin",
    duration: "Durée (minutes)",
    quality: "Qualité du sommeil",
    note: "Notes",
    save: "Enregistrer le log sommeil",
    qualityOptions: ["Excellent", "Bon", "Léger", "Faible"],
    insightTitle: "Vue d’ensemble du sommeil",
    insightText:
      "Une vision plus claire du rythme aide toute la journée à être plus prévisible.",
    totalLogs: "Nombre de logs",
    averageNap: "Sieste moyenne",
    lastQuality: "Dernière qualité",
    premiumTitle: "Insights sommeil Premium",
    premiumText:
      "Les parents en Premium ou Elite débloquent une interprétation plus forte du rythme et une planification plus claire.",
    premiumLocked: "Passez à Premium pour débloquer une planification sommeil plus poussée.",
    eliteLocked: "Passez à Elite pour des insights sommeil avancés.",
    advancedTitle: "Signal avancé du rythme",
    advancedText:
      "La qualité et la durée récentes du sommeil indiquent si la journée a besoin d’une meilleure protection du coucher.",
    recentLogs: "Logs sommeil récents",
    noLogs: "Aucun log sommeil pour le moment.",
    delete: "Supprimer",
    placeholder: "Courte note sur l’humeur, la fenêtre d’éveil, l’environnement..."
  },
} as const;

function getTodayLabel(locale: Locale) {
  return new Date().toLocaleDateString(locale === "fr" ? "fr-BE" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

export default function SleepPage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [dateLabel, setDateLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [form, setForm] = useState({
    start: "",
    end: "",
    duration: "",
    quality: locale === "fr" ? "Bon" : "Good",
    note: "",
  });

  useEffect(() => {
    setDateLabel(getTodayLabel(locale));

    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
    if (savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite") {
      setSelectedPlan(savedPlan);
    }

    try {
      const saved = localStorage.getItem(SLEEP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SleepEntry[];
        setSleepHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore invalid storage
    }
  }, [locale]);

  function persist(entries: SleepEntry[]) {
    setSleepHistory(entries);
    localStorage.setItem(SLEEP_STORAGE_KEY, JSON.stringify(entries));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.start || !form.end || !form.duration) return;

    const entry: SleepEntry = {
      id: Date.now(),
      start: form.start,
      end: form.end,
      duration: form.duration,
      quality: form.quality,
      note: form.note,
      createdAt: new Date().toISOString(),
    };

    persist([entry, ...sleepHistory]);

    setForm({
      start: "",
      end: "",
      duration: "",
      quality: locale === "fr" ? "Bon" : "Good",
      note: "",
    });
  }

  function deleteEntry(id: number) {
    persist(sleepHistory.filter((entry) => entry.id !== id));
  }

  const durations = useMemo(
    () => sleepHistory.map((entry) => Number(entry.duration)).filter((value) => Number.isFinite(value)),
    [sleepHistory]
  );

  const averageNap = useMemo(() => average(durations), [durations]);
  const lastQuality = sleepHistory[0]?.quality ?? "-";

  const premiumUnlocked = selectedPlan === "premium" || selectedPlan === "elite";
  const eliteUnlocked = selectedPlan === "elite";

  const advancedSignal = useMemo(() => {
    if (sleepHistory.length === 0) return "-";

    const poorLabels = locale === "fr" ? ["Faible"] : ["Poor"];
    const lightLabels = locale === "fr" ? ["Léger"] : ["Light"];

    const poorCount = sleepHistory.filter((entry) => poorLabels.includes(entry.quality)).length;
    const lightCount = sleepHistory.filter((entry) => lightLabels.includes(entry.quality)).length;

    if (poorCount >= 2) {
      return locale === "fr"
        ? "Fatigue probable en hausse — protéger le coucher."
        : "Fatigue likely building — protect bedtime.";
    }

    if (lightCount >= 2 || averageNap < 45) {
      return locale === "fr"
        ? "Rythme fragile — simplifier la journée."
        : "Rhythm looks fragile — keep the day simpler.";
    }

    return locale === "fr"
      ? "Rythme plutôt stable aujourd’hui."
      : "Rhythm looks fairly stable today.";
  }, [sleepHistory, averageNap, locale]);

  return (
    <AppModuleLayout
      active="sleep"
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
              <span>{t.start}</span>
              <input
                type="time"
                value={form.start}
                onChange={(e) => setForm((prev) => ({ ...prev, start: e.target.value }))}
              />
            </label>

            <label>
              <span>{t.end}</span>
              <input
                type="time"
                value={form.end}
                onChange={(e) => setForm((prev) => ({ ...prev, end: e.target.value }))}
              />
            </label>

            <label>
              <span>{t.duration}</span>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm((prev) => ({ ...prev, duration: e.target.value }))}
                placeholder="60"
              />
            </label>

            <label>
              <span>{t.quality}</span>
              <select
                value={form.quality}
                onChange={(e) => setForm((prev) => ({ ...prev, quality: e.target.value }))}
              >
                {t.qualityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.note}</span>
              <textarea
                rows={4}
                value={form.note}
                onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
                placeholder={t.placeholder}
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
          <strong>{sleepHistory.length}</strong>
          <span>{t.insightTitle}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.averageNap}</p>
          <strong>{averageNap || 0}</strong>
          <span>min</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.lastQuality}</p>
          <strong>{lastQuality}</strong>
          <span>{t.insightText}</span>
        </article>
      </div>

      <div className="neoDash__contentGrid">
        <article className="neoDash__card">
          <p className="neoDash__label">{t.premiumTitle}</p>
          <h3>{t.advancedTitle}</h3>
          <p>{t.premiumText}</p>

          {!premiumUnlocked ? (
            <div style={lockedBoxStyle}>{t.premiumLocked}</div>
          ) : (
            <div style={infoBoxStyle}>{advancedSignal}</div>
          )}

          {premiumUnlocked && !eliteUnlocked ? (
            <div style={{ ...lockedBoxStyle, marginTop: "12px" }}>{t.eliteLocked}</div>
          ) : null}

          {eliteUnlocked ? (
            <div style={{ ...infoBoxStyle, marginTop: "12px" }}>{t.advancedText}</div>
          ) : null}
        </article>

        <article className="neoDash__card">
          <p className="neoDash__label">{t.recentLogs}</p>
          <h3>{t.insightTitle}</h3>

          {sleepHistory.length === 0 ? (
            <p>{t.noLogs}</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {sleepHistory.slice(0, 6).map((entry) => (
                <div key={entry.id} style={logRowStyle}>
                  <div>
                    <strong>
                      {entry.start} → {entry.end}
                    </strong>
                    <p style={smallTextStyle}>
                      {entry.duration} min • {entry.quality}
                    </p>
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