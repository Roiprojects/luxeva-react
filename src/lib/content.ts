/**
 * Editable content defaults for the public site.
 *
 * CONTENT-INTEGRITY RULES (CLAUDE.md):
 * - No invented hard facts. Contact details, leadership and testimonials are intentionally
 *   EMPTY/NULL until the client supplies verified data → their sections stay hidden.
 * - Imagery uses high-quality licensed stock interiors (per client direction) as
 *   representative design/portfolio visuals; no fabricated project locations/dates.
 * - Draft copy restates the client's own stated scope; flagged as editable placeholder.
 *
 * Every accessor is async so it can be swapped to Supabase queries later with no page changes.
 */

import type {
  ContactDetails,
  Faq,
  Leader,
  Project,
  Service,
  Testimonial,
  WhyChooseItem,
  ProcessStep,
} from "./types";

const IMG = "/assets/stock";

/* Contact — ALL NULL until verified (MISSING_CLIENT_INPUTS §A). */
const contactDetails: ContactDetails = {
  phone: null,
  whatsapp: null,
  email: null,
  address: null,
  mapsEmbedUrl: null,
  workingHours: null,
  socials: [],
};

/* ------------------------------------------------------------------ */
/* Home page editable copy                                              */
/* ------------------------------------------------------------------ */
export const home = {
  hero: {
    eyebrow: "Residential & Commercial Interiors",
    heading: 'Crafted luxury interiors,<br/><span class="text-gradient-gold">designed &amp; delivered</span>',
    subheading:
      "From design and modular woodwork to electricals, finishing and handover — Luxeva Care delivers complete, beautiful interiors for homes and commercial spaces.",
    image: `${IMG}/drive-living/living-3.jpg`,
    images: [
      { src: `${IMG}/drive-false-ceil/false-ceil-4.jpeg`, alt: "Premium false ceiling with integrated LED lighting by Luxeva Care" },
      { src: `${IMG}/drive-kitchen/kitchen-1.jpeg`, alt: "Modern modular kitchen interior" },
      { src: `${IMG}/drive-bedroom/bedroom-1.jpg`, alt: "Warm Indian bedroom interior" },
      { src: `${IMG}/drive-false-ceil/false-ceil-1.jpeg`, alt: "Stunning false ceiling with integrated LED lighting" },
      { src: `${IMG}/drive-living/living-7.jpg`, alt: "Spacious Indian living space" },
    ],
    stats: [
      { label: "End-to-end", value: "Design → Handover" },
      { label: "Services", value: "20+ under one roof" },
      { label: "Focus", value: "Residential & Commercial" },
    ],
  },
  trustStrip: [
    "End-to-End Interior Solutions",
    "Residential Home Interior Specialists",
    "Skilled Carpenters, Electricians & Technicians",
    "Premium Materials & Finishing",
    "On-Time Project Delivery",
    "Transparent Consultation",
  ],
  aboutPreview: {
    eyebrow: "Who we are",
    title: "One accountable partner for your complete interior",
    body: "Luxeva Care Pvt Ltd focuses on premium residential home interiors, with dedicated capability for commercial showroom spaces. Design, skilled trades and execution come together under one roof — so every detail, from space planning to the final finish, is handled with care.",
    image: `${IMG}/living-dr-2.jpg`,
  },
  whyChoose: <WhyChooseItem[]>[
    { title: "Complete service under one roof", description: "Design, carpentry, electrical, plumbing, finishing and installation — coordinated by a single team." },
    { title: "Residential specialists", description: "Our primary focus is premium home interiors for apartments, villas and independent houses." },
    { title: "Skilled technical team", description: "Experienced carpenters, electricians and technicians deliver a dependable, quality finish." },
    { title: "Customised for every home", description: "Every layout, material and unit is planned around how you actually live." },
    { title: "Transparent consultation", description: "Clear planning and communication from first conversation to final handover." },
    { title: "Premium materials & finishing", description: "Considered material selection for a durable, refined result." },
  ],
  designProcess: <ProcessStep[]>[
    { title: "Requirement Discussion", description: "We understand your needs, lifestyle, priorities and budget." },
    { title: "Site Visit & Measurement", description: "On-site analysis and precise measurements of your space." },
    { title: "Design & Space Planning", description: "Layouts, furniture placement, storage and lighting concepts." },
    { title: "Material Selection", description: "Guidance on finishes and materials to match your taste and budget." },
    { title: "Execution & Installation", description: "Skilled trades deliver carpentry, electrical, finishing and installation." },
    { title: "Final Handover", description: "A clean, complete, ready-to-live-in space handed over to you." },
  ],
  materials: {
    eyebrow: "Materials & Workmanship",
    title: "Built to last, finished to impress",
    body: "From modular kitchens and wardrobes to false ceilings, panelling and custom furniture, we combine considered material selection with skilled execution. Every joint, surface and finish is delivered to a standard we'd be proud to live with.",
    images: [`${IMG}/kitchen-dr-3.jpg`, `${IMG}/living-dr-4.jpg`],
  },
};

/* Room categories — the "designs for every room" tiles. */
export type RoomCategory = { title: string; image: string; href: string };
export const roomCategories: RoomCategory[] = [
  { title: "Living Room", image: `${IMG}/drive-living/living-5.jpg`, href: "/services/residential-home-interior" },
  { title: "Modular Kitchen", image: `${IMG}/kitchen-dr-1.jpg`, href: "/services/kitchen-granite-quartz" },
  { title: "Bedroom", image: `${IMG}/bedroom-dr-1.jpg`, href: "/services/custom-beds" },
  { title: "Wardrobe", image: `${IMG}/wardrobe-1.jpg`, href: "/services/carpenter-service" },
  { title: "Bathroom", image: `${IMG}/bathroom-1.jpg`, href: "/services/plumbing-service" },
  { title: "Entertainment", image: `${IMG}/ent-unit-1.jpg`, href: "/services/entertainment-unit" },
  { title: "Temple / Pooja", image: `${IMG}/temple-1.jpg`, href: "/services/temple-unit" },
  { title: "Full Home", image: `${IMG}/living-dr-3.jpg`, href: "/services/residential-home-interior" },
];

/* ------------------------------------------------------------------ */
/* About page editable copy                                             */
/* ------------------------------------------------------------------ */
export const about = {
  intro:
    "Luxeva Care Pvt Ltd is an interior design and execution company delivering complete residential home interiors, with dedicated capability for commercial showroom spaces.",
  story:
    "We founded Luxeva Care to make premium interiors simpler and more trustworthy — bringing design, skilled trades and project execution together so homeowners deal with one accountable partner instead of many. Our primary focus is residential home interiors, and we extend the same standard to commercial showroom projects.",
  mission:
    "To provide homeowners and businesses with customised, high-quality interior services through expert planning, skilled execution and transparent project management.",
  vision:
    "To become a trusted interior solutions brand known for luxury design, reliable execution and complete home transformation services.",
  values: ["Quality", "Trust", "Transparency", "Design Excellence", "Timely Delivery", "Customer Satisfaction", "Safe & Professional Execution"],
  expertise: ["Residential home interiors", "Space planning", "Custom furniture", "Electrical & plumbing coordination", "False ceiling & POP", "Modular kitchen finishing", "Home automation", "Commercial showroom planning"],
  image: `${IMG}/living-dr-3.jpg`,
};

/* ------------------------------------------------------------------ */
/* Services — the client's 20 categories (editable defaults).           */
/* ------------------------------------------------------------------ */
const img = (n: string, alt: string, isRender = false) => ({ src: `${IMG}/img-${n}.jpg`, alt, isRender });
const pic = (file: string, alt: string, isRender = false) => ({ src: `${IMG}/${file}`, alt, isRender });

const services: Service[] = [
  {
    slug: "residential-home-interior",
    title: "Residential Home Interior",
    category: "Residential Interiors",
    shortDescription: "Complete interior design and execution for apartments, villas and independent houses.",
    longDescription:
      "Our flagship service: end-to-end interior design and execution for apartments, villas, independent houses and premium homes. From space planning and custom furniture to lighting, finishing and handover, we manage every detail so your home comes together beautifully and on time.",
    benefits: ["End-to-end design & execution", "Personalised space planning", "Custom furniture & storage", "Coordinated trades under one roof", "Premium finishing"],
    heroImage: pic("drive-living/living-1.jpg", "Elegant Indian home living room interior"),
    gallery: [pic("drive-living/living-2.jpg", "Warm living room with accent wall"), pic("drive-living/living-4.jpg", "Spacious contemporary living space"), pic("drive-living/living-5.jpg", "Modern Indian living room"), pic("drive-living/living-6.jpg", "Open-plan living space with lighting"), pic("drive-living/living-8.jpg", "Stylish Indian living room"), pic("drive-living/living-9.jpg", "Contemporary living room design"), pic("drive-living/living-10.jpg", "Premium home interior")],
    process: home.designProcess,
    featured: true,
    published: true,
  },
  {
    slug: "design-space-planning",
    title: "Design & Space Planning",
    category: "Residential Interiors",
    shortDescription: "Professional consultation to plan layouts, furniture, storage and lighting.",
    longDescription:
      "Professional consultation to plan layouts, furniture placement, storage and lighting so your space works harder and feels calmer. We analyse the site, take measurements and propose a concept and material direction aligned to your budget.",
    benefits: ["Site analysis & measurement", "Layout & furniture planning", "Storage & lighting strategy", "Material & budget guidance", "Design concept direction"],
    heroImage: pic("drive-living/living-11.jpg", "Beautifully planned interior living space"),
    featured: true,
    published: true,
  },
  {
    slug: "carpenter-service",
    title: "Carpentry & Wardrobes",
    category: "Technical Services",
    shortDescription: "Custom carpentry and wardrobes for residential and commercial interiors.",
    longDescription: "Custom carpentry for residential and commercial interiors — wardrobes, kitchen cabinets, TV units, beds, storage units, wall panels, office tables, dining units and custom shelves, all built to fit your space.",
    benefits: ["Wardrobes & storage", "Kitchen cabinets", "TV & media units", "Beds & dining units", "Custom shelving & panels"],
    heroImage: pic("drive-wardrobe/wardrobe-1.jpeg", "Modern custom wardrobe with mirror"),
    gallery: [pic("drive-wardrobe/wardrobe-2.jpeg", "Sliding wardrobe with mirror"), pic("drive-wardrobe/wardrobe-3.jpeg", "Walk-in wardrobe with shelving"), pic("drive-wardrobe/wardrobe-4.jpeg", "Built-in wardrobe design"), pic("drive-wardrobe/wardrobe-5.jpeg", "Custom wardrobe storage"), pic("drive-wardrobe/wardrobe-6.jpeg", "Wardrobe with integrated lighting"), pic("drive-wardrobe/wardrobe-7.jpeg", "Custom fitted wardrobe"), pic("drive-wardrobe/wardrobe-8.jpeg", "Modern wardrobe design")],
    published: true,
  },
  {
    slug: "electrician-service",
    title: "Electrical Works",
    category: "Technical Services",
    shortDescription: "Electrical planning and execution for interior projects.",
    longDescription: "Electrical planning and execution for interior projects — wiring, switchboard setup, lighting circuits and safe, tidy installations coordinated with the overall interior.",
    benefits: ["Wiring & switchboards", "Lighting circuits", "Concealed, tidy runs", "Coordinated with interiors", "Safe execution"],
    heroImage: pic("drive-false-ceil/false-ceil-2.jpeg", "Layered interior lighting and false ceiling"),
    published: true,
  },
  {
    slug: "false-ceiling-pop",
    title: "False Ceiling & POP",
    category: "Technical Services",
    shortDescription: "False ceiling and POP work with integrated lighting.",
    longDescription: "False ceiling and POP work that shapes each room and integrates lighting cleanly — from simple cove detailing to statement ceilings for living and dining spaces.",
    benefits: ["Cove & profile ceilings", "Integrated lighting", "Clean, level finishes", "Living & bedroom detailing"],
    heroImage: pic("drive-false-ceil/false-ceil-1.jpeg", "Stunning wavy false ceiling with integrated LED lighting"),
    gallery: [pic("drive-false-ceil/false-ceil-3.jpeg", "Cove ceiling with warm accent lighting"), pic("drive-false-ceil/false-ceil-4.jpeg", "Modern POP ceiling design"), pic("drive-false-ceil/false-ceil-5.jpeg", "False ceiling with recessed lights"), pic("drive-false-ceil/false-ceil-6.jpeg", "Bedroom false ceiling detail"), pic("drive-false-ceil/false-ceil-7.jpeg", "Living room false ceiling"), pic("drive-false-ceil/false-ceil-8.jpeg", "Premium ceiling design")],
    featured: true,
    published: true,
  },
  {
    slug: "home-automation",
    title: "Home Automation",
    category: "Safety & Smart Home",
    shortDescription: "Smart lighting, controls and automation for modern homes.",
    longDescription: "Bring convenience and control to your home with smart lighting, controls and automation, planned into the interior from the start for a clean, integrated result.",
    benefits: ["Smart lighting & scenes", "Centralised controls", "Planned into the interior", "Convenience & efficiency"],
    heroImage: pic("drive-ent-unit/ent-unit-1.jpeg", "Smart home entertainment unit with integrated lighting"),
    featured: true,
    published: true,
  },
  {
    slug: "plumbing-service",
    title: "Plumbing Services",
    category: "Technical Services",
    shortDescription: "Plumbing coordination for kitchens, bathrooms and utility areas.",
    longDescription: "Reliable plumbing coordination for kitchens, bathrooms and utility areas, aligned with your layout and finishes for a leak-free, well-planned result.",
    benefits: ["Kitchen & bathroom plumbing", "Utility planning", "Coordinated with fit-out", "Reliable execution"],
    heroImage: pic("drive-bathroom/bathroom-1.jpeg", "Modern bathroom with premium fixtures"),
    published: true,
  },
  {
    slug: "kitchen-granite-quartz",
    title: "Modular Kitchen & Countertops",
    category: "Kitchen & Surface Works",
    shortDescription: "Modular kitchens with chimney, cabinetry and granite/quartz countertops.",
    longDescription: "Beautiful, functional modular kitchens — cabinetry, chimney, cooktop and precise countertop fixing in granite and quartz, with accurate cuts, clean joints and durable surfaces that stand up to daily use.",
    benefits: ["Modular kitchen design", "Chimney & cooktop fitting", "Granite & quartz countertops", "Precise cutting & fixing", "Durable surfaces"],
    heroImage: pic("drive-kitchen/kitchen-1.jpeg", "Modern modular kitchen with sleek cabinetry"),
    gallery: [
      pic("drive-kitchen/kitchen-2.jpeg", "White modular kitchen with marble backsplash"),
      pic("drive-kitchen/kitchen-3.jpeg", "Contemporary modular kitchen with island"),
      pic("drive-kitchen/kitchen-4.jpeg", "Sleek kitchen with chimney and quartz countertop"),
      pic("drive-kitchen/kitchen-5.jpeg", "Open kitchen with wood and white finish"),
      pic("drive-kitchen/kitchen-6.jpeg", "Modern kitchen with dark cabinetry"),
      pic("drive-kitchen/kitchen-7.jpeg", "Compact modular kitchen design"),
      pic("drive-kitchen/kitchen-8.jpeg", "L-shaped modular kitchen with backsplash"),
      pic("drive-kitchen/kitchen-9.jpeg", "Premium kitchen with integrated appliances"),
      pic("drive-kitchen/kitchen-10.jpeg", "Modern kitchen with quartz countertop"),
      pic("drive-kitchen/kitchen-11.jpeg", "Stylish modular kitchen"),
      pic("drive-kitchen/kitchen-12.jpeg", "Elegant kitchen interior"),
    ],
    featured: true,
    published: true,
  },
  {
    slug: "tiles-bathroom-work",
    title: "Tiles & Bathroom Work",
    category: "Kitchen & Surface Works",
    shortDescription: "Kitchen and bathroom tiling, waterproofing and finishing.",
    longDescription: "Expert kitchen and bathroom tile work — floor and wall tiling, backsplashes, shower areas and vanities, with proper waterproofing, level surfaces and clean grout lines for a lasting, premium finish.",
    benefits: ["Kitchen & bathroom tiling", "Wall & floor tiles", "Backsplash & shower areas", "Waterproofing", "Clean grouting & finish"],
    heroImage: pic("drive-bathroom/bathroom-2.jpeg", "Luxurious modern bathroom with premium tiles"),
    gallery: [pic("drive-bathroom/bathroom-3.jpeg", "Elegant bathroom with marble tiles"), pic("drive-bathroom/bathroom-4.jpeg", "Contemporary bathroom vanity"), pic("drive-bathroom/bathroom-5.jpeg", "Spacious bathroom with walk-in shower"), pic("drive-bathroom/bathroom-6.jpeg", "Modern bathroom tile design"), pic("drive-bathroom/bathroom-7.jpeg", "Premium bathroom finish"), pic("drive-bathroom/bathroom-8.jpeg", "Bathroom with designer tiles")],
    featured: true,
    published: true,
  },
  {
    slug: "invisible-grills",
    title: "Invisible Grills",
    category: "Safety & Smart Home",
    shortDescription: "Safety without compromising your view or facade.",
    longDescription: "Invisible grills provide safety for balconies and windows while preserving your view and the look of your facade — a discreet, modern alternative to conventional grills.",
    benefits: ["Unobstructed views", "Balcony & window safety", "Weather-resistant", "Clean, modern look"],
    heroImage: pic("invisible-grills.jpg", "Home with glass balcony railings and full-height windows"),
    published: true,
  },
  {
    slug: "fabrication-works",
    title: "Fabrication Works",
    category: "Technical Services",
    shortDescription: "Custom metal fabrication for interiors and safety.",
    longDescription: "Custom metal fabrication for railings, frames, partitions and safety elements, made to measure and finished to suit your interior.",
    benefits: ["Railings & frames", "Partitions", "Made to measure", "Durable finishes"],
    heroImage: pic("fabrication-weld.jpg", "Metal fabrication welding work"),
    published: true,
  },
  {
    slug: "digital-locks",
    title: "Digital Locks",
    category: "Safety & Smart Home",
    shortDescription: "Keyless, secure digital lock supply and installation.",
    longDescription: "Modern keyless security with digital lock supply and installation for main doors and interiors — convenient access with dependable security.",
    benefits: ["Keyless entry", "Modern security", "Supply & installation", "Convenient access"],
    heroImage: pic("smart-lock.jpg", "Smart digital door lock controlled from a phone app"),
    published: true,
  },
  {
    slug: "custom-beds",
    title: "Custom Beds & Bedrooms",
    category: "Custom Furniture",
    shortDescription: "Made-to-measure beds and complete bedroom interiors.",
    longDescription: "Made-to-measure beds and complete bedroom interiors designed around your space — with integrated storage, considered headboards and finishes that match your interior.",
    benefits: ["Made to measure", "Integrated storage", "Custom headboards", "Matched finishes"],
    heroImage: pic("drive-bedroom/bedroom-1.jpg", "Modern Indian bedroom with LED platform bed and full-height wardrobe"),
    gallery: [pic("drive-bedroom/bedroom-2.jpg", "Warm bedroom with wood panelling"), pic("drive-bedroom/bedroom-3.jpg", "Contemporary master bedroom design"), pic("drive-bedroom/bedroom-4.jpg", "Minimalist bedroom with integrated storage"), pic("drive-bedroom/bedroom-5.jpeg", "Bedroom with accent wall and lighting")],
    featured: true,
    published: true,
  },
  {
    slug: "sofa-design",
    title: "Sofa Design",
    category: "Custom Furniture",
    shortDescription: "Custom sofas sized and styled for your living space.",
    longDescription: "Custom sofas sized and styled for your living space — comfortable, durable and finished in fabrics that suit your interior and lifestyle.",
    benefits: ["Sized to your space", "Comfort-first build", "Fabric selection", "Durable frames"],
    heroImage: pic("drive-living/living-12.jpg", "Elegant sofa and living room interior"),
    published: true,
  },
  {
    slug: "dining-table",
    title: "Dining Solutions",
    category: "Custom Furniture",
    shortDescription: "Custom dining tables and units for your home.",
    longDescription: "Custom dining tables and units designed to seat your family comfortably and complement the surrounding interior.",
    benefits: ["Custom sizing", "Matched to interior", "Durable materials", "Seating planned around you"],
    heroImage: pic("dining.jpg", "Elegant dining table with place settings"),
    published: true,
  },
  {
    slug: "upvc-windows-partitions",
    title: "UPVC Windows & Partitions",
    category: "Technical Services",
    shortDescription: "UPVC windows and partitions for comfort and efficiency.",
    longDescription: "UPVC windows and partitions that improve insulation, reduce noise and give a clean, low-maintenance finish, installed precisely as part of your interior.",
    benefits: ["Thermal & sound insulation", "Low maintenance", "Precise installation", "Clean modern look"],
    heroImage: pic("facade-windows.jpg", "Modern building facade with windows and partitions"),
    published: true,
  },
  {
    slug: "entertainment-unit",
    title: "Entertainment Unit",
    category: "Custom Furniture",
    shortDescription: "Custom TV and media units with storage and lighting.",
    longDescription: "Custom entertainment units with media consoles, storage, floating shelves, display cabinets and LED back-panels — a focal point for your living room.",
    benefits: ["Media console & storage", "Floating shelves", "LED back panel", "Display cabinets"],
    heroImage: pic("drive-ent-unit/ent-unit-1.jpeg", "Modern TV unit with marble panel, fluted sides and display shelving"),
    gallery: [pic("drive-ent-unit/ent-unit-2.jpeg", "Entertainment wall with LED backlit shelves"), pic("drive-ent-unit/ent-unit-3.jpeg", "Contemporary media unit with storage"), pic("drive-ent-unit/ent-unit-4.jpeg", "Floating entertainment unit design")],
    featured: true,
    published: true,
  },
  {
    slug: "study-home-office",
    title: "Study / Home-Office Setup",
    category: "Custom Furniture",
    shortDescription: "Ergonomic study tables and compact home-office setups.",
    longDescription: "Home-office and study setups for students and professionals — study tables, work desks, wall shelves, storage and ergonomic, well-lit layouts.",
    benefits: ["Study & work desks", "Wall shelves & storage", "Ergonomic layout", "Task lighting"],
    heroImage: pic("drive-living/living-13.jpg", "Modern study and home office interior"),
    published: true,
  },
  {
    slug: "office-furniture",
    title: "Office Furniture",
    category: "Custom Furniture",
    shortDescription: "Custom workstations, desks and storage for offices and workspaces.",
    longDescription: "Custom office furniture for homes and commercial workspaces — workstations, executive desks, storage cabinets, meeting tables and reception units, built to fit your space and organised for how your team works.",
    benefits: ["Workstations & desks", "Storage & filing units", "Meeting & reception units", "Ergonomic layouts", "Durable commercial finishes"],
    heroImage: pic("office-desk.jpg", "Modern office desk and workstation setup"),
    published: true,
  },
  {
    slug: "temple-unit",
    title: "Temple / Pooja Unit",
    category: "Custom Furniture",
    shortDescription: "Customised pooja room and temple unit designs.",
    longDescription: "Customised pooja room and temple units — wall-mounted, wooden, marble or compact apartment designs with LED lighting and integrated storage.",
    benefits: ["Wall-mounted or standing", "Wooden & marble options", "LED lighting", "Compact apartment designs"],
    heroImage: pic("drive-temples/temples-1.jpeg", "Marble pooja unit with backlit Om mandala and fluted panels"),
    gallery: [
      pic("drive-temples/temples-2.jpeg", "Arched niche pooja unit with gold lotus motifs"),
      pic("drive-temples/temples-3.jpeg", "Wooden mandir with carved mandala backdrop and hanging diyas"),
      pic("drive-temples/temples-4.jpeg", "Backlit wooden temple with Om mandala and stepped platform"),
      pic("drive-temples/temples-5.jpeg", "Wooden pooja unit with backlit Om and lettering"),
      pic("drive-temples/temples-6.jpeg", "Wooden mandir cabinet with jaali doors"),
      pic("drive-temples/temples-7.jpeg", "Wooden temple with peacock-feather jaali side panels"),
      pic("drive-temples/temples-8.jpeg", "Compact wooden pooja unit with Om jaali panel"),
    ],
    featured: true,
    published: true,
  },
  {
    slug: "wallpaper",
    title: "Wallpaper & Wall Design",
    category: "Kitchen & Surface Works",
    shortDescription: "Wall design and wallpaper installation for homes and businesses.",
    longDescription: "Wall design and wallpaper installation for bedrooms, living rooms, kids' rooms and commercial spaces — textured, luxury and custom wall coverings, professionally fitted.",
    benefits: ["Bedroom & living room", "Textured & luxury coverings", "Kids' room designs", "Professional installation"],
    heroImage: pic("bedroom-dr-4.jpg", "Feature wall with textured finish and accent lighting"),
    published: true,
  },
  {
    slug: "commercial-showroom-interior",
    title: "Commercial & Showroom Interior",
    category: "Commercial Interiors",
    shortDescription: "Complete showroom and commercial interior design and execution.",
    longDescription: "Complete showroom interior design and execution for retail businesses — layout planning, product display units, billing counters, lighting, branding walls, customer-flow planning and premium finishing.",
    benefits: ["Layout & customer flow", "Display units & counters", "Branding wall", "Lighting & finishing"],
    heroImage: pic("commercial-office.jpg", "Modern commercial office with glass partitions"),
    gallery: [pic("living-dr-6.jpg", "Modern commercial interior"), pic("kitchen-dr-8.jpg", "Commercial kitchen and showroom"), pic("ent-unit-6.jpg", "Showroom display unit")],
    featured: true,
    published: true,
  },
];

/* ------------------------------------------------------------------ */
/* Portfolio — representative interior design projects.                 */
/* location / completionInfo left undefined (unverified) → hidden.      */
/* ------------------------------------------------------------------ */
const projects: Project[] = [
  {
    slug: "contemporary-apartment-living",
    title: "Contemporary Apartment Living",
    category: "residential",
    summary: "A warm, contemporary living space with layered lighting and custom joinery.",
    description: "A complete residential living space combining custom joinery, layered lighting and a refined material palette for a calm, premium result.",
    style: "Contemporary",
    scope: ["Space planning", "Custom joinery", "False ceiling & lighting", "Feature walls"],
    cover: pic("drive-living/living-14.jpg", "Contemporary Indian apartment living room"),
    gallery: [pic("living-dr-2.jpg", "Living room overview"), pic("living-dr-3.jpg", "Open living space"), pic("living-dr-6.jpg", "Living detail"), pic("living-dr-7.jpg", "Open living space")],
    featured: true,
    published: true,
  },
  {
    slug: "modular-kitchen-makeover",
    title: "Modular Kitchen Makeover",
    category: "residential",
    summary: "A functional, beautiful modular kitchen with durable stone countertops.",
    description: "A modular kitchen designed for real cooking — smart storage, efficient work triangle, and durable granite/quartz countertops with a clean, modern finish.",
    style: "Modern",
    scope: ["Modular cabinetry", "Countertops", "Lighting", "Backsplash"],
    cover: pic("kitchen-dr-1.jpg", "Modern modular kitchen makeover"),
    gallery: [
      pic("kitchen-dr-2.jpg", "White modular kitchen"),
      pic("kitchen-dr-3.jpg", "Contemporary modular kitchen"),
      pic("kitchen-dr-4.jpg", "Sleek kitchen with chimney"),
    ],
    featured: true,
    published: true,
  },
  {
    slug: "serene-master-bedroom",
    title: "Serene Master Bedroom",
    category: "residential",
    summary: "A restful master bedroom with custom bed, wardrobe and soft lighting.",
    description: "A calm, layered master bedroom with a custom bed, full-height wardrobe, wall panelling and warm, dimmable lighting.",
    style: "Warm minimal",
    scope: ["Custom bed", "Wardrobe", "Wall panelling", "Lighting"],
    cover: pic("bedroom-dr-1.jpg", "Serene modern master bedroom"),
    gallery: [pic("bedroom-dr-2.jpg", "Bedroom with wood panelling"), pic("bedroom-dr-3.jpg", "Contemporary bedroom design"), pic("wardrobe-1.jpg", "Custom wardrobe with backlit vanity"), pic("wardrobe-2.jpg", "Built-in wardrobe detail")],
    featured: true,
    published: true,
  },
  {
    slug: "full-home-villa",
    title: "Full-Home Villa Interior",
    category: "residential",
    summary: "An end-to-end villa interior across living, dining, bedrooms and more.",
    description: "A full-home villa project delivered end to end — living and dining, bedrooms, kitchen and finishing coordinated by a single team for a cohesive result.",
    style: "Modern classic",
    scope: ["Full-home design", "Custom furniture", "Finishes", "Lighting"],
    cover: pic("living-dr-7.jpg", "Full-home villa interior living space"),
    gallery: [pic("kitchen-dr-1.jpg", "Villa modular kitchen"), pic("bedroom-dr-1.jpg", "Villa master bedroom"), pic("false-ceil-1.jpg", "Villa false ceiling with lighting"), pic("ent-unit-1.jpg", "Villa entertainment unit")],
    featured: true,
    published: true,
  },
  {
    slug: "luxe-living-dining",
    title: "Luxe Living & Dining",
    category: "residential",
    summary: "An open living-and-dining layout with a refined, gallery-style palette.",
    description: "An open living-and-dining space with a gallery wall, statement lighting and a warm, refined material palette.",
    style: "Refined contemporary",
    scope: ["Living & dining", "Gallery wall", "Lighting", "Furniture"],
    cover: pic("living-dr-6.jpg", "Luxe open living and dining space"),
    gallery: [pic("living-dr-7.jpg", "Dining area detail"), pic("living-dr-8.jpg", "Living gallery wall"), pic("kitchen-dr-8.jpg", "Open plan kitchen and dining"), pic("ent-unit-5.jpg", "Living entertainment area")],
    published: true,
  },
  {
    slug: "smart-modern-home",
    title: "Smart & Modern Home",
    category: "residential",
    summary: "A modern home with integrated automation and a media feature wall.",
    description: "A modern home with home automation planned into the interior — smart lighting, a media feature wall and clean, minimal detailing throughout.",
    style: "Smart modern",
    scope: ["Home automation", "Entertainment unit", "Lighting", "Minimal detailing"],
    cover: pic("ent-unit-6.jpg", "Smart home entertainment feature wall"),
    gallery: [pic("ent-unit-2.jpg", "Entertainment unit with LED shelving"), pic("false-ceil-2.jpg", "Smart ceiling lighting"), pic("living-dr-5.jpg", "Modern smart living room"), pic("false-ceil-3.jpg", "Layered ceiling lighting design")],
    published: true,
  },
];

/* FAQ — client's questions with truthful, scope-based answers. */
const faqs: Faq[] = [
  { question: "How much does a home interior cost?", answer: "Every project is customised, so cost depends on the scope, materials and finishes you choose. Share your requirements and we'll prepare a tailored quote for your space.", category: "Pricing" },
  { question: "Do you provide complete end-to-end service?", answer: "Yes. Luxeva Care handles the complete interior — from design consultation and space planning through carpentry, electrical, plumbing, finishing and final handover.", category: "Services" },
  { question: "Can I book only carpentry, electrical or plumbing work?", answer: "Yes. While we specialise in complete interiors, individual technical services can also be requested. Tell us what you need and we'll advise.", category: "Services" },
  { question: "Do you work on apartments and villas?", answer: "Yes. We deliver interiors for apartments, villas and independent houses, tailoring the approach to each home.", category: "Services" },
  { question: "Do you provide commercial showroom interiors?", answer: "Yes. Alongside our residential focus, we design and execute commercial showroom interiors including layout, display units, lighting and branding.", category: "Commercial" },
  { question: "Do you provide a consultation first?", answer: "Yes. We begin with a requirement discussion and site visit so the design and plan are based on your actual space, needs and budget.", category: "Process" },
];

/* EMPTY until the client supplies verified data → sections hidden. */
const testimonials: Testimonial[] = [];
const leadership: Leader[] = [
  {
    name: "Dr. Atul Kumar Yadav",
    roleType: "Founder and CEO",
    bio: "Visionary leader with 15+ years in interior design and project execution, driving Luxeva Care's mission to redefine premium interiors.",
    photo: { src: `/assets/stock/founder-atul.jpg`, alt: "Dr. Atul Kumar Yadav" },
    published: true
  },
  {
    name: "Rakesh Jha",
    roleType: "Mentor",
    bio: "Experienced mentor providing strategic guidance and industry expertise to elevate design and execution standards.",
    photo: { src: `/assets/stock/founder-rohit.jpg`, alt: "Rakesh Jha" },
    published: true
  },
  {
    name: "CA Samiti Jain",
    roleType: "Co-Founder / Promoter",
    bio: "Co-founder and CFO bringing financial strategy and business acumen to drive Luxeva Care's growth and operational excellence.",
    photo: { src: `/assets/stock/founder-samiti.jpg`, alt: "CA Samiti Jain" },
    published: true
  }
];

/* Accessors */
export function getContactDetails(): ContactDetails { return contactDetails; }
export function getServices(): Service[] { return services.filter((s) => s.published); }
export function getFeaturedServices(): Service[] { return services.filter((s) => s.published && s.featured); }
export function getService(slug: string): Service | undefined { return services.find((s) => s.published && s.slug === slug); }
export function getProjects(): Project[] { return projects.filter((p) => p.published); }
export function getFeaturedProjects(): Project[] { return projects.filter((p) => p.published && p.featured); }
export function getProject(slug: string): Project | undefined { return projects.find((p) => p.published && p.slug === slug); }
export function getFaqs(): Faq[] { return faqs; }
export function getTestimonials(): Testimonial[] { return testimonials.filter((t) => t.published); }
export function getLeadership(): Leader[] { return leadership.filter((l) => l.published); }
