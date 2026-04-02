export type SleepEntry = {
  lastNapTime: string;
  napDuration: string;
  mood: string;
};

export type FoodEntry = {
  food: string;
  reaction: string;
};

export function analyzeSleep(sleepEntries: SleepEntry[]) {
  if (sleepEntries.length < 2) return null;

  const last3 = sleepEntries.slice(-3);

  const durations = last3.map((e) => parseInt(e.napDuration || "0"));
  const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

  const unstable = durations.some((d) => Math.abs(d - avg) > 30);

  if (unstable) {
    return "Sleep inconsistent last 3 days";
  }

  return "Sleep pattern stable";
}

export function analyzeFood(foodEntries: FoodEntry[]) {
  const reactions = foodEntries.filter((f) =>
    f.reaction.toLowerCase().includes("bad") ||
    f.reaction.toLowerCase().includes("allergy") ||
    f.reaction.toLowerCase().includes("rash")
  );

  if (reactions.length >= 2) {
    return "Possible sensitivity detected";
  }

  return null;
}

export function buildInsights({
  sleep,
  food,
}: {
  sleep: SleepEntry[];
  food: FoodEntry[];
}) {
  const insights: string[] = [];

  const sleepInsight = analyzeSleep(sleep);
  if (sleepInsight) insights.push(sleepInsight);

  const foodInsight = analyzeFood(food);
  if (foodInsight) insights.push(foodInsight);

  return insights;
}