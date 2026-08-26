import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

type SyncedReview = { name: string; source: string; rating: number; text: string };

type SyncedReviewsDoc = {
  reviews?: SyncedReview[];
  rating?: number;
  userRatingCount?: number;
};

export function useGoogleReviews() {
  const [reviews, setReviews] = useState<SyncedReview[]>([]);
  const [rating, setRating] = useState<number | null>(null);
  const [userRatingCount, setUserRatingCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, "reviewsSync", "vikshana");
    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as SyncedReviewsDoc;
          setReviews(Array.isArray(data.reviews) ? data.reviews : []);
          setRating(typeof data.rating === "number" ? data.rating : null);
          setUserRatingCount(typeof data.userRatingCount === "number" ? data.userRatingCount : null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("Failed to load synced Google reviews", err);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  return { reviews, rating, userRatingCount, loading };
}
