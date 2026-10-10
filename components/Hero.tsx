"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let dispose = () => {};
    const configure = () => {
      dispose();
      hero.style.removeProperty("--light-x");
      hero.style.removeProperty("--light-y");
      if (!media.matches) return;
      let x = hero.clientWidth * 0.5;
      let y = hero.clientHeight * 0.5;
      let targetX = x;
      let targetY = y;
      let frame = 0;
      const draw = () => {
        x += (targetX - x) * 0.13;
        y += (targetY - y) * 0.13;
        // The city overlay and text mask inherit the exact same light coordinates.
        hero.style.setProperty("--light-x", `${x}px`);
        hero.style.setProperty("--light-y", `${y}px`);
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > 0.3) frame = requestAnimationFrame(draw);
        else frame = 0;
      };
      const move = (event: PointerEvent) => {
        const bounds = hero.getBoundingClientRect();
        targetX = event.clientX - bounds.left;
        targetY = event.clientY - bounds.top;
        if (!frame) frame = requestAnimationFrame(draw);
      };
      const reset = () => {
        targetX = hero.clientWidth * 0.5;
        targetY = hero.clientHeight * 0.5;
        if (!frame) frame = requestAnimationFrame(draw);
      };
      hero.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", reset);
      window.addEventListener("resize", reset);
      dispose = () => {
        cancelAnimationFrame(frame);
        hero.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", reset);
        window.removeEventListener("resize", reset);
      };
    };
    configure();
    media.addEventListener("change", configure);
    return () => { dispose(); media.removeEventListener("change", configure); };
  }, []);

  return (
    <section ref={heroRef} className="hero screen" aria-labelledby="hero-title">
      <div className="hero-city" aria-hidden="true">
        <Image src="/images/city.webp" alt="" fill sizes="100vw" preload />
      </div>
      <div className="hero-shade" aria-hidden="true" />
      <div className="hero-vignette" aria-hidden="true" />
      <div className="hero-heading">
        <h1 id="hero-title" className="hero-name">ELKAHFI</h1>
        <p className="hero-tagline">System Design</p>
      </div>
      <div className="hero-lit" aria-hidden="true">
        <div className="hero-heading">
          <span className="hero-name">ELKAHFI</span>
          <span className="hero-tagline">System Design</span>
        </div>
      </div>
    </section>
  );
}
