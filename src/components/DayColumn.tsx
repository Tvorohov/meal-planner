import type { Assignment, Dish } from "../types";
import { DAY_LABELS, mealsForDay } from "../types";
import { dateOf, formatShort, isSameDay } from "../lib/dates";
import { MealSlot } from "./MealSlot";

export function DayColumn({
  weekIndex,
  dayIndex,
  assignments,
  dishes,
  startDate,
}: {
  weekIndex: number;
  dayIndex: number;
  assignments: Assignment[];
  dishes: Record<string, Dish>;
  startDate: string;
}) {
  const forDay = assignments.filter(
    (a) => a.weekIndex === weekIndex && a.dayIndex === dayIndex,
  );
  const date = dateOf(startDate, weekIndex, dayIndex);
  const today = isSameDay(date, new Date());
  const meals = mealsForDay(dayIndex);

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border bg-white p-2 ${
        today ? "border-emerald-400 ring-1 ring-emerald-200" : "border-slate-200"
      }`}
    >
      <div className="text-center">
        <div
          className={`text-sm font-semibold ${
            today ? "text-emerald-600" : "text-slate-600"
          }`}
        >
          {DAY_LABELS[dayIndex]}
        </div>
        <div className={`text-[10px] ${today ? "text-emerald-500" : "text-slate-400"}`}>
          {formatShort(date)}
          {today && " · сьогодні"}
        </div>
      </div>
      {meals.map((meal) => (
        <MealSlot
          key={meal}
          weekIndex={weekIndex}
          dayIndex={dayIndex}
          mealType={meal}
          assignments={forDay.filter((a) => a.mealType === meal)}
          dishes={dishes}
        />
      ))}
    </div>
  );
}
