import { Trash2 } from "lucide-react";
import type { Assignment, Dish } from "../types";
import { formatWeekRange } from "../lib/dates";
import { DayColumn } from "./DayColumn";

export function WeekBlock({
  weekIndex,
  isLast,
  assignments,
  dishes,
  startDate,
  onRemove,
}: {
  weekIndex: number;
  isLast: boolean;
  assignments: Assignment[];
  dishes: Record<string, Dish>;
  startDate: string;
  onRemove: () => void;
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-500">
          Неделя {weekIndex + 1}
          <span className="ml-2 font-normal text-slate-400">
            {formatWeekRange(startDate, weekIndex)}
          </span>
        </h2>
        {isLast && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 size={13} /> Убрать неделю
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, day) => (
          <DayColumn
            key={day}
            weekIndex={weekIndex}
            dayIndex={day}
            assignments={assignments}
            dishes={dishes}
            startDate={startDate}
          />
        ))}
      </div>
    </section>
  );
}
