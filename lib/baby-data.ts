export type BabyProfile = {
  babyName?: string;
  ageMonths?: string;
  bedtime?: string;
  mainConcern?: string;
  notes?: string;
};

export type SleepEntry = {
  id: number;
  start?: string;
  end?: string;
  duration?: string;
  quality?: string;
  note?: string;
  createdAt?: string;
};

export type FoodEntry = {
  id: number;
  time?: string;
  type?: string;
  amount?: string;
  note?: string;
  createdAt?: string;
};

export type CareEntry = {
  id: number;
  time?: string;
  careType?: string;
  status?: string;
  note?: string;
  createdAt?: string;
};

export type BabyContext = {
  profile: BabyProfile | null;
  sleepEntries: SleepEntry[];
  foodEntries: FoodEntry[];
  careEntries: CareEntry[];
  summary: {
    totalSleepHours24h: number;
    sleepCount24h: number;
    foodCount24h: number;
    careCount24h: number;
    lastSleep?: SleepEntry | null;
    lastFood?: FoodEntry | null;
    lastCare?: CareEntry | null;
  };
};

const PROFILE_KEY = "sb_profile";
const SLEEP_KEY = "sb_sleep_entries";
const FOOD_KEY = "sb_food_entries";
const CARE_KEY = "sb_care_entries";

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function parseDurationToHours(duration?: string): number {
  if (!duration) return 0;

  const lower = duration.toLowerCase().trim();

  const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*h/);
  const minMatch = lower.match(/(\d+(?:\.\d+)?)\s*m/);

  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const mins = minMatch ? Number(minMatch[1]) : 0;

  if (!hourMatch && !minMatch) {
    const asNumber = Number(lower);
    return Number.isFinite(asNumber) ? asNumber : 0;
  }

  return hours + mins / 60;
}

function isWithinLast24h(dateString?: string): boolean {
  if (!dateString) return false;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return false;

  const now = Date.now();
  return now - date.getTime() <= 24 * 60 * 60 * 1000;
}

function sortNewestFirst<T extends { createdAt?: string; id?: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;

    return bTime - aTime || (b.id ?? 0) - (a.id ?? 0);
  });
}

export function getBabyContext(): BabyContext {
  if (typeof window === "undefined") {
    return {
      profile: null,
      sleepEntries: [],
      foodEntries: [],
      careEntries: [],
      summary: {
        totalSleepHours24h: 0,
        sleepCount24h: 0,
        foodCount24h: 0,
        careCount24h: 0,
        lastSleep: null,
        lastFood: null,
        lastCare: null,
      },
    };
  }

  const profile = safeParse<BabyProfile | null>(
    window.localStorage.getItem(PROFILE_KEY),
    null
  );

  const sleepEntries = sortNewestFirst(
    safeParse<SleepEntry[]>(window.localStorage.getItem(SLEEP_KEY), [])
  );

  const foodEntries = sortNewestFirst(
    safeParse<FoodEntry[]>(window.localStorage.getItem(FOOD_KEY), [])
  );

  const careEntries = sortNewestFirst(
    safeParse<CareEntry[]>(window.localStorage.getItem(CARE_KEY), [])
  );

  const sleep24h = sleepEntries.filter((item) => isWithinLast24h(item.createdAt));
  const food24h = foodEntries.filter((item) => isWithinLast24h(item.createdAt));
  const care24h = careEntries.filter((item) => isWithinLast24h(item.createdAt));

  const totalSleepHours24h = sleep24h.reduce((sum, item) => {
    return sum + parseDurationToHours(item.duration);
  }, 0);

  return {
    profile,
    sleepEntries,
    foodEntries,
    careEntries,
    summary: {
      totalSleepHours24h: Number(totalSleepHours24h.toFixed(1)),
      sleepCount24h: sleep24h.length,
      foodCount24h: food24h.length,
      careCount24h: care24h.length,
      lastSleep: sleepEntries[0] ?? null,
      lastFood: foodEntries[0] ?? null,
      lastCare: careEntries[0] ?? null,
    },
  };
}