import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { CtaBand, DoctorCard, HighlightList, ProfileAvatar, SectionTitle, TagList } from "../components/site-components";
import { contact, doctors, getDoctor } from "../lib/site-data";

export const Route = createFileRoute("/doctors_/$slug")({
  loader: ({ params }) => {
    const doctor = getDoctor(params.slug);
    if (!doctor) throw notFound();
    return { name: doctor.name, role: doctor.role };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Doctor not found | Vikshana Eye Hospital" }, { name: "robots", content: "noindex" }] };
    const { name, role } = loaderData;
    return {
      meta: [
        { title: `${name} – ${role} | Vikshana Eye Hospital` },
        { name: "description", content: `${role} at Vikshana Eye Hospital, Yelahanka. Read the full profile and book an appointment.` },
        { property: "og:title", content: name },
        { property: "og:description", content: `${role} at Vikshana Eye Hospital.` },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: DoctorNotFound,
  component: DoctorDetail,
});

function DoctorNotFound() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h1 className="text-4xl text-brand-deep">Doctor not found</h1>
        <p className="mt-4 text-muted-foreground">The profile you are looking for is not available. Browse our doctors instead.</p>
        <Button asChild className="mt-8"><Link to="/doctors">View Our Doctors</Link></Button>
      </div>
    </section>
  );
}

function DoctorDetail() {
  const { slug } = Route.useParams();
  const doctor = getDoctor(slug)!;
  const others = doctors.filter((d) => d.slug !== doctor.slug);

  return (
    <>
      <section className="bg-brand-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <Link to="/doctors" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-warm"><ArrowLeft className="size-4" />Our Doctors</Link>
          <div className="mt-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <ProfileAvatar photo={doctor.photo} initials={doctor.initials} name={doctor.name} size="lg" />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-warm">{doctor.role}</p>
              <h1 className="mt-2 text-3xl leading-tight sm:text-5xl">{doctor.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 opacity-80 sm:text-base">{doctor.credentials.join(" · ")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[320px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Qualifications</h2>
              <ul className="mt-4 grid gap-2.5">
                {doctor.credentials.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm leading-6 text-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{c}</li>
                ))}
              </ul>
              <Button asChild size="lg" className="mt-6 w-full"><Link to="/contact" search={{ doctor: doctor.slug }}>Book Appointment</Link></Button>
              <Button asChild variant="outline" className="mt-3 w-full"><a href={`tel:${contact.phone1}`}><Phone />Call {contact.phone1}</a></Button>
            </div>
          </aside>

          <div className="grid gap-14">
            <div>
              <SectionTitle eyebrow="Areas of expertise" title="Expertise & Focus Areas" />
              <div className="mt-6"><TagList items={doctor.tags} /></div>
            </div>

            <div>
              <SectionTitle eyebrow="Clinical focus" title="Highlights" />
              <div className="mt-6"><HighlightList items={doctor.highlights} /></div>
            </div>

            <div>
              <SectionTitle eyebrow="Profile" title="About" />
              <div className="mt-6 grid gap-5">
                {doctor.bio.map((p, i) => <p key={i} className="leading-7 text-muted-foreground">{p}</p>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section className="section-pad bg-muted">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle eyebrow="Our doctors" title="Meet the rest of the team" />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {others.map((o) => <DoctorCard key={o.slug} doctor={o} />)}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
