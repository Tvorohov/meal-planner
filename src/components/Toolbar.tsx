import { useRef } from "react";
import {
  CalendarDays,
  CalendarPlus,
  Download,
  Menu as MenuIcon,
  RotateCcw,
  Upload,
  UtensilsCrossed,
} from "lucide-react";
import type { PlannerState } from "../types";
import { usePlanner } from "../store";

function ToolbarButton({
  onClick,
  icon,
  label,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export function Toolbar({ onOpenBacklog }: { onOpenBacklog: () => void }) {
  const addWeek = usePlanner((s) => s.addWeek);
  const resetAll = usePlanner((s) => s.resetAll);
  const importState = usePlanner((s) => s.importState);
  const startDate = usePlanner((s) => s.startDate);
  const setStartDate = usePlanner((s) => s.setStartDate);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const { dishes, assignments, weeks, startDate } = usePlanner.getState();
    const data: PlannerState = { dishes, assignments, weeks, startDate };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as PlannerState;
      if (
        !parsed ||
        typeof parsed !== "object" ||
        typeof parsed.dishes !== "object" ||
        !Array.isArray(parsed.assignments) ||
        typeof parsed.weeks !== "number"
      ) {
        throw new Error("Неверный формат файла");
      }
      importState(parsed);
    } catch (err) {
      alert(`Не удалось импортировать: ${(err as Error).message}`);
    }
  };

  const handleReset = () => {
    if (confirm("Сбросить план к начальному состоянию? Текущие данные будут потеряны.")) {
      resetAll();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-2 font-semibold text-slate-700">
        <UtensilsCrossed size={18} className="text-emerald-600" />
        <span>Планировщик меню</span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <label
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-500"
          title="Понедельник первой недели"
        >
          <CalendarDays size={14} className="text-slate-400" />
          <span className="hidden md:inline">Старт</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => e.target.value && setStartDate(e.target.value)}
            className="bg-transparent text-slate-600 outline-none"
          />
        </label>
        <ToolbarButton
          onClick={addWeek}
          icon={<CalendarPlus size={14} />}
          label="Неделя"
        />
        <ToolbarButton
          onClick={handleExport}
          icon={<Download size={14} />}
          label="Экспорт"
        />
        <ToolbarButton
          onClick={() => fileRef.current?.click()}
          icon={<Upload size={14} />}
          label="Импорт"
        />
        <ToolbarButton
          onClick={handleReset}
          icon={<RotateCcw size={14} />}
          label="Сброс"
        />
        <button
          type="button"
          onClick={onOpenBacklog}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <MenuIcon size={14} />
          Блюда
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        onChange={handleImportFile}
        className="hidden"
      />
    </header>
  );
}
