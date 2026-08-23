import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, MessageCircle, Instagram, Facebook, Youtube, MapPin, Mail, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import icon from "../assets/Vikshana_logo_only.png";
import textVikshana from "../assets/Vikshana_text.png";
import textEyeCare from "../assets/Vikshana_eye_care.png";
import { contact, services, whatsapp } from "../lib/site-data";

const links = [["Home","/"],["About Us","/about"],["Our Doctors","/doctors"],["Our Services","/services"],["Shades Optical Shop","/shades-optical"],["Contact Us","/contact"]] as const;
const aboutMenu = [["Vikshana Foundation","/about/vikshana-foundation"],["Our Management","/about/our-management"]] as const;

const navLinkClass = "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";
const dropdownItemClass = "block rounded-md px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground";

function BrandMark({dark=false}:{dark?:boolean}){
  return <span className="flex shrink-0 items-center gap-2">
    <img src={icon} alt="" className={`h-14 w-auto shrink-0 rounded-md object-contain sm:h-16 ${dark?"bg-primary-foreground p-1.5":""}`}/>
    <span className={`flex flex-col items-start justify-center gap-1 ${dark?"invert":""}`}>
      <img src={textVikshana} alt="Vikshana..." className="h-14 w-auto object-contain sm:h-16"/>
      <img src={textEyeCare} alt="Eye Care Centre" className="h-3 w-auto object-contain sm:h-3.5"/>
    </span>
  </span>;
}

function DesktopDropdown({label,to,open,setOpen,children}:{label:string,to:"/about"|"/services",open:boolean,setOpen:(v:boolean)=>void,children:React.ReactNode}){
  return <div className="group relative" onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>setOpen(false)} onFocus={()=>setOpen(true)} onBlur={(e)=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}}>
    <Link to={to} className={navLinkClass} activeProps={{className:"bg-accent text-foreground"}}>{label}<ChevronDown className={`size-3.5 transition-transform ${open?"rotate-180":""}`}/></Link>
    <div className={`absolute left-0 top-full z-20 pt-1.5 transition duration-150 ${open?"visible translate-y-0 opacity-100":"invisible -translate-y-1 opacity-0"}`}><div className="rounded-lg border border-border bg-background p-2 shadow-xl">{children}</div></div>
  </div>;
}

export function SiteHeader(){
  const [open,setOpen]=useState(false);
  const [aboutOpen,setAboutOpen]=useState(false);
  const [servicesOpen,setServicesOpen]=useState(false);
  return <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
    <div className="bg-brand-deep text-primary-foreground"><div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6"><span className="flex items-center gap-2"><MapPin className="size-3.5"/>Yelahanka, Bengaluru</span><span className="flex items-center gap-2 font-semibold"><Phone className="size-3.5"/>Call <a href={`tel:${contact.phone1}`}>{contact.phone1}</a>, <a href={`tel:${contact.phone2}`}>{contact.phone2}</a></span></div></div>
    <div className="mx-auto grid h-24 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6">
      <Link to="/" className="flex min-w-0 items-center" onClick={()=>setOpen(false)}><BrandMark/></Link>
      <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
        {links.map(([label,to])=>{
          if(to==="/about")return <DesktopDropdown key={to} label={label} to={to} open={aboutOpen} setOpen={setAboutOpen}>{aboutMenu.map(([l,t])=><Link key={t} to={t} className={dropdownItemClass}>{l}</Link>)}</DesktopDropdown>;
          if(to==="/services")return <DesktopDropdown key={to} label={label} to={to} open={servicesOpen} setOpen={setServicesOpen}><div className="grid w-[520px] grid-cols-2 gap-1">{services.map(s=><Link key={s.slug} to="/services/$slug" params={{slug:s.slug}} className={dropdownItemClass}>{s.name}</Link>)}</div></DesktopDropdown>;
          return <Link key={to} to={to} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent hover:text-foreground" activeProps={{className:"bg-accent text-foreground"}} activeOptions={{exact:to==="/"}}>{label}</Link>;
        })}
        <Button asChild className="ml-2"><Link to="/contact">Book an Appointment</Link></Button>
      </nav>
      <Button variant="ghost" size="icon" className="min-h-11 min-w-11 lg:hidden" aria-label={open?"Close menu":"Open menu"} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</Button>
    </div>
    {open&&<nav className="border-t border-border bg-background px-4 py-4 lg:hidden" aria-label="Mobile navigation"><div className="mx-auto grid max-w-7xl gap-1">
      {links.map(([label,to])=>{
        if(to==="/about")return <details key={to} className="group rounded-md"><summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-4 py-3 font-semibold hover:bg-accent [&::-webkit-details-marker]:hidden"><Link to={to} onClick={()=>setOpen(false)}>{label}</Link><ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180"/></summary><div className="ml-2 grid gap-1 border-l border-border py-1 pl-4">{aboutMenu.map(([l,t])=><Link key={t} to={t} onClick={()=>setOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent">{l}</Link>)}</div></details>;
        if(to==="/services")return <details key={to} className="group rounded-md"><summary className="flex cursor-pointer list-none items-center justify-between rounded-md px-4 py-3 font-semibold hover:bg-accent [&::-webkit-details-marker]:hidden"><Link to={to} onClick={()=>setOpen(false)}>{label}</Link><ChevronDown className="size-4 shrink-0 transition-transform group-open:rotate-180"/></summary><div className="ml-2 grid gap-1 border-l border-border py-1 pl-4">{services.map(s=><Link key={s.slug} to="/services/$slug" params={{slug:s.slug}} onClick={()=>setOpen(false)} className="rounded-md px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent">{s.name}</Link>)}</div></details>;
        return <Link key={to} to={to} onClick={()=>setOpen(false)} className="rounded-md px-4 py-3 font-semibold hover:bg-accent">{label}</Link>;
      })}
      <Button asChild size="lg" className="mt-2"><Link to="/contact" onClick={()=>setOpen(false)}>Book an Appointment</Link></Button>
    </div></nav>}
  </header>;
}
export function SiteFooter(){return <footer className="bg-brand-deep text-primary-foreground"><div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4"><div><BrandMark dark/><p className="mt-4 text-sm leading-7 opacity-80">Comprehensive eye care with compassion, clarity and a patient-first approach.</p><div className="mt-5 flex gap-2">{[Instagram,Facebook,Youtube].map((Icon,i)=><a key={i} href="#" aria-label={["Instagram","Facebook","YouTube"][i]} className="grid size-10 place-items-center rounded-md border border-primary-foreground/20 hover:bg-primary-foreground/10"><Icon className="size-4"/></a>)}</div></div><div><h2 className="font-sans text-base font-bold">Quick Links</h2><div className="mt-4 grid gap-3 text-sm opacity-80">{links.slice(1).map(([l,t])=><Link key={t} to={t} className="hover:opacity-100">{l}</Link>)}</div></div><div><h2 className="font-sans text-base font-bold">Our Services</h2><div className="mt-4 grid gap-3 text-sm opacity-80">{services.slice(2,9).map(s=><Link key={s.name} to="/services">{s.name}</Link>)}</div></div><div><h2 className="font-sans text-base font-bold">Contact</h2><div className="mt-4 grid gap-4 text-sm leading-6 opacity-85"><a href={`tel:${contact.phone1}`} className="flex gap-3"><Phone className="mt-1 size-4 shrink-0"/>{contact.phone1}<br/>{contact.phone2}</a><a href={`mailto:${contact.email}`} className="flex gap-3"><Mail className="mt-1 size-4 shrink-0"/>{contact.email}</a><p className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0"/>{contact.address}</p></div></div></div><div className="border-t border-primary-foreground/10 px-4 py-5 text-xs opacity-70"><div className="mx-auto flex max-w-7xl items-center justify-center"><span>© 2026 Vikshana Eye Hospital. All rights reserved.</span></div></div></footer>}
export function WhatsAppButton(){return <a href={whatsapp} target="_blank" rel="noreferrer" aria-label="Enquire on WhatsApp" className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105"><MessageCircle/></a>}