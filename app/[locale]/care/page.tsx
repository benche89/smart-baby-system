"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";

type Locale = "en" | "fr";
type PlanTier = "basic" | "premium" | "elite";

type CareEntry = {
  id: number;
  time: string;
  careType: string;
  status: string;
  note: string;
  createdAt: string;
};

const CARE_STORAGE_KEY = "sb_care_entries";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

const copy = {
  en: {
    title: "Care module",
    subtitle:
      "Track care routines, daily actions and consistency signals to create calmer structure.",
    label: "Care intelligence",
    focusTitle: "Care tracking",
    focusText: "Routines, stability and clearer daily care structure.",
    addLabel: "Add care log",
    addTitle: "Log a care action",
    addText:
      "Save routines and daily care events to make consistency easier to understand.",
    time: "Time",
    type: "Care type",
    status: "Status",
    note: "Notes",
    save: "Save care log",
    diaper: "Diaper",
    bath: "Bath",
    hygiene: "Hygiene",
    medicine: "Medicine",
    routine: "Routine",
    completed: "Completed",
    partial: "Partial",
    difficult: "Difficult",
    totalLogs: "Total logs",
    recentStatus: "Recent status",
    careVariety: "Routine variety",
    premiumTitle: "Premium care insights",
    premiumText:
      "Premium and Elite unlock a stronger view of consistency, friction and routine quality.",
    premiumLocked: "Upgrade to Premium to unlock better routine analysis.",
    eliteLocked: "Upgrade to Elite for deeper care insights.",
    insightTitle: "Care overview",
    insightText: "Stable routines reduce friction across the whole day.",
    recentLogs: "Recent care logs",
    noLogs: "No care logs yet.",
    delete: "Delete",
    placeholder: "Short note about routine, resistance, context or outcome..."
  },
  fr: {
    title: "Module soins",
    subtitle:
      "Suivez les routines, les actions quotidiennes et les signaux de cohérence pour créer une structure plus apaisée.",
    label: "Intelligence soins",
    focusTitle: "Suivi des soins",
    focusText: "Routines, stabilité et structure quotidienne plus claire.",
    addLabel: "Ajouter un log soins",
    addTitle: "Enregistrer une action de soin",
    addText:
      "Enregistrez les routines et les événements de soins quotidiens pour mieux comprendre la cohérence.",
    time: "Heure",
    type: "Type de soin",
    status: "Statut",
    note: "Notes",
    save: "Enregistrer le log soins",
    diaper: "Couche",
    bath: "Bain",
    hygiene: "Hygiène",
    medicine: "Médicament",
    routine: "Routine",
    completed: "Terminé",
    partial: "Partiel",
    difficult: "Difficile",
    totalLogs: "Nombre de logs",
    recentStatus: "Statut récent",
    careVariety: "Variété des routines",
    premiumTitle: "Insights soins Premium",
    premiumText:
      "Premium et Elite débloquent une vision plus forte de la cohérence, des frictions et de la qualité des routines.",
    premiumLocked: "Passez à Premium pour débloquer une meilleure analyse des routines.",
    eliteLocked: "Passez à Elite pour des insights soins plus poussés.",
    insightTitle: "Vue d’ensemble des soins",
    insightText: "Des routines stables réduisent les frictions sur toute la journée.",
    recentLogs: "Logs soins récents",
    noLogs: "Aucun log soins pour le moment.",
    delete: "Supprimer",
    placeholder: "Courte note sur la routine, la résistance, le contexte ou le résultat..."
  },
} as const;

function getTodayLabel(locale: Locale) {
  return new Date().toLocaleDateString(locale === "fr" ? "fr-BE" : "en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function CarePage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [dateLabel, setDateLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");
  const [careHistory, setCareHistory] = useState<CareEntry[]>([]);
  const [form, setForm] = useState({
    time: "",
    careType: locale === "fr" ? "Routine" : "Routine",
    status: locale === "fr" ? "Terminé" : "Completed",
    note: "",
  });

  useEffect(() => {
    setDateLabel(getTodayLabel(locale));

    const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);
    if (savedPlan === "basic" || savedPlan === "premium" || savedPlan === "elite") {
      setSelectedPlan(savedPlan);
    }

    try {
      const saved = localStorage.getItem(CARE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CareEntry[];
        setCareHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch {
      // ignore invalid storage
    }
  }, [locale]);

  function persist(entries: CareEntry[]) {
    setCareHistory(entries);
    localStorage.setItem(CARE_STORAGE_KEY, JSON.stringify(entries));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.time || !form.careType || !form.status) return;

    const entry: CareEntry = {
      id: Date.now(),
      time: form.time,
      careType: form.careType,
      status: form.status,
      note: form.note,
      createdAt: new Date().toISOString(),
    };

    persist([entry, ...careHistory]);

    setForm({
      time: "",
      careType: locale === "fr" ? "Routine" : "Routine",
      status: locale === "fr" ? "Terminé" : "Completed",
      note: "",
    });
  }

  function deleteEntry(id: number) {
    persist(careHistory.filter((entry) => entry.id !== id));
  }

  const recentStatus = careHistory[0]?.status ?? "-";
  const careVariety = new Set(careHistory.map((entry) => entry.careType)).size;

  const premiumUnlocked = selectedPlan === "premium" || selectedPlan === "elite";
  const eliteUnlocked = selectedPlan === "elite";

  const advancedSignal = useMemo(() => {
    const difficultCount = careHistory.filter((entry) => entry.status === t.difficult).length;
    const partialCount = careHistory.filter((entry) => entry.status === t.partial).length;

    if (difficultCount >= 2) {
      return locale === "fr"
        ? "Frictions répétées détectées — simplifier la routine."
        : "Repeated friction detected — simplify the routine.";
    }

    if (partialCount >= 2) {
      return locale === "fr"
        ? "Cohérence mixte — garder une structure plus stable."
        : "Mixed consistency — keep a more stable structure.";
    }

    return locale === "fr"
      ? "La routine semble plutôt stable."
      : "Routine looks fairly stable.";
  }, [careHistory, t.difficult, t.partial, locale]);

  return (
    <AppModuleLayout
      active="care"
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
                value={form.careType}
                onChange={(e) => setForm((prev) => ({ ...prev, careType: e.target.value }))}
              >
                <option value={t.diaper}>{t.diaper}</option>
                <option value={t.bath}>{t.bath}</option>
                <option value={t.hygiene}>{t.hygiene}</option>
                <option value={t.medicine}>{t.medicine}</option>
                <option value={t.routine}>{t.routine}</option>
              </select>
            </label>

            <label>
              <span>{t.status}</span>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value={t.completed}>{t.completed}</option>
                <option value={t.partial}>{t.partial}</option>
                <option value={t.difficult}>{t.difficult}</option>
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
          <strong>{careHistory.length}</strong>
          <span>{t.insightTitle}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.recentStatus}</p>
          <strong>{recentStatus}</strong>
          <span>{t.insightText}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.careVariety}</p>
          <strong>{careVariety}</strong>
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

          {careHistory.length === 0 ? (
            <p>{t.noLogs}</p>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {careHistory.slice(0, 6).map((entry) => (
                <div key={entry.id} style={logRowStyle}>
                  <div>
                    <strong>
                      {entry.time} • {entry.careType}
                    </strong>
                    <p style={smallTextStyle}>{entry.status}</p>
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