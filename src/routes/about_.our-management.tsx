import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CtaBand, ManagementCard, PageHero, SectionTitle } from "../components/site-components";
import { management } from "../lib/site-data";

export const Route = createFileRoute("/about_/our-management")({
  head: () => ({
    meta: [
      { title: "Our Management | Vikshana Eye Hospital" },
      { name: "description", content: "Meet the leadership team of Vikshana Eye Hospital—CEO, Managing Director and Head of Department—guiding our clinical standards and patient care in Yelahanka." },
      { property: "og:title", content: "Our Management" },
      { property: "og:description", content: "Meet the leadership team guiding Vikshana Eye Hospital's patient care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about/our-management" }],
  }),
  component: OurManagement,
});

function OurManagement() {
  return (
    <>
      <PageHero eyebrow="Leadership" title="Our Management" text="The leadership behind Vikshana Eye Hospital sets the clinical standards, ethical practice and patient-first culture that guide every visit." />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Our team" title="Meet the leadership team" text="Experienced clinicians, healthcare administrators and operators guiding every part of Vikshana's patient care." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {management.map((profile) => <ManagementCard key={profile.slug} profile={profile} />)}
          </div>
          <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" />Back to About Us</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
