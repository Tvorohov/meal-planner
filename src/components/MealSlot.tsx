import { useMemo } from "react";
import type { Assignment, Dish, MealType } from "../types";
import { MEAL_LABELS } from "../types";
import { usePlanner } from "../store";
import { AssignmentCard } from "./AssignmentCard";

export function MealSlot({
  weekIndex,
  dayIndex,
  mealType,
  assignments,
  dishes,
}: {
  weekIndex: number;
  dayIndex: number;
  mealType: MealType;
  assignments: Assignment[];
  dishes: Record<string, Dish>;
}) {
  const createAssignment = usePlanner((s) => s.createAssignment);

  const items = assignments.slice().sort((a, b) => a.order - b.order);

  // Dishes that can go into this meal slot, sorted by name.
  const options = useMemo(
    () =>
      Object.values(dishes)
        .filter((d) => d.mealTypes.includes(mealType))
        .sort((a, b) => a.name.localeCompare(b.name, "uk")),
    [dishes, mealType],
  );

  return (
    <div className="space-y-1">
      <div className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {MEAL_LABELS[mealType]}
      </div>
      <div className="space-y-1 rounded-md border border-slate-100 bg-slate-50/60 p-1">
        {items.map((a) => (
          <AssignmentCard key={a.id} assignment={a} dish={dishes[a.dishId]} />
        ))}

        <select
          value=""
          onChange={(e) => {
            const dishId = e.target.value;
            if (dishId) {
              createAssignment(dishId, { weekIndex, dayIndex, mealType });
            }
          }}
          className="w-full cursor-pointer rounded-md border border-dashed border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-500 outline-none focus:border-slate-400"
          aria-label={`Додати страву: ${MEAL_LABELS[mealType]}`}
        >
          <option value="" disabled>
            + Додати…
          </option>
          {options.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
