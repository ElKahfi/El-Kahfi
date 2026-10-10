import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/data/projects";
import { Arrow } from "./Arrow";

export function ProjectPanel({ project }: { project: Project }) {
  return (
    <section className={`project-panel screen project-panel--${project.theme} project-panel--${project.slug}`} data-project={project.slug} aria-labelledby={`${project.slug}-title`}>
      <div className={`project-art project-art--${project.presentation}`}>
        <Image src={project.coverImage} alt={project.coverAlt} fill sizes={project.presentation === "mascot" ? "(max-width: 600px) 85vw, 55vw" : "92vw"} />
      </div>
      <h2 id={`${project.slug}-title`} className="sr-only">{project.title}</h2>
      <div className="panel-summary"><span>{project.title}{project.year ? ` / ${project.year}` : ""}</span><p>{project.summary}</p></div>
      <Link className="panel-hit-area" href={`/projects/${project.slug}`} aria-label={`View ${project.title}`}>
        <span className="project-open" aria-hidden="true"><span className="circle-arrow"><Arrow /></span></span>
      </Link>
    </section>
  );
}
