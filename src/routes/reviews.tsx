import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { Button } from "../components/ui/button";
import { CtaBand, PageHero, ReviewCard, SectionTitle, Stars } from "../components/site-components";
import { reviewLinks } from "../lib/site-data";
import { useGoogleReviews } from "../lib/use-google-reviews";
import reviewsImage from "../assets/reviews.jpg";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Patient Reviews | Vikshana Eye Hospital, Yelahanka, Bangalore" },
      { name: "description", content: "Read what patients say about eye care at Vikshana Eye Hospital in Yelahanka, Bangalore (Bengaluru), and share your own review on Google." },
      { name: "keywords", content: "Eye Hospital Bangalore, Eye Clinic, Eye Care Centre, Patient Reviews, Google Reviews" },
      { property: "og:title", content: "Patient Reviews | Vikshana Eye Hospital" },
      { property: "og:description", content: "Recent patient feedback from Google for Vikshana Eye Hospital, Yelahanka, Bangalore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/reviews" }],
  }),
  component: Reviews,
});

function Reviews() {
  const { reviews: allReviews, rating, userRatingCount, loading } = useGoogleReviews();
  const reviews = allReviews.filter((r) => r.source !== "Just Dial");
  const hasSummary = rating != null || reviews.length > 0;
  const average = rating ?? (reviews.length > 0 ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)) : 0);
  const reviewCount = userRatingCount ?? reviews.length;

  return (
    <>
      <PageHero eyebrow="Patient reviews" title="What our patients say" text="Feedback from patients who have visited Vikshana Eye Hospital in Yelahanka, collected from Google." />

      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid items-center gap-10 rounded-lg bg-brand-soft p-8 sm:p-10 lg:grid-cols-[1fr_1fr]">
            <div>
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading reviews…</p>
              ) : hasSummary ? (
                <>
                  <p className="text-6xl font-extrabold text-brand-deep">{average.toFixed(1)}</p>
                  <div className="mt-3"><Stars rating={Math.round(average)} /></div>
                  <p className="mt-3 text-sm text-muted-foreground">Based on {reviewCount} recent patient reviews published on Google.</p>
                </>
              ) : (
                <p className="text-lg font-semibold text-brand-deep">No reviews yet — be the first to share your experience.</p>
              )}
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg"><a href={reviewLinks.google} target="_blank" rel="noreferrer">Review us on Google <ExternalLink className="size-4" /></a></Button>
              </div>
            </div>
            <img src={reviewsImage} alt="Patients speaking with staff at an eye hospital reception" loading="lazy" width={1280} height={720} className="aspect-video w-full rounded-lg object-cover shadow-xl" />
          </div>

          <div className="mt-14">
            <SectionTitle eyebrow="Latest reviews" title="Recent patient feedback" />
            {loading ? (
              <p className="mt-10 text-sm text-muted-foreground">Loading reviews…</p>
            ) : reviews.length > 0 ? (
              <>
                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((r) => <ReviewCard key={r.name} {...r} />)}
                </div>
                <p className="mt-8 text-xs leading-6 text-muted-foreground">Reviews are published on Google by patients. To add yours, use the review button above—your review will appear there.</p>
              </>
            ) : (
              <div className="mt-10 rounded-lg border border-dashed border-border bg-muted p-10 text-center">
                <p className="font-semibold text-brand-deep">No reviews to show yet</p>
                <p className="mt-2 text-sm text-muted-foreground">Once patients leave reviews on Google, they'll appear here automatically.</p>
              </div>
            )}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
