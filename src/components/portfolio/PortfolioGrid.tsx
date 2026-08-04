"use client";

import { useState } from "react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

type Filter = "all" | "residential" | "commercial";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const hasCommercial = projects.some((p) => p.category === "commercial");

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All Projects" },
    { key: "residential", label: "Residential" },
    ...(hasCommercial ? [{ key: "commercial" as Filter, label: "Commercial" }] : []),
  ];

  const shown = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  return (
    <div>
      <div role="tablist" aria-label="Filter projects" className="flex flex-wrap justify-center gap-2 mb-10">
        {filters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
              filter === f.key
                ? "bg-navy text-soft-white shadow-soft"
                : "border border-border bg-soft-white text-ink-soft hover:border-navy hover:text-ink",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {shown.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      ) : (
        <p className="text-center text-ink-soft/70 py-12">No projects in this category yet.</p>
      )}
    </div>
  );
}
