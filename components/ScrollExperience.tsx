"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ScrollExperience() {
  useEffect(() => {
    // Give the history entry an explicit destination before opening a project.
    // Native mobile restoration can otherwise race the removal of pinned panels.
    const rememberProject = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a");
      const slot = link?.closest<HTMLElement>(".curtain-slot");
      if (slot && link?.pathname.startsWith("/projects/")) {
        history.replaceState(history.state, "", `#${slot.id}`);
      }
    };
    document.addEventListener("click", rememberProject, true);
    const media = gsap.matchMedia();
    // Touch, reduced motion, and short landscape screens use ordinary flow.
    media.add("(min-height: 520px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const slots = gsap.utils.toArray<HTMLElement>(".curtain-slot");
      let navigationUntil = location.hash ? performance.now() + 1500 : 0;

      // Stable wrappers remain at their document positions for anchor links.
      // The preceding panel is pinned until the incoming panel completely covers it.
      slots.slice(0, -1).forEach((slot, index) => {
        ScrollTrigger.create({
          id: `curtain-${index}`,
          trigger: slot,
          start: "top top",
          endTrigger: slots[index + 1],
          end: "top top",
          pin: slot.querySelector<HTMLElement>(".screen"),
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      });

      // The panel edge tracks native scrolling exactly. Only its artwork has a
      // short catch-up, giving the reveal depth without delaying scroll input.
      const reveals = slots.slice(1).map((slot) => gsap.fromTo(slot.querySelector(".project-art"), {
        "--reveal-y": "48px",
      }, {
        "--reveal-y": "0px",
        ease: "none",
        scrollTrigger: {
          trigger: slot,
          start: "top bottom",
          end: "top top",
          scrub: 0.28,
          invalidateOnRefresh: true,
          onRefresh: (trigger) => { trigger.animation?.progress(trigger.progress); },
        },
      }));

      const positionOf = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;
      const snapEnabled = matchMedia("(hover: hover) and (pointer: fine)").matches;
      const snapTrigger = snapEnabled ? ScrollTrigger.create({
        id: "curtain-snap",
        start: 0,
        end: () => ScrollTrigger.maxScroll(window),
        snap: {
          snapTo: (progress) => {
            if (performance.now() < navigationUntil) return progress;
            const focused = document.activeElement;
            if (focused && focused !== document.body && focused.matches(":focus-visible")) return progress;
            const maxScroll = ScrollTrigger.maxScroll(window);
            const position = progress * maxScroll;
            const positions = slots.map(positionOf);
            if (position > positions[positions.length - 1] + 1) return progress;
            const nearest = positions.reduce((a, b) => Math.abs(b - position) < Math.abs(a - position) ? b : a);
            return Math.abs(nearest - position) < innerHeight * 0.08 ? nearest / maxScroll : progress;
          },
          delay: 0.32,
          duration: { min: 0.24, max: 0.42 },
          ease: "power2.out",
          inertia: false,
          directional: false,
        },
      }) : null;

      const suspendSnap = () => {
        navigationUntil = performance.now() + 1200;
        snapTrigger?.getTween(true)?.kill();
      };
      const keyboard = (event: KeyboardEvent) => {
        if (["Tab", "PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "].includes(event.key)) suspendSnap();
      };
      const anchorClick = (event: MouseEvent) => {
        if ((event.target as Element).closest("a, button")) suspendSnap();
      };
      const focus = (event: FocusEvent) => {
        suspendSnap();
        const target = event.target as HTMLElement;
        const slot = target.closest<HTMLElement>(".curtain-slot");
        // A keyboard-focused link must never sit behind the incoming curtain.
        if (slot && target.matches(":focus-visible")) {
          window.scrollTo({ top: positionOf(slot), behavior: "instant" });
          ScrollTrigger.update();
          reveals.forEach((reveal) => reveal.scrollTrigger?.getTween()?.progress(1));
        }
      };
      window.addEventListener("keydown", keyboard);
      document.addEventListener("click", anchorClick);
      document.addEventListener("focusin", focus);
      const refresh = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        // Pin setup can interrupt the browser's initial smooth hash scroll.
        // Reconcile the stable anchor after measuring the complete panel stack.
        const target = document.getElementById(location.hash.slice(1));
        if (target) {
          window.scrollTo({ top: positionOf(target), behavior: "instant" });
          ScrollTrigger.update();
          reveals.forEach((reveal) => reveal.scrollTrigger?.getTween()?.progress(1));
        }
      });

      return () => {
        cancelAnimationFrame(refresh);
        window.removeEventListener("keydown", keyboard);
        document.removeEventListener("click", anchorClick);
        document.removeEventListener("focusin", focus);
      };
    });
    return () => {
      document.removeEventListener("click", rememberProject, true);
      media.revert();
    };
  }, []);
  return null;
}
