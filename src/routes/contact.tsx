import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { GoogleReviewsTeaser, PageHero } from "../components/site-components";
import { appointmentWhatsAppLink, contact, directionsUrl, doctors, getDoctor, mapEmbed } from "../lib/site-data";
import { db } from "../lib/firebase";
import { addDaysIso, formatSlotLabel, nowMinutes, todayIso } from "../lib/slots";
import { computeAvailableSlotsForDate } from "../lib/availability";

const MAX_LOOKAHEAD_DAYS = 14;
const DOCTOR_SLUGS = doctors.map((d) => d.slug);

async function dateHasOpenSlot(dateIso: string, doctorKey: string, isTodayDate: boolean): Promise<boolean> {
  const [snap, availableSlots] = await Promise.all([
    getDocs(collection(db, "slots", dateIso, "doctors", doctorKey, "booked")),
    computeAvailableSlotsForDate(doctorKey, dateIso, DOCTOR_SLUGS),
  ]);
  const booked = new Set(snap.docs.map((d) => d.id));
  const nowMins = nowMinutes();
  return availableSlots.some((time) => {
    if (booked.has(time)) return false;
    if (isTodayDate) {
      const mins = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
      if (mins <= nowMins) return false;
    }
    return true;
  });
}

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100).regex(/^[A-Za-z][A-Za-z .'-]*$/, "Name should contain letters only"),
  phone: z.string().trim().regex(/^[0-9]{10}$/, "Enter a valid 10-digit mobile number"),
  email: z.string().trim().email("Enter a valid email address").max(255),
  service: z.string().trim().min(2, "Tell us the reason for your visit").max(120),
  message: z.string().trim().max(600),
});
const searchSchema = z.object({ doctor: z.string().optional() });

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Contact Us | Book an Eye Checkup in Yelahanka, Bangalore | Vikshana Eye Hospital" },
      { name: "description", content: "Book an eye checkup or routine eye examination at Vikshana Eye Hospital, Doddaballapur Main Road, Yelahanka, Bangalore (Bengaluru). Call 8920847760, 8009537637." },
      { name: "keywords", content: "Eye Checkup Bangalore, Eye Health Checkup, Routine Eye Examination, Complete Eye Examination, Eye Hospital Bangalore, Eye Clinic, Vision Care" },
      { property: "og:title", content: "Contact Vikshana Eye Hospital" },
      { property: "og:description", content: "Book an appointment or get directions to our eye hospital in Yelahanka, Bangalore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function isPermissionDenied(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "permission-denied";
}

function doctorLabel(doctorKey: string) {
  if (doctorKey === "any") return "Any Available Doctor";
  return getDoctor(doctorKey)?.name ?? doctorKey;
}

type Sent = { date: string; time: string; doctorKey: string; whatsappUrl: string };

function Contact() {
  const { doctor: doctorSlug } = Route.useSearch();
  const preselectedDoctor = doctorSlug && getDoctor(doctorSlug) ? doctorSlug : "any";

  const [doctorKey, setDoctorKey] = useState(preselectedDoctor);
  useEffect(() => { setDoctorKey(preselectedDoctor); }, [preselectedDoctor]);

  const [date, setDate] = useState(todayIso());
  const [minDate, setMinDate] = useState(todayIso());
  const [findingDate, setFindingDate] = useState(true);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookedTimes, setBookedTimes] = useState<Set<string>>(new Set());
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [slotsBlocked, setSlotsBlocked] = useState(false);

  // Pick the earliest selectable date for this doctor: today if it still has an
  // open slot, otherwise the first future date (within two weeks) that does —
  // and disable every date before that in the picker.
  useEffect(() => {
    let cancelled = false;
    setFindingDate(true);
    (async () => {
      const start = todayIso();
      try {
        if (await dateHasOpenSlot(start, doctorKey, true)) {
          if (!cancelled) setMinDate(start);
          return;
        }
        const nextMin = addDaysIso(start, 1);
        if (!cancelled) setMinDate(nextMin);
        for (let i = 1; i <= MAX_LOOKAHEAD_DAYS; i++) {
          const candidate = addDaysIso(start, i);
          if (await dateHasOpenSlot(candidate, doctorKey, false)) {
            if (!cancelled) setDate(candidate);
            return;
          }
          if (cancelled) return;
        }
        if (!cancelled) setDate(nextMin);
      } catch {
        // Can't determine yet (e.g. rules not published) — leave today selected;
        // the per-date slot fetch below will surface the "not set up" message.
      } finally {
        if (!cancelled) setFindingDate(false);
      }
    })();
    return () => { cancelled = true; };
  }, [doctorKey]);

  function refreshBookedTimes() {
    return getDocs(collection(db, "slots", date, "doctors", doctorKey, "booked"))
      .then((snap) => setBookedTimes(new Set(snap.docs.map((d) => d.id))))
      .catch(() => setBookedTimes(new Set()));
  }

  useEffect(() => {
    let cancelled = false;
    setLoadingSlots(true);
    setSelectedTime(null);
    setSlotsBlocked(false);
    Promise.all([
      getDocs(collection(db, "slots", date, "doctors", doctorKey, "booked")),
      computeAvailableSlotsForDate(doctorKey, date, DOCTOR_SLUGS),
    ])
      .then(([snap, slots]) => {
        if (cancelled) return;
        setBookedTimes(new Set(snap.docs.map((d) => d.id)));
        setAvailableSlots(slots);
      })
      .catch((err) => { if (!cancelled) { setBookedTimes(new Set()); setAvailableSlots([]); if (isPermissionDenied(err)) setSlotsBlocked(true); } })
      .finally(() => { if (!cancelled) setLoadingSlots(false); });
    return () => { cancelled = true; };
  }, [date, doctorKey]);

  const isToday = date === todayIso();
  const minutesNow = nowMinutes();
  const slots = availableSlots.map((time) => {
    const totalMinutes = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
    const isPast = isToday && totalMinutes <= minutesNow;
    return { time, available: !bookedTimes.has(time) && !isPast };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState<Sent | null>(null);

  useEffect(() => {
    if (sent) document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [sent]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    const result = schema.safeParse(Object.fromEntries(new FormData(e.currentTarget)));
    const nextErrors: Record<string, string> = result.success ? {} : Object.fromEntries(result.error.issues.map((x) => [String(x.path[0]), x.message]));

    if (!date) {
      nextErrors["date"] = "Please select a date";
    } else if (date < minDate) {
      nextErrors["date"] = date < todayIso() ? "Past dates cannot be selected" : "No slots remain today — please choose another date";
    }

    if (!selectedTime) {
      nextErrors["time"] = "Please choose an available time slot";
    } else if (date === todayIso()) {
      const selectedMinutes = Number(selectedTime.slice(0, 2)) * 60 + Number(selectedTime.slice(3, 5));
      if (selectedMinutes <= nowMinutes()) {
        nextErrors["time"] = "This time has already passed — please choose another slot";
        setSelectedTime(null);
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !result.success || !selectedTime) return;

    setSubmitting(true);
    const data = result.data;

    try {
      await setDoc(doc(db, "slots", date, "doctors", doctorKey, "booked", selectedTime), { bookedAt: serverTimestamp() });
    } catch (err) {
      setFormError(isPermissionDenied(err) ? "Online booking isn't set up yet — please call us to book this slot." : "That slot was just booked by someone else. Please choose another time.");
      setSubmitting(false);
      refreshBookedTimes();
      return;
    }

    try {
      await addDoc(collection(db, "appointments"), {
        name: data.name, phone: data.phone, email: data.email,
        doctor: doctorKey, date, time: selectedTime,
        service: data.service, message: data.message,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      setFormError(isPermissionDenied(err) ? "Online booking isn't set up yet — please call us to book this slot." : "Your slot was reserved, but we couldn't save your details. Please call us to confirm.");
      setSubmitting(false);
      return;
    }

    try {
      await addDoc(collection(db, "appointmentEmails"), {
        type: "confirmation",
        to: data.email, name: data.name,
        doctor: doctorKey, date, time: selectedTime, service: data.service,
        createdAt: serverTimestamp(),
      });
    } catch {
      // Best-effort — the appointment itself is already saved; a missed
      // confirmation email isn't worth surfacing an error to the patient.
    }

    const whatsappUrl = appointmentWhatsAppLink({
      name: data.name, phone: data.phone, email: data.email,
      doctorLabel: doctorLabel(doctorKey), date, time: formatSlotLabel(selectedTime),
      service: data.service, message: data.message,
    });
    setSent({ date, time: selectedTime, doctorKey, whatsappUrl });
    setSubmitting(false);
    e.currentTarget.reset();
  }

  return (
    <>
      <PageHero eyebrow="Contact us" title="Your next step toward clearer vision" text="Request an appointment or contact our team. Please do not share private medical details in this public form." />
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside>
            <h2 className="text-3xl text-brand-deep">Vikshana Eye Hospital</h2>
            <div className="mt-7 grid gap-5 text-sm leading-7">
              <p className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-primary" />{contact.address}</p>
              <p className="flex gap-3"><Phone className="mt-1 size-5 shrink-0 text-primary" /><span><a href={`tel:${contact.phone1}`}>{contact.phone1}</a><br /><a href={`tel:${contact.phone2}`}>{contact.phone2}</a></span></p>
              <a className="flex gap-3" href={`mailto:${contact.email}`}><Mail className="mt-1 size-5 shrink-0 text-primary" />{contact.email}</a>
            </div>
            <Button asChild variant="outline" className="mt-7"><a href={directionsUrl} target="_blank" rel="noreferrer">Get Directions</a></Button>
            <iframe title="Map of Vikshana Eye Hospital area" src={mapEmbed} loading="lazy" className="mt-8 h-72 w-full rounded-lg border-0" />
          </aside>

          <div id="appointment-form" className="scroll-mt-24 rounded-lg border border-border bg-card p-6 shadow-lg sm:p-9">
            <h2 className="text-3xl text-brand-deep">Request an Appointment</h2>

            {sent ? (
              <div role="status" className="mt-8 rounded-lg bg-accent p-6">
                <CheckCircle2 className="size-8 text-primary" />
                <h3 className="mt-4 font-bold text-brand-deep">Your slot is reserved</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {new Date(sent.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {formatSlotLabel(sent.time)} with {doctorLabel(sent.doctorKey)}. Tap below to confirm your visit with our front desk on WhatsApp.
                </p>
                <Button asChild size="lg" className="mt-5"><a href={sent.whatsappUrl} target="_blank" rel="noreferrer">Send via WhatsApp</a></Button>
              </div>
            ) : (
              <form className="mt-7 grid gap-5" onSubmit={submit} noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" name="name" error={errors["name"]} />
                  <Field label="Phone Number" name="phone" type="tel" inputMode="numeric" maxLength={10} error={errors["phone"]} />
                </div>
                <Field label="Email" name="email" type="email" error={errors["email"]} />

                <label className="grid gap-2 text-sm font-semibold">
                  Preferred Doctor
                  <select value={doctorKey} onChange={(e) => setDoctorKey(e.target.value)} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm">
                    <option value="any">Any Doctor</option>
                    {doctors.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-semibold">
                  Preferred Date
                  <input type="date" value={date} min={minDate} onChange={(e) => setDate(e.target.value < minDate ? minDate : e.target.value)} aria-invalid={!!errors["date"]} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm" />
                  {minDate > todayIso() && <span className="text-xs text-muted-foreground">No slots remain today — earliest available date shown.</span>}
                  {errors["date"] && <span className="text-destructive text-sm">{errors["date"]}</span>}
                </label>

                <div className="grid gap-2">
                  <span className="text-sm font-semibold">Preferred Time <span className="font-normal text-muted-foreground">(clinic hours 8 AM – 9 PM, 15-min slots)</span></span>
                  {loadingSlots || findingDate ? (
                    <p className="text-sm text-muted-foreground">{findingDate ? "Finding the next available date…" : "Checking available slots…"}</p>
                  ) : slotsBlocked ? (
                    <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">Online booking isn't set up yet — please call us at {contact.phone1} to book.</p>
                  ) : slots.every((s) => !s.available) ? (
                    <p className="text-sm text-muted-foreground">No slots left for this doctor on this date — please try another date.</p>
                  ) : (
                    <div className="grid max-h-64 grid-cols-3 gap-2 overflow-y-auto rounded-md border border-border p-3 sm:grid-cols-4">
                      {slots.map(({ time, available }) => (
                        <button
                          key={time}
                          type="button"
                          disabled={!available}
                          onClick={() => setSelectedTime(time)}
                          aria-pressed={selectedTime === time}
                          className={`rounded-md border px-2 py-2 text-xs font-semibold transition ${selectedTime === time ? "border-primary bg-primary text-primary-foreground" : available ? "border-input bg-background hover:border-primary hover:text-primary" : "cursor-not-allowed border-border bg-muted text-muted-foreground/40 line-through"}`}
                        >
                          {formatSlotLabel(time)}
                        </button>
                      ))}
                    </div>
                  )}
                  {errors["time"] && <span className="text-destructive text-sm">{errors["time"]}</span>}
                </div>

                <Field label="Service / Reason for Visit" name="service" error={errors["service"]} />
                <label className="grid gap-2 text-sm font-semibold">Message <span className="font-normal text-muted-foreground">(optional; avoid medical details)</span>
                  <Textarea name="message" maxLength={600} className="min-h-28" />
                  {errors["message"] && <span className="text-destructive">{errors["message"]}</span>}
                </label>

                {formError && <p className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{formError}</p>}
                <Button size="lg" type="submit" disabled={submitting} className="w-full sm:w-auto">{submitting ? "Booking…" : "Request Appointment"}</Button>
              </form>
            )}
          </div>
        </div>
      </section>
      <section className="section-pad bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <GoogleReviewsTeaser />
        </div>
      </section>
    </>
  );
}
function Field({ label, name, type = "text", inputMode, maxLength, error }: { label: string; name: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"]; maxLength?: number; error: string | undefined }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      <Input name={name} type={type} inputMode={inputMode} maxLength={maxLength ?? (type === "email" ? 255 : 120)} aria-invalid={!!error} aria-describedby={error ? `${name}-error` : undefined} />
      {error && <span id={`${name}-error`} className="text-destructive">{error}</span>}
    </label>
  );
}
