"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { PreviewMedia } from "./PreviewMedia";

export function ProjectPreview({ projects }: { projects: Project[] }) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Project | null>(null);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    const finePointer = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)");
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let currentSlug = "";
    let frame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let pointer: { x: number; y: number } | null = null;
    const draw = () => {
      const ease = reducedMotion.matches ? 1 : 0.35;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      preview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.3) frame = requestAnimationFrame(draw);
      else frame = 0;
    };
    const hide = () => {
      if (currentSlug) { setActive(null); currentSlug = ""; }
      preview.style.visibility = "hidden";
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const update = () => {
      if (!finePointer.matches || !pointer) return hide();
      const panel = document.elementFromPoint(pointer.x, pointer.y)?.closest<HTMLElement>("[data-project]");
      const project = projects.find((item) => item.slug === panel?.dataset.project);
      if (!project) return hide();
      const width = preview.offsetWidth;
      const height = preview.offsetHeight;
      targetX = reducedMotion.matches ? innerWidth - width - 16 : Math.max(16, Math.min(pointer.x + 24, innerWidth - width - 16));
      targetY = reducedMotion.matches ? innerHeight - height - 16 : Math.max(16, Math.min(pointer.y + 24, innerHeight - height - 16));
      if (currentSlug !== project.slug) {
        currentX = targetX; currentY = targetY;
        currentSlug = project.slug;
        setActive(project);
      }
      preview.style.visibility = "visible";
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const dismiss = () => { pointer = null; hide(); };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") return dismiss();
      pointer = { x: event.clientX, y: event.clientY };
      update();
    };
    const keydown = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") dismiss(); };
    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("curtainprogress", update);
    window.addEventListener("curtainsettled", update);
    window.addEventListener("resize", update);
    window.addEventListener("blur", dismiss);
    window.addEventListener("keydown", keydown);
    document.documentElement.addEventListener("pointerleave", dismiss);
    finePointer.addEventListener("change", hide);
    reducedMotion.addEventListener("change", hide);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", update);
      window.removeEventListener("curtainprogress", update);
      window.removeEventListener("curtainsettled", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("blur", dismiss);
      window.removeEventListener("keydown", keydown);
      document.documentElement.removeEventListener("pointerleave", dismiss);
      finePointer.removeEventListener("change", hide);
      reducedMotion.removeEventListener("change", hide);
    };
  }, [projects]);

  return (
    <div ref={previewRef} className={`project-preview ${active ? "is-visible" : ""}`} aria-hidden="true">
      {active && <><div className="preview-content"><h3>{active.title}</h3>{active.year && <span className="preview-status">{active.year}</span>}<p>{active.summary}</p></div><PreviewMedia key={active.slug} project={active} /></>}
    </div>
  );
}
