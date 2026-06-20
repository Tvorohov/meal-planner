import { useEffect, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import {
  ALL_TAGS,
  MEAL_LABELS,
  UNIT_OPTIONS,
  type Dish,
  type DishTag,
  type Ingredient,
  type MealType,
} from "../types";
import { usePlanner, type DishInput } from "../store";
import { TagChip } from "./TagChip";

const MEALS: MealType[] = ["breakfast", "lunch", "dinner"];

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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (editing) {
      setName(editing.name);
      setMealTypes(editing.mealTypes);
      setTags(editing.tags);
      setIngredients(editing.ingredients.map((i) => ({ ...i })));
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

  const addRow = () =>
    setIngredients((p) => [...p, { name: "", quantity: 0, unit: "г" }]);
  const updateRow = (i: number, patch: Partial<Ingredient>) =>
    setIngredients((p) => p.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const removeRow = (i: number) =>
    setIngredients((p) => p.filter((_, idx) => idx !== i));

  const reset = () => {
    setName("");
    setMealTypes(["dinner"]);
    setTags([]);
    setIngredients([]);
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
      ingredients: ingredients
        .map((r) => ({
          name: r.name.trim(),
          quantity: r.quantity,
          unit: r.unit.trim(),
        }))
        .filter((r) => r.name),
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
        {editing ? "Редагувати страву" : "Нова страва"}
      </div>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Назва страви"
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

      {/* Ingredients */}
      <div className="space-y-1">
        <div className="text-[11px] font-medium text-slate-500">Інгредієнти</div>
        {ingredients.map((row, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              value={row.quantity || ""}
              onChange={(e) =>
                updateRow(i, { quantity: parseFloat(e.target.value) || 0 })
              }
              placeholder="0"
              className="w-12 rounded-md border border-slate-200 px-1.5 py-1 text-xs outline-none focus:border-slate-400"
            />
            <input
              list="unit-options"
              value={row.unit}
              onChange={(e) => updateRow(i, { unit: e.target.value })}
              placeholder="од."
              className="w-16 rounded-md border border-slate-200 px-1.5 py-1 text-xs outline-none focus:border-slate-400"
            />
            <input
              value={row.name}
              onChange={(e) => updateRow(i, { name: e.target.value })}
              placeholder="інгредієнт"
              className="min-w-0 flex-1 rounded-md border border-slate-200 px-1.5 py-1 text-xs outline-none focus:border-slate-400"
            />
            <button
              type="button"
              onClick={() => removeRow(i)}
              className="shrink-0 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-rose-500"
              aria-label="Прибрати інгредієнт"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
        <datalist id="unit-options">
          {UNIT_OPTIONS.map((u) => (
            <option key={u} value={u} />
          ))}
        </datalist>
        <button
          type="button"
          onClick={addRow}
          className="inline-flex items-center gap-1 rounded-md border border-dashed border-slate-300 px-2 py-1 text-[11px] text-slate-500 transition hover:bg-white"
        >
          <Plus size={12} /> Інгредієнт
        </button>
      </div>

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Нотатка (необов'язково)"
        className="w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-slate-400"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-1 rounded-md bg-slate-800 px-2 py-1.5 text-xs font-medium text-white transition hover:bg-slate-700"
        >
          <Check size={13} /> {editing ? "Зберегти" : "Додати"}
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
            <X size={13} /> Скасувати
          </button>
        )}
      </div>
    </form>
  );
}
