export type MealType = "breakfast" | "dinner";

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
}

export const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: "Завтрак",
  dinner: "Ужин",
};

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
  cheat: { label: "чит", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  kid: { label: "ребёнок", cls: "bg-pink-100 text-pink-700 border-pink-200" },
  fish: { label: "рыба", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  seafood: { label: "морепр.", cls: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  chicken: { label: "курица", cls: "bg-amber-100 text-amber-700 border-amber-200" },
  beef: { label: "говядина", cls: "bg-red-100 text-red-700 border-red-200" },
  pork: { label: "свинина", cls: "bg-rose-100 text-rose-700 border-rose-200" },
  turkey: { label: "индейка", cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  veg: { label: "веган", cls: "bg-green-100 text-green-700 border-green-200" },
  sweet: { label: "сладкое", cls: "bg-purple-100 text-purple-700 border-purple-200" },
};
