import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import {
  ALL_TAGS,
  MEAL_LABELS,
  type Dish,
  type DishTag,
  type MealType,
} from "../types";
import { usePlanner, type DishInput } from "../store";
import { TagChip } from "./TagChip";

const MEALS: MealType[] = ["breakfast", "dinner"];

export function AddDishForm({
  editing,
  onDone,
}: {
  editing: Dish | null;
  onDone: () => void;
}) {
  const addDish = usePlanner((s) => s.addDish);
  const updateDish = usePlanner((s) => s.updateDish);

  const [name, setName] = useState("");
  const [mealTypes, setMealTypes] = useState<MealType[]>(["dinner"]);
  const [tags, setTags] = useState<DishTag[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setMealTypes(editing.mealTypes);
      setTags(editing.tags);
      setNotes(editing.notes ?? "");
    }
  }, [editing]);

  const toggleMeal = (m: MealType) =>
    setMealTypes((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  const toggleTag = (t: DishTag) =>
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );

  const reset = () => {
    setName("");
    setMealTypes(["dinner"]);
    setTags([]);
    setNotes("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || mealTypes.length === 0) return;

    const input: DishInput = {
      name: trimmed,
      mealTypes,
      tags,
      notes: notes.trim() || undefined,
    };

    if (editing) {
      updateDish(editing.id, input);
    } else {
      addDish(input);
    }
    reset();
    onDone();
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-2"
    >
      <div className="text-xs font-semibold text-slate-500">
        {editing ? "Редактировать блюдо" : "Новое блюдо"}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название блюда"
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-slate-400"
      />

      <div className="flex gap-3">
        {MEALS.map((m) => (
          <label
            key={m}
            className="flex cursor-pointer items-center gap-1 text-xs text-slate-600"
          >
            <input
              type="checkbox"
              checked={mealTypes.includes(m)}
              onChange={() => toggleMeal(m)}
              className="accent-slate-600"
            />
            {MEAL_LABELS[m]}
          </label>
        ))}
      </div>

      <div className="flex flex-wrap gap-1">
        {ALL_TAGS.map((t) => (
          <TagChip
            key={t}
            tag={t}
            active={tags.includes(t)}
            onClick={() => toggleTag(t)}
          />
        ))}
      </div>

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Заметка (необязательно)"
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-slate-400"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-slate-800 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
        >
          <Check size={13} /> {editing ? "Сохранить" : "Добавить"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              reset();
              onDone();
            }}
            className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 px-2 py-1.5 text-xs text-slate-500 transition hover:bg-white"
          >
            <X size={13} /> Отмена
          </button>
        )}
      </div>
    </form>
  );
}
