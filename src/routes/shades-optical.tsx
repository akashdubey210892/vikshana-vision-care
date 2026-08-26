import { createFileRoute, Link } from "@tanstack/react-router";
import { Glasses, Sun, Baby, ScanEye, CircleDot, Eye, ShoppingBag } from "lucide-react";
import { Button } from "../components/ui/button";
import { PageHero, SectionTitle } from "../components/site-components";
import optical from "../assets/shades-optical.jpg";

export const Route=createFileRoute("/shades-optical")({head:()=>({meta:[{title:"Optical Shop in Yelahanka | Eyeglasses & Sunglasses | Shades Optical"},{name:"description",content:"Shades Optical Shop in Yelahanka: eyeglasses, spectacles, prescription eyewear, sunglasses, designer frames, computer glasses and blue cut lenses from top branded eyewear names."},{name:"keywords",content:"Optical Shop, Optical Store, Eyeglasses, Spectacles, Prescription Glasses, Prescription Eyewear, Sunglasses, Shades, Designer Frames, Spectacle Frames, Eyewear, Branded Eyewear, Kids Eyewear, Computer Glasses, Blue Cut Lenses, Prescription Sunglasses, Eye Frames, Optical Frame, Contact Lenses, Progressive Lenses, Bifocal Lenses, Premium Lens Brands, ZEISS Lenses"},{property:"og:title",content:"Shades Optical Shop | Vikshana Eye Hospital"},{property:"og:description",content:"Complete your vision care with thoughtfully selected eyewear in Yelahanka."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}],links:[{rel:"canonical",href:"/shades-optical"}]}),component:Optical});

const cats=[["Eyeglasses",Glasses],["Sunglasses",Sun],["Prescription Frames",ScanEye],["Kids Eyewear",Baby],["Lenses",CircleDot]] as const;

type Brand = { name: string; tag?: string };
const brandGroups: { label: string; icon: typeof Eye; brands: Brand[] }[] = [
  { label: "Contact Lenses", icon: Eye, brands: [
    { name: "Bausch + Lomb" },
    { name: "Johnson & Johnson" },
  ] },
  { label: "Lenses", icon: CircleDot, brands: [
    { name: "Zeiss" },
    { name: "Essilor" },
    { name: "Synchrony", tag: "by Zeiss" },
    { name: "GKB Prime" },
  ] },
  { label: "Frames", icon: Glasses, brands: [
    { name: "Ray-Ban" },
    { name: "Fossil" },
    { name: "Vogue Eyewear" },
    { name: "Police" },
    { name: "Calvin Klein" },
    { name: "Titan" },
    { name: "Fastrack" },
    { name: "CR7" },
  ] },
];

function BrandLogo({ name }: { name: string }) {
  const initials = name.split(/[\s+&/-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
  return <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-deep text-sm font-extrabold tracking-wide text-primary-foreground">{initials}</span>;
}

function Optical(){return <><PageHero eyebrow="Shades Optical Shop" title="Complete your vision care with the right eyewear" text="A refined optical experience connected to the care and clarity you expect from Vikshana Eye Hospital."/><section className="section-pad"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2"><img src={optical} alt="Premium eyeglasses and sunglasses on display at an optical shop" className="aspect-[4/3] size-full rounded-lg object-cover shadow-xl"/><div><SectionTitle eyebrow="Eyewear collection" title="Frames and lenses for everyday life" text="Explore categories designed to make future inventory easy to browse. Product availability and prices will be confirmed in-store."/><div className="mt-8 grid grid-cols-2 gap-3">{cats.map(([n,I])=><div key={n} className="flex items-center gap-3 rounded-md border border-border p-4 font-semibold text-brand-deep"><I className="size-5 text-primary"/>{n}</div>)}</div><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/contact">Visit Our Optical Shop</Link></Button><Button asChild size="lg" variant="outline"><Link to="/contact">Contact Us</Link></Button></div></div></div></section>

<section className="section-pad bg-muted">
  <div className="mx-auto max-w-7xl px-4 sm:px-6">
    <SectionTitle eyebrow="Trusted names" title="Brands we stock" text="A curated range of contact lenses, spectacle lenses and frames from globally recognised eyewear brands." center />
    <div className="mt-14 grid gap-10">
      {brandGroups.map(({ label, icon: Icon, brands }) => (
        <div key={label}>
          <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-primary"><Icon className="size-4" />{label}</div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {brands.map((b) => (
              <div key={b.name} className="flex items-center gap-3 rounded-lg border border-border bg-background p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                <BrandLogo name={b.name} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-bold text-brand-deep" title={b.name}>{b.name}</span>
                  {b.tag && <span className="block truncate text-xs text-muted-foreground">{b.tag}</span>}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-4 text-sm font-semibold text-muted-foreground">
              <ShoppingBag className="size-5 shrink-0 text-primary" />More brands in-store
            </div>
          </div>
        </div>
      ))}
    </div>
    <p className="mt-10 max-w-3xl text-xs leading-6 text-muted-foreground">Brand names shown are used for identification only, to indicate the eyewear brands stocked at Shades Optical Shop, and remain the trademarks of their respective owners. Availability of specific models varies—please check with our team in-store.</p>
  </div>
</section>
</>}