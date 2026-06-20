import type { Assignment, Dish, Ingredient, MealType, PlannerState } from "./types";
import { newId } from "./lib/ids";
import { mondayOf, toISODate } from "./lib/dates";

const g = (name: string, quantity: number, unit: string): Ingredient => ({
  name,
  quantity,
  unit,
});

export const seedDishes: Omit<Dish, "id">[] = [
  // breakfasts
  {
    name: "Сендвіч з беконом з індички та яйцем",
    mealTypes: ["breakfast"],
    tags: [],
    ingredients: [
      g("Бекон з індички", 80, "г"),
      g("Яйце", 2, "шт"),
      g("Хліб тостовий", 2, "шт"),
      g("Сир твердий", 30, "г"),
      g("Листя салату", 20, "г"),
    ],
  },
  {
    name: "Сирники",
    mealTypes: ["breakfast"],
    tags: ["sweet"],
    ingredients: [
      g("Сир кисломолочний", 250, "г"),
      g("Яйце", 1, "шт"),
      g("Борошно", 50, "г"),
      g("Цукор", 1, "ст. л."),
      g("Олія", 20, "мл"),
    ],
  },
  {
    name: "Вівсянка з грибами",
    mealTypes: ["breakfast"],
    tags: ["veg"],
    ingredients: [
      g("Вівсяні пластівці", 60, "г"),
      g("Гриби", 100, "г"),
      g("Цибуля", 1, "шт"),
      g("Олія", 15, "мл"),
      g("Сіль", 0, "до смаку"),
    ],
  },
  {
    name: "Тост з тунцем",
    mealTypes: ["breakfast"],
    tags: ["fish"],
    ingredients: [
      g("Хліб тостовий", 2, "шт"),
      g("Тунець консервований", 1, "шт"),
      g("Майонез", 1, "ст. л."),
      g("Огірок", 1, "шт"),
    ],
  },
  {
    name: "Тост із сардинами",
    mealTypes: ["breakfast"],
    tags: ["fish"],
    ingredients: [
      g("Хліб тостовий", 2, "шт"),
      g("Сардини консервовані", 1, "шт"),
      g("Лимон", 0.5, "шт"),
      g("Зелень", 0, "до смаку"),
    ],
  },
  {
    name: "Білкова яєчня із салатом",
    mealTypes: ["breakfast"],
    tags: [],
    ingredients: [
      g("Яєчний білок", 4, "шт"),
      g("Помідор", 1, "шт"),
      g("Огірок", 1, "шт"),
      g("Листя салату", 50, "г"),
      g("Олія", 10, "мл"),
    ],
  },
  {
    name: "Млинці з начинкою та солодкі",
    mealTypes: ["breakfast"],
    tags: ["sweet"],
    ingredients: [
      g("Борошно", 200, "г"),
      g("Молоко", 400, "мл"),
      g("Яйце", 2, "шт"),
      g("Цукор", 2, "ст. л."),
      g("Сир кисломолочний", 150, "г"),
    ],
  },
  {
    name: "Шакшука",
    mealTypes: ["breakfast"],
    tags: [],
    ingredients: [
      g("Яйце", 3, "шт"),
      g("Помідори", 400, "г"),
      g("Перець болгарський", 1, "шт"),
      g("Цибуля", 1, "шт"),
      g("Олія", 20, "мл"),
    ],
  },
  {
    name: "Оладки",
    mealTypes: ["breakfast"],
    tags: ["sweet", "kid"],
    ingredients: [
      g("Борошно", 200, "г"),
      g("Кефір", 250, "мл"),
      g("Яйце", 1, "шт"),
      g("Цукор", 2, "ст. л."),
      g("Сода", 1, "ч. л."),
    ],
  },
  {
    name: "Тост із лососем",
    mealTypes: ["breakfast"],
    tags: ["fish"],
    ingredients: [
      g("Хліб тостовий", 2, "шт"),
      g("Лосось слабосолоний", 80, "г"),
      g("Крем-сир", 40, "г"),
      g("Авокадо", 0.5, "шт"),
    ],
  },

  // dinners (also valid for weekend lunch)
  {
    name: "Курячі котлети, гарнір, салат",
    mealTypes: ["dinner", "lunch"],
    tags: ["chicken"],
    ingredients: [
      g("Куряче філе", 500, "г"),
      g("Цибуля", 1, "шт"),
      g("Яйце", 1, "шт"),
      g("Картопля", 600, "г"),
      g("Овочі для салату", 300, "г"),
    ],
  },
  {
    name: "Мітболи, гарнір, салат",
    mealTypes: ["dinner", "lunch"],
    tags: ["beef"],
    ingredients: [
      g("Фарш яловичий", 500, "г"),
      g("Цибуля", 1, "шт"),
      g("Рис", 150, "г"),
      g("Томатний соус", 200, "мл"),
      g("Овочі для салату", 300, "г"),
    ],
  },
  {
    name: "Азійська локшина",
    mealTypes: ["dinner", "lunch"],
    tags: [],
    ingredients: [
      g("Локшина", 250, "г"),
      g("Овочі (мікс)", 300, "г"),
      g("Соєвий соус", 50, "мл"),
      g("Часник", 2, "зубчик"),
      g("Олія", 20, "мл"),
    ],
  },
  {
    name: "Тако",
    mealTypes: ["dinner", "lunch"],
    tags: ["beef"],
    ingredients: [
      g("Тортилья", 6, "шт"),
      g("Фарш яловичий", 400, "г"),
      g("Помідор", 2, "шт"),
      g("Сир твердий", 100, "г"),
      g("Салат айсберг", 100, "г"),
    ],
  },
  {
    name: "Паста з креветками, броколі та в'яленими томатами",
    mealTypes: ["dinner", "lunch"],
    tags: ["seafood"],
    ingredients: [
      g("Паста", 250, "г"),
      g("Креветки", 300, "г"),
      g("Броколі", 200, "г"),
      g("В'ялені томати", 60, "г"),
      g("Вершки", 150, "мл"),
    ],
  },
  {
    name: "Паста болоньєзе",
    mealTypes: ["dinner", "lunch"],
    tags: ["beef"],
    ingredients: [
      g("Паста", 250, "г"),
      g("Фарш яловичий", 400, "г"),
      g("Помідори", 400, "г"),
      g("Цибуля", 1, "шт"),
      g("Часник", 2, "зубчик"),
    ],
  },
  {
    name: "Курячі стегна в азійському соусі",
    mealTypes: ["dinner", "lunch"],
    tags: ["chicken"],
    ingredients: [
      g("Курячі стегна", 800, "г"),
      g("Соєвий соус", 50, "мл"),
      g("Мед", 2, "ст. л."),
      g("Часник", 3, "зубчик"),
      g("Імбир", 10, "г"),
    ],
  },
  {
    name: "Курячі стегна барбекю",
    mealTypes: ["dinner", "lunch"],
    tags: ["chicken"],
    ingredients: [
      g("Курячі стегна", 800, "г"),
      g("Соус барбекю", 100, "мл"),
      g("Паприка", 1, "ч. л."),
      g("Часник", 2, "зубчик"),
    ],
  },
  {
    name: "Курка по-французьки",
    mealTypes: ["dinner", "lunch"],
    tags: ["chicken"],
    ingredients: [
      g("Куряче філе", 600, "г"),
      g("Помідор", 2, "шт"),
      g("Сир твердий", 150, "г"),
      g("Цибуля", 1, "шт"),
      g("Майонез", 50, "г"),
    ],
  },
  {
    name: "Битки",
    mealTypes: ["dinner", "lunch"],
    tags: ["beef"],
    ingredients: [
      g("Фарш яловичий", 500, "г"),
      g("Цибуля", 1, "шт"),
      g("Яйце", 1, "шт"),
      g("Борошно", 30, "г"),
      g("Олія", 30, "мл"),
    ],
  },
  {
    name: "Індичка",
    mealTypes: ["dinner", "lunch"],
    tags: ["turkey"],
    ingredients: [
      g("Філе індички", 600, "г"),
      g("Цибуля", 1, "шт"),
      g("Морква", 1, "шт"),
      g("Олія", 20, "мл"),
      g("Спеції", 0, "до смаку"),
    ],
  },
  {
    name: "Сосиски барбекю",
    mealTypes: ["dinner", "lunch"],
    tags: ["cheat", "pork"],
    ingredients: [
      g("Сосиски", 6, "шт"),
      g("Соус барбекю", 50, "мл"),
      g("Булочки", 6, "шт"),
    ],
  },
  {
    name: "Бургери",
    mealTypes: ["dinner", "lunch"],
    tags: ["cheat", "beef"],
    ingredients: [
      g("Булочки для бургерів", 4, "шт"),
      g("Котлета яловича", 4, "шт"),
      g("Сир чедер", 4, "шт"),
      g("Помідор", 1, "шт"),
      g("Листя салату", 50, "г"),
    ],
  },
  {
    name: "Нагетси з лососем",
    mealTypes: ["dinner", "lunch"],
    tags: ["kid", "fish"],
    ingredients: [
      g("Філе лосося", 400, "г"),
      g("Яйце", 1, "шт"),
      g("Паніровочні сухарі", 100, "г"),
      g("Борошно", 50, "г"),
    ],
  },
  {
    name: "Запечений лосось у боулі",
    mealTypes: ["dinner", "lunch"],
    tags: ["fish"],
    ingredients: [
      g("Філе лосося", 400, "г"),
      g("Рис", 200, "г"),
      g("Авокадо", 1, "шт"),
      g("Огірок", 1, "шт"),
      g("Соєвий соус", 30, "мл"),
    ],
  },
  {
    name: "Піца",
    mealTypes: ["dinner", "lunch"],
    tags: ["cheat"],
    ingredients: [
      g("Тісто для піци", 1, "шт"),
      g("Томатний соус", 100, "мл"),
      g("Сир моцарела", 200, "г"),
      g("Пепероні", 100, "г"),
      g("Орегано", 0, "до смаку"),
    ],
  },
];

/** Dish name -> seeded ingredients, used by the persist migration to backfill. */
export const seedIngredientsByName: Record<string, Ingredient[]> =
  Object.fromEntries(seedDishes.map((d) => [d.name, d.ingredients]));

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
