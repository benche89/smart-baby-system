export type BabyProfile = {
  babyName?: string;
  ageMonths?: string;
  bedtime?: string;
  mainConcern?: string;
  notes?: string;
};

export type SleepEntry = {
  id: number;
  lastNapTime?: string;
  napDuration?: string;
  mood?: string;
  createdAt?: string;
};

export type FoodEntry = {
  id: number;
  mealTime?: string;
  mealType?: string;
  food?: string;
  quantity?: string;
  reaction?: string;
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

const PROFILE_KEY = "smart-baby-profile";
const SLEEP_KEY = "smart-baby-sleep";
const FOOD_KEY = "smart-baby-food";
const CARE_KEY = "smart-baby-care";

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

function normalizeProfile(data: any): BabyProfile | null {
  if (!data || typeof data !== "object") return null;

  return {
    babyName: data?.babyName ?? "",
    ageMonths:
      data?.ageMonths !== null && data?.ageMonths !== undefined
        ? String(data.ageMonths)
        : "",
    bedtime: data?.bedtime ?? "",
    mainConcern: data?.mainConcern ?? "",
    notes: data?.notes ?? "",
  };
}

function normalizeSleepEntry(data: any): SleepEntry {
  return {
    id: Number(data?.id ?? Date.now()),
    lastNapTime: data?.lastNapTime ?? "",
    napDuration: data?.napDuration ?? "",
    mood: data?.mood ?? "",
    createdAt: data?.createdAt ?? "",
  };
}

function normalizeFoodEntry(data: any): FoodEntry {
  return {
    id: Number(data?.id ?? Date.now()),
    mealTime: data?.mealTime ?? "",
    mealType: data?.mealType ?? "",
    food: data?.food ?? "",
    quantity: data?.quantity ?? "",
    reaction: data?.reaction ?? "",
    createdAt: data?.createdAt ?? "",
  };
}

function normalizeCareEntry(data: any): CareEntry {
  return {
    id: Number(data?.id ?? Date.now()),
    time: data?.time ?? "",
    careType: data?.careType ?? "",
    status: data?.status ?? "",
    note: data?.note ?? "",
    createdAt: data?.createdAt ?? "",
  };
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

  const rawProfile = safeParse<any | null>(window.localStorage.getItem(PROFILE_KEY), null);
  const rawSleep = safeParse<any[]>(window.localStorage.getItem(SLEEP_KEY), []);
  const rawFood = safeParse<any[]>(window.localStorage.getItem(FOOD_KEY), []);
  const rawCare = safeParse<any[]>(window.localStorage.getItem(CARE_KEY), []);

  const profile = normalizeProfile(rawProfile);

  const sleepEntries = sortNewestFirst(rawSleep.map(normalizeSleepEntry));
  const foodEntries = sortNewestFirst(rawFood.map(normalizeFoodEntry));
  const careEntries = sortNewestFirst(rawCare.map(normalizeCareEntry));

  const sleep24h = sleepEntries.filter((item) => isWithinLast24h(item.createdAt));
  const food24h = foodEntries.filter((item) => isWithinLast24h(item.createdAt));
  const care24h = careEntries.filter((item) => isWithinLast24h(item.createdAt));

  const totalSleepHours24h = sleep24h.reduce((sum, item) => {
    return sum + parseDurationToHours(item.napDuration);
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