import type { Assignment, Dish, DishTag, MealType } from "./types";

export interface Warning {
  assignmentId: string;
  ruleId: string;
  message: string;
}

type DishMap = Record<string, Dish>;
type Rule = (assignments: Assignment[], dishes: DishMap) => Warning[];

/** Global day index so adjacency works across the week boundary. */
const globalDay = (a: Assignment): number => a.weekIndex * 7 + a.dayIndex;

const hasTag = (dishes: DishMap, a: Assignment, tag: DishTag): boolean =>
  dishes[a.dishId]?.tags.includes(tag) ?? false;

/**
 * Generic helper: flag assignments of a given meal type + tag when another
 * assignment with the same meal type + tag sits on an adjacent day.
 */
function adjacentTagRule(
  assignments: Assignment[],
  dishes: DishMap,
  meal: MealType,
  tag: DishTag,
  ruleId: string,
  message: string,
): Warning[] {
  const tagged = assignments.filter(
    (a) => a.mealType === meal && hasTag(dishes, a, tag),
  );
  const days = new Set(tagged.map(globalDay));
  const out: Warning[] = [];
  for (const a of tagged) {
    const d = globalDay(a);
    if (days.has(d - 1) || days.has(d + 1)) {
      out.push({ assignmentId: a.id, ruleId, message });
    }
  }
  return out;
}

/** Two dinners on adjacent days both tagged `cheat`. */
export const ruleAdjacentCheatDinners: Rule = (assignments, dishes) =>
  adjacentTagRule(
    assignments,
    dishes,
    "dinner",
    "cheat",
    "adjacent-cheat-dinner",
    "Чит-ужины в соседние дни — лучше развести.",
  );

/** Two breakfasts on adjacent days both tagged `fish`. */
export const ruleAdjacentFishBreakfasts: Rule = (assignments, dishes) =>
  adjacentTagRule(
    assignments,
    dishes,
    "breakfast",
    "fish",
    "adjacent-fish-breakfast",
    "Рыбные завтраки два дня подряд.",
  );

/** Same dish on adjacent days in the same meal type. */
export const ruleSameDishAdjacent: Rule = (assignments, dishes) => {
  const out: Warning[] = [];
  for (const a of assignments) {
    const d = globalDay(a);
    const conflict = assignments.some(
      (b) =>
        b.id !== a.id &&
        b.mealType === a.mealType &&
        b.dishId === a.dishId &&
        Math.abs(globalDay(b) - d) === 1,
    );
    if (conflict) {
      out.push({
        assignmentId: a.id,
        ruleId: "same-dish-adjacent",
        message: `«${dishes[a.dishId]?.name ?? "Блюдо"}» в соседние дни.`,
      });
    }
  }
  return out;
};

/** A slot with a kid dish should also have a non-kid (adult) dish. */
export const ruleKidNeedsAdult: Rule = (assignments, dishes) => {
  const bySlot = new Map<string, Assignment[]>();
  for (const a of assignments) {
    const key = `${a.weekIndex}:${a.dayIndex}:${a.mealType}`;
    const arr = bySlot.get(key);
    if (arr) arr.push(a);
    else bySlot.set(key, [a]);
  }

  const out: Warning[] = [];
  for (const items of bySlot.values()) {
    const hasKid = items.some((a) => hasTag(dishes, a, "kid"));
    const hasAdult = items.some(
      (a) => dishes[a.dishId] && !hasTag(dishes, a, "kid"),
    );
    if (hasKid && !hasAdult) {
      for (const a of items) {
        if (hasTag(dishes, a, "kid")) {
          out.push({
            assignmentId: a.id,
            ruleId: "kid-needs-adult",
            message: "Детское блюдо без второго блюда для взрослых.",
          });
        }
      }
    }
  }
  return out;
};

/** Register rules here. Comment one out to turn it off. */
const RULES: Rule[] = [
  ruleAdjacentCheatDinners,
  ruleAdjacentFishBreakfasts,
  ruleSameDishAdjacent,
  ruleKidNeedsAdult,
];

/** Run every rule and group warnings by assignment id. */
export function runValidation(
  assignments: Assignment[],
  dishes: DishMap,
): Map<string, Warning[]> {
  const map = new Map<string, Warning[]>();
  for (const rule of RULES) {
    for (const w of rule(assignments, dishes)) {
      const arr = map.get(w.assignmentId) ?? [];
      arr.push(w);
      map.set(w.assignmentId, arr);
    }
  }
  return map;
}
