import { useEffect, useRef, useState } from "react";
import { ImagePlus, Plus, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { CampaignCard, CampaignDetail, OfferSlide } from "./promotions";
import {
  PROMOTION_LIMITS,
  createPromotion,
  deletePromotion,
  formatDateRange,
  promotionStatus,
  todayIso,
  usePromotions,
  validateDetails,
  validateImageFile,
  type Promotion,
  type PromotionDetails,
  type PromotionKind,
  type PromotionStatus,
} from "../lib/promotions";

// Offers and campaigns use the same form; only the wording and colour differ so staff can
// tell the two tabs apart at a glance.
const KIND_CONFIG = {
  offers: {
    singular: "Offer",
    plural: "Offers",
    blurb:
      "Discounts and packages. Live offers appear in a sliding banner near the top of the home page.",
    accent: "border-l-primary bg-accent",
  },
  campaigns: {
    singular: "Campaign",
    plural: "Campaigns",
    blurb:
      "Eye-care camps and awareness drives. Live campaigns appear as cards in their own section of the home page.",
    accent: "border-l-brand-warm bg-brand-warm/15",
  },
} satisfies Record<
  PromotionKind,
  { singular: string; plural: string; blurb: string; accent: string }
>;

const STATUS_STYLES: Record<PromotionStatus, { label: string; className: string }> = {
  live: { label: "Live", className: "bg-accent text-primary" },
  scheduled: { label: "Scheduled", className: "bg-brand-warm/25 text-brand-deep" },
  expired: { label: "Expired", className: "bg-muted text-muted-foreground" },
};

export function PromotionsAdmin({ kind }: { kind: PromotionKind }) {
  const config = KIND_CONFIG[kind];
  const { promotions, loading, addLocal, removeLocal } = usePromotions(kind);
  const [mode, setMode] = useState<"list" | "form">("list");
  const [status, setStatus] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Promotion | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    setStatus(null);
    try {
      await deletePromotion(kind, pendingDelete);
      removeLocal(pendingDelete.id);
      setStatus({
        kind: "ok",
        text: `${config.singular} deleted. It has been removed from the website.`,
      });
    } catch {
      setStatus({
        kind: "error",
        text: `Couldn't delete the ${config.singular.toLowerCase()}. Please try again.`,
      });
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  }

  if (mode === "form") {
    return (
      <PromotionForm
        kind={kind}
        onCancel={() => setMode("list")}
        onPublished={(promotion) => {
          addLocal(promotion);
          setMode("list");
          const live = promotionStatus(promotion) === "live";
          setStatus({
            kind: "ok",
            text: live
              ? `${config.singular} published. It is now live on the website.`
              : `${config.singular} published. It will go live on the website on its start date.`,
          });
        }}
      />
    );
  }

  return (
    <div>
      <div className={`rounded-lg border-l-4 p-5 ${config.accent}`}>
        <h2 className="text-2xl font-bold text-brand-deep">{config.plural}</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          {config.blurb} Each one is shown between its start and end dates, then hidden
          automatically.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button
          size="lg"
          onClick={() => {
            setStatus(null);
            setMode("form");
          }}
        >
          <Plus className="size-4" />
          Add {config.singular}
        </Button>
        {status && (
          <p
            className={`text-sm ${status.kind === "error" ? "text-destructive" : "text-muted-foreground"}`}
            role="status"
          >
            {status.text}
          </p>
        )}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading {config.plural.toLowerCase()}…</p>
      ) : promotions.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
          No {config.plural.toLowerCase()} yet. The section is hidden on the website until you add
          one.
        </p>
      ) : (
        <ul className="mt-8 grid gap-4">
          {promotions.map((p) => {
            const st = STATUS_STYLES[promotionStatus(p)];
            const dates = formatDateRange(p);
            return (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-3 shadow-sm"
              >
                {p.images[0] && (
                  <img
                    src={p.images[0].url}
                    alt=""
                    loading="lazy"
                    className="size-20 shrink-0 rounded-md bg-muted object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-brand-deep">
                    {p.title || `Untitled ${config.singular.toLowerCase()}`}
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {dates ?? "No dates set (always shown)"}
                    {p.images.length > 1 ? ` · ${p.images.length} images` : ""}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${st.className}`}
                  >
                    {st.label}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setPendingDelete(p)}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open && !deleting) setPendingDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {config.singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              It will be removed from the website and its images permanently deleted. This can't be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Add form
// ---------------------------------------------------------------------------

type DraftImage = { file: File; url: string };

function PromotionForm({
  kind,
  onCancel,
  onPublished,
}: {
  kind: PromotionKind;
  onCancel: () => void;
  onPublished: (promotion: Promotion) => void;
}) {
  const config = KIND_CONFIG[kind];
  const fileInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<DraftImage[]>([]);
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(todayIso());
  const [endDate, setEndDate] = useState("");
  const [useTime, setUseTime] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [usePricing, setUsePricing] = useState(false);
  const [originalPrice, setOriginalPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [description, setDescription] = useState("");
  const [useCoupon, setUseCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [useWebsite, setUseWebsite] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [terms, setTerms] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [preview, setPreview] = useState<Promotion | null>(null);

  // Free the temporary preview URLs when the form closes.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => () => imagesRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const incoming = Array.from(list);
    const problem = incoming.map(validateImageFile).find(Boolean);
    if (problem) {
      setError(problem);
      return;
    }
    const room = PROMOTION_LIMITS.maxImages - images.length;
    setError(
      incoming.length > room ? `You can add up to ${PROMOTION_LIMITS.maxImages} images.` : null,
    );
    setImages((prev) => [
      ...prev,
      ...incoming.slice(0, room).map((file) => ({ file, url: URL.createObjectURL(file) })),
    ]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(images[index]!.url);
    setImages((prev) => prev.filter((_, n) => n !== index));
  }

  function makePrimary(index: number) {
    setImages((prev) => [prev[index]!, ...prev.filter((_, n) => n !== index)]);
  }

  function parsePrice(value: string): number | undefined {
    const n = Number(value);
    return value.trim() !== "" && Number.isFinite(n) && n >= 0 ? n : undefined;
  }

  function buildDetails(): PromotionDetails {
    return {
      title,
      startDate,
      endDate,
      startTime: useTime ? startTime : undefined,
      endTime: useTime ? endTime : undefined,
      originalPrice: usePricing ? parsePrice(originalPrice) : undefined,
      offerPrice: usePricing ? parsePrice(offerPrice) : undefined,
      description: description.trim(),
      couponCode: useCoupon ? couponCode.trim() : undefined,
      websiteUrl: useWebsite ? websiteUrl.trim() : undefined,
      terms: terms.trim(),
    };
  }

  function handlePreview() {
    const details = buildDetails();
    const problem = validateDetails(details, images.length);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setPreview({
      ...details,
      id: "preview",
      images: images.map((i) => ({ url: i.url, path: "" })),
    });
  }

  async function handlePublish() {
    const details = buildDetails();
    const problem = validateDetails(details, images.length);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setPublishing(true);
    try {
      onPublished(
        await createPromotion(
          kind,
          details,
          images.map((i) => i.file),
        ),
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Couldn't publish the ${config.singular.toLowerCase()}. Please try again.`,
      );
      setPublishing(false);
    }
  }

  const primary = images[0];

  return (
    <div className="mx-auto max-w-2xl">
      <div className={`rounded-lg border-l-4 p-5 ${config.accent}`}>
        <h2 className="text-2xl font-bold text-brand-deep">Add {config.singular}</h2>
      </div>

      <div className="mt-6 grid gap-6">
        {/* Images */}
        <section className="grid gap-3">
          <p className="text-sm font-semibold">
            Images{" "}
            <span className="font-normal text-muted-foreground">
              (up to {PROMOTION_LIMITS.maxImages}, first one is primary)
            </span>
          </p>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          {primary ? (
            <div className="relative grid h-64 place-items-center overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={primary.url}
                alt="Primary"
                className="max-h-full max-w-full object-contain"
              />
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-2 rounded-full"
                aria-label="Remove primary image"
                onClick={() => removeImage(0)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {images.map((img, n) => (
              <div key={img.url} className="relative">
                <button
                  type="button"
                  aria-label={n === 0 ? "Primary image" : `Make image ${n + 1} primary`}
                  onClick={() => makePrimary(n)}
                  className={`relative block size-20 overflow-hidden rounded-lg border-2 ${n === 0 ? "border-primary" : "border-border"}`}
                >
                  <img src={img.url} alt="" className="size-full object-cover" />
                  {n === 0 && (
                    <span className="absolute inset-x-0 bottom-0 bg-primary py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      Primary
                    </span>
                  )}
                </button>
                {n > 0 && (
                  <button
                    type="button"
                    aria-label={`Remove image ${n + 1}`}
                    onClick={() => removeImage(n)}
                    className="absolute -right-2 -top-2 grid size-5 place-items-center rounded-full bg-brand-deep text-primary-foreground shadow"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>
            ))}
            {images.length < PROMOTION_LIMITS.maxImages && (
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className={`grid place-items-center gap-1 rounded-lg border-2 border-dashed border-primary/50 text-primary hover:bg-accent ${images.length === 0 ? "h-40 w-full" : "size-20"}`}
              >
                <span className="grid place-items-center gap-1 text-xs font-semibold">
                  <ImagePlus className={images.length === 0 ? "size-8" : "size-6"} />
                  {images.length === 0 ? "Add images" : null}
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Title */}
        <label className="grid gap-1.5 text-sm font-semibold">
          {config.singular} Title
          <Input
            value={title}
            maxLength={PROMOTION_LIMITS.title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              kind === "offers" ? "e.g. Cataract surgery package" : "e.g. Free eye check-up camp"
            }
          />
        </label>

        {/* Duration */}
        <section className="grid gap-2">
          <p className="text-sm font-semibold">Set Duration</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm text-muted-foreground">
              Start Date
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </label>
            <label className="grid gap-1.5 text-sm text-muted-foreground">
              End Date
              <Input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
        </section>

        {/* Optional blocks */}
        <OptionalBlock label="Add Time" checked={useTime} onChange={setUseTime}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm text-muted-foreground">
              From
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label className="grid gap-1.5 text-sm text-muted-foreground">
              To
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>
          </div>
        </OptionalBlock>

        <OptionalBlock label="Add Pricing" checked={usePricing} onChange={setUsePricing}>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm text-muted-foreground">
              Original price (₹)
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm text-muted-foreground">
              {config.singular} price (₹)
              <Input
                type="number"
                inputMode="decimal"
                min={0}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
              />
            </label>
          </div>
        </OptionalBlock>

        {/* Description */}
        <div className="grid gap-1.5">
          <Textarea
            rows={5}
            value={description}
            maxLength={PROMOTION_LIMITS.description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`${config.singular} Description (Optional)`}
            aria-label={`${config.singular} description`}
          />
          <p className="text-right text-xs text-muted-foreground">
            {description.length}/{PROMOTION_LIMITS.description}
          </p>
        </div>

        <OptionalBlock
          label="Add Coupon / Voucher Code"
          checked={useCoupon}
          onChange={setUseCoupon}
        >
          <Input
            value={couponCode}
            maxLength={PROMOTION_LIMITS.couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="e.g. VIKSHANA20"
            aria-label="Coupon code"
          />
        </OptionalBlock>

        <OptionalBlock
          label={`Add Website Link to Redeem ${config.singular}`}
          checked={useWebsite}
          onChange={setUseWebsite}
        >
          <Input
            type="url"
            value={websiteUrl}
            maxLength={PROMOTION_LIMITS.websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            placeholder="https://"
            aria-label="Website link"
          />
        </OptionalBlock>

        {/* Terms */}
        <div className="grid gap-1.5">
          <Textarea
            rows={5}
            value={terms}
            maxLength={PROMOTION_LIMITS.terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="Terms and Conditions (Optional)"
            aria-label="Terms and conditions"
          />
          <p className="text-right text-xs text-muted-foreground">
            {terms.length}/{PROMOTION_LIMITS.terms}
          </p>
        </div>

        {error && (
          <p className="text-sm font-semibold text-destructive" role="alert">
            {error}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={handlePreview}
            disabled={publishing}
          >
            Preview
          </Button>
          <Button type="button" size="lg" onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish"}
          </Button>
        </div>
        <Button type="button" variant="ghost" onClick={onCancel} disabled={publishing}>
          Cancel
        </Button>
      </div>

      <Dialog open={preview !== null} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
            <DialogDescription>This is how it will look on the website.</DialogDescription>
          </DialogHeader>
          {preview &&
            (kind === "offers" ? (
              <OfferSlide promo={preview} />
            ) : (
              <div className="grid gap-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-sm">
                    <CampaignCard promo={preview} />
                  </div>
                </div>
                <p className="border-t border-border pt-4 text-sm font-semibold text-muted-foreground">
                  When a patient opens it:
                </p>
                <CampaignDetail promo={preview} />
              </div>
            ))}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function OptionalBlock({
  label,
  checked,
  onChange,
  children,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-3">
      <label className="flex cursor-pointer items-center gap-3 text-sm font-semibold">
        <Checkbox checked={checked} onCheckedChange={(v) => onChange(v === true)} />
        {label}
      </label>
      {checked && <div className="pl-7">{children}</div>}
    </div>
  );
}
