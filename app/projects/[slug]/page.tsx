import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { projects, getProject, legacyProjectSlugs } from "@/data/projects";
import { ProjectDetails } from "@/components/ProjectDetails";

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
  return <ProjectDetails project={project} nextProject={next} backAnchor={index === 0 ? "work" : project.slug} />;
}
