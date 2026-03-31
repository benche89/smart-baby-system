import { BabyContext } from "./baby-data";

export function buildBabyAiContext(context: BabyContext): string {
  const { profile, summary, sleepEntries, foodEntries, careEntries } = context;

  const latestSleep = sleepEntries.slice(0, 3);
  const latestFood = foodEntries.slice(0, 3);
  const latestCare = careEntries.slice(0, 3);

  return `
BABY PROFILE
- Name: ${profile?.babyName || "Unknown"}
- Age in months: ${profile?.ageMonths || "Unknown"}
- Usual bedtime: ${profile?.bedtime || "Unknown"}
- Main concern: ${profile?.mainConcern || "None provided"}
- Notes: ${profile?.notes || "None"}

LAST 24 HOURS SUMMARY
- Total sleep: ${summary.totalSleepHours24h} hours
- Sleep sessions: ${summary.sleepCount24h}
- Feeding events: ${summary.foodCount24h}
- Care events: ${summary.careCount24h}

RECENT SLEEP ENTRIES
${
  latestSleep.length
    ? latestSleep
        .map(
          (entry) =>
            `- Start: ${entry.start || "-"}, End: ${entry.end || "-"}, Duration: ${entry.duration || "-"}, Quality: ${entry.quality || "-"}, Note: ${entry.note || "-"}`
        )
        .join("\n")
    : "- No recent sleep entries"
}

RECENT FOOD ENTRIES
${
  latestFood.length
    ? latestFood
        .map(
          (entry) =>
            `- Time: ${entry.time || "-"}, Type: ${entry.type || "-"}, Amount: ${entry.amount || "-"}, Note: ${entry.note || "-"}`
        )
        .join("\n")
    : "- No recent food entries"
}

RECENT CARE ENTRIES
${
  latestCare.length
    ? latestCare
        .map(
          (entry) =>
            `- Time: ${entry.time || "-"}, Care type: ${entry.careType || "-"}, Status: ${entry.status || "-"}, Note: ${entry.note || "-"}`
        )
        .join("\n")
    : "- No recent care entries"
}
  `.trim();
}