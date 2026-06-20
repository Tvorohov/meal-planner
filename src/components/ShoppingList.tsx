import { useMemo, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { usePlanner } from "../store";
import { formatWeekRange } from "../lib/dates";
import { buildShoppingList, formatItem } from "../lib/shopping";

export function ShoppingList({
  weekIndex,
  onClose,
}: {
  weekIndex: number;
  onClose: () => void;
}) {
  const assignments = usePlanner((s) => s.assignments);
  const dishes = usePlanner((s) => s.dishes);
  const startDate = usePlanner((s) => s.startDate);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const items = useMemo(
    () => buildShoppingList(assignments, dishes, weekIndex),
    [assignments, dishes, weekIndex],
  );

  const toggle = (key: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const handleCopy = async () => {
    const title = `Список покупок · Тиждень ${weekIndex + 1} (${formatWeekRange(startDate, weekIndex)})`;
    const text = [title, ...items.map((i) => `• ${formatItem(i)}`)].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable; ignore */
    }
  };

  const remaining = items.length - checked.size;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-md flex-col rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-slate-200 p-3">
          <div>
            <div className="text-sm font-semibold text-slate-700">
              Список покупок
            </div>
            <div className="text-xs text-slate-400">
              Тиждень {weekIndex + 1} · {formatWeekRange(startDate, weekIndex)} ·{" "}
              {remaining} з {items.length}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
            aria-label="Закрити"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {items.length === 0 && (
            <div className="px-1 py-6 text-center text-xs text-slate-400">
              Немає інгредієнтів. Додайте страви на цей тиждень або заповніть
              інгредієнти в каталозі.
            </div>
          )}
          <ul className="space-y-0.5">
            {items.map((item) => {
              const done = checked.has(item.key);
              return (
                <li key={item.key}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={done}
                      onChange={() => toggle(item.key)}
                      className="size-4 accent-emerald-600"
                    />
                    <span
                      className={`flex-1 ${done ? "text-slate-300 line-through" : "text-slate-700"}`}
                    >
                      {item.name}
                    </span>
                    <span
                      className={`text-xs ${done ? "text-slate-300" : "text-slate-500"}`}
                    >
                      {item.hasAmount
                        ? `${formatAmount(item.quantity)} ${item.unit}`
                        : item.unit || "до смаку"}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 p-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-slate-200 px-2 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" /> Скопійовано
                </>
              ) : (
                <>
                  <Copy size={14} /> Скопіювати список
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const formatAmount = (n: number): string =>
  Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
