# Roadmap

## Purpose of this file

Keep work within the owner's agreed scope. Record what is done, what comes next, and what remains optional so new features are not added randomly.

## Scope rules

- Implement owner requests or approved items here. A new request authorizes that work; do not ask for the same approval twice.
- Ideas, reference screenshots, unused files, and observations do not independently authorize new features.
- Keep supporting implementation work within the agreed result.
- Record a concrete outcome and observable completion criteria for each new item.
- Update CHANGELOG.md for completed changes and Decisions.md for agreed technical choices.

## Completed — documentation foundation, 2026-10-06

- [x] Create the five project documents with distinct purposes and verified baseline information.

## Version one — authorized 2026-10-10

**Goal:** Build a polished ELKAHFI landing page with “System Design” as the tagline, a cursor-lit city, and three placeholder projects demonstrating full-screen scrolling. The owner's implementation request supersedes the earlier plan to gather all real project content first.

- [x] Migrate the active website to Next.js, React, TypeScript, and CSS.
  - Completion: responsive home page and local development/production commands work; original source remains as reference.
- [x] Use confirmed identity and remove invented biography/contact content from the active app.
  - Completion: ELKAHFI and System Design appear; all three projects are labeled placeholders.
- [x] Create typed project data and detail routes.
  - Completion: all known slugs render, next/return navigation works, and unknown slugs return a missing-page view.
- [x] Create a full-screen vertical project sequence.
  - Completion: desktop panels fill the viewport, have visible titles/links, and scroll naturally in both directions.
- [x] Add project hover previews.
  - Completion: previews show titles, summaries, and images, remain within the viewport, and do not block clicks.
- [x] Add the city spotlight.
  - Completion: a soft light follows a desktop pointer; touch and reduced-motion visitors receive a static light.
- [x] Add GSAP transitions and gentle snapping.
  - Completion: artwork moves with scrolling and settles near panel boundaries without preventing keyboard or document navigation.
- [x] Provide touch and reduced-motion fallbacks.
  - Completion: touch summaries/links are visible; reduced motion disables animated scrolling, snapping, and cursor following.

## Version-one verification and handoff

- [x] Lint, TypeScript, and production build passed.
- [x] Browser suite passed 19 applicable checks; five checks were skipped where their behavior does not apply to the device profile.
- [x] Desktop/mobile compositions inspected and local preview supplied.

Results and remaining platform/content limits are recorded in CHANGELOG.md. Repeat relevant checks after future changes.

## Completed — curtain and minimal-hero refinement, 2026-10-10

The owner's refinement request supersedes version one's ordinary document-flow/parallax transition choice. DEC-007 records the replacement; the historical version-one checklist above describes the earlier delivery.

- [x] Replace artwork parallax with layered curtain transitions from the hero through Project 03.
  - Completion: at every midpoint the incoming panel covers the lower half while the previous panel stays stationary above it; scrolling upward reverses this geometry.
- [x] Reduce the hero to centered ELKAHFI and System Design, the city image, and one menu trigger.
  - Completion: no colon, asterisk, duplicate branding, rules, corner labels, instructions, or scroll prompt remains in the hero.
- [x] Add compact hidden Intro/Work/About navigation.
  - Completion: hover/focus/click/tap, Escape, outside dismissal, and selection work; hidden links cannot receive keyboard focus.
- [x] Share the spotlight across the city and typography, with a restrained raised highlight on the name.
  - Completion: pointer motion is smooth without layout shifts; touch and reduced motion use a static light.
- [x] Preserve placeholders, previews, routes, keyboard access, gentle desktop snapping, and project return positions.
- [x] Provide an ordinary static scrolling layout with no pinning, snapping, cursor motion, or text lift under reduced motion.
- [x] Extend browser coverage for midpoint layering, reverse scrolling, menu interactions, history/anchor restoration, viewport resizing, and live motion-preference changes.
- [x] Pass the complete validation run: 31 browser checks passed, eight profile-inapplicable checks skipped; lint, TypeScript, and production build passed.

Final verification results for this refinement are recorded in CHANGELOG.md.

## Completed — owner projects and visual presentation, 2026-10-10

- [x] Replace the three placeholders with Sentri (2026), Communimate, and Mojo using owner descriptions and supplied media.
- [x] Make desktop project panels image-led, with a subtle open control and accessible names. Keep summaries in previews/detail pages, and directly visible on touch or reduced-motion layouts.
- [x] Use the Sentri mascot, Communimate practice screen, and Mojo skill tree in their original colors; lead detail pages with interface imagery.
- [x] Add a silent eight-second Sentri hover video with a representative poster. Load it only while the preview is active; use the poster under reduced motion or failed playback.
- [x] Refine native curtain motion with anticipatory pinning and short settling only within 8% of a section boundary. Keep wheel/touch input native and avoid added inertia.
- [x] Add named project routes and redirects from the old numbered URLs, preserving return navigation.
- [x] Extend browser checks for video playback, failure fallback, real routes, media loading, and existing curtain/navigation behavior.

DEC-009 supersedes the placeholder-content choice. DEC-010 records media playback and controlled scrolling. Final validation results are recorded in CHANGELOG.md.

## Completed — cursor depth and scroll reveal, 2026-10-10

- [x] Add a restrained 2% scale response to the active hero and project artwork on fine-pointer devices.
- [x] Move the city and aligned identity gently toward the cursor; move project artwork in the opposite direction.
- [x] Add a short, reversible artwork reveal inside each rising curtain while keeping the curtain edge tied to native scroll position.
- [x] Combine reveal, pointer translation, and scale without transforming navigation, links, hover cards, or detail pages.
- [x] Give boundary settling a slightly longer eased finish while preserving the narrow 8% snapping region.
- [x] Use static imagery and ordinary scrolling for touch devices, superseding the earlier touch curtain behavior. Disable all added motion under reduced motion.
- [x] Add regression checks for cursor direction, transform bounds, fixed controls, reveal/reversal, and motion preference changes.

DEC-011 records the motion choices. Validation results and remaining physical-device/performance limits are recorded in CHANGELOG.md.

## Completed — spring smoothing and slower artwork, 2026-10-11

- [x] Smooth stepped wheel input with a critically damped visual follower while keeping native scroll authoritative.
- [x] Preserve stationary outgoing panels and exact start/midpoint/end curtain geometry in both directions.
- [x] Make project images travel 25% of panel distance, composing with existing inverse pointer movement and 2% hover scale.
- [x] Keep controls independent of artwork transforms and bypass wheel smoothing for navigation.
- [x] Stop settled animation frames, remove offscreen promotion, and clean up on route/preference changes.
- [x] Preserve static touch/reduced-motion fallbacks, content, routes, and the Sentri video.
- [x] Complete frame-sampled wheel/fine-input tests, regression suite, lint, TypeScript, and build.
  - Verification: 48 applicable browser checks verified across the full run and a corrected scrollbar-test rerun; 39 profile-inapplicable checks skipped. Lint, TypeScript, and production build passed.

DEC-012 supersedes the directly scroll-bound curtain edge and 48px artwork reveal in DEC-011. Physical mouse/trackpad feel and Safari/Firefox remain handoff checks.

## Completed — About Me, 2026-10-12

- [x] Add a static, responsive `/#about` page in the existing monochrome identity.
- [x] Group skills into Development, Data and Infrastructure, and Design and Tools.
- [x] Use only the supplied description, phone, email, LinkedIn, and GitHub information.
- [x] Connect shared navigation and the homepage footer while preserving portfolio effects.

## Completed — SENTRI case study, 2026-10-12

- [x] Restore Dispatch as the lead case-study image and explicitly identify it as the core training console; retain the four supporting figures.

- [x] Confirm SENTRI (2026), Team Leader, PostgreSQL, Docker, AWS EC2, and Coolify.
- [x] Summarize capabilities in four points and contributions in five points, retaining supporting/team attribution.
- [x] Present architecture, Gmail Protocol, employee administration, and company setup images with captions and full-size links.
- [x] Preserve existing routes, cover/hover media, other projects, About, and motion behavior.

## Awaiting owner content

Completed 2026-10-13: stationary-pointer previews resume after scrolling and curtain settling, project artwork enlarges by 4%, inactive artwork resets, and keyboard/exit dismissal remains persistent until pointer movement.

- [ ] Confirm years and personal roles/tools for Communimate and Mojo.
  - Completion: only confirmed values replace the currently empty fields.
- [ ] Supply final case-study copy, including any verified metrics, outcomes, or research the owner wishes to publish.
  - Completion: remaining Communimate and Mojo copy is approved without inferring achievements from screenshots. SENTRI's supplied case-study copy is implemented.
- [x] Publish the confirmed owner description, categorized skills, and supplied contact links at `/#about`.

The portfolio now uses real owner-supplied names, descriptions, and media. Missing metadata does not block reviewing the experience and is omitted from the interface.

## Deferred / outside this version

- Three.js, a 3D city, particles, spherical distortion, and complex effects.
- CMS, database, authentication, analytics, forms, and backend services.
- Additional pages or features beyond the requested portfolio flow.
- Public deployment, domain setup, and a hosting provider choice.

Before publication, check physical touch devices and Safari/Firefox, confirm final content, and review performance on the chosen host. These checks do not authorize publication.

About placement correction (2026-10-12): the full About Me content replaces the former Systems/Connections/Possibilities section after Mojo on the homepage. Navigation scrolls to `#about` (or `/#about` from detail routes). `components/About.tsx` renders the content inside the home main landmark in ordinary flow, without parallax. The footer contains only branding and Back to top. `/about` redirects to `/#about` for compatibility; there is no separate About page.
