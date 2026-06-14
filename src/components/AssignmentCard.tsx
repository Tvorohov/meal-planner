import { AlertTriangle, X } from "lucide-react";
import type { Assignment, Dish } from "../types";
import { usePlanner } from "../store";
import { useWarnings } from "../context";
import { TagChip } from "./TagChip";

export function AssignmentCard({
  assignment,
  dish,
}: {
  assignment: Assignment;
  dish: Dish | undefined;
}) {
  const removeAssignment = usePlanner((s) => s.removeAssignment);
  const warnings = useWarnings().get(assignment.id) ?? [];

  if (!dish) return null;

  return (
    <div className="group relative rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs shadow-sm">
      <div className="flex items-start gap-1">
        {warnings.length > 0 && (
          <span
            title={warnings.map((w) => w.message).join("\n")}
            className="mt-0.5 shrink-0 text-amber-500"
          >
            <AlertTriangle size={12} />
          </span>
        )}
        <span className="flex-1 leading-snug text-slate-700">{dish.name}</span>
        <button
          type="button"
          onClick={() => removeAssignment(assignment.id)}
          className="shrink-0 rounded p-0.5 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 sm:text-slate-300 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Прибрати страву"
        >
          <X size={13} />
        </button>
      </div>

      {dish.tags.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {dish.tags.map((t) => (
            <TagChip key={t} tag={t} />
          ))}
        </div>
      )}
    </div>
  );
}
