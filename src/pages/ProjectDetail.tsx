import Image from "next/image";
import Link from "next/link";
import { useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { PageHero, breadcrumbLd } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { getProject, getProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site";
import { usePageTitle } from "@/lib/seo";
import NotFoundPage from "./NotFound";

export default function ProjectDetailPage() {
  const { slug = "" } = useParams();
  const project = getProject(slug);
  usePageTitle(project ? `${project.title} · Luxeva Care` : "Project not found");
  if (!project) return <NotFoundPage />;

  const all = getProjects();
  const related = all.filter((p) => p.slug !== project.slug).slice(0, 3);

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Portfolio", href: "/portfolio" },
    { label: project.title },
  ];

  // Only include verified facts in the meta list.
  const meta: { label: string; value: string }[] = [];
  if (project.style) meta.push({ label: "Style", value: project.style });
  if (project.category) meta.push({ label: "Category", value: project.category });
  if (project.location) meta.push({ label: "Location", value: project.location });
  if (project.completionInfo) meta.push({ label: "Completed", value: project.completionInfo });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd(crumbs, siteConfig.url)) }} />

      <PageHero eyebrow={project.category} title={project.title} intro={project.summary} crumbs={crumbs} />

      <section className="py-14 md:py-20">
        <Container className="grid lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          <div>
            <Reveal className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card">
              <Image src={project.cover.src} alt={project.cover.alt} fill priority sizes="(max-width:1024px) 100vw, 62vw" className="object-cover" />
              {project.cover.isRender && (
                <span className="absolute top-4 left-4 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-soft-white">Design visualisation</span>
              )}
            </Reveal>
            <p className="mt-8 text-lg text-ink-soft/85 leading-relaxed">{project.description}</p>

            {project.scope && project.scope.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl">Scope of work</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.scope.map((s) => (
                    <span key={s} className="rounded-full border border-border bg-soft-white px-4 py-1.5 text-sm text-ink-soft">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {project.materials && project.materials.length > 0 && (
              <div className="mt-6">
                <h2 className="text-xl">Materials</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.materials.map((m) => (
                    <span key={m} className="rounded-full border border-border bg-soft-white px-4 py-1.5 text-sm text-ink-soft">{m}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {meta.length > 0 && (
            <aside className="lg:sticky lg:top-24 rounded-2xl border border-border bg-cream/50 p-6 shadow-soft">
              <dl className="space-y-4">
                {meta.map((m) => (
                  <div key={m.label}>
                    <dt className="text-xs uppercase tracking-wide text-taupe-dark">{m.label}</dt>
                    <dd className="mt-0.5 text-ink font-medium capitalize">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          )}
        </Container>
      </section>

      {/* Gallery */}
      {project.gallery.length > 0 && (
        <section className="pb-16">
          <Container>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.gallery.map((g) => (
                <div key={g.src} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-soft">
                  <Image src={g.src} alt={g.alt} fill sizes="(max-width:768px) 100vw, 32vw" className="object-cover" />
                  {g.isRender && <span className="absolute top-2 left-2 rounded-full bg-ink/70 px-2 py-0.5 text-[0.6rem] uppercase tracking-wide text-soft-white">Render</span>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Project enquiry */}
      <section className="py-16 md:py-20 bg-cream/50">
        <Container className="max-w-3xl">
          <h2 className="text-2xl md:text-3xl text-center">Like this project?</h2>
          <p className="mt-3 text-center text-ink-soft/85">Enquire and we’ll help you plan something similar for your space.</p>
          <div className="mt-8">
            <EnquiryForm defaultService={`Similar to: ${project.title}`} />
          </div>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="py-16">
          <Container>
            <div className="flex items-end justify-between gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl">More projects</h2>
              <Link href="/portfolio" className="text-sm font-medium text-navy inline-flex items-center gap-1">All work <ArrowRight size={15} /></Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/portfolio/${r.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-xl shadow-soft">
                  <Image src={r.cover.src} alt={r.cover.alt} fill sizes="30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-soft-white font-[family-name:var(--font-display)] text-lg">{r.title}</span>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
