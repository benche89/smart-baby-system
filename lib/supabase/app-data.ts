export type PlanTier = "basic" | "premium" | "elite";

export type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
};

export type SleepEntry = {
  id: number;
  lastNapTime: string;
  napDuration: string;
  mood: string;
};

export type FoodEntry = {
  id: number;
  mealTime: string;
  mealType: string;
  food: string;
  quantity: string;
  reaction: string;
};

export type CareEntry = {
  id: number;
  time: string;
  careType: string;
  status: string;
  note: string;
};

const PROFILE_KEY = "smart-baby-profile";
const SLEEP_KEY = "smart-baby-sleep";
const FOOD_KEY = "smart-baby-food";
const CARE_KEY = "smart-baby-care";
const PLAN_KEY = "smart-baby-plan-tier";

const PROFILE_TABLE = "baby_profiles";
const SLEEP_TABLE = "sleep_entries";
const FOOD_TABLE = "food_entries";
const CARE_TABLE = "care_entries";
const PLAN_TABLE = "user_plan";

function isBrowser() {
  return typeof window !== "undefined";
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function getNextId(items: Array<{ id: number }>) {
  if (!items.length) return Date.now();
  return Math.max(...items.map((item) => item.id)) + 1;
}

function hasProfileData(profile: BabyProfile) {
  return Boolean(
    profile.babyName ||
      profile.ageMonths ||
      profile.bedtime ||
      profile.mainConcern ||
      profile.notes
  );
}

function hasSleepData(items: SleepEntry[]) {
  return items.length > 0;
}

function hasFoodData(items: FoodEntry[]) {
  return items.length > 0;
}

function hasCareData(items: CareEntry[]) {
  return items.length > 0;
}

export function getLocalProfile(): BabyProfile {
  if (!isBrowser()) {
    return {
      babyName: "",
      ageMonths: "",
      bedtime: "",
      mainConcern: "",
      notes: "",
    };
  }

  return safeParse<BabyProfile>(localStorage.getItem(PROFILE_KEY), {
    babyName: "",
    ageMonths: "",
    bedtime: "",
    mainConcern: "",
    notes: "",
  });
}

export function saveLocalProfile(profile: BabyProfile) {
  if (!isBrowser()) return;
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getLocalSleepEntries(): SleepEntry[] {
  if (!isBrowser()) return [];
  return safeParse<SleepEntry[]>(localStorage.getItem(SLEEP_KEY), []);
}

export function saveLocalSleepEntries(entries: SleepEntry[]) {
  if (!isBrowser()) return;
  localStorage.setItem(SLEEP_KEY, JSON.stringify(entries));
}

export function getLocalFoodEntries(): FoodEntry[] {
  if (!isBrowser()) return [];
  return safeParse<FoodEntry[]>(localStorage.getItem(FOOD_KEY), []);
}

export function saveLocalFoodEntries(entries: FoodEntry[]) {
  if (!isBrowser()) return;
  localStorage.setItem(FOOD_KEY, JSON.stringify(entries));
}

export function getLocalCareEntries(): CareEntry[] {
  if (!isBrowser()) return [];
  return safeParse<CareEntry[]>(localStorage.getItem(CARE_KEY), []);
}

export function saveLocalCareEntries(entries: CareEntry[]) {
  if (!isBrowser()) return;
  localStorage.setItem(CARE_KEY, JSON.stringify(entries));
}

export function getLocalPlanTier(): PlanTier {
  if (!isBrowser()) return "basic";
  const value = localStorage.getItem(PLAN_KEY);
  if (value === "premium" || value === "elite" || value === "basic") return value;
  return "basic";
}

export function saveLocalPlanTier(plan: PlanTier) {
  if (!isBrowser()) return;
  localStorage.setItem(PLAN_KEY, plan);
}

function normalizeProfile(data: any): BabyProfile {
  return {
    babyName: data?.baby_name ?? data?.babyName ?? "",
    ageMonths:
      data?.age_months !== null && data?.age_months !== undefined
        ? String(data.age_months)
        : data?.ageMonths ?? "",
    bedtime: data?.bedtime ?? "",
    mainConcern: data?.main_concern ?? data?.mainConcern ?? "",
    notes: data?.notes ?? "",
  };
}

function normalizeSleepEntry(data: any): SleepEntry {
  return {
    id: Number(data?.entry_id ?? data?.id ?? Date.now()),
    lastNapTime: data?.last_nap_time ?? data?.lastNapTime ?? "",
    napDuration: data?.nap_duration ?? data?.napDuration ?? "",
    mood: data?.mood ?? "",
  };
}

function normalizeFoodEntry(data: any): FoodEntry {
  return {
    id: Number(data?.entry_id ?? data?.id ?? Date.now()),
    mealTime: data?.meal_time ?? data?.mealTime ?? "",
    mealType: data?.meal_type ?? data?.mealType ?? "",
    food: data?.food ?? "",
    quantity: data?.quantity ?? "",
    reaction: data?.reaction ?? "",
  };
}

function normalizeCareEntry(data: any): CareEntry {
  return {
    id: Number(data?.entry_id ?? data?.id ?? Date.now()),
    time: data?.time ?? "",
    careType: data?.care_type ?? data?.careType ?? "",
    status: data?.status ?? "",
    note: data?.note ?? "",
  };
}

async function getUserOrNull(supabase: any) {
  if (!supabase) return null;

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user ?? null;
  } catch {
    return null;
  }
}

export async function getProfile(supabase: any): Promise<BabyProfile | null> {
  try {
    if (!supabase) return getLocalProfile();

    const user = await getUserOrNull(supabase);
    if (!user) return getLocalProfile();

    const { data, error } = await supabase
      .from(PROFILE_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data) {
      return getLocalProfile();
    }

    const profile = normalizeProfile(data);
    saveLocalProfile(profile);
    return profile;
  } catch (error) {
    console.error("getProfile error:", error);
    return getLocalProfile();
  }
}

export async function upsertProfile(
  supabase: any,
  profile: BabyProfile
): Promise<{ success: boolean; error?: string }> {
  try {
    saveLocalProfile(profile);

    if (!supabase) {
      return { success: true };
    }

    const user = await getUserOrNull(supabase);
    if (!user) {
      return { success: true };
    }

    const payload = {
      user_id: user.id,
      baby_name: profile.babyName,
      age_months: profile.ageMonths ? Number(profile.ageMonths) : null,
      bedtime: profile.bedtime,
      main_concern: profile.mainConcern,
      notes: profile.notes,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(PROFILE_TABLE).upsert(payload, {
      onConflict: "user_id",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error("upsertProfile error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function getSleepEntries(supabase: any): Promise<SleepEntry[]> {
  try {
    if (!supabase) return getLocalSleepEntries();

    const user = await getUserOrNull(supabase);
    if (!user) return getLocalSleepEntries();

    const { data, error } = await supabase
      .from(SLEEP_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("entry_id", { ascending: false });

    if (error || !data) {
      return getLocalSleepEntries();
    }

    const entries = data.map(normalizeSleepEntry);
    saveLocalSleepEntries(entries);
    return entries;
  } catch (error) {
    console.error("getSleepEntries error:", error);
    return getLocalSleepEntries();
  }
}

export async function addSleepEntry(
  supabase: any,
  entry: Omit<SleepEntry, "id">
): Promise<{ success: boolean; error?: string; entry?: SleepEntry }> {
  try {
    const localEntries = getLocalSleepEntries();
    const newEntry: SleepEntry = {
      id: getNextId(localEntries),
      ...entry,
    };

    saveLocalSleepEntries([newEntry, ...localEntries]);

    if (!supabase) {
      return { success: true, entry: newEntry };
    }

    const user = await getUserOrNull(supabase);
    if (!user) {
      return { success: true, entry: newEntry };
    }

    const payload = {
      user_id: user.id,
      entry_id: newEntry.id,
      last_nap_time: newEntry.lastNapTime,
      nap_duration: newEntry.napDuration,
      mood: newEntry.mood,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(SLEEP_TABLE).insert(payload);

    if (error) {
      return { success: false, error: error.message, entry: newEntry };
    }

    return { success: true, entry: newEntry };
  } catch (error: any) {
    console.error("addSleepEntry error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function deleteSleepEntry(
  supabase: any,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    saveLocalSleepEntries(getLocalSleepEntries().filter((item) => item.id !== id));

    if (!supabase) return { success: true };

    const user = await getUserOrNull(supabase);
    if (!user) return { success: true };

    const { error } = await supabase
      .from(SLEEP_TABLE)
      .delete()
      .eq("user_id", user.id)
      .eq("entry_id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error: any) {
    console.error("deleteSleepEntry error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function getFoodEntries(supabase: any): Promise<FoodEntry[]> {
  try {
    if (!supabase) return getLocalFoodEntries();

    const user = await getUserOrNull(supabase);
    if (!user) return getLocalFoodEntries();

    const { data, error } = await supabase
      .from(FOOD_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("entry_id", { ascending: false });

    if (error || !data) {
      return getLocalFoodEntries();
    }

    const entries = data.map(normalizeFoodEntry);
    saveLocalFoodEntries(entries);
    return entries;
  } catch (error) {
    console.error("getFoodEntries error:", error);
    return getLocalFoodEntries();
  }
}

export async function addFoodEntry(
  supabase: any,
  entry: Omit<FoodEntry, "id">
): Promise<{ success: boolean; error?: string; entry?: FoodEntry }> {
  try {
    const localEntries = getLocalFoodEntries();
    const newEntry: FoodEntry = {
      id: getNextId(localEntries),
      ...entry,
    };

    saveLocalFoodEntries([newEntry, ...localEntries]);

    if (!supabase) {
      return { success: true, entry: newEntry };
    }

    const user = await getUserOrNull(supabase);
    if (!user) {
      return { success: true, entry: newEntry };
    }

    const payload = {
      user_id: user.id,
      entry_id: newEntry.id,
      meal_time: newEntry.mealTime,
      meal_type: newEntry.mealType,
      food: newEntry.food,
      quantity: newEntry.quantity,
      reaction: newEntry.reaction,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(FOOD_TABLE).insert(payload);

    if (error) {
      return { success: false, error: error.message, entry: newEntry };
    }

    return { success: true, entry: newEntry };
  } catch (error: any) {
    console.error("addFoodEntry error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function deleteFoodEntry(
  supabase: any,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    saveLocalFoodEntries(getLocalFoodEntries().filter((item) => item.id !== id));

    if (!supabase) return { success: true };

    const user = await getUserOrNull(supabase);
    if (!user) return { success: true };

    const { error } = await supabase
      .from(FOOD_TABLE)
      .delete()
      .eq("user_id", user.id)
      .eq("entry_id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error: any) {
    console.error("deleteFoodEntry error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function getCareEntries(supabase: any): Promise<CareEntry[]> {
  try {
    if (!supabase) return getLocalCareEntries();

    const user = await getUserOrNull(supabase);
    if (!user) return getLocalCareEntries();

    const { data, error } = await supabase
      .from(CARE_TABLE)
      .select("*")
      .eq("user_id", user.id)
      .order("entry_id", { ascending: false });

    if (error || !data) {
      return getLocalCareEntries();
    }

    const entries = data.map(normalizeCareEntry);
    saveLocalCareEntries(entries);
    return entries;
  } catch (error) {
    console.error("getCareEntries error:", error);
    return getLocalCareEntries();
  }
}

export async function addCareEntry(
  supabase: any,
  entry: Omit<CareEntry, "id">
): Promise<{ success: boolean; error?: string; entry?: CareEntry }> {
  try {
    const localEntries = getLocalCareEntries();
    const newEntry: CareEntry = {
      id: getNextId(localEntries),
      ...entry,
    };

    saveLocalCareEntries([newEntry, ...localEntries]);

    if (!supabase) {
      return { success: true, entry: newEntry };
    }

    const user = await getUserOrNull(supabase);
    if (!user) {
      return { success: true, entry: newEntry };
    }

    const payload = {
      user_id: user.id,
      entry_id: newEntry.id,
      time: newEntry.time,
      care_type: newEntry.careType,
      status: newEntry.status,
      note: newEntry.note,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(CARE_TABLE).insert(payload);

    if (error) {
      return { success: false, error: error.message, entry: newEntry };
    }

    return { success: true, entry: newEntry };
  } catch (error: any) {
    console.error("addCareEntry error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function deleteCareEntry(
  supabase: any,
  id: number
): Promise<{ success: boolean; error?: string }> {
  try {
    saveLocalCareEntries(getLocalCareEntries().filter((item) => item.id !== id));

    if (!supabase) return { success: true };

    const user = await getUserOrNull(supabase);
    if (!user) return { success: true };

    const { error } = await supabase
      .from(CARE_TABLE)
      .delete()
      .eq("user_id", user.id)
      .eq("entry_id", id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error: any) {
    console.error("deleteCareEntry error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function updatePlanTier(
  supabase: any,
  plan: PlanTier
): Promise<{ success: boolean; error?: string }> {
  try {
    saveLocalPlanTier(plan);

    if (!supabase) return { success: true };

    const user = await getUserOrNull(supabase);
    if (!user) return { success: true };

    const payload = {
      user_id: user.id,
      plan_tier: plan,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from(PLAN_TABLE).upsert(payload, {
      onConflict: "user_id",
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (error: any) {
    console.error("updatePlanTier error:", error);
    return { success: false, error: error?.message ?? "Unknown error" };
  }
}

export async function importLocalStorageToSupabase(supabase: any) {
  try {
    if (!supabase) return;

    const user = await getUserOrNull(supabase);
    if (!user) return;

    const localProfile = getLocalProfile();
    if (hasProfileData(localProfile)) {
      const { data: existingProfile } = await supabase
        .from(PROFILE_TABLE)
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingProfile) {
        await upsertProfile(supabase, localProfile);
      }
    }

    const localSleep = getLocalSleepEntries();
    if (hasSleepData(localSleep)) {
      const { data: existingSleep } = await supabase
        .from(SLEEP_TABLE)
        .select("entry_id")
        .eq("user_id", user.id)
        .limit(1);

      if (!existingSleep || existingSleep.length === 0) {
        await supabase.from(SLEEP_TABLE).insert(
          localSleep.map((entry) => ({
            user_id: user.id,
            entry_id: entry.id,
            last_nap_time: entry.lastNapTime,
            nap_duration: entry.napDuration,
            mood: entry.mood,
            created_at: new Date().toISOString(),
          }))
        );
      }
    }

    const localFood = getLocalFoodEntries();
    if (hasFoodData(localFood)) {
      const { data: existingFood } = await supabase
        .from(FOOD_TABLE)
        .select("entry_id")
        .eq("user_id", user.id)
        .limit(1);

      if (!existingFood || existingFood.length === 0) {
        await supabase.from(FOOD_TABLE).insert(
          localFood.map((entry) => ({
            user_id: user.id,
            entry_id: entry.id,
            meal_time: entry.mealTime,
            meal_type: entry.mealType,
            food: entry.food,
            quantity: entry.quantity,
            reaction: entry.reaction,
            created_at: new Date().toISOString(),
          }))
        );
      }
    }

    const localCare = getLocalCareEntries();
    if (hasCareData(localCare)) {
      const { data: existingCare } = await supabase
        .from(CARE_TABLE)
        .select("entry_id")
        .eq("user_id", user.id)
        .limit(1);

      if (!existingCare || existingCare.length === 0) {
        await supabase.from(CARE_TABLE).insert(
          localCare.map((entry) => ({
            user_id: user.id,
            entry_id: entry.id,
            time: entry.time,
            care_type: entry.careType,
            status: entry.status,
            note: entry.note,
            created_at: new Date().toISOString(),
          }))
        );
      }
    }

    const localPlan = getLocalPlanTier();
    const { data: existingPlan } = await supabase
      .from(PLAN_TABLE)
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!existingPlan) {
      await updatePlanTier(supabase, localPlan);
    }
  } catch (error) {
    console.error("importLocalStorageToSupabase error:", error);
  }
}