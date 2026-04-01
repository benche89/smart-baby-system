"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import {
  getSleepEntries,
  addSleepEntry,
  deleteSleepEntry,
  importLocalStorageToSupabase,
  type SleepEntry,
} from "../../../lib/supabase/app-data";

type Locale = "en" | "fr";

const copy = {
  en: {
    subtitle: "Track naps and sleep quality securely with Supabase-backed storage.",
    label: "Sleep tracking",
    focusTitle: "Sleep module",
    focusText: "Log naps, quality and sleep rhythm to improve daily clarity.",

    pageLabel: "Sleep",
    pageTitle: "Sleep log",
    pageText:
      "Save each sleep session to build stronger daily insights and smarter dashboard guidance.",

    start: "Start time",
    end: "End time",
    duration: "Duration (minutes)",
    quality: "Sleep quality",
    note: "Notes",
    notePlaceholder: "Add useful context about this nap or sleep session...",
    addEntry: "Add sleep entry",
    adding: "Saving...",
    loading: "Loading sleep data...",
    noEntries: "No sleep entries yet.",
    deleteEntry: "Delete",
    deletingError: "Failed to delete sleep entry.",
    saveError: "Failed to save sleep entry.",
    loadError: "Failed to load sleep data.",
    secureStorage: "Your sleep logs are stored securely in Supabase.",
    aiMedicalNote: "AI suggestions are not medical advice.",

    excellent: "Excellent",
    good: "Good",
    light: "Light",
    poor: "Poor",

    lastEntries: "Recent sleep entries",
    qualityLabel: "Quality",
    durationLabel: "Duration",
    minutes: "min",
    savedAt: "Saved",
  },
  fr: {
    subtitle: "Suivez les siestes et la qualité du sommeil avec un stockage sécurisé sur Supabase.",
    label: "Suivi sommeil",
    focusTitle: "Module sommeil",
    focusText:
      "Enregistrez les siestes, la qualité et le rythme du sommeil pour une meilleure clarté quotidienne.",

    pageLabel: "Sommeil",
    pageTitle: "Journal du sommeil",
    pageText:
      "Enregistrez chaque session de sommeil pour créer de meilleurs insights quotidiens et une guidance dashboard plus intelligente.",

    start: "Heure de début",
    end: "Heure de fin",
    duration: "Durée (minutes)",
    quality: "Qualité du sommeil",
    note: "Notes",
    notePlaceholder: "Ajoutez un contexte utile sur cette sieste ou session de sommeil...",
    addEntry: "Ajouter une entrée sommeil",
    adding: "Enregistrement...",
    loading: "Chargement des données sommeil...",
    noEntries: "Aucune entrée sommeil pour le moment.",
    deleteEntry: "Supprimer",
    deletingError: "Impossible de supprimer l’entrée sommeil.",
    saveError: "Impossible d’enregistrer l’entrée sommeil.",
    loadError: "Impossible de charger les données sommeil.",
    secureStorage: "Vos logs sommeil sont stockés en toute sécurité dans Supabase.",
    aiMedicalNote: "Les suggestions IA ne constituent pas un avis médical.",

    excellent: "Excellent",
    good: "Bon",
    light: "Léger",
    poor: "Faible",

    lastEntries: "Entrées sommeil récentes",
    qualityLabel: "Qualité",
    durationLabel: "Durée",
    minutes: "min",
    savedAt: "Enregistré",
  },
} as const;

function getTodayLabel(locale: Locale) {
  const format = locale === "fr" ? "fr-BE" : "en-GB";
  return new Date().toLocaleDateString(format, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatSavedDate(value: string, locale: Locale) {
  const format = locale === "fr" ? "fr-BE" : "en-GB";

  try {
    return new Date(value).toLocaleString(format, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
}

function getSupabase() {
  return createSupabaseClient();
}

export default function SleepPage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [todayLabel, setTodayLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const [form, setForm] = useState({
    start: "",
    end: "",
    duration: "",
    quality: locale === "fr" ? "Bon" : "Good",
    note: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      quality: locale === "fr" ? "Bon" : "Good",
    }));
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    async function loadSleepData() {
      const supabase = getSupabase();

      setIsLoading(true);
      setTodayLabel(getTodayLabel(locale));
      setStatusMessage("");
      setStatusType("");

      try {
        await importLocalStorageToSupabase(supabase);

        const rows = await getSleepEntries(supabase);

        if (!isMounted) return;
        setSleepEntries(rows);
      } catch (error) {
        console.error("Failed to load sleep entries:", error);
        if (isMounted) {
          setStatusMessage(t.loadError);
          setStatusType("error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSleepData();

    return () => {
      isMounted = false;
    };
  }, [locale, t.loadError]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleAddSleepEntry() {
    if (!form.start || !form.end || !form.duration || !form.quality) {
      setStatusMessage(t.saveError);
      setStatusType("error");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const supabase = getSupabase();

      const saved = await addSleepEntry(supabase, {
        start: form.start.trim(),
        end: form.end.trim(),
        duration: form.duration.trim(),
        quality: form.quality.trim(),
        note: form.note.trim(),
        createdAt: new Date().toISOString(),
      });

      setSleepEntries((prev) => [saved, ...prev]);
      setForm({
        start: "",
        end: "",
        duration: "",
        quality: locale === "fr" ? "Bon" : "Good",
        note: "",
      });
    } catch (error) {
      console.error("Failed to save sleep entry:", error);
      setStatusMessage(t.saveError);
      setStatusType("error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSleepEntry(id: number) {
    try {
      const supabase = getSupabase();

      await deleteSleepEntry(supabase, id);
      setSleepEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete sleep entry:", error);
      setStatusMessage(t.deletingError);
      setStatusType("error");
    }
  }

  if (isLoading) {
    return (
      <AppModuleLayout
        active="sleep"
        title="Smart Baby System"
        subtitle={t.subtitle}
        label={t.label}
        currentFocusTitle={t.focusTitle}
        currentFocusText={t.focusText}
        dateLabel="..."
      >
        <section className="neoDash__panel">
          <div className="neoDash__card">
            <h3>{t.loading}</h3>
            <p>{t.secureStorage}</p>
          </div>
        </section>
      </AppModuleLayout>
    );
  }

  return (
    <AppModuleLayout
      active="sleep"
      title={t.pageTitle}
      subtitle={t.subtitle}
      label={t.label}
      currentFocusTitle={t.focusTitle}
      currentFocusText={t.focusText}
      dateLabel={todayLabel || "..."}
    >
      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">{t.pageLabel}</p>
            <h3>{t.pageTitle}</h3>
            <p className="neoDash__panelText">{t.pageText}</p>
          </div>
        </div>

        <div className="neoDash__form">
          <div
            className="neoDash__formGrid"
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            <label>
              <span>{t.start}</span>
              <input
                type="time"
                value={form.start}
                onChange={(e) => updateField("start", e.target.value)}
              />
            </label>

            <label>
              <span>{t.end}</span>
              <input
                type="time"
                value={form.end}
                onChange={(e) => updateField("end", e.target.value)}
              />
            </label>

            <label>
              <span>{t.duration}</span>
              <input
                type="number"
                min="1"
                value={form.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="45"
              />
            </label>

            <label>
              <span>{t.quality}</span>
              <select
                value={form.quality}
                onChange={(e) => updateField("quality", e.target.value)}
              >
                <option value={t.excellent}>{t.excellent}</option>
                <option value={t.good}>{t.good}</option>
                <option value={t.light}>{t.light}</option>
                <option value={t.poor}>{t.poor}</option>
              </select>
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.note}</span>
              <textarea
                rows={5}
                value={form.note}
                onChange={(e) => updateField("note", e.target.value)}
                placeholder={t.notePlaceholder}
              />
            </label>
          </div>

          <div
            className="neoDash__formActions"
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              flexWrap: "wrap",
              marginTop: "18px",
            }}
          >
            <button
              type="button"
              className="neoDash__primaryBtn"
              onClick={handleAddSleepEntry}
              disabled={isSaving}
            >
              {isSaving ? t.adding : t.addEntry}
            </button>

            <p style={{ fontSize: "13px", opacity: 0.7 }}>{t.secureStorage}</p>
          </div>

          {statusMessage ? (
            <div
              style={{
                marginTop: "16px",
                padding: "14px 16px",
                borderRadius: "16px",
                border:
                  statusType === "success"
                    ? "1px solid rgba(34,197,94,0.25)"
                    : "1px solid rgba(239,68,68,0.25)",
                background:
                  statusType === "success"
                    ? "rgba(34,197,94,0.08)"
                    : "rgba(239,68,68,0.08)",
                color: statusType === "success" ? "#166534" : "#991b1b",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              {statusMessage}
            </div>
          ) : null}
        </div>
      </section>

      <section className="neoDash__panel" style={{ marginTop: "20px" }}>
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">{t.pageLabel}</p>
            <h3>{t.lastEntries}</h3>
          </div>
        </div>

        {sleepEntries.length === 0 ? (
          <div className="neoDash__card">
            <p>{t.noEntries}</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            }}
          >
            {sleepEntries.map((entry) => (
              <article key={entry.id} className="neoDash__card">
                <p className="neoDash__label">{t.pageLabel}</p>
                <h3>
                  {entry.start} → {entry.end}
                </h3>

                <p>
                  <strong>{t.durationLabel}:</strong> {entry.duration} {t.minutes}
                </p>
                <p>
                  <strong>{t.qualityLabel}:</strong> {entry.quality}
                </p>

                {entry.note ? <p style={{ marginTop: "10px" }}>{entry.note}</p> : null}

                <p style={{ marginTop: "12px", fontSize: "12px", opacity: 0.65 }}>
                  {t.savedAt}: {formatSavedDate(entry.createdAt, locale)}
                </p>

                <div style={{ marginTop: "14px" }}>
                  <button
                    type="button"
                    className="neoDash__secondaryBtn"
                    onClick={() => handleDeleteSleepEntry(entry.id)}
                  >
                    {t.deleteEntry}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="neoDash__panel" style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>{t.aiMedicalNote}</p>
      </section>
    </AppModuleLayout>
  );
}