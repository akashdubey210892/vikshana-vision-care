import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Compass, HandHeart, Sparkles, TrendingUp } from "lucide-react";
import { CtaBand, PageHero, SectionTitle } from "../components/site-components";
import foundation from "../assets/vikshana-foundation.jpg";

export const Route = createFileRoute("/about_/vikshana")({
  head: () => ({
    meta: [
      { title: "About Vikshana | Vikshana Eye Hospital" },
      { name: "description", content: "The story, values and journey behind Vikshana Eye Hospital's commitment to responsible, accessible eye care in Yelahanka, Bengaluru." },
      { property: "og:title", content: "About Vikshana" },
      { property: "og:description", content: "Our journey and commitment to responsible, accessible eye care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about/vikshana" }],
  }),
  component: AboutVikshana,
});

const journey = [
  { icon: Compass, title: "The Beginning", text: "Vikshana Eye Hospital was founded on a simple idea: that clear vision and honest, unhurried care should be within everyone's reach. That starting point still shapes how every consultation is run today." },
  { icon: HandHeart, title: "Building Trust", text: "Trust is earned one patient at a time—through careful listening, transparent explanations and never recommending a treatment before it is genuinely needed. This patient-first approach has guided our growth in Yelahanka and the wider community." },
  { icon: TrendingUp, title: "Growing Our Care", text: "As more families placed their trust in us, our focus widened from routine eye checks to comprehensive evaluation, specialised consultation and surgical care—always guided by the same ethical, patient-first principles." },
  { icon: Sparkles, title: "Looking Ahead", text: "Our journey continues. As Vikshana Eye Hospital grows, this page will expand with verified information on community programmes, eye camps and outreach activities as they are formally launched." },
] as const;

function AboutVikshana() {
  return (
    <>
      <PageHero eyebrow="About Vikshana" title="Our commitment to responsible, accessible eye care" text="Vikshana Eye Hospital's approach to care is built on ethical practice, accessibility and a commitment to the community we serve in Yelahanka, Bengaluru." />

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <img src={foundation} alt="Doctor speaking compassionately with a patient" className="aspect-[4/3] size-full rounded-lg object-cover shadow-xl lg:order-2" />
          <div>
            <SectionTitle eyebrow="Who we are" title="Care built on trust, not urgency" text="Vikshana Eye Hospital's approach to eye care is rooted in professional expertise, ethical practice and clear communication." />
            <p className="mt-5 leading-7 text-muted-foreground">Every recommendation we make is grounded in a genuine clinical need, explained in language patients can understand, so that the decision about their vision always remains theirs to make.</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Our story" title="The Vikshana Journey" text="From a simple founding idea to a growing community of patients—here is the journey that continues to shape our care." center />
          <div className="relative mt-14 grid gap-10 md:grid-cols-2">
            {journey.map(({ icon: Icon, title, text }, i) => (
              <article key={title} className="relative rounded-lg bg-background p-8 shadow-sm">
                <span className="absolute -top-6 left-8 grid size-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-md"><Icon className="size-5" /></span>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Stage {i + 1}</p>
                <h3 className="mt-2 text-xl font-bold text-brand-deep">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <SectionTitle title="Growing with verified information" text="This page will grow with verified information about future community programmes, eye camps, outreach activities and charitable work as they are formally launched. No unverified initiatives or statistics are presented here." center />
          <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary"><ArrowLeft className="size-4" />Back to About Us</Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
