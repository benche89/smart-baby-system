"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AppModuleLayout from "../../../components/AppModuleLayout";
import { defaultLocale, isValidLocale } from "../../../lib/i18n";
import { createClient as createSupabaseClient } from "../../../lib/supabase/client";
import {
  getProfile,
  getSleepEntries,
  getFoodEntries,
  getCareEntries,
  getPlanTier,
  importLocalStorageToSupabase,
  updatePlanTier,
  type BabyProfile,
  type SleepEntry,
  type FoodEntry,
  type CareEntry,
  type PlanTier,
} from "../../../lib/supabase/app-data";

type Locale = "en" | "fr";

const copy = {
  en: {
    subtitle: "One premium view for sleep, food, care and AI-guided daily clarity.",
    label: "Unified overview",
    focusTitle: "Main dashboard",
    focusText: "Overview, AI guidance and quick access to every module.",

    subscription: "Subscription",
    currentPlan: "Your current plan",
    currentPlanText: "Choose a plan to unlock more value across the full ecosystem.",
    basicDesc: "Essential access and short AI guidance.",
    premiumDesc: "Unlock full AI action plans across modules.",
    eliteDesc: "Full plans plus deeper advanced AI insights.",
    selected: "Selected",
    chooseBasic: "Choose Basic",
    choosePremium: "Choose Premium",
    chooseElite: "Choose Elite",

    mainOverview: "Main overview",
    dailySystem: "daily system at a glance",
    currentlyOn: "is currently on the",
    plan: "plan",
    totalLogs: "total logs across sleep, food and care",
    bedtime: "Bedtime",
    mainConcern: "Main concern",
    babyAge: "Baby age",
    months: "months",

    dailyHealthScore: "Daily health score",
    combinedScore: "Combined score from sleep, food and care consistency.",

    centralAi: "Central AI Assistant",
    basedOnQuestion:
      "Based on your question, the unified dashboard adapted today's guidance using real module data.",
    yourQuestion: "Your question",
    upgradePremium: "Upgrade to Premium",
    unlockFullPlan: "Unlock the full AI action plan for this question.",
    aiActionPlan: "AI action plan",
    upgradeElite: "Upgrade to Elite",
    unlockElite: "Unlock advanced AI insights across the full system.",
    eliteInsights: "Elite insights",

    askAiFromDashboard: "Ask AI from dashboard",
    refineContext: "Refine today's context",
    askAiText: "Ask about sleep, food or care to adapt the whole system.",
    yourQuestionInput: "Your question",
    askAiPlaceholder: "e.g. Why is my baby not sleeping well?",
    askAi: "Ask AI",

    sleepScore: "Sleep score",
    foodScore: "Food score",
    careScore: "Care score",

    sleepModule: "Sleep module",
    foodModule: "Food module",
    careModule: "Care module",
    rhythm: "Rhythm",
    reactionSignal: "Reaction signal",
    consistency: "Consistency",
    openSleep: "Open Sleep →",
    openFood: "Open Food →",
    openCare: "Open Care →",

    profileSummary: "Profile summary",
    currentProfileContext: "Current profile context",
    parentNotes: "Parent notes",
    savedContext: "Saved context",

    noProfileName: "Your baby",
    notSet: "Not set",
    noNotes: "No extra notes added yet.",

    aiAskSomething: "Ask something to unlock AI guidance",
    aiAskMessage:
      "Ask about sleep, food or care and the dashboard will adapt today's guidance using your real logs.",

    sleepDataBuilding: "Sleep data is still building",
    sleepDataBuildingText: "Add recent naps to unlock stronger sleep predictions.",
    noRhythm: "No rhythm detected yet",
    nextLikelySleep: "Next likely sleep around",
    sleepPredicted: "Predicted from recent nap history and age-based wake windows.",
    stable: "Stable",
    slightlyVaried: "Slightly varied",
    irregular: "Irregular",

    foodDataBuilding: "Food data is still building",
    foodDataBuildingText: "Add meals and reactions to unlock clearer feeding patterns.",
    noDataYet: "No data yet",
    mostlyPositive: "Mostly positive",
    sensitivityDetected: "Sensitivity pattern detected",
    mixedReactions: "Mixed reactions",
    mealRhythmClearer: "Meal rhythm is becoming clearer",
    foodTrendText: "Recent food logs help reveal consistency and reaction trends.",

    careDataBuilding: "Care data is still building",
    careDataBuildingText: "Add care actions to reveal routine consistency.",
    mostlyConsistent: "Mostly consistent",
    repeatedDifficulty: "Repeated difficulty detected",
    mixedConsistency: "Mixed consistency",
    routineConsistencyClearer: "Routine consistency is getting clearer",
    careTrendText: "Recent care logs show how stable daily routines feel.",

    sleepGuidance: "Sleep guidance based on real logs",
    foodGuidance: "Food guidance based on real logs",
    careGuidance: "Care guidance based on real logs",
    smartGuidance: "Smart guidance based on your real dashboard data",

    noSleepLogs: "There are no saved sleep logs yet, so the advice is still general.",
    noFoodLogs: "There are no saved food logs yet, so the advice is still general.",
    noCareLogs: "There are no saved care logs yet, so the advice is still general.",

    sleepWeak: "Recent sleep quality looks weak, so overtiredness may be building.",
    sleepLight: "Recent naps look light, which can make rhythm less restorative.",
    sleepShort: "Average naps are shorter than ideal for stability today.",
    sleepUsable: "Recent sleep data looks fairly usable and rhythm appears more stable.",

    foodSensitive: "Recent logs show repeated sensitive reactions.",
    foodMixed: "Recent reactions look mixed or unclear.",
    foodStable: "Recent food data looks calmer and more stable.",

    careDifficult: "Recent care logs show repeated difficult routine moments.",
    careMixed: "Recent care consistency looks mixed.",
    careStable: "Recent care logs look mostly stable.",

    usingRealData:
      "The system is using real module data to guide today's decisions.",
  },
  fr: {
    subtitle:
      "Une vue premium unifiée pour le sommeil, l’alimentation, les soins et une clarté guidée par l’IA.",
    label: "Vue unifiée",
    focusTitle: "Tableau principal",
    focusText: "Aperçu, guidance IA et accès rapide à chaque module.",

    subscription: "Abonnement",
    currentPlan: "Votre formule actuelle",
    currentPlanText: "Choisissez une formule pour débloquer plus de valeur dans tout l’écosystème.",
    basicDesc: "Accès essentiel et guidance IA courte.",
    premiumDesc: "Débloquez des plans d’action IA complets sur tous les modules.",
    eliteDesc: "Plans complets plus insights IA avancés.",
    selected: "Sélectionné",
    chooseBasic: "Choisir Basic",
    choosePremium: "Choisir Premium",
    chooseElite: "Choisir Elite",

    mainOverview: "Vue principale",
    dailySystem: "système quotidien en un coup d’œil",
    currentlyOn: "est actuellement sur la formule",
    plan: "",
    totalLogs: "logs au total sur le sommeil, l’alimentation et les soins",
    bedtime: "Heure du coucher",
    mainConcern: "Préoccupation principale",
    babyAge: "Âge du bébé",
    months: "mois",

    dailyHealthScore: "Score santé du jour",
    combinedScore: "Score combiné du sommeil, de l’alimentation et de la cohérence des soins.",

    centralAi: "Assistant IA central",
    basedOnQuestion:
      "En fonction de votre question, le tableau de bord unifié a adapté la guidance du jour à partir des données réelles des modules.",
    yourQuestion: "Votre question",
    upgradePremium: "Passez à Premium",
    unlockFullPlan: "Débloquez le plan d’action IA complet pour cette question.",
    aiActionPlan: "Plan d’action IA",
    upgradeElite: "Passez à Elite",
    unlockElite: "Débloquez des insights IA avancés sur tout le système.",
    eliteInsights: "Insights Elite",

    askAiFromDashboard: "Demander à l’IA depuis le dashboard",
    refineContext: "Affinez le contexte du jour",
    askAiText:
      "Posez une question sur le sommeil, l’alimentation ou les soins pour adapter tout le système.",
    yourQuestionInput: "Votre question",
    askAiPlaceholder: "ex. Pourquoi mon bébé dort-il mal ?",
    askAi: "Demander à l’IA",

    sleepScore: "Score sommeil",
    foodScore: "Score alimentation",
    careScore: "Score soins",

    sleepModule: "Module sommeil",
    foodModule: "Module alimentation",
    careModule: "Module soins",
    rhythm: "Rythme",
    reactionSignal: "Signal de réaction",
    consistency: "Cohérence",
    openSleep: "Ouvrir Sommeil →",
    openFood: "Ouvrir Alimentation →",
    openCare: "Ouvrir Soins →",

    profileSummary: "Résumé du profil",
    currentProfileContext: "Contexte actuel du profil",
    parentNotes: "Notes parentales",
    savedContext: "Contexte enregistré",

    noProfileName: "Votre bébé",
    notSet: "Non défini",
    noNotes: "Aucune note supplémentaire enregistrée.",

    aiAskSomething: "Posez une question pour débloquer la guidance IA",
    aiAskMessage:
      "Posez une question sur le sommeil, l’alimentation ou les soins et le dashboard adaptera la guidance du jour à partir de vos vrais logs.",

    sleepDataBuilding: "Les données sommeil sont encore en cours de construction",
    sleepDataBuildingText:
      "Ajoutez des siestes récentes pour débloquer de meilleures prédictions sommeil.",
    noRhythm: "Aucun rythme détecté pour le moment",
    nextLikelySleep: "Prochain sommeil probable vers",
    sleepPredicted:
      "Prévu à partir de l’historique récent des siestes et des fenêtres d’éveil selon l’âge.",
    stable: "Stable",
    slightlyVaried: "Légèrement variable",
    irregular: "Irrégulier",

    foodDataBuilding: "Les données alimentation sont encore en cours de construction",
    foodDataBuildingText:
      "Ajoutez des repas et des réactions pour débloquer des tendances alimentaires plus claires.",
    noDataYet: "Pas encore de données",
    mostlyPositive: "Globalement positif",
    sensitivityDetected: "Sensibilité détectée",
    mixedReactions: "Réactions mixtes",
    mealRhythmClearer: "Le rythme des repas devient plus clair",
    foodTrendText:
      "Les logs récents aident à révéler la cohérence et les tendances de réaction.",

    careDataBuilding: "Les données soins sont encore en cours de construction",
    careDataBuildingText:
      "Ajoutez des actions de soin pour révéler la cohérence de la routine.",
    mostlyConsistent: "Globalement cohérent",
    repeatedDifficulty: "Difficulté répétée détectée",
    mixedConsistency: "Cohérence mixte",
    routineConsistencyClearer: "La cohérence de la routine devient plus claire",
    careTrendText:
      "Les logs récents montrent à quel point les routines quotidiennes sont stables.",

    sleepGuidance: "Guidance sommeil basée sur les vrais logs",
    foodGuidance: "Guidance alimentation basée sur les vrais logs",
    careGuidance: "Guidance soins basée sur les vrais logs",
    smartGuidance: "Guidance intelligente basée sur vos vraies données dashboard",

    noSleepLogs:
      "Aucun log sommeil enregistré pour le moment, donc le conseil reste général.",
    noFoodLogs:
      "Aucun log alimentation enregistré pour le moment, donc le conseil reste général.",
    noCareLogs:
      "Aucun log soins enregistré pour le moment, donc le conseil reste général.",

    sleepWeak:
      "La qualité récente du sommeil semble faible, la fatigue pourrait augmenter.",
    sleepLight:
      "Les siestes récentes semblent légères, ce qui peut rendre le rythme moins réparateur.",
    sleepShort:
      "Les siestes moyennes sont plus courtes que l’idéal pour la stabilité aujourd’hui.",
    sleepUsable:
      "Les données récentes du sommeil semblent plutôt utilisables et le rythme paraît plus stable.",

    foodSensitive: "Les logs récents montrent des réactions sensibles répétées.",
    foodMixed: "Les réactions récentes semblent mixtes ou peu claires.",
    foodStable:
      "Les données récentes d’alimentation semblent plus calmes et plus stables.",

    careDifficult:
      "Les logs récents montrent des moments de routine difficiles répétés.",
    careMixed: "La cohérence récente des soins semble mixte.",
    careStable: "Les logs récents des soins semblent globalement stables.",

    usingRealData:
      "Le système utilise les données réelles des modules pour guider les décisions du jour.",
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

function getRecommendedWakeWindow(ageMonths: number) {
  if (ageMonths <= 3) return 90;
  if (ageMonths <= 6) return 120;
  if (ageMonths <= 9) return 150;
  if (ageMonths <= 12) return 180;
  if (ageMonths <= 18) return 240;
  return 300;
}

function timeToMinutes(time: string) {
  if (!time || !time.includes(":")) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function parseDuration(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function average(numbers: number[]) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function getSupabase() {
  return createSupabaseClient();
}

export default function DashboardClient() {
  const params = useParams();
  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
  const t = copy[locale];

  const [profile, setProfile] = useState<BabyProfile | null>(null);
  const [todayLabel, setTodayLabel] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("basic");
  const [sleepHistory, setSleepHistory] = useState<SleepEntry[]>([]);
  const [foodHistory, setFoodHistory] = useState<FoodEntry[]>([]);
  const [careHistory, setCareHistory] = useState<CareEntry[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiQuestion, setAiQuestion] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      if (typeof window === "undefined") return;

      const supabase = getSupabase();

      setIsLoadingData(true);

      const urlParams = new URLSearchParams(window.location.search);
      const q = urlParams.get("q")?.trim() || "";

      if (isMounted) {
        setAiQuestion(q);
        setTodayLabel(getTodayLabel(locale));
      }

      try {
        await importLocalStorageToSupabase(supabase);

        const [dbProfile, dbSleep, dbFood, dbCare, dbPlan] = await Promise.all([
          getProfile(supabase),
          getSleepEntries(supabase),
          getFoodEntries(supabase),
          getCareEntries(supabase),
          getPlanTier(supabase),
        ]);

        if (!isMounted) return;

        setProfile(dbProfile);
        setSelectedPlan(dbPlan);
        setSleepHistory(dbSleep);
        setFoodHistory(dbFood);
        setCareHistory(dbCare);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        if (isMounted) {
          setIsLoadingData(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  async function choosePlan(plan: PlanTier) {
    try {
      const supabase = getSupabase();

      setSelectedPlan(plan);

      const result = await updatePlanTier(supabase, plan);

      if (!result.success) {
        console.error("Failed to update plan:", result.error);
        const freshPlan = await getPlanTier(supabase);
        setSelectedPlan(freshPlan);
      }
    } catch (error) {
      console.error("Failed to update plan:", error);
      const supabase = getSupabase();
      const freshPlan = await getPlanTier(supabase);
      setSelectedPlan(freshPlan);
    }
  }

  function handleAskAgain() {
    const cleanQuestion = aiInput.trim();
    if (!cleanQuestion || typeof window === "undefined") return;
    window.location.href = `/${locale}/dashboard?q=${encodeURIComponent(cleanQuestion)}`;
  }

  const babyName = profile?.babyName || t.noProfileName;
  const ageMonths = Number(profile?.ageMonths || 0);
  const bedtime = profile?.bedtime || "-";
  const mainConcern = profile?.mainConcern || t.notSet;
  const notes = profile?.notes || t.noNotes;

  const sleepDurations = useMemo(() => {
    return sleepHistory
      .map((entry) => parseDuration(entry.napDuration))
      .filter((value) => value > 0);
  }, [sleepHistory]);

  const averageSleepDuration = useMemo(() => {
    return Math.round(average(sleepDurations));
  }, [sleepDurations]);

  const sleepMoods = useMemo(() => {
    return sleepHistory.map((entry) => entry.mood);
  }, [sleepHistory]);

  const foodReactions = useMemo(() => {
    return foodHistory.map((entry) => entry.reaction);
  }, [foodHistory]);

  const recentFoods = useMemo(() => {
    return foodHistory
      .map((entry) => entry.food)
      .filter(Boolean)
      .slice(0, 3);
  }, [foodHistory]);

  const careStatuses = useMemo(() => {
    return careHistory.map((entry) => entry.status);
  }, [careHistory]);

  const sleepInsight = useMemo(() => {
    if (!ageMonths || sleepHistory.length === 0) {
      return {
        title: t.sleepDataBuilding,
        subtitle: t.sleepDataBuildingText,
        nextSleepTime: "-",
        rhythm: t.noRhythm,
      };
    }

    const wakeWindow = getRecommendedWakeWindow(ageMonths);
    const napStartTimes = sleepHistory
      .map((entry) => timeToMinutes(entry.lastNapTime))
      .filter((value) => value > 0);

    if (napStartTimes.length === 0) {
      return {
        title: t.sleepDataBuilding,
        subtitle: t.sleepDataBuildingText,
        nextSleepTime: "-",
        rhythm: t.noRhythm,
      };
    }

    const averageNapStart =
      napStartTimes.reduce((sum, value) => sum + value, 0) / napStartTimes.length;

    const predictedNextSleep = averageNapStart + wakeWindow;
    const nextSleepTime = minutesToTime(Math.round(predictedNextSleep));

    const minStart = Math.min(...napStartTimes);
    const maxStart = Math.max(...napStartTimes);
    const spread = maxStart - minStart;

    let rhythm: string = t.stable;
    if (spread > 90) rhythm = t.irregular;
    else if (spread > 45) rhythm = t.slightlyVaried;

    return {
      title: `${t.nextLikelySleep} ${nextSleepTime}`,
      subtitle: t.sleepPredicted,
      nextSleepTime,
      rhythm,
    };
  }, [sleepHistory, ageMonths, t]);

  const sleepScore = useMemo(() => {
    if (sleepHistory.length === 0) return 0;

    const avgDuration = average(sleepDurations);

    let score = 60;
    if (avgDuration >= 60) score += 20;
    else if (avgDuration >= 45) score += 12;
    else score -= 8;

    const excellentLabels = ["Excellent"];
    const goodLabels = locale === "fr" ? ["Bon", "Good"] : ["Good"];
    const lightLabels = locale === "fr" ? ["Léger", "Light"] : ["Light"];
    const poorLabels = locale === "fr" ? ["Faible", "Poor"] : ["Poor"];

    const excellentCount = sleepHistory.filter((entry) =>
      excellentLabels.includes(entry.mood)
    ).length;
    const goodCount = sleepHistory.filter((entry) => goodLabels.includes(entry.mood)).length;
    const lightCount = sleepHistory.filter((entry) => lightLabels.includes(entry.mood)).length;
    const poorCount = sleepHistory.filter((entry) => poorLabels.includes(entry.mood)).length;

    score += excellentCount * 8;
    score += goodCount * 5;
    score -= lightCount * 4;
    score -= poorCount * 8;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [sleepHistory, sleepDurations, locale]);

  const foodInsight = useMemo(() => {
    if (foodHistory.length === 0) {
      return {
        title: t.foodDataBuilding,
        subtitle: t.foodDataBuildingText,
        reactionSignal: t.noDataYet,
      };
    }

    const sensitiveLabel = locale === "fr" ? "Sensible" : "Sensitive";
    const unsureLabel = locale === "fr" ? "Incertaine" : "Unsure";

    const sensitiveCount = foodReactions.filter((entry) => entry === sensitiveLabel).length;
    const unsureCount = foodReactions.filter((entry) => entry === unsureLabel).length;

    let reactionSignal: string = t.mostlyPositive;
    if (sensitiveCount >= 2) reactionSignal = t.sensitivityDetected;
    else if (unsureCount >= 2) reactionSignal = t.mixedReactions;

    return {
      title: t.mealRhythmClearer,
      subtitle: t.foodTrendText,
      reactionSignal,
    };
  }, [foodHistory, foodReactions, locale, t]);

  const foodScore = useMemo(() => {
    if (foodHistory.length === 0) return 0;

    let score = 60;

    const goodLabel = locale === "fr" ? "Bonne" : "Good";
    const unsureLabel = locale === "fr" ? "Incertaine" : "Unsure";
    const sensitiveLabel = locale === "fr" ? "Sensible" : "Sensitive";

    const goodCount = foodReactions.filter((entry) => entry === goodLabel).length;
    const unsureCount = foodReactions.filter((entry) => entry === unsureLabel).length;
    const sensitiveCount = foodReactions.filter((entry) => entry === sensitiveLabel).length;

    score += goodCount * 7;
    score -= unsureCount * 4;
    score -= sensitiveCount * 8;

    const uniqueMealTypes = new Set(foodHistory.map((entry) => entry.mealType)).size;
    score += uniqueMealTypes * 3;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [foodHistory, foodReactions, locale]);

  const careInsight = useMemo(() => {
    if (careHistory.length === 0) {
      return {
        title: t.careDataBuilding,
        subtitle: t.careDataBuildingText,
        consistencySignal: t.noDataYet,
      };
    }

    const difficultLabel = locale === "fr" ? "Difficile" : "Difficult";
    const partialLabel = locale === "fr" ? "Partiel" : "Partial";

    const difficultCount = careHistory.filter((entry) => entry.status === difficultLabel).length;
    const partialCount = careHistory.filter((entry) => entry.status === partialLabel).length;

    let consistencySignal: string = t.mostlyConsistent;
    if (difficultCount >= 2) consistencySignal = t.repeatedDifficulty;
    else if (partialCount >= 2) consistencySignal = t.mixedConsistency;

    return {
      title: t.routineConsistencyClearer,
      subtitle: t.careTrendText,
      consistencySignal,
    };
  }, [careHistory, locale, t]);

  const careScore = useMemo(() => {
    if (careHistory.length === 0) return 0;

    let score = 60;

    const completedLabel = locale === "fr" ? "Terminé" : "Completed";
    const partialLabel = locale === "fr" ? "Partiel" : "Partial";
    const difficultLabel = locale === "fr" ? "Difficile" : "Difficult";

    const completedCount = careHistory.filter((entry) => entry.status === completedLabel).length;
    const partialCount = careHistory.filter((entry) => entry.status === partialLabel).length;
    const difficultCount = careHistory.filter((entry) => entry.status === difficultLabel).length;

    score += completedCount * 6;
    score -= partialCount * 3;
    score -= difficultCount * 7;

    const uniqueCareTypes = new Set(careHistory.map((entry) => entry.careType)).size;
    score += uniqueCareTypes * 2;

    if (score > 100) score = 100;
    if (score < 0) score = 0;

    return Math.round(score);
  }, [careHistory, locale]);

  const aiAssistant = useMemo(() => {
    if (!aiQuestion) {
      return {
        title: t.aiAskSomething,
        message: t.aiAskMessage,
        plan: null as string[] | null,
        eliteInsights: null as string[] | null,
      };
    }

    const q = aiQuestion.toLowerCase();

    const poorLabels = locale === "fr" ? ["Faible", "Poor"] : ["Poor"];
    const lightLabels = locale === "fr" ? ["Léger", "Light"] : ["Light"];
    const sensitiveLabels = locale === "fr" ? ["Sensible", "Sensitive"] : ["Sensitive"];
    const unsureLabels = locale === "fr" ? ["Incertaine", "Unsure"] : ["Unsure"];
    const difficultLabels = locale === "fr" ? ["Difficile", "Difficult"] : ["Difficult"];
    const partialLabels = locale === "fr" ? ["Partiel", "Partial"] : ["Partial"];

    const poorSleepCount = sleepMoods.filter((entry) => poorLabels.includes(entry)).length;
    const lightSleepCount = sleepMoods.filter((entry) => lightLabels.includes(entry)).length;
    const sensitiveFoodCount = foodReactions.filter((entry) =>
      sensitiveLabels.includes(entry)
    ).length;
    const unsureFoodCount = foodReactions.filter((entry) => unsureLabels.includes(entry)).length;
    const difficultCareCount = careStatuses.filter((entry) =>
      difficultLabels.includes(entry)
    ).length;
    const partialCareCount = careStatuses.filter((entry) => partialLabels.includes(entry)).length;

    const profileContext = [
      locale === "fr"
        ? `${babyName} a ${ageMonths || "un âge inconnu"} mois`
        : `${babyName} is ${ageMonths || "unknown"} months old`,
      bedtime !== "-"
        ? locale === "fr"
          ? `heure habituelle du coucher ${bedtime}`
          : `usual bedtime is ${bedtime}`
        : null,
      mainConcern !== t.notSet
        ? locale === "fr"
          ? `préoccupation principale : ${mainConcern}`
          : `main concern is ${mainConcern}`
        : null,
    ]
      .filter(Boolean)
      .join(", ");

    if (
      q.includes("sleep") ||
      q.includes("nap") ||
      q.includes("night") ||
      q.includes("sommeil") ||
      q.includes("sieste")
    ) {
      let title = t.sleepGuidance;
      let message = `${profileContext}. `;
      let plan =
        locale === "fr"
          ? [
              "Gardez la prochaine fenêtre de sommeil calme et prévisible",
              "Réduisez la stimulation avant la prochaine sieste ou le coucher",
              "Protégez le coucher si le sommeil de journée reste court",
            ]
          : [
              "Keep the next sleep window calm and predictable",
              "Reduce stimulation before the next nap or bedtime",
              "Protect bedtime if daytime sleep remains short",
            ];
      const eliteInsights =
        locale === "fr"
          ? [
              "La qualité du sommeil peut être plus importante que l’heure lors des journées difficiles",
              "Des siestes courtes répétées influencent souvent toute la deuxième moitié de la journée",
            ]
          : [
              "Sleep quality can be more important than clock time on difficult days",
              "Repeated short naps often affect the whole second half of the day",
            ];

      if (sleepHistory.length === 0) {
        message += t.noSleepLogs;
      } else {
        message +=
          locale === "fr"
            ? `Vous avez actuellement ${sleepHistory.length} log(s) sommeil, la durée moyenne des siestes est de ${averageSleepDuration || "-"} minutes, et le prochain sommeil probable est vers ${sleepInsight.nextSleepTime}. `
            : `You currently have ${sleepHistory.length} sleep log(s), average nap duration is ${averageSleepDuration || "-"} minutes, and the next likely sleep window is around ${sleepInsight.nextSleepTime}. `;

        if (poorSleepCount >= 2) {
          message += t.sleepWeak;
          plan =
            locale === "fr"
              ? [
                  "Commencez la routine apaisante plus tôt aujourd’hui",
                  "Évitez d’allonger trop les fenêtres d’éveil",
                  "Priorisez un coucher plus tôt si la journée reste difficile",
                ]
              : [
                  "Start the calming routine earlier today",
                  "Avoid stretching wake windows too much",
                  "Prioritize an earlier bedtime if the day stays difficult",
                ];
        } else if (lightSleepCount >= 2) {
          message += t.sleepLight;
          plan =
            locale === "fr"
              ? [
                  "Surveillez attentivement les signes précoces de fatigue",
                  "Gardez l’environnement plus calme avant le prochain sommeil",
                  "Évitez trop de stimulation entre les siestes",
                ]
              : [
                  "Watch carefully for early tired cues",
                  "Keep the environment quieter before the next sleep",
                  "Avoid too much stimulation between naps",
                ];
        } else if (averageSleepDuration > 0 && averageSleepDuration < 45) {
          message += t.sleepShort;
          plan =
            locale === "fr"
              ? [
                  "Protégez fortement le coucher ce soir",
                  "Gardez un rythme de journée plus simple",
                  "Évitez d’ajouter trop de moments stimulants tard dans la journée",
                ]
              : [
                  "Protect bedtime strongly tonight",
                  "Keep the day rhythm simpler",
                  "Avoid stacking too many stimulating moments late in the day",
                ];
        } else {
          message += t.sleepUsable;
        }
      }

      return { title, message, plan, eliteInsights };
    }

    if (
      q.includes("food") ||
      q.includes("eat") ||
      q.includes("meal") ||
      q.includes("hungry") ||
      q.includes("manger") ||
      q.includes("repas") ||
      q.includes("alimentation")
    ) {
      let title = t.foodGuidance;
      let message = `${profileContext}. `;
      let plan =
        locale === "fr"
          ? [
              "Gardez les repas prévisibles aujourd’hui",
              "Évitez d’introduire trop de nouveaux aliments en même temps",
              "Suivez les réactions calmement après les repas",
            ]
          : [
              "Keep meals predictable today",
              "Avoid introducing too many new foods at once",
              "Track reactions calmly after meals",
            ];
      const eliteInsights =
        locale === "fr"
          ? [
              "Des repas simples rendent les schémas plus faciles à comprendre",
              "Le rythme des repas réduit souvent plus le stress qu’une variété trop rapide",
            ]
          : [
              "Simple meals make patterns easier to understand",
              "Meal rhythm often reduces stress more than adding variety too fast",
            ];

      if (foodHistory.length === 0) {
        message += t.noFoodLogs;
      } else {
        message +=
          locale === "fr"
            ? `Vous avez actuellement ${foodHistory.length} log(s) alimentation. `
            : `You currently have ${foodHistory.length} food log(s). `;

        if (recentFoods.length > 0) {
          message +=
            locale === "fr"
              ? `Les aliments récents incluent ${recentFoods.join(", ")}. `
              : `Recent foods include ${recentFoods.join(", ")}. `;
        }

        if (sensitiveFoodCount >= 2) {
          message += t.foodSensitive;
          plan =
            locale === "fr"
              ? [
                  "Gardez les repas plus simples aujourd’hui",
                  "Évitez d’empiler plusieurs aliments incertains",
                  "Notez précisément le timing et la réaction après les repas",
                ]
              : [
                  "Keep meals simpler today",
                  "Avoid stacking multiple uncertain foods",
                  "Log timing and reaction carefully after meals",
                ];
        } else if (unsureFoodCount >= 2) {
          message += t.foodMixed;
          plan =
            locale === "fr"
              ? [
                  "Gardez des choix alimentaires plus prévisibles aujourd’hui",
                  "Utilisez de plus petites portions si besoin",
                  "Surveillez si les mêmes aliments répètent des réactions peu claires",
                ]
              : [
                  "Keep food choices more predictable today",
                  "Use smaller portions if needed",
                  "Track whether the same foods repeat unclear reactions",
                ];
        } else {
          message += t.foodStable;
        }
      }

      return { title, message, plan, eliteInsights };
    }

    if (
      q.includes("care") ||
      q.includes("routine") ||
      q.includes("bath") ||
      q.includes("diaper") ||
      q.includes("soin") ||
      q.includes("bain") ||
      q.includes("couche")
    ) {
      let title = t.careGuidance;
      let message = `${profileContext}. `;
      let plan =
        locale === "fr"
          ? [
              "Gardez l’ordre des étapes de routine prévisible aujourd’hui",
              "Réduisez les variations inutiles entre les moments de soins",
              "Utilisez des transitions plus calmes autour des moments difficiles",
            ]
          : [
              "Keep the order of routine steps predictable today",
              "Reduce unnecessary variation between care moments",
              "Use calmer transitions around more difficult moments",
            ];
      const eliteInsights =
        locale === "fr"
          ? [
              "La cohérence aide généralement plus que l’ajout de complexité",
              "Les frictions répétées apparaissent souvent quand la journée est surchargée",
            ]
          : [
              "Consistency usually helps more than adding more complexity",
              "Repeated care friction often appears when the whole day feels overloaded",
            ];

      if (careHistory.length === 0) {
        message += t.noCareLogs;
      } else {
        message +=
          locale === "fr"
            ? `Vous avez actuellement ${careHistory.length} log(s) soins. `
            : `You currently have ${careHistory.length} care log(s). `;

        if (difficultCareCount >= 2) {
          message += t.careDifficult;
          plan =
            locale === "fr"
              ? [
                  "Simplifiez les routines aujourd’hui",
                  "Préparez chaque étape de soin avant de commencer",
                  "Ralentissez les transitions au lieu de les précipiter",
                ]
              : [
                  "Simplify routines today",
                  "Prepare each care step before starting",
                  "Slow transitions down instead of rushing through them",
                ];
        } else if (partialCareCount >= 2) {
          message += t.careMixed;
          plan =
            locale === "fr"
              ? [
                  "Gardez le même ordre de routine aujourd’hui",
                  "Réduisez les changements optionnels dans le planning",
                  "Concentrez-vous sur une structure plus calme et répétée",
                ]
              : [
                  "Keep the same routine order today",
                  "Reduce optional changes in the schedule",
                  "Focus on one calmer repeated structure",
                ];
        } else {
          message += t.careStable;
        }
      }

      return { title, message, plan, eliteInsights };
    }

    return {
      title: t.smartGuidance,
      message:
        locale === "fr"
          ? `${profileContext}. Logs sommeil : ${sleepHistory.length}, logs alimentation : ${foodHistory.length}, logs soins : ${careHistory.length}. ${t.usingRealData}`
          : `${profileContext}. Sleep logs: ${sleepHistory.length}, food logs: ${foodHistory.length}, care logs: ${careHistory.length}. ${t.usingRealData}`,
      plan:
        locale === "fr"
          ? [
              "Gardez les routines actuelles stables",
              "Surveillez les schémas qui se répètent entre les modules",
              "Évitez de changer trop de choses le même jour",
            ]
          : [
              "Keep current routines stable",
              "Watch for repeating patterns across modules",
              "Avoid changing too many things on the same day",
            ],
      eliteInsights:
        locale === "fr"
          ? [
              "Les schémas croisés entre modules sont souvent plus utiles qu’un log isolé",
              "Un système calme et répétable vaut mieux qu’un système parfait mais compliqué",
            ]
          : [
              "Cross-module patterns are often more useful than one isolated log",
              "A calmer repeatable system beats a perfect but complicated one",
            ],
    };
  }, [
    aiQuestion,
    babyName,
    ageMonths,
    bedtime,
    mainConcern,
    sleepHistory,
    foodHistory,
    careHistory,
    averageSleepDuration,
    sleepInsight.nextSleepTime,
    sleepMoods,
    foodReactions,
    careStatuses,
    recentFoods,
    locale,
    t,
  ]);

  const planAccess = {
    basic: {
      canSeePlan: false,
      canSeeEliteInsights: false,
    },
    premium: {
      canSeePlan: true,
      canSeeEliteInsights: false,
    },
    elite: {
      canSeePlan: true,
      canSeeEliteInsights: true,
    },
  }[selectedPlan];

  const totalLogs = sleepHistory.length + foodHistory.length + careHistory.length;
  const combinedScore =
    totalLogs === 0 ? 0 : Math.round((sleepScore + foodScore + careScore) / 3);

  if (isLoadingData) {
    return (
      <AppModuleLayout
        active="dashboard"
        title="Smart Baby System"
        subtitle={t.subtitle}
        label={t.label}
        currentFocusTitle={t.focusTitle}
        currentFocusText={t.focusText}
        dateLabel="..."
      >
        <section className="neoDash__panel">
          <div className="neoDash__card">
            <h3>Loading your secure dashboard...</h3>
            <p>Your profile, sleep, food and care data are being loaded from Supabase.</p>
          </div>
        </section>
      </AppModuleLayout>
    );
  }

  return (
    <AppModuleLayout
      active="dashboard"
      title={babyName}
      subtitle={t.subtitle}
      label={t.label}
      currentFocusTitle={t.focusTitle}
      currentFocusText={t.focusText}
      dateLabel={todayLabel || "..."}
    >
      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">{t.subscription}</p>
            <h3>{t.currentPlan}</h3>
            <p className="neoDash__panelText">{t.currentPlanText}</p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          <div
            className="neoDash__card"
            style={{
              border:
                selectedPlan === "basic"
                  ? "2px solid #0f172a"
                  : "1px solid rgba(148,163,184,0.2)",
            }}
          >
            <p className="neoDash__label">Basic</p>
            <h3>€7 / month</h3>
            <p>{t.basicDesc}</p>
            <button
              type="button"
              className="neoDash__secondaryBtn"
              onClick={() => choosePlan("basic")}
              style={{ marginTop: "12px" }}
            >
              {selectedPlan === "basic" ? t.selected : t.chooseBasic}
            </button>
          </div>

          <div
            className="neoDash__card"
            style={{
              border:
                selectedPlan === "premium"
                  ? "2px solid #0f172a"
                  : "1px solid rgba(148,163,184,0.2)",
            }}
          >
            <p className="neoDash__label">Premium</p>
            <h3>€11 / month</h3>
            <p>{t.premiumDesc}</p>
            <button
              type="button"
              className="neoDash__primaryBtn"
              onClick={() => choosePlan("premium")}
              style={{ marginTop: "12px" }}
            >
              {selectedPlan === "premium" ? t.selected : t.choosePremium}
            </button>
          </div>

          <div
            className="neoDash__card"
            style={{
              border:
                selectedPlan === "elite"
                  ? "2px solid #0f172a"
                  : "1px solid rgba(148,163,184,0.2)",
            }}
          >
            <p className="neoDash__label">Elite</p>
            <h3>€15 / month</h3>
            <p>{t.eliteDesc}</p>
            <button
              type="button"
              className="neoDash__secondaryBtn"
              onClick={() => choosePlan("elite")}
              style={{ marginTop: "12px" }}
            >
              {selectedPlan === "elite" ? t.selected : t.chooseElite}
            </button>
          </div>
        </div>
      </section>

      <div className="neoDash__heroGrid">
        <article className="neoDash__heroCard">
          <p className="neoDash__label">{t.mainOverview}</p>
          <h2>
            {babyName}&apos;s {t.dailySystem}
          </h2>
          <p>
            {babyName} {t.currentlyOn}{" "}
            <strong style={{ textTransform: "capitalize" }}>{selectedPlan}</strong> {t.plan}.
            You have <strong>{totalLogs}</strong> {t.totalLogs}.
          </p>

          <div className="neoDash__miniStats">
            <div className="neoDash__miniStat">
              <span>{t.bedtime}</span>
              <strong>{bedtime}</strong>
            </div>
            <div className="neoDash__miniStat">
              <span>{t.mainConcern}</span>
              <strong>{mainConcern}</strong>
            </div>
            <div className="neoDash__miniStat">
              <span>{t.babyAge}</span>
              <strong>
                {ageMonths || "-"} {t.months}
              </strong>
            </div>
          </div>
        </article>

        <article className="neoDash__scoreCard">
          <p className="neoDash__label">{t.dailyHealthScore}</p>
          <div className="neoDash__scoreNumber">{combinedScore}</div>
          <p className="neoDash__scoreText">{t.combinedScore}</p>
        </article>
      </div>

      {aiQuestion ? (
        <section className="neoDash__panel">
          <div className="neoDash__panelHeader">
            <div>
              <p className="neoDash__label">{t.centralAi}</p>
              <h3>{aiAssistant.title}</h3>
              <p className="neoDash__panelText">{t.basedOnQuestion}</p>
            </div>
          </div>

          <div className="neoDash__card" style={{ marginTop: 0 }}>
            <p className="neoDash__label">{t.yourQuestion}</p>
            <h3>{aiQuestion}</h3>
            <p>{aiAssistant.message}</p>

            {!planAccess.canSeePlan && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                <strong>{t.upgradePremium}</strong>
                <p style={{ marginTop: "6px" }}>{t.unlockFullPlan}</p>
              </div>
            )}

            {planAccess.canSeePlan && aiAssistant.plan && (
              <div style={{ marginTop: "16px" }}>
                <p className="neoDash__label">{t.aiActionPlan}</p>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {aiAssistant.plan.map((step, i) => (
                    <div key={i}>• {step}</div>
                  ))}
                </div>
              </div>
            )}

            {planAccess.canSeePlan && !planAccess.canSeeEliteInsights && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "14px",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid rgba(148,163,184,0.2)",
                }}
              >
                <strong>{t.upgradeElite}</strong>
                <p style={{ marginTop: "6px" }}>{t.unlockElite}</p>
              </div>
            )}

            {planAccess.canSeeEliteInsights && aiAssistant.eliteInsights && (
              <div style={{ marginTop: "16px" }}>
                <p className="neoDash__label">{t.eliteInsights}</p>
                <div style={{ display: "grid", gap: "8px", marginTop: "8px" }}>
                  {aiAssistant.eliteInsights.map((item, i) => (
                    <div key={i}>✦ {item}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="neoDash__panel">
        <div className="neoDash__panelHeader">
          <div>
            <p className="neoDash__label">{t.askAiFromDashboard}</p>
            <h3>{t.refineContext}</h3>
            <p className="neoDash__panelText">{t.askAiText}</p>
          </div>
        </div>

        <div className="neoDash__form">
          <div className="neoDash__formGrid">
            <label style={{ gridColumn: "1 / -1" }}>
              <span>{t.yourQuestionInput}</span>
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAskAgain();
                }}
                placeholder={t.askAiPlaceholder}
              />
            </label>
          </div>

          <div className="neoDash__formActions">
            <button type="button" className="neoDash__primaryBtn" onClick={handleAskAgain}>
              {t.askAi}
            </button>
          </div>
        </div>
      </section>

      <div className="neoDash__summaryGrid">
        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.sleepScore}</p>
          <strong>{sleepScore}</strong>
          <span>{sleepInsight.title}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.foodScore}</p>
          <strong>{foodScore}</strong>
          <span>{foodInsight.reactionSignal}</span>
        </article>

        <article className="neoDash__summaryCard">
          <p className="neoDash__label">{t.careScore}</p>
          <strong>{careScore}</strong>
          <span>{careInsight.consistencySignal}</span>
        </article>
      </div>

      <div
        style={{
          display: "grid",
          gap: "20px",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        }}
      >
        <a
          href={`/${locale}/sleep`}
          className="neoDash__card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="neoDash__label">{t.sleepModule}</p>
          <h3>🌙 {sleepInsight.title}</h3>
          <p>{sleepInsight.subtitle}</p>
          <div style={{ marginTop: "12px" }}>
            <strong>{t.rhythm}:</strong> {sleepInsight.rhythm}
          </div>
          <div style={{ marginTop: "10px", color: "#2563eb", fontWeight: 600 }}>
            {t.openSleep}
          </div>
        </a>

        <a
          href={`/${locale}/food`}
          className="neoDash__card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="neoDash__label">{t.foodModule}</p>
          <h3>🍼 {foodInsight.title}</h3>
          <p>{foodInsight.subtitle}</p>
          <div style={{ marginTop: "12px" }}>
            <strong>{t.reactionSignal}:</strong> {foodInsight.reactionSignal}
          </div>
          <div style={{ marginTop: "10px", color: "#2563eb", fontWeight: 600 }}>
            {t.openFood}
          </div>
        </a>

        <a
          href={`/${locale}/care`}
          className="neoDash__card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="neoDash__label">{t.careModule}</p>
          <h3>💙 {careInsight.title}</h3>
          <p>{careInsight.subtitle}</p>
          <div style={{ marginTop: "12px" }}>
            <strong>{t.consistency}:</strong> {careInsight.consistencySignal}
          </div>
          <div style={{ marginTop: "10px", color: "#2563eb", fontWeight: 600 }}>
            {t.openCare}
          </div>
        </a>
      </div>

      <div className="neoDash__contentGrid" style={{ marginTop: "20px" }}>
        <article className="neoDash__card">
          <p className="neoDash__label">{t.profileSummary}</p>
          <h3>{t.currentProfileContext}</h3>
          <p>
            Plan: <strong style={{ textTransform: "capitalize" }}>{selectedPlan}</strong>
          </p>
          <p>
            {t.bedtime}: {bedtime}
          </p>
          <p>
            {t.mainConcern}: {mainConcern}
          </p>
        </article>

        <article className="neoDash__card">
          <p className="neoDash__label">{t.parentNotes}</p>
          <h3>{t.savedContext}</h3>
          <p>{notes}</p>
        </article>
      </div>

      <section className="neoDash__panel" style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "12px", opacity: 0.6 }}>
          AI suggestions are not medical advice.
        </p>
      </section>
    </AppModuleLayout>
  );
}