import { PageHero } from "@/components/ui/PageHero";
import { Container } from "@/components/ui/Section";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { FinalCta } from "@/components/sections/FinalCta";
import { getProjects } from "@/lib/content";



export default function PortfolioPage() {
  const projects = getProjects();

  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Interiors we’ve designed & delivered"
        intro="A selection of completed residential and commercial interiors, alongside design visualisations from our studio."
        crumbs={[{ label: "Home", href: "/" }, { label: "Portfolio" }]}
      />
      <section className="py-16 md:py-20">
        <Container>
          {projects.length > 0 ? (
            <PortfolioGrid projects={projects} />
          ) : (
            <p className="text-center text-ink-soft/70 py-12">Our portfolio is being prepared.</p>
          )}
        </Container>
      </section>
      <FinalCta />
    </>
  );
}
