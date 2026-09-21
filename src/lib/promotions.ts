import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "./firebase";

// Offers and campaigns share one shape and one code path. `kind` is also the Firestore
// collection name and the Storage folder.
export type PromotionKind = "offers" | "campaigns";

export type PromotionImage = { url: string; path: string };

export type PromotionDetails = {
  title: string;
  startDate?: string | undefined; // YYYY-MM-DD
  endDate?: string | undefined; // YYYY-MM-DD
  startTime?: string | undefined; // HH:mm
  endTime?: string | undefined; // HH:mm
  originalPrice?: number | undefined;
  offerPrice?: number | undefined;
  description?: string | undefined;
  couponCode?: string | undefined;
  websiteUrl?: string | undefined;
  terms?: string | undefined;
};

// The first image is the primary one.
export type Promotion = PromotionDetails & { id: string; images: PromotionImage[] };

export type PromotionStatus = "live" | "scheduled" | "expired";

export const PROMOTION_LIMITS = {
  maxImages: 5,
  title: 120,
  description: 1000,
  terms: 5000,
  couponCode: 40,
  websiteUrl: 500,
  sourceBytes: 10 * 1024 * 1024,
};

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 0.8;

export function todayIso(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

export function promotionStatus(p: Promotion, today = todayIso()): PromotionStatus {
  if (p.startDate && today < p.startDate) return "scheduled";
  if (p.endDate && today > p.endDate) return "expired";
  return "live";
}

// Documents created before offers had details only carry `imageUrl` and `storagePath`.
function fromDoc(id: string, data: Record<string, unknown>): Promotion {
  const images = Array.isArray(data["images"])
    ? (data["images"] as PromotionImage[])
    : typeof data["imageUrl"] === "string"
      ? [{ url: data["imageUrl"], path: String(data["storagePath"] ?? "") }]
      : [];
  return { ...(data as Partial<PromotionDetails>), title: String(data["title"] ?? ""), id, images };
}

export function usePromotions(kind: PromotionKind) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, kind), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setPromotions(snap.docs.map((d) => fromDoc(d.id, d.data())));
        setLoading(false);
      },
      (err) => {
        console.error(`Failed to load ${kind}`, err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [kind]);

  // The live listener keeps the list in sync, but the admin page also applies each change
  // locally as soon as the write succeeds so it never waits on the listener to reflect it.
  const addLocal = useCallback((promotion: Promotion) => {
    setPromotions((prev) =>
      prev.some((p) => p.id === promotion.id) ? prev : [promotion, ...prev],
    );
  }, []);
  const removeLocal = useCallback((id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { promotions, loading, addLocal, removeLocal };
}

// What patients see: only promotions whose dates include today.
export function useLivePromotions(kind: PromotionKind) {
  const { promotions, loading } = usePromotions(kind);
  const today = todayIso();
  return { promotions: promotions.filter((p) => promotionStatus(p, today) === "live"), loading };
}

// Downscale and re-encode as WebP so a phone photo doesn't end up as a multi-MB banner.
async function compressToWebp(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY),
  );
  if (!blob) throw new Error("Couldn't process this image. Try a JPG or PNG.");
  return blob;
}

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith("image/")) return "Please choose image files only (JPG, PNG or WebP).";
  if (file.size > PROMOTION_LIMITS.sourceBytes)
    return "One of the images is too large. Please choose images under 10 MB.";
  return null;
}

export function validateDetails(d: PromotionDetails, imageCount: number): string | null {
  if (imageCount < 1) return "Please add at least one image.";
  if (!d.title.trim()) return "Please enter a title.";
  if (!d.startDate || !d.endDate) return "Please set a start date and an end date.";
  if (d.endDate < d.startDate) return "The end date can't be before the start date.";
  if (d.startTime && d.endTime && d.endTime <= d.startTime)
    return "The end time must be after the start time.";
  if (d.websiteUrl && !/^https?:\/\/\S+$/i.test(d.websiteUrl))
    return "The website link must start with http:// or https://";
  if (d.originalPrice !== undefined && d.offerPrice !== undefined && d.offerPrice > d.originalPrice)
    return "The offer price can't be higher than the original price.";
  return null;
}

// Firestore rejects `undefined`, and empty optional fields shouldn't be stored at all.
function compact<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== ""),
  ) as Partial<T>;
}

export async function createPromotion(
  kind: PromotionKind,
  details: PromotionDetails,
  files: File[],
): Promise<Promotion> {
  const problem = validateDetails(details, files.length);
  if (problem) throw new Error(problem);

  const uploaded: PromotionImage[] = [];
  try {
    for (const file of files) {
      const blob = await compressToWebp(file);
      const path = `${kind}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
      const fileRef = ref(storage, path);
      await uploadBytes(fileRef, blob, { contentType: "image/webp" });
      uploaded.push({ url: await getDownloadURL(fileRef), path });
    }

    const data = compact({ ...details, title: details.title.trim() });
    const docRef = await addDoc(collection(db, kind), {
      ...data,
      images: uploaded,
      createdAt: serverTimestamp(),
    });
    return { ...(data as PromotionDetails), id: docRef.id, images: uploaded };
  } catch (err) {
    // Don't leave orphaned files in Storage if anything above failed.
    await Promise.all(uploaded.map((img) => deleteObject(ref(storage, img.path)).catch(() => {})));
    throw err;
  }
}

export async function deletePromotion(kind: PromotionKind, promotion: Promotion): Promise<void> {
  // Remove the Firestore doc first so it disappears from the site immediately.
  await deleteDoc(doc(db, kind, promotion.id));
  await Promise.all(
    promotion.images
      .filter((img) => img.path)
      .map((img) =>
        deleteObject(ref(storage, img.path)).catch((err) => {
          if (err?.code !== "storage/object-not-found")
            console.error("Failed to delete image from Storage", err);
        }),
      ),
  );
}

// ---- Display helpers shared by the site and the admin preview ----

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTime(hhmm: string): string {
  const [h = 0, m = 0] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDateRange(p: Pick<PromotionDetails, "startDate" | "endDate">): string | null {
  if (p.startDate && p.endDate)
    return p.startDate === p.endDate
      ? formatDate(p.startDate)
      : `${formatDate(p.startDate)} – ${formatDate(p.endDate)}`;
  if (p.endDate) return `Until ${formatDate(p.endDate)}`;
  return null;
}
