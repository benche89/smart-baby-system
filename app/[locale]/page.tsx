"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultLocale, isValidLocale } from "../../lib/i18n";

type PlanTier = "basic" | "premium" | "elite";
type Locale = "en" | "fr";

const copy = {
  en: {
    nav: {
      overview: "Overview",
      modules: "Modules",
      ai: "AI",
      pricing: "Pricing",
      how: "How it works",
      proof: "Why parents stay",
      marketplace: "Marketplace",
      login: "Log in",
      startFree: "Start free",
    },
    hero: {
      badge: "AI-powered parenting guidance",
      title1: "Understand your baby.",
      title2: "Not just track.",
      text:
        "Stop guessing why your baby cries, wakes or refuses to eat. Smart Baby System turns daily sleep, food and care data into clear AI-powered insights, so parents can make calmer decisions with more confidence.",
      trust: "Built for modern parents who want clarity, not confusion.",
      askPlaceholder:
        "Ask AI anything… e.g. Why did my baby sleep less today?",
      askAi: "Ask AI",
      startFree: "Start for free",
      seeHow: "See how it works",
      benefit1: "See hidden sleep and feeding patterns",
      benefit2: "Get AI suggestions based on real data",
      benefit3: "Build calmer, more predictable routines",
      statLabel1: "Sleep pattern",
      statValue1: "Clearer",
      statText1: "Recent naps and wake windows connected automatically.",
      statLabel2: "Feeding rhythm",
      statValue2: "Smarter",
      statText2: "Meals and reactions translated into useful daily guidance.",
      statLabel3: "Care routine",
      statValue3: "Calmer",
      statText3:
        "Daily consistency becomes easier to understand and improve.",
      previewEyebrow: "Live product preview",
      previewTitle: "One calm system for better daily parenting decisions",
      previewText:
        "Sleep, food, care and AI guidance work together inside one connected experience instead of scattered notes and separate tools.",
      scoreTitle: "Today’s overview",
      scoreText:
        "The app connects daily rhythm, meal logs and care consistency into one simple picture parents can actually use.",
      score1: "Sleep score",
      score2: "Food score",
      score3: "Care score",
      aiCardBadge: "AI insight",
      aiCardTitle: "Pattern detected",
      aiCardText:
        "Baby slept less after the last late nap. Try an earlier next sleep window today.",
      marketCardBadge: "Marketplace",
      marketCardTitle: "Parent marketplace",
      marketCardText:
        "Buy, sell or donate baby items inside the same trusted ecosystem.",
      chatCardBadge: "Private chat",
      chatCardTitle: "Safer conversations",
      chatCardText:
        "Parents can contact sellers inside the platform without sharing public phone numbers.",
    },
    trust: {
      eyebrow: "Why parents stay",
      title:
        "Because the product reduces uncertainty, not just adds logs.",
      text:
        "The value is not in collecting data. The value is in turning daily baby activity into clearer next steps, better routines and calmer decisions.",
      card1Title: "Less mental overload",
      card1Text:
        "Parents no longer need to remember everything across naps, meals and care events.",
      card2Title: "More useful signals",
      card2Text:
        "Patterns become easier to spot before the day starts to feel chaotic.",
      card3Title: "One connected system",
      card3Text:
        "Sleep, food, care, AI and marketplace all live in the same premium experience.",
      quote1:
        "“I don’t just track anymore. I actually understand what may be affecting the day.”",
      quote2:
        "“It feels calmer because everything is finally connected in one place.”",
      quote3:
        "“The AI suggestions feel more useful because they are tied to real routines.”",
    },
    modules: {
      eyebrow: "Core ecosystem",
      title: "Everything works better when the modules work together.",
      text:
        "Instead of using separate baby tools, Smart Baby System connects the three pillars inside one premium app.",
      premium: "Premium",
      sleepTitle: "Sleep",
      sleepText:
        "Track naps, estimate next sleep windows, protect bedtime and reduce overtiredness risk.",
      foodTitle: "Food",
      foodText:
        "Log meals, track reactions, improve rhythm clarity and reduce feeding stress.",
      careTitle: "Care",
      careText:
        "Bring consistency to routines, hygiene and daily essentials with a calmer flow.",
    },
    ai: {
      eyebrow: "Central AI layer",
      title: "Ask one question. Adapt the whole day.",
      text:
        "The AI doesn’t sit on top like a gimmick — it connects directly with Sleep, Food and Care.",
      sleepLabel: "Sleep AI",
      sleepQuestion: "“Why is my baby not sleeping well?”",
      sleepText: "Get rhythm-focused guidance and a clearer next-step plan.",
      foodLabel: "Food AI",
      foodQuestion: "“What should my baby eat today?”",
      foodText:
        "Receive meal structure, reaction clarity and simpler feeding suggestions.",
      careLabel: "Care AI",
      careQuestion: "“How can I improve baby routine?”",
      careText:
        "Get calmer transitions, consistency ideas and daily care structure.",
    },
    how: {
      eyebrow: "How it works",
      title: "From daily baby data to clear next steps.",
      text:
        "Smart Baby System helps parents move from scattered notes and uncertainty to clear, connected decisions.",
      step1Title: "Log what happened",
      step1Text:
        "Add sleep, meals and care in a simple daily flow built for real parent routines.",
      step2Title: "Let the AI detect patterns",
      step2Text:
        "The system connects wake windows, feeding rhythm, reactions and care consistency to surface what matters.",
      step3Title: "Get clear guidance",
      step3Text:
        "Receive practical suggestions that help you adjust the day with more calm, structure and confidence.",
      card1Label: "Input",
      card1Title: "Real daily data",
      card1Text:
        "Sleep times, meals, reactions, routine notes and daily care logs become one connected picture.",
      card2Label: "Analysis",
      card2Title: "Context-aware AI",
      card2Text:
        "Instead of generic tips, the system looks at your baby’s real rhythm and recent signals before suggesting anything.",
      card3Label: "Outcome",
      card3Title: "Better decisions",
      card3Text:
        "Parents can spot patterns earlier, reduce guesswork and build calmer routines over time.",
      demoLabel: "Example insight",
      demoTitle: "What parents actually get",
      demoText:
        "“Your baby slept less after a later nap yesterday. Try an earlier next sleep window and keep the bedtime routine stable tonight.”",
      point1: "Less guessing",
      point2: "More structure",
      point3: "Clearer daily decisions",
    },
    vision: {
      eyebrow: "A premium vision for modern parenting",
      title1: "Building a Bright Future",
      title2: "for Your Children: Essential Strategies for Parents.",
      text:
        "Parenting is not just about getting through the day. It is about building stable rhythms, healthier routines, stronger decisions and a calmer home environment that supports your child’s long-term growth with more clarity and less stress.",
      why: "Why this matters",
      systemTitle: "Not just tracking. A real premium parenting system.",
      systemText:
        "Smart Baby System helps parents move from scattered notes and isolated tools to one connected experience where sleep, food, care, AI support and even marketplace interactions work together to create better daily decisions and a more confident parenting journey.",
      calmTitle: "Calm routines",
      calmText: "Less chaos, more predictable daily flow.",
      signalsTitle: "Better signals",
      signalsText: "See what matters earlier and react with confidence.",
      longTermTitle: "Long-term clarity",
      longTermText: "Build stronger habits that support future growth.",
      sleepLabel: "Sleep + rhythm",
      sleepTitle: "Better rest starts with better structure.",
      sleepText:
        "A calmer sleep rhythm improves recovery, routine consistency and the quality of the whole day for both parents and children.",
      foodLabel: "Food + care",
      foodTitle: "Daily consistency creates stronger foundations.",
      foodText:
        "Meals, routines and care patterns shape comfort, behavior and stability in ways parents can understand more clearly with the right system.",
      ecoLabel: "Ecosystem advantage",
      ecoTitle: "One system can support the whole parenting journey.",
      ecoText:
        "With AI guidance, connected modules and a trusted marketplace, the product becomes more than an app — it becomes a premium parenting ecosystem.",
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Choose the level of guidance your family needs.",
      text:
        "Start simple, then unlock deeper AI support, stronger planning and a more complete parenting system.",
      badge: "Cancel anytime",
      monthly: "Monthly plan",
      yearly: "Coming soon: yearly savings",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicPrice: "€7",
      premiumPrice: "€11",
      elitePrice: "€15",
      perMonth: "/month",
      basicSub: "Essential access for parents who want the core system.",
      premiumSub:
        "Best balance of value, AI planning and premium parenting support.",
      eliteSub:
        "For families who want the deepest guidance and highest-value insights.",
      basic1: "Core module access",
      basic2: "Basic logs and simple overview",
      basic3: "Short AI guidance",
      basic4: "Good starting point for daily tracking",
      premium1: "Full AI action plans",
      premium2: "Sleep / Food / Care modules",
      premium3: "Premium dashboard experience",
      premium4: "Stronger daily guidance and planning",
      elite1: "Everything in Premium",
      elite2: "Advanced AI insights",
      elite3: "Deeper recommendations",
      elite4: "Highest-value experience for serious use",
      basicFor: "Best for trying the system",
      premiumFor: "Best for most families",
      eliteFor: "Best for maximum clarity",
      mostPopular: "Most popular",
      chooseBasic: "Start Basic",
      choosePremium: "Start Premium",
      getElite: "Start Elite",
      noteTitle: "What happens next",
      note1: "Choose your plan",
      note2: "Create your baby profile",
      note3: "Start tracking and unlock AI guidance",
      footnote:
        "Billing integration can be connected to Stripe in the next step without changing this pricing structure.",
    },
    cta: {
      eyebrow: "Start now",
      title: "Turn daily baby data into calmer parenting decisions.",
      text:
        "Open the app, choose a plan and build a smarter system around your real daily life.",
      openDashboard: "Open dashboard",
      exploreMarketplace: "Explore marketplace",
    },
    footer: {
      text:
        "A premium parenting app designed to make sleep, food, care, AI and parent-to-parent marketplace feel calmer, clearer and more connected.",
      instagram: "Instagram",
      facebook: "Facebook",
      contact: "Contact",
      product: "Product",
      app: "App",
      getStarted: "Get started",
      dashboard: "Dashboard",
      sleep: "Sleep",
      food: "Food",
      care: "Care",
      marketplace: "Marketplace",
      onboarding: "Onboarding",
      login: "Log in",
      messages: "Messages",
      bottom: "© 2026 Smart Baby System. Designed for calm, modern parenting.",
    },
  },
  fr: {
    nav: {
      overview: "Aperçu",
      modules: "Modules",
      ai: "IA",
      pricing: "Tarifs",
      how: "Comment ça marche",
      proof: "Pourquoi les parents restent",
      marketplace: "Marketplace",
      login: "Connexion",
      startFree: "Commencer",
    },
    hero: {
      badge: "Guidance parentale alimentée par l’IA",
      title1: "Comprenez votre bébé.",
      title2: "Ne vous contentez pas de suivre.",
      text:
        "Arrêtez de deviner pourquoi votre bébé pleure, se réveille ou refuse de manger. Smart Baby System transforme les données quotidiennes de sommeil, d’alimentation et de soins en insights clairs grâce à l’IA, pour aider les parents à prendre des décisions plus sereines et plus sûres.",
      trust:
        "Conçu pour les parents modernes qui veulent de la clarté, pas de la confusion.",
      askPlaceholder:
        "Posez une question à l’IA… ex. Pourquoi mon bébé a-t-il moins dormi aujourd’hui ?",
      askAi: "Demander à l’IA",
      startFree: "Commencer gratuitement",
      seeHow: "Voir comment ça marche",
      benefit1: "Détectez les schémas cachés de sommeil et d’alimentation",
      benefit2: "Recevez des suggestions IA basées sur de vraies données",
      benefit3: "Construisez des routines plus calmes et prévisibles",
      statLabel1: "Schéma de sommeil",
      statValue1: "Plus clair",
      statText1:
        "Les dernières siestes et fenêtres d’éveil sont reliées automatiquement.",
      statLabel2: "Rythme alimentaire",
      statValue2: "Plus intelligent",
      statText2:
        "Les repas et réactions sont transformés en guidance utile pour la journée.",
      statLabel3: "Routine de soins",
      statValue3: "Plus sereine",
      statText3:
        "La cohérence quotidienne devient plus facile à comprendre et à améliorer.",
      previewEyebrow: "Aperçu du produit",
      previewTitle:
        "Un seul système apaisant pour de meilleures décisions parentales",
      previewText:
        "Sommeil, alimentation, soins et guidance IA travaillent ensemble dans une seule expérience connectée, au lieu de notes dispersées et d’outils séparés.",
      scoreTitle: "Aperçu du jour",
      scoreText:
        "L’application relie le rythme quotidien, les repas et la cohérence des soins dans une vue simple que les parents peuvent réellement utiliser.",
      score1: "Score sommeil",
      score2: "Score alimentation",
      score3: "Score soins",
      aiCardBadge: "Insight IA",
      aiCardTitle: "Schéma détecté",
      aiCardText:
        "Le bébé a moins dormi après la dernière sieste tardive. Essayez une fenêtre de sommeil plus tôt aujourd’hui.",
      marketCardBadge: "Marketplace",
      marketCardTitle: "Marketplace parents",
      marketCardText:
        "Achetez, vendez ou donnez des articles pour bébé dans le même écosystème de confiance.",
      chatCardBadge: "Chat privé",
      chatCardTitle: "Conversations plus sûres",
      chatCardText:
        "Les parents peuvent contacter les vendeurs dans la plateforme sans partager de numéro public.",
    },
    trust: {
      eyebrow: "Pourquoi les parents restent",
      title:
        "Parce que le produit réduit l’incertitude, pas seulement ajoute des logs.",
      text:
        "La valeur n’est pas dans la collecte de données. La vraie valeur est de transformer l’activité quotidienne du bébé en prochaines étapes plus claires, en meilleures routines et en décisions plus sereines.",
      card1Title: "Moins de charge mentale",
      card1Text:
        "Les parents n’ont plus besoin de tout retenir entre les siestes, les repas et les soins.",
      card2Title: "Des signaux plus utiles",
      card2Text:
        "Les schémas deviennent plus faciles à repérer avant que la journée devienne chaotique.",
      card3Title: "Un système connecté",
      card3Text:
        "Sommeil, alimentation, soins, IA et marketplace vivent dans la même expérience premium.",
      quote1:
        "« Je ne fais plus seulement du tracking. Je comprends enfin ce qui peut influencer la journée. »",
      quote2:
        "« C’est plus apaisant parce que tout est enfin connecté au même endroit. »",
      quote3:
        "« Les suggestions IA semblent plus utiles parce qu’elles sont liées aux vraies routines. »",
    },
    modules: {
      eyebrow: "Écosystème principal",
      title:
        "Tout fonctionne mieux lorsque les modules travaillent ensemble.",
      text:
        "Au lieu d’utiliser plusieurs outils séparés, Smart Baby System relie les trois piliers dans une seule application premium.",
      premium: "Premium",
      sleepTitle: "Sommeil",
      sleepText:
        "Suivez les siestes, estimez les prochaines fenêtres de sommeil, protégez l’heure du coucher et réduisez le risque de sur-fatigue.",
      foodTitle: "Alimentation",
      foodText:
        "Enregistrez les repas, suivez les réactions, améliorez la clarté du rythme et réduisez le stress lié à l’alimentation.",
      careTitle: "Soins",
      careText:
        "Apportez de la cohérence aux routines, à l’hygiène et aux essentiels du quotidien avec un flux plus apaisant.",
    },
    ai: {
      eyebrow: "Couche IA centrale",
      title: "Posez une question. Adaptez toute la journée.",
      text:
        "L’IA n’est pas un gadget posé au-dessus — elle se connecte directement au Sommeil, à l’Alimentation et aux Soins.",
      sleepLabel: "IA Sommeil",
      sleepQuestion: "« Pourquoi mon bébé dort-il mal ? »",
      sleepText:
        "Obtenez une guidance centrée sur le rythme et un plan d’action plus clair.",
      foodLabel: "IA Alimentation",
      foodQuestion: "« Que devrait manger mon bébé aujourd’hui ? »",
      foodText:
        "Recevez une structure de repas, plus de clarté sur les réactions et des suggestions plus simples.",
      careLabel: "IA Soins",
      careQuestion: "« Comment améliorer la routine de mon bébé ? »",
      careText:
        "Obtenez des transitions plus calmes, des idées de cohérence et une meilleure structure quotidienne.",
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "Des données quotidiennes de bébé vers des décisions claires.",
      text:
        "Smart Baby System aide les parents à passer de notes dispersées et de l’incertitude à des décisions plus claires et connectées.",
      step1Title: "Enregistrez ce qui s’est passé",
      step1Text:
        "Ajoutez le sommeil, les repas et les soins dans un flux quotidien simple, pensé pour la vraie vie des parents.",
      step2Title: "Laissez l’IA détecter les schémas",
      step2Text:
        "Le système relie les fenêtres d’éveil, le rythme alimentaire, les réactions et la cohérence des soins pour faire ressortir ce qui compte.",
      step3Title: "Recevez une guidance claire",
      step3Text:
        "Obtenez des suggestions pratiques pour ajuster la journée avec plus de calme, de structure et de confiance.",
      card1Label: "Entrée",
      card1Title: "De vraies données quotidiennes",
      card1Text:
        "Horaires de sommeil, repas, réactions, notes de routine et logs de soins deviennent une seule vue connectée.",
      card2Label: "Analyse",
      card2Title: "IA contextuelle",
      card2Text:
        "Au lieu de conseils génériques, le système analyse le vrai rythme de votre bébé et ses signaux récents avant de suggérer quoi que ce soit.",
      card3Label: "Résultat",
      card3Title: "De meilleures décisions",
      card3Text:
        "Les parents repèrent plus tôt les schémas, réduisent les suppositions et construisent des routines plus sereines au fil du temps.",
      demoLabel: "Exemple d’insight",
      demoTitle: "Ce que les parents reçoivent vraiment",
      demoText:
        "« Votre bébé a moins dormi après une sieste plus tardive hier. Essayez une prochaine fenêtre de sommeil plus tôt et gardez une routine du soir stable ce soir. »",
      point1: "Moins d’hésitation",
      point2: "Plus de structure",
      point3: "Des décisions quotidiennes plus claires",
    },
    vision: {
      eyebrow: "Une vision premium de la parentalité moderne",
      title1: "Construire un avenir lumineux",
      title2:
        "pour vos enfants : des stratégies essentielles pour les parents.",
      text:
        "Être parent, ce n’est pas seulement traverser la journée. C’est construire des rythmes stables, des routines plus saines, de meilleures décisions et un environnement plus serein qui soutient la croissance à long terme de votre enfant avec plus de clarté et moins de stress.",
      why: "Pourquoi c’est important",
      systemTitle:
        "Pas seulement du tracking. Un vrai système parental premium.",
      systemText:
        "Smart Baby System aide les parents à passer de notes dispersées et d’outils isolés à une expérience connectée où le sommeil, l’alimentation, les soins, l’IA et même les interactions marketplace travaillent ensemble pour créer de meilleures décisions quotidiennes et un parcours parental plus confiant.",
      calmTitle: "Routines apaisées",
      calmText: "Moins de chaos, plus de fluidité prévisible au quotidien.",
      signalsTitle: "Meilleurs signaux",
      signalsText: "Voyez plus tôt ce qui compte et réagissez avec confiance.",
      longTermTitle: "Clarté à long terme",
      longTermText:
        "Construisez de meilleures habitudes pour soutenir la croissance future.",
      sleepLabel: "Sommeil + rythme",
      sleepTitle:
        "Un meilleur repos commence par une meilleure structure.",
      sleepText:
        "Un rythme de sommeil plus calme améliore la récupération, la cohérence des routines et la qualité de toute la journée pour les parents comme pour les enfants.",
      foodLabel: "Alimentation + soins",
      foodTitle:
        "La cohérence quotidienne crée des bases plus solides.",
      foodText:
        "Les repas, les routines et les habitudes de soins façonnent le confort, le comportement et la stabilité d’une manière que les parents peuvent mieux comprendre avec le bon système.",
      ecoLabel: "Avantage écosystème",
      ecoTitle:
        "Un seul système peut soutenir tout le parcours parental.",
      ecoText:
        "Avec la guidance IA, des modules connectés et un marketplace de confiance, le produit devient plus qu’une app — il devient un écosystème parental premium.",
    },
    pricing: {
      eyebrow: "Tarifs",
      title:
        "Choisissez le niveau de guidance dont votre famille a besoin.",
      text:
        "Commencez simplement, puis débloquez plus de profondeur IA, une meilleure planification et un système parental plus complet.",
      badge: "Résiliable à tout moment",
      monthly: "Abonnement mensuel",
      yearly: "Bientôt : économies en annuel",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicPrice: "€7",
      premiumPrice: "€11",
      elitePrice: "€15",
      perMonth: "/mois",
      basicSub:
        "Accès essentiel pour les parents qui veulent le système de base.",
      premiumSub:
        "Le meilleur équilibre entre valeur, planification IA et soutien parental premium.",
      eliteSub:
        "Pour les familles qui veulent la guidance la plus approfondie et les insights les plus précieux.",
      basic1: "Accès aux modules principaux",
      basic2: "Logs de base et vue simple",
      basic3: "Guidance IA courte",
      basic4: "Bon point de départ pour le suivi quotidien",
      premium1: "Plans d’action IA complets",
      premium2: "Modules Sommeil / Alimentation / Soins",
      premium3: "Expérience dashboard premium",
      premium4: "Guidance et planification plus fortes",
      elite1: "Tout ce qui est dans Premium",
      elite2: "Insights IA avancés",
      elite3: "Recommandations plus poussées",
      elite4: "Expérience la plus complète pour un usage sérieux",
      basicFor: "Idéal pour essayer le système",
      premiumFor: "Idéal pour la plupart des familles",
      eliteFor: "Idéal pour une clarté maximale",
      mostPopular: "Le plus populaire",
      chooseBasic: "Commencer Basic",
      choosePremium: "Commencer Premium",
      getElite: "Commencer Elite",
      noteTitle: "Ce qui se passe ensuite",
      note1: "Choisissez votre formule",
      note2: "Créez le profil de votre bébé",
      note3: "Commencez le suivi et débloquez la guidance IA",
      footnote:
        "L’intégration de paiement peut être connectée à Stripe à l’étape suivante sans changer cette structure tarifaire.",
    },
    cta: {
      eyebrow: "Commencez maintenant",
      title:
        "Transformez les données quotidiennes de bébé en décisions parentales plus sereines.",
      text:
        "Ouvrez l’application, choisissez une formule et construisez un système plus intelligent autour de votre vraie vie quotidienne.",
      openDashboard: "Ouvrir le dashboard",
      exploreMarketplace: "Explorer le marketplace",
    },
    footer: {
      text:
        "Une application parentale premium conçue pour rendre le sommeil, l’alimentation, les soins, l’IA et le marketplace parent-à-parent plus calmes, plus clairs et plus connectés.",
      instagram: "Instagram",
      facebook: "Facebook",
      contact: "Contact",
      product: "Produit",
      app: "App",
      getStarted: "Commencer",
      dashboard: "Dashboard",
      sleep: "Sommeil",
      food: "Alimentation",
      care: "Soins",
      marketplace: "Marketplace",
      onboarding: "Onboarding",
      login: "Connexion",
      messages: "Messages",
      bottom:
        "© 2026 Smart Baby System. Conçu pour une parentalité moderne et apaisée.",
    },
  },
} as const;

export default function Home() {
  const [question, setQuestion] = useState("");
  const router = useRouter();
  const params = useParams();

  const rawLocale =
    typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale)
    ? (rawLocale as Locale)
    : "en";
  const t = copy[locale];

  function handleAskAI() {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    router.push(`/${locale}/dashboard?q=${encodeURIComponent(cleanQuestion)}`);
  }

  function choosePlanAndGo(plan: PlanTier) {
    localStorage.setItem("smartBabyPlanTier", plan);
    router.push(`/${locale}/onboarding?plan=${plan}`);
  }

  return (
    <main className="homePremium">
      <header className="homePremium__nav">
        <div className="homePremium__navInner">
          <a href={`/${locale}`} className="homePremium__brand">
            <div className="homePremium__brandLogo">SB</div>
            <div>
              <p className="homePremium__brandTitle">Smart Baby</p>
              <span className="homePremium__brandSub">System</span>
            </div>
          </a>

          <nav className="homePremium__navLinks">
            <a href="#overview">{t.nav.overview}</a>
            <a href="#modules">{t.nav.modules}</a>
            <a href="#ai">{t.nav.ai}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#proof">{t.nav.proof}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a
              href="/marketplace"
              style={{
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              {t.nav.marketplace}
            </a>
          </nav>

          <div className="homePremium__navActions">
            <a href={`/${locale}/login`} className="homePremium__navTextBtn">
              {t.nav.login}
            </a>

            <div className="homePremium__langSwitch">
              <a
                href="/en"
                className="homePremium__navTextBtn"
                style={{
                  fontWeight: locale === "en" ? 800 : 600,
                  color: locale === "en" ? "#0f172a" : undefined,
                }}
              >
                EN
              </a>
              <a
                href="/fr"
                className="homePremium__navTextBtn"
                style={{
                  fontWeight: locale === "fr" ? 800 : 600,
                  color: locale === "fr" ? "#0f172a" : undefined,
                }}
              >
                FR
              </a>
            </div>

            <button
              type="button"
              className="homePremium__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.nav.startFree}
            </button>
          </div>
        </div>
      </header>

      <section
        className="homePremium__hero homePremium__hero--luxury"
        id="overview"
      >
        <div className="homePremium__heroBackdrop" />

        <div className="homePremium__heroContent">
          <div className="homePremium__heroBadge">
            <span className="homePremium__heroBadgeDot" />
            {t.hero.badge}
          </div>

          <h1
            style={{
              fontSize: "clamp(38px, 5vw, 66px)",
              lineHeight: 0.98,
              letterSpacing: "-0.05em",
              marginBottom: "18px",
              color: "#0f172a",
              maxWidth: "760px",
            }}
          >
            {t.hero.title1}
            <span
              style={{
                display: "block",
                marginTop: "8px",
                color: "#4f6f92",
                fontWeight: 700,
                fontSize: "0.82em",
                lineHeight: 1.02,
                letterSpacing: "-0.04em",
              }}
            >
              {t.hero.title2}
            </span>
          </h1>

          <p
            style={{
              maxWidth: "760px",
              fontSize: "18px",
              lineHeight: 1.75,
              color: "#526377",
              marginBottom: "14px",
            }}
          >
            {t.hero.text}
          </p>

          <p
            style={{
              marginBottom: "18px",
              color: "#6b7c8f",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {t.hero.trust}
          </p>

          <div className="homePremium__askBox">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAI();
              }}
              className="homePremium__askForm"
            >
              <input
                type="text"
                name="smartBabyQuestion"
                autoComplete="off"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.hero.askPlaceholder}
                className="homePremium__askInput"
              />

              <button type="submit" className="homePremium__primaryBtn">
                {t.hero.askAi}
              </button>
            </form>
          </div>

          <div className="homePremium__heroActions">
            <button
              type="button"
              className="homePremium__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.hero.startFree}
            </button>

            <a href="#how" className="homePremium__ghostBtn">
              {t.hero.seeHow}
            </a>
          </div>

          <div className="homePremium__grid3" style={{ marginTop: "18px" }}>
            {[t.hero.benefit1, t.hero.benefit2, t.hero.benefit3].map((item) => (
              <div key={item} className="homePremium__simpleCard">
                <strong
                  style={{
                    display: "block",
                    fontSize: "15px",
                    color: "#0f172a",
                  }}
                >
                  {item}
                </strong>
              </div>
            ))}
          </div>

          <div className="homePremium__grid3">
            {[
              {
                label: t.hero.statLabel1,
                value: t.hero.statValue1,
                text: t.hero.statText1,
              },
              {
                label: t.hero.statLabel2,
                value: t.hero.statValue2,
                text: t.hero.statText2,
              },
              {
                label: t.hero.statLabel3,
                value: t.hero.statValue3,
                text: t.hero.statText3,
              },
            ].map((item) => (
              <div key={item.label} className="homePremium__simpleCard">
                <span
                  style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#73869a",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </span>
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "20px",
                    color: "#0f172a",
                  }}
                >
                  {item.value}
                </strong>
                <span
                  style={{
                    color: "#657589",
                    fontSize: "14px",
                    lineHeight: 1.6,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="homePremium__heroPanel">
          <div className="homePremium__heroPanelShell">
            <div className="homePremium__heroPanelTop">
              <div className="homePremium__windowDots">
                <span />
                <span />
                <span />
              </div>
              <div className="homePremium__showcaseTitle">
                {t.hero.previewEyebrow}
              </div>
            </div>

            <div className="homePremium__heroPanelBody">
              <div className="homePremium__heroPanelMainCard">
                <div className="homePremium__heroPanelCardHead">
                  <div>
                    <p className="homePremium__cardLabel">{t.hero.scoreTitle}</p>
                    <h3>{t.hero.previewTitle}</h3>
                  </div>
                  <div className="homePremium__heroPanelPill">Premium</div>
                </div>

                <p className="homePremium__heroPanelText">
                  {t.hero.previewText}
                </p>

                <div className="homePremium__heroPanelMiniStats">
                  <div className="homePremium__heroPanelMiniStat">
                    <span>{t.hero.score1}</span>
                    <strong>82</strong>
                  </div>
                  <div className="homePremium__heroPanelMiniStat">
                    <span>{t.hero.score2}</span>
                    <strong>76</strong>
                  </div>
                  <div className="homePremium__heroPanelMiniStat">
                    <span>{t.hero.score3}</span>
                    <strong>84</strong>
                  </div>
                </div>
              </div>

              <div className="homePremium__heroPanelRow">
                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">✨</span>
                    <span className="homePremium__dashboardBadge">
                      {t.hero.aiCardBadge}
                    </span>
                  </div>
                  <h4>{t.hero.aiCardTitle}</h4>
                  <p>{t.hero.aiCardText}</p>
                </div>

                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">🛍</span>
                    <span className="homePremium__dashboardBadge">
                      {t.hero.marketCardBadge}
                    </span>
                  </div>
                  <h4>{t.hero.marketCardTitle}</h4>
                  <p>{t.hero.marketCardText}</p>
                </div>
              </div>

              <div className="homePremium__heroPanelRow">
                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">💬</span>
                    <span className="homePremium__dashboardBadge">
                      {t.hero.chatCardBadge}
                    </span>
                  </div>
                  <h4>{t.hero.chatCardTitle}</h4>
                  <p>{t.hero.chatCardText}</p>
                </div>

                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">◌</span>
                    <span className="homePremium__dashboardBadge">
                      {t.hero.scoreTitle}
                    </span>
                  </div>
                  <h4>{t.hero.scoreTitle}</h4>
                  <p>{t.hero.scoreText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homePremium__section" id="how">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.how.eyebrow}</p>
          <h2>{t.how.title}</h2>
          <p>{t.how.text}</p>
        </div>

        <div className="homePremium__splitGrid">
          <div className="homePremium__stackGap">
            <div className="homePremium__stepsGrid" style={{ gridTemplateColumns: "1fr" }}>
              <article className="homePremium__stepCard">
                <span className="homePremium__stepNumber">01</span>
                <h3>{t.how.step1Title}</h3>
                <p>{t.how.step1Text}</p>
              </article>

              <article className="homePremium__stepCard">
                <span className="homePremium__stepNumber">02</span>
                <h3>{t.how.step2Title}</h3>
                <p>{t.how.step2Text}</p>
              </article>

              <article className="homePremium__stepCard">
                <span className="homePremium__stepNumber">03</span>
                <h3>{t.how.step3Title}</h3>
                <p>{t.how.step3Text}</p>
              </article>
            </div>

            <div className="homePremium__grid3">
              {[
                {
                  label: t.how.card1Label,
                  title: t.how.card1Title,
                  text: t.how.card1Text,
                },
                {
                  label: t.how.card2Label,
                  title: t.how.card2Title,
                  text: t.how.card2Text,
                },
                {
                  label: t.how.card3Label,
                  title: t.how.card3Title,
                  text: t.how.card3Text,
                },
              ].map((item) => (
                <div key={item.label} className="homePremium__simpleCard">
                  <p
                    style={{
                      marginBottom: "8px",
                      fontSize: "12px",
                      fontWeight: 800,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#7288a3",
                    }}
                  >
                    {item.label}
                  </p>
                  <h4
                    style={{
                      fontSize: "20px",
                      marginBottom: "8px",
                      color: "#0f172a",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p
                    style={{
                      color: "#607082",
                      lineHeight: 1.7,
                      fontSize: "14px",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="homePremium__padLg"
            style={{
              background:
                "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                style={{
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#7288a3",
                }}
              >
                {t.how.demoLabel}
              </p>

              <h3
                style={{
                  fontSize: "30px",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  marginBottom: "14px",
                  color: "#0f172a",
                }}
              >
                {t.how.demoTitle}
              </h3>

              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.85,
                  fontSize: "17px",
                  marginBottom: "18px",
                }}
              >
                {t.how.demoText}
              </p>
            </div>

            <div className="homePremium__grid3">
              {[t.how.point1, t.how.point2, t.how.point3].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "14px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.86)",
                    border: "1px solid #e5edf5",
                    textAlign: "center",
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="homePremium__section" id="proof">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.trust.eyebrow}</p>
          <h2>{t.trust.title}</h2>
          <p>{t.trust.text}</p>
        </div>

        <div className="homePremium__grid3" style={{ marginBottom: "18px" }}>
          {[
            { title: t.trust.card1Title, text: t.trust.card1Text },
            { title: t.trust.card2Title, text: t.trust.card2Text },
            { title: t.trust.card3Title, text: t.trust.card3Text },
          ].map((item) => (
            <div
              key={item.title}
              className="homePremium__simpleCard"
              style={{ padding: "22px", borderRadius: "24px" }}
            >
              <h3
                style={{
                  fontSize: "22px",
                  marginBottom: "10px",
                  color: "#0f172a",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.75,
                  fontSize: "15px",
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="homePremium__grid3">
          {[t.trust.quote1, t.trust.quote2, t.trust.quote3].map((quote) => (
            <div
              key={quote}
              className="homePremium__simpleCard"
              style={{
                padding: "22px",
                borderRadius: "24px",
                background:
                  "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
              }}
            >
              <p
                style={{
                  color: "#415366",
                  lineHeight: 1.8,
                  fontSize: "16px",
                  fontWeight: 600,
                }}
              >
                {quote}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="homePremium__section" id="modules">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.modules.eyebrow}</p>
          <h2>{t.modules.title}</h2>
          <p>{t.modules.text}</p>
        </div>

        <div className="homePremium__moduleGrid">
          <a href={`/${locale}/sleep`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">☾</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.sleepTitle}</h3>
            <p>{t.modules.sleepText}</p>
          </a>

          <a href={`/${locale}/food`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">◔</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.foodTitle}</h3>
            <p>{t.modules.foodText}</p>
          </a>

          <a href={`/${locale}/care`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">✦</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.careTitle}</h3>
            <p>{t.modules.careText}</p>
          </a>
        </div>
      </section>

      <section className="homePremium__section" id="ai">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.ai.eyebrow}</p>
          <h2>{t.ai.title}</h2>
          <p>{t.ai.text}</p>
        </div>

        <div className="homePremium__previewStrip">
          <div className="homePremium__previewCard homePremium__previewCard--highlight">
            <p className="homePremium__cardLabel">{t.ai.sleepLabel}</p>
            <h3>{t.ai.sleepQuestion}</h3>
            <p>{t.ai.sleepText}</p>
          </div>

          <div className="homePremium__previewCard">
            <p className="homePremium__cardLabel">{t.ai.foodLabel}</p>
            <h3>{t.ai.foodQuestion}</h3>
            <p>{t.ai.foodText}</p>
          </div>

          <div className="homePremium__previewCard">
            <p className="homePremium__cardLabel">{t.ai.careLabel}</p>
            <h3>{t.ai.careQuestion}</h3>
            <p>{t.ai.careText}</p>
          </div>
        </div>
      </section>

      <section className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.vision.eyebrow}</p>

          <h2
            style={{
              maxWidth: "980px",
              fontSize: "clamp(34px, 4.8vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.05em",
              marginBottom: "16px",
            }}
          >
            {t.vision.title1}
            <span
              style={{
                display: "block",
                marginTop: "8px",
                color: "#6b84a2",
                fontWeight: 600,
                fontSize: "0.72em",
                lineHeight: 1.1,
              }}
            >
              {t.vision.title2}
            </span>
          </h2>

          <p
            style={{
              maxWidth: "760px",
              fontSize: "19px",
              lineHeight: 1.85,
              color: "#5b6b7e",
            }}
          >
            {t.vision.text}
          </p>
        </div>

        <div
          className="homePremium__splitGrid"
          style={{ gridTemplateColumns: "1.15fr 0.85fr" }}
        >
          <div
            className="homePremium__padLg"
            style={{
              background:
                "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 18px 45px rgba(15, 23, 42, 0.05)",
            }}
          >
            <p
              style={{
                marginBottom: "12px",
                fontSize: "12px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#7288a3",
              }}
            >
              {t.vision.why}
            </p>

            <h3
              style={{
                fontSize: "30px",
                lineHeight: 1.08,
                letterSpacing: "-0.03em",
                marginBottom: "14px",
                color: "#0f172a",
              }}
            >
              {t.vision.systemTitle}
            </h3>

            <p
              style={{
                color: "#607082",
                lineHeight: 1.85,
                fontSize: "17px",
                marginBottom: "18px",
                maxWidth: "760px",
              }}
            >
              {t.vision.systemText}
            </p>

            <div className="homePremium__grid3">
              {[
                { title: t.vision.calmTitle, text: t.vision.calmText },
                { title: t.vision.signalsTitle, text: t.vision.signalsText },
                { title: t.vision.longTermTitle, text: t.vision.longTermText },
              ].map((item) => (
                <div
                  key={item.title}
                  className="homePremium__simpleCard"
                  style={{ padding: "16px" }}
                >
                  <strong
                    style={{
                      display: "block",
                      marginBottom: "6px",
                      fontSize: "17px",
                      color: "#0f172a",
                    }}
                  >
                    {item.title}
                  </strong>
                  <span
                    style={{
                      color: "#6b7c8f",
                      lineHeight: 1.6,
                      fontSize: "14px",
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="homePremium__stackGap">
            {[
              {
                label: t.vision.sleepLabel,
                title: t.vision.sleepTitle,
                text: t.vision.sleepText,
                gradient: false,
              },
              {
                label: t.vision.foodLabel,
                title: t.vision.foodTitle,
                text: t.vision.foodText,
                gradient: false,
              },
              {
                label: t.vision.ecoLabel,
                title: t.vision.ecoTitle,
                text: t.vision.ecoText,
                gradient: true,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="homePremium__simpleCard"
                style={{
                  padding: "22px",
                  borderRadius: "26px",
                  background: item.gradient
                    ? "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)"
                    : "rgba(255,255,255,0.9)",
                }}
              >
                <p
                  style={{
                    marginBottom: "8px",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#7288a3",
                  }}
                >
                  {item.label}
                </p>
                <h4
                  style={{
                    fontSize: "22px",
                    marginBottom: "8px",
                    color: "#0f172a",
                  }}
                >
                  {item.title}
                </h4>
                <p
                  style={{
                    color: "#607082",
                    lineHeight: 1.7,
                  }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.pricing.eyebrow}</p>
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.text}</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.16)",
              color: "#334155",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {t.pricing.badge}
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              background: "rgba(239,248,255,0.96)",
              border: "1px solid rgba(148,163,184,0.16)",
              color: "#2563eb",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {t.pricing.monthly}
          </div>

          <div
            style={{
              padding: "10px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.16)",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 700,
            }}
          >
            {t.pricing.yearly}
          </div>
        </div>

        <div className="homePremium__pricingGrid">
          <article className="homePremium__priceCard">
            <p className="homePremium__priceLabel">{t.pricing.basic}</p>
            <h3>
              {t.pricing.basicPrice}
              <span>{t.pricing.perMonth}</span>
            </h3>
            <p className="homePremium__priceSub">{t.pricing.basicSub}</p>

            <div
              style={{
                marginBottom: "16px",
                padding: "10px 12px",
                borderRadius: "14px",
                background: "#f8fafc",
                color: "#334155",
                fontSize: "13px",
                fontWeight: 700,
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              {t.pricing.basicFor}
            </div>

            <ul className="homePremium__priceList">
              <li>{t.pricing.basic1}</li>
              <li>{t.pricing.basic2}</li>
              <li>{t.pricing.basic3}</li>
              <li>{t.pricing.basic4}</li>
            </ul>

            <button
              type="button"
              className="homePremium__ghostBtn homePremium__priceBtn"
              onClick={() => choosePlanAndGo("basic")}
            >
              {t.pricing.chooseBasic}
            </button>
          </article>

          <article className="homePremium__priceCard homePremium__priceCard--featured">
            <div className="homePremium__priceBadge">{t.pricing.mostPopular}</div>
            <p className="homePremium__priceLabel">{t.pricing.premium}</p>
            <h3>
              {t.pricing.premiumPrice}
              <span>{t.pricing.perMonth}</span>
            </h3>
            <p className="homePremium__priceSub">{t.pricing.premiumSub}</p>

            <div
              style={{
                marginBottom: "16px",
                padding: "10px 12px",
                borderRadius: "14px",
                background: "rgba(239,248,255,0.96)",
                color: "#2563eb",
                fontSize: "13px",
                fontWeight: 800,
                border: "1px solid rgba(37,99,235,0.14)",
              }}
            >
              {t.pricing.premiumFor}
            </div>

            <ul className="homePremium__priceList">
              <li>{t.pricing.premium1}</li>
              <li>{t.pricing.premium2}</li>
              <li>{t.pricing.premium3}</li>
              <li>{t.pricing.premium4}</li>
            </ul>

            <button
              type="button"
              className="homePremium__primaryBtn homePremium__priceBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.pricing.choosePremium}
            </button>
          </article>

          <article className="homePremium__priceCard">
            <p className="homePremium__priceLabel">{t.pricing.elite}</p>
            <h3>
              {t.pricing.elitePrice}
              <span>{t.pricing.perMonth}</span>
            </h3>
            <p className="homePremium__priceSub">{t.pricing.eliteSub}</p>

            <div
              style={{
                marginBottom: "16px",
                padding: "10px 12px",
                borderRadius: "14px",
                background: "#f8fafc",
                color: "#334155",
                fontSize: "13px",
                fontWeight: 700,
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              {t.pricing.eliteFor}
            </div>

            <ul className="homePremium__priceList">
              <li>{t.pricing.elite1}</li>
              <li>{t.pricing.elite2}</li>
              <li>{t.pricing.elite3}</li>
              <li>{t.pricing.elite4}</li>
            </ul>

            <button
              type="button"
              className="homePremium__ghostBtn homePremium__priceBtn"
              onClick={() => choosePlanAndGo("elite")}
            >
              {t.pricing.getElite}
            </button>
          </article>
        </div>

        <div
          className="homePremium__padLg"
          style={{
            marginTop: "22px",
            background:
              "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
            border: "1px solid rgba(148,163,184,0.16)",
            boxShadow: "0 16px 38px rgba(87,109,138,0.05)",
          }}
        >
          <p
            style={{
              marginBottom: "12px",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#7288a3",
            }}
          >
            {t.pricing.noteTitle}
          </p>

          <div className="homePremium__grid3" style={{ marginBottom: "14px" }}>
            {[t.pricing.note1, t.pricing.note2, t.pricing.note3].map(
              (item, index) => (
                <div
                  key={item}
                  style={{
                    padding: "16px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.88)",
                    border: "1px solid #e5edf5",
                  }}
                >
                  <div
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "999px",
                      display: "grid",
                      placeItems: "center",
                      marginBottom: "10px",
                      background: "#0f172a",
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "13px",
                    }}
                  >
                    {index + 1}
                  </div>
                  <p
                    style={{
                      color: "#334155",
                      lineHeight: 1.6,
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {item}
                  </p>
                </div>
              )
            )}
          </div>

          <p
            style={{
              color: "#64748b",
              fontSize: "14px",
              lineHeight: 1.7,
            }}
          >
            {t.pricing.footnote}
          </p>
        </div>
      </section>

      <section className="homePremium__section homePremium__section--cta">
        <div className="homePremium__ctaBox">
          <p className="homePremium__eyebrow">{t.cta.eyebrow}</p>
          <h2>{t.cta.title}</h2>
          <p>{t.cta.text}</p>

          <div className="homePremium__ctaActions">
            <button
              type="button"
              className="homePremium__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.nav.startFree}
            </button>
            <a href={`/${locale}/dashboard`} className="homePremium__ghostBtn">
              {t.cta.openDashboard}
            </a>
            <a href="/marketplace" className="homePremium__ghostBtn">
              {t.cta.exploreMarketplace}
            </a>
          </div>
        </div>
      </section>

      <footer className="homePremium__footer">
        <div className="homePremium__footerInner">
          <div className="homePremium__footerBrandCol">
            <a
              href={`/${locale}`}
              className="homePremium__brand homePremium__brand--footer"
            >
              <div className="homePremium__brandLogo">SB</div>
              <div>
                <p className="homePremium__brandTitle">Smart Baby</p>
                <span className="homePremium__brandSub">System</span>
              </div>
            </a>

            <p className="homePremium__footerText">{t.footer.text}</p>

            <div className="homePremium__footerSocials">
              <a href="/">{t.footer.instagram}</a>
              <a href="/">{t.footer.facebook}</a>
              <a href="/">{t.footer.contact}</a>
            </div>
          </div>

          <div className="homePremium__footerGrid">
            <div className="homePremium__footerCol">
              <p className="homePremium__footerTitle">{t.footer.product}</p>
              <a href="#overview">{t.nav.overview}</a>
              <a href="#modules">{t.nav.modules}</a>
              <a href="#ai">{t.nav.ai}</a>
              <a href="#how">{t.nav.how}</a>
              <a href="#pricing">{t.nav.pricing}</a>
            </div>

            <div className="homePremium__footerCol">
              <p className="homePremium__footerTitle">{t.footer.app}</p>
              <a href={`/${locale}/dashboard`}>{t.footer.dashboard}</a>
              <a href={`/${locale}/sleep`}>{t.footer.sleep}</a>
              <a href={`/${locale}/food`}>{t.footer.food}</a>
              <a href={`/${locale}/care`}>{t.footer.care}</a>
              <a href="/marketplace">{t.footer.marketplace}</a>
            </div>

            <div className="homePremium__footerCol">
              <p className="homePremium__footerTitle">{t.footer.getStarted}</p>
              <a href={`/${locale}/onboarding`}>{t.footer.onboarding}</a>
              <a href={`/${locale}/login`}>{t.footer.login}</a>
              <a href="/message">{t.footer.messages}</a>
            </div>
          </div>
        </div>

        <div className="homePremium__footerBottom">
          <p>{t.footer.bottom}</p>
        </div>
      </footer>

      <style jsx>{`
        .homePremium {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(166, 210, 255, 0.16), transparent 24%),
            linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%);
          color: #0f172a;
          overflow-x: hidden;
        }

        .homePremium__nav,
        .homePremium__section,
        .homePremium__hero,
        .homePremium__footer {
          overflow: hidden;
        }

        .homePremium__nav {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 20px 24px 0;
          backdrop-filter: blur(8px);
        }

        .homePremium__navInner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 22px;
          padding: 18px 22px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
        }

        .homePremium__brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
          min-width: 0;
        }

        .homePremium__brandLogo {
          width: 62px;
          height: 62px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #8dc5ff 0%, #9fcbf8 100%);
          color: #0f172a;
          font-weight: 800;
          font-size: 20px;
          box-shadow: 0 16px 30px rgba(59, 130, 246, 0.15);
          flex-shrink: 0;
        }

        .homePremium__brandTitle {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.1;
        }

        .homePremium__brandSub {
          font-size: 14px;
          color: #64748b;
          line-height: 1.2;
        }

        .homePremium__navLinks {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          min-width: 0;
          flex-wrap: wrap;
        }

        .homePremium__navLinks a {
          text-decoration: none;
          color: #516173;
          font-size: 14px;
          font-weight: 600;
        }

        .homePremium__navLinks a:hover {
          color: #0f172a;
        }

        .homePremium__navActions {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }

        .homePremium__langSwitch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .homePremium__navTextBtn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 46px;
          padding: 10px 14px;
          border-radius: 14px;
          text-decoration: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        .homePremium__navTextBtn:hover {
          background: rgba(148, 163, 184, 0.08);
          color: #0f172a;
        }

        .homePremium__primaryBtn,
        .homePremium__ghostBtn {
          min-height: 50px;
          padding: 14px 20px;
          border-radius: 18px;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
        }

        .homePremium__primaryBtn {
          background: linear-gradient(135deg, #8ec8ff 0%, #a5d4ff 100%);
          color: #0f172a;
          box-shadow: 0 14px 28px rgba(59, 130, 246, 0.18);
        }

        .homePremium__primaryBtn:hover {
          transform: translateY(-1px);
        }

        .homePremium__ghostBtn {
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.04);
        }

        .homePremium__hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 34px 24px 0;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: 22px;
          align-items: stretch;
          position: relative;
        }

        .homePremium__heroBackdrop {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .homePremium__heroContent,
        .homePremium__heroPanel {
          position: relative;
          min-width: 0;
        }

        .homePremium__heroBadge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(239, 248, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.16);
          color: #2563eb;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .homePremium__heroBadgeDot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #2563eb;
          box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.12);
          flex-shrink: 0;
        }

        .homePremium__askBox {
          padding: 12px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.18);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
          backdrop-filter: blur(12px);
          max-width: 760px;
        }

        .homePremium__askForm {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .homePremium__askInput {
          flex: 1;
          min-width: 220px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 14px;
          outline: none;
          background: #fff;
        }

        .homePremium__heroActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .homePremium__grid3 {
          margin-top: 14px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .homePremium__simpleCard {
          padding: 18px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid #e5edf5;
          box-shadow: 0 14px 30px rgba(88, 112, 140, 0.04);
          min-width: 0;
          width: 100%;
        }

        .homePremium__heroPanelShell {
          padding: 22px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 20px 60px rgba(15, 23, 42, 0.06);
          min-width: 0;
          width: 100%;
        }

        .homePremium__heroPanelTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .homePremium__windowDots {
          display: inline-flex;
          gap: 8px;
        }

        .homePremium__windowDots span {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #cbd5e1;
        }

        .homePremium__showcaseTitle {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homePremium__heroPanelBody {
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .homePremium__heroPanelMainCard {
          padding: 22px;
          border-radius: 24px;
          background:
            linear-gradient(135deg, rgba(239, 248, 255, 0.96) 0%, rgba(252, 253, 255, 0.98) 100%);
          border: 1px solid rgba(148, 163, 184, 0.16);
          min-width: 0;
          width: 100%;
        }

        .homePremium__heroPanelCardHead {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 12px;
        }

        .homePremium__heroPanelMainCard h3 {
          margin: 0;
          font-size: 28px;
          line-height: 1.08;
          letter-spacing: -0.03em;
          color: #0f172a;
          overflow-wrap: break-word;
        }

        .homePremium__heroPanelPill {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid #e5edf5;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #2563eb;
          white-space: nowrap;
        }

        .homePremium__cardLabel {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homePremium__heroPanelText {
          color: #607082;
          line-height: 1.75;
          font-size: 15px;
          margin: 0 0 16px;
          overflow-wrap: break-word;
        }

        .homePremium__heroPanelMiniStats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .homePremium__heroPanelMiniStat {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e5edf5;
          min-width: 0;
        }

        .homePremium__heroPanelMiniStat span {
          display: block;
          color: #7288a3;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
          overflow-wrap: break-word;
        }

        .homePremium__heroPanelMiniStat strong {
          font-size: 22px;
          color: #0f172a;
        }

        .homePremium__heroPanelRow {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .homePremium__heroSoftCard {
          padding: 18px;
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
          min-width: 0;
          width: 100%;
        }

        .homePremium__dashboardCardTop {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .homePremium__dashboardIcon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #eef6ff;
        }

        .homePremium__dashboardBadge {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homePremium__heroSoftCard h4 {
          margin: 0 0 8px;
          font-size: 22px;
          line-height: 1.15;
          color: #0f172a;
          overflow-wrap: break-word;
        }

        .homePremium__heroSoftCard p {
          margin: 0;
          color: #607082;
          line-height: 1.75;
          font-size: 14px;
          overflow-wrap: break-word;
        }

        .homePremium__section {
          max-width: 1180px;
          margin: 0 auto;
          padding: 78px 24px 0;
        }

        .homePremium__sectionHead {
          margin-bottom: 26px;
        }

        .homePremium__eyebrow {
          margin: 0 0 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homePremium__sectionHead h2 {
          margin: 0 0 12px;
          font-size: clamp(38px, 5vw, 60px);
          line-height: 1.02;
          letter-spacing: -0.05em;
          color: #0f172a;
          max-width: 960px;
          overflow-wrap: break-word;
        }

        .homePremium__sectionHead p {
          margin: 0;
          max-width: 760px;
          color: #5b6b7e;
          font-size: 18px;
          line-height: 1.8;
          overflow-wrap: break-word;
        }

        .homePremium__splitGrid {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 20px;
          align-items: stretch;
        }

        .homePremium__stackGap {
          display: grid;
          gap: 16px;
          min-width: 0;
        }

        .homePremium__stepsGrid {
          display: grid;
          gap: 16px;
        }

        .homePremium__stepCard {
          padding: 22px;
          border-radius: 26px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 16px 38px rgba(87, 109, 138, 0.05);
          min-width: 0;
          width: 100%;
        }

        .homePremium__stepNumber {
          display: inline-block;
          margin-bottom: 14px;
          color: #7288a3;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .homePremium__stepCard h3 {
          margin: 0 0 10px;
          font-size: 28px;
          line-height: 1.1;
          color: #0f172a;
          overflow-wrap: break-word;
        }

        .homePremium__stepCard p {
          margin: 0;
          color: #607082;
          line-height: 1.8;
          font-size: 16px;
          overflow-wrap: break-word;
        }

        .homePremium__padLg {
          padding: 22px;
          border-radius: 24px;
        }

        .homePremium__moduleGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .homePremium__moduleCard {
          padding: 22px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 16px 38px rgba(87, 109, 138, 0.05);
          text-decoration: none;
          color: inherit;
          min-width: 0;
          width: 100%;
        }

        .homePremium__moduleTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .homePremium__moduleIcon {
          width: 58px;
          height: 58px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: #eef6ff;
          font-size: 28px;
          flex-shrink: 0;
        }

        .homePremium__moduleBadge {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(239, 248, 255, 0.96);
          color: #2e5f8f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .homePremium__moduleCard h3 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.08;
          color: #0f172a;
          overflow-wrap: break-word;
        }

        .homePremium__moduleCard p {
          margin: 0;
          color: #607082;
          line-height: 1.85;
          font-size: 16px;
          overflow-wrap: break-word;
        }

        .homePremium__previewStrip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .homePremium__previewCard {
          padding: 24px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 16px 38px rgba(87, 109, 138, 0.05);
          min-width: 0;
          width: 100%;
        }

        .homePremium__previewCard--highlight {
          background:
            linear-gradient(135deg, rgba(239, 248, 255, 0.96) 0%, rgba(252, 253, 255, 0.98) 100%);
        }

        .homePremium__previewCard h3 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.08;
          color: #0f172a;
          overflow-wrap: break-word;
        }

        .homePremium__previewCard p {
          margin: 0;
          color: #607082;
          line-height: 1.85;
          font-size: 16px;
          overflow-wrap: break-word;
        }

        .homePremium__pricingGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .homePremium__priceCard {
          position: relative;
          padding: 24px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 16px 38px rgba(87, 109, 138, 0.05);
          min-width: 0;
          width: 100%;
        }

        .homePremium__priceCard--featured {
          background:
            linear-gradient(135deg, rgba(239, 248, 255, 0.96) 0%, rgba(252, 253, 255, 0.98) 100%);
          border: 1px solid rgba(37, 99, 235, 0.16);
        }

        .homePremium__priceBadge {
          position: absolute;
          top: 18px;
          right: 18px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #0f172a;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .homePremium__priceLabel {
          margin: 0 0 8px;
          color: #7288a3;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .homePremium__priceCard h3 {
          margin: 0 0 10px;
          font-size: 42px;
          line-height: 1;
          color: #0f172a;
          overflow-wrap: break-word;
        }

        .homePremium__priceCard h3 span {
          font-size: 16px;
          color: #64748b;
          font-weight: 700;
          margin-left: 6px;
        }

        .homePremium__priceSub {
          margin: 0 0 16px;
          color: #607082;
          line-height: 1.75;
          font-size: 15px;
          overflow-wrap: break-word;
        }

        .homePremium__priceList {
          margin: 0 0 18px;
          padding-left: 18px;
          color: #334155;
          display: grid;
          gap: 10px;
          line-height: 1.7;
          font-size: 15px;
        }

        .homePremium__priceBtn {
          width: 100%;
        }

        .homePremium__section--cta {
          padding-bottom: 42px;
        }

        .homePremium__ctaBox {
          padding: 28px;
          border-radius: 30px;
          background:
            linear-gradient(135deg, rgba(239, 248, 255, 0.96) 0%, rgba(252, 253, 255, 0.98) 100%);
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
        }

        .homePremium__ctaBox h2 {
          margin: 0 0 12px;
          font-size: clamp(34px, 4.6vw, 56px);
          line-height: 1.02;
          letter-spacing: -0.05em;
          color: #0f172a;
          max-width: 840px;
          overflow-wrap: break-word;
        }

        .homePremium__ctaBox p {
          margin: 0;
          color: #5b6b7e;
          line-height: 1.8;
          font-size: 17px;
          max-width: 760px;
          overflow-wrap: break-word;
        }

        .homePremium__ctaActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .homePremium__footer {
          padding: 0 24px 28px;
        }

        .homePremium__footerInner {
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px;
          border-radius: 30px;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
        }

        .homePremium__footerBrandCol {
          min-width: 0;
        }

        .homePremium__footerText {
          margin: 18px 0;
          color: #607082;
          line-height: 1.8;
          font-size: 15px;
          max-width: 520px;
          overflow-wrap: break-word;
        }

        .homePremium__footerSocials {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
        }

        .homePremium__footerSocials a,
        .homePremium__footerCol a {
          text-decoration: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .homePremium__footerGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .homePremium__footerCol {
          display: grid;
          gap: 12px;
          min-width: 0;
        }

        .homePremium__footerTitle {
          margin: 0 0 4px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homePremium__footerBottom {
          max-width: 1180px;
          margin: 14px auto 0;
          padding: 0 4px;
        }

        .homePremium__footerBottom p {
          margin: 0;
          color: #7288a3;
          font-size: 13px;
          line-height: 1.7;
        }

        @media (max-width: 1100px) {
          .homePremium__hero {
            grid-template-columns: 1fr;
          }

          .homePremium__splitGrid {
            grid-template-columns: 1fr !important;
          }

          .homePremium__heroPanelRow {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .homePremium__navInner {
            grid-template-columns: 1fr;
            gap: 16px;
            align-items: stretch;
          }

          .homePremium__navLinks {
            display: none;
          }

          .homePremium__navActions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1.4fr;
            gap: 12px;
            align-items: center;
          }

          .homePremium__moduleGrid,
          .homePremium__previewStrip,
          .homePremium__pricingGrid,
          .homePremium__footerGrid,
          .homePremium__grid3 {
            grid-template-columns: 1fr;
          }

          .homePremium__footerInner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .homePremium {
            overflow-x: hidden !important;
          }

          .homePremium__nav,
          .homePremium__section,
          .homePremium__hero,
          .homePremium__footer {
            overflow: hidden !important;
          }

          .homePremium__nav {
            padding: 14px 16px 0;
          }

          .homePremium__section,
          .homePremium__hero,
          .homePremium__footer {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }

          .homePremium__navInner {
            padding: 18px;
            border-radius: 24px;
            gap: 14px;
          }

          .homePremium__brandLogo {
            width: 64px;
            height: 64px;
            font-size: 20px;
          }

          .homePremium__brandTitle {
            font-size: 18px;
          }

          .homePremium__brandSub {
            font-size: 14px;
          }

          .homePremium__navActions {
            grid-template-columns: 1fr 1fr 1.4fr;
            gap: 10px;
          }

          .homePremium__navTextBtn,
          .homePremium__primaryBtn,
          .homePremium__ghostBtn {
            min-height: 48px;
            padding: 12px 14px;
            font-size: 14px;
          }

          .homePremium__hero {
            padding-top: 24px;
            gap: 18px;
          }

          .homePremium__heroContent h1 {
            font-size: clamp(34px, 10vw, 48px) !important;
          }

          .homePremium__sectionHead h2,
          .homePremium__ctaBox h2 {
            font-size: clamp(30px, 9vw, 42px) !important;
            line-height: 1.04 !important;
          }

          .homePremium__sectionHead p,
          .homePremium__ctaBox p {
            font-size: 16px !important;
            line-height: 1.75 !important;
          }

          .homePremium__askForm {
            display: grid;
            grid-template-columns: 1fr;
          }

          .homePremium__askInput {
            min-width: 0;
            width: 100%;
          }

          .homePremium__heroActions,
          .homePremium__ctaActions {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .homePremium__heroPanelMiniStats,
          .homePremium__moduleGrid,
          .homePremium__previewStrip,
          .homePremium__pricingGrid,
          .homePremium__footerGrid,
          .homePremium__stepsGrid,
          .homePremium__grid3,
          .homePremium__heroPanelRow {
            grid-template-columns: 1fr !important;
          }

          .homePremium__footerInner,
          .homePremium__splitGrid,
          .homePremium__hero {
            grid-template-columns: 1fr !important;
          }

          .homePremium__simpleCard,
          .homePremium__stepCard,
          .homePremium__previewCard,
          .homePremium__moduleCard,
          .homePremium__priceCard,
          .homePremium__heroSoftCard,
          .homePremium__heroPanelMainCard,
          .homePremium__ctaBox,
          .homePremium__heroPanelShell {
            min-width: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }

          .homePremium__heroPanelMainCard h3,
          .homePremium__previewCard h3,
          .homePremium__stepCard h3,
          .homePremium__moduleCard h3,
          .homePremium__heroSoftCard h4 {
            font-size: 28px !important;
            line-height: 1.08 !important;
            overflow-wrap: break-word !important;
          }

          .homePremium__heroPanelText,
          .homePremium__previewCard p,
          .homePremium__moduleCard p,
          .homePremium__stepCard p,
          .homePremium__priceSub,
          .homePremium__footerText {
            font-size: 15px !important;
            line-height: 1.75 !important;
            overflow-wrap: break-word !important;
          }

          .homePremium__priceCard h3 {
            font-size: 34px !important;
          }

          .homePremium__heroPanelCardHead {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .homePremium__heroPanelShell {
            padding: 18px;
          }

          .homePremium__heroPanelMainCard {
            padding: 18px;
          }

          .homePremium__section {
            padding-top: 56px;
          }
        }
      `}</style>
    </main>
  );
}