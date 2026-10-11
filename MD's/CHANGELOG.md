# Changelog

## Purpose of this file

Record completed changes made by the owner or on their behalf. Future work belongs in [ROADMAP.md](ROADMAP.md); technical rationale belongs in [Decisions.md](Decisions.md).

## Recording rules

- Add newest completed changes first, using YYYY-MM-DD dates.
- Group entries under Added, Changed, Fixed, or Removed when useful.
- Record actual work, not plans or inferred history.
- Include an author/request/commit reference when known; do not invent one.
- Note verification and remaining limits.

## 2026-10-11 — Spring-smoothed curtains and slower project images

Requested by the project owner and implemented by Codex from the supplied scrolling brief.

### Changed

- Separated native document anchors from fixed visual curtain surfaces. ScrollTrigger observes browser scroll while a critically damped frame loop smooths discrete wheel steps without preventing input or forcing full-slide jumps.
- Selected mass 1, stiffness 900/damping 60 for larger wheel steps, and stiffness 3600/damping 120 for fine pixel input below 40px. Reset opposing velocity on reversal and clamp overshoot. Stop the follower within 0.1px/1px per second of its destination.
- Replaced the former 48px artwork reveal with counter-translation: each image travels 25% of its panel's viewport distance and reaches its original framing at rest. Existing inverse pointer movement and 2% scale remain composed into one artwork transform; controls receive no artwork parallax.
- Kept gentle snapping within 8% of boundaries, after 400ms, over 240–420ms. Keyboard, anchors, history, scrollbar interaction, and ordinary footer scrolling retain native destinations.
- Limited transform promotion to visible layers and removed it from covered/future artwork. Preserved static touch and reduced-motion fallbacks, owner content, routes, and Sentri media.
- Updated all five project documents and recorded DEC-012, superseding the earlier directly scroll-bound curtain edge and 48px reveal implementation.

### Fixed

- Classify passive wheel input in capture phase so the first step reaches the follower before ScrollTrigger's bubbling listener processes it.
- Preserve smoothing when a wheel step crosses the final project boundary.
- Use a local media-query lifecycle and GSAP context so enabling reduced motion mid-glide does not reset native scroll to the top. Reconcile initial hashes only once, preserving later scroll positions on preference changes.

### Verification and limits

- Added frame-sampled checks for 120px/450px wheel steps, rapid repeated input, direction reversal, fine 8px updates, settling time, slower image travel, keyboard interruption, final-panel release, live reduced-motion cleanup, and native scrollbar dragging.
- Inspected curtain midpoints and full project framing in the local browser. Physical mouse/trackpad feel, physical phones, Safari/Firefox, and production performance measurements remain unverified; emulated inputs are not hardware validation.
- Lint, TypeScript, and production build passed. All home/project/legacy routes were generated successfully.
- Verified 48 applicable browser checks across the complete run and a focused rerun; 39 checks were skipped for profiles where they do not apply. The complete run passed 47 checks. The remaining scrollbar check captured an intermediate browser drag position; after waiting for the final native drag event, it passed three consecutive runs without application changes.
- Frame samples confirmed continuous, monotonic wheel following, no overshoot, less than 450ms settling for tested 120px/450px steps and reversal, and less than 250ms settling after tested fine pixel input. Image travel measured between 20% and 30% of panel travel (configured at 25%). These are local automated observations, not physical-device or production performance guarantees.

## 2026-10-10 — Archived unused files

Requested by the project owner and organized by Codex.

### Changed

- Moved the original static prototype into `archive/legacy-static-site/`, including its HTML, CSS, linked pages, images, fonts, pixel assets, and Live Server settings. Their relative structure is preserved so the prototype remains usable as a reference.
- Moved the three superseded placeholder SVG covers from the active public directory into `archive/unused-project-covers/`.
- Updated documentation paths. The active Next.js app no longer shares its root/public asset folders with unused legacy material.

### Verification

- Confirmed the active app has no references to the archived paths or placeholder covers.
- Lint, TypeScript, and production build passed after the move.

## 2026-10-10 — Cursor depth and parallax reveal

Requested by the project owner and implemented by Codex from the supplied motion brief.

### Changed

- Added a smooth scale response from 1 to 1.02 to the active hero/project artwork on fine-pointer devices. The hero text moves up to 6px/4px toward the pointer, with slightly greater movement in the city; project artwork moves oppositely by up to 12px/10px.
- Kept base and illuminated hero text aligned, preserved the shared spotlight, and extended the city image beyond the viewport edges to avoid gaps during movement.
- Added scroll-linked project artwork reveal from a 48px offset to its resting position with a short 0.28-second catch-up. Reversal follows scrolling, while the opaque curtain edge remains continuously controlled by native scroll position.
- Adjusted near-boundary settling to 0.24–0.42 seconds with an eased finish, retaining the 8% snapping region and avoiding added scroll inertia or wheel interception.
- Added VisualMotion as a separate interaction component. CSS composes pointer translation, scroll reveal, and scale once per artwork; controls, click areas, menus, preview cards, About, and detail pages are not transformed.
- Added reset/cleanup behavior for pointer exit, blur, resize, keyboard access, route departure, and live reduced-motion changes.
- Changed touch devices to static artwork and ordinary scrolling, following the latest brief. Reduced motion disables all added effects and retains the static spotlight, readable summaries, and ordinary document flow.
- Updated all five project documents and recorded DEC-011. Project descriptions, imagery, routes, and Sentri's media preview remain intact.

### Verification and limits

- Lint, TypeScript, and production build passed.
- Browser coverage: 40 applicable checks passed across the complete run and a focused rerun; 23 checks were intentionally skipped for profiles where the behavior does not apply. The first run passed 38 checks; two new checks needed timing corrections (same-frame comparison and waiting for page setup) and then passed. No application changes were needed for those test issues.
- Verified inverse direction and scale on all three project panels, hero text-layer alignment, no city edge gaps, fixed control/link bounds, reveal progress and settling in both directions, and live motion-preference cleanup. Existing menu, video/fallback, route restoration, keyboard, touch, and reduced-motion checks passed.
- Reviewed the hero screenshot and the combined curtain/artwork reveal in the local browser. The working preview remains on port 3000.
- Physical touch devices, Safari/Firefox, production frame-rate measurements, and the owner's subjective assessment of the motion feel remain outstanding. No deployment or dependency addition was performed.

## 2026-10-10 — Sentri, Communimate, and Mojo

Requested by the project owner and implemented by Codex using the supplied descriptions, screenshots, mascot, and recording.

### Changed

- Replaced the three placeholder records with Sentri (2026), Communimate, and Mojo. Kept unknown years, personal roles, and tools empty; added no metrics, clients, research findings, or outcome claims.
- Made desktop project panels image-led, using the Sentri mascot, Communimate practice screen, and Mojo skill tree in their original colors. Removed panel headings, numbers, labels, and descriptive copy from the desktop presentation; retained semantic names and a subtle open control. Touch and reduced-motion layouts show summaries directly.
- Added visual-first detail pages at `/projects/sentri`, `/projects/communimate`, and `/projects/mojo`, with concise supporting descriptions and a Sentri gallery. Old numbered URLs redirect to their named replacements, and old anchors remain supported.
- Added a typed gallery, presentation style, preview image, and optional preview video to shared project data. Kept content separate from interaction code.
- Refined curtain scrolling with anticipatory pinning and a smaller snapping region: within 8% of viewport height, after a 0.32-second pause, settling over 0.18–0.32 seconds. Preserved native wheel/touch input, continuous reversal, and reduced-motion static flow without adding inertia libraries.
- Updated README, roadmap, architecture, this changelog, and decision records DEC-009/DEC-010.

### Added

- Optimized WebP copies of supplied project imagery while preserving source files. SentriPage.png served as a composition reference; the isolated mascot avoids bringing its baked-in labels into the panel.
- An eight-second silent MP4 excerpt from the Sentri recording, with a representative poster. Video loads only in an active desktop hover preview, loops inline, and unloads on dismissal. Reduced motion or unavailable playback uses the poster.
- Browser checks for video playback and forced-error fallback, legacy route redirects, all project cover images, and retaining deliberate midpoint scroll positions.

### Verification and limits

- Full Chrome suite passed: 35 applicable checks, 13 intentionally skipped where behavior does not apply to the device/profile. Covers desktop, emulated mobile, reduced motion, each curtain's start/midpoint/end in both directions, menu/keyboard/touch, routes, return positions, and hover behavior.
- Two initial checks timed out during the first run; both passed on a focused rerun and the complete final run passed without failures.
- Lint, TypeScript, and production build passed. Home, named detail pages, and legacy redirect routes were generated successfully.
- Inspected desktop and mobile project compositions, curtain midpoint screenshots, the Sentri video card, and a visual-first detail page. Local preview is available on port 3000.
- Still pending: Communimate/Mojo years, roles/tools, any verified metrics/outcomes, and final case-study copy. Physical-device feel, Safari/Firefox, and production performance measurements remain unverified. No deployment was performed.

## 2026-10-10 — Layered curtains and minimal landing page

Requested by the project owner and implemented by Codex.

### Changed

- Replaced ordinary scrolling and artwork parallax with GSAP-pinned curtain transitions from the hero through all three projects. Incoming opaque panels cover stationary content with reversible scroll-linked progress.
- Reduced the hero to the original city, centered ELKAHFI and System Design, and one small top-center menu trigger. Removed the colon, asterisks, duplicate branding, divider lines, corner copy, instructions, and scroll prompts.
- Replaced the persistent header with a compact hidden Intro/Work/About menu supporting hover, focus, click/tap, Escape, outside dismissal, and closing after selection. Hidden links are excluded from keyboard focus.
- Shared the city spotlight with a masked brighter text layer and restrained raised highlights on the name. Kept readable base text and excluded duplicate decorative text from assistive technology.
- Kept native scroll input, gentle desktop snapping, placeholder labels, project data, hover previews, and detail routes. Touch retains static light and inline summaries; reduced motion uses an unpinned static layout without snapping, cursor following, or text lift. Short landscape viewports also use unpinned flow.
- Updated all five project documents. DEC-007 explicitly supersedes the earlier ordinary-flow/parallax decision; DEC-008 records the minimal hero and shared light.

### Fixed

- Kept keyboard-focused project links visible above curtain coverage.
- Reconciled initial hash navigation after pin measurement so direct links and returns land at the intended project.
- Prevented synthetic mouse events from reopening the menu after a touch toggle.
- Kept the menu trigger stationary during expansion so a physical click cannot accidentally select an exposed navigation link.

### Verification and limits

- Verified start, midpoint, and end geometry for all three transitions in both directions on desktop and emulated mobile, including screenshots of each desktop midpoint.
- Extended regression coverage for menu access, project routes and previews, return positioning, resize, live reduced-motion changes, and static fallbacks.
- Final browser suite: 31 checks passed; eight device/profile-inapplicable checks intentionally skipped. Browser Back was checked both from direct hash destinations and from projects reached through scrolling.
- Lint, TypeScript, and the production build all passed. The home page and all three project detail pages were prerendered successfully.
- Inspected the desktop and mobile hero, expanded navigation, local text illumination, and curtain midpoint screenshots. The local development preview remains available on port 3000.
- All projects remain placeholders. Real case-study content and optional biography/contact details still require owner input. Physical-device and Safari/Firefox checks remain outstanding; no deployment was performed.

## 2026-10-10 — First working portfolio

Requested by the project owner and implemented by Codex.

### Added

- Next.js App Router application using React, TypeScript, CSS, and GSAP ScrollTrigger, with development, production, lint, typecheck, and browser-test commands.
- Responsive ELKAHFI landing page with the confirmed “System Design” tagline, original city image, large serif typography, and Work/About navigation.
- Feathered cursor spotlight with eased movement and a static touch/reduced-motion fallback.
- Three full-screen placeholder project panels with original monochrome SVG cover artwork, GSAP parallax, and gentle snapping near panel boundaries.
- Shared typed project data and three prerendered detail routes with next-project links, return navigation, and missing-project handling.
- Hover previews with viewport clamping, Escape/Tab dismissal, and no pointer interception.
- Visible touch summaries and project links, keyboard skip/focus navigation, and reduced-motion behavior without animation or snapping.
- Chrome browser checks across desktop, emulated mobile, and reduced motion. Next.js also generated its version-specific AGENTS.md guidance.

### Changed

- Made the Next.js application the active site while preserving the original HTML/CSS and assets as reference material.
- Replaced active-page biography and contact placeholders with neutral portfolio copy. All project stories are explicitly marked placeholders, with unknown dates/roles left empty and placeholder detail pages marked noindex.
- Optimized a serving copy of the original city JPEG to a 2560×1440 WebP, reducing the source asset from approximately 667 KiB to 275 KiB before responsive Next Image delivery.
- Updated all five documents to distinguish implemented behavior, outstanding content, and deferred features.

### Fixed

- Corrected the Next.js/GSAP scroll-restoration interaction so returning from a detail page lands at the intended project.
- Kept a visible “View project” label on mobile alongside the arrow.
- Prevented reduced-motion previews from following the pointer; they use a fixed corner position.

### Verification and limits

- Browser suite: 19 checks passed; five profile-inapplicable checks intentionally skipped (for example, hover on touch).
- Checked spotlight motion, hover bounds/click-through, links and route restoration, all project routes, 404s, keyboard navigation, mobile layout, and reverse scrolling/snapping.
- Inspected desktop and mobile compositions in the local browser.
- Lint, TypeScript, and the production build all passed. The build prerendered the home page and all three project detail routes.
- Real project information remains outstanding. No public deployment was performed. Physical phones, Safari/Firefox, and production performance measurements remain future checks.
- Installation audit reported five development-only advisories in the Next ESLint/fast-glob/micromatch/braces chain. No production dependency advisory was reported. The suggested framework-era downgrade was not applied.

## 2026-10-10 — Direction documented

### Changed

- Defined the planned cursor-lit city hero, full-screen project transitions, hover previews, and project detail routes.
- Documented the planned Next.js/React/TypeScript migration and GSAP scroll choreography, keeping Three.js optional.
- Added touch, reduced-motion, responsive, accessibility, and performance considerations.

This earlier step updated documentation only. Application implementation is recorded separately above.

## 2026-10-06 — Documentation foundation

### Added

- README.md: project introduction and local setup.
- ROADMAP.md: agreed scope and separation of ideas from approved work.
- TECHNICAL_ARCHITECTURE.md: original files, assets, and interactions.
- CHANGELOG.md: completed-change history.
- Decisions.md: technical decisions and rationale without inventing earlier reasons.

Requested by the owner; documentation prepared by Codex and checked against the original HTML, CSS, assets, and editor settings. Website code was not modified or browser-tested during that documentation pass.

## Earlier history

No verified change history was available when this log was created. Earlier changes and dates have not been reconstructed.
