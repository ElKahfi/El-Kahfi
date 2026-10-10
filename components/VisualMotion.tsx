"use client";

import { useEffect } from "react";

// Pointer motion owns only these variables. ScrollTrigger owns --reveal-y;
// CSS combines them once on the artwork, never on its pinned panel or link.
const properties = ["--pointer-x", "--pointer-y", "--visual-scale"];

export function VisualMotion() {
  useEffect(() => {
    const media = matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const screens = Array.from(document.querySelectorAll<HTMLElement>(".screen"));
    let dispose = () => {};
    const configure = () => {
      dispose();
      screens.forEach((screen) => properties.forEach((property) => screen.style.removeProperty(property)));
      if (!media.matches) return;

      const states = screens.map((screen) => ({ screen, hero: screen.classList.contains("hero"), x: 0, y: 0, scale: 1, targetX: 0, targetY: 0, targetScale: 1 }));
      let pointer: { x: number; y: number } | null = null;
      let frame = 0;
      let lastTime = 0;
      const draw = (time: number) => {
        // Time-based easing keeps the same response on 60Hz and 120Hz displays.
        const delta = lastTime ? Math.min(time - lastTime, 50) : 16;
        const ease = 1 - Math.exp(-delta / 110);
        lastTime = time;
        let unsettled = false;
        states.forEach((state) => {
          state.x += (state.targetX - state.x) * ease;
          state.y += (state.targetY - state.y) * ease;
          state.scale += (state.targetScale - state.scale) * ease;
          const moving = Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) > 0.02 || Math.abs(state.targetScale - state.scale) > 0.00005;
          if (!moving) { state.x = state.targetX; state.y = state.targetY; state.scale = state.targetScale; }
          state.screen.style.setProperty("--pointer-x", `${state.x}px`);
          state.screen.style.setProperty("--pointer-y", `${state.y}px`);
          state.screen.style.setProperty("--visual-scale", String(state.scale));
          unsettled ||= moving;
        });
        frame = unsettled ? requestAnimationFrame(draw) : 0;
        if (!frame) lastTime = 0;
      };
      const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
      const reset = () => {
        pointer = null;
        states.forEach((state) => { state.targetX = 0; state.targetY = 0; state.targetScale = 1; });
        schedule();
      };
      const update = () => {
        if (!pointer) return;
        const screen = document.elementFromPoint(pointer.x, pointer.y)?.closest(".screen");
        const active = states.find((state) => state.screen === screen);
        if (!active) return reset();
        const bounds = active.screen.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (pointer.x - bounds.left) / bounds.width * 2 - 1));
        const y = Math.max(-1, Math.min(1, (pointer.y - bounds.top) / bounds.height * 2 - 1));
        active.targetX = x * (active.hero ? 6 : -12);
        active.targetY = y * (active.hero ? 4 : -10);
        active.targetScale = 1.02;
        // Freeze covered artwork at its current pose so it does not drift behind
        // the incoming curtain. Pointer exit returns all artwork gently to rest.
        states.forEach((state) => {
          if (state !== active) { state.targetX = state.x; state.targetY = state.y; state.targetScale = state.scale; }
        });
        schedule();
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType === "touch") return reset();
        pointer = { x: event.clientX, y: event.clientY };
        update();
      };
      const keyboard = (event: KeyboardEvent) => { if (event.key === "Tab" || event.key === "Escape") reset(); };
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", reset);
      window.addEventListener("blur", reset);
      window.addEventListener("keydown", keyboard);
      document.documentElement.addEventListener("pointerleave", reset);
      dispose = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", reset);
        window.removeEventListener("blur", reset);
        window.removeEventListener("keydown", keyboard);
        document.documentElement.removeEventListener("pointerleave", reset);
      };
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      dispose();
      media.removeEventListener("change", configure);
      screens.forEach((screen) => properties.forEach((property) => screen.style.removeProperty(property)));
    };
  }, []);
  return null;
}
