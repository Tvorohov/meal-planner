import type { Assignment, Dish } from "../types";

export interface ShoppingItem {
  key: string;
  name: string;
  unit: string;
  quantity: number; // 0 when the amount is unspecified ("до смаку")
  hasAmount: boolean;
}

/**
 * Aggregate ingredients for every dish placed in a given week.
 * Same ingredient + same unit are summed; different units stay separate.
 */
export function buildShoppingList(
  assignments: Assignment[],
  dishes: Record<string, Dish>,
  weekIndex: number,
): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();

  for (const a of assignments) {
    if (a.weekIndex !== weekIndex) continue;
    const dish = dishes[a.dishId];
    if (!dish) continue;

    for (const ing of dish.ingredients ?? []) {
      const name = ing.name.trim();
      if (!name) continue;
      const unit = ing.unit.trim();
      const hasAmount = ing.quantity > 0 && unit !== "до смаку";
      const key = `${name.toLowerCase()}|${hasAmount ? unit.toLowerCase() : "*"}`;

      const existing = map.get(key);
      if (existing) {
        if (hasAmount) existing.quantity += ing.quantity;
      } else {
        map.set(key, {
          key,
          name,
          unit: hasAmount ? unit : unit || "до смаку",
          quantity: hasAmount ? ing.quantity : 0,
          hasAmount,
        });
      }
    }
  }

  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, "uk"));
}

const tidy = (n: number): string =>
  Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);

/** Human-readable line, e.g. "Курка — 500 г" or "Сіль — до смаку". */
export function formatItem(item: ShoppingItem): string {
  if (!item.hasAmount) {
    return `${item.name} — ${item.unit || "до смаку"}`;
  }
  return `${item.name} — ${tidy(item.quantity)} ${item.unit}`;
}
