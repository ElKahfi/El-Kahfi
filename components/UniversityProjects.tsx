"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { UniversityProject } from "@/data/university-projects";

export function UniversityProjects({ projects }: { projects: UniversityProject[] }) {
  const [index, setIndex] = useState(0);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const project = projects[index];
  const go = (direction: number) => setIndex(current => (current + direction + projects.length) % projects.length);

  return <section className="university-browser" aria-label="University project collection" aria-roledescription="carousel">
    <div className="university-list" role="group" aria-label="Choose a university project">
      {projects.map((item, itemIndex) => <button type="button" key={item.slug} aria-pressed={index === itemIndex} aria-controls="university-project" onClick={() => setIndex(itemIndex)}><span className="eyebrow">0{itemIndex + 1}</span>{item.title}</button>)}
    </div>
    <div className="rotator-controls university-controls">
      <button type="button" onClick={() => go(-1)} aria-label="Previous project">Previous</button>
      <div className="rotator-track" aria-hidden="true"><span style={{ width: `${100 / projects.length}%`, transform: `translateX(${index * 100}%)` }} /></div>
      <button type="button" onClick={() => go(1)} aria-label="Next project">Next</button>
    </div>
    <p className="university-status eyebrow" aria-live="polite" aria-atomic="true">Project {index + 1} of {projects.length} — {project.title}</p>
    <article id="university-project" aria-labelledby="university-project-title" data-project={project.slug}>
      <header className="university-project-heading"><span className="eyebrow">{project.discipline}</span><h2 id="university-project-title">{project.title}</h2><p>{project.summary}</p></header>
      <figure className="university-figure">
        <div className="rotator-image" tabIndex={0} aria-label={`${project.title} image. Use left and right arrow keys to change projects.`}
          onKeyDown={event => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
              event.preventDefault();
              go(event.key === "ArrowRight" ? 1 : -1);
            }
          }}
          onPointerDown={event => {
            if (!event.isPrimary || event.button !== 0) return;
            gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerUp={event => {
            const start = gesture.current;
            gesture.current = null;
            if (!start || start.id !== event.pointerId) return;
            const x = event.clientX - start.x;
            const y = event.clientY - start.y;
            if (Math.abs(x) > 50 && Math.abs(x) > Math.abs(y) * 1.5) go(x < 0 ? 1 : -1);
          }}
          onPointerCancel={() => { gesture.current = null; }}
          onLostPointerCapture={() => { gesture.current = null; }}>
          <Image key={project.slug} src={project.image.src} alt={project.image.alt} width={project.image.width} height={project.image.height} sizes="92vw" loading="eager" draggable={false} />
        </div>
        <figcaption>{project.imageCaption}</figcaption>
      </figure>
      <div className="detail-body">
        <aside><span className="eyebrow">Project overview</span><dl>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Tools</dt><dd>{project.tools.join(", ")}</dd></div>
        </dl><div className="university-links"><span className="eyebrow">Explore the project</span>{project.links.map(link => <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">{link.label}<span aria-hidden="true">↗</span></a>)}</div></aside>
        <div className="detail-story">{project.sections.map(section => <section key={section.heading}><h3>{section.heading}</h3><p>{section.body}</p></section>)}</div>
      </div>
    </article>
  </section>;
}
