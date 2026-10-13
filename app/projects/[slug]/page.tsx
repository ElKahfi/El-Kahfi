import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { projects, getProject, legacyProjectSlugs } from "@/data/projects";
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
  const [lead, ...gallery] = project.gallery;
  const heading = <div className="detail-heading" id="top">
    <div className="detail-heading-row"><h1>{project.title}</h1>{project.year && <span className="eyebrow">{project.year}</span>}</div>
    <p>{project.summary}</p>
  </div>;
  return (
    <>
      <Navigation detail />
      <main id="main" className={`detail-page detail-page--${project.slug}`} tabIndex={-1}>
        <div className="detail-toolbar"><Link className="text-link" href={`/#${index === 0 ? "work" : project.slug}`}><Arrow direction="left" /> All projects</Link></div>
        {project.caseStudy && heading}
        <figure className="detail-lead">
          <Image src={lead.src} alt={lead.alt} width={lead.width} height={lead.height} sizes="(max-width: 600px) 100vw, 92vw" preload />
          {lead.title && <figcaption className="case-caption"><h2>{lead.title}</h2><p>{lead.caption}</p><a href={lead.src}>View full-size image</a></figcaption>}
        </figure>
        {!project.caseStudy && heading}
        <div className="detail-body">
          <aside>
            <span className="eyebrow">Project overview</span>
            {(project.role || project.tools.length > 0) && <dl>
              {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
              {project.tools.length > 0 && <div><dt>Tools</dt><dd>{project.tools.join(", ")}</dd></div>}
            </dl>}
          </aside>
          <div className="detail-story">{project.caseStudy ? <>
            <section><h2>Key capabilities</h2><ul className="case-points">{project.caseStudy.capabilities.map((point) => <li key={point}>{point}</li>)}</ul></section>
            <section><h2>My role</h2><p>{project.role}</p><ul className="case-points">{project.caseStudy.contributions.map((point) => <li key={point}>{point}</li>)}</ul></section>
          </> : project.detailContent.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.body}</p></section>)}</div>
        </div>
        {gallery.length > 0 && <div className={project.caseStudy ? "case-gallery" : "detail-gallery"}>{gallery.map((item) => <figure key={item.src}><Image src={item.src} alt={item.alt} width={item.width} height={item.height} sizes={project.caseStudy ? "92vw" : "(max-width: 600px) 80vw, 50vw"} />{item.title && <figcaption className="case-caption"><h2>{item.title}</h2><p>{item.caption}</p><a href={item.src}>View full-size image</a></figcaption>}</figure>)}</div>}
        <Link className="next-project" href={`/projects/${next.slug}`}><div><span className="eyebrow">Next project</span><h2>{next.title}</h2></div><span className="circle-arrow"><Arrow /></span></Link>
        <div className="detail-footer"><Link href="/">ELKAHFI</Link><span>System Design</span></div>
      </main>
    </>
  );
}
