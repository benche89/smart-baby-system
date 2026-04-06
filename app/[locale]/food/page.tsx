"use client";

import { useEffect, useState } from "react";
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
    subtitle: "Track meals and reactions securely with Supabase-backed storage.",
    label: "Food tracking",
    focusTitle: "Food module",
    focusText:
      "Log meals, quantities and reactions to reveal stronger feeding patterns and smarter AI guidance.",

    pageLabel: "Food",
    pageTitle: "Food log",
    pageText:
      "Save each meal to build clearer nutrition insights and better dashboard recommendations.",

    mealTime: "Meal time",
    mealType: "Meal type",
    food: "Food",
    quantity: "Quantity",
    reaction: "Reaction",
    addEntry: "Add food entry",
    adding: "Saving...",
    loading: "Loading food data...",
    noEntries: "No food entries yet.",
    deleteEntry: "Delete",
    deleting: "Deleting...",
    deletingError: "Failed to delete food entry.",
    deletedSuccess: "Food entry deleted successfully.",
    saveError: "Failed to save food entry.",
    savedSuccess: "Food entry saved successfully.",
    validationError: "Please complete all fields before saving.",
    loadError: "Failed to load food data.",
    secureStorage: "Your food logs are stored securely in Supabase.",
    aiMedicalNote: "AI suggestions are not medical advice.",

    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    bottle: "Bottle",

    good: "Good",
    unsure: "Unsure",
    sensitive: "Sensitive",

    recentEntries: "Recent food entries",
    typeLabel: "Type",
    quantityLabel: "Quantity",
    reactionLabel: "Reaction",

    placeholders: {
      food: "e.g. Banana puree",
      quantity: "e.g. 120 ml / half bowl / 80 g",
    },
  },
  fr: {
    subtitle: "Suivez les repas et réactions avec un stockage sécurisé sur Supabase.",
    label: "Suivi alimentation",
    focusTitle: "Module alimentation",
    focusText:
      "Enregistrez les repas, quantités et réactions pour révéler de meilleurs schémas alimentaires et une guidance IA plus intelligente.",

    pageLabel: "Alimentation",
    pageTitle: "Journal alimentaire",
    pageText:
      "Enregistrez chaque repas pour construire des insights nutritionnels plus clairs et de meilleures recommandations dashboard.",

    mealTime: "Heure du repas",
    mealType: "Type de repas",
    food: "Aliment",
    quantity: "Quantité",
    reaction: "Réaction",
    addEntry: "Ajouter une entrée alimentation",
    adding: "Enregistrement...",
    loading: "Chargement des données alimentation...",
    noEntries: "Aucune entrée alimentation pour le moment.",
    deleteEntry: "Supprimer",
    deleting: "Suppression...",
    deletingError: "Impossible de supprimer l’entrée alimentation.",
    deletedSuccess: "Entrée alimentation supprimée avec succès.",
    saveError: "Impossible d’enregistrer l’entrée alimentation.",
    savedSuccess: "Entrée alimentation enregistrée avec succès.",
    validationError: "Veuillez compléter tous les champs avant d’enregistrer.",
    loadError: "Impossible de charger les données alimentation.",
    secureStorage: "Vos logs alimentation sont stockés en toute sécurité dans Supabase.",
    aiMedicalNote: "Les suggestions IA ne constituent pas un avis médical.",

    breakfast: "Petit-déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation",
    bottle: "Biberon",

    good: "Bonne",
    unsure: "Incertaine",
    sensitive: "Sensible",

    recentEntries: "Entrées alimentation récentes",
    typeLabel: "Type",
    quantityLabel: "Quantité",
    reactionLabel: "Réaction",

    placeholders: {
      food: "ex. Purée de banane",
      quantity: "ex. 120 ml / demi-bol / 80 g",
    },
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

export default function FoodPage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [todayLabel, setTodayLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  const [form, setForm] = useState({
    mealTime: "",
    mealType: locale === "fr" ? "Petit-déjeuner" : "Breakfast",
    food: "",
    quantity: "",
    reaction: locale === "fr" ? "Bonne" : "Good",
  });

  useEffect(() => {
    setTodayLabel(getTodayLabel(locale));
    setForm({
      mealTime: "",
      mealType: locale === "fr" ? "Petit-déjeuner" : "Breakfast",
      food: "",
      quantity: "",
      reaction: locale === "fr" ? "Bonne" : "Good",
    });
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    async function loadFoodData() {
      const supabase = getSupabase();

      setIsLoading(true);
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
  }, [locale, t.loadError]);

  function updateField(field: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleAddFoodEntry() {
    const cleanMealTime = form.mealTime.trim();
    const cleanMealType = form.mealType.trim();
    const cleanFood = form.food.trim();
    const cleanQuantity = form.quantity.trim();
    const cleanReaction = form.reaction.trim();

    if (!cleanMealTime || !cleanMealType || !cleanFood || !cleanQuantity || !cleanReaction) {
      setStatusMessage(t.validationError);
      setStatusType("error");
      return;
    }

    setIsSaving(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const supabase = getSupabase();

      const result = await addFoodEntry(supabase, {
        mealTime: cleanMealTime,
        mealType: cleanMealType,
        food: cleanFood,
        quantity: cleanQuantity,
        reaction: cleanReaction,
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

      setFoodEntries((prev) => [createdEntry, ...prev]);
      setForm({
        mealTime: "",
        mealType: locale === "fr" ? "Petit-déjeuner" : "Breakfast",
        food: "",
        quantity: "",
        reaction: locale === "fr" ? "Bonne" : "Good",
      });
      setStatusMessage(t.savedSuccess);
      setStatusType("success");
    } catch (error) {
      console.error("Failed to save food entry:", error);
      setStatusMessage(t.saveError);
      setStatusType("error");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteFoodEntry(id: number) {
    setDeletingId(id);
    setStatusMessage("");
    setStatusType("");

    try {
      const supabase = getSupabase();
      const result = await deleteFoodEntry(supabase, id);

      if (!result.success) {
        setStatusMessage(result.error || t.deletingError);
        setStatusType("error");
        return;
      }

      setFoodEntries((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage(t.deletedSuccess);
      setStatusType("success");
    } catch (error) {
      console.error("Failed to delete food entry:", error);
      setStatusMessage(t.deletingError);
      setStatusType("error");
    } finally {
      setDeletingId(null);
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
              <span>{t.mealTime}</span>
              <input
                type="time"
                value={form.mealTime}
                onChange={(e) => updateField("mealTime", e.target.value)}
              />
            </label>

            <label>
              <span>{t.mealType}</span>
              <select
                value={form.mealType}
                onChange={(e) => updateField("mealType", e.target.value)}
              >
                <option value={t.breakfast}>{t.breakfast}</option>
                <option value={t.lunch}>{t.lunch}</option>
                <option value={t.dinner}>{t.dinner}</option>
                <option value={t.snack}>{t.snack}</option>
                <option value={t.bottle}>{t.bottle}</option>
              </select>
            </label>

            <label>
              <span>{t.food}</span>
              <input
                type="text"
                value={form.food}
                onChange={(e) => updateField("food", e.target.value)}
                placeholder={t.placeholders.food}
              />
            </label>

            <label>
              <span>{t.quantity}</span>
              <input
                type="text"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                placeholder={t.placeholders.quantity}
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
            <h3>{t.recentEntries}</h3>
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
            {foodEntries.map((entry) => (
              <article key={entry.id} className="neoDash__card">
                <p className="neoDash__label">{t.pageLabel}</p>
                <h3>{entry.food}</h3>

                <p>
                  <strong>{t.mealTime}:</strong> {entry.mealTime}
                </p>
                <p>
                  <strong>{t.typeLabel}:</strong> {entry.mealType}
                </p>
                <p>
                  <strong>{t.quantityLabel}:</strong> {entry.quantity}
                </p>
                <p>
                  <strong>{t.reactionLabel}:</strong> {entry.reaction}
                </p>

                <div style={{ marginTop: "14px" }}>
                  <button
                    type="button"
                    className="neoDash__secondaryBtn"
                    onClick={() => handleDeleteFoodEntry(entry.id)}
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