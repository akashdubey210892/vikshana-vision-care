import { Eye, Baby, ScanEye, Glasses, Focus, Sparkles, ShieldCheck, HeartHandshake, MapPin, Stethoscope } from "lucide-react";
import hero from "../assets/vikshana-hero.jpg";
import pediatric from "../assets/pediatric-eye-care.jpg";
import ocularSurface from "../assets/service-ocular-surface.jpg";
import anterior from "../assets/service-anterior.jpg";
import posterior from "../assets/service-posterior.jpg";
import refractionImg from "../assets/service-refraction.jpg";
import cataractSurgery from "../assets/service-cataract-surgery.jpg";

export const contact = {
  phone1: "8009537637", phone2: "8920847760", email: "drykkiran@gmail.com",
  address: "#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064",
};
export const whatsapp = `https://wa.me/918009537637?text=${encodeURIComponent("Hello, I would like to enquire about eye care at Vikshana Eye Hospital.")}`;

export type Service = {
  slug: string; name: string; text: string; icon: typeof Eye; image: string; alt: string;
  intro: string; points: string[]; expect: string[];
};

export const services: Service[] = [
  {
    slug: "ocular-surface-procedures", name: "Ocular Surface Procedures", text: "Focused care for conditions affecting the eye's surface, guided by a careful clinical evaluation.",
    icon: Sparkles, image: ocularSurface, alt: "Eye specialist examining a patient's ocular surface",
    intro: "The ocular surface—the cornea, conjunctiva, tear film and eyelid margins—protects the eye and keeps vision comfortable. Our team evaluates surface-related concerns carefully before recommending any procedure.",
    points: ["Detailed evaluation of the tear film and eye surface", "Care for irritation, dryness and surface-related discomfort", "Minor in-clinic surface procedures where clinically indicated", "Clear explanation of findings and aftercare guidance"],
    expect: ["Discussion of your symptoms and daily eye strain", "Slit-lamp examination of the eye surface", "A care plan explained in plain language"],
  },
  {
    slug: "foreign-body-removal", name: "Foreign Bodies Removal", text: "Prompt professional assessment and removal of particles affecting the eye.",
    icon: ShieldCheck, image: anterior, alt: "Close-up slit-lamp examination of an eye",
    intro: "Dust, metal fragments or other particles in the eye need prompt professional attention. Attempting removal at home can worsen injury, so we assess and manage this in a sterile clinical setting.",
    points: ["Immediate clinical assessment of the affected eye", "Sterile, careful removal under magnification", "Assessment for any related surface injury", "Guidance on healing, medication and follow-up"],
    expect: ["Vision check and examination of the injured eye", "Removal under a slit lamp with topical anaesthetic where needed", "Review of protective eyewear for work or hobbies"],
  },
  {
    slug: "cataract-evaluation", name: "Cataract Evaluation", text: "A complete assessment to understand cataracts and discuss suitable care options.",
    icon: ScanEye, image: hero, alt: "Ophthalmologist examining a patient at an eye clinic",
    intro: "A cataract is a clouding of the eye's natural lens that gradually affects clarity, contrast and night vision. A full evaluation tells you whether a cataract is present, how far it has progressed and what options suit you.",
    points: ["Vision assessment and refraction", "Slit-lamp examination to grade lens clouding", "Assessment of the retina and overall eye health", "An honest discussion about whether surgery is needed yet"],
    expect: ["A calm, unhurried examination", "Findings explained without pressure or urgency", "Written guidance on the next appropriate step"],
  },
  {
    slug: "pediatric-ophthalmology", name: "Pediatric Ophthalmology", text: "Gentle eye evaluation for children, supporting healthy visual development.",
    icon: Baby, image: pediatric, alt: "Child having a gentle eye examination",
    intro: "Children rarely say their vision is blurry—they simply adapt. Regular eye evaluation helps identify refractive error, alignment issues or lazy eye at a stage when they respond best to care.",
    points: ["Child-friendly vision testing at every age", "Screening for refractive error and lazy eye (amblyopia)", "Assessment of eye alignment and coordination", "Guidance for parents on screen time and eye habits"],
    expect: ["A patient, playful approach that puts children at ease", "Age-appropriate testing methods", "Clear advice for parents and school reports where needed"],
  },
  {
    slug: "anterior-segment-evaluation", name: "Anterior Segment Evaluation", text: "Assessment of the cornea, iris, lens and other structures at the front of the eye.",
    icon: Eye, image: anterior, alt: "Slit-lamp view of the front of the eye",
    intro: "The anterior segment includes the cornea, iris, pupil and natural lens. Careful examination of these structures explains many common complaints—glare, redness, pain, blurring and light sensitivity.",
    points: ["High-magnification slit-lamp examination", "Assessment of corneal clarity and health", "Evaluation of the iris, pupil reaction and lens", "Identification of conditions needing further care"],
    expect: ["A short, painless examination", "Photographs or notes for follow-up comparison", "A plan tailored to what the examination shows"],
  },
  {
    slug: "posterior-segment-evaluation", name: "Posterior Segment Evaluation", text: "Detailed evaluation of the retina and other structures at the back of the eye.",
    icon: Focus, image: posterior, alt: "Retinal imaging being reviewed on a clinical screen",
    intro: "The retina, optic nerve and vitreous sit at the back of the eye and are central to how you see. Evaluation here is especially important for people with diabetes, high refractive error or a family history of eye disease.",
    points: ["Dilated retinal examination", "Assessment of the optic nerve and macula", "Screening relevant to diabetes and blood pressure", "Referral or follow-up planning when required"],
    expect: ["Dilating drops, which blur vision for a few hours", "A thorough view of the back of the eye", "Advice to arrange transport home after dilation"],
  },
  {
    slug: "cataract-surgery", name: "Cataract Surgery", text: "Patient-friendly surgical consultation and care planning based on individual needs.",
    icon: Stethoscope, image: cataractSurgery, alt: "Eye surgeon operating under a surgical microscope",
    intro: "When a cataract begins to interfere with daily life, surgery replaces the clouded natural lens with a clear intraocular lens. We focus on preparation, informed choice and structured aftercare.",
    points: ["Pre-surgical evaluation and lens measurement", "Discussion of intraocular lens options", "Clear explanation of the procedure and recovery", "Structured post-operative follow-up"],
    expect: ["A consultation covering risks, benefits and alternatives", "Written pre-operative and post-operative instructions", "Scheduled review visits after the procedure"],
  },
  {
    slug: "refraction", name: "Refraction", text: "Vision assessment to identify refractive needs and determine an accurate prescription.",
    icon: Glasses, image: refractionImg, alt: "Patient undergoing a refraction vision test",
    intro: "Refraction determines the exact lens power your eyes need. An accurate prescription reduces eye strain, headaches and blurred vision—and is the foundation of comfortable everyday sight.",
    points: ["Objective and subjective refraction testing", "Assessment of near and distance vision", "Prescription for spectacles or contact lenses", "Advice on lens type for work, driving and screens"],
    expect: ["A straightforward test with no discomfort", "Your prescription explained clearly", "Eyewear guidance available at Shades Optical Shop"],
  },
  {
    slug: "squint-evaluation", name: "Squint Evaluation", text: "Assessment of eye alignment and related visual concerns for children and adults.",
    icon: HeartHandshake, image: pediatric, alt: "Eye alignment assessment for a young patient",
    intro: "A squint (strabismus) is a misalignment of the eyes that can affect vision, depth perception and confidence. It can appear in childhood or later in life, and evaluation is the first step in managing it well.",
    points: ["Measurement of the type and degree of misalignment", "Assessment for associated lazy eye", "Refraction, since glasses alone sometimes correct a squint", "Discussion of exercises, glasses or surgical referral"],
    expect: ["A detailed alignment and movement assessment", "Findings explained for both children and adults", "A staged, realistic plan for follow-up"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const reviewLinks = {
  google: "https://www.google.com/search?q=Vikshana+Eye+Hospital+Yelahanka+Bengaluru+reviews",
  justdial: "https://www.justdial.com/Bangalore/Vikshana-Eye-Hospital-Yelahanka",
};

export const reviews = [
  { name: "Ramesh K.", source: "Google", rating: 5, text: "The doctor explained my cataract report patiently and never rushed the consultation. The clinic is clean and very well organised." },
  { name: "Anitha S.", source: "Google", rating: 5, text: "Took my daughter for an eye check-up. The team was gentle with her and explained everything to us clearly. Highly recommended for children." },
  { name: "Mohan Reddy", source: "Just Dial", rating: 5, text: "Very reasonable and honest. I was told my eyes did not need surgery yet, which I appreciated a lot." },
  { name: "Priya N.", source: "Google", rating: 4, text: "Good experience with the refraction test and the optical shop. Staff helped me pick comfortable frames." },
  { name: "Suresh Babu", source: "Just Dial", rating: 5, text: "Got a metal particle removed from my eye. Quick, careful and professional handling. Thank you to the team." },
  { name: "Lakshmi Devi", source: "Google", rating: 5, text: "Convenient location on Doddaballapur Main Road and the staff speak Kannada, English and Hindi. Very comfortable visit." },
];

export const directionsUrl = "https://www.google.com/maps/search/?api=1&query=Vikshana+Eye+Hospital+Singanayakanahalli+Yelahanka+Bengaluru+560064";
export const mapEmbed = "https://www.google.com/maps?q=Singanayakanahalli%20Yelahanka%20Bengaluru%20560064&output=embed";
