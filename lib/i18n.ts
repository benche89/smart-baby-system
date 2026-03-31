export const locales = ["en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export const messages = {
  en: {
    nav: {
      overview: "Overview",
      modules: "Modules",
      ai: "AI",
      pricing: "Pricing",
      howItWorks: "How it works",
      marketplace: "Marketplace",
      login: "Log in",
      startFree: "Start free",
      mainDashboard: "Main Dashboard",
      sleepModule: "Sleep Module",
      foodModule: "Food Module",
      careModule: "Care Module",
      editProfile: "Edit Profile"
    },
    common: {
      todayOverview: "Today's overview",
      loading: "Loading...",
      currentFocus: "Current focus"
    },
    home: {
      badge: "Unified premium parenting app + marketplace",
      title1: "One calm system",
      title2: "for sleep, food, care, AI and parent marketplace",
      subtitle:
        "Smart Baby System turns daily baby data into a premium product experience — clearer decisions, better routines and less mental overload for parents.",
      startFree: "Start free",
      openApp: "Open app",
      exploreMarketplace: "Explore marketplace"
    },
    onboarding: {
      title: "Set up your premium parenting profile",
      subtitle:
        "Add a few key details so Smart Baby System can personalize sleep, food and care guidance for your baby.",
      save: "Save profile & open dashboard",
      skip: "Skip for now",
      babyName: "Baby name",
      ageMonths: "Age in months",
      bedtime: "Usual bedtime",
      mainConcern: "Main concern",
      notes: "Notes",
      chooseOne: "Choose one"
    },
    dashboard: {
      welcomeBack: "Welcome back",
      unifiedOverview: "Unified overview",
      mainDashboard: "Main dashboard",
      overviewText: "Overview, AI guidance and quick access to every module.",
      currentPlan: "Your current plan",
      choosePlan: "Choose a plan to unlock more value across the full ecosystem."
    }
  },
  fr: {
    nav: {
      overview: "Aperçu",
      modules: "Modules",
      ai: "IA",
      pricing: "Tarifs",
      howItWorks: "Comment ça marche",
      marketplace: "Marketplace",
      login: "Connexion",
      startFree: "Commencer",
      mainDashboard: "Tableau principal",
      sleepModule: "Module sommeil",
      foodModule: "Module alimentation",
      careModule: "Module soins",
      editProfile: "Modifier le profil"
    },
    common: {
      todayOverview: "Aperçu du jour",
      loading: "Chargement...",
      currentFocus: "Focus actuel"
    },
    home: {
      badge: "Application premium parentale + marketplace",
      title1: "Un système apaisant",
      title2: "pour le sommeil, l'alimentation, les soins, l'IA et le marketplace parents",
      subtitle:
        "Smart Baby System transforme les données quotidiennes de bébé en une expérience premium — décisions plus claires, meilleures routines et moins de charge mentale pour les parents.",
      startFree: "Commencer",
      openApp: "Ouvrir l'app",
      exploreMarketplace: "Explorer le marketplace"
    },
    onboarding: {
      title: "Configurez votre profil parental premium",
      subtitle:
        "Ajoutez quelques informations clés pour que Smart Baby System personnalise le sommeil, l'alimentation et les soins de votre bébé.",
      save: "Enregistrer le profil et ouvrir le tableau de bord",
      skip: "Passer pour le moment",
      babyName: "Prénom du bébé",
      ageMonths: "Âge en mois",
      bedtime: "Heure habituelle du coucher",
      mainConcern: "Préoccupation principale",
      notes: "Notes",
      chooseOne: "Choisissez une option"
    },
    dashboard: {
      welcomeBack: "Bon retour",
      unifiedOverview: "Vue unifiée",
      mainDashboard: "Tableau principal",
      overviewText: "Aperçu, guidance IA et accès rapide à chaque module.",
      currentPlan: "Votre formule actuelle",
      choosePlan: "Choisissez une formule pour débloquer plus de valeur."
    }
  }
} as const;

export function getMessages(locale: Locale) {
  return messages[locale];
}