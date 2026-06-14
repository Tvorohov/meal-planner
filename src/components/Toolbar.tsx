import {
  CalendarDays,
  CalendarPlus,
  Menu as MenuIcon,
  RotateCcw,
  UtensilsCrossed,
} from "lucide-react";
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
  const startDate = usePlanner((s) => s.startDate);
  const setStartDate = usePlanner((s) => s.setStartDate);

  const handleReset = () => {
    if (confirm("Скинути план до початкового стану? Поточні дані буде втрачено.")) {
      resetAll();
    }
  };

  return (
    <header className="sticky top-0 z-30 flex flex-wrap items-center gap-2 border-b border-slate-200 bg-white/90 px-3 py-2 backdrop-blur">
      <div className="flex items-center gap-2 font-semibold text-slate-700">
        <UtensilsCrossed size={18} className="text-emerald-600" />
        <span>Планувальник меню</span>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <label
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-500"
          title="Понеділок першого тижня"
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
          label="Тиждень"
        />
        <ToolbarButton
          onClick={handleReset}
          icon={<RotateCcw size={14} />}
          label="Скинути"
        />
        <button
          type="button"
          onClick={onOpenBacklog}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 lg:hidden"
        >
          <MenuIcon size={14} />
          Страви
        </button>
      </div>
    </header>
  );
}
