"use client";

import { useEffect, useMemo, useState } from "react";
import { getBabyContext } from "@/lib/baby-data";
import { buildBabyAiContext } from "@/lib/ai-context";

type AiMeta = {
  confidence?: string;
  dataQuality?: string;
  overallPattern?: string;
};

type AiHistoryItem = {
  id: string;
  question: string;
  answer: string;
  createdAt: string;
  meta?: AiMeta | null;
};

const HISTORY_KEY = "smartBabyAiHistory";
const MAX_HISTORY_ITEMS = 8;

export default function AiAssistantCard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<AiMeta | null>(null);
  const [history, setHistory] = useState<AiHistoryItem[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);

  const context = useMemo(() => getBabyContext(), []);
  const aiContext = useMemo(() => buildBabyAiContext(context), [context]);

  const suggestionChips = useMemo(() => {
    const babyName = context.profile?.babyName?.trim() || "my baby";
    const ageMonths = Number(context.profile?.ageMonths || 0);
    const sleepHours = context.summary.totalSleepHours24h;
    const sleepCount = context.summary.sleepCount24h;
    const foodCount = context.summary.foodCount24h;
    const careCount = context.summary.careCount24h;

    const suggestions = [
      `Why was ${babyName} more fussy before bedtime today?`,
      `Does ${babyName}'s sleep look fragmented based on today's logs?`,
      `Could today's feeding rhythm explain changes in mood or settling?`,
      `What is the strongest pattern you see in ${babyName}'s routine today?`,
      `Is bedtime becoming less stable for ${babyName}?`,
      `What can I improve today to help ${babyName} sleep better tonight?`,
    ];

    if (ageMonths > 0 && ageMonths <= 6) {
      suggestions[2] = `Could cluster feeding or frequent wake-ups explain ${babyName}'s behavior today?`;
    }

    if (sleepHours > 0 && sleepHours < 11) {
      suggestions[5] = `Does ${babyName} look overtired today, and what should I do tonight?`;
    }

    if (sleepCount > 5) {
      suggestions[1] = `Do today's logs suggest fragmented sleep for ${babyName}?`;
    }

    if (foodCount <= 1) {
      suggestions[2] = `Is there too little feeding data today to explain ${babyName}'s mood clearly?`;
    }

    if (careCount > 6) {
      suggestions[3] = `Does today's busy care routine suggest discomfort or an unsettled day for ${babyName}?`;
    }

    return suggestions;
  }, [context]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) {
        setHistoryLoaded(true);
        return;
      }

      const parsed = JSON.parse(raw) as AiHistoryItem[];
      if (Array.isArray(parsed)) {
        setHistory(parsed);
      }
    } catch (err) {
      console.error("Failed to load AI history:", err);
    } finally {
      setHistoryLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!historyLoaded) return;

    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (err) {
      console.error("Failed to save AI history:", err);
    }
  }, [history, historyLoaded]);

  function formatConfidence(value?: string) {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatDataQuality(value?: string) {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatDate(value: string) {
    try {
      return new Date(value).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return value;
    }
  }

  function createHistoryItem(
    currentQuestion: string,
    currentAnswer: string,
    currentMeta?: AiMeta | null
  ): AiHistoryItem {
    return {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      question: currentQuestion,
      answer: currentAnswer,
      createdAt: new Date().toISOString(),
      meta: currentMeta ?? null,
    };
  }

  function saveToHistory(
    currentQuestion: string,
    currentAnswer: string,
    currentMeta?: AiMeta | null
  ) {
    const item = createHistoryItem(currentQuestion, currentAnswer, currentMeta);

    setHistory((prev) => {
      const next = [item, ...prev];
      return next.slice(0, MAX_HISTORY_ITEMS);
    });
  }

  async function handleAsk() {
    const cleanQuestion = question.trim();
    const ageMonths = Number(context.profile?.ageMonths || 0);

    if (!cleanQuestion) {
      setError("Please enter a question first.");
      setAnswer("");
      setMeta(null);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnswer("");
      setMeta(null);

      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: cleanQuestion,
          babyContext: aiContext,
          ageMonths,
          totalSleepHours24h: context.summary.totalSleepHours24h,
          sleepCount24h: context.summary.sleepCount24h,
          foodCount24h: context.summary.foodCount24h,
          careCount24h: context.summary.careCount24h,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to generate AI response.");
      }

      const nextAnswer = data.answer || "No answer generated.";
      const nextMeta = data.meta || null;

      setAnswer(nextAnswer);
      setMeta(nextMeta);
      saveToHistory(cleanQuestion, nextAnswer, nextMeta);
    } catch (err) {
      console.error("AI request failed:", err);
      setError("Sorry, the AI assistant is temporarily unavailable.");
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }

  function handleReuseQuestion(oldQuestion: string) {
    setQuestion(oldQuestion);
    setError("");
  }

  function handleOpenHistoryItem(item: AiHistoryItem) {
    setQuestion(item.question);
    setAnswer(item.answer);
    setMeta(item.meta ?? null);
    setError("");
  }

  function handleDeleteHistoryItem(id: string) {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }

  function handleClearHistory() {
    setHistory([]);
  }

  function handleSuggestionClick(value: string) {
    setQuestion(value);
    setError("");
  }

  return (
    <section className="rounded-[28px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 inline-flex rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
            Smart AI Insight
          </p>
          <h3 className="text-xl font-semibold text-slate-900">AI Baby Insight</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
            Ask a question and get a personalized answer based on saved sleep, food and care data.
          </p>
        </div>

        <div className="hidden rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 px-4 py-3 md:block">
          <p className="text-xs font-medium text-slate-500">Current baby data snapshot</p>
          <p className="mt-1 text-sm font-semibold text-slate-800">
            Personalized insights powered by real logs
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Sleep / 24h</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {context.summary.totalSleepHours24h}h
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Sleep sessions</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {context.summary.sleepCount24h}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Feeds</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {context.summary.foodCount24h}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
          <p className="text-xs uppercase tracking-wide text-slate-500">Care logs</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">
            {context.summary.careCount24h}
          </p>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <div className="space-y-4">
          <div className="rounded-[24px] border border-slate-200 bg-white p-3">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Example: Why was my baby more fussy before bedtime today?"
              className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 outline-none transition focus:border-sky-400"
            />
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Smart suggestions
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Tap a question to generate a premium insight faster.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleSuggestionClick(chip)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleAsk}
              disabled={loading}
              className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Thinking..." : "Generate premium insight"}
            </button>

            {!!question.trim() && (
              <button
                onClick={() => {
                  setQuestion("");
                  setAnswer("");
                  setMeta(null);
                  setError("");
                }}
                type="button"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {meta && (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Overall pattern</p>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-900">
                  {meta.overallPattern || "Not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Confidence</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatConfidence(meta.confidence)}
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-wide text-slate-500">Data quality</p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDataQuality(meta.dataQuality)}
                </p>
              </div>
            </div>
          )}

          {answer && (
            <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-sky-50 via-white to-indigo-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Personalized AI Response
                </p>
              </div>

              <div className="whitespace-pre-line p-5 text-sm leading-7 text-slate-700">
                {answer}
              </div>
            </div>
          )}
        </div>

        <aside className="rounded-[24px] border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                AI History
              </p>
              <h4 className="mt-1 text-lg font-semibold text-slate-900">
                Recent insights
              </h4>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Clear all
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm leading-6 text-slate-500">
              Your recent AI conversations will appear here after you generate your first insight.
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {formatDate(item.createdAt)}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-6 text-slate-900">
                        {item.question}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      className="rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    >
                      Delete
                    </button>
                  </div>

                  {item.meta?.overallPattern && (
                    <div className="mb-3 rounded-xl bg-slate-50 p-3">
                      <p className="text-[11px] uppercase tracking-wide text-slate-500">
                        Pattern
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-700">
                        {item.meta.overallPattern}
                      </p>
                    </div>
                  )}

                  <p className="line-clamp-4 whitespace-pre-line text-sm leading-6 text-slate-600">
                    {item.answer}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenHistoryItem(item)}
                      className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
                    >
                      Open
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReuseQuestion(item.question)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Reuse question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}