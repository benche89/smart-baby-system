"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { defaultLocale, isValidLocale } from "../../lib/i18n";

type PlanTier = "basic" | "premium" | "elite";
type Locale = "en" | "fr";

const copy = {
  en: {
    nav: {
      modules: "Modules",
      how: "How it works",
      ecosystem: "Ecosystem",
      pricing: "Pricing",
      login: "Log in",
      startFree: "Start free",
    },
    beta: {
      text: "Early access • Built for real parents • Constantly evolving",
    },
    hero: {
      badge: "AI-powered parenting guidance",
      title1: "Understand your baby.",
      title2: "Not just track.",
      text:
        "Stop guessing why your baby cries, wakes or refuses to eat. Smart Baby System turns daily sleep, food and care data into clearer guidance so parents can make calmer decisions with more confidence.",
      trust: "Built for modern parents who want clarity, not confusion.",
      askPlaceholder:
        "Ask AI anything… e.g. Why did my baby sleep less today?",
      askAi: "Ask AI",
      startFree: "Start for free",
      seeMarketplace: "See marketplace",
      previewEyebrow: "Live product preview",
      previewTitle: "One calm system for better daily parenting decisions",
      previewText:
        "Sleep, food, care and AI guidance work together inside one connected experience.",
      scoreTitle: "Today’s overview",
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
    },
    modules: {
      eyebrow: "Core pillars",
      title: "Four parts. One calmer system.",
      text:
        "Everything important works together in one simple parenting flow.",
      premium: "Core",
      sleepTitle: "Sleep",
      sleepText:
        "Track naps, understand rhythm and protect bedtime with more clarity.",
      foodTitle: "Food",
      foodText:
        "Log meals, reactions and feeding patterns in one clean view.",
      careTitle: "Care",
      careText:
        "Keep routines, hygiene and daily care more consistent and less stressful.",
      marketTitle: "Marketplace",
      marketText:
        "Buy, sell or donate baby items inside the same ecosystem for parents.",
    },
    how: {
      eyebrow: "How it works",
      title: "From daily baby data to clearer next steps.",
      text:
        "A simple flow that helps parents move from uncertainty to calmer decisions.",
      step1Title: "Log what happened",
      step1Text:
        "Add sleep, meals and care in a simple daily flow built for real parent routines.",
      step2Title: "Let the AI detect patterns",
      step2Text:
        "The system connects wake windows, feeding rhythm, reactions and routine consistency.",
      step3Title: "Get clear guidance",
      step3Text:
        "Receive practical suggestions that help you adjust the day with more calm and confidence.",
    },
    ecosystem: {
      eyebrow: "One ecosystem",
      title: "More than tracking. A connected parenting ecosystem.",
      text:
        "Smart Baby System brings together sleep, food, care, AI guidance and marketplace access in one premium experience designed to feel calmer and simpler.",
      point1Title: "One connected place",
      point1Text:
        "No more scattered notes, separate tools or mental overload.",
      point2Title: "Better daily clarity",
      point2Text:
        "Patterns become easier to see before the day starts feeling chaotic.",
      point3Title: "Built to grow",
      point3Text:
        "Start simple, learn from real use, then expand into a stronger family system.",
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Choose the level of guidance your family needs.",
      text:
        "Start simple, then unlock deeper support as the product evolves.",
      badge: "Cancel anytime",
      monthly: "Monthly plan",
      yearly: "Stripe later",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicPrice: "€7",
      premiumPrice: "€11",
      elitePrice: "€15",
      perMonth: "/month",
      basicSub: "Essential access for parents who want the core system.",
      premiumSub: "Best balance of value, guidance and premium support.",
      eliteSub: "For families who want the deepest guidance and insights.",
      basic1: "Core module access",
      basic2: "Basic logs and simple overview",
      basic3: "Short AI guidance",
      basic4: "Good starting point",
      premium1: "Full AI action plans",
      premium2: "Sleep / Food / Care modules",
      premium3: "Premium dashboard experience",
      premium4: "Stronger daily guidance",
      elite1: "Everything in Premium",
      elite2: "Advanced AI insights",
      elite3: "Deeper recommendations",
      elite4: "Highest-value experience",
      mostPopular: "Most popular",
      chooseBasic: "Start Basic",
      choosePremium: "Start Premium",
      getElite: "Start Elite",
      note:
        "Stripe can be added later without changing this pricing structure.",
    },
    footer: {
      text:
        "A premium parenting app designed to make sleep, food, care, AI and parent-to-parent marketplace feel calmer, clearer and more connected.",
      privacy: "Privacy",
      terms: "Terms",
      disclaimer: "Disclaimer",
      login: "Log in",
      marketplace: "Marketplace",
      bottom: "© 2026 Smart Baby System. Designed for calm, modern parenting.",
    },
  },
  fr: {
    nav: {
      modules: "Modules",
      how: "Comment ça marche",
      ecosystem: "Écosystème",
      pricing: "Tarifs",
      login: "Connexion",
      startFree: "Commencer",
    },
    beta: {
      text: "Accès anticipé • Conçu pour les vrais parents • En évolution constante",
    },
    hero: {
      badge: "Guidance parentale alimentée par l’IA",
      title1: "Comprenez votre bébé.",
      title2: "Ne vous contentez pas de suivre.",
      text:
        "Arrêtez de deviner pourquoi votre bébé pleure, se réveille ou refuse de manger. Smart Baby System transforme les données quotidiennes de sommeil, d’alimentation et de soins en guidance plus claire pour aider les parents à prendre des décisions plus sereines.",
      trust:
        "Conçu pour les parents modernes qui veulent de la clarté, pas de la confusion.",
      askPlaceholder:
        "Posez une question à l’IA… ex. Pourquoi mon bébé a-t-il moins dormi aujourd’hui ?",
      askAi: "Demander à l’IA",
      startFree: "Commencer gratuitement",
      seeMarketplace: "Voir le marketplace",
      previewEyebrow: "Aperçu du produit",
      previewTitle: "Un seul système apaisant pour de meilleures décisions parentales",
      previewText:
        "Sommeil, alimentation, soins et guidance IA travaillent ensemble dans une seule expérience connectée.",
      scoreTitle: "Aperçu du jour",
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
    },
    modules: {
      eyebrow: "Piliers essentiels",
      title: "Quatre parties. Un système plus apaisant.",
      text:
        "Tout ce qui compte fonctionne ensemble dans un seul flux parental simple.",
      premium: "Essentiel",
      sleepTitle: "Sommeil",
      sleepText:
        "Suivez les siestes, comprenez le rythme et protégez le coucher avec plus de clarté.",
      foodTitle: "Alimentation",
      foodText:
        "Enregistrez les repas, les réactions et les schémas alimentaires dans une seule vue claire.",
      careTitle: "Soins",
      careText:
        "Gardez les routines, l’hygiène et les soins du quotidien plus cohérents et moins stressants.",
      marketTitle: "Marketplace",
      marketText:
        "Achetez, vendez ou donnez des articles pour bébé dans le même écosystème pour parents.",
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "Des données quotidiennes de bébé vers des prochaines étapes plus claires.",
      text:
        "Un flux simple qui aide les parents à passer de l’incertitude à des décisions plus sereines.",
      step1Title: "Enregistrez ce qui s’est passé",
      step1Text:
        "Ajoutez le sommeil, les repas et les soins dans un flux quotidien simple, pensé pour la vraie vie des parents.",
      step2Title: "Laissez l’IA détecter les schémas",
      step2Text:
        "Le système relie les fenêtres d’éveil, le rythme alimentaire, les réactions et la cohérence de routine.",
      step3Title: "Recevez une guidance claire",
      step3Text:
        "Obtenez des suggestions pratiques pour ajuster la journée avec plus de calme et de confiance.",
    },
    ecosystem: {
      eyebrow: "Un écosystème",
      title: "Plus qu’un simple tracking. Un écosystème parental connecté.",
      text:
        "Smart Baby System réunit le sommeil, l’alimentation, les soins, la guidance IA et l’accès marketplace dans une seule expérience premium pensée pour être plus simple et plus apaisante.",
      point1Title: "Un seul endroit connecté",
      point1Text:
        "Plus besoin de notes dispersées, d’outils séparés ou de surcharge mentale.",
      point2Title: "Plus de clarté au quotidien",
      point2Text:
        "Les schémas deviennent plus faciles à voir avant que la journée devienne chaotique.",
      point3Title: "Conçu pour évoluer",
      point3Text:
        "Commencez simplement, apprenez du vrai usage, puis développez un système familial plus fort.",
    },
    pricing: {
      eyebrow: "Tarifs",
      title: "Choisissez le niveau de guidance dont votre famille a besoin.",
      text:
        "Commencez simplement, puis débloquez plus de soutien à mesure que le produit évolue.",
      badge: "Résiliable à tout moment",
      monthly: "Abonnement mensuel",
      yearly: "Stripe plus tard",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicPrice: "€7",
      premiumPrice: "€11",
      elitePrice: "€15",
      perMonth: "/mois",
      basicSub:
        "Accès essentiel pour les parents qui veulent le système principal.",
      premiumSub:
        "Le meilleur équilibre entre valeur, guidance et soutien premium.",
      eliteSub:
        "Pour les familles qui veulent la guidance et les insights les plus poussés.",
      basic1: "Accès aux modules essentiels",
      basic2: "Logs de base et vue simple",
      basic3: "Guidance IA courte",
      basic4: "Bon point de départ",
      premium1: "Plans d’action IA complets",
      premium2: "Modules Sommeil / Alimentation / Soins",
      premium3: "Expérience dashboard premium",
      premium4: "Guidance quotidienne plus forte",
      elite1: "Tout ce qui est dans Premium",
      elite2: "Insights IA avancés",
      elite3: "Recommandations plus poussées",
      elite4: "Expérience la plus complète",
      mostPopular: "Le plus populaire",
      chooseBasic: "Commencer Basic",
      choosePremium: "Commencer Premium",
      getElite: "Commencer Elite",
      note:
        "Stripe peut être ajouté plus tard sans changer cette structure tarifaire.",
    },
    footer: {
      text:
        "Une application parentale premium conçue pour rendre le sommeil, l’alimentation, les soins, l’IA et le marketplace parent-à-parent plus calmes, plus clairs et plus connectés.",
      privacy: "Confidentialité",
      terms: "Conditions",
      disclaimer: "Avertissement",
      login: "Connexion",
      marketplace: "Marketplace",
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
            <a href="#modules">{t.nav.modules}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#ecosystem">{t.nav.ecosystem}</a>
            <a href="#pricing">{t.nav.pricing}</a>
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

      <section className="homePremium__betaBarWrap">
        <div className="homePremium__betaBar">{t.beta.text}</div>
      </section>

      <section className="homePremium__hero" id="overview">
        <div className="homePremium__heroContent">
          <div className="homePremium__heroBadge">
            <span className="homePremium__heroBadgeDot" />
            {t.hero.badge}
          </div>

          <h1 className="homePremium__heroTitle">
            {t.hero.title1}
            <span>{t.hero.title2}</span>
          </h1>

          <p className="homePremium__heroText">{t.hero.text}</p>
          <p className="homePremium__heroTrust">{t.hero.trust}</p>

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

            <a href="/marketplace" className="homePremium__ghostBtn">
              {t.hero.seeMarketplace}
            </a>
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

        <div className="homePremium__moduleGrid homePremium__moduleGrid--four">
          <a href={`/${locale}/sleep`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">🌙</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.sleepTitle}</h3>
            <p>{t.modules.sleepText}</p>
          </a>

          <a href={`/${locale}/food`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">🍼</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.foodTitle}</h3>
            <p>{t.modules.foodText}</p>
          </a>

          <a href={`/${locale}/care`} className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">💙</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.careTitle}</h3>
            <p>{t.modules.careText}</p>
          </a>

          <a href="/marketplace" className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">🛍</span>
              <span className="homePremium__moduleBadge">
                {t.modules.premium}
              </span>
            </div>
            <h3>{t.modules.marketTitle}</h3>
            <p>{t.modules.marketText}</p>
          </a>
        </div>
      </section>

      <section className="homePremium__section" id="how">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.how.eyebrow}</p>
          <h2>{t.how.title}</h2>
          <p>{t.how.text}</p>
        </div>

        <div className="homePremium__stepsGrid homePremium__stepsGrid--three">
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

      <section className="homePremium__section" id="ecosystem">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.ecosystem.eyebrow}</p>
          <h2>{t.ecosystem.title}</h2>
          <p>{t.ecosystem.text}</p>
        </div>

        <div className="homePremium__grid3">
          <div className="homePremium__simpleCard">
            <h3>{t.ecosystem.point1Title}</h3>
            <p>{t.ecosystem.point1Text}</p>
          </div>
          <div className="homePremium__simpleCard">
            <h3>{t.ecosystem.point2Title}</h3>
            <p>{t.ecosystem.point2Text}</p>
          </div>
          <div className="homePremium__simpleCard">
            <h3>{t.ecosystem.point3Title}</h3>
            <p>{t.ecosystem.point3Text}</p>
          </div>
        </div>
      </section>

      <section id="pricing" className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">{t.pricing.eyebrow}</p>
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.text}</p>
        </div>

        <div className="homePremium__pricingChips">
          <div className="homePremium__chip">{t.pricing.badge}</div>
          <div className="homePremium__chip homePremium__chip--blue">
            {t.pricing.monthly}
          </div>
          <div className="homePremium__chip">{t.pricing.yearly}</div>
        </div>

        <div className="homePremium__pricingGrid">
          <article className="homePremium__priceCard">
            <p className="homePremium__priceLabel">{t.pricing.basic}</p>
            <h3>
              {t.pricing.basicPrice}
              <span>{t.pricing.perMonth}</span>
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
              {t.pricing.premiumPrice}
              <span>{t.pricing.perMonth}</span>
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
              {t.pricing.elitePrice}
              <span>{t.pricing.perMonth}</span>
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

        <div className="homePremium__noteBox">{t.pricing.note}</div>
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
          </div>

          <div className="homePremium__footerGrid">
            <a href={`/${locale}/privacy`}>{t.footer.privacy}</a>
            <a href={`/${locale}/terms`}>{t.footer.terms}</a>
            <a href={`/${locale}/disclaimer`}>{t.footer.disclaimer}</a>
            <a href={`/${locale}/login`}>{t.footer.login}</a>
            <a href="/marketplace">{t.footer.marketplace}</a>
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
        .homePremium__footer,
        .homePremium__betaBarWrap {
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

        .homePremium__betaBarWrap {
          max-width: 1180px;
          margin: 14px auto 0;
          padding: 0 24px;
        }

        .homePremium__betaBar {
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 12px 18px;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            rgba(239, 248, 255, 0.96) 0%,
            rgba(252, 253, 255, 0.98) 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
          color: #2563eb;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
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

        .homePremium__ghostBtn {
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.04);
        }

        .homePremium__hero {
          max-width: 1180px;
          margin: 0 auto;
          padding: 28px 24px 0;
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: 22px;
          align-items: stretch;
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

        .homePremium__heroTitle {
          font-size: clamp(38px, 5vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          margin: 0 0 18px;
          color: #0f172a;
          max-width: 760px;
        }

        .homePremium__heroTitle span {
          display: block;
          margin-top: 8px;
          color: #4f6f92;
          font-weight: 700;
          font-size: 0.82em;
          line-height: 1.02;
          letter-spacing: -0.04em;
        }

        .homePremium__heroText {
          max-width: 760px;
          font-size: 18px;
          line-height: 1.75;
          color: #526377;
          margin: 0 0 14px;
        }

        .homePremium__heroTrust {
          margin: 0 0 18px;
          color: #6b7c8f;
          font-size: 14px;
          font-weight: 700;
        }

        .homePremium__askBox {
          padding: 12px;
          border-radius: 18px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.18);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
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

        .homePremium__heroPanelShell,
        .homePremium__simpleCard,
        .homePremium__stepCard,
        .homePremium__moduleCard,
        .homePremium__priceCard,
        .homePremium__noteBox {
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 16px 38px rgba(87, 109, 138, 0.05);
        }

        .homePremium__heroPanelShell {
          padding: 22px;
          border-radius: 30px;
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

        .homePremium__showcaseTitle,
        .homePremium__cardLabel,
        .homePremium__eyebrow,
        .homePremium__priceLabel {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homePremium__showcaseTitle,
        .homePremium__eyebrow,
        .homePremium__priceLabel {
          margin: 0;
        }

        .homePremium__cardLabel {
          margin: 0 0 8px;
        }

        .homePremium__heroPanelBody {
          display: grid;
          gap: 14px;
          min-width: 0;
        }

        .homePremium__heroPanelMainCard {
          padding: 22px;
          border-radius: 24px;
          background: linear-gradient(
            135deg,
            rgba(239, 248, 255, 0.96) 0%,
            rgba(252, 253, 255, 0.98) 100%
          );
          border: 1px solid rgba(148, 163, 184, 0.16);
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

        .homePremium__heroPanelText {
          color: #607082;
          line-height: 1.75;
          font-size: 15px;
          margin: 0 0 16px;
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
        }

        .homePremium__heroPanelMiniStat span {
          display: block;
          color: #7288a3;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
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
        }

        .homePremium__heroSoftCard p {
          margin: 0;
          color: #607082;
          line-height: 1.75;
          font-size: 14px;
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
        }

        .homePremium__sectionHead h2 {
          margin: 0 0 12px;
          font-size: clamp(38px, 5vw, 60px);
          line-height: 1.02;
          letter-spacing: -0.05em;
          color: #0f172a;
          max-width: 960px;
        }

        .homePremium__sectionHead p {
          margin: 0;
          max-width: 760px;
          color: #5b6b7e;
          font-size: 18px;
          line-height: 1.8;
        }

        .homePremium__grid3,
        .homePremium__stepsGrid--three,
        .homePremium__pricingGrid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .homePremium__simpleCard {
          padding: 22px;
          border-radius: 24px;
          min-width: 0;
        }

        .homePremium__simpleCard h3 {
          margin: 0 0 10px;
          font-size: 22px;
          color: #0f172a;
        }

        .homePremium__simpleCard p {
          margin: 0;
          color: #607082;
          line-height: 1.75;
          font-size: 15px;
        }

        .homePremium__stepCard {
          padding: 22px;
          border-radius: 26px;
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
        }

        .homePremium__stepCard p {
          margin: 0;
          color: #607082;
          line-height: 1.8;
          font-size: 16px;
        }

        .homePremium__moduleGrid {
          display: grid;
          gap: 16px;
        }

        .homePremium__moduleGrid--four {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .homePremium__moduleCard {
          padding: 22px;
          border-radius: 28px;
          text-decoration: none;
          color: inherit;
          min-width: 0;
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
        }

        .homePremium__moduleCard p {
          margin: 0;
          color: #607082;
          line-height: 1.85;
          font-size: 16px;
        }

        .homePremium__pricingChips {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .homePremium__chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(148, 163, 184, 0.16);
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .homePremium__chip--blue {
          background: rgba(239, 248, 255, 0.96);
          color: #2563eb;
        }

        .homePremium__priceCard {
          position: relative;
          padding: 24px;
          border-radius: 28px;
          min-width: 0;
        }

        .homePremium__priceCard--featured {
          background: linear-gradient(
            135deg,
            rgba(239, 248, 255, 0.96) 0%,
            rgba(252, 253, 255, 0.98) 100%
          );
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

        .homePremium__priceCard h3 {
          margin: 0 0 10px;
          font-size: 42px;
          line-height: 1;
          color: #0f172a;
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

        .homePremium__noteBox {
          margin-top: 22px;
          padding: 20px 22px;
          border-radius: 22px;
          text-align: center;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
        }

        .homePremium__footer {
          padding: 56px 24px 28px;
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

        .homePremium__footerText {
          margin: 18px 0 0;
          color: #607082;
          line-height: 1.8;
          font-size: 15px;
          max-width: 520px;
        }

        .homePremium__footerGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          align-content: start;
        }

        .homePremium__footerGrid a {
          text-decoration: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
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
          .homePremium__hero,
          .homePremium__moduleGrid--four,
          .homePremium__pricingGrid,
          .homePremium__grid3,
          .homePremium__stepsGrid--three {
            grid-template-columns: 1fr 1fr;
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

          .homePremium__hero,
          .homePremium__moduleGrid--four,
          .homePremium__pricingGrid,
          .homePremium__grid3,
          .homePremium__stepsGrid--three,
          .homePremium__footerInner,
          .homePremium__footerGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .homePremium__nav {
            padding: 14px 16px 0;
          }

          .homePremium__betaBarWrap,
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
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .homePremium__heroTitle {
            font-size: clamp(34px, 10vw, 48px);
          }

          .homePremium__sectionHead h2 {
            font-size: clamp(30px, 9vw, 42px);
            line-height: 1.04;
          }

          .homePremium__sectionHead p,
          .homePremium__heroText {
            font-size: 16px;
            line-height: 1.75;
          }

          .homePremium__askForm,
          .homePremium__heroActions {
            display: grid;
            grid-template-columns: 1fr;
          }

          .homePremium__askInput {
            min-width: 0;
            width: 100%;
          }

          .homePremium__heroPanelMiniStats,
          .homePremium__heroPanelRow,
          .homePremium__grid3,
          .homePremium__stepsGrid--three,
          .homePremium__moduleGrid--four,
          .homePremium__pricingGrid,
          .homePremium__footerInner,
          .homePremium__footerGrid {
            grid-template-columns: 1fr !important;
          }

          .homePremium__heroPanelCardHead {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .homePremium__heroPanelShell,
          .homePremium__heroPanelMainCard,
          .homePremium__simpleCard,
          .homePremium__stepCard,
          .homePremium__moduleCard,
          .homePremium__priceCard {
            padding: 18px;
          }

          .homePremium__betaBar {
            font-size: 12px;
            line-height: 1.5;
            padding: 12px 14px;
          }

          .homePremium__section {
            padding-top: 56px;
          }
        }
      `}</style>
    </main>
  );
}