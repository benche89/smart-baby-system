import type { SupabaseClient } from "@supabase/supabase-js";

export type PlanTier = "basic" | "premium" | "elite";

export type BabyProfile = {
  babyName: string;
  ageMonths: string;
  bedtime: string;
  mainConcern: string;
  notes: string;
  planTier: PlanTier;
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

const PROFILE_STORAGE_KEY = "sb_profile";
const SLEEP_STORAGE_KEY = "sb_sleep_entries";
const FOOD_STORAGE_KEY = "sb_food_entries";
const CARE_STORAGE_KEY = "sb_care_entries";
const PLAN_STORAGE_KEY = "smartBabyPlanTier";

async function getUserId(supabase: SupabaseClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("User not authenticated.");
  }

  return user.id;
}

function mapProfileRow(row: any): BabyProfile {
  return {
    babyName: row?.baby_name ?? "",
    ageMonths: row?.age_months ?? "",
    bedtime: row?.bedtime ?? "",
    mainConcern: row?.main_concern ?? "",
    notes: row?.notes ?? "",
    planTier: (row?.plan_tier ?? "basic") as PlanTier,
  };
}

function mapSleepRow(row: any): SleepEntry {
  return {
    id: Number(row.id),
    start: row.start_time ?? "",
    end: row.end_time ?? "",
    duration: row.duration ?? "",
    quality: row.quality ?? "",
    note: row.note ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function mapFoodRow(row: any): FoodEntry {
  return {
    id: Number(row.id),
    time: row.meal_time ?? "",
    type: row.meal_type ?? "",
    amount: row.amount ?? "",
    note: row.note ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

function mapCareRow(row: any): CareEntry {
  return {
    id: Number(row.id),
    time: row.care_time ?? "",
    careType: row.care_type ?? "",
    status: row.status ?? "",
    note: row.note ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export async function getProfile(supabase: SupabaseClient): Promise<BabyProfile | null> {
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("baby_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data ? mapProfileRow(data) : null;
}

export async function upsertProfile(
  supabase: SupabaseClient,
  profile: BabyProfile
): Promise<BabyProfile> {
  const userId = await getUserId(supabase);

  const payload = {
    user_id: userId,
    baby_name: profile.babyName,
    age_months: profile.ageMonths,
    bedtime: profile.bedtime,
    main_concern: profile.mainConcern,
    notes: profile.notes,
    plan_tier: profile.planTier,
  };

  const { data, error } = await supabase
    .from("baby_profiles")
    .upsert(payload, { onConflict: "user_id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapProfileRow(data);
}

export async function updatePlanTier(
  supabase: SupabaseClient,
  planTier: PlanTier
): Promise<PlanTier> {
  const existing = await getProfile(supabase);

  const profile: BabyProfile = {
    babyName: existing?.babyName ?? "",
    ageMonths: existing?.ageMonths ?? "",
    bedtime: existing?.bedtime ?? "",
    mainConcern: existing?.mainConcern ?? "",
    notes: existing?.notes ?? "",
    planTier,
  };

  const saved = await upsertProfile(supabase, profile);
  return saved.planTier;
}

export async function getSleepEntries(supabase: SupabaseClient): Promise<SleepEntry[]> {
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("sleep_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapSleepRow);
}

export async function addSleepEntry(
  supabase: SupabaseClient,
  entry: Omit<SleepEntry, "id">
): Promise<SleepEntry> {
  const userId = await getUserId(supabase);

  const payload = {
    user_id: userId,
    start_time: entry.start,
    end_time: entry.end,
    duration: entry.duration,
    quality: entry.quality,
    note: entry.note,
    created_at: entry.createdAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("sleep_entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapSleepRow(data);
}

export async function deleteSleepEntry(
  supabase: SupabaseClient,
  id: number
): Promise<void> {
  const { error } = await supabase.from("sleep_entries").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getFoodEntries(supabase: SupabaseClient): Promise<FoodEntry[]> {
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("food_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapFoodRow);
}

export async function addFoodEntry(
  supabase: SupabaseClient,
  entry: Omit<FoodEntry, "id">
): Promise<FoodEntry> {
  const userId = await getUserId(supabase);

  const payload = {
    user_id: userId,
    meal_time: entry.time,
    meal_type: entry.type,
    amount: entry.amount,
    note: entry.note,
    created_at: entry.createdAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("food_entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapFoodRow(data);
}

export async function deleteFoodEntry(
  supabase: SupabaseClient,
  id: number
): Promise<void> {
  const { error } = await supabase.from("food_entries").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCareEntries(supabase: SupabaseClient): Promise<CareEntry[]> {
  const userId = await getUserId(supabase);

  const { data, error } = await supabase
    .from("care_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapCareRow);
}

export async function addCareEntry(
  supabase: SupabaseClient,
  entry: Omit<CareEntry, "id">
): Promise<CareEntry> {
  const userId = await getUserId(supabase);

  const payload = {
    user_id: userId,
    care_time: entry.time,
    care_type: entry.careType,
    status: entry.status,
    note: entry.note,
    created_at: entry.createdAt || new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("care_entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapCareRow(data);
}

export async function deleteCareEntry(
  supabase: SupabaseClient,
  id: number
): Promise<void> {
  const { error } = await supabase.from("care_entries").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function importLocalStorageToSupabase(
  supabase: SupabaseClient
): Promise<void> {
  if (typeof window === "undefined") return;

  const [existingProfile, existingSleep, existingFood, existingCare] =
    await Promise.all([
      getProfile(supabase),
      getSleepEntries(supabase),
      getFoodEntries(supabase),
      getCareEntries(supabase),
    ]);

  if (!existingProfile) {
    try {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      const savedPlan = localStorage.getItem(PLAN_STORAGE_KEY);

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        await upsertProfile(supabase, {
          babyName: parsed?.babyName ?? "",
          ageMonths: parsed?.ageMonths ?? "",
          bedtime: parsed?.bedtime ?? "",
          mainConcern: parsed?.mainConcern ?? "",
          notes: parsed?.notes ?? "",
          planTier:
            savedPlan === "premium" || savedPlan === "elite" || savedPlan === "basic"
              ? savedPlan
              : "basic",
        });
      }
    } catch {}
  }

  if (existingSleep.length === 0) {
    try {
      const saved = localStorage.getItem(SLEEP_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<any>;
        for (const entry of parsed) {
          await addSleepEntry(supabase, {
            start: entry?.start ?? "",
            end: entry?.end ?? "",
            duration: entry?.duration ?? "",
            quality: entry?.quality ?? "",
            note: entry?.note ?? "",
            createdAt: entry?.createdAt ?? new Date().toISOString(),
          });
        }
      }
    } catch {}
  }

  if (existingFood.length === 0) {
    try {
      const saved = localStorage.getItem(FOOD_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<any>;
        for (const entry of parsed) {
          await addFoodEntry(supabase, {
            time: entry?.time ?? "",
            type: entry?.type ?? "",
            amount: entry?.amount ?? "",
            note: entry?.note ?? "",
            createdAt: entry?.createdAt ?? new Date().toISOString(),
          });
        }
      }
    } catch {}
  }

  if (existingCare.length === 0) {
    try {
      const saved = localStorage.getItem(CARE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Array<any>;
        for (const entry of parsed) {
          await addCareEntry(supabase, {
            time: entry?.time ?? "",
            careType: entry?.careType ?? "",
            status: entry?.status ?? "",
            note: entry?.note ?? "",
            createdAt: entry?.createdAt ?? new Date().toISOString(),
          });
        }
      }
    } catch {}
  }
}