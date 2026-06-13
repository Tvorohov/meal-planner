import type { Assignment, Dish, MealType, PlannerState } from "./types";
import { newId } from "./lib/ids";

export const seedDishes: Omit<Dish, "id">[] = [
  // breakfasts
  { name: "Сэндвич с тюркей-беконом и яйцом", mealTypes: ["breakfast"], tags: [] },
  { name: "Сырники", mealTypes: ["breakfast"], tags: ["sweet"] },
  { name: "Овсянка с грибами", mealTypes: ["breakfast"], tags: ["veg"] },
  { name: "Тост с тунцом", mealTypes: ["breakfast"], tags: ["fish"] },
  { name: "Тост с сардинами", mealTypes: ["breakfast"], tags: ["fish"] },
  { name: "Яичница с белком и салатом", mealTypes: ["breakfast"], tags: [] },
  { name: "Блинчики с начинкой и сладкие", mealTypes: ["breakfast"], tags: ["sweet"] },
  { name: "Шакшука", mealTypes: ["breakfast"], tags: [] },
  { name: "Оладьи", mealTypes: ["breakfast"], tags: ["sweet", "kid"] },
  { name: "Тост с лососем", mealTypes: ["breakfast"], tags: ["fish"] },

  // dinners
  { name: "Куриные котлеты, гарнир, салат", mealTypes: ["dinner"], tags: ["chicken"] },
  { name: "Митболы, гарнир, салат", mealTypes: ["dinner"], tags: ["beef"] },
  { name: "Азиатская лапша", mealTypes: ["dinner"], tags: [] },
  { name: "Тако", mealTypes: ["dinner"], tags: ["beef"] },
  {
    name: "Паста с креветками, брокколи и вялеными томатами",
    mealTypes: ["dinner"],
    tags: ["seafood"],
  },
  { name: "Паста болоньезе", mealTypes: ["dinner"], tags: ["beef"] },
  { name: "Куриные бедра в азиатском соусе", mealTypes: ["dinner"], tags: ["chicken"] },
  { name: "Куриные бедра барбекю", mealTypes: ["dinner"], tags: ["chicken"] },
  { name: "Курица по-французски", mealTypes: ["dinner"], tags: ["chicken"] },
  { name: "Биточки", mealTypes: ["dinner"], tags: ["beef"] },
  { name: "Индейка", mealTypes: ["dinner"], tags: ["turkey"] },
  { name: "Сосиски барбекю", mealTypes: ["dinner"], tags: ["cheat", "pork"] },
  { name: "Бургеры", mealTypes: ["dinner"], tags: ["cheat", "beef"] },
  { name: "Наггетсы с лососем", mealTypes: ["dinner"], tags: ["kid", "fish"] },
  { name: "Запечённый лосось в боуле", mealTypes: ["dinner"], tags: ["fish"] },
  { name: "Пицца", mealTypes: ["dinner"], tags: ["cheat"] },
];

/**
 * A clean, agreed 2-week plan (no validation warnings) so the grid is not
 * empty on first run. Each entry is [dayIndex, breakfast name, dinner name].
 * Day 0 = Monday.
 */
const SAMPLE_PLAN: Array<{
  week: number;
  breakfasts: string[]; // 7, Monday..Sunday
  dinners: string[]; // 7, Monday..Sunday
}> = [
  {
    week: 0,
    breakfasts: [
      "Сэндвич с тюркей-беконом и яйцом",
      "Сырники",
      "Тост с тунцом",
      "Овсянка с грибами",
      "Шакшука",
      "Оладьи",
      "Яичница с белком и салатом",
    ],
    dinners: [
      "Куриные котлеты, гарнир, салат",
      "Паста болоньезе",
      "Пицца",
      "Азиатская лапша",
      "Митболы, гарнир, салат",
      "Бургеры",
      "Куриные бедра в азиатском соусе",
    ],
  },
  {
    week: 1,
    breakfasts: [
      "Тост с лососем",
      "Блинчики с начинкой и сладкие",
      "Сэндвич с тюркей-беконом и яйцом",
      "Тост с сардинами",
      "Овсянка с грибами",
      "Сырники",
      "Шакшука",
    ],
    dinners: [
      "Тако",
      "Паста с креветками, брокколи и вялеными томатами",
      "Курица по-французски",
      "Сосиски барбекю",
      "Индейка",
      "Запечённый лосось в боуле",
      "Биточки",
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
    wk.dinners.forEach((name, day) => place(wk.week, day, "dinner", name, 0));
  }

  // Demonstrate two assignments in one slot: a kid dish next to the adult one.
  place(0, 6, "dinner", "Наггетсы с лососем", 1);

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
  };
}
