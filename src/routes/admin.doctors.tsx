import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { doctors } from "../lib/site-data";
import { DAY_KEYS, type DayKey } from "../lib/slots";
import { getDoctorAvailability, setDoctorAvailability, type DayAvailability, type TimeRange } from "../lib/availability";

export const Route = createFileRoute("/admin/doctors")({
  component: AdminDoctorAvailability,
});

const DAY_LABELS: Record<DayKey, string> = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday" };

function emptyDayAvailability(): DayAvailability {
  return { mon: [], tue: [], wed: [], thu: [], fri: [], sat: [], sun: [] };
}

function AdminDoctorAvailability() {
  const [doctorSlug, setDoctorSlug] = useState(doctors[0]?.slug ?? "");
  const [availability, setAvailability] = useState<DayAvailability>(emptyDayAvailability());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!doctorSlug) return;
    let cancelled = false;
    setLoading(true);
    setStatus(null);
    getDoctorAvailability(doctorSlug)
      .then((data) => {
        if (!cancelled) setAvailability(data ?? emptyDayAvailability());
      })
      .catch(() => {
        if (!cancelled) setAvailability(emptyDayAvailability());
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorSlug]);

  function updateRange(day: DayKey, index: number, patch: Partial<TimeRange>) {
    setAvailability((prev) => ({
      ...prev,
      [day]: prev[day].map((r, i) => (i === index ? { ...r, ...patch } : r)),
    }));
  }

  function addRange(day: DayKey) {
    setAvailability((prev) => ({ ...prev, [day]: [...prev[day], { start: "09:00", end: "13:00" }] }));
  }

  function removeRange(day: DayKey, index: number) {
    setAvailability((prev) => ({ ...prev, [day]: prev[day].filter((_, i) => i !== index) }));
  }

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      await setDoctorAvailability(doctorSlug, availability);
      setStatus("Saved.");
    } catch {
      setStatus("Couldn't save — check that you're signed in and Firestore rules allow staff writes.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-deep">Doctor Availability</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Set the time ranges each doctor is available on each day. Add multiple ranges to work around breaks, site visits or personal time. A day left with no ranges means the doctor is unavailable that day. These times control what patients can book on the website.</p>

      <label className="mt-6 grid max-w-xs gap-1.5 text-sm font-semibold">
        Doctor
        <select value={doctorSlug} onChange={(e) => setDoctorSlug(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
          {doctors.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
        </select>
      </label>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading schedule…</p>
      ) : (
        <div className="mt-8 grid gap-5">
          {DAY_KEYS.map((day) => (
            <div key={day} className="rounded-lg border border-border bg-background p-5">
              <h3 className="font-bold text-brand-deep">{DAY_LABELS[day]}</h3>
              <div className="mt-3 grid gap-2">
                {availability[day].length === 0 && <p className="text-sm text-muted-foreground">Not available</p>}
                {availability[day].map((range, i) => (
                  <div key={i} className="flex flex-wrap items-center gap-2">
                    <input type="time" value={range.start} onChange={(e) => updateRange(day, i, { start: e.target.value })} className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm" />
                    <span className="text-sm text-muted-foreground">to</span>
                    <input type="time" value={range.end} onChange={(e) => updateRange(day, i, { end: e.target.value })} className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm" />
                    <Button type="button" variant="ghost" size="icon" aria-label="Remove range" onClick={() => removeRange(day, i)}><Trash2 className="size-4" /></Button>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => addRange(day)}><Plus className="size-4" />Add Range</Button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <Button size="lg" onClick={save} disabled={saving || loading}>{saving ? "Saving…" : "Save Schedule"}</Button>
        {status && <p className="text-sm text-muted-foreground">{status}</p>}
      </div>
    </div>
  );
}
