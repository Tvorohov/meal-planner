import { useMemo, useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { Search } from "lucide-react";
import { ALL_TAGS, type Dish, type DishTag } from "../types";
import { BACKLOG_DROP_ID } from "../lib/dnd";
import { usePlanner } from "../store";
import { AddDishForm } from "./AddDishForm";
import { BacklogDishCard } from "./BacklogDishCard";
import { TagChip } from "./TagChip";

export function Backlog() {
  const dishes = usePlanner((s) => s.dishes);

  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<DishTag[]>([]);
  const [editing, setEditing] = useState<Dish | null>(null);

  const { setNodeRef, isOver } = useDroppable({ id: BACKLOG_DROP_ID });

  const toggleTag = (t: DishTag) =>
    setActiveTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return Object.values(dishes)
      .filter((d) => (q ? d.name.toLowerCase().includes(q) : true))
      .filter((d) =>
        activeTags.length ? activeTags.every((t) => d.tags.includes(t)) : true,
      )
      .sort((a, b) => a.name.localeCompare(b.name, "ru"));
  }, [dishes, query, activeTags]);

  return (
    <div
      ref={setNodeRef}
      className={`flex h-full flex-col gap-3 rounded-lg p-1 transition ${
        isOver ? "bg-rose-50 ring-2 ring-rose-200" : ""
      }`}
    >
      <AddDishForm editing={editing} onDone={() => setEditing(null)} />

      <div className="relative">
        <Search
          size={14}
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск блюда"
          className="w-full rounded-md border border-slate-200 py-1.5 pl-7 pr-2 text-sm outline-none focus:border-slate-400"
        />
      </div>

      <div className="flex flex-wrap gap-1">
        {ALL_TAGS.map((t) => (
          <TagChip
            key={t}
            tag={t}
            active={activeTags.includes(t)}
            onClick={() => toggleTag(t)}
          />
        ))}
      </div>

      <div className="flex items-center justify-between px-0.5 text-[11px] text-slate-400">
        <span>Блюд: {filtered.length}</span>
        {isOver && <span className="text-rose-500">отпустите, чтобы убрать</span>}
      </div>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {filtered.map((d) => (
          <BacklogDishCard key={d.id} dish={d} onEdit={() => setEditing(d)} />
        ))}
        {filtered.length === 0 && (
          <div className="px-1 py-4 text-center text-xs text-slate-400">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
}
