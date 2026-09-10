const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const { initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
const nodemailer = require("nodemailer");

if (!getApps().length) {
  initializeApp();
}

const SMTP_HOST = defineSecret("SMTP_HOST");
const SMTP_PORT = defineSecret("SMTP_PORT");
const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");
const MAIL_FROM = defineSecret("MAIL_FROM");

const GOOGLE_PLACE_ID = defineSecret("GOOGLE_PLACE_ID");
const GOOGLE_PLACES_API_KEY = defineSecret("GOOGLE_PLACES_API_KEY");

// Kept in sync with the doctors list in src/lib/site-data.ts.
const DOCTOR_NAMES = {
  "pawan-g-kumar": "Dr (Wg Cdr) Professor Pawan G Kumar",
  "mounika-reddy-polu": "Dr Mounika Reddy Polu",
  "shwetha-r": "Shwetha R",
};

function doctorLabel(doctorKey) {
  if (doctorKey === "any") return "Any Available Doctor";
  return DOCTOR_NAMES[doctorKey] ?? doctorKey;
}

function formatTimeLabel(time) {
  const [hStr, mStr] = time.split(":");
  const h = Number(hStr);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${mStr} ${period}`;
}

function formatDateLabel(dateIso) {
  return new Date(`${dateIso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

const CLINIC_SIGNATURE = "Vikshana Eye Hospital\n#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064";
const CLINIC_SIGNATURE_HTML = "<p>Vikshana Eye Hospital<br>#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064</p>";

function buildEmail(job) {
  const doctor = doctorLabel(job.doctor);

  if (job.type === "cancelled") {
    const dateLabel = formatDateLabel(job.date);
    const timeLabel = formatTimeLabel(job.time);
    return {
      subject: "Your appointment at Vikshana Eye Hospital has been cancelled",
      text: `Hi ${job.name},\n\nYour appointment on ${dateLabel} at ${timeLabel} with ${doctor} has been cancelled.\n\nIf this wasn't expected or you'd like to book another time, please call us.\n\n${CLINIC_SIGNATURE}`,
      html: `<p>Hi ${job.name},</p><p>Your appointment on <strong>${dateLabel}</strong> at <strong>${timeLabel}</strong> with ${doctor} has been cancelled.</p><p>If this wasn't expected or you'd like to book another time, please call us.</p>${CLINIC_SIGNATURE_HTML}`,
    };
  }

  if (job.type === "rescheduled") {
    const oldDateLabel = formatDateLabel(job.oldDate);
    const oldTimeLabel = formatTimeLabel(job.oldTime);
    const newDateLabel = formatDateLabel(job.date);
    const newTimeLabel = formatTimeLabel(job.time);
    return {
      subject: "Your appointment at Vikshana Eye Hospital has been rescheduled",
      text: `Hi ${job.name},\n\nYour appointment with ${doctor} has been rescheduled:\n\nFrom: ${oldDateLabel} at ${oldTimeLabel}\nTo: ${newDateLabel} at ${newTimeLabel}\n\nIf this doesn't work for you, please call us.\n\n${CLINIC_SIGNATURE}`,
      html: `<p>Hi ${job.name},</p><p>Your appointment with ${doctor} has been rescheduled:</p><ul><li><strong>From:</strong> ${oldDateLabel} at ${oldTimeLabel}</li><li><strong>To:</strong> ${newDateLabel} at ${newTimeLabel}</li></ul><p>If this doesn't work for you, please call us.</p>${CLINIC_SIGNATURE_HTML}`,
    };
  }

  // "confirmation" (default/legacy)
  const dateLabel = formatDateLabel(job.date);
  const timeLabel = formatTimeLabel(job.time);
  return {
    subject: "Your appointment at Vikshana Eye Hospital is confirmed",
    text: `Hi ${job.name},\n\nYour appointment is confirmed:\n\nDoctor: ${doctor}\nDate: ${dateLabel}\nTime: ${timeLabel}\nReason for visit: ${job.service}\n\n${CLINIC_SIGNATURE}\n\nIf you need to reschedule or cancel, please call us.`,
    html: `<p>Hi ${job.name},</p><p>Your appointment is confirmed:</p><ul><li><strong>Doctor:</strong> ${doctor}</li><li><strong>Date:</strong> ${dateLabel}</li><li><strong>Time:</strong> ${timeLabel}</li><li><strong>Reason for visit:</strong> ${job.service}</li></ul>${CLINIC_SIGNATURE_HTML}<p>If you need to reschedule or cancel, please call us.</p>`,
  };
}

exports.sendAppointmentEmail = onDocumentCreated(
  {
    document: "appointmentEmails/{emailId}",
    secrets: [SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM],
    retry: true,
  },
  async (event) => {
    const job = event.data.data();
    const ref = event.data.ref;

    if (!job.to) {
      await ref.delete();
      return;
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST.value(),
      port: Number(SMTP_PORT.value()),
      secure: Number(SMTP_PORT.value()) === 465,
      auth: { user: SMTP_USER.value(), pass: SMTP_PASS.value() },
    });

    const { subject, text, html } = buildEmail(job);
    const mailFrom = MAIL_FROM.value() || SMTP_USER.value();

    try {
      await transporter.sendMail({ from: `"Vikshana Eye Hospital" <${mailFrom}>`, to: job.to, subject, text, html });
      await ref.delete();
    } catch (err) {
      console.error(`Failed to send ${job.type ?? "confirmation"} email to ${job.to}:`, err);
      throw err;
    }
  }
);

const REVIEWS_FIELD_MASK = "id,displayName,rating,userRatingCount,reviews";

async function fetchPlaceDetails(placeId, apiKey) {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": REVIEWS_FIELD_MASK,
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

exports.syncGoogleReviews = onSchedule(
  {
    schedule: "0 3 * * *",
    timeZone: "Etc/UTC",
    secrets: [GOOGLE_PLACE_ID, GOOGLE_PLACES_API_KEY],
  },
  async () => {
    const placeId = GOOGLE_PLACE_ID.value();
    const place = await fetchPlaceDetails(placeId, GOOGLE_PLACES_API_KEY.value());

    await getFirestore()
      .collection("reviewsSync")
      .doc("vikshana")
      .set({
        placeId,
        displayName: place.displayName?.text ?? null,
        rating: place.rating ?? null,
        userRatingCount: place.userRatingCount ?? null,
        reviews: (place.reviews ?? []).map(mapReview),
        updatedAt: FieldValue.serverTimestamp(),
      });

    console.log(`Synced ${place.reviews?.length ?? 0} reviews for ${place.displayName?.text ?? placeId}.`);
  }
);
