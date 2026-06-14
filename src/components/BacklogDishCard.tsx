import { Pencil, Trash2 } from "lucide-react";
import type { Dish } from "../types";
import { MEAL_LABELS } from "../types";
import { usePlanner } from "../store";
import { TagChip } from "./TagChip";

export function BacklogDishCard({
  dish,
  onEdit,
}: {
  dish: Dish;
  onEdit: () => void;
}) {
  const assignments = usePlanner((s) => s.assignments);
  const deleteDish = usePlanner((s) => s.deleteDish);

  const handleDelete = () => {
    const inUse = assignments.filter((a) => a.dishId === dish.id).length;
    const msg =
      inUse > 0
        ? `«${dish.name}» використовується ${inUse} раз(ів) у плані. Видалити страву та всі її розміщення?`
        : `Видалити «${dish.name}»?`;
    if (confirm(msg)) deleteDish(dish.id);
  };

  return (
    <div className="group rounded-md border border-slate-200 bg-white p-2 text-xs shadow-sm">
      <div className="flex items-start gap-1">
        <span className="flex-1 leading-snug text-slate-700">{dish.name}</span>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 sm:text-slate-300 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Редагувати"
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 sm:text-slate-300 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Видалити"
        >
          <Trash2 size={12} />
        </button>
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-1">
        <span className="text-[10px] text-slate-400">
          {dish.mealTypes.map((m) => MEAL_LABELS[m]).join(" · ")}
        </span>
        {dish.tags.map((t) => (
          <TagChip key={t} tag={t} />
        ))}
      </div>
    </div>
  );
}
