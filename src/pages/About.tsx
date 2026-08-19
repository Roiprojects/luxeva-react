import Image from "next/image";
import { Check, Target, Eye, Users } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { about, getLeadership } from "@/lib/content";
import { FinalCta } from "@/components/sections/FinalCta";



export default function AboutPage() {
  const leaders = getLeadership();

  return (
    <>
      <PageHero
        eyebrow="About Luxeva Care"
        title="We create elegant, functional, personalised interiors"
        intro={about.intro}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />

      {/* Story */}
      <section className="py-20 md:py-24">
        <Container className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card">
              <Image src="/assets/stock/living-dr-2.jpg" alt="Luxeva Care residential interior" fill sizes="(max-width:1024px) 100vw, 48vw" className="object-cover" />
            </div>
          </Reveal>
          <div>
            <SectionHeading align="left" eyebrow="Our story" title="One accountable partner for your interior" intro={about.story} />
          </div>
        </Container>
      </section>

      {/* Mission / Vision */}
      <section className="py-16 bg-cream/50">
        <Container className="grid md:grid-cols-2 gap-6">
          {[
            { icon: Target, label: "Mission", text: about.mission },
            { icon: Eye, label: "Vision", text: about.vision },
          ].map((b) => (
            <Reveal key={b.label}>
              <div className="h-full rounded-2xl border border-border bg-soft-white p-8 shadow-soft">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/10 text-navy">
                  <b.icon size={22} />
                </span>
                <h2 className="mt-5 text-2xl">{b.label}</h2>
                <p className="mt-3 text-ink-soft/85 leading-relaxed">{b.text}</p>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* Expertise + Values */}
      <section className="py-20 md:py-24">
        <Container className="grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHeading align="left" eyebrow="Our expertise" title="What we deliver" />
            <ul className="mt-6 grid sm:grid-cols-2 gap-3">
              {about.expertise.map((e) => (
                <li key={e} className="flex items-start gap-2.5 text-ink-soft/90">
                  <Check size={18} className="mt-0.5 text-navy shrink-0" /> {e}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeading align="left" eyebrow="Our values" title="What we stand for" />
            <div className="mt-6 flex flex-wrap gap-2.5">
              {about.values.map((v) => (
                <span key={v} className="rounded-full border border-border bg-soft-white px-4 py-2 text-sm text-ink-soft shadow-soft">
                  {v}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Leadership — rendered ONLY when verified profiles are supplied (else hidden). */}
      {leaders.length > 0 ? (
        <section className="py-20 md:py-24 bg-navy relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -top-24 right-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute inset-0 text-white/[0.03] pattern-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]" />
          <Container className="relative">
            <SectionHeading tone="light" eyebrow="Leadership" title="The people behind Luxeva Care" />
            <div className="mt-12 flex flex-wrap justify-center gap-8">
              {leaders.map((l) => (
                <Reveal key={l.name} variant="scale">
                  <div className="w-72 rounded-2xl overflow-hidden bg-white/[0.06] border border-white/10 shadow-lift hover:bg-white/[0.10] transition-colors">
                    {l.photo ? (
                      <div className="relative w-full overflow-hidden" style={{ height: "384px" }}>
                        <img
                          src={l.photo.src}
                          alt={l.photo.alt}
                          className="w-full h-full object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full bg-white/10 flex items-center justify-center" style={{ height: "384px" }}>
                        <span className="text-6xl font-display text-white/30">{l.name.split(" ").map(w => w[0]).join("").slice(0,2)}</span>
                      </div>
                    )}
                    <div className="p-6 -mt-16 relative">
                      <h3 className="text-xl font-semibold text-white">{l.name}</h3>
                      <p className="mt-1 text-sm font-medium text-gold-2">{l.roleType}</p>
                      <p className="mt-3 text-sm text-white/65 leading-relaxed">{l.bio}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <section className="py-16 bg-cream/50">
          <Container className="max-w-2xl text-center">
            <span className="flex mx-auto h-12 w-12 items-center justify-center rounded-full bg-navy/10 text-navy">
              <Users size={22} />
            </span>
            <h2 className="mt-5 text-2xl">Leadership & team</h2>
            <p className="mt-3 text-ink-soft/80">
              Founder, promoter and management profiles will be published here soon.
            </p>
          </Container>
        </section>
      )}

      <FinalCta />
    </>
  );
}
