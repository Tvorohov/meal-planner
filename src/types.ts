export type MealType = "breakfast" | "lunch" | "dinner";

export type DishTag =
  | "cheat" // pizza, burgers, bbq sausages
  | "kid" // for the child
  | "fish" // tuna / salmon / sardines etc.
  | "seafood"
  | "chicken"
  | "beef"
  | "pork"
  | "turkey"
  | "veg"
  | "sweet";

export interface Dish {
  id: string;
  name: string;
  mealTypes: MealType[]; // where it can be placed
  tags: DishTag[];
  notes?: string;
}

export interface Assignment {
  id: string; // unique per placement
  dishId: string;
  weekIndex: number; // 0 .. weeks-1
  dayIndex: number; // 0 = Monday .. 6 = Sunday
  mealType: MealType;
  order: number; // sort order inside one slot
}

export interface PlannerState {
  dishes: Record<string, Dish>; // catalog, keyed by id
  assignments: Assignment[];
  weeks: number; // default 2
  startDate: string; // local YYYY-MM-DD of week 0 / Monday
}

export const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"] as const;

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Сніданок",
  lunch: "Обід",
  dinner: "Вечеря",
};

/** Day indexes treated as weekend (Сб, Вс). */
export const WEEKEND_DAYS = [5, 6];

/** Which meal slots a given day shows. Lunch only on weekends. */
export function mealsForDay(dayIndex: number): MealType[] {
  return WEEKEND_DAYS.includes(dayIndex)
    ? ["breakfast", "lunch", "dinner"]
    : ["breakfast", "dinner"];
}

export const ALL_TAGS: DishTag[] = [
  "cheat",
  "kid",
  "fish",
  "seafood",
  "chicken",
  "beef",
  "pork",
  "turkey",
  "veg",
  "sweet",
];

export const TAG_META: Record<DishTag, { label: string; cls: string }> = {
  cheat: { label: "чіт", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  kid: { label: "дитяче", cls: "bg-pink-100 text-pink-700 border-pink-200" },
  fish: { label: "риба", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  seafood: { label: "морепр.", cls: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  chicken: { label: "курка", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  beef: { label: "яловичина", cls: "bg-red-100 text-red-700 border-red-200" },
  pork: { label: "свинина", cls: "bg-rose-100 text-rose-700 border-rose-200" },
  turkey: { label: "індичка", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  veg: { label: "веган", cls: "bg-green-100 text-green-700 border-green-200" },
  sweet: { label: "солодке", cls: "bg-purple-100 text-purple-700 border-purple-200" },
};
