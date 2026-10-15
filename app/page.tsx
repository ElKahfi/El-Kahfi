import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { ProjectPanel } from "@/components/ProjectPanel";
import { ProjectSection } from "@/components/ProjectSection";
import { ProjectPreview } from "@/components/ProjectPreview";
import { ScrollExperience } from "@/components/ScrollExperience";
import { VisualMotion } from "@/components/VisualMotion";
import { About } from "@/components/About";
import { Footer } from "@/components/Footer";
import { projects } from "@/data/projects";

export default function Home() {
  return (
    <>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <div id="top" className="curtain-slot" style={{ zIndex: 1 }}><div className="curtain-surface"><Hero /></div></div>
        <div id="projects" className="curtain-slot curtain-slot--compact" style={{ zIndex: 2 }}><div className="curtain-surface"><ProjectSection /></div></div>
        {projects.map((project, index) => (
          <div
            key={project.slug}
            id={index === 0 ? "work" : project.slug}
            className="curtain-slot"
            style={{ zIndex: index + 3 }}
          >
            <span id={`project-0${index + 1}`} className="anchor-alias" aria-hidden="true" />
            {index === 0 && <span id="sentri" className="anchor-alias" aria-hidden="true" />}
            <div className="curtain-surface"><ProjectPanel project={project} /></div>
          </div>
        ))}
        <div id="university" className="curtain-slot" style={{ zIndex: projects.length + 3 }}><div className="curtain-surface"><ProjectSection university /></div></div>
        <About />
      </main>
      <Footer />
      <ProjectPreview projects={projects} />
      <ScrollExperience />
      <VisualMotion />
    </>
  );
}
