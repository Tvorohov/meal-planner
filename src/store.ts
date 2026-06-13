import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Assignment, Dish, DishTag, MealType, PlannerState } from "./types";
import { newId } from "./lib/ids";
import { buildInitialState } from "./seed";

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
  createAssignment: (dishId: string, slot: SlotRef) => void;
  moveAssignment: (
    assignmentId: string,
    slot: SlotRef,
    overAssignmentId?: string,
  ) => void;
  removeAssignment: (assignmentId: string) => void;
  importState: (state: PlannerState) => void;
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

      moveAssignment: (assignmentId, slot, overAssignmentId) =>
        set((s) => {
          const assignments = s.assignments.map((a) => ({ ...a }));
          const moved = assignments.find((a) => a.id === assignmentId);
          if (!moved) return {};

          moved.weekIndex = slot.weekIndex;
          moved.dayIndex = slot.dayIndex;
          moved.mealType = slot.mealType;

          const items = assignments
            .filter((a) => sameSlot(a, slot) && a.id !== assignmentId)
            .sort((a, b) => a.order - b.order);

          let at = items.length;
          if (overAssignmentId) {
            const i = items.findIndex((a) => a.id === overAssignmentId);
            if (i >= 0) at = i;
          }
          items.splice(at, 0, moved);
          items.forEach((a, i) => {
            a.order = i;
          });

          return { assignments };
        }),

      removeAssignment: (assignmentId) =>
        set((s) => ({
          assignments: s.assignments.filter((a) => a.id !== assignmentId),
        })),

      importState: (state) =>
        set(() => ({
          dishes: state.dishes,
          assignments: state.assignments,
          weeks: state.weeks,
        })),

      resetAll: () => set(() => buildInitialState()),
    }),
    { name: "meal-planner-v1", version: 1 },
  ),
);
