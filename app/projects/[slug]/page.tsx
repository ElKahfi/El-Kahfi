import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { projects, getProject, getProjectSlides, legacyProjectSlugs } from "@/data/projects";
import { ProjectRotator } from "@/components/ProjectRotator";
import { Navigation } from "@/components/Navigation";
import { Arrow } from "@/components/Arrow";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [...projects.map(({ slug }) => ({ slug })), ...Object.keys(legacyProjectSlugs).map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(legacyProjectSlugs[slug] ?? slug);
  return project ? { title: project.title, description: project.summary } : { title: "Project not found" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (legacyProjectSlugs[slug]) permanentRedirect(`/projects/${legacyProjectSlugs[slug]}`);
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  const heading = <div className="detail-heading" id="top">
    <div className="detail-heading-row"><h1>{project.title}</h1>{project.year && <span className="eyebrow">{project.year}</span>}</div>
    <p>{project.summary}</p>
  </div>;
  return (
    <>
      <Navigation detail />
      <main id="main" className={`detail-page detail-page--${project.slug}`} tabIndex={-1}>
        <div className="detail-toolbar"><Link className="text-link" href={`/#${index === 0 ? "work" : project.slug}`}><Arrow direction="left" /> All projects</Link></div>
        {heading}
        {project.repository && <div className="project-repository"><a href={project.repository} target="_blank" rel="noopener noreferrer">View {project.title} on GitHub</a></div>}
        <ProjectRotator key={project.slug} title={project.title} slides={getProjectSlides(project)} />
        <div className="detail-body">
          <aside>
            <span className="eyebrow">Project overview</span>
            {(project.role || project.tools.length > 0) && <dl>
              {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
              {project.tools.length > 0 && <div><dt>Tools</dt><dd>{project.tools.join(", ")}</dd></div>}
            </dl>}
          </aside>
          <div className="detail-story">{project.caseStudy ? <>
            {project.caseStudy.sections?.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
            <section><h2>Key capabilities</h2><ul className="case-points">{project.caseStudy.capabilities.map((point) => <li key={point}>{point}</li>)}</ul></section>
            <section><h2>My role</h2><p>{project.role}</p><ul className="case-points">{project.caseStudy.contributions.map((point) => <li key={point}>{point}</li>)}</ul></section>
          </> : null}</div>
        </div>
        <Link className="next-project" href={`/projects/${next.slug}`}><div><span className="eyebrow">Next project</span><h2>{next.title}</h2></div><span className="circle-arrow"><Arrow /></span></Link>
        <div className="detail-footer"><Link href="/">ELKAHFI</Link><span>System Design</span></div>
      </main>
    </>
  );
}
