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
    focusText:
      "Log naps and sleep quality to reveal stronger rhythm patterns and smarter dashboard predictions.",

    pageLabel: "Sleep",
    pageTitle: "Sleep log",
    pageText:
      "Save each nap to build better sleep insights and more useful daily guidance.",

    lastNapTime: "Last nap time",
    napDuration: "Nap duration (minutes)",
    mood: "Sleep quality",
    addEntry: "Add sleep entry",
    adding: "Saving...",
    loading: "Loading sleep data...",
    noEntries: "No sleep entries yet.",
    deleteEntry: "Delete",
    deleting: "Deleting...",
    deletingError: "Failed to delete sleep entry.",
    deletedSuccess: "Sleep entry deleted successfully.",
    saveError: "Failed to save sleep entry.",
    savedSuccess: "Sleep entry saved successfully.",
    validationError: "Please complete all fields before saving.",
    durationError: "Nap duration must be greater than 0.",
    loadError: "Failed to load sleep data.",
    secureStorage: "Your sleep logs are stored securely in Supabase.",
    aiMedicalNote: "AI suggestions are not medical advice.",

    excellent: "Excellent",
    good: "Good",
    light: "Light",
    poor: "Poor",

    recentEntries: "Recent sleep entries",
    qualityLabel: "Quality",
    durationLabel: "Duration",
  },
  fr: {
    subtitle: "Suivez les siestes et la qualité du sommeil avec un stockage sécurisé sur Supabase.",
    label: "Suivi sommeil",
    focusTitle: "Module sommeil",
    focusText:
      "Enregistrez les siestes et la qualité du sommeil pour révéler de meilleurs rythmes et des prédictions dashboard plus intelligentes.",

    pageLabel: "Sommeil",
    pageTitle: "Journal du sommeil",
    pageText:
      "Enregistrez chaque sieste pour construire de meilleurs insights sommeil et une guidance quotidienne plus utile.",

    lastNapTime: "Heure de la dernière sieste",
    napDuration: "Durée de la sieste (minutes)",
    mood: "Qualité du sommeil",
    addEntry: "Ajouter une entrée sommeil",
    adding: "Enregistrement...",
    loading: "Chargement des données sommeil...",
    noEntries: "Aucune entrée sommeil pour le moment.",
    deleteEntry: "Supprimer",
    deleting: "Suppression...",
    deletingError: "Impossible de supprimer l’entrée sommeil.",
    deletedSuccess: "Entrée sommeil supprimée avec succès.",
    saveError: "Impossible d’enregistrer l’entrée sommeil.",
    savedSuccess: "Entrée sommeil enregistrée avec succès.",
    validationError: "Veuillez compléter tous les champs avant d’enregistrer.",
    durationError: "La durée de la sieste doit être supérieure à 0.",
    loadError: "Impossible de charger les données sommeil.",
    secureStorage: "Vos logs sommeil sont stockés en toute sécurité dans Supabase.",
    aiMedicalNote: "Les suggestions IA ne constituent pas un avis médical.",

    excellent: "Excellent",
    good: "Bon",
    light: "Léger",
    poor: "Faible",

    recentEntries: "Entrées sommeil récentes",
    qualityLabel: "Qualité",
    durationLabel: "Durée",
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
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const [form, setForm] = useState({
    lastNapTime: "",
    napDuration: "",
    mood: locale === "fr" ? "Bon" : "Good",
  });

  useEffect(() => {
    setTodayLabel(getTodayLabel(locale));
    setForm({
      lastNapTime: "",
      napDuration: "",
      mood: locale === "fr" ? "Bon" : "Good",
    });
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    async function loadSleepData() {
      const supabase = getSupabase();

      setIsLoading(true);
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
    const cleanLastNapTime = form.lastNapTime.trim();
    const cleanNapDuration = form.napDuration.trim();
    const cleanMood = form.mood.trim();

    if (!cleanLastNapTime || !cleanNapDuration || !cleanMood) {
      setStatusMessage(t.validationError);
      setStatusType("error");
      return;
    }

    const numericDuration = Number(cleanNapDuration);
    if (!Number.isFinite(numericDuration) || numericDuration <= 0) {
      setStatusMessage(t.durationError);
      setStatusType("error");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const supabase = getSupabase();

      const result = await addSleepEntry(supabase, {
        lastNapTime: cleanLastNapTime,
        napDuration: String(numericDuration),
        mood: cleanMood,
      });

      if (!result.success) {
        setStatusMessage(result.error || t.saveError);
        setStatusType("error");
        return;
      }

      const createdEntry = result.entry;

      if (!createdEntry) {
        setStatusMessage(t.saveError);
        setStatusType("error");
        return;
      }

      setSleepEntries((prev) => [createdEntry, ...prev]);
      setForm({
        lastNapTime: "",
        napDuration: "",
        mood: locale === "fr" ? "Bon" : "Good",
      });
      setStatusMessage(t.savedSuccess);
      setStatusType("success");
    } catch (error) {
      console.error("Failed to save sleep entry:", error);
      setStatusMessage(t.saveError);
      setStatusType("error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSleepEntry(id: number) {
    setDeletingId(id);
    setStatusMessage("");
    setStatusType("");

    try {
      const supabase = getSupabase();
      const result = await deleteSleepEntry(supabase, id);

      if (!result.success) {
        setStatusMessage(result.error || t.deletingError);
        setStatusType("error");
        return;
      }

      setSleepEntries((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage(t.deletedSuccess);
      setStatusType("success");
    } catch (error) {
      console.error("Failed to delete sleep entry:", error);
      setStatusMessage(t.deletingError);
      setStatusType("error");
    } finally {
      setDeletingId(null);
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
        dateLabel={todayLabel || "..."}
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
              <span>{t.lastNapTime}</span>
              <input
                type="time"
                value={form.lastNapTime}
                onChange={(e) => updateField("lastNapTime", e.target.value)}
              />
            </label>

            <label>
              <span>{t.napDuration}</span>
              <input
                type="number"
                min="1"
                value={form.napDuration}
                onChange={(e) => updateField("napDuration", e.target.value)}
                placeholder="45"
              />
            </label>

            <label>
              <span>{t.mood}</span>
              <select
                value={form.mood}
                onChange={(e) => updateField("mood", e.target.value)}
              >
                <option value={t.excellent}>{t.excellent}</option>
                <option value={t.good}>{t.good}</option>
                <option value={t.light}>{t.light}</option>
                <option value={t.poor}>{t.poor}</option>
              </select>
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
            <h3>{t.recentEntries}</h3>
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
                <h3>{entry.lastNapTime}</h3>

                <p>
                  <strong>{t.durationLabel}:</strong> {entry.napDuration} min
                </p>
                <p>
                  <strong>{t.qualityLabel}:</strong> {entry.mood}
                </p>

                <div style={{ marginTop: "14px" }}>
                  <button
                    type="button"
                    className="neoDash__secondaryBtn"
                    onClick={() => handleDeleteSleepEntry(entry.id)}
                    disabled={deletingId === entry.id}
                  >
                    {deletingId === entry.id ? t.deleting : t.deleteEntry}
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