import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import nodemailer from "nodemailer";

const SERVICE_ACCOUNT_JSON = process.env.FIREBASE_SERVICE_ACCOUNT;
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const MAIL_FROM = process.env.MAIL_FROM ?? SMTP_USER;

if (!SERVICE_ACCOUNT_JSON || !SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.error("Missing one of FIREBASE_SERVICE_ACCOUNT, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS env vars.");
  process.exit(1);
}

const serviceAccount = JSON.parse(SERVICE_ACCOUNT_JSON);

if (!getApps().length) {
  initializeApp({ credential: cert(serviceAccount) });
}

const db = getFirestore();

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: Number(SMTP_PORT) === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

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

async function sendJobEmail(job) {
  const { subject, text, html } = buildEmail(job);
  await transporter.sendMail({ from: `"Vikshana Eye Hospital" <${MAIL_FROM}>`, to: job.to, subject, text, html });
}

async function main() {
  const snap = await db.collection("appointmentEmails").get();

  if (snap.empty) {
    console.log("No pending appointment emails.");
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const docSnap of snap.docs) {
    const job = docSnap.data();
    if (!job.to) {
      await docSnap.ref.delete();
      continue;
    }
    try {
      await sendJobEmail(job);
      await docSnap.ref.delete();
      sent++;
    } catch (err) {
      console.error(`Failed to send ${job.type ?? "confirmation"} email to ${job.to}:`, err);
      failed++;
    }
  }

  console.log(`Sent ${sent} email(s), ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
