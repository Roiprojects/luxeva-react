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
        <section className="py-20 md:py-24 bg-cream/50">
          <Container>
            <SectionHeading eyebrow="Leadership" title="The people behind Luxeva Care" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {leaders.map((l) => (
                <div key={l.name} className="rounded-xl border border-border bg-soft-white p-6 shadow-soft text-center">
                  {l.photo && (
                    <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full">
                      <Image src={l.photo.src} alt={l.photo.alt} fill sizes="112px" className="object-cover object-top" />
                    </div>
                  )}
                  <h3 className="mt-4 text-xl">{l.name}</h3>
                  <p className="text-sm text-gold-dark font-medium">{l.roleType}</p>
                  <p className="mt-2 text-sm text-ink-soft/80">{l.bio}</p>
                </div>
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
