/** Local-time date helpers for binding the grid to a real calendar. */

/** Monday (00:00 local) of the week containing `date`. */
export function mondayOf(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const dow = (d.getDay() + 6) % 7; // 0 = Monday .. 6 = Sunday
  d.setDate(d.getDate() - dow);
  return d;
}

/** Format a Date as a local `YYYY-MM-DD` string (no timezone drift). */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse a local `YYYY-MM-DD` string into a Date at local midnight. */
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** The actual date of a given slot, derived from the plan's start Monday. */
export function dateOf(startISO: string, weekIndex: number, dayIndex: number): Date {
  return addDays(parseISODate(startISO), weekIndex * 7 + dayIndex);
}

const shortFmt = new Intl.DateTimeFormat("uk-UA", {
  day: "numeric",
  month: "short",
});

/** e.g. "8 июн." */
export function formatShort(d: Date): string {
  return shortFmt.format(d);
}

/** e.g. "8–14 июн." (collapses the month when both ends share it). */
export function formatWeekRange(startISO: string, weekIndex: number): string {
  const start = dateOf(startISO, weekIndex, 0);
  const end = dateOf(startISO, weekIndex, 6);
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()}–${formatShort(end)}`;
  }
  return `${formatShort(start)} – ${formatShort(end)}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
