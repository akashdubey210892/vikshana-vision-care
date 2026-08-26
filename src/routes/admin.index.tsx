import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { collection, doc, getDoc, onSnapshot, query, serverTimestamp, where, writeBatch } from "firebase/firestore";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../components/ui/alert-dialog";
import { Button, buttonVariants } from "../components/ui/button";
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

async function deleteAppointment(a: Appointment) {
  const batch = writeBatch(db);
  batch.delete(doc(db, "appointments", a.id));
  batch.delete(doc(db, "slots", a.date, "doctors", a.doctor, "booked", a.time));
  batch.set(doc(collection(db, "appointmentEmails")), {
    type: "cancelled",
    to: a.email, name: a.name,
    doctor: a.doctor, date: a.date, time: a.time, service: a.service,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
}

/** Returns null on success, or an error message if the target slot is already taken. */
async function rescheduleAppointment(a: Appointment, newDate: string, newTime: string): Promise<string | null> {
  if (newDate === a.date && newTime === a.time) return null;

  const targetSnap = await getDoc(doc(db, "slots", newDate, "doctors", a.doctor, "booked", newTime));
  if (targetSnap.exists()) return "That slot is already booked. Please choose another time.";

  const batch = writeBatch(db);
  batch.delete(doc(db, "slots", a.date, "doctors", a.doctor, "booked", a.time));
  batch.set(doc(db, "slots", newDate, "doctors", a.doctor, "booked", newTime), { bookedAt: serverTimestamp() });
  batch.update(doc(db, "appointments", a.id), { date: newDate, time: newTime });
  batch.set(doc(collection(db, "appointmentEmails")), {
    type: "rescheduled",
    to: a.email, name: a.name,
    doctor: a.doctor, service: a.service,
    oldDate: a.date, oldTime: a.time, date: newDate, time: newTime,
    createdAt: serverTimestamp(),
  });
  await batch.commit();
  return null;
}

function EditRow({ appointment, onDone }: { appointment: Appointment; onDone: () => void }) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const err = await rescheduleAppointment(appointment, newDate, newTime);
    setSaving(false);
    if (err) {
      setError(err);
      return;
    }
    onDone();
  }

  return (
    <TableRow>
      <TableCell colSpan={7}>
        <div className="flex flex-wrap items-center gap-3 py-1">
          <span className="text-sm font-semibold">{appointment.name}</span>
          <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm" />
          <input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} className="flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm" />
          <Button size="sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          <Button size="sm" variant="outline" onClick={onDone} disabled={saving}>Cancel</Button>
          {error && <span className="text-sm text-destructive">{error}</span>}
        </div>
      </TableCell>
    </TableRow>
  );
}

function AdminAppointments() {
  const [date, setDate] = useState(todayIso());
  const [search, setSearch] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Appointment | null>(null);

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

  async function confirmDelete() {
    if (!pendingDelete) return;
    try {
      await deleteAppointment(pendingDelete);
    } catch {
      alert("Couldn't delete this appointment — check that you're signed in and Firestore rules allow staff writes.");
    } finally {
      setPendingDelete(null);
    }
  }

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((a) =>
                editingId === a.id ? (
                  <EditRow key={a.id} appointment={a} onDone={() => setEditingId(null)} />
                ) : (
                  <TableRow key={a.id}>
                    <TableCell>{a.time}</TableCell>
                    <TableCell>{a.name}</TableCell>
                    <TableCell>{a.phone}</TableCell>
                    <TableCell>{doctorLabel(a.doctor)}</TableCell>
                    <TableCell>{a.service}</TableCell>
                    <TableCell className="max-w-64 truncate">{a.message}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" aria-label="Reschedule" onClick={() => setEditingId(a.id)}><Pencil className="size-4" /></Button>
                        <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => setPendingDelete(a)}><Trash2 className="size-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && `This will permanently delete ${pendingDelete.name}'s appointment on ${pendingDelete.date} at ${pendingDelete.time}, and free up that time slot for booking. This cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: "destructive" })} onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
