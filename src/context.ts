import { createContext, useContext } from "react";
import type { Warning } from "./validation";

/** assignmentId -> warnings, recomputed whenever the plan changes. */
export const WarningContext = createContext<Map<string, Warning[]>>(new Map());
export const useWarnings = () => useContext(WarningContext);
