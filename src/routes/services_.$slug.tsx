import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Phone } from "lucide-react";
import { Button } from "../components/ui/button";
import { Checklist, CtaBand, SectionTitle } from "../components/site-components";
import { contact, getService, services } from "../lib/site-data";

const cataractFaqs = [
  { question: "What is cataract surgery?", answer: "Cataract surgery removes the eye's cloudy natural lens and replaces it with an intraocular lens (IOL). Your ophthalmologist recommends the timing and lens option after examining your eyes and discussing how cataracts affect your daily activities." },
  { question: "When is cataract surgery recommended?", answer: "Cataract surgery is generally considered when a cataract causes vision problems that interfere with daily activities such as reading, driving or recognising faces. The decision is individual and should follow a clinical eye examination." },
  { question: "How is cataract surgery performed?", answer: "Modern cataract surgery commonly uses phacoemulsification, a small-incision technique that removes the cloudy lens before an intraocular lens is placed. The exact procedure and anaesthesia are decided by the ophthalmologist based on the patient's eye health." },
  { question: "How do I find cataract surgery near me in Yelahanka?", answer: "Vikshana Eye Hospital provides cataract evaluation and surgical consultation in Yelahanka, Bengaluru. Patients can contact the hospital to discuss an appointment and whether cataract surgery is appropriate for their eyes." },
  { question: "What happens before cataract surgery?", answer: "The pre-operative assessment may include vision testing, eye examination and measurements such as biometry to help determine the appropriate intraocular lens. Your ophthalmologist will also discuss medical history, medicines, risks, benefits and aftercare." },
];

const seoKeywordBoosts: Record<string, string[]> = {
  "ocular-surface-procedures": ["Dry Eye Treatment Near Me", "Dry Eye Specialist Near Me", "Dry Eye Clinic Near Me", "Dry Eyes Treatment", "Watery Eyes Treatment", "Eye Irritation Treatment", "Blepharitis Treatment"],
  "foreign-body-removal": ["Eye Foreign Body Removal Near Me", "Foreign Object in Eye", "Emergency Eye Care Near Me", "Eye Injury Treatment Near Me", "Dust in Eye Removal", "Metal in Eye Removal"],
  "cataract-evaluation": ["Cataract Checkup Near Me", "Cataract Evaluation Near Me", "Cataract Specialist Near Me", "Cataract Doctor Near Me", "Cataract Consultation Near Me", "Cataract Screening"],
  "pediatric-ophthalmology": ["Children's Eye Doctor Near Me", "Pediatric Eye Specialist Near Me", "Kids Eye Doctor Near Me", "Children's Eye Checkup Near Me", "Child Eye Specialist", "Lazy Eye Treatment", "Squint in Children"],
  "anterior-segment-evaluation": ["Cornea Specialist Near Me", "Cornea Doctor Near Me", "Corneal Examination Near Me", "Corneal Disease Specialist", "Anterior Eye Examination", "Pterygium Evaluation", "Keratoconus Evaluation"],
  "posterior-segment-evaluation": ["Retina Specialist Near Me", "Retina Doctor Near Me", "Retina Hospital Near Me", "Diabetic Eye Checkup Near Me", "Diabetic Retinopathy Screening", "Fundus Examination Near Me", "Retinal Disease Specialist"],
  "refraction": ["Eye Test Near Me", "Eye Checkup Near Me", "Eye Power Check Near Me", "Eye Power Test", "Vision Test Near Me", "Glasses Prescription", "Spectacle Power Check", "Optometrist Near Me"],
  "cataract-surgery": ["Cataract Surgery Near Me", "Cataract Operation Near Me", "Cataract Treatment Near Me", "Cataract Surgeon Near Me", "Cataract Hospital Near Me", "Eye Hospital for Cataract"],
  "squint-evaluation": ["Squint Specialist Near Me", "Squint Treatment Near Me", "Squint Eye Doctor", "Strabismus Specialist", "Squint Treatment for Children"],
  "red-eye": ["Red Eye Treatment Near Me", "Redness in Eye Treatment", "Eye Allergy Treatment Near Me", "Eye Infection Checkup", "Red Eye Specialist"],
  "dry-eye": ["Dry Eye Treatment Near Me", "Dry Eye Specialist Near Me", "Dry Eye Doctor Near Me", "Dry Eye Clinic", "Burning Eyes Treatment", "Watery Eyes Treatment"],
  "eye-pressure-check": ["Eye Pressure Test Near Me", "Eye Pressure Check Near Me", "Glaucoma Screening Near Me", "Glaucoma Test Near Me", "Glaucoma Specialist Near Me", "Glaucoma Doctor Near Me"],
};

export const Route = createFileRoute("/services_/$slug")({
  loader: ({ params }) => {
    const service = getService(params.slug);
    if (!service) throw notFound();
    return { slug: service.slug, name: service.name, seoTitle: service.seoTitle, seoDescription: service.seoDescription, keywords: service.keywords };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Service not found | Vikshana Eye Hospital" }, { name: "robots", content: "noindex" }] };
    const { slug, name, seoTitle, seoDescription, keywords } = loaderData;
    const isCataract = name === "Cataract Surgery";
    const expandedKeywords = Array.from(new Set([...keywords, ...(seoKeywordBoosts[slug] ?? []), "Vikshana Eye Hospital", "Yelahanka Eye Hospital", "Eye Hospital Yelahanka", "Eye Hospital Bengaluru"]));
    const canonical = `https://www.vikshanaeyehospital.com/services/${slug}`;
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "MedicalProcedure",
      name,
      description: seoDescription,
      url: canonical,
      bodyLocation: "Eye",
      provider: {
        "@type": "MedicalClinic",
        name: "Vikshana Eye Hospital",
        telephone: contact.phone1,
        areaServed: ["Yelahanka", "Bengaluru", "Karnataka"],
        address: { "@type": "PostalAddress", streetAddress: "#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road", addressLocality: "Yelahanka", addressRegion: "Karnataka", postalCode: "560064", addressCountry: "IN" },
      },
    };
    const faqSchema = isCataract ? {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: cataractFaqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
    } : null;
    return {
      meta: [
        { title: seoTitle },
        { name: "description", content: seoDescription },
        { name: "keywords", content: expandedKeywords.join(", ") },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: `${name} | Vikshana Eye Hospital` },
        { property: "og:description", content: seoDescription },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(serviceSchema) },
        ...(faqSchema ? [{ type: "application/ld+json", children: JSON.stringify(faqSchema) }] : []),
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

      {slug === "cataract-surgery" && (
        <section className="section-pad bg-background">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <SectionTitle eyebrow="Cataract care questions" title="Cataract Surgery: Common Questions" text="Straightforward answers to common questions patients ask before a cataract consultation." />
            <div className="mt-10 space-y-4">
              {cataractFaqs.map((faq) => (
                <details key={faq.question} className="rounded-lg border border-border bg-muted/40 p-5">
                  <summary className="cursor-pointer font-bold text-brand-deep">{faq.question}</summary>
                  <p className="mt-3 leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
            <p className="mt-6 text-xs leading-6 text-muted-foreground">Information on this page is for general education and does not replace an examination or personalised advice from an ophthalmologist.</p>
          </div>
        </section>
      )}
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
