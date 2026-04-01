"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import {
  getFoodEntries,
  addFoodEntry,
  deleteFoodEntry,
  importLocalStorageToSupabase,
  type FoodEntry,
} from "../../../lib/supabase/app-data";

type Locale = "en" | "fr";

const copy = {
  en: {
    subtitle: "Track meals, quantities and reactions securely with Supabase-backed storage.",
    label: "Food tracking",
    focusTitle: "Food module",
    focusText: "Log meals and reactions to reveal patterns and support calmer feeding decisions.",

    pageLabel: "Food",
    pageTitle: "Food log",
    pageText:
      "Save each meal to build stronger feeding insights and smarter dashboard guidance.",

    time: "Meal time",
    type: "Meal type",
    amount: "Amount",
    reaction: "Reaction",
    food: "Food",
    notes: "Notes",
    foodPlaceholder: "e.g. banana puree",
    amountPlaceholder: "e.g. 120 ml / half bowl / small portion",
    notesPlaceholder:
      "Add useful context, for example: Food: banana puree | Reaction: Good | Notes: finished calmly",
    addEntry: "Add food entry",
    adding: "Saving...",
    loading: "Loading food data...",
    noEntries: "No food entries yet.",
    deleteEntry: "Delete",
    deletingError: "Failed to delete food entry.",
    saveError: "Failed to save food entry.",
    loadError: "Failed to load food data.",
    secureStorage: "Your food logs are stored securely in Supabase.",
    aiMedicalNote: "AI suggestions are not medical advice.",

    bottle: "Bottle",
    puree: "Puree",
    solids: "Solids",
    snack: "Snack",
    breastmilk: "Breastmilk",

    good: "Good",
    unsure: "Unsure",
    sensitive: "Sensitive",

    lastEntries: "Recent food entries",
    typeLabel: "Type",
    amountLabel: "Amount",
    savedAt: "Saved",
    mealSummary: "Meal summary",
  },
  fr: {
    subtitle:
      "Suivez les repas, quantités et réactions avec un stockage sécurisé sur Supabase.",
    label: "Suivi alimentation",
    focusTitle: "Module alimentation",
    focusText:
      "Enregistrez les repas et réactions pour révéler des schémas et soutenir des décisions plus calmes autour de l’alimentation.",

    pageLabel: "Alimentation",
    pageTitle: "Journal alimentaire",
    pageText:
      "Enregistrez chaque repas pour créer de meilleurs insights alimentaires et une guidance dashboard plus intelligente.",

    time: "Heure du repas",
    type: "Type de repas",
    amount: "Quantité",
    reaction: "Réaction",
    food: "Aliment",
    notes: "Notes",
    foodPlaceholder: "ex. purée de banane",
    amountPlaceholder: "ex. 120 ml / demi-bol / petite portion",
    notesPlaceholder:
      "Ajoutez un contexte utile, par exemple : Food: purée de banane | Reaction: Bonne | Notes: terminé calmement",
    addEntry: "Ajouter une entrée alimentation",
    adding: "Enregistrement...",
    loading: "Chargement des données alimentation...",
    noEntries: "Aucune entrée alimentation pour le moment.",
    deleteEntry: "Supprimer",
    deletingError: "Impossible de supprimer l’entrée alimentation.",
    saveError: "Impossible d’enregistrer l’entrée alimentation.",
    loadError: "Impossible de charger les données alimentation.",
    secureStorage: "Vos logs alimentation sont stockés en toute sécurité dans Supabase.",
    aiMedicalNote: "Les suggestions IA ne constituent pas un avis médical.",

    bottle: "Biberon",
    puree: "Purée",
    solids: "Solides",
    snack: "Collation",
    breastmilk: "Lait maternel",

    good: "Bonne",
    unsure: "Incertaine",
    sensitive: "Sensible",

    lastEntries: "Entrées alimentation récentes",
    typeLabel: "Type",
    amountLabel: "Quantité",
    savedAt: "Enregistré",
    mealSummary: "Résumé du repas",
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

function buildFoodNote(food: string, reaction: string, notes: string) {
  const parts = [`Food: ${food}`, `Reaction: ${reaction}`];
  if (notes.trim()) {
    parts.push(`Notes: ${notes.trim()}`);
  }
  return parts.join(" | ");
}

function parseFoodNote(note: string) {
  const foodMatch = note.match(/Food:\s*([^|]+)/i);
  const reactionMatch = note.match(/Reaction:\s*([^|]+)/i);
  const notesMatch = note.match(/Notes:\s*(.+)$/i);

  return {
    food: foodMatch ? foodMatch[1].trim() : "",
    reaction: reactionMatch ? reactionMatch[1].trim() : "",
    notes: notesMatch ? notesMatch[1].trim() : "",
  };
}

export default function FoodPage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const supabase = useMemo(() => createSupabaseClient(), []);

  const [todayLabel, setTodayLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const [form, setForm] = useState({
    time: "",
    type: locale === "fr" ? "Biberon" : "Bottle",
    amount: "",
    food: "",
    reaction: locale === "fr" ? "Bonne" : "Good",
    notes: "",
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      type: locale === "fr" ? "Biberon" : "Bottle",
      reaction: locale === "fr" ? "Bonne" : "Good",
    }));
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    async function loadFoodData() {
      setIsLoading(true);
      setTodayLabel(getTodayLabel(locale));
      setStatusMessage("");
      setStatusType("");

      try {
        await importLocalStorageToSupabase(supabase);

        const rows = await getFoodEntries(supabase);

        if (!isMounted) return;
        setFoodEntries(rows);
      } catch (error) {
        console.error("Failed to load food entries:", error);
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

    loadFoodData();

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

  async function handleAddFoodEntry() {
    if (!form.time || !form.type || !form.amount || !form.food || !form.reaction) {
      setStatusMessage(t.saveError);
      setStatusType("error");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const saved = await addFoodEntry(supabase, {
        time: form.time.trim(),
        type: form.type.trim(),
        amount: form.amount.trim(),
        note: buildFoodNote(form.food.trim(), form.reaction.trim(), form.notes.trim()),
        createdAt: new Date().toISOString(),
      });

      setFoodEntries((prev) => [saved, ...prev]);
      setForm({
        time: "",
        type: locale === "fr" ? "Biberon" : "Bottle",
        amount: "",
        food: "",
        reaction: locale === "fr" ? "Bonne" : "Good",
        notes: "",
      });
    } catch (error) {
      console.error("Failed to save food entry:", error);
      setStatusMessage(t.saveError);
      setStatusType("error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteFoodEntry(id: number) {
    try {
      await deleteFoodEntry(supabase, id);
      setFoodEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete food entry:", error);
      setStatusMessage(t.deletingError);
      setStatusType("error");
    }
  }

  if (isLoading) {
    return (
      <AppModuleLayout
        active="food"
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
      active="food"
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
              <span>{t.type}</span>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
              >
                <option value={t.bottle}>{t.bottle}</option>
                <option value={t.puree}>{t.puree}</option>
                <option value={t.solids}>{t.solids}</option>
                <option value={t.snack}>{t.snack}</option>
                <option value={t.breastmilk}>{t.breastmilk}</option>
              </select>
            </label>

            <label>
              <span>{t.amount}</span>
              <input
                type="text"
                value={form.amount}
                onChange={(e) => updateField("amount", e.target.value)}
                placeholder={t.amountPlaceholder}
              />
            </label>

            <label>
              <span>{t.food}</span>
              <input
                type="text"
                value={form.food}
                onChange={(e) => updateField("food", e.target.value)}
                placeholder={t.foodPlaceholder}
              />
            </label>

            <label>
              <span>{t.reaction}</span>
              <select
                value={form.reaction}
                onChange={(e) => updateField("reaction", e.target.value)}
              >
                <option value={t.good}>{t.good}</option>
                <option value={t.unsure}>{t.unsure}</option>
                <option value={t.sensitive}>{t.sensitive}</option>
              </select>
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.notes}</span>
              <textarea
                rows={5}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t.notesPlaceholder}
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
              onClick={handleAddFoodEntry}
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

        {foodEntries.length === 0 ? (
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
            {foodEntries.map((entry) => {
              const parsed = parseFoodNote(entry.note);

              return (
                <article key={entry.id} className="neoDash__card">
                  <p className="neoDash__label">{t.pageLabel}</p>
                  <h3>{parsed.food || t.mealSummary}</h3>

                  <p>
                    <strong>{t.typeLabel}:</strong> {entry.type}
                  </p>
                  <p>
                    <strong>{t.amountLabel}:</strong> {entry.amount}
                  </p>
                  <p>
                    <strong>{t.reaction}:</strong> {parsed.reaction || "-"}
                  </p>

                  {parsed.notes ? <p style={{ marginTop: "10px" }}>{parsed.notes}</p> : null}

                  <p style={{ marginTop: "12px", fontSize: "12px", opacity: 0.65 }}>
                    {t.savedAt}: {formatSavedDate(entry.createdAt, locale)}
                  </p>

                  <div style={{ marginTop: "14px" }}>
                    <button
                      type="button"
                      className="neoDash__secondaryBtn"
                      onClick={() => handleDeleteFoodEntry(entry.id)}
                    >
                      {t.deleteEntry}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="neoDash__panel" style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>{t.aiMedicalNote}</p>
      </section>
    </AppModuleLayout>
  );
}