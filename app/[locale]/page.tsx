"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type PlanTier = "basic" | "premium" | "elite";

export default function Home() {
  const [question, setQuestion] = useState("");
  const router = useRouter();

  function handleAskAI() {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;

    router.push(`/dashboard?q=${encodeURIComponent(cleanQuestion)}`);
  }

  function choosePlanAndGo(plan: PlanTier) {
    localStorage.setItem("smartBabyPlanTier", plan);
    router.push(`/onboarding?plan=${plan}`);
  }

  return (
    <main className="homePremium">
      <header className="homePremium__nav">
        <div className="homePremium__navInner">
          <a href="/" className="homePremium__brand">
            <div className="homePremium__brandLogo">SB</div>
            <div>
              <p className="homePremium__brandTitle">Smart Baby</p>
              <span className="homePremium__brandSub">System</span>
            </div>
          </a>

          <nav className="homePremium__navLinks">
            <a href="#overview">Overview</a>
            <a href="#modules">Modules</a>
            <a href="#ai">AI</a>
            <a href="#pricing">Pricing</a>
            <a href="#how">How it works</a>
            <a
              href="/marketplace"
              style={{
                fontWeight: 700,
                color: "#2563eb",
              }}
            >
              Marketplace
            </a>
          </nav>

          <div className="homePremium__navActions">
            <a href="/login" className="homePremium__navTextBtn">
              Log in
            </a>
            <button
              type="button"
              className="homePremium__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              Start free
            </button>
          </div>
        </div>
      </header>

      <section className="homePremium__hero homePremium__hero--luxury" id="overview">
        <div className="homePremium__heroBackdrop" />

        <div className="homePremium__heroContent">
          <div className="homePremium__heroBadge">
            <span className="homePremium__heroBadgeDot" />
            Unified premium parenting app + marketplace
          </div>

          <h1
            style={{
              fontSize: "clamp(34px, 4.3vw, 54px)",
              lineHeight: 1.03,
              letterSpacing: "-0.045em",
              marginBottom: "18px",
              color: "#0f172a",
              maxWidth: "820px",
            }}
          >
            One calm system
            <span
              style={{
                display: "block",
                marginTop: "8px",
                fontSize: "0.68em",
                lineHeight: 1.15,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#5d7ea3",
              }}
            >
              for sleep, food, care, AI and parent marketplace
            </span>
          </h1>

          <p className="homePremium__heroText">
            Smart Baby System turns daily baby data into a premium product experience
            — clearer decisions, better routines and less mental overload for parents.
            And now it also helps families buy, sell and donate baby items in one safe ecosystem.
          </p>

          <div
            style={{
              marginTop: "16px",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.86)",
              border: "1px solid rgba(148,163,184,0.16)",
              color: "#334155",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 12px 30px rgba(15,23,42,0.05)",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#2563eb",
                boxShadow: "0 0 0 6px rgba(37,99,235,0.12)",
              }}
            />
            New: Marketplace for clothes, toys, gear and donations
          </div>

          <div
            style={{
              marginTop: "20px",
              padding: "12px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.88)",
              border: "1px solid rgba(148,163,184,0.18)",
              boxShadow: "0 16px 40px rgba(15,23,42,0.08)",
              backdropFilter: "blur(12px)",
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
                placeholder="Ask AI anything… e.g. Why is my baby not sleeping well?"
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
                Ask AI
              </button>
            </form>
          </div>

          <div className="homePremium__heroActions">
            <button
              type="button"
              className="homePremium__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              Start free
            </button>

            <a href="/dashboard" className="homePremium__ghostBtn">
              Open app
            </a>

            <a
              href="/marketplace"
              className="homePremium__ghostBtn"
              style={{
                border: "1px solid rgba(37,99,235,0.3)",
                color: "#2563eb",
                fontWeight: 700,
              }}
            >
              Explore marketplace
            </a>
          </div>

          <div className="homePremium__heroMeta">
            <div className="homePremium__heroMetaItem">
              <strong>Sleep</strong>
              <span>Rhythm, naps, wake windows</span>
            </div>
            <div className="homePremium__heroMetaItem">
              <strong>Food</strong>
              <span>Meals, reactions, feeding patterns</span>
            </div>
            <div className="homePremium__heroMetaItem">
              <strong>Care</strong>
              <span>Routines, hygiene, daily consistency</span>
            </div>
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
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
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "17px",
                  color: "#0f172a",
                }}
              >
                Marketplace
              </strong>
              <span
                style={{
                  color: "#657589",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Buy, sell or donate baby items inside the same parent ecosystem.
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
              <strong
                style={{
                  display: "block",
                  marginBottom: "6px",
                  fontSize: "17px",
                  color: "#0f172a",
                }}
              >
                Private parent chat
              </strong>
              <span
                style={{
                  color: "#657589",
                  fontSize: "14px",
                  lineHeight: 1.6,
                }}
              >
                Contact sellers safely through the platform without public phone numbers.
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
              <div className="homePremium__showcaseTitle">Unified app preview</div>
            </div>

            <div className="homePremium__heroPanelBody">
              <div className="homePremium__heroPanelMainCard">
                <div className="homePremium__heroPanelCardHead">
                  <div>
                    <p className="homePremium__cardLabel">Today’s overview</p>
                    <h3>Sleep score 82 • Food score 76 • Care score 84</h3>
                  </div>
                  <div className="homePremium__heroPanelPill">Premium</div>
                </div>

                <p className="homePremium__heroPanelText">
                  One dashboard connects rhythm, meals, care consistency, marketplace activity
                  and AI guidance into a single calmer parent experience.
                </p>

                <div className="homePremium__heroPanelMiniStats">
                  <div className="homePremium__heroPanelMiniStat">
                    <span>Next sleep</span>
                    <strong>14:35</strong>
                  </div>
                  <div className="homePremium__heroPanelMiniStat">
                    <span>Food logs</span>
                    <strong>4 today</strong>
                  </div>
                  <div className="homePremium__heroPanelMiniStat">
                    <span>Care logs</span>
                    <strong>5 today</strong>
                  </div>
                </div>
              </div>

              <div className="homePremium__heroPanelRow">
                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">✨</span>
                    <span className="homePremium__dashboardBadge">AI</span>
                  </div>
                  <h4>Context-aware guidance</h4>
                  <p>Ask one question and adapt the whole daily plan instantly.</p>
                </div>

                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">☾</span>
                    <span className="homePremium__dashboardBadge">Sleep</span>
                  </div>
                  <h4>Next likely sleep</h4>
                  <p>Guidance built from recent nap rhythm and current age stage.</p>
                </div>
              </div>

              <div className="homePremium__heroPanelRow">
                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">🛍</span>
                    <span className="homePremium__dashboardBadge">Marketplace</span>
                  </div>
                  <h4>Buy, sell & donate</h4>
                  <p>Clothes, toys and baby gear inside a parent-friendly marketplace.</p>
                </div>

                <div className="homePremium__heroSoftCard">
                  <div className="homePremium__dashboardCardTop">
                    <span className="homePremium__dashboardIcon">💬</span>
                    <span className="homePremium__dashboardBadge">Messages</span>
                  </div>
                  <h4>Private conversations</h4>
                  <p>Contact buyers and sellers directly through safe in-platform messaging.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="homePremium__section" id="modules">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">Core ecosystem</p>
          <h2>Everything works better when the modules work together.</h2>
          <p>
            Instead of using separate baby tools, Smart Baby System connects the
            three pillars inside one premium app.
          </p>
        </div>

        <div className="homePremium__moduleGrid">
          <a href="/sleep" className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">☾</span>
              <span className="homePremium__moduleBadge">Premium</span>
            </div>
            <h3>Sleep</h3>
            <p>
              Track naps, estimate next sleep windows, protect bedtime and reduce
              overtiredness risk.
            </p>
          </a>

          <a href="/food" className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">◔</span>
              <span className="homePremium__moduleBadge">Premium</span>
            </div>
            <h3>Food</h3>
            <p>
              Log meals, track reactions, improve rhythm clarity and reduce feeding stress.
            </p>
          </a>

          <a href="/care" className="homePremium__moduleCard">
            <div className="homePremium__moduleTop">
              <span className="homePremium__moduleIcon">✦</span>
              <span className="homePremium__moduleBadge">Premium</span>
            </div>
            <h3>Care</h3>
            <p>
              Bring consistency to routines, hygiene and daily essentials with a calmer flow.
            </p>
          </a>
        </div>
      </section>

      <section className="homePremium__section" id="ai">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">Central AI layer</p>
          <h2>Ask one question. Adapt the whole day.</h2>
          <p>
            The AI doesn’t sit on top like a gimmick — it connects directly with
            Sleep, Food and Care.
          </p>
        </div>

        <div className="homePremium__previewStrip">
          <div className="homePremium__previewCard homePremium__previewCard--highlight">
            <p className="homePremium__cardLabel">Sleep AI</p>
            <h3>“Why is my baby not sleeping well?”</h3>
            <p>Get rhythm-focused guidance and a clearer next-step plan.</p>
          </div>

          <div className="homePremium__previewCard">
            <p className="homePremium__cardLabel">Food AI</p>
            <h3>“What should my baby eat today?”</h3>
            <p>Receive meal structure, reaction clarity and simpler feeding suggestions.</p>
          </div>

          <div className="homePremium__previewCard">
            <p className="homePremium__cardLabel">Care AI</p>
            <h3>“How can I improve baby routine?”</h3>
            <p>Get calmer transitions, consistency ideas and daily care structure.</p>
          </div>
        </div>
      </section>

      <section className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">A premium vision for modern parenting</p>

          <h2
            style={{
              maxWidth: "980px",
              fontSize: "clamp(34px, 4.8vw, 64px)",
              lineHeight: 1.02,
              letterSpacing: "-0.05em",
              marginBottom: "16px",
            }}
          >
            Building a Bright Future
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
              for Your Children: Essential Strategies for Parents.
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
            Parenting is not just about getting through the day. It is about building
            stable rhythms, healthier routines, stronger decisions and a calmer home
            environment that supports your child’s long-term growth with more clarity
            and less stress.
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
              Why this matters
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
              Not just tracking. A real premium parenting system.
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
              Smart Baby System helps parents move from scattered notes and isolated
              tools to one connected experience where sleep, food, care, AI support
              and even marketplace interactions work together to create better daily
              decisions and a more confident parenting journey.
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
                  Calm routines
                </strong>
                <span
                  style={{
                    color: "#6b7c8f",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  Less chaos, more predictable daily flow.
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
                  Better signals
                </strong>
                <span
                  style={{
                    color: "#6b7c8f",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  See what matters earlier and react with confidence.
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
                  Long-term clarity
                </strong>
                <span
                  style={{
                    color: "#6b7c8f",
                    lineHeight: 1.6,
                    fontSize: "14px",
                  }}
                >
                  Build stronger habits that support future growth.
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
                Sleep + rhythm
              </p>
              <h4
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                Better rest starts with better structure.
              </h4>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.7,
                }}
              >
                A calmer sleep rhythm improves recovery, routine consistency and the
                quality of the whole day for both parents and children.
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
                Food + care
              </p>
              <h4
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                Daily consistency creates stronger foundations.
              </h4>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.7,
                }}
              >
                Meals, routines and care patterns shape comfort, behavior and stability
                in ways parents can understand more clearly with the right system.
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
                Ecosystem advantage
              </p>
              <h4
                style={{
                  fontSize: "22px",
                  marginBottom: "8px",
                  color: "#0f172a",
                }}
              >
                One system can support the whole parenting journey.
              </h4>
              <p
                style={{
                  color: "#607082",
                  lineHeight: 1.7,
                }}
              >
                With AI guidance, connected modules and a trusted marketplace, the
                product becomes more than an app — it becomes a premium parenting ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">Pricing</p>
          <h2>Choose the level of guidance your family needs.</h2>
          <p>
            Start simple, then unlock more AI depth and better daily planning.
          </p>
        </div>

        <div className="homePremium__pricingGrid">
          <article className="homePremium__priceCard">
            <p className="homePremium__priceLabel">Basic</p>
            <h3>
              €7<span>/month</span>
            </h3>
            <p className="homePremium__priceSub">
              Essential access for parents who want the core system.
            </p>

            <ul className="homePremium__priceList">
              <li>Core module access</li>
              <li>Basic logs</li>
              <li>Short AI guidance</li>
              <li>Simple overview</li>
            </ul>

            <button
              type="button"
              className="homePremium__ghostBtn homePremium__priceBtn"
              onClick={() => choosePlanAndGo("basic")}
            >
              Choose Basic
            </button>
          </article>

          <article className="homePremium__priceCard homePremium__priceCard--featured">
            <div className="homePremium__priceBadge">Most popular</div>
            <p className="homePremium__priceLabel">Premium</p>
            <h3>
              €11<span>/month</span>
            </h3>
            <p className="homePremium__priceSub">
              Best balance of value, AI planning and premium parenting support.
            </p>

            <ul className="homePremium__priceList">
              <li>Full AI action plans</li>
              <li>Sleep / Food / Care modules</li>
              <li>Premium dashboard experience</li>
              <li>Better daily guidance</li>
            </ul>

            <button
              type="button"
              className="homePremium__primaryBtn homePremium__priceBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              Choose Premium
            </button>
          </article>

          <article className="homePremium__priceCard">
            <p className="homePremium__priceLabel">Elite</p>
            <h3>
              €15<span>/month</span>
            </h3>
            <p className="homePremium__priceSub">
              For families who want the deepest guidance and highest-value insights.
            </p>

            <ul className="homePremium__priceList">
              <li>Everything in Premium</li>
              <li>Advanced AI insights</li>
              <li>Deeper recommendations</li>
              <li>Highest-value experience</li>
            </ul>

            <button
              type="button"
              className="homePremium__ghostBtn homePremium__priceBtn"
              onClick={() => choosePlanAndGo("elite")}
            >
              Get Elite
            </button>
          </article>
        </div>
      </section>

      <section id="how" className="homePremium__section">
        <div className="homePremium__sectionHead">
          <p className="homePremium__eyebrow">How it works</p>
          <h2>Simple for parents. Strong underneath.</h2>
        </div>

        <div className="homePremium__stepsGrid">
          <article className="homePremium__stepCard">
            <span className="homePremium__stepNumber">01</span>
            <h3>Choose a plan</h3>
            <p>Start with the level of guidance that fits your family best.</p>
          </article>

          <article className="homePremium__stepCard">
            <span className="homePremium__stepNumber">02</span>
            <h3>Set up your profile</h3>
            <p>Add your baby’s context so the system can personalize guidance.</p>
          </article>

          <article className="homePremium__stepCard">
            <span className="homePremium__stepNumber">03</span>
            <h3>Use the full ecosystem</h3>
            <p>Track sleep, food, care and explore the marketplace in one connected experience.</p>
          </article>
        </div>
      </section>

      <section className="homePremium__section homePremium__section--cta">
        <div className="homePremium__ctaBox">
          <p className="homePremium__eyebrow">Start now</p>
          <h2>Turn daily baby data into calmer parenting decisions.</h2>
          <p>
            Open the app, choose a plan and build a smarter system around your real daily life.
          </p>

          <div className="homePremium__ctaActions">
            <button
              type="button"
              className="homePremium__primaryBtn"
              onClick={() => choosePlanAndGo("premium")}
            >
              Start free
            </button>
            <a href="/dashboard" className="homePremium__ghostBtn">
              Open dashboard
            </a>
            <a href="/marketplace" className="homePremium__ghostBtn">
              Explore marketplace
            </a>
          </div>
        </div>
      </section>

      <footer className="homePremium__footer">
        <div className="homePremium__footerInner">
          <div className="homePremium__footerBrandCol">
            <a href="/" className="homePremium__brand homePremium__brand--footer">
              <div className="homePremium__brandLogo">SB</div>
              <div>
                <p className="homePremium__brandTitle">Smart Baby</p>
                <span className="homePremium__brandSub">System</span>
              </div>
            </a>

            <p className="homePremium__footerText">
              A premium parenting app designed to make sleep, food, care, AI and parent-to-parent marketplace feel calmer, clearer and more connected.
            </p>

            <div className="homePremium__footerSocials">
              <a href="/">Instagram</a>
              <a href="/">Facebook</a>
              <a href="/">Contact</a>
            </div>
          </div>

          <div className="homePremium__footerGrid">
            <div className="homePremium__footerCol">
              <p className="homePremium__footerTitle">Product</p>
              <a href="#overview">Overview</a>
              <a href="#modules">Modules</a>
              <a href="#ai">AI</a>
              <a href="#pricing">Pricing</a>
            </div>

            <div className="homePremium__footerCol">
              <p className="homePremium__footerTitle">App</p>
              <a href="/dashboard">Dashboard</a>
              <a href="/sleep">Sleep</a>
              <a href="/food">Food</a>
              <a href="/care">Care</a>
              <a href="/marketplace">Marketplace</a>
            </div>

            <div className="homePremium__footerCol">
              <p className="homePremium__footerTitle">Get started</p>
              <a href="/onboarding">Onboarding</a>
              <a href="/login">Log in</a>
              <a href="/messages">Messages</a>
            </div>
          </div>
        </div>

        <div className="homePremium__footerBottom">
          <p>© 2026 Smart Baby System. Designed for calm, modern parenting.</p>
        </div>
      </footer>
    </main>
  );
}