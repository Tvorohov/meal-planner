import type { Assignment, Dish, MealType, PlannerState } from "./types";
import { newId } from "./lib/ids";
import { mondayOf, toISODate } from "./lib/dates";

export const seedDishes: Omit<Dish, "id">[] = [
  // breakfasts
  { name: "Сендвіч з беконом з індички та яйцем", mealTypes: ["breakfast"], tags: [] },
  { name: "Сирники", mealTypes: ["breakfast"], tags: ["sweet"] },
  { name: "Вівсянка з грибами", mealTypes: ["breakfast"], tags: ["veg"] },
  { name: "Тост з тунцем", mealTypes: ["breakfast"], tags: ["fish"] },
  { name: "Тост із сардинами", mealTypes: ["breakfast"], tags: ["fish"] },
  { name: "Білкова яєчня із салатом", mealTypes: ["breakfast"], tags: [] },
  { name: "Млинці з начинкою та солодкі", mealTypes: ["breakfast"], tags: ["sweet"] },
  { name: "Шакшука", mealTypes: ["breakfast"], tags: [] },
  { name: "Оладки", mealTypes: ["breakfast"], tags: ["sweet", "kid"] },
  { name: "Тост із лососем", mealTypes: ["breakfast"], tags: ["fish"] },

  // dinners (also valid for weekend lunch)
  { name: "Курячі котлети, гарнір, салат", mealTypes: ["dinner", "lunch"], tags: ["chicken"] },
  { name: "Мітболи, гарнір, салат", mealTypes: ["dinner", "lunch"], tags: ["beef"] },
  { name: "Азійська локшина", mealTypes: ["dinner", "lunch"], tags: [] },
  { name: "Тако", mealTypes: ["dinner", "lunch"], tags: ["beef"] },
  {
    name: "Паста з креветками, броколі та в'яленими томатами",
    mealTypes: ["dinner", "lunch"],
    tags: ["seafood"],
  },
  { name: "Паста болоньєзе", mealTypes: ["dinner", "lunch"], tags: ["beef"] },
  { name: "Курячі стегна в азійському соусі", mealTypes: ["dinner", "lunch"], tags: ["chicken"] },
  { name: "Курячі стегна барбекю", mealTypes: ["dinner", "lunch"], tags: ["chicken"] },
  { name: "Курка по-французьки", mealTypes: ["dinner", "lunch"], tags: ["chicken"] },
  { name: "Битки", mealTypes: ["dinner", "lunch"], tags: ["beef"] },
  { name: "Індичка", mealTypes: ["dinner", "lunch"], tags: ["turkey"] },
  { name: "Сосиски барбекю", mealTypes: ["dinner", "lunch"], tags: ["cheat", "pork"] },
  { name: "Бургери", mealTypes: ["dinner", "lunch"], tags: ["cheat", "beef"] },
  { name: "Нагетси з лососем", mealTypes: ["dinner", "lunch"], tags: ["kid", "fish"] },
  { name: "Запечений лосось у боулі", mealTypes: ["dinner", "lunch"], tags: ["fish"] },
  { name: "Піца", mealTypes: ["dinner", "lunch"], tags: ["cheat"] },
];

/**
 * A clean sample 2-week plan (no validation warnings) so the grid is not empty
 * on first run. Day 0 = Monday. Lunch entries are filled only on weekends.
 */
const SAMPLE_PLAN: Array<{
  week: number;
  breakfasts: string[]; // 7, Monday..Sunday
  lunches: string[]; // 7, Monday..Sunday; only weekend entries are filled
  dinners: string[]; // 7, Monday..Sunday
}> = [
  {
    week: 0,
    breakfasts: [
      "Сендвіч з беконом з індички та яйцем",
      "Сирники",
      "Тост з тунцем",
      "Вівсянка з грибами",
      "Шакшука",
      "Оладки",
      "Білкова яєчня із салатом",
    ],
    lunches: ["", "", "", "", "", "Курячі стегна барбекю", "Битки"],
    dinners: [
      "Курячі котлети, гарнір, салат",
      "Паста болоньєзе",
      "Піца",
      "Азійська локшина",
      "Мітболи, гарнір, салат",
      "Бургери",
      "Курячі стегна в азійському соусі",
    ],
  },
  {
    week: 1,
    breakfasts: [
      "Тост із лососем",
      "Млинці з начинкою та солодкі",
      "Сендвіч з беконом з індички та яйцем",
      "Тост із сардинами",
      "Вівсянка з грибами",
      "Сирники",
      "Шакшука",
    ],
    lunches: [
      "",
      "",
      "",
      "",
      "",
      "Курячі котлети, гарнір, салат",
      "Мітболи, гарнір, салат",
    ],
    dinners: [
      "Тако",
      "Паста з креветками, броколі та в'яленими томатами",
      "Курка по-французьки",
      "Сосиски барбекю",
      "Індичка",
      "Запечений лосось у боулі",
      "Битки",
    ],
  },
];

function buildSamplePlan(idByName: Record<string, string>): Assignment[] {
  const assignments: Assignment[] = [];

  const place = (
    week: number,
    dayIndex: number,
    mealType: MealType,
    dishName: string,
    order: number,
  ) => {
    const dishId = idByName[dishName];
    if (!dishId) return;
    assignments.push({
      id: newId(),
      dishId,
      weekIndex: week,
      dayIndex,
      mealType,
      order,
    });
  };

  for (const wk of SAMPLE_PLAN) {
    wk.breakfasts.forEach((name, day) => place(wk.week, day, "breakfast", name, 0));
    wk.lunches.forEach((name, day) => place(wk.week, day, "lunch", name, 0));
    wk.dinners.forEach((name, day) => place(wk.week, day, "dinner", name, 0));
  }

  // Demonstrate two assignments in one slot: a kid dish next to the adult one.
  // (Also keeps the "kid dish needs an adult dish" rule satisfied in the seed.)
  place(0, 6, "dinner", "Нагетси з лососем", 1);
  place(0, 5, "breakfast", "Сендвіч з беконом з індички та яйцем", 1);

  return assignments;
}

/** Build a fresh planner state with seeded catalog + sample plan. */
export function buildInitialState(): PlannerState {
  const dishes: Record<string, Dish> = {};
  const idByName: Record<string, string> = {};

  for (const d of seedDishes) {
    const id = newId();
    dishes[id] = { id, ...d };
    idByName[d.name] = id;
  }

  return {
    dishes,
    assignments: buildSamplePlan(idByName),
    weeks: 2,
    startDate: toISODate(mondayOf(new Date())),
  };
}
