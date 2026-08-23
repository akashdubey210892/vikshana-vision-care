import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Checklist, CtaBand, SectionTitle } from "../components/site-components";
import { contact, getService, services } from "../lib/site-data";

export const Route = createFileRoute("/services_/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { name: service.name, seoTitle: service.seoTitle, seoDescription: service.seoDescription, keywords: service.keywords };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Service not found | Vikshana Eye Hospital" }, { name: "robots", content: "noindex" }] };
    const { name, seoTitle, seoDescription, keywords } = loaderData;
    return {
      meta: [
        { title: seoTitle },
        { name: "description", content: seoDescription },
        { name: "keywords", content: keywords.join(", ") },
        { property: "og:title", content: `${name} | Vikshana Eye Hospital` },
        { property: "og:description", content: seoDescription },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetail,
});

function ServiceNotFound() {
  return <section className="section-pad"><div className="mx-auto max-w-3xl px-4 text-center sm:px-6"><h1 className="text-4xl text-brand-deep">Service not found</h1><p className="mt-4 text-muted-foreground">The page you are looking for is not available. Browse all our eye-care services instead.</p><Button asChild className="mt-8"><Link to="/services">View All Services</Link></Button></div></section>;
}

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = getService(slug)!;
  const others = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const Icon = service.icon;
  return (
    <>
      <section className="bg-brand-deep text-primary-foreground">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2">
          <div>
            <Link to="/services" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-warm"><ArrowLeft className="size-4"/>All services</Link>
            <h1 className="mt-5 text-4xl leading-tight sm:text-5xl">{service.name}</h1>
            <p className="mt-5 max-w-xl leading-8 opacity-85">{service.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="hero"><a href={`tel:${contact.phone1}`}><Phone/>Call {contact.phone1}, {contact.phone2}</a></Button>
              <Button asChild size="lg" variant="secondary"><Link to="/contact">Contact Us</Link></Button>
            </div>
          </div>
          <img src={service.image} alt={service.alt} width={1280} height={960} className="aspect-[4/3] w-full rounded-lg object-cover shadow-2xl"/>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <span className="grid size-14 place-items-center rounded-md bg-accent text-primary"><Icon/></span>
            <SectionTitle eyebrow="What this includes" title={`Our approach to ${service.name.toLowerCase()}`}/>
            <Checklist items={service.points}/>
          </div>
          <div className="rounded-lg bg-brand-soft p-8">
            <h2 className="text-2xl font-bold text-brand-deep">What to expect at your visit</h2>
            <Checklist items={service.expect}/>
            <p className="mt-6 text-xs leading-6 text-muted-foreground">This information is for general guidance only and is not medical advice. Care is always planned after an in-person clinical evaluation.</p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle eyebrow="Related care" title="Other services you may need"/>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {others.map((s) => (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} className="group overflow-hidden rounded-lg border border-border bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <img src={s.image} alt={s.alt} loading="lazy" width={1280} height={960} className="aspect-[16/10] w-full object-cover"/>
                <div className="p-6">
                  <h3 className="font-bold text-brand-deep">{s.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">Learn More <ArrowRight className="size-4 transition-transform group-hover:translate-x-1"/></span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <CtaBand/>
    </>
  );
}
