"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";

export function PreviewMedia({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !project.previewVideo) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const configure = () => {
      if (reduced.matches) {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } else {
        video.src = project.previewVideo!;
        video.play().catch(() => { /* The poster remains visible if autoplay is unavailable. */ });
      }
    };
    configure();
    reduced.addEventListener("change", configure);
    return () => {
      reduced.removeEventListener("change", configure);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [project.previewVideo]);

  return <div className="preview-image">
    <Image src={project.previewImage} alt="" fill sizes="300px" />
    {project.previewVideo && <video ref={videoRef} className={playing ? "is-playing" : ""} muted loop playsInline preload="none" poster={project.previewImage} onPlaying={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setPlaying(false)} aria-hidden="true" />}
  </div>;
}
