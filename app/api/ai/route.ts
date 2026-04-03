import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type AiRequestBody = {
  question?: string;
  babyContext?: string;
  ageMonths?: number | string;
  totalSleepHours24h?: number;
  sleepCount24h?: number;
  foodCount24h?: number;
  careCount24h?: number;
};

function toNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function buildSystemPrompt() {
  return `
You are Smart Baby System AI, a premium parenting assistant.

Your personality:
- calm
- warm
- practical
- reassuring
- clear
- never dramatic

Your job:
- interpret baby routine data in a helpful way
- identify likely patterns from sleep, food and care data
- explain what the data may suggest
- give practical next steps the parent can try today
- clearly separate observations from assumptions
- use the provided data, not generic parenting filler

Safety rules:
- do not diagnose
- do not invent medical facts
- do not claim certainty when the data is incomplete
- if symptoms sound serious, advise contacting a doctor
- if there are red flags, say so clearly but calmly

Response style:
- write in English
- no emojis
- concise but useful
- use short sections with these exact headings:

What the data suggests
Possible explanation
What you can try today
When to get medical advice

Writing rules:
- keep each section short
- personalize the answer to the provided data
- mention missing data when relevant
- do not mention "as an AI"
`;
}

function buildUserPrompt(body: AiRequestBody) {
  const ageMonths = toNumber(body.ageMonths);
  const totalSleepHours24h = toNumber(body.totalSleepHours24h);
  const sleepCount24h = toNumber(body.sleepCount24h);
  const foodCount24h = toNumber(body.foodCount24h);
  const careCount24h = toNumber(body.careCount24h);
  const question = body.question?.trim() ?? "";
  const babyContext = body.babyContext?.trim() ?? "";

  let sleepSignal = "unknown";
  if (totalSleepHours24h !== null) {
    if (ageMonths !== null && ageMonths <= 3) {
      if (totalSleepHours24h < 12) sleepSignal = "lower than expected for a very young baby";
      else if (totalSleepHours24h > 18) sleepSignal = "higher than usual range for a very young baby";
      else sleepSignal = "within a broadly expected range for a very young baby";
    } else if (ageMonths !== null && ageMonths <= 6) {
      if (totalSleepHours24h < 11) sleepSignal = "possibly low for this age range";
      else if (totalSleepHours24h > 17) sleepSignal = "possibly high for this age range";
      else sleepSignal = "roughly balanced for this age range";
    } else if (ageMonths !== null && ageMonths <= 12) {
      if (totalSleepHours24h < 10) sleepSignal = "possibly low for this age range";
      else if (totalSleepHours24h > 16) sleepSignal = "possibly high for this age range";
      else sleepSignal = "roughly balanced for this age range";
    } else {
      if (totalSleepHours24h < 9) sleepSignal = "possibly low";
      else if (totalSleepHours24h > 15) sleepSignal = "possibly high";
      else sleepSignal = "roughly balanced";
    }
  }

  let routineSignal = "routine consistency unclear";
  if (
    sleepCount24h !== null &&
    foodCount24h !== null &&
    careCount24h !== null
  ) {
    if (sleepCount24h === 0 && foodCount24h === 0 && careCount24h === 0) {
      routineSignal = "there is almost no logged data in the last 24 hours";
    } else if (sleepCount24h <= 1 || foodCount24h <= 1) {
      routineSignal = "the logs may be incomplete or the routine may be irregular";
    } else {
      routineSignal = "there is enough recent activity to infer some routine patterns";
    }
  }

  return `
Parent question:
${question}

Baby age in months:
${ageMonths ?? "unknown"}

Recent daily summary:
- Total sleep in last 24h: ${totalSleepHours24h ?? "unknown"} hours
- Sleep sessions in last 24h: ${sleepCount24h ?? "unknown"}
- Feeds in last 24h: ${foodCount24h ?? "unknown"}
- Care logs in last 24h: ${careCount24h ?? "unknown"}

Internal interpretation hints:
- Sleep signal: ${sleepSignal}
- Routine signal: ${routineSignal}

Detailed context from Smart Baby System:
${babyContext || "No additional context provided."}

Instructions:
- answer the parent's question using the data first
- identify the strongest likely pattern, if any
- if the data is thin, say that clearly
- avoid overclaiming
- make the answer feel premium, practical and personalized
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

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(body),
        },
      ],
    });

    const answer = response.output_text?.trim();

    return NextResponse.json({
      answer: answer || "No answer generated.",
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "AI request failed." },
      { status: 500 }
    );
  }
}