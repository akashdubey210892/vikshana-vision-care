import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { allDaySlots, dayKeyForIso, DAY_KEYS, SLOT_MINUTES, type DayKey } from "./slots";

export type TimeRange = { start: string; end: string };
export type DayAvailability = Record<DayKey, TimeRange[]>;

function emptyDayAvailability(): DayAvailability {
  return { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
}

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

/** Expand [{start:"09:00",end:"13:00"}] into 15-min slot start times ["09:00","09:15",...]. */
export function expandRangesToSlots(ranges: TimeRange[]): string[] {
  const slots = new Set<string>();
  for (const { start, end } of ranges) {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    for (let m = startMin; m < endMin; m += SLOT_MINUTES) {
      const h = Math.floor(m / 60).toString().padStart(2, "0");
      const mm = (m % 60).toString().padStart(2, "0");
      slots.add(`${h}:${mm}`);
    }
  }
  return Array.from(slots).sort();
}

/** Same as getDoctorAvailability, but never throws — a read failure (e.g. rules not yet
 * deployed for this collection) is treated the same as "not configured yet". Used by the
 * public booking page, where an availability hiccup must never block booking outright. */
async function getDoctorAvailabilitySafe(doctorSlug: string): Promise<DayAvailability | null> {
  try {
    return await getDoctorAvailability(doctorSlug);
  } catch (err) {
    console.error(`Failed to read availability for "${doctorSlug}" — falling back to default hours.`, err);
    return null;
  }
}

export async function getDoctorAvailability(doctorSlug: string): Promise<DayAvailability | null> {
  const snap = await getDoc(doc(db, "doctorAvailability", doctorSlug));
  if (!snap.exists()) return null;
  const data = snap.data() as Partial<DayAvailability>;
  const result = emptyDayAvailability();
  for (const day of DAY_KEYS) {
    const ranges = data[day];
    if (Array.isArray(ranges)) result[day] = ranges;
  }
  return result;
}

export async function setDoctorAvailability(doctorSlug: string, availability: DayAvailability): Promise<void> {
  await setDoc(doc(db, "doctorAvailability", doctorSlug), availability);
}

/**
 * Slot list for a given doctor (or "any") on a given date.
 * A doctor with no saved availability document yet falls back to the default
 * fixed hours, so booking keeps working before schedules are configured. A
 * doctor with a saved document but an empty day genuinely has no slots that day.
 */
export async function computeAvailableSlotsForDate(doctorKey: string, dateIso: string, allDoctorSlugs: string[]): Promise<string[]> {
  const dayKey = dayKeyForIso(dateIso);
  const defaultSlots = allDaySlots();

  if (doctorKey !== "any") {
    const availability = await getDoctorAvailabilitySafe(doctorKey);
    if (availability === null) return defaultSlots;
    return expandRangesToSlots(availability[dayKey]);
  }

  const perDoctor = await Promise.all(allDoctorSlugs.map((slug) => getDoctorAvailabilitySafe(slug)));
  const union = new Set<string>();
  perDoctor.forEach((availability) => {
    const slots = availability === null ? defaultSlots : expandRangesToSlots(availability[dayKey]);
    slots.forEach((s) => union.add(s));
  });
  return Array.from(union).sort();
}
