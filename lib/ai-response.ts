type AiInput = {
  question: string;
  babyContext: string;
  ageMonths: number;
  totalSleepHours24h?: number;
};

export function getAiResponse(input: AiInput): string {
  const { question, babyContext, ageMonths, totalSleepHours24h } = input;

  if (!question.trim()) {
    return "Please ask a question.";
  }

  return `AI response based on real data:

👶 Age: ${ageMonths} months
💤 Sleep (24h): ${totalSleepHours24h ?? "unknown"}h

🧠 Context:
${babyContext}

❓ Question:
${question}

👉 AI is analyzing real patterns from your dashboard.`;
}