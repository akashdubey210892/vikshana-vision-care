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

async function sendConfirmationEmail(appointment) {
  const dateLabel = formatDateLabel(appointment.date);
  const timeLabel = formatTimeLabel(appointment.time);
  const doctor = doctorLabel(appointment.doctor);

  await transporter.sendMail({
    from: `"Vikshana Eye Hospital" <${MAIL_FROM}>`,
    to: appointment.email,
    subject: "Your appointment at Vikshana Eye Hospital is confirmed",
    text: `Hi ${appointment.name},\n\nYour appointment is confirmed:\n\nDoctor: ${doctor}\nDate: ${dateLabel}\nTime: ${timeLabel}\nReason for visit: ${appointment.service}\n\nVikshana Eye Hospital\n#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064\n\nIf you need to reschedule or cancel, please call us.`,
    html: `<p>Hi ${appointment.name},</p><p>Your appointment is confirmed:</p><ul><li><strong>Doctor:</strong> ${doctor}</li><li><strong>Date:</strong> ${dateLabel}</li><li><strong>Time:</strong> ${timeLabel}</li><li><strong>Reason for visit:</strong> ${appointment.service}</li></ul><p>Vikshana Eye Hospital<br>#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064</p><p>If you need to reschedule or cancel, please call us.</p>`,
  });
}

async function main() {
  const snap = await db.collection("appointments").where("emailSent", "==", false).get();

  if (snap.empty) {
    console.log("No pending appointment emails.");
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const docSnap of snap.docs) {
    const appointment = docSnap.data();
    if (!appointment.email) {
      await docSnap.ref.update({ emailSent: true });
      continue;
    }
    try {
      await sendConfirmationEmail(appointment);
      await docSnap.ref.update({ emailSent: true, emailSentAt: new Date() });
      sent++;
    } catch (err) {
      console.error(`Failed to send confirmation to ${appointment.email}:`, err);
      failed++;
    }
  }

  console.log(`Sent ${sent} confirmation email(s), ${failed} failed.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
