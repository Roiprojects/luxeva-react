import Image from "next/image";
import { Users, Award, Target } from "lucide-react";
import { PageHero } from "@/components/ui/PageHero";
import { Container, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { getLeadership } from "@/lib/content";
import { FinalCta } from "@/components/sections/FinalCta";

export default function TeamPage() {
  const leaders = getLeadership();

  return (
    <>
      <PageHero
        eyebrow="Our Leadership"
        title="The people behind Luxeva Care"
        intro="A team of seasoned professionals united by one goal — delivering interiors that exceed expectations."
        crumbs={[{ label: "Home", href: "/" }, { label: "About", href: "/about" }, { label: "Leadership" }]}
      />

      {/* Leaders grid */}
      <section className="py-20 md:py-28">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {leaders.map((l) => (
              <Reveal key={l.name}>
                <div className="group h-full rounded-2xl border border-border bg-soft-white p-7 shadow-soft text-center transition-shadow hover:shadow-card">
                  {l.photo && (
                    <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-full ring-1 ring-border/70 bg-cream/40">
                      <Image
                        src={l.photo.src}
                        alt={l.photo.alt}
                        fill
                        sizes="160px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="mt-5 text-xl font-semibold">{l.name}</h3>
                  <p className="mt-1 text-sm text-gold-dark font-medium">{l.roleType}</p>
                  <p className="mt-3 text-sm text-ink-soft/80 leading-relaxed">{l.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Values strip */}
      <section className="py-20 md:py-24 bg-cream/50">
        <Container>
          <SectionHeading eyebrow="What guides us" title="Built on integrity, driven by craft" />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { icon: Award, label: "Quality first", text: "Every project is held to the same finishing standard — no shortcuts, no exceptions." },
              { icon: Target, label: "Accountable delivery", text: "One team, one timeline, one point of contact from consultation to handover." },
              { icon: Users, label: "People-centric", text: "We design around how you live and work, not around a template." },
            ].map((item) => (
              <Reveal key={item.label}>
                <div className="h-full rounded-2xl border border-border bg-soft-white p-8 shadow-soft">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/10 text-navy">
                    <item.icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold">{item.label}</h3>
                  <p className="mt-3 text-sm text-ink-soft/85 leading-relaxed">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <FinalCta />
    </>
  );
}
