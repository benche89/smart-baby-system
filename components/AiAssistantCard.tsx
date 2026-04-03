"use client";

import { useMemo, useState } from "react";
import { getBabyContext } from "@/lib/baby-data";
import { buildBabyAiContext } from "@/lib/ai-context";

type AiMeta = {
  confidence?: string;
  dataQuality?: string;
  overallPattern?: string;
};

export default function AiAssistantCard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [meta, setMeta] = useState<AiMeta | null>(null);

  const context = useMemo(() => getBabyContext(), []);
  const aiContext = useMemo(() => buildBabyAiContext(context), [context]);

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

      setAnswer(data.answer || "No answer generated.");
      setMeta(data.meta || null);
    } catch (err) {
      console.error("AI request failed:", err);
      setError("Sorry, the AI assistant is temporarily unavailable.");
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }

  function formatConfidence(value?: string) {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function formatDataQuality(value?: string) {
    if (!value) return "Unknown";
    return value.charAt(0).toUpperCase() + value.slice(1);
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

      <div className="space-y-4">
        <div className="rounded-[24px] border border-slate-200 bg-white p-3">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Example: Why was my baby more fussy before bedtime today?"
            className="min-h-[120px] w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm text-slate-700 outline-none transition focus:border-sky-400"
          />
        </div>

        <button
          onClick={handleAsk}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Thinking..." : "Generate premium insight"}
        </button>

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
    </section>
  );
}