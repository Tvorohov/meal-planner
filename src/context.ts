import { createContext, useContext } from "react";
import type { MealType } from "./types";
import type { Warning } from "./validation";

/** Meal types supported by the dish currently being dragged (null = idle). */
export const DragContext = createContext<{ activeMealTypes: MealType[] | null }>({
  activeMealTypes: null,
});
export const useDrag = () => useContext(DragContext);

/** assignmentId -> warnings, recomputed whenever the plan changes. */
export const WarningContext = createContext<Map<string, Warning[]>>(new Map());
export const useWarnings = () => useContext(WarningContext);
