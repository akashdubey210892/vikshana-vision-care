import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock, ExternalLink, Ticket } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { SectionTitle } from "./site-components";
import {
  formatDateRange,
  formatPrice,
  formatTime,
  useLivePromotions,
  type Promotion,
} from "../lib/promotions";

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

function Gallery({ images, alt }: { images: Promotion["images"]; alt: string }) {
  const [selected, setSelected] = useState(0);
  const current = images[Math.min(selected, images.length - 1)];
  if (!current) return null;

  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <img
        src={current.url}
        alt={alt}
        className="max-h-[70vh] w-auto max-w-full rounded-lg border border-border bg-card object-contain shadow-sm md:max-h-[520px]"
      />
      {images.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2">
          {images.map((img, n) => (
            <button
              key={img.url}
              type="button"
              aria-label={`Show image ${n + 1}`}
              onClick={() => setSelected(n)}
              className={`size-14 overflow-hidden rounded-md border-2 transition ${n === selected ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={img.url} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PromotionInfo({
  promo,
  cta,
  showTitle = true,
}: {
  promo: Promotion;
  cta: string;
  showTitle?: boolean;
}) {
  const dates = formatDateRange(promo);
  const time =
    promo.startTime && promo.endTime
      ? `${formatTime(promo.startTime)} – ${formatTime(promo.endTime)}`
      : promo.startTime
        ? `From ${formatTime(promo.startTime)}`
        : null;
  const { originalPrice, offerPrice } = promo;
  const percentOff =
    originalPrice && offerPrice !== undefined && offerPrice < originalPrice
      ? Math.round((1 - offerPrice / originalPrice) * 100)
      : null;

  return (
    <div className="min-w-0 space-y-4">
      {showTitle && (
        <h3 className="text-2xl font-bold text-brand-deep sm:text-3xl">{promo.title}</h3>
      )}

      {(dates || time) && (
        <div className="space-y-1.5 text-sm font-semibold text-muted-foreground">
          {dates && (
            <p className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              {dates}
            </p>
          )}
          {time && (
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-primary" />
              {time}
            </p>
          )}
        </div>
      )}

      {(offerPrice !== undefined || originalPrice !== undefined) && (
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {offerPrice !== undefined && (
            <span className="text-3xl font-bold text-primary">{formatPrice(offerPrice)}</span>
          )}
          {originalPrice !== undefined && (
            <span
              className={
                offerPrice !== undefined
                  ? "text-base text-muted-foreground line-through"
                  : "text-3xl font-bold text-primary"
              }
            >
              {formatPrice(originalPrice)}
            </span>
          )}
          {percentOff ? (
            <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-primary">
              {percentOff}% off
            </span>
          ) : null}
        </p>
      )}

      {promo.description && (
        <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">
          {promo.description}
        </p>
      )}

      {promo.couponCode && (
        <p className="inline-flex items-center gap-2 rounded-md border border-dashed border-primary bg-accent px-3 py-2 text-sm font-semibold text-brand-deep">
          <Ticket className="size-4 text-primary" />
          Use code <strong className="tracking-widest">{promo.couponCode}</strong>
        </p>
      )}

      {promo.websiteUrl && (
        <div>
          <Button asChild>
            <a href={promo.websiteUrl} target="_blank" rel="noopener noreferrer">
              {cta}
              <ExternalLink className="size-4" />
            </a>
          </Button>
        </div>
      )}

      {promo.terms && (
        <details className="group text-sm">
          <summary className="cursor-pointer font-semibold text-primary">
            Terms and conditions
          </summary>
          <p className="mt-2 whitespace-pre-line leading-6 text-muted-foreground">{promo.terms}</p>
        </details>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Offers: a rotating banner slider on a tinted background
// ---------------------------------------------------------------------------

export function OfferSlide({ promo }: { promo: Promotion }) {
  const first = promo.images[0];
  if (!first) return null;

  // Offers uploaded before details existed are just a picture: show it in a framed banner.
  if (!promo.title) {
    return (
      <div className="relative flex w-full justify-center overflow-hidden rounded-lg border border-border bg-card shadow-sm md:max-w-2xl">
        <img
          src={first.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full scale-125 object-cover opacity-60 blur-2xl"
        />
        <img
          src={first.url}
          alt="Vikshana Eye Hospital offer"
          className="relative max-h-[70vh] w-auto max-w-full object-contain md:max-h-[520px]"
        />
      </div>
    );
  }

  return (
    <div className="grid w-full items-center gap-6 md:grid-cols-[minmax(0,520px)_1fr] md:gap-10 lg:mx-auto lg:max-w-5xl">
      <Gallery images={promo.images} alt={promo.title} />
      <PromotionInfo promo={promo} cta="Redeem offer" />
    </div>
  );
}

export function OffersSection() {
  const { promotions: offers, loading } = useLivePromotions("offers");
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = offers.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = setInterval(() => setI((x) => (x + 1) % count), 6000);
    return () => clearInterval(id);
  }, [count, paused]);

  if (loading || count === 0) return null;
  const current = i % count;

  return (
    <section className="section-pad bg-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle eyebrow="Offers" title="Current offers at Vikshana" center />
        <div
          className="relative mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex items-start transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {offers.map((o) => (
                <div key={o.id} className="flex w-full shrink-0 justify-center">
                  <OfferSlide promo={o} />
                </div>
              ))}
            </div>
          </div>
          {count > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                aria-label="Previous offer"
                onClick={() => setI((current - 1 + count) % count)}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
                aria-label="Next offer"
                onClick={() => setI((current + 1) % count)}
              >
                <ChevronRight />
              </Button>
              <div className="mt-5 flex justify-center gap-2">
                {offers.map((o, n) => (
                  <button
                    key={o.id}
                    aria-label={`Show offer ${n + 1}`}
                    onClick={() => setI(n)}
                    className={`h-1.5 rounded-full transition-all ${n === current ? "w-8 bg-primary" : "w-2 bg-primary/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Campaigns: cards on a white background, details open in a dialog
// ---------------------------------------------------------------------------

export function CampaignCard({ promo, onOpen }: { promo: Promotion; onOpen?: () => void }) {
  const cover = promo.images[0];
  const dates = formatDateRange(promo);

  return (
    <article className="flex w-full flex-col overflow-hidden rounded-lg border border-border border-t-4 border-t-brand-warm bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:basis-[calc(50%-0.75rem)] lg:basis-[calc(33.333%-1rem)]">
      <div className="relative">
        {cover && (
          <img src={cover.url} alt={promo.title} className="aspect-[16/10] w-full object-cover" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-brand-warm px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-deep shadow">
          Campaign
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-brand-deep">{promo.title}</h3>
        {dates && (
          <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <CalendarDays className="size-4 shrink-0 text-brand-warm" />
            {dates}
          </p>
        )}
        {promo.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {promo.description}
          </p>
        )}
        <Button variant="soft" className="mt-6 w-full" onClick={onOpen}>
          View details
        </Button>
      </div>
    </article>
  );
}

export function CampaignDetail({ promo }: { promo: Promotion }) {
  return (
    <div className="grid gap-6">
      <Gallery images={promo.images} alt={promo.title} />
      <PromotionInfo promo={promo} cta="Learn more" showTitle={false} />
    </div>
  );
}

export function CampaignsSection() {
  const { promotions: campaigns, loading } = useLivePromotions("campaigns");
  const [openId, setOpenId] = useState<string | null>(null);

  if (loading || campaigns.length === 0) return null;
  const open = campaigns.find((c) => c.id === openId) ?? null;

  return (
    <section className="section-pad bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle
          eyebrow="Campaigns"
          title="Camps and campaigns"
          text="Community eye-care camps and awareness drives from Vikshana Eye Hospital."
          center
        />
        <div className="mt-10 flex flex-wrap justify-center gap-6">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} promo={c} onOpen={() => setOpenId(c.id)} />
          ))}
        </div>
      </div>

      <Dialog open={open !== null} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl text-brand-deep">{open.title}</DialogTitle>
                <DialogDescription className="sr-only">Campaign details</DialogDescription>
              </DialogHeader>
              <CampaignDetail promo={open} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
