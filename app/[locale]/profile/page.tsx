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

export default function ProfilePage() {
  const params = useParams<{ locale?: string }>();
  const locale = isValidLocale(params?.locale) ? (params!.locale as Locale) : defaultLocale;
  const t = copy[locale];

  const supabase = useMemo(() => createSupabaseClient(), []);
  const [profile, setProfile] = useState<BabyProfile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

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
    setProfile((prev) => {
      const next = { ...prev, [key]: value };
      return next;
    });
  }

  if (loading) {
    return (
      <AppModuleLayout
        locale={locale}
        title={t.pageTitle}
        subtitle={t.subtitle}
        badge={t.label}
      >
        <section className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{t.loadingTitle}</h2>
            <p className="text-sm text-slate-600">{t.loadingText}</p>
          </div>
        </section>
      </AppModuleLayout>
    );
  }

  return (
    <AppModuleLayout
      locale={locale}
      title={t.pageTitle}
      subtitle={t.subtitle}
      badge={t.label}
    >
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="mb-6 space-y-2">
            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
              {t.pageLabel}
            </span>
            <h1 className="text-2xl font-semibold text-slate-900">{t.pageTitle}</h1>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">{t.pageText}</p>
          </div>

          <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">{t.fields.babyName}</span>
              <input
                value={profile.babyName}
                onChange={(e) => updateField("babyName", e.target.value)}
                placeholder={t.placeholders.babyName}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">{t.fields.ageMonths}</span>
              <input
                value={profile.ageMonths}
                onChange={(e) => updateField("ageMonths", e.target.value)}
                placeholder={t.placeholders.ageMonths}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">{t.fields.bedtime}</span>
              <input
                value={profile.bedtime}
                onChange={(e) => updateField("bedtime", e.target.value)}
                placeholder={t.placeholders.bedtime}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-slate-700">{t.fields.mainConcern}</span>
              <input
                value={profile.mainConcern}
                onChange={(e) => updateField("mainConcern", e.target.value)}
                placeholder={t.placeholders.mainConcern}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400"
              />
            </label>

            <label className="grid gap-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">{t.fields.notes}</span>
              <textarea
                rows={5}
                value={profile.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder={t.placeholders.notes}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-sky-400"
              />
            </label>

            <div className="md:col-span-2 flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? t.saving : t.save}
              </button>

              {message ? (
                <p className="text-sm text-slate-600">{message}</p>
              ) : null}
            </div>
          </form>
        </section>

        <aside className="rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="space-y-3">
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-sm">
              {t.focusTitle}
            </span>
            <h2 className="text-xl font-semibold text-slate-900">{t.focusTitle}</h2>
            <p className="text-sm leading-6 text-slate-600">{t.focusText}</p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t.fields.babyName}</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{profile.babyName || "-"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t.fields.ageMonths}</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{profile.ageMonths || "-"}</p>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t.fields.mainConcern}</p>
              <p className="mt-1 text-sm font-medium text-slate-800">{profile.mainConcern || "-"}</p>
            </div>
          </div>
        </aside>
      </div>
    </AppModuleLayout>
  );
}