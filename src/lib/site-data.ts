import { Eye, Baby, ScanEye, Glasses, Focus, Sparkles, ShieldCheck, HeartHandshake, MapPin, Stethoscope, Flame, Droplet, Gauge } from "lucide-react";
import pediatric from "../assets/pediatric-eye-care.jpg";
import ocularSurface from "../assets/service-ocular-surface.jpg";
import anterior from "../assets/service-anterior.jpg";
import posterior from "../assets/service-posterior.jpg";
import refractionImg from "../assets/service-refraction.jpg";
import cataractSurgery from "../assets/service-cataract-surgery.jpg";
import foreignBody from "../assets/Foreign_body_removal.jpeg";
import cataractEvaluation from "../assets/Cataract_evaluation.jpg";
import squint from "../assets/Squint_evaluation.jpeg";
import redEye from "../assets/red_eye.jpeg";
import dryEye from "../assets/dry_eye.jpeg";
import eyePressureCheck from "../assets/eye_pressure_check.jpeg";
import ceoPhoto from "../assets/ceo.jpeg";
import mdPhoto from "../assets/md.jpeg";
import hodPhoto from "../assets/hod.png";
import pawanPhoto from "../assets/Pawan_G_Kumar.jpeg";
import mounikaPhoto from "../assets/Mounika_Reddy_Polu.png";
import shwethaPhoto from "../assets/Shwetha_R.jpeg";

export const contact = {
  phone1: "8920847760", phone2: "8009537637", email: "drykkiran@gmail.com",
  address: "#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064",
};
export const socialLinks = {
  instagram: "https://www.instagram.com/vikshanaeyecarecentre/",
  facebook: "https://www.facebook.com/share/1BjNaf28Fc/",
};
export function appointmentWhatsAppLink(details: { name: string; phone: string; email: string; doctorLabel: string; date: string; time: string; service: string; message?: string }) {
  const lines = [
    "New Appointment Request",
    "",
    `Name: ${details.name}`,
    `Phone: ${details.phone}`,
    `Email: ${details.email}`,
    `Doctor: ${details.doctorLabel}`,
    `Date: ${details.date}`,
    `Time: ${details.time}`,
    `Reason: ${details.service}`,
    `Message: ${details.message?.trim() ? details.message : "—"}`,
  ];
  return `https://wa.me/91${contact.phone1}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export type Service = {
  slug: string; name: string; text: string; icon: typeof Eye; image: string; alt: string;
  intro: string; points: string[]; expect: string[];
  keywords: string[]; seoTitle: string; seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "ocular-surface-procedures", name: "Ocular Surface Procedures", text: "Focused care for conditions affecting the eye's surface, guided by a careful clinical evaluation.",
    icon: Sparkles, image: ocularSurface, alt: "Eye specialist examining a patient's ocular surface",
    intro: "The ocular surface—the cornea, conjunctiva, tear film and eyelid margins—protects the eye and keeps vision comfortable. Its health depends on three tear-film layers (oil, water and mucus) working together; when any one is disrupted, dryness, irritation or blurred vision can follow. Our team evaluates surface-related concerns carefully before recommending any procedure.",
    points: ["Detailed evaluation of the tear film and eye surface", "Care for irritation, dryness and surface-related discomfort", "Management of meibomian gland dysfunction and blepharitis", "Minor in-clinic surface procedures where clinically indicated", "Clear explanation of findings and aftercare guidance"],
    expect: ["Discussion of your symptoms and daily eye strain", "Slit-lamp examination and a tear film break-up time test", "A care plan explained in plain language"],
    keywords: ["Ocular Surface Procedures", "Ocular Surface Treatment", "Ocular Surface Disease", "Dry Eye Treatment", "Dry Eye Clinic", "Dry Eye Evaluation", "Dry Eye Specialist", "Corneal Surface Treatment", "Eye Surface Disease Treatment", "Corneal Disease Treatment"],
    seoTitle: "Ocular Surface & Dry Eye Treatment in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Ocular surface procedures and dry eye treatment in Yelahanka, Bengaluru. Our dry eye specialists evaluate ocular surface disease, tear film health and corneal surface disease with careful clinical assessment.",
  },
  {
    slug: "foreign-body-removal", name: "Foreign Bodies Removal", text: "Prompt professional assessment and removal of particles affecting the eye.",
    icon: ShieldCheck, image: foreignBody, alt: "Clinician removing a foreign particle from a patient's eye using forceps under magnification",
    intro: "Dust, metal fragments, wood or plant matter and insect debris are among the most common objects that lodge on the eye's surface, often during grinding, welding, gardening or a windy commute. Attempting removal at home can scratch the cornea or push the particle deeper, so we assess and manage this in a sterile clinical setting. Metallic fragments left in place can also leave a rust ring, which needs careful clearing once the eye is stable.",
    points: ["Immediate clinical assessment of the affected eye", "Fluorescein staining to detect any corneal abrasion", "Sterile, careful removal under magnification", "Removal of rust rings when metallic fragments have been embedded", "Guidance on healing, medication and follow-up"],
    expect: ["Vision check and examination of the injured eye", "Removal under a slit lamp with topical anaesthetic where needed", "A protective eye patch or antibiotic ointment if there is a corneal abrasion", "Review of protective eyewear for work or hobbies"],
    keywords: ["Foreign Body Removal from Eye", "Eye Foreign Body Removal", "Foreign Particle Removal", "Dust Removal from Eye", "Foreign Body Eye Treatment", "Eye Injury Treatment", "Eye Emergency Care", "Emergency Eye Treatment", "Foreign Object in Eye"],
    seoTitle: "Eye Foreign Body Removal & Emergency Eye Care | Vikshana Eye Hospital",
    seoDescription: "Prompt foreign body removal from the eye in Yelahanka. Sterile, professional care for dust, metal or particle removal, eye injury treatment and emergency eye care when you need it most.",
  },
  {
    slug: "cataract-evaluation", name: "Cataract Evaluation", text: "A complete assessment to understand cataracts and discuss suitable care options.",
    icon: ScanEye, image: cataractEvaluation, alt: "Ophthalmologist examining a senior patient's eyes using a slit lamp for cataract evaluation",
    intro: "A cataract is a clouding of the eye's natural lens that gradually affects clarity, contrast and night vision. It is most often age-related but can also follow injury, long-term steroid use or occur from birth. Worldwide, cataract remains the leading cause of reversible vision loss, which is why an unhurried evaluation—covering glare sensitivity, night-vision difficulty and how the change is affecting daily life—matters as much as the diagnosis itself.",
    points: ["Vision assessment and refraction", "Slit-lamp examination to grade lens clouding", "Assessment of glare sensitivity and night-vision difficulty", "Assessment of the retina and overall eye health", "An honest discussion about whether surgery is needed yet"],
    expect: ["A calm, unhurried examination", "Findings explained without pressure or urgency", "Discussion of when surgery becomes advisable, not just possible", "Written guidance on the next appropriate step"],
    keywords: ["Cataract", "Cataract Evaluation", "Cataract Checkup", "Cataract Diagnosis", "Cataract Consultation", "Cataract Treatment", "Cataract Specialist"],
    seoTitle: "Cataract Evaluation & Checkup in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Complete cataract evaluation, checkup and diagnosis in Yelahanka, Bengaluru. Our cataract specialists offer an unhurried cataract consultation to guide your treatment options.",
  },
  {
    slug: "pediatric-ophthalmology", name: "Pediatric Ophthalmology", text: "Gentle eye evaluation for children, supporting healthy visual development.",
    icon: Baby, image: pediatric, alt: "Child having a gentle eye examination",
    intro: "Children rarely say their vision is blurry—they simply adapt, which is why routine screening matters even without complaints. A child's visual system is still developing through roughly the first seven to eight years of life, and conditions such as amblyopia (lazy eye) respond far better to treatment when caught within this window. Regular eye evaluation helps identify refractive error, alignment issues or lazy eye at a stage when they respond best to care.",
    points: ["Child-friendly vision testing at every age", "Early detection of amblyopia (lazy eye) while it is still treatable", "Screening for refractive error and eye alignment", "Assessment for congenital or developmental eye conditions", "Guidance for parents on screen time and eye habits"],
    expect: ["A patient, playful approach that puts children at ease", "Simple, non-invasive tests suited to the child's age", "Clear advice for parents and school reports where needed"],
    keywords: ["Pediatric Ophthalmology", "Pediatric Eye Care", "Pediatric Eye Specialist", "Children Eye Specialist", "Kids Eye Doctor", "Children's Eye Checkup", "Children's Vision Test", "Pediatric Eye Examination", "Kids Vision Screening", "Child Eye Care"],
    seoTitle: "Pediatric Eye Care & Children's Eye Specialist | Vikshana Eye Hospital",
    seoDescription: "Gentle pediatric ophthalmology in Yelahanka. Our children's eye specialist offers kids vision screening, children's eye checkups and pediatric eye examinations in a child-friendly setting.",
  },
  {
    slug: "anterior-segment-evaluation", name: "Anterior Segment Evaluation", text: "Assessment of the cornea, iris, lens and other structures at the front of the eye.",
    icon: Eye, image: anterior, alt: "Slit-lamp view of the front of the eye",
    intro: "The anterior segment includes the cornea, iris, pupil and natural lens. Careful examination of these structures explains many common complaints—glare, redness, pain, blurring and light sensitivity—and can reveal conditions such as keratoconus, corneal dystrophies, pterygium or uveitis that need targeted care.",
    points: ["High-magnification slit-lamp examination", "Assessment of corneal clarity and health", "Screening for keratoconus and irregular corneal curvature", "Evaluation of the iris, pupil reaction and lens", "Identification of conditions needing further care"],
    expect: ["A short, painless examination", "Photographs or notes for follow-up comparison", "A plan tailored to what the examination shows"],
    keywords: ["Anterior Segment Evaluation", "Anterior Segment Examination", "Cornea Evaluation", "Corneal Examination", "Cornea Specialist", "Corneal Disease Treatment", "Corneal Eye Care", "Eye Surface Examination"],
    seoTitle: "Anterior Segment & Cornea Evaluation in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Detailed anterior segment evaluation and corneal examination in Yelahanka. Our cornea specialists assess the front of the eye to diagnose and treat corneal disease early.",
  },
  {
    slug: "posterior-segment-evaluation", name: "Posterior Segment Evaluation", text: "Detailed evaluation of the retina and other structures at the back of the eye.",
    icon: Focus, image: posterior, alt: "Retinal imaging being reviewed on a clinical screen",
    intro: "The retina, optic nerve and vitreous sit at the back of the eye and are central to how you see. Evaluation here is especially important for people with diabetes or high blood pressure—two of the leading causes of preventable vision loss in adults—as well as those with high refractive error, sudden flashes or floaters, or a family history of eye disease.",
    points: ["Dilated retinal examination", "Assessment of the optic nerve and macula", "Screening for diabetic and hypertensive retinopathy", "Evaluation for macular degeneration and retinal tears or detachment risk", "Referral or follow-up planning when required"],
    expect: ["Dilating drops, which blur vision for a few hours", "A thorough view of the back of the eye", "Advice to arrange transport home after dilation"],
    keywords: ["Posterior Segment Evaluation", "Posterior Segment Examination", "Retina Evaluation", "Retina Examination", "Retina Specialist", "Retinal Examination", "Fundus Examination", "Retinal Disease Treatment", "Diabetic Eye Checkup", "Retina Eye Care", "Vitreoretinal Care"],
    seoTitle: "Retina & Posterior Segment Evaluation in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Comprehensive posterior segment evaluation, retina examination and fundus examination in Yelahanka, including diabetic eye checkups and retinal disease screening from our retina specialists.",
  },
  {
    slug: "cataract-surgery", name: "Cataract Surgery", text: "Patient-friendly surgical consultation and care planning based on individual needs.",
    icon: Stethoscope, image: cataractSurgery, alt: "Eye surgeon operating under a surgical microscope",
    intro: "When a cataract begins to interfere with daily life, surgery replaces the clouded natural lens with a clear intraocular lens (IOL). Modern cataract surgery uses phacoemulsification—a small-incision technique performed under a surgical microscope—and is typically a day-care procedure with a comparatively quick visual recovery. We focus on preparation, informed choice of lens and structured aftercare.",
    points: ["Pre-surgical evaluation and lens power measurement", "Explanation of monofocal, multifocal and toric lens options", "Clear explanation of the procedure and recovery", "Same-day or short-stay surgical planning where suitable", "Structured post-operative follow-up"],
    expect: ["A consultation covering risks, benefits and alternatives", "Written pre-operative and post-operative instructions", "Discussion of activity restrictions during the first week of recovery", "Scheduled review visits after the procedure"],
    keywords: ["Cataract Surgery", "Cataract Operation", "Phaco Surgery", "Phacoemulsification", "Phaco Cataract Surgery", "Cataract Eye Surgery", "Advanced Cataract Surgery", "Cataract Surgeon"],
    seoTitle: "Cataract Surgery & Phacoemulsification in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Advanced cataract surgery using modern phacoemulsification (phaco) techniques in Yelahanka. Trust our experienced cataract surgeon for your cataract operation, from consultation to recovery.",
  },
  {
    slug: "refraction", name: "Refraction", text: "Vision assessment to identify refractive needs and determine an accurate prescription.",
    icon: Glasses, image: refractionImg, alt: "Patient undergoing a refraction vision test",
    intro: "Refraction determines the exact lens power your eyes need to correct myopia (near-sightedness), hyperopia (far-sightedness) or astigmatism, and identifies presbyopia—the natural loss of near focus that most people notice after their early forties. An accurate prescription reduces eye strain, headaches and blurred vision, including the digital eye strain common with extended screen use, and is the foundation of comfortable everyday sight.",
    points: ["Objective and subjective refraction testing", "Assessment for astigmatism and presbyopia", "Assessment of near and distance vision", "Prescription for spectacles or contact lenses", "Advice on lens type for work, driving and screens"],
    expect: ["A straightforward test with no discomfort", "Your prescription explained clearly", "Eyewear guidance available at Shades Optical Shop"],
    keywords: ["Refraction", "Refraction Test", "Eye Power Check", "Eye Number Check", "Vision Test", "Eye Testing", "Spectacle Power Check", "Computerized Eye Testing", "Comprehensive Vision Test", "Visual Acuity Test"],
    seoTitle: "Refraction & Eye Power Check in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Accurate refraction test and eye power check in Yelahanka. Get a comprehensive vision test, spectacle power check and visual acuity test using computerized eye testing.",
  },
  {
    slug: "squint-evaluation", name: "Squint Evaluation", text: "Assessment of eye alignment and related visual concerns for children and adults.",
    icon: HeartHandshake, image: squint, alt: "Child having an eye alignment assessment, with a before-and-after comparison of squint correction",
    intro: "A squint (strabismus) is a misalignment of the eyes—inward, outward, upward or downward—that affects a meaningful proportion of children and can also appear in adults. Left unmanaged in childhood, it can affect vision, depth perception and confidence, since the brain may suppress the misaligned eye's image and cause amblyopia. When a squint appears suddenly in an adult, it is evaluated carefully, as it can occasionally signal an underlying neurological cause. Evaluation is the first step in managing it well.",
    points: ["Cover test and prism assessment to quantify deviation", "Assessment for associated lazy eye (amblyopia)", "Refraction, since glasses alone sometimes correct a squint", "Screening for an underlying cause in adult-onset cases", "Discussion of exercises, glasses or surgical referral"],
    expect: ["A detailed alignment and movement assessment", "Findings explained for both children and adults", "A staged, realistic plan for follow-up"],
    keywords: ["Squint Evaluation", "Squint Treatment", "Squint Specialist", "Squint Eye Doctor", "Strabismus Evaluation", "Strabismus Treatment", "Crossed Eyes Treatment", "Children's Squint Treatment", "Eye Alignment Evaluation"],
    seoTitle: "Squint Evaluation & Strabismus Treatment | Vikshana Eye Hospital",
    seoDescription: "Expert squint evaluation and strabismus treatment in Yelahanka. Our squint specialists assess eye alignment and manage crossed eyes in both children and adults.",
  },
  {
    slug: "red-eye-allergy-treatment", name: "Red Eye & Eye Allergy Treatment", text: "Careful evaluation and treatment for red, itchy or watery eyes caused by allergies or irritation.",
    icon: Flame, image: redEye, alt: "Woman with a red, irritated eye pulling down her lower eyelid in a clinical setting",
    intro: "A red eye can be caused by many different things—allergic conjunctivitis from pollen, dust or pet dander, viral or bacterial conjunctivitis, dry eye, or minor irritation—and each needs a different approach. Allergic reactions often bring itching and watering alongside redness, while an infection may need antibiotic care and can spread to others. Correctly identifying the cause is the first step before starting any treatment.",
    points: ["Careful examination to distinguish allergic, infective or other causes of redness", "Assessment of itching, watering, discharge and light sensitivity", "Treatment for seasonal and perennial eye allergies", "Guidance on avoiding common triggers such as dust, pollen and smoke", "Advice on when a red eye needs urgent attention"],
    expect: ["A slit-lamp examination of the affected eye", "Questions about recent exposure, triggers and duration of symptoms", "Eye drops or other treatment suited to the cause", "Guidance on hygiene to avoid spreading an infective conjunctivitis"],
    keywords: ["Red Eye Treatment", "Eye Allergy Treatment", "Allergic Conjunctivitis Treatment", "Eye Allergy Specialist", "Conjunctivitis Treatment", "Itchy Eyes Treatment", "Watery Eyes Treatment", "Eye Redness Treatment", "Seasonal Eye Allergy"],
    seoTitle: "Red Eye & Eye Allergy Treatment in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Red eye and eye allergy treatment in Yelahanka, Bengaluru. Careful evaluation of allergic conjunctivitis, itching, watering and eye redness with treatment suited to the cause.",
  },
  {
    slug: "dry-eye-evaluation-treatment", name: "Dry Eye Evaluation & Treatment", text: "Tear film evaluation and a personalized treatment plan for dry, tired or screen-strained eyes.",
    icon: Droplet, image: dryEye, alt: "Close-up comparison of a patient's dry eyes and itchy eyes alongside a wider view of her irritated eye",
    intro: "Dry eye happens when your tears don't provide enough lubrication, either because too few tears are produced or because they evaporate too quickly. It is increasingly common with extended screen use, contact lens wear, air-conditioned environments and age, and can cause burning, grittiness, fluctuating vision and discomfort by the end of the day. A proper evaluation identifies the underlying pattern so treatment is targeted rather than guesswork.",
    points: ["Tear film break-up time and ocular surface staining tests", "Assessment of tear quantity and quality", "Identification of screen-use, environmental or lens-related triggers", "A personalized treatment plan, from lubricating drops to lifestyle changes", "Follow-up to track improvement and adjust treatment"],
    expect: ["A comfortable, non-invasive set of tests at the slit lamp", "Discussion of screen habits, environment and any contact lens use", "Clear guidance on drops, frequency and simple daily habits", "A realistic timeline for improvement"],
    keywords: ["Dry Eye Evaluation", "Dry Eye Treatment", "Dry Eye Specialist", "Dry Eye Test", "Tear Film Test", "Digital Eye Strain", "Computer Vision Syndrome", "Dry Eye Clinic", "Chronic Dry Eye Treatment"],
    seoTitle: "Dry Eye Evaluation & Treatment in Yelahanka | Vikshana Eye Hospital",
    seoDescription: "Dry eye evaluation and treatment in Yelahanka, Bengaluru. Tear film testing and a personalized treatment plan for burning, grittiness and screen-related dry eye.",
  },
  {
    slug: "eye-pressure-check-nct", name: "Eye Pressure Check (NCT)", text: "A quick, comfortable puff-of-air style test to check eye pressure and screen for glaucoma risk.",
    icon: Gauge, image: eyePressureCheck, alt: "Clinician measuring a patient's eye pressure using a tonometer, with the pressure reading displayed on screen",
    intro: "Intraocular pressure—the fluid pressure inside the eye—is one of the key measurements in detecting glaucoma, a condition that can silently damage the optic nerve before any vision loss is noticed. A Non-Contact Tonometer (NCT) measures this pressure with a quick puff of air, without needing numbing drops, making it a comfortable first-line screening test.",
    points: ["Quick pressure measurement using a puff of air", "No numbing drops required for the test", "Useful screening for glaucoma risk, especially with age, diabetes or family history", "Results reviewed alongside optic nerve and visual field assessment when needed", "Recommended as part of a routine comprehensive eye check-up"],
    expect: ["A brief test lasting only a few seconds per eye", "A slight puff of air felt on the eye, with no pain", "Pressure readings explained in the context of your overall eye health", "Further testing arranged if the reading needs closer evaluation"],
    keywords: ["Eye Pressure Check", "Intraocular Pressure Test", "NCT Eye Test", "Non Contact Tonometer", "Glaucoma Screening", "Glaucoma Test", "Eye Pressure Test", "Tonometry", "Glaucoma Risk Assessment"],
    seoTitle: "Eye Pressure Check (NCT) & Glaucoma Screening | Vikshana Eye Hospital",
    seoDescription: "Painless eye pressure check using a Non-Contact Tonometer (NCT) in Yelahanka. Quick glaucoma screening as part of a comprehensive eye check-up at Vikshana Eye Hospital.",
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const googlePlaceId = "ChIJY-N2KnAZrjsRlgTe1ojhQWo";

export const reviewLinks = {
  google: `https://search.google.com/local/writereview?placeid=${googlePlaceId}`,
  justdial: "https://www.justdial.com/Bangalore/Vikshana-Eye-Hospital-Yelahanka",
};

export const directionsUrl = "https://www.google.com/maps/search/?api=1&query=Vikshana+Eye+Hospital+Singanayakanahalli+Yelahanka+Bengaluru+560064";
export const mapEmbed = "https://www.google.com/maps?q=Singanayakanahalli%20Yelahanka%20Bengaluru%20560064&output=embed";

export type ManagementProfile = {
  slug: string; initials: string; photo: string; name: string; role: string; org: string;
  credentials: string[]; tags: string[]; highlights: string[]; bio: string[]; closing?: string;
};

export const management: ManagementProfile[] = [
  {
    slug: "kamal-kiran-yenamandra", initials: "KK", photo: ceoPhoto,
    name: "Gp Capt (Dr) Kamal Kiran Yenamandra (Retd)",
    role: "Chief Executive Officer", org: "Anand Abhigyan Healthcare & Life Sciences",
    credentials: ["MBBS (AFMC)", "MD Pediatrics", "Trained in Pediatric Cardiology", "National Instructor – PALS | NALS | BLS | ACLS | ATLS"],
    tags: ["Fetal Echocardiography", "Hospital Administration", "Medical Education", "NABH & Quality Assurance", "Emergency Medicine", "Disaster Medicine"],
    highlights: [
      "Professor & Head, Department of Pediatrics – Command Hospital Air Force, Bengaluru",
      "Examiner for NBE, RGUHS and MUHS",
      "Commanded a 200-bedded Air Force Hospital",
      "Medical Superintendent of a 400-bedded Air Force Hospital",
      "National Instructor – PALS, NALS, BLS, ACLS and ATLS",
      "Disaster-relief deployments: Sri Lanka Tsunami, Nepal earthquake, Srinagar earthquake",
    ],
    bio: [
      "Gp Capt (Dr) Kamal Kiran Yenamandra (Retd) is a senior Pediatrician, healthcare leader, medical educator and former Indian Air Force medical officer with nearly three decades of experience spanning clinical medicine, hospital administration, healthcare management, medical education, quality assurance and emergency medicine.",
      "An alumnus of the Armed Forces Medical College (AFMC), he completed his MD in Pediatrics from Mumbai and subsequently underwent advanced training in Pediatric Cardiology and Fetal Echocardiography. His special clinical interests include Allergy & Asthma, Developmental Pediatrics, Newborn Care and Preventive Child Health.",
      "During his career with the Indian Air Force, he held several senior clinical, academic and leadership appointments, serving as Professor & Head of the Department of Pediatrics at Command Hospital Air Force, Bengaluru, and as an Examiner for NBE, RGUHS and MUHS.",
      "His leadership experience extends well beyond clinical practice. He commanded a 200-bedded Air Force Hospital and served as Medical Superintendent of a 400-bedded Air Force Hospital, with responsibilities encompassing hospital operations, multidisciplinary healthcare delivery, clinical governance, manpower management, patient safety and quality systems.",
      "Trained in NABH standards and Quality Assurance, he has a strong interest in building healthcare systems that combine clinical excellence with efficient processes, patient safety and a consistently high standard of patient experience.",
      "A committed medical educator, he is a National Instructor in PALS, NALS, BLS, ACLS and ATLS, contributing extensively to the training of doctors and healthcare professionals in pediatric emergencies, neonatal resuscitation, cardiac life support and trauma care.",
      "His Armed Forces service also included participation in major humanitarian assistance and disaster-relief operations, including the Sri Lanka Tsunami, Nepal earthquake and Srinagar earthquake, providing him with significant experience in disaster medicine, emergency response and healthcare delivery under challenging conditions.",
      "As Chief Executive Officer of Anand Abhigyan Healthcare & Life Sciences, Dr Kamal Kiran brings together his experience as a clinician, hospital commander, medical superintendent, academician, instructor and healthcare administrator to build an integrated healthcare organisation centred on clinical quality, patient experience, professional development and innovation.",
    ],
    closing: "Build strong systems, empower healthcare professionals and keep the patient at the centre of every decision.",
  },
  {
    slug: "suneela-kiran", initials: "SK", photo: mdPhoto,
    name: "Dr Suneela Kiran",
    role: "Managing Director", org: "Anand Abhigyan Healthcare & Life Sciences",
    credentials: ["BDS", "Healthcare Management", "Clinical Data Management & CTRI", "Trained in Microscopic Endodontics"],
    tags: ["Dental Surgery (BDS)", "Microscopic Endodontics", "Healthcare Administration", "Clinical Governance", "Clinical Data Management", "CTRI Processes", "Patient Experience", "Team Coordination"],
    highlights: [
      "BDS, 1998 – Rajah Muthiah Dental College",
      "28 years of clinical experience",
      "Associated with Indian Air Force Dental Centres and ECHS healthcare facilities",
      "Trained in Microscopic Endodontics",
      "Expertise in Clinical Data Management and Clinical Trials Registry–India (CTRI)",
    ],
    bio: [
      "Dr Suneela Kiran is the Managing Director of Anand Abhigyan Healthcare & Life Sciences, bringing 28 years of clinical experience together with extensive exposure to healthcare management, clinical operations and patient-centred healthcare delivery.",
      "She completed her Bachelor of Dental Surgery (BDS) in 1998 from Rajah Muthiah Dental College. Over the course of her professional journey, she has worked across different parts of India and has been associated with Indian Air Force Dental Centres and Ex-Servicemen Contributory Health Scheme (ECHS) healthcare facilities, providing her with exposure to diverse clinical environments, patient populations and organised healthcare systems.",
      "Her clinical experience spans nearly three decades, and she is also trained in Microscopic Endodontics, reflecting her continued engagement with contemporary and precision-based dental practice.",
      "Beyond dentistry, Dr Suneela has developed substantial experience in healthcare administration and management, including hospital operations, clinical governance, quality and patient-safety processes, multidisciplinary team coordination, patient experience and healthcare service development.",
      "She also has expertise in Clinical Data Management and Clinical Trials Registry–India (CTRI) processes, complementing her clinical and managerial experience with an understanding of structured clinical documentation, research processes and data-driven healthcare systems.",
      "As Managing Director of Anand Abhigyan, she is actively involved in the organisation's strategic development and operational governance, working across its multidisciplinary healthcare services to strengthen quality, efficiency, clinical standards and patient experience.",
    ],
    closing: "Bringing together the perspectives of a clinician, healthcare administrator and organisational leader, backed by nearly three decades of experience across diverse healthcare settings.",
  },
  {
    slug: "vikas-dubey", initials: "VD", photo: hodPhoto,
    name: "Vikas Dubey",
    role: "Director – Marketing | HOD, Vikshana Eye Care Centre", org: "Anand Abhigyan Healthcare & Life Sciences",
    credentials: ["Paramedical Training – Medical Training Centre, Ulsoor", "Operation Room Technology", "20+ Years Cross-Domain Experience"],
    tags: ["Healthcare Management", "Hospital Operations", "Marketing", "Digital Health", "Patient Experience", "Procurement", "Business Development", "Eye Care & Optical Operations"],
    highlights: [
      "Joined the Indian Air Force in 2002",
      "Paramedical training – Medical Training Centre, Ulsoor, Bengaluru",
      "Experience in Operation Room Technology and hospital services",
      "Director – Marketing, Anand Abhigyan Healthcare & Life Sciences",
      "HOD, Vikshana Eye Care Centre – grew Shades Opticals into an integral part of its eye-care services",
    ],
    bio: [
      "Vikas Dubey brings over two decades of experience across the Indian Air Force, healthcare management, hospital operations, patient care, marketing, digital health and procurement.",
      "He began his professional journey with the Indian Air Force in 2002, subsequently undergoing paramedical training at the Medical Training Centre, Ulsoor, Bengaluru. His experience in Operation Room Technology and hospital services provided him with a strong foundation in clinical operations, teamwork and structured healthcare delivery.",
      "At Anand Abhigyan Healthcare & Life Sciences, he serves as Director – Marketing, contributing to brand development, digital health initiatives, community outreach, procurement and organisational growth.",
      "As HOD – Vikshana Eye Care Centre, he has played an active role in the development of Vikshana, strengthening its operations and infrastructure, and enhancing Shades Opticals as an integral part of its eye-care services.",
      "His leadership combines Armed Forces discipline with hands-on healthcare and managerial experience, with a focus on operational efficiency, patient experience, teamwork and sustainable growth.",
    ],
  },
];

export const getManagementProfile = (slug: string) => management.find((m) => m.slug === slug);

export type Doctor = {
  slug: string; initials: string; photo: string; name: string; role: string; org?: string;
  credentials: string[]; tags: string[]; highlights: string[]; bio: string[];
  keywords: string[]; seoDescription: string;
};

export const doctors: Doctor[] = [
  {
    slug: "pawan-g-kumar", initials: "PK", photo: pawanPhoto,
    name: "Dr (Wg Cdr) Professor Pawan G Kumar",
    role: "Consultant Ophthalmologist & Professor",
    credentials: ["MS (Ophthalmology)", "DNB (Ophthalmology)"],
    tags: ["Comprehensive Ophthalmology", "Cataract", "Clinical Teaching", "Medical Education", "Consultant Ophthalmology"],
    highlights: [
      "30+ years of clinical experience in ophthalmology",
      "25 years of service with the Indian Air Force",
      "Professor of Ophthalmology, guiding medical students",
      "Active consultant, continuing to see patients directly",
    ],
    bio: [
      "Dr (Wg Cdr) Professor Pawan G Kumar is a comprehensive ophthalmologist with over 30 years of clinical experience, trained in MS and DNB Ophthalmology.",
      "He served the Indian Air Force for 25 years, gaining extensive exposure to comprehensive eye care across diverse clinical settings and patient populations.",
      "He now continues to work as a Professor and Consultant in Ophthalmology, guiding both students and patients with his extensive clinical expertise and experience.",
    ],
    keywords: ["Eye Specialist", "Ophthalmologist", "Eye Doctor", "Comprehensive Eye Care", "Cataract Specialist", "Cataract Surgeon", "Complete Eye Examination"],
    seoDescription: "Dr (Wg Cdr) Professor Pawan G Kumar is a consultant ophthalmologist and eye specialist in Yelahanka with 30+ years of experience in comprehensive eye care and cataract treatment.",
  },
  {
    slug: "mounika-reddy-polu", initials: "MR", photo: mounikaPhoto,
    name: "Dr Mounika Reddy Polu",
    role: "Consultant Ophthalmologist – Cataract, Cornea & Refractive Services",
    credentials: ["MBBS", "DNB Ophthalmology (LVPEI)", "Fellowship in Cataract, Cornea & Refractive Services (FSEH)"],
    tags: ["Cataract Surgery", "Cornea", "Refractive Surgery", "Glaucoma", "Keratoplasty", "Uveitis & Retinopathy"],
    highlights: [
      "9+ years of clinical experience in Ophthalmology",
      "Comprehensive visual system examination along with sub-speciality assessments",
      "Skilled in Slit-lamp Biomicroscopy, Indirect & Direct Ophthalmoscopy, Gonioscopy and Tonometry",
      "Experience in Ultrasonography, Yag Capsulotomy and Yag PI",
      "Experience in Pentacam and Orbscan assessment, Biometry evaluation, Visual fields assessment and Retinal diagnostics",
      "Medical management of corneal diseases, Glaucoma, Thyroid ophthalmopathy, Squint, Neuro-ophthalmic diseases, Uveitis and Retinopathy",
      "Confident in assessing cornea, chemical injuries and trauma patients, and evaluating and managing refractive surgery candidates",
      "Surgical experience in SICS, Phacoemulsification with Anterior Vitrectomy, Pterygium surgery, Corneal & Scleral tear repair, AMG transplantation, Keratoplasty (Therapeutic, Penetrating and Lamellar), SLET, Collagen Cross Linking, Refractive surgeries and Intravitreal injections",
    ],
    bio: [
      "Dr Mounika Reddy Polu is a Consultant Ophthalmologist with over 9 years of experience, trained in MBBS and DNB Ophthalmology from LVPEI, with a Fellowship in Cataract, Cornea and Refractive Services from FSEH.",
      "She is experienced in performing comprehensive visual system examinations as well as sub-speciality assessments, including Slit-lamp Biomicroscopy, Indirect and Direct Ophthalmoscopy, Gonioscopy, Tonometry, Ultrasonography, Yag Capsulotomy and Yag PI, along with Pentacam and Orbscan assessment, Biometry evaluation, Visual fields assessment and Retinal diagnostics.",
      "Her clinical focus includes the medical management of sub-speciality diseases such as corneal diseases, Glaucoma, Thyroid ophthalmopathy, Squint, Neuro-ophthalmic diseases, Uveitis and Retinopathy, and she is confident in assessing cornea, chemical injuries and trauma patients, and evaluating and managing patients for refractive surgery.",
      "Her surgical experience spans SICS, Phacoemulsification with Anterior Vitrectomy, Pterygium surgeries, Corneal and Scleral tear repairs, AMG transplantation, Keratoplasty (Therapeutic, Penetrating and Lamellar), SLET, Collagen Cross Linking, Refractive surgeries and Intravitreal injections.",
    ],
    keywords: ["Eye Specialist", "Ophthalmologist", "Cataract Specialist", "Cornea Specialist", "Refractive Surgery", "Keratoplasty", "Glaucoma Specialist"],
    seoDescription: "Dr Mounika Reddy Polu is a consultant ophthalmologist in Yelahanka with 9+ years of experience in cataract, cornea and refractive surgery, glaucoma and comprehensive eye care.",
  },
  {
    slug: "shwetha-r", initials: "SR", photo: shwethaPhoto,
    name: "Shwetha R",
    role: "Optometrist",
    credentials: ["Diploma in Optometry"],
    tags: ["Refraction – Adults & Kids", "Colour Vision", "Myopia", "Hypermetropia", "Presbyopia"],
    highlights: [
      "Refraction assessment for adults and children",
      "Colour vision testing",
      "Diagnosis and guidance for myopia",
      "Diagnosis and guidance for hypermetropia",
      "Diagnosis and guidance for presbyopia",
    ],
    bio: [
      "Shwetha R is our in-house optometrist, providing thorough vision testing and diagnosis for patients of every age.",
      "Her diagnostic focus spans refraction for adults and kids, colour vision testing, and the assessment of common refractive conditions including myopia, hypermetropia and presbyopia—helping patients get to an accurate prescription and clear next steps.",
    ],
    keywords: ["Refraction Test", "Eye Power Check", "Vision Test", "Eye Testing", "Eye Checkup", "Comprehensive Vision Test", "Visual Acuity Test", "Eye Doctor"],
    seoDescription: "Shwetha R is our optometrist in Yelahanka, providing refraction tests, eye power checks, colour vision testing and vision screening for myopia, hypermetropia and presbyopia.",
  },
];

export const getDoctor = (slug: string) => doctors.find((d) => d.slug === slug);
