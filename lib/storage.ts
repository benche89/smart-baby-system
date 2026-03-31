// lib/storage.ts

export type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

export type SleepEntry = {
  id: number;
  start: string;
  end: string;
  duration: string;
  quality: string;
  note: string;
  createdAt: string;
};

export type FoodEntry = {
  id: number;
  time: string;
  type: string;
  amount: string;
  note: string;
  createdAt: string;
};

export type CareEntry = {
  id: number;
  time: string;
  careType: string;
  status: string;
  note: string;
  createdAt: string;
};

const PROFILE_KEY = "sb_profile";
const SLEEP_KEY = "sb_sleep_entries";
const FOOD_KEY = "sb_food_entries";
const CARE_KEY = "sb_care_entries";

export function saveProfile(profileData: BabyProfile) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
}

export function getProfile(): BabyProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveSleepEntry(entry: Omit<SleepEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;

  const newEntry: SleepEntry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  const existing = JSON.parse(localStorage.getItem(SLEEP_KEY) || "[]");
  const updated = [newEntry, ...existing];

  localStorage.setItem(SLEEP_KEY, JSON.stringify(updated));
}

export function getSleepEntries(): SleepEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(SLEEP_KEY) || "[]");
}

export function saveFoodEntry(entry: Omit<FoodEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;

  const newEntry: FoodEntry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  const existing = JSON.parse(localStorage.getItem(FOOD_KEY) || "[]");
  const updated = [newEntry, ...existing];

  localStorage.setItem(FOOD_KEY, JSON.stringify(updated));
}

export function getFoodEntries(): FoodEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(FOOD_KEY) || "[]");
}

export function saveCareEntry(entry: Omit<CareEntry, "id" | "createdAt">) {
  if (typeof window === "undefined") return;

  const newEntry: CareEntry = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...entry,
  };

  const existing = JSON.parse(localStorage.getItem(CARE_KEY) || "[]");
  const updated = [newEntry, ...existing];

  localStorage.setItem(CARE_KEY, JSON.stringify(updated));
}

export function getCareEntries(): CareEntry[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(CARE_KEY) || "[]");
}