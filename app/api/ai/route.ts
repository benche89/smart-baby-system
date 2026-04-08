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
  strongestDriver: string;
  trackingCompleteness: string;
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
  let strongestDriver = "insufficient structured data";
  let trackingCompleteness = "partial";

  let availableMetrics = 0;
  if (totalSleepHours24h !== null) availableMetrics += 1;
  if (sleepCount24h !== null) availableMetrics += 1;
  if (foodCount24h !== null) availableMetrics += 1;
  if (careCount24h !== null) availableMetrics += 1;

  if (availableMetrics >= 3) {
    dataQuality = "good";
    confidence = "moderate";
    trackingCompleteness = "good";
  }

  if (availableMetrics === 4) {
    dataQuality = "strong";
    confidence = "good";
    trackingCompleteness = "strong";
  }

  if (totalSleepHours24h !== null) {
    if (totalSleepHours24h < range.min - 1.5) {
      sleepSignal = `sleep appears clearly below the expected ${range.label}`;
    } else if (totalSleepHours24h < range.min) {
      sleepSignal = `sleep appears slightly below the expected ${range.label}`;
    } else if (totalSleepHours24h > range.max + 1.5) {
      sleepSignal = `sleep appears clearly above the expected ${range.label}`;
    } else if (totalSleepHours24h > range.max) {
      sleepSignal = `sleep appears slightly above the expected ${range.label}`;
    } else {
      sleepSignal = `total sleep appears broadly within the expected ${range.label}`;
    }
  }

  if (sleepCount24h !== null) {
    if (sleepCount24h === 0) {
      routineSignal = "no sleep sessions were logged, so tracking may be incomplete";
    } else if (sleepCount24h === 1) {
      routineSignal =
        "very few sleep sessions were logged, which may reflect incomplete tracking or a disrupted day";
    } else if (sleepCount24h >= 2 && sleepCount24h <= 5) {
      routineSignal = "sleep session count suggests a trackable daily rhythm";
    } else {
      routineSignal = "many sleep sessions were logged, which can reflect fragmented sleep";
    }
  }

  if (foodCount24h !== null) {
    if (foodCount24h === 0) {
      feedingSignal = "no feeds were logged, so feeding data may be incomplete";
    } else if (foodCount24h === 1) {
      feedingSignal =
        "very little feeding activity was logged, which may indicate incomplete tracking or an unusual day";
    } else if (foodCount24h >= 2 && foodCount24h <= 8) {
      feedingSignal = "feeding activity suggests a usable routine signal";
    } else {
      feedingSignal =
        "frequent feeds may reflect cluster feeding, comfort feeding, or a more unsettled day";
    }
  }

  if (careCount24h !== null) {
    if (careCount24h === 0) {
      careSignal = "there are no recent care logs";
    } else if (careCount24h <= 2) {
      careSignal = "care logs are light but still somewhat usable";
    } else if (careCount24h <= 6) {
      careSignal = "care logging suggests a reasonably documented day";
    } else {
      careSignal = "many care logs may reflect a busy, uncomfortable, or unsettled day";
    }
  }

  const lowSleep =
    totalSleepHours24h !== null && totalSleepHours24h < range.min;
  const veryLowSleep =
    totalSleepHours24h !== null && totalSleepHours24h < range.min - 1.5;
  const highSleep =
    totalSleepHours24h !== null && totalSleepHours24h > range.max;
  const fragmentedSleep =
    sleepCount24h !== null && sleepCount24h > 5;
  const stableSleepRhythm =
    sleepCount24h !== null && sleepCount24h >= 2 && sleepCount24h <= 5;
  const lowFeeds =
    foodCount24h !== null && foodCount24h <= 1;
  const frequentFeeds =
    foodCount24h !== null && foodCount24h > 8;
  const heavyCare =
    careCount24h !== null && careCount24h > 6;

  if (availableMetrics <= 1) {
    overallPattern =
      "there is not enough structured data yet to infer a reliable pattern";
    dataQuality = "very limited";
    confidence = "low";
    strongestDriver = "insufficient data";
    bedtimeRisk = "unclear";
  } else if (veryLowSleep && fragmentedSleep) {
    overallPattern =
      "the strongest pattern is overtiredness risk linked to reduced and fragmented sleep";
    bedtimeRisk = "elevated";
    confidence = availableMetrics >= 3 ? "good" : confidence;
    strongestDriver = "low total sleep combined with fragmented sleep";
  } else if (lowSleep && fragmentedSleep) {
    overallPattern =
      "the strongest pattern is a disrupted sleep rhythm that may contribute to fussiness and harder settling";
    bedtimeRisk = "elevated";
    strongestDriver = "fragmented sleep with below-range total sleep";
  } else if (lowSleep && frequentFeeds) {
    overallPattern =
      "the logs suggest a more unsettled day with lower sleep and frequent feeding activity";
    bedtimeRisk = "moderate";
    strongestDriver = "lower sleep plus frequent feeding";
  } else if (lowSleep) {
    overallPattern =
      "the strongest pattern is lower-than-expected sleep, which may affect mood, regulation, and settling";
    bedtimeRisk = "moderate";
    strongestDriver = "lower-than-expected sleep";
  } else if (fragmentedSleep) {
    overallPattern =
      "the strongest pattern is fragmented sleep, which can reduce restorative rest even when total hours look acceptable";
    bedtimeRisk = "moderate";
    strongestDriver = "fragmented sleep";
  } else if (frequentFeeds && heavyCare) {
    overallPattern =
      "the day appears more active and possibly unsettled, with frequent feeding and many care-related events";
    bedtimeRisk = "moderate";
    strongestDriver = "high feeding and care activity";
  } else if (heavyCare && (lowSleep || fragmentedSleep)) {
    overallPattern =
      "the logs suggest a busy or unsettled day alongside a less stable sleep pattern";
    bedtimeRisk = "moderate";
    strongestDriver = "busy care pattern with unstable sleep";
  } else if (
    totalSleepHours24h !== null &&
    totalSleepHours24h >= range.min &&
    totalSleepHours24h <= range.max &&
    stableSleepRhythm &&
    foodCount24h !== null &&
    foodCount24h >= 2
  ) {
    overallPattern =
      "the recent routine looks broadly stable based on the available logs";
    bedtimeRisk = "low";
    confidence = availableMetrics === 4 ? "good" : confidence;
    strongestDriver = "stable sleep and feeding rhythm";
  } else if (highSleep && !fragmentedSleep) {
    overallPattern =
      "the routine may reflect a more sleepy or recovery-type day, though context still matters";
    bedtimeRisk = "low";
    strongestDriver = "higher total sleep";
  } else {
    overallPattern =
      "the logs show some usable signals, but no single dominant pattern stands out clearly";
    bedtimeRisk = "unclear";
    strongestDriver = "mixed routine signals";
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
    strongestDriver,
    trackingCompleteness,
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
- identify likely patterns from sleep, feeding, and care
- clearly separate observations from possibilities
- explain what is supported by the logs and what is less certain
- avoid generic filler
- give realistic same-day suggestions
- make the answer feel personalized and genuinely useful

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
- no markdown bullets unless truly needed
- short paragraphs only
- mention the strongest pattern first
- be specific with the available data
- avoid sounding robotic or repetitive
- do not say "as an AI"
- do not mention prompts, tokens, models, or internal analysis
- do not overuse warnings when nothing urgent is present
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
- Strongest driver: ${signals.strongestDriver}
- Bedtime risk: ${signals.bedtimeRisk}
- Data quality: ${signals.dataQuality}
- Confidence level: ${signals.confidence}
- Tracking completeness: ${signals.trackingCompleteness}

Detailed Smart Baby System context:
${babyContext}

Instructions for the answer:
- answer the parent's exact question directly
- start from the strongest data-backed pattern
- mention the strongest driver in natural language when useful
- if data is limited, say that naturally without sounding repetitive
- if sleep appears fragmented, mention that clearly
- if sleep appears low for age, mention that clearly
- if the routine looks broadly stable, say that clearly
- suggest practical actions for today or tonight
- keep the advice realistic and simple
- avoid overclaiming
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