import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProjectPanel } from "@/components/ProjectPanel";
import { ProjectPreview } from "@/components/ProjectPreview";
import { ScrollExperience } from "@/components/ScrollExperience";
import { VisualMotion } from "@/components/VisualMotion";
import { Footer } from "@/components/Footer";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <div id="top" className="curtain-slot" style={{ zIndex: 1 }}><Hero /></div>
        {projects.map((project, index) => (
          <div
            key={project.slug}
            id={index === 0 ? "work" : project.slug}
            className="curtain-slot"
            style={{ zIndex: index + 2 }}
          >
            <span id={`project-0${index + 1}`} className="anchor-alias" aria-hidden="true" />
            {index === 0 && <span id="sentri" className="anchor-alias" aria-hidden="true" />}
            <ProjectPanel project={project} />
          </div>
        ))}
      </main>
      <Footer />
      <ProjectPreview projects={projects} />
      <ScrollExperience />
      <VisualMotion />
    </>
  );
}
