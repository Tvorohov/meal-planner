import type { Assignment, Dish } from "../types";
import { DAY_LABELS } from "../types";
import { MealSlot } from "./MealSlot";

export function DayColumn({
  weekIndex,
  dayIndex,
  assignments,
  dishes,
}: {
  weekIndex: number;
  dayIndex: number;
  assignments: Assignment[];
  dishes: Record<string, Dish>;
}) {
  const forDay = assignments.filter(
    (a) => a.weekIndex === weekIndex && a.dayIndex === dayIndex,
  );
  const breakfast = forDay.filter((a) => a.mealType === "breakfast");
  const dinner = forDay.filter((a) => a.mealType === "dinner");

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white p-2">
      <div className="text-center text-sm font-semibold text-slate-600">
        {DAY_LABELS[dayIndex]}
      </div>
      <MealSlot
        weekIndex={weekIndex}
        dayIndex={dayIndex}
        mealType="breakfast"
        assignments={breakfast}
        dishes={dishes}
      />
      <MealSlot
        weekIndex={weekIndex}
        dayIndex={dayIndex}
        mealType="dinner"
        assignments={dinner}
        dishes={dishes}
      />
    </div>
  );
}
