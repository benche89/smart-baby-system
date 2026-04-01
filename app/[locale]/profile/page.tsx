"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import {
  getProfile,
  upsertProfile,
  importLocalStorageToSupabase,
  type BabyProfile,
} from "../../../lib/supabase/app-data";

type Locale = "en" | "fr";

const copy = {
  en: {
    subtitle: "Save your baby's core profile securely and use it across the full system.",
    label: "Baby profile",
    focusTitle: "Profile settings",
    focusText: "Name, age, bedtime, main concern and notes used across AI guidance.",

    pageLabel: "Profile",
    pageTitle: "Your baby profile",
    pageText:
      "This information helps Smart Baby System personalize sleep, food, care and dashboard insights.",

    babyName: "Baby name",
    babyNamePlaceholder: "e.g. Emma",
    ageMonths: "Age in months",
    ageMonthsPlaceholder: "e.g. 8",
    bedtime: "Usual bedtime",
    bedtimePlaceholder: "e.g. 19:30",
    mainConcern: "Main concern",
    mainConcernPlaceholder: "e.g. short naps, feeding rhythm, evening routine",
    notes: "Parent notes",
    notesPlaceholder:
      "Add useful context about routines, sensitivities, preferences or anything important.",
    saveProfile: "Save profile",
    saving: "Saving...",
    loading: "Loading profile...",
    secureStorage: "Your profile is stored securely in Supabase.",
    savedSuccess: "Profile saved successfully.",
    saveError: "Something went wrong while saving the profile.",
    loadError: "Failed to load profile data.",
    aiMedicalNote: "AI suggestions are not medical advice.",
  },
  fr: {
    subtitle:
      "Enregistrez le profil principal de votre bébé en toute sécurité et utilisez-le dans tout le système.",
    label: "Profil bébé",
    focusTitle: "Paramètres du profil",
    focusText:
      "Nom, âge, heure du coucher, préoccupation principale et notes utilisées dans toute la guidance IA.",

    pageLabel: "Profil",
    pageTitle: "Le profil de votre bébé",
    pageText:
      "Ces informations aident Smart Baby System à personnaliser les insights sommeil, alimentation, soins et dashboard.",

    babyName: "Nom du bébé",
    babyNamePlaceholder: "ex. Emma",
    ageMonths: "Âge en mois",
    ageMonthsPlaceholder: "ex. 8",
    bedtime: "Heure habituelle du coucher",
    bedtimePlaceholder: "ex. 19:30",
    mainConcern: "Préoccupation principale",
    mainConcernPlaceholder: "ex. siestes courtes, rythme des repas, routine du soir",
    notes: "Notes parentales",
    notesPlaceholder:
      "Ajoutez un contexte utile sur les routines, sensibilités, préférences ou tout autre élément important.",
    saveProfile: "Enregistrer le profil",
    saving: "Enregistrement...",
    loading: "Chargement du profil...",
    secureStorage: "Votre profil est stocké en toute sécurité dans Supabase.",
    savedSuccess: "Profil enregistré avec succès.",
    saveError: "Une erreur s’est produite pendant l’enregistrement du profil.",
    loadError: "Impossible de charger les données du profil.",
    aiMedicalNote: "Les suggestions IA ne constituent pas un avis médical.",
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

export default function ProfilePage() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [form, setForm] = useState({
    babyName: "",
    ageMonths: "",
    bedtime: "",
    mainConcern: "",
    notes: "",
  });

  const [todayLabel, setTodayLabel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusType, setStatusType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    let isMounted = true;

    async function loadProfileData() {
      const supabase = getSupabase();

      setIsLoading(true);
      setTodayLabel(getTodayLabel(locale));
      setStatusMessage("");
      setStatusType("");

      try {
        await importLocalStorageToSupabase(supabase);

        const dbProfile = await getProfile(supabase);

        if (!isMounted) return;

        if (dbProfile) {
          setForm({
            babyName: dbProfile.babyName ?? "",
            ageMonths: dbProfile.ageMonths ?? "",
            bedtime: dbProfile.bedtime ?? "",
            mainConcern: dbProfile.mainConcern ?? "",
            notes: dbProfile.notes ?? "",
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
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

    loadProfileData();

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

  async function handleSaveProfile() {
    setIsSaving(true);
    setStatusMessage("");
    setStatusType("");

    try {
      const supabase = getSupabase();

      const existing = await getProfile(supabase);

      const payload: BabyProfile = {
        babyName: form.babyName.trim(),
        ageMonths: form.ageMonths.trim(),
        bedtime: form.bedtime.trim(),
        mainConcern: form.mainConcern.trim(),
        notes: form.notes.trim(),
        planTier: existing?.planTier ?? "basic",
      };

      await upsertProfile(supabase, payload);

      setStatusMessage(t.savedSuccess);
      setStatusType("success");
    } catch (error) {
      console.error("Failed to save profile:", error);
      setStatusMessage(t.saveError);
      setStatusType("error");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <AppModuleLayout
        active="profile"
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
      active="profile"
      title={form.babyName || "Smart Baby System"}
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
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <label>
              <span>{t.babyName}</span>
              <input
                type="text"
                value={form.babyName}
                onChange={(e) => updateField("babyName", e.target.value)}
                placeholder={t.babyNamePlaceholder}
              />
            </label>

            <label>
              <span>{t.ageMonths}</span>
              <input
                type="number"
                min="0"
                value={form.ageMonths}
                onChange={(e) => updateField("ageMonths", e.target.value)}
                placeholder={t.ageMonthsPlaceholder}
              />
            </label>

            <label>
              <span>{t.bedtime}</span>
              <input
                type="time"
                value={form.bedtime}
                onChange={(e) => updateField("bedtime", e.target.value)}
                placeholder={t.bedtimePlaceholder}
              />
            </label>

            <label>
              <span>{t.mainConcern}</span>
              <input
                type="text"
                value={form.mainConcern}
                onChange={(e) => updateField("mainConcern", e.target.value)}
                placeholder={t.mainConcernPlaceholder}
              />
            </label>

            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.notes}</span>
              <textarea
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={6}
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
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? t.saving : t.saveProfile}
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
        <p style={{ fontSize: "12px", opacity: 0.6 }}>{t.aiMedicalNote}</p>
      </section>
    </AppModuleLayout>
  );
}