import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Assignment, Dish, MealType } from "../types";
import { MEAL_LABELS } from "../types";
import { assignmentDragId, slotDropId } from "../lib/dnd";
import { useDrag } from "../context";
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
  const id = slotDropId(weekIndex, dayIndex, mealType);
  const { setNodeRef, isOver } = useDroppable({ id });
  const { activeMealTypes } = useDrag();

  const dragging = activeMealTypes !== null;
  const compatible = !dragging || activeMealTypes!.includes(mealType);
  const items = assignments
    .slice()
    .sort((a, b) => a.order - b.order);

  // Visual state during drag.
  let ring = "border-slate-200";
  if (dragging && !compatible) ring = "border-slate-200 opacity-40";
  else if (isOver && compatible) ring = "border-emerald-400 bg-emerald-50";
  else if (isOver && !compatible) ring = "border-rose-300 bg-rose-50";

  return (
    <div className="space-y-1">
      <div className="px-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
        {MEAL_LABELS[mealType]}
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-[3.25rem] space-y-1 rounded-md border border-dashed p-1 transition ${ring}`}
      >
        <SortableContext
          items={items.map((a) => assignmentDragId(a.id))}
          strategy={verticalListSortingStrategy}
        >
          {items.map((a) => (
            <AssignmentCard key={a.id} assignment={a} dish={dishes[a.dishId]} />
          ))}
        </SortableContext>

        {items.length === 0 && (
          <div className="flex h-9 items-center justify-center text-[10px] text-slate-300">
            перетягніть сюди
          </div>
        )}
      </div>
    </div>
  );
}
