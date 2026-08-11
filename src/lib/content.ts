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
const defaultContactDetails: ContactDetails = {
  phone: "+91 9900026502",
  whatsapp: "+91 9900026502",
  email: "atul.kumar@luxevacare.com",
  address: null,
  mapsEmbedUrl: null,
  workingHours: null,
  socials: [],
};

/* ------------------------------------------------------------------ */
/* Home page editable copy                                              */
/* ------------------------------------------------------------------ */
const defaultHome = {
  hero: {
    eyebrow: "Residential & Commercial Interiors",
    heading: 'Crafted luxury interiors,<br/><span class="text-gradient-gold">designed &amp; delivered</span>',
    subheading:
      "From design and modular woodwork to electricals, finishing and handover — Luxeva Care delivers complete, beautiful interiors for homes and commercial spaces.",
    image: `${IMG}/living-dr-2.jpg`,
    images: [
      { src: `${IMG}/living-dr-2.jpg`, alt: "Modern Indian living room with designer pendant lights" },
      { src: `${IMG}/indian-living-2.jpg`, alt: "Spacious Indian living room with natural light" },
      { src: `${IMG}/kitchen-green.jpg`, alt: "Indian modular kitchen with practical storage" },
      { src: `${IMG}/false-ceil-1.jpg`, alt: "Stunning false ceiling with integrated LED lighting" },
      { src: `${IMG}/indian-bedroom-2.jpg`, alt: "Indian bedroom interior with custom storage" },
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
    image: `${IMG}/indian-living-2.jpg`,
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
const defaultRoomCategories: RoomCategory[] = [
  { title: "Living Room", image: `${IMG}/living-dr-2.jpg`, href: "/services/residential-home-interior" },
  { title: "Modular Kitchen", image: `${IMG}/kitchen-dr-1.jpg`, href: "/services/kitchen-granite-quartz" },
  { title: "Bedroom", image: `${IMG}/indian-bedroom-2.jpg`, href: "/services/custom-beds" },
  { title: "Wardrobe", image: `${IMG}/wardrobe-1.jpg`, href: "/services/carpenter-service" },
  { title: "Bathroom", image: `${IMG}/bathroom-6.jpg`, href: "/services/tiles-bathroom-work" },
  { title: "Plumbing", image: `${IMG}/bathroom-5.jpg`, href: "/services/plumbing-service" },
  { title: "Entertainment", image: `${IMG}/ent-unit-1.jpg`, href: "/services/entertainment-unit" },
  { title: "Temple / Pooja", image: `${IMG}/temple-1.jpg`, href: "/services/temple-unit" },
  { title: "Full Home", image: `${IMG}/living-dr-3.jpg`, href: "/services/residential-home-interior" },
];

/* ------------------------------------------------------------------ */
/* About page editable copy                                             */
/* ------------------------------------------------------------------ */
const defaultAbout = {
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

const defaultServices: Service[] = [
  {
    slug: "residential-home-interior",
    title: "Residential Home Interior",
    category: "Residential Interiors",
    shortDescription: "Complete interior design and execution for apartments, villas and independent houses.",
    longDescription:
      "Our flagship service: end-to-end interior design and execution for apartments, villas, independent houses and premium homes. From space planning and custom furniture to lighting, finishing and handover, we manage every detail so your home comes together beautifully and on time.",
    benefits: ["End-to-end design & execution", "Personalised space planning", "Custom furniture & storage", "Coordinated trades under one roof", "Premium finishing"],
    heroImage: pic("living-dr-7.jpg", "Warm, complete residential home interior with coordinated living furniture"),
    gallery: [pic("living-dr-4.jpg", "Modern Indian living room"), pic("img-16.jpg", "Stylish residential interior"), pic("img-17.jpg", "Elegant home interior space"), pic("img-18.jpg", "Premium home interior detail")],
    process: defaultHome.designProcess,
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
    heroImage: pic("living-dr-2.jpg", "Beautifully planned living interior with balanced space planning"),
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
    heroImage: pic("wardrobe-1.jpg", "Modern white wardrobe with scalloped doors and backlit vanity"),
    gallery: [pic("wardrobe-2.jpg", "Sliding wardrobe with mirror"), pic("wardrobe-3.jpg", "Walk-in wardrobe with shelving"), pic("wardrobe-4.jpg", "Built-in wardrobe design"), pic("wardrobe-5.jpg", "Custom wardrobe storage")],
    published: true,
  },
  {
    slug: "electrician-service",
    title: "Electrical Works",
    category: "Technical Services",
    shortDescription: "Electrical planning and execution for interior projects.",
    longDescription: "Electrical planning and execution for interior projects — wiring, switchboard setup, lighting circuits and safe, tidy installations coordinated with the overall interior.",
    benefits: ["Wiring & switchboards", "Lighting circuits", "Concealed, tidy runs", "Coordinated with interiors", "Safe execution"],
    heroImage: pic("false-ceil-6.jpg", "Residential electrical lighting and ceiling installation"),
    gallery: [
      pic("img-00.jpg", "Interior electrical wiring and switchboard setup"),
      pic("img-01.jpg", "Concealed wiring installation in progress"),
      pic("img-02.jpg", "Lighting circuit installation work"),
      pic("img-03.jpg", "Professional electrical switchboard fitting"),
    ],
    published: true,
  },
  {
    slug: "false-ceiling-pop",
    title: "False Ceiling & POP",
    category: "Technical Services",
    shortDescription: "False ceiling and POP work with integrated lighting.",
    longDescription: "False ceiling and POP work that shapes each room and integrates lighting cleanly — from simple cove detailing to statement ceilings for living and dining spaces.",
    benefits: ["Cove & profile ceilings", "Integrated lighting", "Clean, level finishes", "Living & bedroom detailing"],
    heroImage: pic("false-ceil-4.jpg", "Modern false ceiling design with geometric integrated lighting"),
    gallery: [pic("false-ceil-1.jpg", "Curved false ceiling with integrated lighting"), pic("false-ceil-2.jpg", "Cove ceiling with warm accent lighting"), pic("false-ceil-3.jpg", "Modern POP ceiling design"), pic("false-ceil-5.jpg", "Bedroom false ceiling detail")],
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
    heroImage: pic("ent-unit-6.jpg", "Smart-ready entertainment wall with integrated lighting and media controls"),
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
    heroImage: pic("plumbing-tap.jpg", "Modern plumbing fixture installation in a premium bathroom"),
    gallery: [
      pic("bathroom-2.jpg", "Contemporary bathroom shower panel installation"),
      pic("bathroom-3.jpg", "Indian bathroom with premium marble wall shelves"),
      pic("bathroom-4.jpg", "Spacious bathroom with walk-in shower area"),
    ],
    published: true,
  },
  {
    slug: "kitchen-granite-quartz",
    title: "Modular Kitchen & Countertops",
    category: "Kitchen & Surface Works",
    shortDescription: "Modular kitchens with chimney, cabinetry and granite/quartz countertops.",
    longDescription: "Beautiful, functional modular kitchens — cabinetry, chimney, cooktop and precise countertop fixing in granite and quartz, with accurate cuts, clean joints and durable surfaces that stand up to daily use.",
    benefits: ["Modular kitchen design", "Chimney & cooktop fitting", "Granite & quartz countertops", "Precise cutting & fixing", "Durable surfaces"],
    heroImage: pic("kitchen-dr-1.jpg", "Modern modular kitchen with green cabinets and gold fittings"),
    gallery: [
      pic("kitchen-dr-2.jpg", "White modular kitchen with marble backsplash"),
      pic("kitchen-dr-3.jpg", "Contemporary modular kitchen with island"),
      pic("kitchen-dr-4.jpg", "Sleek kitchen with chimney and quartz countertop"),
      pic("kitchen-grey.jpg", "Grey modular kitchen with clean countertop lines"),
      pic("kitchen-dr-6.jpg", "Modern kitchen with dark cabinetry"),
      pic("kitchen-dr-7.jpg", "Compact modular kitchen design"),
      pic("kitchen-dr-8.jpg", "L-shaped modular kitchen with backsplash"),
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
    heroImage: pic("bathroom-5.jpg", "Luxurious modern bathroom with sculpted vanity lighting"),
    gallery: [
      pic("bathroom-6.jpg", "Modern marble bathroom with round mirror and glass shower"),
      pic("bathroom-tiles.jpg", "Bright bathroom with glass shower enclosure and stone vanity"),
      pic("img-04.jpg", "Premium tile work in a bathroom renovation"),
      pic("img-05.jpg", "Beautifully finished bathroom tiling and grouting"),
    ],
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
    heroImage: pic("bedroom-dr-1.jpg", "Modern Indian bedroom with LED platform bed and full-height wardrobe"),
    gallery: [pic("bedroom-dr-2.jpg", "Warm bedroom with wood panelling"), pic("bedroom-dr-3.jpg", "Contemporary master bedroom design"), pic("bedroom-dr-4.jpg", "Minimalist bedroom with integrated storage"), pic("bedroom-dr-5.jpg", "Bedroom with accent wall and lighting")],
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
    heroImage: pic("living-dr-5.jpg", "Elegant sofa and living room interior"),
    gallery: [
      pic("living-dr-3.jpg", "Contemporary sofa-led living space"),
      pic("living-dr-6.jpg", "Curated living room seating with custom sofa styling"),
      pic("img-19.jpg", "Premium custom sofa arrangement"),
      pic("img-20.jpg", "Stylish living room seating with plush upholstery"),
    ],
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
    gallery: [
      pic("kitchen-dine.jpg", "Dining area connected to the kitchen"),
      pic("kitchen-open.jpg", "Open-plan kitchen and dining composition"),
      pic("img-06.jpg", "Custom dining table in a well-designed space"),
    ],
    published: true,
  },
  {
    slug: "upvc-windows-partitions",
    title: "UPVC Windows & Partitions",
    category: "Technical Services",
    shortDescription: "UPVC windows and partitions for comfort and efficiency.",
    longDescription: "UPVC windows and partitions that improve insulation, reduce noise and give a clean, low-maintenance finish, installed precisely as part of your interior.",
    benefits: ["Thermal & sound insulation", "Low maintenance", "Precise installation", "Clean modern look"],
    heroImage: pic("facade-windows.jpg", "Large modern window system and partition detailing"),
    published: true,
  },
  {
    slug: "entertainment-unit",
    title: "Entertainment Unit",
    category: "Custom Furniture",
    shortDescription: "Custom TV and media units with storage and lighting.",
    longDescription: "Custom entertainment units with media consoles, storage, floating shelves, display cabinets and LED back-panels — a focal point for your living room.",
    benefits: ["Media console & storage", "Floating shelves", "LED back panel", "Display cabinets"],
    heroImage: pic("ent-unit-1.jpg", "Modern TV unit with marble panel, fluted sides and display shelving"),
    gallery: [pic("ent-unit-2.jpg", "Entertainment wall with LED backlit shelves"), pic("ent-unit-3.jpg", "Contemporary media unit with storage"), pic("ent-unit-4.jpg", "Floating entertainment unit design"), pic("ent-unit-5.jpg", "TV unit with display cabinets")],
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
    heroImage: pic("img-07.jpg", "Compact home-office desk setup with storage and task seating"),
    gallery: [
      pic("img-08.jpg", "Dedicated study table and bookshelf setup"),
      pic("img-09.jpg", "Home-office workstation with ergonomic layout"),
    ],
    published: true,
  },
  {
    slug: "office-furniture",
    title: "Office Furniture",
    category: "Custom Furniture",
    shortDescription: "Custom workstations, desks and storage for offices and workspaces.",
    longDescription: "Custom office furniture for homes and commercial workspaces — workstations, executive desks, storage cabinets, meeting tables and reception units, built to fit your space and organised for how your team works.",
    benefits: ["Workstations & desks", "Storage & filing units", "Meeting & reception units", "Ergonomic layouts", "Durable commercial finishes"],
    heroImage: pic("office-desk.jpg", "Office desk setup showing the kind of workstation furniture we build"),
    gallery: [
      pic("img-10.jpg", "Custom office workstation with storage units"),
      pic("img-11.jpg", "Executive desk and meeting table setup"),
      pic("img-12.jpg", "Fitted office furniture with ergonomic layout"),
    ],
    published: true,
  },
  {
    slug: "temple-unit",
    title: "Temple / Pooja Unit",
    category: "Custom Furniture",
    shortDescription: "Customised pooja room and temple unit designs.",
    longDescription: "Customised pooja room and temple units — wall-mounted, wooden, marble or compact apartment designs with LED lighting and integrated storage.",
    benefits: ["Wall-mounted or standing", "Wooden & marble options", "LED lighting", "Compact apartment designs"],
    heroImage: pic("temple-1.jpg", "Marble pooja unit with backlit Om mandala and fluted panels"),
    gallery: [
      pic("temple-2.jpg", "Arched niche pooja unit with gold lotus motifs"),
      pic("temple-3.jpg", "Wooden mandir with carved mandala backdrop and hanging diyas"),
      pic("temple-4.jpg", "Backlit wooden temple with Om mandala and stepped platform"),
      pic("temple-5.jpg", "Wooden pooja unit with backlit Om and Om Namah Shivaya lettering"),
      pic("temple-6.jpg", "Wooden mandir cabinet with jaali doors"),
      pic("temple-7.jpg", "Wooden temple with peacock-feather jaali side panels"),
      pic("temple-8.jpg", "Compact wooden pooja unit with Om jaali panel"),
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
    heroImage: pic("living-dr-8.jpg", "Living room feature wall with art and accent lighting"),
    published: true,
  },
  {
    slug: "commercial-showroom-interior",
    title: "Commercial & Showroom Interior",
    category: "Commercial Interiors",
    shortDescription: "Complete showroom and commercial interior design and execution.",
    longDescription: "Complete showroom interior design and execution for retail businesses — layout planning, product display units, billing counters, lighting, branding walls, customer-flow planning and premium finishing.",
    benefits: ["Layout & customer flow", "Display units & counters", "Branding wall", "Lighting & finishing"],
    heroImage: pic("commercial-office.jpg", "Modern commercial interior with display-ready partitions and circulation"),
    gallery: [
      pic("img-13.jpg", "Showroom display units and product presentation"),
      pic("img-14.jpg", "Commercial reception and customer flow layout"),
    ],
    featured: true,
    published: true,
  },
];

/* ------------------------------------------------------------------ */
/* Portfolio — representative interior design projects.                 */
/* location / completionInfo left undefined (unverified) → hidden.      */
/* ------------------------------------------------------------------ */
const defaultProjects: Project[] = [
  {
    slug: "contemporary-apartment-living",
    title: "Contemporary Apartment Living",
    category: "residential",
    summary: "A warm, contemporary living space with layered lighting and custom joinery.",
    description: "A complete residential living space combining custom joinery, layered lighting and a refined material palette for a calm, premium result.",
    style: "Contemporary",
    scope: ["Space planning", "Custom joinery", "False ceiling & lighting", "Feature walls"],
    cover: pic("living-dr-1.jpg", "Contemporary Indian apartment living room"),
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
const defaultFaqs: Faq[] = [
  { question: "How much does a home interior cost?", answer: "Every project is customised, so cost depends on the scope, materials and finishes you choose. Share your requirements and we'll prepare a tailored quote for your space.", category: "Pricing" },
  { question: "Do you provide complete end-to-end service?", answer: "Yes. Luxeva Care handles the complete interior — from design consultation and space planning through carpentry, electrical, plumbing, finishing and final handover.", category: "Services" },
  { question: "Can I book only carpentry, electrical or plumbing work?", answer: "Yes. While we specialise in complete interiors, individual technical services can also be requested. Tell us what you need and we'll advise.", category: "Services" },
  { question: "Do you work on apartments and villas?", answer: "Yes. We deliver interiors for apartments, villas and independent houses, tailoring the approach to each home.", category: "Services" },
  { question: "Do you provide commercial showroom interiors?", answer: "Yes. Alongside our residential focus, we design and execute commercial showroom interiors including layout, display units, lighting and branding.", category: "Commercial" },
  { question: "Do you provide a consultation first?", answer: "Yes. We begin with a requirement discussion and site visit so the design and plan are based on your actual space, needs and budget.", category: "Process" },
];

/* EMPTY until the client supplies verified data → sections hidden. */
const defaultTestimonials: Testimonial[] = [];
const defaultLeadership: Leader[] = [];

export let contactDetails: ContactDetails = structuredClone(defaultContactDetails);
export let home = structuredClone(defaultHome);
export let roomCategories: RoomCategory[] = structuredClone(defaultRoomCategories);
export let about = structuredClone(defaultAbout);
let services: Service[] = structuredClone(defaultServices);
let projects: Project[] = structuredClone(defaultProjects);
let faqs: Faq[] = structuredClone(defaultFaqs);
let testimonials: Testimonial[] = structuredClone(defaultTestimonials);
let leadership: Leader[] = structuredClone(defaultLeadership);

function clone<T>(value: T): T {
  return structuredClone(value);
}

const repairRoomImages = (rooms: RoomCategory[]) => rooms.map((room) => {
  const imageByTitle: Record<string, string> = {
    "Living Room": `${IMG}/living-dr-2.jpg`,
    "Modular Kitchen": `${IMG}/kitchen-green.jpg`,
    Bedroom: `${IMG}/indian-bedroom-2.jpg`,
    Wardrobe: `${IMG}/wardrobe-1.jpg`,
    Bathroom: `${IMG}/bathroom-6.jpg`,
    Plumbing: `${IMG}/bathroom-5.jpg`,
    Entertainment: `${IMG}/ent-unit-1.jpg`,
    "Temple / Pooja": `${IMG}/temple-1.jpg`,
    "Full Home": `${IMG}/indian-living-2.jpg`,
  };
  return imageByTitle[room.title] ? { ...room, image: imageByTitle[room.title] } : room;
});

export function resetContentToDefaults() {
  contactDetails = clone(defaultContactDetails);
  home = clone(defaultHome);
  roomCategories = clone(defaultRoomCategories);
  about = clone(defaultAbout);
  services = clone(defaultServices);
  projects = clone(defaultProjects);
  faqs = clone(defaultFaqs);
  testimonials = clone(defaultTestimonials);
  leadership = clone(defaultLeadership);
}

export function applyContentOverrides(payload: Partial<{
  contactDetails: ContactDetails;
  home: typeof defaultHome;
  roomCategories: RoomCategory[];
  about: typeof defaultAbout;
  services: Service[];
  projects: Project[];
  faqs: Faq[];
  testimonials: Testimonial[];
  leadership: Leader[];
}>) {
  resetContentToDefaults();
  if (payload.contactDetails) {
    contactDetails = {
      ...clone(defaultContactDetails),
      ...clone(payload.contactDetails),
      phone: payload.contactDetails.phone || defaultContactDetails.phone,
      whatsapp: payload.contactDetails.whatsapp || defaultContactDetails.whatsapp,
      email: payload.contactDetails.email || defaultContactDetails.email,
    };
  }
  if (payload.home) {
    home = clone(payload.home);
    home.hero.image = `${IMG}/living-dr-2.jpg`;
    home.hero.images = [
      { src: `${IMG}/living-dr-2.jpg`, alt: "Modern Indian living room with designer pendant lights" },
      { src: `${IMG}/indian-living-2.jpg`, alt: "Spacious Indian living room with natural light" },
      { src: `${IMG}/kitchen-green.jpg`, alt: "Indian modular kitchen with practical storage" },
      { src: `${IMG}/false-ceil-1.jpg`, alt: "Stunning false ceiling with integrated LED lighting" },
      { src: `${IMG}/indian-bedroom-2.jpg`, alt: "Indian bedroom interior with custom storage" },
    ];
    home.aboutPreview.image = `${IMG}/indian-living-2.jpg`;
  }
  if (payload.roomCategories) roomCategories = repairRoomImages(clone(payload.roomCategories));
  if (payload.about) about = clone(payload.about);
  if (payload.services) {
    services = clone(payload.services);
    const electrical = services.find((s) => s.slug === "electrician-service");
    if (electrical) {
      electrical.heroImage = pic("false-ceil-6.jpg", "Residential electrical lighting and ceiling installation");
      electrical.gallery = [pic("img-00.jpg", "Interior electrical wiring and switchboard setup"), pic("img-01.jpg", "Concealed wiring installation in progress"), pic("img-02.jpg", "Lighting circuit installation work"), pic("img-03.jpg", "Professional electrical switchboard fitting")];
    }
    const bedrooms = services.find((s) => s.slug === "custom-beds");
    if (bedrooms) {
      bedrooms.heroImage = pic("bedroom-dr-1.jpg", "Modern Indian bedroom with LED platform bed and full-height wardrobe");
      bedrooms.gallery = [pic("bedroom-dr-2.jpg", "Warm bedroom with wood panelling"), pic("bedroom-dr-3.jpg", "Contemporary master bedroom design"), pic("bedroom-dr-4.jpg", "Minimalist bedroom with integrated storage"), pic("bedroom-dr-5.jpg", "Bedroom with accent wall and lighting")];
    }
    const kitchen = services.find((s) => s.slug === "kitchen-granite-quartz");
    if (kitchen) {
      kitchen.heroImage = pic("kitchen-green.jpg", "Indian modular kitchen with practical storage");
      kitchen.gallery = [pic("kitchen-dr-2.jpg", "White modular kitchen with marble backsplash"), pic("kitchen-dr-3.jpg", "Contemporary modular kitchen with island"), pic("kitchen-grey.jpg", "Grey modular kitchen with clean countertop lines"), pic("kitchen-dr-4.jpg", "Sleek kitchen with chimney and quartz countertop")];
    }
    const ceiling = services.find((s) => s.slug === "false-ceiling-pop");
    if (ceiling) {
      ceiling.heroImage = pic("false-ceil-4.jpg", "Modern false ceiling design with geometric integrated lighting");
      ceiling.gallery = [pic("false-ceil-1.jpg", "Curved false ceiling with integrated lighting"), pic("false-ceil-2.jpg", "Cove ceiling with warm accent lighting"), pic("false-ceil-3.jpg", "Modern POP ceiling design"), pic("false-ceil-5.jpg", "Bedroom false ceiling detail")];
    }
    const wardrobes = services.find((s) => s.slug === "carpenter-service");
    if (wardrobes) {
      wardrobes.heroImage = pic("wardrobe-1.jpg", "Custom built-in wardrobe in a bedroom");
      wardrobes.gallery = [pic("wardrobe.jpg", "Custom wardrobe storage in a bedroom"), pic("wardrobe-2.jpg", "Sliding wardrobe with mirror"), pic("wardrobe-3.jpg", "Walk-in wardrobe with shelving"), pic("wardrobe-4.jpg", "Built-in wardrobe design")];
    }
    const wallDesign = services.find((s) => s.slug === "wallpaper");
    if (wallDesign) wallDesign.heroImage = pic("living-dr-8.jpg", "Living room feature wall with art and accent lighting");
  }
  if (payload.projects) {
    projects = clone(payload.projects);
    const bedroomProject = projects.find((p) => p.slug === "serene-master-bedroom");
    if (bedroomProject) {
      bedroomProject.cover = pic("bedroom-dr-1.jpg", "Serene modern master bedroom");
      bedroomProject.gallery = [pic("bedroom-dr-2.jpg", "Bedroom with wood panelling"), pic("bedroom-dr-3.jpg", "Contemporary bedroom design"), pic("bedroom-dr-4.jpg", "Minimalist bedroom detail")];
    }
    const smartProject = projects.find((p) => p.slug === "smart-modern-home");
    if (smartProject) {
      smartProject.cover = pic("smart-lock.jpg", "Smart home control and digital lock installation");
      smartProject.gallery = [pic("smart-lock.jpg", "Smart home control and digital lock installation"), pic("ent-unit-2.jpg", "Entertainment unit with LED shelving"), pic("false-ceil-2.jpg", "Smart ceiling lighting")];
    }
  }
  if (payload.faqs) faqs = clone(payload.faqs);
  if (payload.testimonials) testimonials = clone(payload.testimonials);
  if (payload.leadership) leadership = clone(payload.leadership);
}

export function getContentSnapshot() {
  return {
    contactDetails: clone(contactDetails),
    home: clone(home),
    roomCategories: clone(roomCategories),
    about: clone(about),
    services: clone(services),
    projects: clone(projects),
    faqs: clone(faqs),
    testimonials: clone(testimonials),
    leadership: clone(leadership),
  };
}

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
