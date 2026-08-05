import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Star, ShieldCheck, Hammer, Ruler, Clock, Wallet, Sparkles } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ServiceCard } from "@/components/cards/ServiceCard";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { QuickEnquiry } from "@/components/forms/QuickEnquiry";
import { Carousel } from "@/components/ui/Carousel";
import { HeroSlideshow } from "@/components/ui/HeroSlideshow";
import {
  home,
  roomCategories,
  getFeaturedServices,
  getFeaturedProjects,
  getFaqs,
  getTestimonials,
} from "@/lib/content";
import { siteConfig } from "@/lib/site";

export default function HomePage() {
  const [services, projects, faqs, testimonials] = [
    getFeaturedServices(),
    getFeaturedProjects(),
    getFaqs(),
    getTestimonials(),
  ];

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    knowsAbout: ["Interior design", "Residential interiors", "Commercial showroom interiors", "Modular kitchens", "Custom furniture"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />

      {/* ============ HERO ============ */}
      <section className="relative bg-mist px-3 sm:px-4 md:px-6 pt-16 md:pt-28 pb-4">
        <div className="relative overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem] min-h-[86vh] flex items-center shadow-lift">
          {/* Full-bleed background slideshow */}
          <HeroSlideshow images={home.hero.images} />
          {/* Scrims for legibility */}
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />
          <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[1.5rem] md:rounded-[2.5rem]" />

          {/* Rating badge */}
          <div className="absolute top-5 right-5 hidden sm:flex items-center gap-2 rounded-full bg-paper/90 backdrop-blur px-4 py-2 shadow-card ring-1 ring-gold/25 animate-float-slow">
            <span className="flex gap-0.5 text-gold"><Star size={14} className="fill-gold" /><Star size={14} className="fill-gold" /><Star size={14} className="fill-gold" /></span>
            <span className="text-xs font-semibold text-ink">Premium finishing</span>
          </div>

          {/* Overlaid content */}
          <div className="relative w-full">
            <div className="container-lux grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center py-14 md:py-20">
              <div className="max-w-2xl">
                <p className="eyebrow text-gold-2 mb-5 animate-rise" style={{ animationDelay: "40ms" }}>{home.hero.eyebrow}</p>
                <h1 className="text-white text-[2.7rem] sm:text-6xl lg:text-[4.2rem] font-semibold leading-[1.03] animate-rise [text-wrap:balance] drop-shadow-sm" style={{ animationDelay: "120ms" }} dangerouslySetInnerHTML={{ __html: home.hero.heading }} />
                <p className="mt-6 max-w-xl text-lg text-white/85 leading-relaxed animate-rise" style={{ animationDelay: "240ms" }}>{home.hero.subheading}</p>
                <div className="mt-8 flex flex-wrap gap-3 animate-rise" style={{ animationDelay: "340ms" }}>
                  <Button href="/contact" size="lg">Book Free Consultation</Button>
                  <Button href="#rooms" variant="on-dark" size="lg">Explore Designs <ArrowRight size={18} /></Button>
                </div>
                <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4 animate-rise" style={{ animationDelay: "440ms" }}>
                  {home.hero.stats.map((s) => (
                    <div key={s.label} className="flex flex-col border-l border-white/25 pl-4">
                      <span className="text-sm font-semibold text-white">{s.value}</span>
                      <span className="text-xs text-white/65">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote form (over the image, desktop) */}
              <div className="hidden lg:block animate-fade" style={{ animationDelay: "260ms" }}>
                <QuickEnquiry />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CAPABILITY CARDS (inspired by reference hero cards) ============ */}
      <section className="relative z-10 bg-mist pt-14 pb-2">
        <Container>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { icon: Ruler, title: "Design & Planning", desc: "Space planning, concepts and material selection tailored to how you live." },
              { icon: Hammer, title: "Custom Woodwork", desc: "Modular kitchens, wardrobes and units — made to measure, finished to last." },
              { icon: Sparkles, title: "End-to-End Execution", desc: "Electrical, finishing and handover, coordinated by one accountable team." },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="group h-full rounded-2xl border border-line bg-paper p-6 md:p-7 shadow-card hover:-translate-y-1.5 transition-transform duration-400">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-dark ring-1 ring-gold/20 group-hover:bg-gold group-hover:text-white transition-colors">
                    <c.icon size={22} />
                  </span>
                  <h3 className="mt-4 text-xl font-medium">{c.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft leading-relaxed">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ TRUST MARQUEE ============ */}
      <section className="border-y border-line bg-navy text-white overflow-hidden">
        <div className="py-4 marquee">
          <div className="marquee__track">
            {[0, 1].map((dup) => (
              <ul key={dup} className="flex items-center gap-x-10 pr-10 text-sm font-medium text-white/85 whitespace-nowrap" aria-hidden={dup === 1}>
                {home.trustStrip.map((item) => (
                  <li key={item} className="inline-flex items-center gap-2.5"><span className="h-1.5 w-1.5 rounded-full bg-gold-2" />{item}</li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ROOM CATEGORIES ============ */}
      <section id="rooms" className="scroll-mt-24 py-20 md:py-28 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[-6rem] h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute bottom-0 left-[-5rem] h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 text-brand/[0.06] pattern-dots [mask-image:radial-gradient(70%_45%_at_50%_0%,#000,transparent)]" />
        <Container className="relative">
          <SectionHeading eyebrow="Designs for every room" title="Beautiful interiors, room by room" intro="Explore our design capability across every space in your home — then let's build yours." />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {roomCategories.map((room, i) => (
              <Reveal key={room.title} delay={i * 60} variant="scale">
                <Link href={room.href} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl shadow-soft hover:shadow-lift transition-all duration-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand">
                  <Image src={room.image} alt={`${room.title} interior design`} fill sizes="(max-width:768px) 45vw, 22vw" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <h3 className="text-lg md:text-xl font-semibold text-white">{room.title}</h3>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-white/80 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">Explore <ArrowRight size={13} /></span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ FEATURED SERVICES ============ */}
      <section className="py-20 md:py-24 bg-mist relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute top-10 left-[-5rem] h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/2 text-ink/[0.05] pattern-grid [mask-image:linear-gradient(to_left,#000,transparent)]" />
        <Container className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading align="left" eyebrow="What we do" title="Complete interior solutions" intro="From design consultation to furniture, finishing and installation — every detail, one team." />
            <Button href="/services" variant="outline" size="sm">All services <ArrowRight size={16} /></Button>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 70} variant="scale"><ServiceCard service={s} /></Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ FULL HOME / WHY CHOOSE ============ */}
      <section className="py-20 md:py-28">
        <Container className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal variant="left" className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card">
              <Image src={home.aboutPreview.image} alt="Full home interior by Luxeva Care" fill sizes="(max-width:1024px) 100vw, 48vw" className="object-cover" />
            </div>
            <div className="absolute -bottom-5 -right-3 hidden md:block rounded-2xl bg-brand text-white px-6 py-5 shadow-brand ring-1 ring-inset ring-gold/30 max-w-[13rem]">
              <p className="font-[family-name:var(--font-display)] text-3xl leading-none text-gold-2">All-in-one</p>
              <p className="mt-1.5 text-sm text-white/85">design + execution team</p>
            </div>
          </Reveal>
          <div className="order-1 lg:order-2">
            <SectionHeading align="left" eyebrow={home.aboutPreview.eyebrow} title={home.aboutPreview.title} intro={home.aboutPreview.body} />
            <div className="mt-7 grid sm:grid-cols-2 gap-4">
              {home.whyChoose.slice(0, 4).map((w) => (
                <div key={w.title} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand"><Check size={14} /></span>
                  <div>
                    <p className="font-semibold text-ink text-[0.95rem]">{w.title}</p>
                    <p className="text-sm text-ink-soft">{w.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8"><Button href="/about" variant="secondary">More about us <ArrowRight size={17} /></Button></div>
          </div>
        </Container>
      </section>

      {/* ============ SIGNATURE WORK CAROUSEL (adapted from reference sliders) ============ */}
      <section className="py-20 md:py-24 bg-mist">
        <Container>
          <SectionHeading eyebrow="A glimpse inside" title="Our signature work" intro="A cinematic look at the interiors we design and deliver — room by room, end to end." />
          <div className="mt-12">
            <Carousel
              slides={[
                { image: "/assets/stock/indian-living.jpg", title: "Contemporary Living", caption: "Layered lighting, custom joinery and a calm material palette." },
                { image: "/assets/stock/kitchen-open.jpg", title: "Modular Kitchens", caption: "Function meets finish — smart storage, durable surfaces and flow." },
                { image: "/assets/stock/img-27.jpg", title: "Full-Home Villa Interiors", caption: "Designed and delivered end-to-end by a single team." },
                { image: "/assets/stock/indian-bedroom.jpg", title: "Restful Bedrooms", caption: "Custom beds, wardrobes and warm, dimmable lighting." },
                { image: "/assets/stock/img-20.jpg", title: "Smart, Modern Homes", caption: "Home automation designed into the interior from day one." },
              ]}
            />
          </div>
        </Container>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="py-20 md:py-28 bg-navy text-white overflow-hidden relative">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-gold/15 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 text-white/[0.045] pattern-grid [mask-image:radial-gradient(80%_60%_at_50%_40%,#000,transparent)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 spotlight" />
        <Container className="relative">
          <SectionHeading tone="light" eyebrow="How we work" title="From first conversation to final handover" intro="A clear, transparent process — so you always know what happens next." />
          <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {home.designProcess.map((step, i) => (
              <Reveal key={step.title} delay={i * 60}>
                <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 hover:bg-white/[0.07] hover:border-gold/30 transition-colors">
                  <span className="font-[family-name:var(--font-display)] text-5xl text-gold-2">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-2 text-xl font-medium text-white">{step.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ============ WHY-CHOOSE ICON GRID ============ */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute top-0 right-[-6rem] h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-16 left-[-4rem] h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <Container className="relative">
          <SectionHeading eyebrow="Why Luxeva Care" title="Reasons homeowners choose us" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {home.whyChoose.map((w, i) => {
              const icons = [Sparkles, ShieldCheck, Hammer, Ruler, Clock, Wallet];
              const Icon = icons[i % icons.length];
              return (
                <Reveal key={w.title} delay={i * 50}>
                  <div className="group h-full rounded-2xl border border-line bg-paper p-6 shadow-soft hover:shadow-card hover:-translate-y-1 hover:border-gold/30 transition-all duration-300">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold-dark ring-1 ring-gold/20 group-hover:bg-gold group-hover:text-white transition-colors"><Icon size={22} /></span>
                    <h3 className="mt-4 text-lg font-medium">{w.title}</h3>
                    <p className="mt-2 text-sm text-ink-soft leading-relaxed">{w.description}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* ============ PORTFOLIO PREVIEW ============ */}
      {projects.length > 0 && (
        <section className="py-20 md:py-24 bg-mist">
          <Container>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading align="left" eyebrow="Our work" title="Recent projects & designs" />
              <Button href="/portfolio" variant="outline" size="sm">View portfolio <ArrowRight size={16} /></Button>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {projects.slice(0, 4).map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}><ProjectCard project={p} /></Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ============ OFFER / CONSULTATION BAND ============ */}
      <section className="py-16 md:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 md:px-14 md:py-14 text-white shadow-brand ring-1 ring-inset ring-gold/30">
            <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-64 w-64 rounded-full bg-gold/15 blur-2xl" />
            <div aria-hidden className="pointer-events-none absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold-2"><span className="h-1.5 w-1.5 rounded-full bg-gold-2" />Free design consultation</p>
                <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-white leading-tight">Let&rsquo;s plan your dream space — at no cost</h2>
                <p className="mt-3 text-white/85">Share your requirements and get a tailored plan and quote from our design team.</p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Button href="/contact" variant="on-dark" size="lg" className="bg-white/10">Book Consultation</Button>
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-brand hover:bg-white/90 transition-colors">Get a Free Quote <ArrowRight size={18} /></Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ============ TESTIMONIALS (hidden until real) ============ */}
      {testimonials.length > 0 && (
        <section className="py-20 md:py-24">
          <Container>
            <SectionHeading eyebrow="Testimonials" title="What our clients say" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {testimonials.slice(0, 3).map((t) => (
                <blockquote key={t.clientName} className="rounded-2xl border border-line bg-paper p-6 shadow-soft">
                  <p className="text-ink-soft">“{t.text}”</p>
                  <footer className="mt-4 text-sm font-semibold text-ink">{t.clientName}{t.location ? `, ${t.location}` : ""}</footer>
                </blockquote>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ============ FAQ ============ */}
      <section className="py-20 md:py-24 bg-mist relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-16 right-[-5rem] h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute inset-0 text-ink/[0.04] pattern-dots [mask-image:radial-gradient(60%_60%_at_85%_100%,#000,transparent)]" />
        <Container className="relative max-w-3xl">
          <SectionHeading eyebrow="Good to know" title="Frequently asked questions" />
          <div className="mt-10 space-y-3">
            {faqs.slice(0, 5).map((f) => (
              <details key={f.question} className="group rounded-2xl border border-line bg-paper px-5 open:shadow-card transition-shadow">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold-dark ring-1 ring-gold/20 transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                </summary>
                <p className="pb-5 -mt-1 text-ink-soft leading-relaxed">{f.answer}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 text-center"><Button href="/faq" variant="outline" size="sm">All questions <ArrowRight size={16} /></Button></div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
