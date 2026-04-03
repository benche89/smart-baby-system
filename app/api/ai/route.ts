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
    const babyContext = body.babyContext ?? "";
    const ageMonths = body.ageMonths ?? "";

    if (!question) {
      return NextResponse.json(
        { error: "Question is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are Smart Baby System AI, a calm, premium parenting assistant.

Your role:
- help parents understand baby routines
- give practical, simple guidance
- use real data provided below
- do NOT invent medical facts
- do NOT diagnose
- if serious symptoms appear → recommend contacting a doctor

Baby age (months): ${ageMonths}

Daily summary:
- Sleep (24h): ${body.totalSleepHours24h ?? "unknown"} hours
- Sleep sessions: ${body.sleepCount24h ?? "unknown"}
- Feeds: ${body.foodCount24h ?? "unknown"}
- Care logs: ${body.careCount24h ?? "unknown"}

Detailed baby context:
${babyContext}

Parent question:
${question}

Write the answer:
- warm, calm, confident tone
- clear and practical
- 2–4 short paragraphs
- no emojis
`;

    const response = await client.responses.create({
      model: "gpt-5",
      input: prompt,
    });

    return NextResponse.json({
      answer: response.output_text || "No answer generated.",
    });
  } catch (error) {
    console.error("AI ROUTE ERROR:", error);

    return NextResponse.json(
      { error: "AI request failed." },
      { status: 500 }
    );
  }
}