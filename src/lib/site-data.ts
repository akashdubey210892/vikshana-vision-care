import { Eye, Baby, ScanEye, Glasses, Focus, Sparkles, ShieldCheck, HeartHandshake, MapPin, Stethoscope } from "lucide-react";

export const contact = {
  phone1: "8009537637", phone2: "8920847760", email: "drykkiran@gmail.com",
  address: "#63/2, Shree Sai Layout, Singanayakanahalli, Doddaballapur Main Road, Yelahanka, Bengaluru – 560064",
};
export const whatsapp = `https://wa.me/918009537637?text=${encodeURIComponent("Hello, I would like to enquire about an appointment at Vikshana Eye Hospital.")}`;
export const services = [
  { name: "Ocular Surface Procedures", text: "Focused care for conditions affecting the eye's surface, guided by a careful clinical evaluation.", icon: Sparkles },
  { name: "Foreign Bodies Removal", text: "Prompt professional assessment and removal of particles affecting the eye.", icon: ShieldCheck },
  { name: "Cataract Evaluation", text: "A complete assessment to understand cataracts and discuss suitable care options.", icon: ScanEye },
  { name: "Pediatric Ophthalmology", text: "Gentle eye evaluation for children, supporting healthy visual development.", icon: Baby },
  { name: "Anterior Segment Evaluation", text: "Assessment of the cornea, iris, lens and other structures at the front of the eye.", icon: Eye },
  { name: "Posterior Segment Evaluation", text: "Detailed evaluation of the retina and other structures at the back of the eye.", icon: Focus },
  { name: "Cataract Surgery", text: "Patient-friendly surgical consultation and care planning based on individual needs.", icon: Stethoscope },
  { name: "Refraction", text: "Vision assessment to identify refractive needs and determine an accurate prescription.", icon: Glasses },
  { name: "Squint Evaluation", text: "Assessment of eye alignment and related visual concerns for children and adults.", icon: HeartHandshake },
];
export const directionsUrl = "https://www.google.com/maps/search/?api=1&query=Vikshana+Eye+Hospital+Singanayakanahalli+Yelahanka+Bengaluru+560064";
export const mapEmbed = "https://www.google.com/maps?q=Singanayakanahalli%20Yelahanka%20Bengaluru%20560064&output=embed";