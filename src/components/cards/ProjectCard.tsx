import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group relative block overflow-hidden rounded-xl shadow-soft hover:shadow-lift hover:-translate-y-1.5 transition-all duration-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-cream">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
        {project.cover.isRender && (
          <span className="absolute top-3 left-3 rounded-full bg-ink/70 px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-soft-white">
            Design visualisation
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold-soft capitalize">
            {project.category}
          </p>
          <h3 className="mt-1 text-xl text-soft-white leading-snug">{project.title}</h3>
          <p className="mt-1 text-sm text-soft-white/75 line-clamp-2">{project.summary}</p>
        </div>
      </div>
    </Link>
  );
}
