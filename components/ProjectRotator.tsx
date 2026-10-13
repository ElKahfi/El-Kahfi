"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { ProjectSlide } from "@/data/projects";

export function ProjectRotator({ slides, title }: { slides: ProjectSlide[]; title: string }) {
  const [index, setIndex] = useState(0);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const go = (direction: number) => setIndex(current => (current + direction + slides.length) % slides.length);
  const slide = slides[index];
  return (
    <section className="project-rotator" aria-label={`${title} project visuals`} aria-roledescription="carousel"
      onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          go(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
      <div className="rotator-controls">
        <button type="button" onClick={() => go(-1)} aria-label="Previous slide">Previous</button>
        <div className="rotator-track" aria-hidden="true"><span style={{ width: `${100 / slides.length}%`, transform: `translateX(${index * 100}%)` }} /></div>
        <button type="button" onClick={() => go(1)} aria-label="Next slide">Next</button>
      </div>
      <figure className="rotator-slide">
        <div className="rotator-image" tabIndex={0} aria-label="Project image. Use left and right arrow keys to change slides."
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
          <Image key={slide.image.src} src={slide.image.src} alt={slide.image.alt} width={slide.image.width} height={slide.image.height} sizes="92vw" preload={index === 0} draggable={false} />
        </div>
        <figcaption className="rotator-caption" aria-live="polite" aria-atomic="true">
          <span className="eyebrow">Slide {index + 1} of {slides.length}</span>
          <h2>{slide.heading}</h2><p>{slide.body}</p>
        </figcaption>
      </figure>
    </section>
  );
}
