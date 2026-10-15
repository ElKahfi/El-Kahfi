"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export function Navigation({ detail = false }: { detail?: boolean }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const suppressFocus = useRef(false);
  const activated = useRef(false);
  const menuId = useId();

  const close = (returnFocus = false) => {
    activated.current = false;
    if (returnFocus) {
      suppressFocus.current = true;
      buttonRef.current?.focus({ preventScroll: true });
      suppressFocus.current = false;
    }
    setOpen(false);
  };

  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        activated.current = false;
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, []);

  return (
    <header
      ref={rootRef}
      className={`navigation ${open ? "is-open" : ""}`}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse" && matchMedia("(hover: hover) and (pointer: fine)").matches) setOpen(true);
      }}
      onPointerLeave={() => {
        if (!activated.current && !rootRef.current?.querySelector(":focus-visible")) setOpen(false);
      }}
      onFocusCapture={(event) => {
        if (!suppressFocus.current && event.target.matches(":focus-visible")) setOpen(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close(true);
        }
      }}
    >
      <button
        ref={buttonRef}
        className="menu-trigger"
        type="button"
        aria-label="Navigation menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          if (activated.current) close();
          else { activated.current = true; setOpen(true); }
        }}
      >
        <span /><span /><span />
      </button>
      <nav id={menuId} className="navigation-panel" aria-label="Main navigation" hidden={!open} inert={!open}>
        {[
          ["Intro", "top"],
          ["Work", "work"],
          ["University", "university"],
          ["About", "about"],
        ].map(([label, id]) => (
          <Link key={id} href={`${detail ? "/" : ""}#${id}`} onClick={() => close(true)}>{label}</Link>
        ))}
      </nav>
    </header>
  );
}
