import { useDraggable } from "@dnd-kit/core";
import { Pencil, Trash2 } from "lucide-react";
import type { Dish } from "../types";
import { MEAL_LABELS } from "../types";
import { dishDragId } from "../lib/dnd";
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

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: dishDragId(dish.id),
  });

  const handleDelete = () => {
    const inUse = assignments.filter((a) => a.dishId === dish.id).length;
    const msg =
      inUse > 0
        ? `«${dish.name}» используется ${inUse} раз(а) в плане. Удалить блюдо и все его размещения?`
        : `Удалить «${dish.name}»?`;
    if (confirm(msg)) deleteDish(dish.id);
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`group cursor-grab touch-none rounded-md border border-slate-200 bg-white p-2 text-xs shadow-sm transition hover:border-slate-300 active:cursor-grabbing ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      <div className="flex items-start gap-1">
        <span className="flex-1 leading-snug text-slate-700">{dish.name}</span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={onEdit}
          className="shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
          aria-label="Редактировать"
        >
          <Pencil size={12} />
        </button>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={handleDelete}
          className="shrink-0 rounded p-0.5 text-slate-300 opacity-0 transition hover:bg-slate-100 hover:text-rose-500 group-hover:opacity-100"
          aria-label="Удалить"
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
