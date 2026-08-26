import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Input } from "../components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { db } from "../lib/firebase";
import { todayIso } from "../lib/slots";
import { getDoctor } from "../lib/site-data";

export const Route = createFileRoute("/admin/")({
  component: AdminAppointments,
});

type Appointment = {
  id: string;
  name: string;
  phone: string;
  email: string;
  doctor: string;
  date: string;
  time: string;
  service: string;
  message?: string;
};

function doctorLabel(doctorKey: string) {
  if (doctorKey === "any") return "Any Available Doctor";
  return getDoctor(doctorKey)?.name ?? doctorKey;
}

function AdminAppointments() {
  const [date, setDate] = useState(todayIso());
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = onSnapshot(
      query(collection(db, "appointments"), where("date", "==", date)),
      (snap) => {
        setAppointments(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Appointment, "id">) })));
        setLoading(false);
      },
      () => {
        setError("Couldn't load appointments — check that you're signed in and Firestore rules allow staff reads.");
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [date]);

  const filtered = appointments
    .filter((a) => {
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.phone.includes(q);
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div>
      <h2 className="text-2xl font-bold text-brand-deep">Appointments</h2>
      <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />Updates automatically — no need to refresh</p>
      <div className="mt-5 flex flex-wrap gap-4">
        <label className="grid gap-1.5 text-sm font-semibold">
          Date
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm" />
        </label>
        <label className="grid min-w-64 flex-1 gap-1.5 text-sm font-semibold">
          Search by name or phone
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" />
        </label>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-background">
        {loading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading appointments…</p>
        ) : error ? (
          <p className="p-6 text-sm text-destructive">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No appointments found for this date.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.time}</TableCell>
                  <TableCell>{a.name}</TableCell>
                  <TableCell>{a.phone}</TableCell>
                  <TableCell>{doctorLabel(a.doctor)}</TableCell>
                  <TableCell>{a.service}</TableCell>
                  <TableCell className="max-w-64 truncate">{a.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
