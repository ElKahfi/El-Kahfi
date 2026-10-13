"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Mass 1; critical damping c = 2ω, stiffness k = ω².
// Fine pixel input gets a faster response without trying to identify a device.
const WHEEL_FREQUENCY = 30;
const FINE_FREQUENCY = 60;
const IMAGE_TRAVEL = 0.25;

export function ScrollExperience() {
  useEffect(() => {
    const rememberProject = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a");
      const slot = link?.closest<HTMLElement>(".curtain-slot");
      if (slot && link?.pathname.startsWith("/projects/")) {
        history.replaceState(history.state, "", `#${slot.id}`);
      }
    };
    document.addEventListener("click", rememberProject, true);
    const media = matchMedia("(min-height: 520px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let dispose = () => {};
    let reconcileHash = true;
    const configure = () => {
      dispose();
      dispose = () => {};
      if (!media.matches) return;
      // Own this media lifecycle locally. GSAP's global matchMedia refresh can
      // reset scroll memory when it removes the last trigger during a glide.
      const context = gsap.context(() => {
        const main = document.getElementById("main")!;
        const slots = gsap.utils.toArray<HTMLElement>(".curtain-slot");
        const surfaces = slots.map((slot) => slot.querySelector<HTMLElement>(".curtain-surface")!);
        const artwork = slots.map((slot) => slot.querySelector<HTMLElement>(".project-art"));
        let positions: number[] = [];
        let height = innerHeight;
        let visual = window.scrollY;
        let target = visual;
        let velocity = 0;
        let frequency = WHEEL_FREQUENCY;
        let wheelUntil = 0;
        let navigationUntil = location.hash ? performance.now() + 1500 : 0;
        let frame = 0;
        let lastTime = 0;
        let refresh = 0;

        const positionOf = (element: HTMLElement) => element.getBoundingClientRect().top + window.scrollY;
        main.classList.add("spring-curtains");
        const measure = () => {
          height = slots[0].offsetHeight;
          positions = slots.map(positionOf);
        };
        measure();

        const render = () => {
          // After the final project, release the stack into ordinary footer flow.
          const release = Math.max(0, visual - positions[positions.length - 1]);
          surfaces.forEach((surface, index) => {
            const incoming = Math.max(0, positions[index] - visual);
            surface.style.transform = `translate3d(0, ${incoming - release}px, 0)`;
            const visible = incoming < height && release < height &&
              (index === slots.length - 1 || visual < positions[index + 1]);
            surface.toggleAttribute("data-curtain-visible", visible);
            surface.style.willChange = visible ? "transform" : "";
            // Counter-translate inside the clipped surface: artwork travels 25%
            // of the panel's viewport distance, then arrives at its original frame.
            artwork[index]?.style.setProperty("--reveal-y", `${-(1 - IMAGE_TRAVEL) * Math.min(height, incoming)}px`);
          });
          window.dispatchEvent(new Event("curtainprogress"));
        };
        const cancel = () => {
          cancelAnimationFrame(frame);
          frame = 0;
          lastTime = 0;
          velocity = 0;
        };
        const sync = () => {
          cancel();
          visual = target = window.scrollY;
          render();
        };
        const draw = (time: number) => {
          const dt = Math.min(lastTime ? (time - lastTime) / 1000 : 1 / 60, 0.05);
          lastTime = time;
          // Exact solution for a critically damped spring with a fixed target.
          // Reset opposing momentum on reversal and clamp numerical overshoot.
          if (velocity * (target - visual) < 0) velocity = 0;
          const offset = visual - target;
          const impulse = velocity + frequency * offset;
          const decay = Math.exp(-frequency * dt);
          const next = target + (offset + impulse * dt) * decay;
          velocity = (velocity - frequency * impulse * dt) * decay;
          visual = Math.max(Math.min(visual, target), Math.min(Math.max(visual, target), next));
          if (Math.abs(target - visual) < 0.1 && Math.abs(velocity) < 1) {
            visual = target;
            cancel();
            render();
            // Resolve pointer ownership once a panel has finished passing beneath it.
            window.dispatchEvent(new Event("curtainsettled"));
            return;
          }
          render();
          frame = requestAnimationFrame(draw);
        };
        const follow = () => {
          target = window.scrollY;
          const lastStart = positions[positions.length - 1];
          if (performance.now() >= wheelUntil || performance.now() < navigationUntil ||
              (visual >= lastStart && target >= lastStart)) {
            sync();
            return;
          }
          if (!frame && Math.abs(target - visual) > 0.01) frame = requestAnimationFrame(draw);
        };
        render();

        // Native anchors retain their document positions. Only the visual surfaces
        // follow the spring; wheel events are passive and never change native input.
        const trigger = ScrollTrigger.create({
          id: "curtain-progress",
          start: 0,
          end: () => ScrollTrigger.maxScroll(window),
          onUpdate: follow,
          onRefresh: () => { measure(); sync(); },
          snap: {
            snapTo: (progress) => {
              if (performance.now() < navigationUntil) return progress;
              const focused = document.activeElement;
              if (focused && focused !== document.body && focused.matches(":focus-visible")) return progress;
              const maxScroll = ScrollTrigger.maxScroll(window);
              const position = progress * maxScroll;
              if (position > positions[positions.length - 1] + 1) return progress;
              const nearest = positions.reduce((a, b) => Math.abs(b - position) < Math.abs(a - position) ? b : a);
              return Math.abs(nearest - position) < height * 0.08 ? nearest / maxScroll : progress;
            },
            delay: 0.4,
            duration: { min: 0.24, max: 0.42 },
            ease: "power2.out",
            inertia: false,
            directional: false,
          },
        });
        const wheel = (event: WheelEvent) => {
          if (event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX) || !event.deltaY) return;
          wheelUntil = performance.now() + 160;
          navigationUntil = 0;
          frequency = event.deltaMode === 0 && Math.abs(event.deltaY) < 40 ? FINE_FREQUENCY : WHEEL_FREQUENCY;
          trigger.getTween(true)?.kill?.();
        };
        const suspend = () => {
          wheelUntil = 0;
          navigationUntil = performance.now() + 1200;
          trigger.getTween(true)?.kill?.();
          sync();
        };
        const keyboard = (event: KeyboardEvent) => {
          if (["Tab", "PageDown", "PageUp", "Home", "End", "ArrowDown", "ArrowUp", " "].includes(event.key)) suspend();
        };
        const anchorClick = (event: MouseEvent) => {
          if ((event.target as Element).closest("a, button")) suspend();
        };
        const focus = (event: FocusEvent) => {
          suspend();
          const focused = event.target as HTMLElement;
          const slot = focused.closest<HTMLElement>(".curtain-slot");
          if (slot && focused.matches(":focus-visible")) {
            window.scrollTo({ top: positionOf(slot), behavior: "instant" });
            ScrollTrigger.update();
            sync();
          }
        };
        // Classify before ScrollTrigger's bubbling wheel listener reads scrollY.
        // Passive wheel dispatch may occur after the compositor already scrolled.
        window.addEventListener("wheel", wheel, { passive: true, capture: true });
        window.addEventListener("pointerdown", suspend, { passive: true });
        window.addEventListener("keydown", keyboard);
        window.addEventListener("hashchange", suspend);
        window.addEventListener("popstate", suspend);
        document.addEventListener("click", anchorClick, true);
        document.addEventListener("focusin", focus);
        refresh = requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          const destination = reconcileHash ? document.getElementById(location.hash.slice(1)) : null;
          reconcileHash = false;
          if (destination) window.scrollTo({ top: positionOf(destination), behavior: "instant" });
          ScrollTrigger.update();
          sync();
        });

        return () => {
          cancel();
          cancelAnimationFrame(refresh);
          window.removeEventListener("wheel", wheel, true);
          window.removeEventListener("pointerdown", suspend);
          window.removeEventListener("keydown", keyboard);
          window.removeEventListener("hashchange", suspend);
          window.removeEventListener("popstate", suspend);
          document.removeEventListener("click", anchorClick, true);
          document.removeEventListener("focusin", focus);
          main.classList.remove("spring-curtains");
          surfaces.forEach((surface) => { surface.style.removeProperty("transform"); surface.style.removeProperty("will-change"); surface.removeAttribute("data-curtain-visible"); });
          artwork.forEach((art) => art?.style.removeProperty("--reveal-y"));
        };
      });
      dispose = () => context.revert();
    };
    configure();
    media.addEventListener("change", configure);
    return () => {
      document.removeEventListener("click", rememberProject, true);
      media.removeEventListener("change", configure);
      dispose();
    };
  }, []);
  return null;
}
