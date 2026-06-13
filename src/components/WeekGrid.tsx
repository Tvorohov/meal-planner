import { usePlanner } from "../store";
import { WeekBlock } from "./WeekBlock";

export function WeekGrid() {
  const weeks = usePlanner((s) => s.weeks);
  const assignments = usePlanner((s) => s.assignments);
  const dishes = usePlanner((s) => s.dishes);
  const startDate = usePlanner((s) => s.startDate);
  const removeLastWeek = usePlanner((s) => s.removeLastWeek);

  const handleRemove = (weekIndex: number) => {
    const count = assignments.filter((a) => a.weekIndex === weekIndex).length;
    if (
      count > 0 &&
      !confirm(
        `В этой неделе ${count} блюд(а). Убрать неделю вместе с ними?`,
      )
    ) {
      return;
    }
    removeLastWeek();
  };

  return (
    <div className="space-y-6">
      {Array.from({ length: weeks }, (_, w) => (
        <WeekBlock
          key={w}
          weekIndex={w}
          isLast={w === weeks - 1 && weeks > 1}
          assignments={assignments}
          dishes={dishes}
          startDate={startDate}
          onRemove={() => handleRemove(w)}
        />
      ))}
    </div>
  );
}
