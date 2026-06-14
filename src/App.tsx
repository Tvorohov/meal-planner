import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { usePlanner } from "./store";
import { runValidation } from "./validation";
import { WarningContext } from "./context";
import { Toolbar } from "./components/Toolbar";
import { WeekGrid } from "./components/WeekGrid";
import { Backlog } from "./components/Backlog";

export default function App() {
  const assignments = usePlanner((s) => s.assignments);
  const dishes = usePlanner((s) => s.dishes);

  const [showBacklog, setShowBacklog] = useState(false);

  const warnings = useMemo(
    () => runValidation(assignments, dishes),
    [assignments, dishes],
  );

  const sheetBase =
    "lg:static lg:z-auto lg:block lg:h-auto lg:w-[280px] lg:shrink-0 lg:rounded-none lg:border-0 lg:border-r lg:border-slate-200 lg:bg-slate-50 lg:shadow-none";
  const sheetOpen =
    "fixed inset-x-0 bottom-0 top-14 z-40 rounded-t-2xl border-t border-slate-200 bg-white shadow-2xl";

  return (
    <WarningContext.Provider value={warnings}>
      <div className="flex min-h-screen flex-col">
        <Toolbar onOpenBacklog={() => setShowBacklog(true)} />

        <div className="flex flex-1">
          {/* Catalog: sidebar on desktop, bottom sheet on mobile. */}
          {showBacklog && (
            <div
              className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
              onClick={() => setShowBacklog(false)}
            />
          )}
          <aside className={`${showBacklog ? sheetOpen : "hidden"} ${sheetBase} p-3`}>
            <div className="mb-2 flex items-center justify-between lg:hidden">
              <span className="text-sm font-semibold text-slate-600">Страви</span>
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
    </WarningContext.Provider>
  );
}
