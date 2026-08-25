import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { reviews as fallbackReviews } from "./site-data";

type SyncedReview = { name: string; source: string; rating: number; text: string };

type SyncedReviewsDoc = {
  reviews?: SyncedReview[];
  rating?: number;
  userRatingCount?: number;
};

export function useGoogleReviews() {
  const [reviews, setReviews] = useState<SyncedReview[]>(fallbackReviews);
  const [rating, setRating] = useState<number | null>(null);
  const [userRatingCount, setUserRatingCount] = useState<number | null>(null);

  useEffect(() => {
    const ref = doc(db, "reviewsSync", "vikshana");
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return;
        const data = snap.data() as SyncedReviewsDoc;
        if (Array.isArray(data.reviews) && data.reviews.length > 0) setReviews(data.reviews);
        if (typeof data.rating === "number") setRating(data.rating);
        if (typeof data.userRatingCount === "number") setUserRatingCount(data.userRatingCount);
      },
      (err) => console.error("Failed to load synced Google reviews", err),
    );
    return unsubscribe;
  }, []);

  return { reviews, rating, userRatingCount };
}
