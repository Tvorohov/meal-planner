# Meal Planner — Specification

Interactive web app to plan breakfasts and dinners across several weeks. Drag dishes
from a backlog onto a week grid, move them between days and meals, and manage a catalog
of dishes. Single user, local first, no backend for MVP.

## 1. Tech stack

- Vite + React + TypeScript
- State: `zustand` with the `persist` middleware (saves to `localStorage`)
- Drag and drop: `@dnd-kit/core` + `@dnd-kit/sortable` + `@dnd-kit/utilities`
- Styling: Tailwind CSS
- Icons: `lucide-react`
- No backend in MVP. All state lives in `localStorage`.

Plain SPA. No router for MVP (one screen).

## 2. Core concepts

- **Dish** — an item in the catalog. Has a name, the meal types it fits, and tags.
- **Catalog / Backlog** — the full list of dishes, the source of truth.
- **Assignment** — a dish placed into a specific slot (week, day, meal). The dish stays
  in the catalog, so the same dish can be reused on many days.
- **Slot** — one cell, identified by `weekIndex + dayIndex + mealType`. A slot can hold
  one or more assignments.

Drag from backlog = instantiate (copy into a slot). Drag an assignment off the grid (or
onto a trash zone) = remove that assignment. Repeats are intentional.

## 3. Data model

See `src/types.ts`. `MealType`, `DishTag`, `Dish`, `Assignment`, `PlannerState`.
Day labels (Monday first): `["Пн","Вт","Ср","Чт","Пт","Сб","Нд"]`.

## 4. Features

1. See the plan — a grid of `weeks` weeks, 7 days each, breakfast + dinner per day.
2. Backlog panel — side panel (desktop) / bottom sheet (mobile) with search + tag filter.
3. Drag from backlog to a slot, respecting meal-type compatibility.
4. Move an assignment between slots; reorder within a slot.
5. Remove an assignment (trash zone or the card's "x").
6. Add a dish (name, meal types, tags) from the backlog form.
7. Edit / delete a dish (deleting an in-use dish removes its assignments, with confirm).
8. Add / remove a week (confirm when removing a week with assignments).
9. Persistence to `localStorage`.
10. Export / import the whole state as JSON.

## 5. Validation / soft warnings

Non-blocking hints shown as a warning dot with a tooltip. Implemented as pure functions
in `src/validation.ts`. Checks run over the full timeline, including week boundaries.

- Adjacent cheat dinners.
- Same dish on adjacent days (same meal type).
- Adjacent fish breakfasts.

## 6. Layout

Desktop: top toolbar; left backlog (~280px); main area = vertical stack of weeks, each a
7-column grid with breakfast + dinner per day. Mobile: weeks stack as cards; backlog is a
bottom sheet opened with a "Страви" button.

## 7. File structure

See `src/` — `types.ts`, `seed.ts`, `store.ts`, `validation.ts`, `context.ts`,
`lib/ids.ts`, `lib/dnd.ts`, and `components/`.

## 8. Drag and drop

- Single top-level `<DndContext>` in `App.tsx`.
- Draggable ids: `dish:<dishId>`, `assignment:<assignmentId>`.
- Droppable ids: `slot:<weekIndex>:<dayIndex>:<mealType>`, plus `backlog` and `trash`.
- On drag end: dish→slot creates; assignment→slot moves/reorders; assignment→trash/backlog
  removes; incompatible meal type → no-op.
- `@dnd-kit/sortable` orders multiple assignments inside a slot; `DragOverlay` follows the cursor.

## 9. Seed data

See `src/seed.ts` — initial catalog plus a clean 2-week sample plan.

## 10. Acceptance criteria

See README "Acceptance criteria" section.
