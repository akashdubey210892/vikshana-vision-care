import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { CtaBand, HighlightList, ManagementCard, ProfileAvatar, SectionTitle, TagList } from "../components/site-components";
import { contact, getManagementProfile, management } from "../lib/site-data";

export const Route = createFileRoute("/about_/our-management_/$slug")({
  loader: ({ params }) => {
    const profile = getManagementProfile(params.slug);
    if (!profile) throw notFound();
    return { name: profile.name, role: profile.role, org: profile.org };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Profile not found | Vikshana Eye Hospital" }, { name: "robots", content: "noindex" }] };
    const { name, role, org } = loaderData;
    return {
      meta: [
        { title: `${name} – ${role} | Vikshana Eye Hospital` },
        { name: "description", content: `${role} at ${org}. Read the full profile, expertise and career highlights.` },
        { property: "og:title", content: name },
        { property: "og:description", content: `${role} at ${org}.` },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProfileNotFound,
  component: ProfileDetail,
});

function ProfileNotFound() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h1 className="text-4xl text-brand-deep">Profile not found</h1>
        <p className="mt-4 text-muted-foreground">The profile you are looking for is not available. Browse our leadership team instead.</p>
        <Button asChild className="mt-8"><Link to="/about/our-management">View Our Management</Link></Button>
      </div>
    </section>
  );
}

function ProfileDetail() {
  const { slug } = Route.useParams();
  const profile = getManagementProfile(slug)!;
  const others = management.filter((m) => m.slug !== profile.slug);

  return (
    <>
      <section className="bg-brand-deep text-primary-foreground">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
          <Link to="/about/our-management" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-warm"><ArrowLeft className="size-4" />Our Management</Link>
          <div className="mt-8 flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <ProfileAvatar photo={profile.photo} initials={profile.initials} name={profile.name} size="lg" />
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-brand-warm">{profile.role}</p>
              <h1 className="mt-2 text-3xl leading-tight sm:text-5xl">{profile.name}</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 opacity-80 sm:text-base">{profile.org}</p>
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
                {profile.credentials.map((c) => (
                  <li key={c} className="flex gap-2.5 text-sm leading-6 text-foreground"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{c}</li>
                ))}
              </ul>
              <Button asChild className="mt-6 w-full"><a href={`tel:${contact.phone1}`}><Phone />Call {contact.phone1}, {contact.phone2}</a></Button>
              <Button asChild variant="outline" className="mt-3 w-full"><Link to="/contact">Contact Us</Link></Button>
            </div>
          </aside>

          <div className="grid gap-14">
            <div>
              <SectionTitle eyebrow="Areas of expertise" title="Expertise & Focus Areas" />
              <div className="mt-6"><TagList items={profile.tags} /></div>
            </div>

            <div>
              <SectionTitle eyebrow="Career highlights" title="Key Achievements" />
              <div className="mt-6"><HighlightList items={profile.highlights} /></div>
            </div>

            <div>
              <SectionTitle eyebrow="Profile" title="About" />
              <div className="mt-6 grid gap-5">
                {profile.bio.map((p, i) => <p key={i} className="leading-7 text-muted-foreground">{p}</p>)}
              </div>
              {profile.closing && (
                <blockquote className="mt-6 rounded-lg border-l-4 border-primary bg-brand-soft p-6 text-lg font-medium italic leading-8 text-brand-deep">“{profile.closing}”</blockquote>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Leadership" title="Meet the rest of the team" />
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {others.map((o) => <ManagementCard key={o.slug} profile={o} />)}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
