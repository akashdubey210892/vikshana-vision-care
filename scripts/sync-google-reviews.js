import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

const PLACE_ID = process.env.GOOGLE_PLACE_ID;
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!PLACE_ID || !API_KEY || !SERVICE_ACCOUNT_JSON) {
  console.error("Missing one of GOOGLE_PLACE_ID, GOOGLE_PLACES_API_KEY, FIREBASE_SERVICE_ACCOUNT env vars.");
  process.exit(1);
}

const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

const FIELD_MASK = "id,displayName,rating,userRatingCount,reviews";

async function fetchPlaceDetails() {
  const url = `https://places.googleapis.com/v1/places/${PLACE_ID}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Places API request failed (${res.status}): ${body}`);
  }

  return res.json();
}

function mapReview(review) {
  return {
    name: review.authorAttribution?.displayName ?? "Google user",
    source: "Google",
    rating: review.rating ?? 0,
    text: review.text?.text ?? review.originalText?.text ?? "",
    publishTime: review.publishTime ?? null,
  };
}

async function main() {
  const place = await fetchPlaceDetails();

  await db
    .collection("reviewsSync")
    .doc("vikshana")
    .set({
      placeId: PLACE_ID,
      displayName: place.displayName?.text ?? null,
      rating: place.rating ?? null,
      userRatingCount: place.userRatingCount ?? null,
      reviews: (place.reviews ?? []).map(mapReview),
      updatedAt: FieldValue.serverTimestamp(),
    });

  console.log(`Synced ${place.reviews?.length ?? 0} reviews for ${place.displayName?.text ?? PLACE_ID}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
