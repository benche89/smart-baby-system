"use client";

import { useMemo, useState } from "react";
import { getBabyContext } from "@/lib/baby-data";
import { buildBabyAiContext } from "@/lib/ai-context";
import { getAiResponse } from "@/lib/ai-response";

export default function AiAssistantCard() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const context = useMemo(() => getBabyContext(), []);
  const aiContext = useMemo(() => buildBabyAiContext(context), [context]);

  function handleAsk() {
    const ageMonths = Number(context.profile?.ageMonths || 0);

    const response = getAiResponse({
      question,
      babyContext: aiContext,
      ageMonths,
      totalSleepHours24h: context.summary.totalSleepHours24h,
    });

    setAnswer(response);
  }

  return (
    <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">AI Baby Insight</h3>
        <p className="text-sm text-slate-500">
          Ask a question and get an answer based on saved sleep, food and care data.
        </p>
      </div>

      <div className="mb-4 grid gap-3 md:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Sleep / 24h</p>
          <p className="text-lg font-semibold">{context.summary.totalSleepHours24h}h</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Sleep sessions</p>
          <p className="text-lg font-semibold">{context.summary.sleepCount24h}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Feeds</p>
          <p className="text-lg font-semibold">{context.summary.foodCount24h}</p>
        </div>

        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Care logs</p>
          <p className="text-lg font-semibold">{context.summary.careCount24h}</p>
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Example: Why was my baby fussy after bedtime?"
          className="min-h-[110px] w-full rounded-2xl border border-slate-200 p-3 outline-none focus:border-sky-400"
        />

        <button
          onClick={handleAsk}
          className="rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-600"
        >
          Generate insight
        </button>

        {answer && (
          <div className="whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {answer}
          </div>
        )}
      </div>
    </section>
  );
}