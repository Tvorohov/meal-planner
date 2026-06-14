import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assignment, Dish, DishTag, MealType, PlannerState } from "./types";
import { newId } from "./lib/ids";
import { buildInitialState } from "./seed";
import { mondayOf, parseISODate, toISODate } from "./lib/dates";

export interface SlotRef {
  weekIndex: number;
  dayIndex: number;
  mealType: MealType;
}

export interface DishInput {
  name: string;
  mealTypes: MealType[];
  tags: DishTag[];
  notes?: string;
}

interface PlannerActions {
  addDish: (input: DishInput) => void;
  updateDish: (id: string, input: DishInput) => void;
  deleteDish: (id: string) => void;
  addWeek: () => void;
  removeLastWeek: () => void;
  setStartDate: (iso: string) => void;
  createAssignment: (dishId: string, slot: SlotRef) => void;
  removeAssignment: (assignmentId: string) => void;
  resetAll: () => void;
}

const sameSlot = (a: Assignment, s: SlotRef): boolean =>
  a.weekIndex === s.weekIndex &&
  a.dayIndex === s.dayIndex &&
  a.mealType === s.mealType;

export const usePlanner = create<PlannerState & PlannerActions>()(
  persist(
    (set) => ({
      ...buildInitialState(),

      addDish: (input) =>
        set((s) => {
          const id = newId();
          const dish: Dish = { id, ...input };
          return { dishes: { ...s.dishes, [id]: dish } };
        }),

      updateDish: (id, input) =>
        set((s) => {
          const existing = s.dishes[id];
          if (!existing) return {};
          return { dishes: { ...s.dishes, [id]: { ...existing, ...input } } };
        }),

      deleteDish: (id) =>
        set((s) => {
          const dishes = { ...s.dishes };
          delete dishes[id];
          return {
            dishes,
            assignments: s.assignments.filter((a) => a.dishId !== id),
          };
        }),

      addWeek: () => set((s) => ({ weeks: s.weeks + 1 })),

      // Always snap to the Monday of the chosen week.
      setStartDate: (iso) =>
        set(() => ({ startDate: toISODate(mondayOf(parseISODate(iso))) })),

      removeLastWeek: () =>
        set((s) => {
          if (s.weeks <= 1) return {};
          const last = s.weeks - 1;
          return {
            weeks: last,
            assignments: s.assignments.filter((a) => a.weekIndex !== last),
          };
        }),

      createAssignment: (dishId, slot) =>
        set((s) => {
          const order = s.assignments.filter((a) => sameSlot(a, slot)).length;
          const a: Assignment = { id: newId(), dishId, ...slot, order };
          return { assignments: [...s.assignments, a] };
        }),

      removeAssignment: (assignmentId) =>
        set((s) => ({
          assignments: s.assignments.filter((a) => a.id !== assignmentId),
        })),

      resetAll: () => set(() => buildInitialState()),
    }),
    // New storage key for the Ukrainian catalog; any older (Russian) saved
    // state under the previous key is intentionally not migrated.
    { name: "meal-planner-uk", version: 1 },
  ),
);
