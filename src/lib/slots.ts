export const OPEN_MINUTES = 8 * 60; // 8:00 AM
export const CLOSE_MINUTES = 21 * 60; // 9:00 PM
export const SLOT_MINUTES = 15;

/** All possible slot start times for a day, as "HH:mm", 8:00 AM through 8:45 PM. */
export function allDaySlots(): string[] {
  const slots: string[] = [];
  for (let m = OPEN_MINUTES; m < CLOSE_MINUTES; m += SLOT_MINUTES) {
    const h = Math.floor(m / 60).toString().padStart(2, "0");
    const mm = (m % 60).toString().padStart(2, "0");
    slots.push(`${h}:${mm}`);
  }
  return slots;
}

/** "14:15" -> "2:15 PM" */
export function formatSlotLabel(time: string): string {
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

/** Today's date as "YYYY-MM-DD" in local time. */
export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Minutes since midnight right now, local time. */
export function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}
