import type { PlannerState } from "../types";
import { usePlanner } from "../store";
import { supabase } from "./supabase";

const ROW_ID = 1;
const PUSH_DEBOUNCE_MS = 800;

type PlannerSlice = Pick<
  PlannerState,
  "dishes" | "assignments" | "weeks" | "startDate"
>;

// Guard so applying a remote update doesn't echo back as a push.
let applyingRemote = false;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

function extract(s: PlannerState): PlannerSlice {
  return {
    dishes: s.dishes,
    assignments: s.assignments,
    weeks: s.weeks,
    startDate: s.startDate,
  };
}

function isEmpty(data: unknown): boolean {
  const d = data as Partial<PlannerSlice> | null | undefined;
  return !d || !d.dishes || Object.keys(d.dishes).length === 0;
}

function applyRemote(data: PlannerSlice) {
  applyingRemote = true;
  usePlanner.setState(data);
  applyingRemote = false;
}

async function push(slice: PlannerSlice) {
  if (!supabase) return;
  await supabase
    .from("planner_state")
    .upsert({ id: ROW_ID, data: slice, updated_at: new Date().toISOString() });
}

/**
 * Wire local store <-> Supabase (single shared row, no auth):
 * pull on start, push local changes (debounced), and apply realtime updates
 * from other devices. Last write wins. No-op when Supabase isn't configured.
 */
export async function initSync() {
  if (!supabase) return;

  // 1. Pull existing state, or seed the DB with the local state if empty.
  const { data: row, error } = await supabase
    .from("planner_state")
    .select("data")
    .eq("id", ROW_ID)
    .maybeSingle();

  if (!error && row && !isEmpty(row.data)) {
    applyRemote(row.data as PlannerSlice);
  } else {
    await push(extract(usePlanner.getState()));
  }

  // 2. Push local changes (debounced), unless they came from a remote apply.
  usePlanner.subscribe((state) => {
    if (applyingRemote) return;
    if (pushTimer) clearTimeout(pushTimer);
    const slice = extract(state);
    pushTimer = setTimeout(() => push(slice), PUSH_DEBOUNCE_MS);
  });

  // 3. Apply realtime updates from other devices.
  supabase
    .channel("planner_state")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "planner_state" },
      (payload) => {
        const data = (payload.new as { data?: unknown })?.data;
        if (!isEmpty(data)) applyRemote(data as PlannerSlice);
      },
    )
    .subscribe();
}
