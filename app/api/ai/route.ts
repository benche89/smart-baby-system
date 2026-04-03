import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AiRequestBody = {
  question?: string;
  babyContext?: string;
  ageMonths?: number | string;
  totalSleepHours24h?: number | string;
  sleepCount24h?: number | string;
  foodCount24h?: number | string;
  careCount24h?: number | string;
};

type AnalysisSignals = {
  sleepSignal: string;
  routineSignal: string;
  feedingSignal: string;
  careSignal: string;
  overallPattern: string;
  dataQuality: string;
  bedtimeRisk: string;
  confidence: string;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function getSleepRangeForAge(ageMonths: number | null) {
  if (ageMonths === null) {
    return { min: 10, max: 16, label: "general baby range" };
  }

  if (ageMonths <= 1) {
    return { min: 14, max: 18, label: "newborn range" };
  }

  if (ageMonths <= 3) {
    return { min: 13, max: 17, label: "0-3 months range" };
  }

  if (ageMonths <= 6) {
    return { min: 12, max: 16, label: "4-6 months range" };
  }

  if (ageMonths <= 9) {
    return { min: 11, max: 15, label: "7-9 months range" };
  }

  if (ageMonths <= 12) {
    return { min: 11, max: 14, label: "10-12 months range" };
  }

  if (ageMonths <= 24) {
    return { min: 11, max: 14, label: "toddler range" };
  }

  return { min: 10, max: 13, label: "older toddler range" };
}

function analyzeSignals(body: AiRequestBody): AnalysisSignals {
  const ageMonths = toNumber(body.ageMonths);
  const totalSleepHours24h = toNumber(body.totalSleepHours24h);
  const sleepCount24h = toNumber(body.sleepCount24h);
  const foodCount24h = toNumber(body.foodCount24h);
  const careCount24h = toNumber(body.careCount24h);

  const range = getSleepRangeForAge(ageMonths);

  let sleepSignal = "sleep data is limited";
  let routineSignal = "routine pattern is unclear";
  let feedingSignal = "feeding pattern is unclear";
  let careSignal = "care log signal is limited";
  let overallPattern = "no strong pattern identified yet";
  let dataQuality = "limited";
  let bedtimeRisk = "unclear";
  let confidence = "low";

  let availableMetrics = 0;
  if (totalSleepHours24h !== null) availableMetrics += 1;
  if (sleepCount24h !== null) availableMetrics += 1;
  if (foodCount24h !== null) availableMetrics += 1;
  if (careCount24h !== null) availableMetrics += 1;

  if (availableMetrics >= 3) {
    dataQuality = "good";
    confidence = "moderate";
  }

  if (availableMetrics === 4) {
    dataQuality = "strong";
    confidence = "good";
  }

  if (totalSleepHours24h !== null) {
    if (totalSleepHours24h < range.min - 1) {
      sleepSignal = `sleep appears clearly below the expected ${range.label}`;
    } else if (totalSleepHours24h < range.min) {
      sleepSignal = `sleep appears slightly below the expected ${range.label}`;
    } else if (totalSleepHours24h > range.max + 1) {
      sleepSignal = `sleep appears clearly above the expected ${range.label}`;
    } else if (totalSleepHours24h > range.max) {
      sleepSignal = `sleep appears slightly above the expected ${range.label}`;
    } else {
      sleepSignal = `total sleep appears broadly within the expected ${range.label}`;
    }
  }

  if (sleepCount24h !== null) {
    if (sleepCount24h === 0) {
      routineSignal = "no sleep sessions were logged, so the record may be incomplete";
    } else if (sleepCount24h === 1) {
      routineSignal = "very few sleep sessions were logged, which may reflect incomplete tracking or a disrupted day";
    } else if (sleepCount24h >= 2 && sleepCount24h <= 5) {
      routineSignal = "sleep session count suggests a trackable daily rhythm";
    } else if (sleepCount24h > 5) {
      routineSignal = "many sleep sessions were logged, which can sometimes reflect fragmented sleep";
    }
  }

  if (foodCount24h !== null) {
    if (foodCount24h === 0) {
      feedingSignal = "no feeds were logged, so the feeding record may be incomplete";
    } else if (foodCount24h === 1) {
      feedingSignal = "very few feeds were logged, which may indicate incomplete tracking or an unusual day";
    } else if (foodCount24h >= 2 && foodCount24h <= 8) {
      feedingSignal = "feeding activity suggests a usable routine signal";
    } else if (foodCount24h > 8) {
      feedingSignal = "frequent feeds may reflect cluster feeding, comfort feeding, or a disrupted day";
    }
  }

  if (careCount24h !== null) {
    if (careCount24h === 0) {
      careSignal = "there are no recent care logs";
    } else if (careCount24h <= 2) {
      careSignal = "care logs are light but usable";
    } else if (careCount24h <= 6) {
      careSignal = "care logging suggests a reasonably documented day";
    } else {
      careSignal = "many care logs may indicate a busy or unsettled day";
    }
  }

  const lowSleep =
    totalSleepHours24h !== null && totalSleepHours24h < range.min;
  const veryLowSleep =
    totalSleepHours24h !== null && totalSleepHours24h < range.min - 1;
  const fragmentedSleep =
    sleepCount24h !== null && sleepCount24h > 5;
  const lowFeeds =
    foodCount24h !== null && foodCount24h <= 1;
  const frequentFeeds =
    foodCount24h !== null && foodCount24h > 8;
  const heavyCare =
    careCount24h !== null && careCount24h > 6;

  if (veryLowSleep && fragmentedSleep) {
    overallPattern =
      "the strongest pattern is overtiredness risk linked to reduced and fragmented sleep";
    bedtimeRisk = "elevated";
    confidence = availableMetrics >= 3 ? "good" : confidence;
  } else if (lowSleep && fragmentedSleep) {
    overallPattern =
      "the strongest pattern is a disrupted sleep rhythm that may contribute to fussiness";
    bedtimeRisk = "elevated";
  } else if (lowSleep) {
    overallPattern =
      "the strongest pattern is lower-than-expected sleep, which may affect mood and settling";
    bedtimeRisk = "moderate";
  } else if (fragmentedSleep) {
    overallPattern =
      "the strongest pattern is fragmented sleep, which can reduce restorative rest even if total hours look acceptable";
    bedtimeRisk = "moderate";
  } else if (lowFeeds && lowSleep) {
    overallPattern =
      "the data suggests both low feeding and low sleep activity, but tracking may also be incomplete";
    bedtimeRisk = "moderate";
  } else if (frequentFeeds && fragmentedSleep) {
    overallPattern =
      "the pattern may reflect an unsettled day with frequent feeding and fragmented sleep";
    bedtimeRisk = "moderate";
  } else if (heavyCare && (lowSleep || fragmentedSleep)) {
    overallPattern =
      "the logs suggest a busy or unsettled day alongside a less stable sleep pattern";
    bedtimeRisk = "moderate";
  } else if (
    totalSleepHours24h !== null &&
    sleepCount24h !== null &&
    foodCount24h !== null &&
    totalSleepHours24h >= range.min &&
    totalSleepHours24h <= range.max &&
    sleepCount24h >= 2 &&
    foodCount24h >= 2
  ) {
    overallPattern =
      "the recent routine looks broadly stable based on the available logs";
    bedtimeRisk = "low";
    confidence = availableMetrics === 4 ? "good" : confidence;
  }

  if (availableMetrics <= 1) {
    overallPattern =
      "there is not enough structured data yet to infer a strong pattern";
    dataQuality = "very limited";
    confidence = "low";
  }

  return {
    sleepSignal,
    routineSignal,
    feedingSignal,
    careSignal,
    overallPattern,
    dataQuality,
    bedtimeRisk,
    confidence,
  };
}

function buildSystemPrompt() {
  return `
You are Smart Baby System AI, a premium parenting assistant inside a baby care platform.

Your tone:
- warm
- calm
- emotionally reassuring
- practical
- premium
- intelligent but simple

Your job:
- answer the parent's question using the provided baby data first
- identify likely patterns from sleep, food and care
- explain clearly what is supported by the data
- avoid generic filler
- give practical same-day suggestions
- make the answer feel personalized and useful

Safety rules:
- do not diagnose
- do not invent medical facts
- do not present guesses as certainty
- if the data is incomplete, say so clearly
- if severe symptoms are mentioned or implied, advise contacting a doctor or emergency services
- keep the tone calm, never alarming

Output format:
Use these exact section headings, in this exact order:

What the data suggests
Why this may be happening
What you can try today
When to get medical advice

Style rules:
- write in English
- no emojis
- no markdown bullet overload
- short paragraphs only
- mention the strongest pattern first
- separate observation from possibility
- do not say "as an AI"
- do not mention tokens, models, prompts, or internal analysis
`;
}

function buildUserPrompt(body: AiRequestBody, signals: AnalysisSignals) {
  const question = body.question?.trim() || "";
  const babyContext = body.babyContext?.trim() || "No additional context provided.";
  const ageMonths = toNumber(body.ageMonths);
  const totalSleepHours24h = toNumber(body.totalSleepHours24h);
  const sleepCount24h = toNumber(body.sleepCount24h);
  const foodCount24h = toNumber(body.foodCount24h);
  const careCount24h = toNumber(body.careCount24h);

  return `
Parent question:
${question}

Baby structured data:
- Age in months: ${ageMonths ?? "unknown"}
- Total sleep in last 24h: ${totalSleepHours24h ?? "unknown"} hours
- Sleep sessions in last 24h: ${sleepCount24h ?? "unknown"}
- Feeds in last 24h: ${foodCount24h ?? "unknown"}
- Care logs in last 24h: ${careCount24h ?? "unknown"}

Internal analysis signals:
- Sleep signal: ${signals.sleepSignal}
- Routine signal: ${signals.routineSignal}
- Feeding signal: ${signals.feedingSignal}
- Care signal: ${signals.careSignal}
- Strongest overall pattern: ${signals.overallPattern}
- Bedtime risk: ${signals.bedtimeRisk}
- Data quality: ${signals.dataQuality}
- Confidence level: ${signals.confidence}

Detailed Smart Baby System context:
${babyContext}

Instructions for the answer:
- answer the parent's question directly
- start from the strongest data-backed pattern
- if the logs are limited, say so naturally
- if sleep appears fragmented, mention that clearly
- if sleep appears low for age, mention that clearly
- if routine looks stable, say that too
- give practical steps that a parent can try today
- do not overstate certainty
`;
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY." },
        { status: 500 }
      );
    }

    const body = (await req.json()) as AiRequestBody;
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const signals = analyzeSignals(body);

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(body, signals),
        },
      ],
    });

    const answer = response.output_text?.trim();

    return NextResponse.json({
      answer: answer || "No answer generated.",
      meta: {
        confidence: signals.confidence,
        dataQuality: signals.dataQuality,
        overallPattern: signals.overallPattern,
      },
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "AI request failed." },
      { status: 500 }
    );
  }
}