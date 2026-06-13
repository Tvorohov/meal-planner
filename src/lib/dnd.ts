import type { Assignment, MealType } from "../types";

// ---- Draggable id encoding ----------------------------------------------

export type DragSource =
  | { kind: "dish"; dishId: string }
  | { kind: "assignment"; assignmentId: string };

export function dishDragId(dishId: string): string {
  return `dish:${dishId}`;
}

export function assignmentDragId(assignmentId: string): string {
  return `assignment:${assignmentId}`;
}

export function decodeDrag(id: string): DragSource | null {
  if (id.startsWith("dish:")) return { kind: "dish", dishId: id.slice(5) };
  if (id.startsWith("assignment:")) {
    return { kind: "assignment", assignmentId: id.slice("assignment:".length) };
  }
  return null;
}

// ---- Droppable id encoding ----------------------------------------------

export const BACKLOG_DROP_ID = "backlog";
export const TRASH_DROP_ID = "trash";

export function slotDropId(
  weekIndex: number,
  dayIndex: number,
  mealType: MealType,
): string {
  return `slot:${weekIndex}:${dayIndex}:${mealType}`;
}

export interface SlotTarget {
  kind: "slot";
  weekIndex: number;
  dayIndex: number;
  mealType: MealType;
  /** When dropped onto an existing assignment card, the id to insert before. */
  overAssignmentId?: string;
}

export type DropTarget = SlotTarget | { kind: "backlog" } | { kind: "trash" };

/**
 * Resolve the raw `over.id` from dnd-kit into a normalized drop target.
 * Sortable assignment cards report their own id when hovered, so we look the
 * assignment up to find which slot it lives in.
 */
export function resolveDropTarget(
  overId: string,
  assignments: Assignment[],
): DropTarget | null {
  if (overId === BACKLOG_DROP_ID) return { kind: "backlog" };
  if (overId === TRASH_DROP_ID) return { kind: "trash" };

  if (overId.startsWith("slot:")) {
    const [, w, d, m] = overId.split(":");
    return {
      kind: "slot",
      weekIndex: Number(w),
      dayIndex: Number(d),
      mealType: m as MealType,
    };
  }

  if (overId.startsWith("assignment:")) {
    const assignmentId = overId.slice("assignment:".length);
    const a = assignments.find((x) => x.id === assignmentId);
    if (!a) return null;
    return {
      kind: "slot",
      weekIndex: a.weekIndex,
      dayIndex: a.dayIndex,
      mealType: a.mealType,
      overAssignmentId: assignmentId,
    };
  }

  return null;
}
