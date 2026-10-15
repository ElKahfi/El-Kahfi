import Link from "next/link";
import type { Project } from "@/data/projects";
import { getProjectSlides } from "@/data/projects";
import { ProjectRotator } from "./ProjectRotator";
import { Navigation } from "./Navigation";
import { Arrow } from "./Arrow";

export function ProjectDetails({ project, nextProject, backAnchor }: { project: Project; nextProject: Project; backAnchor: string }) {
  const study = project.caseStudy;
  const hasMetadata = Boolean(project.role || project.tools.length);
  const hasStory = Boolean(study?.capabilities?.length || study?.contributions?.length || study?.sections?.length);

  return (
    <>
      <Navigation detail />
      <main id="main" className={`detail-page personal-project-page detail-page--${project.slug}`} tabIndex={-1}>
        <div className="detail-toolbar"><Link className="text-link" href={`/#${backAnchor}`}><Arrow direction="left" /> All projects</Link></div>
        <header className="detail-heading" id="top">
          <div className="detail-heading-row"><h1>{project.title}</h1>{project.year && <span className="eyebrow">{project.year}</span>}</div>
          <p>{project.summary}</p>
        </header>
        {(project.repository || project.website) && <div className="project-links">
          {project.website && <a href={project.website} target="_blank" rel="noopener noreferrer">Visit {project.title} <Arrow /></a>}
          {project.repository && <a href={project.repository} target="_blank" rel="noopener noreferrer">View {project.title} on GitHub <Arrow /></a>}
        </div>}
        <ProjectRotator key={project.slug} title={project.title} slides={getProjectSlides(project)} />
        {(hasMetadata || hasStory) && <div className="detail-body">
          {hasMetadata && <aside aria-label="Project overview">
            <span className="eyebrow">Project overview</span>
            <dl>
              {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
              {project.tools.length > 0 && <div><dt>Tools</dt><dd>{project.tools.join(", ")}</dd></div>}
            </dl>
          </aside>}
          {hasStory && <div className="detail-story">
            {study?.capabilities?.length ? <section className="detail-card"><h2>Key capabilities</h2><ul className="case-points">{study.capabilities.map(point => <li key={point}>{point}</li>)}</ul></section> : null}
            {study?.contributions?.length ? <section className="detail-card"><h2>My role</h2>{project.role && <p>{project.role}</p>}<ul className="case-points">{study.contributions.map(point => <li key={point}>{point}</li>)}</ul></section> : null}
            {study?.sections?.map(section => <section className="detail-card detail-card--narrative" key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
          </div>}
        </div>}
        <Link className="next-project" href={`/projects/${nextProject.slug}`}><div><span className="eyebrow">Next project</span><h2>{nextProject.title}</h2></div><span className="circle-arrow"><Arrow /></span></Link>
        <div className="detail-footer"><Link href="/">ELKAHFI</Link><span>System Design</span></div>
      </main>
    </>
  );
}
