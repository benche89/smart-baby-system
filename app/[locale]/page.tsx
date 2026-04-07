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
      marketplace: "Marketplace",
      login: "Log in",
      startFree: "Start free",
    },
    hero: {
      badge: "AI-powered parenting guidance",
      title1: "Understand your baby.",
      title2: "Not just track.",
      text:
        "Stop guessing why your baby cries, wakes, or refuses to eat. Smart Baby System turns daily sleep, food and care data into clear AI-powered insights, so parents can make calmer decisions with more confidence.",
      trust:
        "Built for modern parents who want clarity, not confusion.",
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
      statText3: "Daily consistency becomes easier to understand and improve.",
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
      careText: "Get calmer transitions, consistency ideas and daily care structure.",
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
      text: "Start simple, then unlock more AI depth and better daily planning.",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicSub: "Essential access for parents who want the core system.",
      premiumSub:
        "Best balance of value, AI planning and premium parenting support.",
      eliteSub:
        "For families who want the deepest guidance and highest-value insights.",
      basic1: "Core module access",
      basic2: "Basic logs",
      basic3: "Short AI guidance",
      basic4: "Simple overview",
      premium1: "Full AI action plans",
      premium2: "Sleep / Food / Care modules",
      premium3: "Premium dashboard experience",
      premium4: "Better daily guidance",
      elite1: "Everything in Premium",
      elite2: "Advanced AI insights",
      elite3: "Deeper recommendations",
      elite4: "Highest-value experience",
      mostPopular: "Most popular",
      chooseBasic: "Choose Basic",
      choosePremium: "Choose Premium",
      getElite: "Get Elite",
    },
    how: {
      eyebrow: "How it works",
      title: "Simple for parents. Strong underneath.",
      step1Title: "Choose a plan",
      step1Text: "Start with the level of guidance that fits your family best.",
      step2Title: "Set up your profile",
      step2Text: "Add your baby’s context so the system can personalize guidance.",
      step3Title: "Use the full ecosystem",
      step3Text:
        "Track sleep, food, care and explore the marketplace in one connected experience.",
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
      statText1: "Les dernières siestes et fenêtres d’éveil sont reliées automatiquement.",
      statLabel2: "Rythme alimentaire",
      statValue2: "Plus intelligent",
      statText2:
        "Les repas et réactions sont transformés en guidance utile pour la journée.",
      statLabel3: "Routine de soins",
      statValue3: "Plus sereine",
      statText3: "La cohérence quotidienne devient plus facile à comprendre et à améliorer.",
      previewEyebrow: "Aperçu du produit",
      previewTitle: "Un seul système apaisant pour de meilleures décisions parentales",
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
    modules: {
      eyebrow: "Écosystème principal",
      title: "Tout fonctionne mieux lorsque les modules travaillent ensemble.",
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
    vision: {
      eyebrow: "Une vision premium de la parentalité moderne",
      title1: "Construire un avenir lumineux",
      title2: "pour vos enfants : des stratégies essentielles pour les parents.",
      text:
        "Être parent, ce n’est pas seulement traverser la journée. C’est construire des rythmes stables, des routines plus saines, de meilleures décisions et un environnement plus serein qui soutient la croissance à long terme de votre enfant avec plus de clarté et moins de stress.",
      why: "Pourquoi c’est important",
      systemTitle: "Pas seulement du tracking. Un vrai système parental premium.",
      systemText:
        "Smart Baby System aide les parents à passer de notes dispersées et d’outils isolés à une expérience connectée où le sommeil, l’alimentation, les soins, l’IA et même les interactions marketplace travaillent ensemble pour créer de meilleures décisions quotidiennes et un parcours parental plus confiant.",
      calmTitle: "Routines apaisées",
      calmText: "Moins de chaos, plus de fluidité prévisible au quotidien.",
      signalsTitle: "Meilleurs signaux",
      signalsText: "Voyez plus tôt ce qui compte et réagissez avec confiance.",
      longTermTitle: "Clarté à long terme",
      longTermText: "Construisez de meilleures habitudes pour soutenir la croissance future.",
      sleepLabel: "Sommeil + rythme",
      sleepTitle: "Un meilleur repos commence par une meilleure structure.",
      sleepText:
        "Un rythme de sommeil plus calme améliore la récupération, la cohérence des routines et la qualité de toute la journée pour les parents comme pour les enfants.",
      foodLabel: "Alimentation + soins",
      foodTitle: "La cohérence quotidienne crée des bases plus solides.",
      foodText:
        "Les repas, les routines et les habitudes de soins façonnent le confort, le comportement et la stabilité d’une manière que les parents peuvent mieux comprendre avec le bon système.",
      ecoLabel: "Avantage écosystème",
      ecoTitle: "Un seul système peut soutenir tout le parcours parental.",
      ecoText:
        "Avec la guidance IA, des modules connectés et un marketplace de confiance, le produit devient plus qu’une app — il devient un écosystème parental premium.",
    },
    pricing: {
      eyebrow: "Tarifs",
      title: "Choisissez le niveau de guidance dont votre famille a besoin.",
      text:
        "Commencez simplement, puis débloquez plus de profondeur IA et une meilleure planification quotidienne.",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicSub:
        "Accès essentiel pour les parents qui veulent le système de base.",
      premiumSub:
        "Le meilleur équilibre entre valeur, planification IA et soutien parental premium.",
      eliteSub:
        "Pour les familles qui veulent la guidance la plus approfondie et les insights les plus précieux.",
      basic1: "Accès aux modules principaux",
      basic2: "Logs de base",
      basic3: "Guidance IA courte",
      basic4: "Vue simple",
      premium1: "Plans d’action IA complets",
      premium2: "Modules Sommeil / Alimentation / Soins",
      premium3: "Expérience dashboard premium",
      premium4: "Meilleure guidance quotidienne",
      elite1: "Tout ce qui est dans Premium",
      elite2: "Insights IA avancés",
      elite3: "Recommandations plus poussées",
      elite4: "Expérience à plus haute valeur",
      mostPopular: "Le plus populaire",
      chooseBasic: "Choisir Basic",
      choosePremium: "Choisir Premium",
      getElite: "Choisir Elite",
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "Simple pour les parents. Solide en profondeur.",
      step1Title: "Choisissez une formule",
      step1Text:
        "Commencez avec le niveau de guidance qui convient le mieux à votre famille.",
      step2Title: "Configurez votre profil",
      step2Text:
        "Ajoutez le contexte de votre bébé pour personnaliser la guidance.",
      step3Title: "Utilisez tout l’écosystème",
      step3Text:
        "Suivez le sommeil, l’alimentation, les soins et explorez le marketplace dans une seule expérience connectée.",
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
      bottom: "© 2026 Smart Baby System. Conçu pour une parentalité moderne et apaisée.",
    },
  },
} as const;

export default function Home() {
  const [question, setQuestion] = useState("");
  const router = useRouter();
  const params = useParams();

  const rawLocale = typeof params.locale === "string" ? params.locale : defaultLocale;
  const locale: Locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "en";
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
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="#how">{t.nav.how}</a>
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
            <a href="/login" className="homePremium__navTextBtn">
              {t.nav.login}
            </a>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <a
                href={`/en`}
                className="homePremium__navTextBtn"
                style={{
                  fontWeight: locale === "en" ? 800 : 600,
                  color: locale === "en" ? "#0f172a" : undefined,
                }}
              >
                EN
              </a>
              <a
                href={`/fr`}
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

      <section className="homePremium__hero homePremium__hero--luxury" id="overview">
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

          <div
            style={{
              marginTop: "0",
              padding: "12px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.18)",
              boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
              backdropFilter: "blur(12px)",
              maxWidth: "760px",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAI();
              }}
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <input
                type="text"
                name="smartBabyQuestion"
                autoComplete="off"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.hero.askPlaceholder}
                style={{
                  flex: 1,
                  minWidth: "220px",
                  border: "1px solid rgba(148,163,184,0.22)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  fontSize: "14px",
                  outline: "none",
                  background: "#fff",
                }}
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

          <div
            style={{
              marginTop: "18px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "12px",
            }}
          >
            <div
              style={{
                padding: "16px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.76)",
                border: "1px solid #e5edf5",
                boxShadow: "0 14px 30px rgba(88,112,140,0.04)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "15px",
                  color: "#0f172a",
                }}
              >
                {t.hero.benefit1}
              </strong>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.76)",
                border: "1px solid #e5edf5",
                boxShadow: "0 14px 30px rgba(88,112,140,0.04)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "15px",
                  color: "#0f172a",
                }}
              >
                {t.hero.benefit2}
              </strong>
            </div>

            <div
              style={{
                padding: "16px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.76)",
                border: "1px solid #e5edf5",
                boxShadow: "0 14px 30px rgba(88,112,140,0.04)",
              }}
            >
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "15px",
                  color: "#0f172a",
                }}
              >
                {t.hero.benefit3}
              </strong>
            </div>
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
          >
            <div
              style={{
                padding: "18px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.74)",
                border: "1px solid #e5edf5",
                boxShadow: "0 14px 30px rgba(88,112,140,0.04)",
              }}
            >
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
                {t.hero.statLabel1}
              </span>
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "20px",
                  color: "#0f172a",
                }}
              >
                {t.hero.statValue1}
              </strong>
              <span
                style={{
                  color: "#657589",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {t.hero.statText1}
              </span>
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.74)",
                border: "1px solid #e5edf5",
                boxShadow: "0 14px 30px rgba(88,112,140,0.04)",
              }}
            >
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
                {t.hero.statLabel2}
              </span>
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "20px",
                  color: "#0f172a",
                }}
              >
                {t.hero.statValue2}
              </strong>
              <span
                style={{
                  color: "#657589",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {t.hero.statText2}
              </span>
            </div>

            <div
              style={{
                padding: "18px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.74)",
                border: "1px solid #e5edf5",
                boxShadow: "0 14px 30px rgba(88,112,140,0.04)",
              }}
            >
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
                {t.hero.statLabel3}
              </span>
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "20px",
                  color: "#0f172a",
                }}
              >
                {t.hero.statValue3}
              </strong>
              <span
                style={{
                  color: "#657589",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                {t.hero.statText3}
              </span>
            </div>
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
              <div className="homePremium__showcaseTitle">{t.hero.previewEyebrow}</div>
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

                <p className="homePremium__heroPanelText">{t.hero.previewText}</p>

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
                    <span className="homePremium__dashboardBadge">{t.hero.aiCardBadge}</span>
                  </div>
                  <h4>{t.hero.aiCardTitle}</h4>
                  <p>{t.hero.aiCardText}</p>
                </div>

                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">🛍</span>
                    <span className="homePremium__dashboardBadge">{t.hero.marketCardBadge}</span>
                  </div>
                  <h4>{t.hero.marketCardTitle}</h4>
                  <p>{t.hero.marketCardText}</p>
                </div>
              </div>

              <div className="homePremium__heroPanelRow">
                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">💬</span>
                    <span className="homePremium__dashboardBadge">{t.hero.chatCardBadge}</span>
                  </div>
                  <h4>{t.hero.chatCardTitle}</h4>
                  <p>{t.hero.chatCardText}</p>
                </div>

                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">◌</span>
                    <span className="homePremium__dashboardBadge">{t.hero.scoreTitle}</span>
                  </div>
                  <h4>{t.hero.scoreTitle}</h4>
                  <p>{t.hero.scoreText}</p>
                </div>
              </div>
            </div>
          </div>
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
              <span className="homePremium__moduleBadge">{t.modules.premium}</span>
            </div>
            <h3>{t.modules.sleepTitle}</h3>
            <p>{t.modules.sleepText}</p>
          </a>

          <a href={`/${locale}/food`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">◔</span>
              <span className="homePremium__moduleBadge">{t.modules.premium}</span>
            </div>
            <h3>{t.modules.foodTitle}</h3>
            <p>{t.modules.foodText}</p>
          </a>

          <a href={`/${locale}/care`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">✦</span>
              <span className="homePremium__moduleBadge">{t.modules.premium}</span>
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
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "20px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: "28px",
              borderRadius: "30px",
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.84)",
                  border: "1px solid #e5edf5",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "17px",
                    color: "#0f172a",
                  }}
                >
                  {t.vision.calmTitle}
                </strong>
                <span
                  style={{
                    color: "#6b7c8f",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {t.vision.calmText}
                </span>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.84)",
                  border: "1px solid #e5edf5",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "17px",
                    color: "#0f172a",
                  }}
                >
                  {t.vision.signalsTitle}
                </strong>
                <span
                  style={{
                    color: "#6b7c8f",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {t.vision.signalsText}
                </span>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.84)",
                  border: "1px solid #e5edf5",
                }}
              >
                <strong
                  style={{
                    display: "block",
                    marginBottom: "6px",
                    fontSize: "17px",
                    color: "#0f172a",
                  }}
                >
                  {t.vision.longTermTitle}
                </strong>
                <span
                  style={{
                    color: "#6b7c8f",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  {t.vision.longTermText}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "16px",
            }}
          >
            <div
              style={{
                padding: "22px",
                borderRadius: "26px",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(148, 163, 184, 0.14)",
                boxShadow: "0 16px 38px rgba(87, 109, 138, 0.05)",
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
                {t.vision.sleepLabel}
              </p>
              <h4
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                {t.vision.sleepTitle}
              </h4>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.7,
                }}
              >
                {t.vision.sleepText}
              </p>
            </div>

            <div
              style={{
                padding: "22px",
                borderRadius: "26px",
                background: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(148, 163, 184, 0.14)",
                boxShadow: "0 16px 38px rgba(87, 109, 138, 0.05)",
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
                {t.vision.foodLabel}
              </p>
              <h4
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                {t.vision.foodTitle}
              </h4>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.7,
                }}
              >
                {t.vision.foodText}
              </p>
            </div>

            <div
              style={{
                padding: "22px",
                borderRadius: "26px",
                background:
                  "linear-gradient(135deg, rgba(239,248,255,0.96) 0%, rgba(252,253,255,0.98) 100%)",
                border: "1px solid rgba(148, 163, 184, 0.16)",
                boxShadow: "0 16px 38px rgba(87, 109, 138, 0.05)",
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
                {t.vision.ecoLabel}
              </p>
              <h4
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                {t.vision.ecoTitle}
              </h4>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.7,
                }}
              >
                {t.vision.ecoText}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.pricing.eyebrow}</p>
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.text}</p>
        </div>

        <div className="homePremium__pricingGrid">
          <article className="homePremium__priceCard">
            <p className="homePremium__priceLabel">{t.pricing.basic}</p>
            <h3>
              €7<span>/month</span>
            </h3>
            <p className="homePremium__priceSub">{t.pricing.basicSub}</p>

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
              €11<span>/month</span>
            </h3>
            <p className="homePremium__priceSub">{t.pricing.premiumSub}</p>

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
              €15<span>/month</span>
            </h3>
            <p className="homePremium__priceSub">{t.pricing.eliteSub}</p>

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
      </section>

      <section id="how" className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.how.eyebrow}</p>
          <h2>{t.how.title}</h2>
        </div>

        <div className="homePremium__stepsGrid">
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
            <a href={`/${locale}`} className="homePremium__brand homePremium__brand--footer">
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
              <a href="/login">{t.footer.login}</a>
              <a href="/message">{t.footer.messages}</a>
            </div>
          </div>
        </div>

        <div className="homePremium__footerBottom">
          <p>{t.footer.bottom}</p>
        </div>
      </footer>
    </main>
  );
}