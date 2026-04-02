"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import {
  getProfile,
  upsertProfile,
  importLocalStorageToSupabase,
  getLocalProfile,
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
    loadingTitle: "Loading profile...",
    loadingText: "Your profile is securely stored in Supabase.",
    save: "Save profile",
    saving: "Saving...",
    saved: "Profile saved successfully.",
    saveError: "Save failed. Your data is still stored locally in this browser.",
    fields: {
      babyName: "Baby name",
      ageMonths: "Age (months)",
      bedtime: "Usual bedtime",
      mainConcern: "Main concern",
      notes: "Notes",
    },
    placeholders: {
      babyName: "e.g. Emma",
      ageMonths: "e.g. 8",
      bedtime: "e.g. 19:30",
      mainConcern: "e.g. Night wakings",
      notes: "Anything important to remember...",
    },
  },
  fr: {
    subtitle: "Enregistrez le profil principal de votre bebe et utilisez-le dans tout le systeme.",
    label: "Profil bebe",
    focusTitle: "Parametres du profil",
    focusText: "Nom, age, heure du coucher, besoin principal et notes utilises dans tout le systeme.",
    pageLabel: "Profil",
    pageTitle: "Le profil de votre bebe",
    pageText:
      "Ces informations aident Smart Baby System a personnaliser le sommeil, l'alimentation, les soins et les analyses du dashboard.",
    loadingTitle: "Chargement du profil...",
    loadingText: "Votre profil est stocke en toute securite dans Supabase.",
    save: "Enregistrer le profil",
    saving: "Enregistrement...",
    saved: "Profil enregistre avec succes.",
    saveError: "Echec de l'enregistrement. Vos donnees restent stockees localement dans ce navigateur.",
    fields: {
      babyName: "Nom du bebe",
      ageMonths: "Age (mois)",
      bedtime: "Heure habituelle du coucher",
      mainConcern: "Besoin principal",
      notes: "Notes",
    },
    placeholders: {
      babyName: "ex. Emma",
      ageMonths: "ex. 8",
      bedtime: "ex. 19:30",
      mainConcern: "ex. Reveils nocturnes",
      notes: "Tout ce qu'il faut retenir...",
    },
  },
} as const;

const emptyProfile: BabyProfile = {
  babyName: "",
  ageMonths: "",
  bedtime: "",
  mainConcern: "",
  notes: "",
};

function getTodayLabel(locale: Locale) {
  const format = locale === "fr" ? "fr-BE" : "en-GB";
  return new Date().toLocaleDateString(format, {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function ProfilePage() {
  const params = useParams<{ locale?: string }>();
  const rawLocale = typeof params?.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const supabase = useMemo(() => createSupabaseClient(), []);
  const [profile, setProfile] = useState<BabyProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [todayLabel, setTodayLabel] = useState("");

  useEffect(() => {
    setTodayLabel(getTodayLabel(locale));
  }, [locale]);

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      setLoading(true);
      setMessage("");

      try {
        setProfile(getLocalProfile());

        await Promise.race([
          (async () => {
            await importLocalStorageToSupabase(supabase);
            const loaded = await getProfile(supabase);

            if (!active) return;

            if (loaded) {
              setProfile(loaded);
            }
          })(),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Profile load timeout")), 6000)
          ),
        ]);
      } catch (error) {
        console.error("Profile page load error:", error);

        if (!active) return;
        setProfile(getLocalProfile());
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const result = await Promise.race([
        upsertProfile(supabase, profile),
        new Promise<{ success: false; error: string }>((resolve) =>
          setTimeout(() => resolve({ success: false, error: "Save timeout" }), 6000)
        ),
      ]);

      if (result.success) {
        setMessage(t.saved);
      } else {
        setMessage(t.saveError);
      }
    } catch (error) {
      console.error("Profile save error:", error);
      setMessage(t.saveError);
    } finally {
      setSaving(false);
    }
  }

  function updateField<K extends keyof BabyProfile>(key: K, value: BabyProfile[K]) {
    setProfile((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  if (loading) {
    return (
      <AppModuleLayout
        active="profile"
        title={t.pageTitle}
        subtitle={t.subtitle}
        label={t.label}
        currentFocusTitle={t.focusTitle}
        currentFocusText={t.focusText}
        dateLabel={todayLabel || "..."}
      >
        <section className="neoDash__panel">
          <div className="neoDash__card">
            <h3>{t.loadingTitle}</h3>
            <p>{t.loadingText}</p>
          </div>
        </section>
      </AppModuleLayout>
    );
  }

  return (
    <AppModuleLayout
      active="profile"
      title={t.pageTitle}
      subtitle={t.subtitle}
      label={t.label}
      currentFocusTitle={t.focusTitle}
      currentFocusText={t.focusText}
      dateLabel={todayLabel || "..."}
    >
      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, 0.85fr)",
        }}
      >
        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">{t.pageLabel}</p>
              <h3>{t.pageTitle}</h3>
              <p className="neoDash__panelText">{t.pageText}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="neoDash__form">
            <div
              className="neoDash__formGrid"
              style={{
                display: "grid",
                gap: "16px",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              }}
            >
              <label>
                <span>{t.fields.babyName}</span>
                <input
                  value={profile.babyName}
                  onChange={(e) => updateField("babyName", e.target.value)}
                  placeholder={t.placeholders.babyName}
                />
              </label>

              <label>
                <span>{t.fields.ageMonths}</span>
                <input
                  value={profile.ageMonths}
                  onChange={(e) => updateField("ageMonths", e.target.value)}
                  placeholder={t.placeholders.ageMonths}
                />
              </label>

              <label>
                <span>{t.fields.bedtime}</span>
                <input
                  value={profile.bedtime}
                  onChange={(e) => updateField("bedtime", e.target.value)}
                  placeholder={t.placeholders.bedtime}
                />
              </label>

              <label>
                <span>{t.fields.mainConcern}</span>
                <input
                  value={profile.mainConcern}
                  onChange={(e) => updateField("mainConcern", e.target.value)}
                  placeholder={t.placeholders.mainConcern}
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                <span>{t.fields.notes}</span>
                <textarea
                  rows={5}
                  value={profile.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder={t.placeholders.notes}
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
                type="submit"
                className="neoDash__primaryBtn"
                disabled={saving}
              >
                {saving ? t.saving : t.save}
              </button>

              {message ? <p style={{ fontSize: "14px", opacity: 0.8 }}>{message}</p> : null}
            </div>
          </form>
        </section>

        <aside className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">{t.focusTitle}</p>
              <h3>{t.focusTitle}</h3>
              <p className="neoDash__panelText">{t.focusText}</p>
            </div>
          </div>

          <div style={{ display: "grid", gap: "14px" }}>
            <div className="neoDash__card">
              <p className="neoDash__label">{t.fields.babyName}</p>
              <h3>{profile.babyName || "-"}</h3>
            </div>

            <div className="neoDash__card">
              <p className="neoDash__label">{t.fields.ageMonths}</p>
              <h3>{profile.ageMonths || "-"}</h3>
            </div>

            <div className="neoDash__card">
              <p className="neoDash__label">{t.fields.mainConcern}</p>
              <h3>{profile.mainConcern || "-"}</h3>
            </div>
          </div>
        </aside>
      </div>
    </AppModuleLayout>
  );
}