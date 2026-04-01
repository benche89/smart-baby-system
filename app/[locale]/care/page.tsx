"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import {
  getCareEntries,
  addCareEntry,
  deleteCareEntry,
  importLocalStorageToSupabase,
  type CareEntry,
} from "../../../lib/supabase/app-data";

type Locale = "en" | "fr";

const copy = {
  en: {
    subtitle: "Track care routines securely with Supabase-backed storage.",
    label: "Care tracking",
    focusTitle: "Care module",
    focusText: "Log daily care moments to reveal routine consistency and support calmer parenting decisions.",

    pageLabel: "Care",
    pageTitle: "Care log",
    pageText:
      "Save each care action to build stronger routine insights and smarter dashboard guidance.",

    time: "Time",
    careType: "Care type",
    status: "Status",
    note: "Notes",
    notePlaceholder:
      "Add useful context about this care moment, for example diaper change, bath routine, mood or difficulty.",
    addEntry: "Add care entry",
    adding: "Saving...",
    loading: "Loading care data...",
    noEntries: "No care entries yet.",
    deleteEntry: "Delete",
    deletingError: "Failed to delete care entry.",
    saveError: "Failed to save care entry.",
    loadError: "Failed to load care data.",
    secureStorage: "Your care logs are stored securely in Supabase.",
    aiMedicalNote: "AI suggestions are not medical advice.",

    diaper: "Diaper change",
    bath: "Bath",
    skincare: "Skincare",
    medicine: "Medicine",
    hygiene: "Hygiene",
    comfort: "Comfort routine",

    completed: "Completed",
    partial: "Partial",
    difficult: "Difficult",

    lastEntries: "Recent care entries",
    typeLabel: "Type",
    statusLabel: "Status",
    savedAt: "Saved",
  },
  fr: {
    subtitle: "Suivez les routines de soins avec un stockage sécurisé sur Supabase.",
    label: "Suivi soins",
    focusTitle: "Module soins",
    focusText:
      "Enregistrez les moments de soins quotidiens pour révéler la cohérence de la routine et soutenir des décisions parentales plus calmes.",

    pageLabel: "Soins",
    pageTitle: "Journal des soins",
    pageText:
      "Enregistrez chaque action de soin pour créer de meilleurs insights de routine et une guidance dashboard plus intelligente.",

    time: "Heure",
    careType: "Type de soin",
    status: "Statut",
    note: "Notes",
    notePlaceholder:
      "Ajoutez un contexte utile sur ce moment de soin, par exemple changement de couche, bain, humeur ou difficulté.",
    addEntry: "Ajouter une entrée soins",
    adding: "Enregistrement...",
    loading: "Chargement des données soins...",
    noEntries: "Aucune entrée soins pour le moment.",
    deleteEntry: "Supprimer",
    deletingError: "Impossible de supprimer l’entrée soins.",
    saveError: "Impossible d’enregistrer l’entrée soins.",
    loadError: "Impossible de charger les données soins.",
    secureStorage: "Vos logs soins sont stockés en toute sécurité dans Supabase.",
    aiMedicalNote: "Les suggestions IA ne constituent pas un avis médical.",

    diaper: "Changement de couche",
    bath: "Bain",
    skincare: "Soin de la peau",
    medicine: "Médicament",
    hygiene: "Hygiène",
    comfort: "Routine de réconfort",

    completed: "Terminé",
    partial: "Partiel",
    difficult: "Difficile",

    lastEntries: "Entrées soins récentes",
    typeLabel: "Type",
    statusLabel: "Statut",
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

export default function CarePage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const supabase = useMemo(() => createSupabaseClient(), []);

  const [todayLabel, setTodayLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [careEntries, setCareEntries] = useState<CareEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const [form, setForm] = useState({
    time: "",
    careType: locale === "fr" ? "Changement de couche" : "Diaper change",
    status: locale === "fr" ? "Terminé" : "Completed",
    note: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      careType: locale === "fr" ? "Changement de couche" : "Diaper change",
      status: locale === "fr" ? "Terminé" : "Completed",
    }));
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    async function loadCareData() {
      setIsLoading(true);
      setTodayLabel(getTodayLabel(locale));
      setStatusMessage("");
      setStatusType("");

      try {
        await importLocalStorageToSupabase(supabase);

        const rows = await getCareEntries(supabase);

        if (!isMounted) return;
        setCareEntries(rows);
      } catch (error) {
        console.error("Failed to load care entries:", error);
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

    loadCareData();

    return () => {
      isMounted = false;
    };
  }, [locale, supabase, t.loadError]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleAddCareEntry() {
    if (!form.time || !form.careType || !form.status) {
      setStatusMessage(t.saveError);
      setStatusType("error");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const saved = await addCareEntry(supabase, {
        time: form.time.trim(),
        careType: form.careType.trim(),
        status: form.status.trim(),
        note: form.note.trim(),
        createdAt: new Date().toISOString(),
      });

      setCareEntries((prev) => [saved, ...prev]);
      setForm({
        time: "",
        careType: locale === "fr" ? "Changement de couche" : "Diaper change",
        status: locale === "fr" ? "Terminé" : "Completed",
        note: "",
      });
    } catch (error) {
      console.error("Failed to save care entry:", error);
      setStatusMessage(t.saveError);
      setStatusType("error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteCareEntry(id: number) {
    try {
      await deleteCareEntry(supabase, id);
      setCareEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete care entry:", error);
      setStatusMessage(t.deletingError);
      setStatusType("error");
    }
  }

  if (isLoading) {
    return (
      <AppModuleLayout
        active="care"
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
      active="care"
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
              <span>{t.time}</span>
              <input
                type="time"
                value={form.time}
                onChange={(e) => updateField("time", e.target.value)}
              />
            </label>

            <label>
              <span>{t.careType}</span>
              <select
                value={form.careType}
                onChange={(e) => updateField("careType", e.target.value)}
              >
                <option value={t.diaper}>{t.diaper}</option>
                <option value={t.bath}>{t.bath}</option>
                <option value={t.skincare}>{t.skincare}</option>
                <option value={t.medicine}>{t.medicine}</option>
                <option value={t.hygiene}>{t.hygiene}</option>
                <option value={t.comfort}>{t.comfort}</option>
              </select>
            </label>

            <label>
              <span>{t.status}</span>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option value={t.completed}>{t.completed}</option>
                <option value={t.partial}>{t.partial}</option>
                <option value={t.difficult}>{t.difficult}</option>
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
              onClick={handleAddCareEntry}
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

        {careEntries.length === 0 ? (
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
            {careEntries.map((entry) => (
              <article key={entry.id} className="neoDash__card">
                <p className="neoDash__label">{t.pageLabel}</p>
                <h3>{entry.careType}</h3>

                <p>
                  <strong>{t.statusLabel}:</strong> {entry.status}
                </p>
                <p>
                  <strong>{t.typeLabel}:</strong> {entry.careType}
                </p>

                {entry.note ? <p style={{ marginTop: "10px" }}>{entry.note}</p> : null}

                <p style={{ marginTop: "12px", fontSize: "12px", opacity: 0.65 }}>
                  {t.savedAt}: {formatSavedDate(entry.createdAt, locale)}
                </p>

                <div style={{ marginTop: "14px" }}>
                  <button
                    type="button"
                    className="neoDash__secondaryBtn"
                    onClick={() => handleDeleteCareEntry(entry.id)}
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