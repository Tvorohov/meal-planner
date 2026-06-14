import { useDroppable } from "@dnd-kit/core";
import { Trash2 } from "lucide-react";
import { TRASH_DROP_ID } from "../lib/dnd";

/** Floating delete target, visible only while dragging an assignment. */
export function TrashZone({ visible }: { visible: boolean }) {
  const { setNodeRef, isOver } = useDroppable({ id: TRASH_DROP_ID });

  if (!visible) return null;

  return (
    <div
      ref={setNodeRef}
      className={`fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium shadow-lg transition ${
        isOver
          ? "border-rose-400 bg-rose-500 text-white"
          : "border-slate-200 bg-white text-slate-500"
      }`}
    >
      <Trash2 size={16} />
      Прибрати з плану
    </div>
  );
}
