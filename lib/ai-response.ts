type AiInput = {
  question: string;
  babyContext: string;
  ageMonths?: number;
  totalSleepHours24h?: number;
};

export function getAiResponse({
  question,
  babyContext,
  ageMonths,
  totalSleepHours24h,
}: AiInput) {
  const lower = question.toLowerCase();

  if (lower.includes("sleep")) {
    const expected =
      ageMonths && ageMonths <= 3
        ? "14–17 hours"
        : ageMonths && ageMonths <= 6
        ? "12–16 hours"
        : ageMonths && ageMonths <= 12
        ? "12–15 hours"
        : "around 11–14 hours";

    let headline = `For this age, many babies sleep around ${expected} in a 24-hour period.`;

    if (typeof totalSleepHours24h === "number") {
      if (totalSleepHours24h < 9) {
        headline += " Your recent logs suggest sleep may be lower than expected.";
      } else if (totalSleepHours24h <= 16) {
        headline += " Your recent logs look broadly within a reasonable range.";
      } else {
        headline += " Your recent logs suggest total sleep is on the higher side.";
      }
    }

    return `${headline}

Recent baby data:
${babyContext}

Practical next step:
Keep tracking naps, bedtime consistency, and wake windows for the next 2–3 days.`;
  }

  if (lower.includes("food") || lower.includes("feeding") || lower.includes("milk")) {
    return `I reviewed the saved feeding-related data and recent baby history.

Recent baby data:
${babyContext}

Practical next step:
Check whether feeds are becoming too spaced out, too small, or clustered around tired periods.`;
  }

  if (lower.includes("care") || lower.includes("diaper") || lower.includes("nappy")) {
    return `I reviewed the saved care data and recent baby history.

Recent baby data:
${babyContext}

Practical next step:
Compare today's care frequency with the recent baseline to spot any sudden change.`;
  }

  return `I reviewed the saved profile and recent activity across sleep, food, and care.

Recent baby data:
${babyContext}

Practical next step:
Focus first on one pattern: sleep rhythm, feeding rhythm, or care frequency.`;
}