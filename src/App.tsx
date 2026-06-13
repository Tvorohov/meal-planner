import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { X } from "lucide-react";
import type { DishTag, MealType } from "./types";
import { usePlanner } from "./store";
import { runValidation } from "./validation";
import { DragContext, WarningContext } from "./context";
import { decodeDrag, resolveDropTarget } from "./lib/dnd";
import { Toolbar } from "./components/Toolbar";
import { WeekGrid } from "./components/WeekGrid";
import { Backlog } from "./components/Backlog";
import { TrashZone } from "./components/TrashZone";
import { TagChip } from "./components/TagChip";

interface ActiveDrag {
  kind: "dish" | "assignment";
  name: string;
  tags: DishTag[];
  mealTypes: MealType[];
}

export default function App() {
  const assignments = usePlanner((s) => s.assignments);
  const dishes = usePlanner((s) => s.dishes);
  const createAssignment = usePlanner((s) => s.createAssignment);
  const moveAssignment = usePlanner((s) => s.moveAssignment);
  const removeAssignment = usePlanner((s) => s.removeAssignment);

  const [active, setActive] = useState<ActiveDrag | null>(null);
  const [showBacklog, setShowBacklog] = useState(false);

  const warnings = useMemo(
    () => runValidation(assignments, dishes),
    [assignments, dishes],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 6 },
    }),
  );

  const handleDragStart = (e: DragStartEvent) => {
    const src = decodeDrag(String(e.active.id));
    if (!src) return;
    const dish =
      src.kind === "dish"
        ? dishes[src.dishId]
        : dishes[assignments.find((a) => a.id === src.assignmentId)?.dishId ?? ""];
    if (!dish) return;
    setActive({
      kind: src.kind,
      name: dish.name,
      tags: dish.tags,
      mealTypes: dish.mealTypes,
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActive(null);
    const { active: a, over } = e;
    if (!over) return;

    const src = decodeDrag(String(a.id));
    const target = resolveDropTarget(
      String(over.id),
      usePlanner.getState().assignments,
    );
    if (!src || !target) return;

    // Drop an assignment onto backlog/trash -> remove it.
    if (target.kind === "backlog" || target.kind === "trash") {
      if (src.kind === "assignment") removeAssignment(src.assignmentId);
      return;
    }

    // From here target is a slot.
    if (src.kind === "dish") {
      const dish = dishes[src.dishId];
      if (!dish || !dish.mealTypes.includes(target.mealType)) return; // incompatible
      createAssignment(src.dishId, {
        weekIndex: target.weekIndex,
        dayIndex: target.dayIndex,
        mealType: target.mealType,
      });
    } else {
      const moved = assignments.find((x) => x.id === src.assignmentId);
      const dish = moved && dishes[moved.dishId];
      if (!dish || !dish.mealTypes.includes(target.mealType)) return; // incompatible
      moveAssignment(
        src.assignmentId,
        {
          weekIndex: target.weekIndex,
          dayIndex: target.dayIndex,
          mealType: target.mealType,
        },
        target.overAssignmentId,
      );
    }
  };

  const sheetBase =
    "lg:static lg:z-auto lg:block lg:h-auto lg:w-[280px] lg:shrink-0 lg:rounded-none lg:border-0 lg:border-r lg:border-slate-200 lg:bg-slate-50 lg:shadow-none";
  const sheetOpen =
    "fixed inset-x-0 bottom-0 top-14 z-40 rounded-t-2xl border-t border-slate-200 bg-white shadow-2xl";

  return (
    <DragContext.Provider
      value={{ activeMealTypes: active ? active.mealTypes : null }}
    >
      <WarningContext.Provider value={warnings}>
        <DndContext
          sensors={sensors}
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={() => setActive(null)}
        >
          <div className="flex min-h-screen flex-col">
            <Toolbar onOpenBacklog={() => setShowBacklog(true)} />

            <div className="flex flex-1">
              {/* Backlog: sidebar on desktop, bottom sheet on mobile. */}
              {showBacklog && (
                <div
                  className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
                  onClick={() => setShowBacklog(false)}
                />
              )}
              <aside
                className={`${showBacklog ? sheetOpen : "hidden"} ${sheetBase} p-3`}
              >
                <div className="mb-2 flex items-center justify-between lg:hidden">
                  <span className="text-sm font-semibold text-slate-600">
                    Блюда
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowBacklog(false)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="h-[calc(100%-2rem)] lg:h-auto">
                  <Backlog />
                </div>
              </aside>

              <main className="flex-1 overflow-x-auto p-3 sm:p-4">
                <WeekGrid />
              </main>
            </div>
          </div>

          <TrashZone visible={active?.kind === "assignment"} />

          <DragOverlay>
            {active ? (
              <div className="max-w-[220px] rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs shadow-lg">
                <div className="leading-snug text-slate-700">{active.name}</div>
                {active.tags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {active.tags.map((t) => (
                      <TagChip key={t} tag={t} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </WarningContext.Provider>
    </DragContext.Provider>
  );
}
