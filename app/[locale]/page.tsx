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
      how: "How it works",
      ecosystem: "Ecosystem",
      pricing: "Pricing",
      login: "Log in",
      startFree: "Start free",
      marketplace: "Marketplace",
    },
    hero: {
      badge: "AI-powered parenting guidance",
      title1: "Understand your baby.",
      title2: "Not just track.",
      text:
        "You’re not doing anything wrong. You’re just missing the pattern. Every cry, every wake-up, every meal has a reason — Smart Baby System helps you finally understand it.",
      trust: "Built for real parents who want clarity, calm and better daily decisions.",
      askPlaceholder:
        "Ask AI anything… e.g. Why did my baby sleep less today?",
      askAi: "Ask AI",
      startFree: "Start for free",
      seePricing: "See pricing",
      panelEyebrow: "One connected experience",
      panelTitle: "One calm system for sleep, food, care and marketplace",
      panelText:
        "Instead of switching between scattered notes and separate apps, parents can use one clean space to track, understand and act.",
      point1: "Sleep patterns",
      point2: "Food reactions",
      point3: "Care consistency",
      point4: "Parent marketplace",
    },
    modules: {
      eyebrow: "Core pillars",
      title: "The four essential parts of the ecosystem.",
      text:
        "Everything is designed to work together inside one premium parenting experience.",
      premium: "Premium",
      sleepTitle: "Sleep",
      sleepText:
        "Track naps, protect bedtime and understand your baby’s rhythm more clearly.",
      foodTitle: "Food",
      foodText:
        "Log meals, reactions and feeding habits to reduce stress and confusion.",
      careTitle: "Care",
      careText:
        "Keep routines more consistent and easier to manage every day.",
      marketTitle: "Marketplace",
      marketText:
        "Buy, sell or donate baby items inside the same trusted parent ecosystem.",
    },
    how: {
      eyebrow: "How it works",
      title: "From daily baby data to calmer decisions.",
      text:
        "A simple flow that helps parents move from uncertainty to understanding.",
      step1Title: "Log what happened",
      step1Text:
        "Add sleep, meals and care in a simple daily flow built for real parent routines.",
      step2Title: "Let the AI detect patterns",
      step2Text:
        "The system connects rhythm, reactions and consistency to surface what matters.",
      step3Title: "Get clear guidance",
      step3Text:
        "Receive practical suggestions that help you adjust the day with more calm and confidence.",
    },
    ecosystem: {
      eyebrow: "Connected ecosystem",
      title: "More than tracking. A real parenting support system.",
      text:
        "Smart Baby System connects sleep, food, care, AI support and marketplace into one calm experience that helps parents make better decisions every day.",
      card1Title: "Less guessing",
      card1Text:
        "See what may actually be affecting sleep, meals and daily routine.",
      card2Title: "More clarity",
      card2Text:
        "Use one connected system instead of scattered notes and separate tools.",
      card3Title: "More confidence",
      card3Text:
        "Make daily parenting decisions with stronger context and less stress.",
    },
    pricing: {
      eyebrow: "Pricing",
      title: "Choose the level of support your family needs.",
      text:
        "Start simple, then unlock deeper guidance as the product evolves.",
      badge: "Cancel anytime",
      monthly: "Monthly plans",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicPrice: "€7",
      premiumPrice: "€11",
      elitePrice: "€15",
      perMonth: "/month",
      basicSub: "Essential access for daily tracking.",
      premiumSub: "Best balance for most families.",
      eliteSub: "More advanced guidance and deeper insights.",
      basic1: "Core module access",
      basic2: "Simple overview",
      basic3: "Short AI guidance",
      premium1: "Full module experience",
      premium2: "Full AI action plans",
      premium3: "Premium dashboard experience",
      elite1: "Everything in Premium",
      elite2: "Advanced AI insights",
      elite3: "Highest-value experience",
      chooseBasic: "Start Basic",
      choosePremium: "Start Premium",
      chooseElite: "Start Elite",
      footnote:
        "Payments can be connected with Stripe later without changing this structure.",
    },
    cta: {
      eyebrow: "Start now",
      title: "Turn daily baby data into calmer parenting decisions.",
      text:
        "Choose a plan, create your baby profile and start using the system.",
      startFree: "Start free",
      openDashboard: "Open dashboard",
      exploreMarketplace: "Explore marketplace",
    },
    footer: {
      product: "Product",
      legal: "Legal",
      dashboard: "Dashboard",
      sleep: "Sleep",
      food: "Food",
      care: "Care",
      marketplace: "Marketplace",
      privacy: "Privacy",
      terms: "Terms",
      disclaimer: "Disclaimer",
      login: "Log in",
      bottom:
        "© 2026 Smart Baby System. Designed for calm, modern parenting.",
    },
  },
  fr: {
    nav: {
      overview: "Aperçu",
      modules: "Modules",
      how: "Comment ça marche",
      ecosystem: "Écosystème",
      pricing: "Tarifs",
      login: "Connexion",
      startFree: "Commencer",
      marketplace: "Marketplace",
    },
    hero: {
      badge: "Guidance parentale alimentée par l’IA",
      title1: "Comprenez votre bébé.",
      title2: "Ne vous contentez pas de suivre.",
      text:
        "Vous ne faites rien de mal. Vous ne voyez simplement pas encore le schéma. Chaque pleur, chaque réveil, chaque repas a une raison — Smart Baby System vous aide enfin à le comprendre.",
      trust:
        "Conçu pour les vrais parents qui veulent plus de clarté, plus de calme et de meilleures décisions au quotidien.",
      askPlaceholder:
        "Posez une question à l’IA… ex. Pourquoi mon bébé a-t-il moins dormi aujourd’hui ?",
      askAi: "Demander à l’IA",
      startFree: "Commencer gratuitement",
      seePricing: "Voir les tarifs",
      panelEyebrow: "Une expérience connectée",
      panelTitle:
        "Un seul système apaisant pour le sommeil, l’alimentation, les soins et le marketplace",
      panelText:
        "Au lieu de passer entre des notes dispersées et plusieurs applications, les parents peuvent utiliser un seul espace clair pour suivre, comprendre et agir.",
      point1: "Schémas de sommeil",
      point2: "Réactions alimentaires",
      point3: "Cohérence des soins",
      point4: "Marketplace parents",
    },
    modules: {
      eyebrow: "Piliers essentiels",
      title: "Les quatre parties essentielles de l’écosystème.",
      text:
        "Tout est conçu pour fonctionner ensemble dans une seule expérience parentale premium.",
      premium: "Premium",
      sleepTitle: "Sommeil",
      sleepText:
        "Suivez les siestes, protégez le coucher et comprenez plus clairement le rythme de votre bébé.",
      foodTitle: "Alimentation",
      foodText:
        "Enregistrez les repas, les réactions et les habitudes alimentaires pour réduire le stress et la confusion.",
      careTitle: "Soins",
      careText:
        "Rendez les routines plus cohérentes et plus faciles à gérer au quotidien.",
      marketTitle: "Marketplace",
      marketText:
        "Achetez, vendez ou donnez des articles bébé dans le même écosystème de confiance.",
    },
    how: {
      eyebrow: "Comment ça marche",
      title: "Des données quotidiennes vers des décisions plus sereines.",
      text:
        "Un flux simple qui aide les parents à passer de l’incertitude à la compréhension.",
      step1Title: "Enregistrez ce qui s’est passé",
      step1Text:
        "Ajoutez le sommeil, les repas et les soins dans un flux quotidien simple pensé pour la vraie vie des parents.",
      step2Title: "Laissez l’IA détecter les schémas",
      step2Text:
        "Le système relie le rythme, les réactions et la cohérence pour faire ressortir ce qui compte.",
      step3Title: "Recevez une guidance claire",
      step3Text:
        "Obtenez des suggestions pratiques pour ajuster la journée avec plus de calme et de confiance.",
    },
    ecosystem: {
      eyebrow: "Écosystème connecté",
      title: "Plus que du tracking. Un vrai système de soutien parental.",
      text:
        "Smart Baby System relie le sommeil, l’alimentation, les soins, l’IA et le marketplace dans une seule expérience apaisante qui aide les parents à prendre de meilleures décisions chaque jour.",
      card1Title: "Moins de suppositions",
      card1Text:
        "Voyez ce qui peut réellement influencer le sommeil, les repas et la routine.",
      card2Title: "Plus de clarté",
      card2Text:
        "Utilisez un système connecté au lieu de notes dispersées et d’outils séparés.",
      card3Title: "Plus de confiance",
      card3Text:
        "Prenez vos décisions quotidiennes avec plus de contexte et moins de stress.",
    },
    pricing: {
      eyebrow: "Tarifs",
      title: "Choisissez le niveau de support dont votre famille a besoin.",
      text:
        "Commencez simplement, puis débloquez plus de guidance à mesure que le produit évolue.",
      badge: "Résiliable à tout moment",
      monthly: "Formules mensuelles",
      basic: "Basic",
      premium: "Premium",
      elite: "Elite",
      basicPrice: "€7",
      premiumPrice: "€11",
      elitePrice: "€15",
      perMonth: "/mois",
      basicSub: "Accès essentiel pour le suivi quotidien.",
      premiumSub: "Le meilleur équilibre pour la plupart des familles.",
      eliteSub: "Plus de guidance avancée et d’insights plus profonds.",
      basic1: "Accès aux modules principaux",
      basic2: "Vue simple",
      basic3: "Guidance IA courte",
      premium1: "Expérience complète des modules",
      premium2: "Plans d’action IA complets",
      premium3: "Expérience dashboard premium",
      elite1: "Tout ce qui est dans Premium",
      elite2: "Insights IA avancés",
      elite3: "Expérience la plus complète",
      chooseBasic: "Commencer Basic",
      choosePremium: "Commencer Premium",
      chooseElite: "Commencer Elite",
      footnote:
        "Les paiements peuvent être connectés à Stripe plus tard sans changer cette structure.",
    },
    cta: {
      eyebrow: "Commencez maintenant",
      title:
        "Transformez les données quotidiennes de bébé en décisions plus sereines.",
      text:
        "Choisissez une formule, créez le profil de votre bébé et commencez à utiliser le système.",
      startFree: "Commencer",
      openDashboard: "Ouvrir le dashboard",
      exploreMarketplace: "Explorer le marketplace",
    },
    footer: {
      product: "Produit",
      legal: "Légal",
      dashboard: "Dashboard",
      sleep: "Sommeil",
      food: "Alimentation",
      care: "Soins",
      marketplace: "Marketplace",
      privacy: "Confidentialité",
      terms: "Conditions",
      disclaimer: "Avertissement",
      login: "Connexion",
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
    <main className="homeClean">
      <header className="homeClean__nav">
        <div className="homeClean__navInner">
          <a href={`/${locale}`} className="homeClean__brand">
            <div className="homeClean__brandLogo">SB</div>
            <div>
              <p className="homeClean__brandTitle">Smart Baby</p>
              <span className="homeClean__brandSub">System</span>
            </div>
          </a>

          <nav className="homeClean__navLinks">
            <a href="#overview">{t.nav.overview}</a>
            <a href="#modules">{t.nav.modules}</a>
            <a href="#how">{t.nav.how}</a>
            <a href="#ecosystem">{t.nav.ecosystem}</a>
            <a href="#pricing">{t.nav.pricing}</a>
            <a href="/marketplace">{t.nav.marketplace}</a>
          </nav>

          <div className="homeClean__navActions">
            <a href={`/${locale}/login`} className="homeClean__navTextBtn">
              {t.nav.login}
            </a>

            <div className="homeClean__langSwitch">
              <a
                href="/en"
                className="homeClean__navTextBtn"
                style={{
                  fontWeight: locale === "en" ? 800 : 600,
                  color: locale === "en" ? "#0f172a" : undefined,
                }}
              >
                EN
              </a>
              <a
                href="/fr"
                className="homeClean__navTextBtn"
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
              className="homeClean__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.nav.startFree}
            </button>
          </div>
        </div>
      </header>

      <section className="homeClean__hero" id="overview">
        <div className="homeClean__heroContent">
          <div className="homeClean__heroBadge">{t.hero.badge}</div>

          <h1 className="homeClean__heroTitle">
            {t.hero.title1}
            <span>{t.hero.title2}</span>
          </h1>

          <p className="homeClean__heroText">{t.hero.text}</p>
          <p className="homeClean__heroTrust">{t.hero.trust}</p>

          <div className="homeClean__askBox">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskAI();
              }}
              className="homeClean__askForm"
            >
              <input
                type="text"
                name="smartBabyQuestion"
                autoComplete="off"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={t.hero.askPlaceholder}
                className="homeClean__askInput"
              />
              <button type="submit" className="homeClean__primaryBtn">
                {t.hero.askAi}
              </button>
            </form>
          </div>

          <div className="homeClean__heroActions">
            <button
              type="button"
              className="homeClean__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.hero.startFree}
            </button>

            <a href="#pricing" className="homeClean__ghostBtn">
              {t.hero.seePricing}
            </a>
          </div>
        </div>

        <div className="homeClean__heroPanel">
          <p className="homeClean__eyebrow">{t.hero.panelEyebrow}</p>
          <h2>{t.hero.panelTitle}</h2>
          <p>{t.hero.panelText}</p>

          <div className="homeClean__pointsGrid">
            {[t.hero.point1, t.hero.point2, t.hero.point3, t.hero.point4].map(
              (item) => (
                <div key={item} className="homeClean__pointCard">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="homeClean__section" id="modules">
        <div className="homeClean__sectionHead">
          <p className="homeClean__eyebrow">{t.modules.eyebrow}</p>
          <h2>{t.modules.title}</h2>
          <p>{t.modules.text}</p>
        </div>

        <div className="homeClean__moduleGrid">
          <a href={`/${locale}/sleep`} className="homeClean__moduleCard">
            <div className="homeClean__moduleTop">
              <span className="homeClean__moduleIcon">🌙</span>
              <span className="homeClean__moduleBadge">{t.modules.premium}</span>
            </div>
            <h3>{t.modules.sleepTitle}</h3>
            <p>{t.modules.sleepText}</p>
          </a>

          <a href={`/${locale}/food`} className="homeClean__moduleCard">
            <div className="homeClean__moduleTop">
              <span className="homeClean__moduleIcon">🍼</span>
              <span className="homeClean__moduleBadge">{t.modules.premium}</span>
            </div>
            <h3>{t.modules.foodTitle}</h3>
            <p>{t.modules.foodText}</p>
          </a>

          <a href={`/${locale}/care`} className="homeClean__moduleCard">
            <div className="homeClean__moduleTop">
              <span className="homeClean__moduleIcon">💙</span>
              <span className="homeClean__moduleBadge">{t.modules.premium}</span>
            </div>
            <h3>{t.modules.careTitle}</h3>
            <p>{t.modules.careText}</p>
          </a>

          <a href="/marketplace" className="homeClean__moduleCard">
            <div className="homeClean__moduleTop">
              <span className="homeClean__moduleIcon">🛍</span>
              <span className="homeClean__moduleBadge">{t.nav.marketplace}</span>
            </div>
            <h3>{t.modules.marketTitle}</h3>
            <p>{t.modules.marketText}</p>
          </a>
        </div>
      </section>

      <section className="homeClean__section" id="how">
        <div className="homeClean__sectionHead">
          <p className="homeClean__eyebrow">{t.how.eyebrow}</p>
          <h2>{t.how.title}</h2>
          <p>{t.how.text}</p>
        </div>

        <div className="homeClean__stepsGrid">
          <article className="homeClean__stepCard">
            <span className="homeClean__stepNumber">01</span>
            <h3>{t.how.step1Title}</h3>
            <p>{t.how.step1Text}</p>
          </article>

          <article className="homeClean__stepCard">
            <span className="homeClean__stepNumber">02</span>
            <h3>{t.how.step2Title}</h3>
            <p>{t.how.step2Text}</p>
          </article>

          <article className="homeClean__stepCard">
            <span className="homeClean__stepNumber">03</span>
            <h3>{t.how.step3Title}</h3>
            <p>{t.how.step3Text}</p>
          </article>
        </div>
      </section>

      <section className="homeClean__section" id="ecosystem">
        <div className="homeClean__sectionHead">
          <p className="homeClean__eyebrow">{t.ecosystem.eyebrow}</p>
          <h2>{t.ecosystem.title}</h2>
          <p>{t.ecosystem.text}</p>
        </div>

        <div className="homeClean__ecosystemGrid">
          <div className="homeClean__simpleCard">
            <h3>{t.ecosystem.card1Title}</h3>
            <p>{t.ecosystem.card1Text}</p>
          </div>
          <div className="homeClean__simpleCard">
            <h3>{t.ecosystem.card2Title}</h3>
            <p>{t.ecosystem.card2Text}</p>
          </div>
          <div className="homeClean__simpleCard">
            <h3>{t.ecosystem.card3Title}</h3>
            <p>{t.ecosystem.card3Text}</p>
          </div>
        </div>
      </section>

      <section className="homeClean__section" id="pricing">
        <div className="homeClean__sectionHead">
          <p className="homeClean__eyebrow">{t.pricing.eyebrow}</p>
          <h2>{t.pricing.title}</h2>
          <p>{t.pricing.text}</p>
        </div>

        <div className="homeClean__pricingTop">
          <div className="homeClean__chip">{t.pricing.badge}</div>
          <div className="homeClean__chip homeClean__chip--blue">
            {t.pricing.monthly}
          </div>
        </div>

        <div className="homeClean__pricingGrid">
          <article className="homeClean__priceCard">
            <p className="homeClean__priceLabel">{t.pricing.basic}</p>
            <h3>
              {t.pricing.basicPrice}
              <span>{t.pricing.perMonth}</span>
            </h3>
            <p className="homeClean__priceSub">{t.pricing.basicSub}</p>
            <ul className="homeClean__priceList">
              <li>{t.pricing.basic1}</li>
              <li>{t.pricing.basic2}</li>
              <li>{t.pricing.basic3}</li>
            </ul>
            <button
              type="button"
              className="homeClean__ghostBtn homeClean__priceBtn"
              onClick={() => choosePlanAndGo("basic")}
            >
              {t.pricing.chooseBasic}
            </button>
          </article>

          <article className="homeClean__priceCard homeClean__priceCard--featured">
            <p className="homeClean__priceLabel">{t.pricing.premium}</p>
            <h3>
              {t.pricing.premiumPrice}
              <span>{t.pricing.perMonth}</span>
            </h3>
            <p className="homeClean__priceSub">{t.pricing.premiumSub}</p>
            <ul className="homeClean__priceList">
              <li>{t.pricing.premium1}</li>
              <li>{t.pricing.premium2}</li>
              <li>{t.pricing.premium3}</li>
            </ul>
            <button
              type="button"
              className="homeClean__primaryBtn homeClean__priceBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.pricing.choosePremium}
            </button>
          </article>

          <article className="homeClean__priceCard">
            <p className="homeClean__priceLabel">{t.pricing.elite}</p>
            <h3>
              {t.pricing.elitePrice}
              <span>{t.pricing.perMonth}</span>
            </h3>
            <p className="homeClean__priceSub">{t.pricing.eliteSub}</p>
            <ul className="homeClean__priceList">
              <li>{t.pricing.elite1}</li>
              <li>{t.pricing.elite2}</li>
              <li>{t.pricing.elite3}</li>
            </ul>
            <button
              type="button"
              className="homeClean__ghostBtn homeClean__priceBtn"
              onClick={() => choosePlanAndGo("elite")}
            >
              {t.pricing.chooseElite}
            </button>
          </article>
        </div>

        <p className="homeClean__footnote">{t.pricing.footnote}</p>
      </section>

      <section className="homeClean__section homeClean__section--cta">
        <div className="homeClean__ctaBox">
          <p className="homeClean__eyebrow">{t.cta.eyebrow}</p>
          <h2>{t.cta.title}</h2>
          <p>{t.cta.text}</p>

          <div className="homeClean__ctaActions">
            <button
              type="button"
              className="homeClean__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              {t.cta.startFree}
            </button>

            <a href={`/${locale}/dashboard`} className="homeClean__ghostBtn">
              {t.cta.openDashboard}
            </a>

            <a href="/marketplace" className="homeClean__ghostBtn">
              {t.cta.exploreMarketplace}
            </a>
          </div>
        </div>
      </section>

      <footer className="homeClean__footer">
        <div className="homeClean__footerInner">
          <div>
            <a href={`/${locale}`} className="homeClean__brand">
              <div className="homeClean__brandLogo">SB</div>
              <div>
                <p className="homeClean__brandTitle">Smart Baby</p>
                <span className="homeClean__brandSub">System</span>
              </div>
            </a>
          </div>

          <div className="homeClean__footerGrid">
            <div className="homeClean__footerCol">
              <p className="homeClean__footerTitle">{t.footer.product}</p>
              <a href={`/${locale}/dashboard`}>{t.footer.dashboard}</a>
              <a href={`/${locale}/sleep`}>{t.footer.sleep}</a>
              <a href={`/${locale}/food`}>{t.footer.food}</a>
              <a href={`/${locale}/care`}>{t.footer.care}</a>
              <a href="/marketplace">{t.footer.marketplace}</a>
            </div>

            <div className="homeClean__footerCol">
              <p className="homeClean__footerTitle">{t.footer.legal}</p>
              <a href={`/${locale}/privacy`}>{t.footer.privacy}</a>
              <a href={`/${locale}/terms`}>{t.footer.terms}</a>
              <a href={`/${locale}/disclaimer`}>{t.footer.disclaimer}</a>
              <a href={`/${locale}/login`}>{t.footer.login}</a>
            </div>
          </div>
        </div>

        <div className="homeClean__footerBottom">
          <p>{t.footer.bottom}</p>
        </div>
      </footer>

      <style jsx>{`
        .homeClean {
          min-height: 100vh;
          background:
            radial-gradient(circle at top left, rgba(166, 210, 255, 0.16), transparent 24%),
            linear-gradient(180deg, #f7fbff 0%, #fcfdff 100%);
          color: #0f172a;
          overflow-x: hidden;
        }

        .homeClean__nav {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 18px 24px 0;
          backdrop-filter: blur(8px);
        }

        .homeClean__navInner {
          max-width: 1180px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 20px;
          align-items: center;
          padding: 18px 22px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
        }

        .homeClean__brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: inherit;
        }

        .homeClean__brandLogo {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #8dc5ff 0%, #a5d4ff 100%);
          color: #0f172a;
          font-size: 20px;
          font-weight: 800;
          box-shadow: 0 16px 30px rgba(59, 130, 246, 0.15);
          flex-shrink: 0;
        }

        .homeClean__brandTitle {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.1;
        }

        .homeClean__brandSub {
          font-size: 14px;
          color: #64748b;
        }

        .homeClean__navLinks {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .homeClean__navLinks a {
          text-decoration: none;
          color: #516173;
          font-size: 14px;
          font-weight: 600;
        }

        .homeClean__navLinks a:hover {
          color: #0f172a;
        }

        .homeClean__navActions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .homeClean__langSwitch {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .homeClean__navTextBtn {
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

        .homeClean__navTextBtn:hover {
          background: rgba(148, 163, 184, 0.08);
          color: #0f172a;
        }

        .homeClean__primaryBtn,
        .homeClean__ghostBtn {
          min-height: 50px;
          padding: 14px 20px;
          border-radius: 18px;
          font-size: 15px;
          font-weight: 800;
          text-decoration: none;
          border: none;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          transition: all 0.2s ease;
        }

        .homeClean__primaryBtn {
          background: linear-gradient(135deg, #8ec8ff 0%, #a5d4ff 100%);
          color: #0f172a;
          box-shadow: 0 14px 28px rgba(59, 130, 246, 0.18);
        }

        .homeClean__ghostBtn {
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.04);
        }

        .homeClean__hero,
        .homeClean__section,
        .homeClean__footer {
          max-width: 1180px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        .homeClean__hero {
          padding-top: 34px;
          display: grid;
          grid-template-columns: 1.04fr 0.96fr;
          gap: 22px;
          align-items: stretch;
        }

        .homeClean__heroContent,
        .homeClean__heroPanel {
          min-width: 0;
        }

        .homeClean__heroBadge {
          display: inline-flex;
          align-items: center;
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(239, 248, 255, 0.96);
          border: 1px solid rgba(148, 163, 184, 0.16);
          color: #2563eb;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .homeClean__heroTitle {
          margin: 0 0 18px;
          font-size: clamp(40px, 5vw, 68px);
          line-height: 0.98;
          letter-spacing: -0.05em;
          color: #0f172a;
          max-width: 760px;
        }

        .homeClean__heroTitle span {
          display: block;
          margin-top: 8px;
          color: #4f6f92;
          font-weight: 700;
          font-size: 0.82em;
          line-height: 1.02;
        }

        .homeClean__heroText {
          max-width: 760px;
          font-size: 18px;
          line-height: 1.8;
          color: #526377;
          margin: 0 0 14px;
        }

        .homeClean__heroTrust {
          margin: 0 0 18px;
          color: #6b7c8f;
          font-size: 14px;
          font-weight: 700;
        }

        .homeClean__askBox,
        .homeClean__heroPanel,
        .homeClean__simpleCard,
        .homeClean__moduleCard,
        .homeClean__stepCard,
        .homeClean__priceCard,
        .homeClean__ctaBox,
        .homeClean__footerInner {
          background: rgba(255, 255, 255, 0.94);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.05);
        }

        .homeClean__askBox {
          padding: 12px;
          border-radius: 18px;
          max-width: 760px;
        }

        .homeClean__askForm {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .homeClean__askInput {
          flex: 1;
          min-width: 220px;
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 14px;
          outline: none;
          background: #fff;
          color: #0f172a;
        }

        .homeClean__heroActions,
        .homeClean__ctaActions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 18px;
        }

        .homeClean__heroPanel {
          padding: 24px;
          border-radius: 30px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .homeClean__heroPanel h2 {
          margin: 0 0 12px;
          font-size: clamp(30px, 3vw, 42px);
          line-height: 1.08;
          color: #0f172a;
        }

        .homeClean__heroPanel p {
          margin: 0;
          color: #607082;
          line-height: 1.8;
          font-size: 16px;
        }

        .homeClean__pointsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .homeClean__pointCard {
          padding: 16px;
          border-radius: 18px;
          background: linear-gradient(
            135deg,
            rgba(239, 248, 255, 0.96) 0%,
            rgba(252, 253, 255, 0.98) 100%
          );
          border: 1px solid #e5edf5;
          font-weight: 700;
          color: #0f172a;
          line-height: 1.5;
        }

        .homeClean__section {
          padding-top: 78px;
        }

        .homeClean__section--cta {
          padding-bottom: 40px;
        }

        .homeClean__sectionHead {
          margin-bottom: 26px;
        }

        .homeClean__eyebrow {
          margin: 0 0 10px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homeClean__sectionHead h2,
        .homeClean__ctaBox h2 {
          margin: 0 0 12px;
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.02;
          letter-spacing: -0.05em;
          color: #0f172a;
          max-width: 900px;
        }

        .homeClean__sectionHead p,
        .homeClean__ctaBox p {
          margin: 0;
          max-width: 760px;
          color: #5b6b7e;
          font-size: 18px;
          line-height: 1.8;
        }

        .homeClean__moduleGrid,
        .homeClean__stepsGrid,
        .homeClean__ecosystemGrid,
        .homeClean__pricingGrid {
          display: grid;
          gap: 16px;
        }

        .homeClean__moduleGrid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .homeClean__stepsGrid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .homeClean__ecosystemGrid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .homeClean__pricingGrid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .homeClean__simpleCard,
        .homeClean__moduleCard,
        .homeClean__stepCard,
        .homeClean__priceCard {
          padding: 22px;
          border-radius: 28px;
          min-width: 0;
          width: 100%;
        }

        .homeClean__simpleCard h3,
        .homeClean__moduleCard h3,
        .homeClean__stepCard h3 {
          margin: 0 0 10px;
          font-size: 24px;
          line-height: 1.1;
          color: #0f172a;
        }

        .homeClean__simpleCard p,
        .homeClean__moduleCard p,
        .homeClean__stepCard p {
          margin: 0;
          color: #607082;
          line-height: 1.8;
          font-size: 15px;
        }

        .homeClean__moduleCard {
          text-decoration: none;
          color: inherit;
        }

        .homeClean__moduleTop {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .homeClean__moduleIcon {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: grid;
          place-items: center;
          background: #eef6ff;
          font-size: 26px;
          flex-shrink: 0;
        }

        .homeClean__moduleBadge {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(239, 248, 255, 0.96);
          color: #2e5f8f;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .homeClean__stepNumber {
          display: inline-block;
          margin-bottom: 14px;
          color: #7288a3;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }

        .homeClean__pricingTop {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 22px;
          flex-wrap: wrap;
        }

        .homeClean__chip {
          padding: 10px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(148, 163, 184, 0.16);
          color: #334155;
          font-size: 13px;
          font-weight: 700;
        }

        .homeClean__chip--blue {
          background: rgba(239, 248, 255, 0.96);
          color: #2563eb;
        }

        .homeClean__priceCard--featured {
          background: linear-gradient(
            135deg,
            rgba(239, 248, 255, 0.96) 0%,
            rgba(252, 253, 255, 0.98) 100%
          );
          border: 1px solid rgba(37, 99, 235, 0.16);
        }

        .homeClean__priceLabel {
          margin: 0 0 8px;
          color: #7288a3;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .homeClean__priceCard h3 {
          margin: 0 0 10px;
          font-size: 42px;
          line-height: 1;
          color: #0f172a;
        }

        .homeClean__priceCard h3 span {
          font-size: 16px;
          color: #64748b;
          font-weight: 700;
          margin-left: 6px;
        }

        .homeClean__priceSub {
          margin: 0 0 16px;
          color: #607082;
          line-height: 1.75;
          font-size: 15px;
        }

        .homeClean__priceList {
          margin: 0 0 18px;
          padding-left: 18px;
          color: #334155;
          display: grid;
          gap: 10px;
          line-height: 1.7;
          font-size: 15px;
        }

        .homeClean__priceBtn {
          width: 100%;
        }

        .homeClean__footnote {
          margin: 18px 0 0;
          color: #64748b;
          font-size: 14px;
          line-height: 1.7;
          text-align: center;
        }

        .homeClean__ctaBox {
          padding: 28px;
          border-radius: 30px;
          background: linear-gradient(
            135deg,
            rgba(239, 248, 255, 0.96) 0%,
            rgba(252, 253, 255, 0.98) 100%
          );
        }

        .homeClean__footer {
          padding-bottom: 28px;
        }

        .homeClean__footerInner {
          padding: 28px;
          border-radius: 30px;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 24px;
        }

        .homeClean__footerGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .homeClean__footerCol {
          display: grid;
          gap: 12px;
        }

        .homeClean__footerTitle {
          margin: 0 0 4px;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #7288a3;
        }

        .homeClean__footerCol a {
          text-decoration: none;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
        }

        .homeClean__footerBottom {
          margin-top: 14px;
          text-align: center;
        }

        .homeClean__footerBottom p {
          margin: 0;
          color: #7288a3;
          font-size: 13px;
          line-height: 1.7;
        }

        @media (max-width: 1100px) {
          .homeClean__hero {
            grid-template-columns: 1fr;
          }

          .homeClean__moduleGrid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .homeClean__stepsGrid,
          .homeClean__ecosystemGrid,
          .homeClean__pricingGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 900px) {
          .homeClean__navInner {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .homeClean__navLinks {
            display: none;
          }

          .homeClean__navActions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr 1.4fr;
            gap: 12px;
          }

          .homeClean__footerInner {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .homeClean__nav,
          .homeClean__hero,
          .homeClean__section,
          .homeClean__footer {
            padding-left: 16px;
            padding-right: 16px;
          }

          .homeClean__nav {
            padding-top: 14px;
          }

          .homeClean__navInner {
            padding: 18px;
            border-radius: 24px;
          }

          .homeClean__navActions {
            grid-template-columns: 1fr 1fr 1.4fr;
            gap: 10px;
          }

          .homeClean__navTextBtn,
          .homeClean__primaryBtn,
          .homeClean__ghostBtn {
            min-height: 48px;
            padding: 12px 14px;
            font-size: 14px;
          }

          .homeClean__hero {
            padding-top: 24px;
            gap: 18px;
          }

          .homeClean__heroTitle {
            font-size: clamp(34px, 10vw, 48px);
          }

          .homeClean__sectionHead h2,
          .homeClean__ctaBox h2 {
            font-size: clamp(30px, 9vw, 42px);
            line-height: 1.04;
          }

          .homeClean__sectionHead p,
          .homeClean__ctaBox p,
          .homeClean__heroText {
            font-size: 16px;
            line-height: 1.75;
          }

          .homeClean__askForm,
          .homeClean__heroActions,
          .homeClean__ctaActions,
          .homeClean__moduleGrid,
          .homeClean__stepsGrid,
          .homeClean__ecosystemGrid,
          .homeClean__pricingGrid,
          .homeClean__footerGrid {
            grid-template-columns: 1fr !important;
            display: grid;
          }

          .homeClean__pointsGrid {
            grid-template-columns: 1fr;
          }

          .homeClean__askInput {
            min-width: 0;
            width: 100%;
          }

          .homeClean__simpleCard,
          .homeClean__moduleCard,
          .homeClean__stepCard,
          .homeClean__priceCard,
          .homeClean__heroPanel,
          .homeClean__ctaBox,
          .homeClean__footerInner {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .homeClean__priceCard h3 {
            font-size: 34px;
          }

          .homeClean__section {
            padding-top: 56px;
          }
        }
      `}</style>
    </main>
  );
}