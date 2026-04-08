import { BabyContext } from "./baby-data";

function formatValue(value?: string) {
  const clean = value?.trim();
  return clean ? clean : "-";
}

export function buildBabyAiContext(context: BabyContext): string {
  const { profile, summary, sleepEntries, foodEntries, careEntries } = context;

  const latestSleep = sleepEntries.slice(0, 5);
  const latestFood = foodEntries.slice(0, 5);
  const latestCare = careEntries.slice(0, 5);

  return `
BABY PROFILE
- Name: ${formatValue(profile?.babyName)}
- Age in months: ${formatValue(profile?.ageMonths)}
- Usual bedtime: ${formatValue(profile?.bedtime)}
- Main concern: ${formatValue(profile?.mainConcern)}
- Notes: ${formatValue(profile?.notes)}

LAST 24 HOURS SUMMARY
- Total sleep: ${summary.totalSleepHours24h} hours
- Sleep sessions: ${summary.sleepCount24h}
- Feeding events: ${summary.foodCount24h}
- Care events: ${summary.careCount24h}

MOST RECENT SLEEP LOGS
${
  latestSleep.length
    ? latestSleep
        .map(
          (entry) =>
            `- Last nap time: ${formatValue(entry.lastNapTime)}, Duration: ${formatValue(
              entry.napDuration
            )}, Mood: ${formatValue(entry.mood)}`
        )
        .join("\n")
    : "- No recent sleep entries"
}

MOST RECENT FEEDING LOGS
${
  latestFood.length
    ? latestFood
        .map(
          (entry) =>
            `- Meal time: ${formatValue(entry.mealTime)}, Meal type: ${formatValue(
              entry.mealType
            )}, Food: ${formatValue(entry.food)}, Quantity: ${formatValue(
              entry.quantity
            )}, Reaction: ${formatValue(entry.reaction)}`
        )
        .join("\n")
    : "- No recent food entries"
}

MOST RECENT CARE LOGS
${
  latestCare.length
    ? latestCare
        .map(
          (entry) =>
            `- Time: ${formatValue(entry.time)}, Care type: ${formatValue(
              entry.careType
            )}, Status: ${formatValue(entry.status)}, Note: ${formatValue(entry.note)}`
        )
        .join("\n")
    : "- No recent care entries"
}
  `.trim();
}