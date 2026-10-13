# Technical Decisions

## DEC-019 — Centered SENTRI overview and balanced case-study cards

- **Date:** 2026-10-13
- **Status:** Accepted at the owner's request.
- **Decision:** Center SENTRI's role and tools above two equal-width, equal-height desktop cards for Key capabilities and My role. Underline both metadata groups with thin rules; stack cards on tablet and mobile, and metadata on narrow mobile screens.
- **Rationale:** Give the information area symmetry and a clear hierarchy while retaining the confirmed content.
- **Consequences:** Styling is scoped to SENTRI; project data, routes, rotator, and motion behavior remain intact.

## Purpose of this file

Record technical decisions and why the project owner chose them. Preserve the context, alternatives, and consequences so future work does not repeat debates or replace an intentional choice without understanding it.

An existing implementation shows what was used; it does not prove why it was chosen. Do not invent the owner's reasoning.

## Recording rules

- Use a stable sequential ID for each decision.
- Mark records Proposed, Accepted, Rejected, or Superseded.
- Mark a decision Accepted only when supported by an owner request or approval.
- Record the actual rationale and relevant alternatives. If the reason is unknown, say so.
- Preserve old records. If a decision changes, add a new record and link the superseded one.
- Keep implementation details in [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md) and completed changes in [CHANGELOG.md](CHANGELOG.md).

## DEC-001 — Separate project documentation by purpose

- **Date:** 2026-10-06
- **Status:** Accepted
- **Decision maker:** Project owner
- **Context:** The project needs an introduction, controlled scope, an explanation of how the system connects, a change history, and records of technical rationale.
- **Decision:** Maintain README.md, ROADMAP.md, TECHNICAL_ARCHITECTURE.md, CHANGELOG.md, and Decisions.md as separate documents.
- **Rationale:** The owner explicitly requested these roles: explain the project, prevent random feature additions, explain connections, track changes, and preserve reasons for technical choices.
- **Alternatives considered:** No alternatives were discussed or recorded.
- **Consequences:** Contributors must update the relevant documents as work changes scope, structure, behavior, or accepted technical choices.

## Legacy prototype choices with unrecorded rationale

These describe the original HTML prototype, retained for reference. They are not the current architecture or accepted decision records:

| Observed choice | Rationale |
| --- | --- |
| Plain HTML and CSS with inline JavaScript, now under `archive/legacy-static-site/` | Not yet recorded by the owner. |
| Local images and font files | Not yet recorded by the owner. |
| Separate HTML files for secondary destinations | Not yet recorded by the owner. |
| VS Code Live Server port `5501` | Not yet recorded by the owner. |

## DEC-002 — Make the portfolio scroll-driven and project-focused

- **Date:** 2026-10-10
- **Status:** Accepted
- **Decision maker:** Project owner
- **Context:** The portfolio should present completed work through a cinematic interaction inspired by the supplied reference sites. The central interaction is a smooth transition from project to project while scrolling.
- **Decision:** Use full-screen project panels with scroll-driven transitions, pointer-based project previews, and links to individual project detail pages.
- **Rationale:** The owner explicitly identified the sliding project experience as the core of the website and wants the site to display what they have done.
- **Alternatives considered:** A conventional grid of project cards does not satisfy the requested central interaction.
- **Consequences:** Animation, project content structure, routing, touch behavior, and accessibility must be designed together. Project content must remain understandable without hover or motion.

## DEC-003 — Migrate toward Next.js, React, and TypeScript

- **Date:** 2026-10-10
- **Status:** Accepted — implemented in version one
- **Decision maker:** Project owner
- **Context:** The static HTML/CSS prototype needs reusable project components, multiple project detail routes, and coordinated interactive state.
- **Decision:** Plan a migration to Next.js with React and TypeScript. Keep CSS as the styling layer.
- **Rationale:** This structure fits reusable UI components, data-driven project pages, and a growing portfolio while preserving the browser technologies already used by the site.
- **Alternatives considered:** Continue expanding separate HTML files, or use plain JavaScript without a framework. Those options remain suitable for a small static page but are less suitable for the requested project system.
- **Consequences:** The project will gain a Node-based development setup, dependencies, a build step, and a migration cost. The current static prototype should remain a reference until the new shell is working.

## DEC-004 — Use GSAP for scroll choreography and keep Three.js optional

- **Date:** 2026-10-10
- **Status:** Accepted — implemented in version one; Three.js deferred
- **Decision maker:** Project owner
- **Context:** The site needs smooth full-screen project transitions and a cursor-responsive light over the city.
- **Decision:** Use GSAP ScrollTrigger for scroll-linked project animation. Start the hero light with CSS or canvas; evaluate Three.js only if real 3D depth or a spherical city effect is needed.
- **Rationale:** Scroll choreography is the core requirement, while Three.js solves a narrower 3D problem and adds implementation and performance cost. The first version should validate the interaction before adding a 3D renderer.
- **Alternatives considered:** Use Three.js for the entire site, or rely only on CSS transitions. Full-site Three.js is unnecessary for content and routing; CSS alone may be insufficient for the planned scroll timeline and pinning behavior.
- **Consequences:** The implementation must provide reduced-motion and touch fallbacks and test animation performance before adding more effects.

## DEC-005 — Ship the interaction with explicitly labeled placeholder projects

- **Date:** 2026-10-10
- **Status:** Superseded by DEC-009 after the owner supplied project content
- **Decision maker:** Project owner, through the implementation request
- **Context:** The landing page and scrolling experience need to be reviewable before real project case studies are supplied.
- **Decision:** Use ELKAHFI and the updated “System Design” tagline. Include three placeholder projects with shared typed data and real detail routes. Keep unknown dates and roles null and tools empty. Clearly label placeholder content in panels, previews, and detail pages.
- **Rationale:** The owner explicitly requested a working version with placeholder scrolling pages and prohibited invented biography, clients, achievements, or contact details.
- **Alternatives considered:** Waiting for all real content would delay the requested interaction prototype. Fabricated case studies would misrepresent the owner's work.
- **Consequences:** The interaction can be reviewed now. Real project content remains outstanding; placeholder detail pages are excluded from search indexing until replaced. The original HTML/CSS files remain as reference material.

## DEC-006 — Keep native scrolling and use a 2D spotlight

- **Date:** 2026-10-10
- **Status:** Superseded in part by DEC-007 and DEC-008; native input, real links, and the 2D spotlight remain accepted
- **Decision maker:** Project owner set the constraints; Codex selected the implementation details
- **Context:** Smooth vertical transitions must remain reversible and support keyboard, touch, and reduced-motion visitors.
- **Decision:** Keep panels in document flow. Use GSAP for artwork parallax and gentle snapping only near section boundaries on fine-pointer desktop devices. Use a CSS radial gradient and eased pointer coordinates for the city light. Supply ordinary links independently of previews.
- **Rationale at the time:** The first implementation interpreted vertical progression as ordinary document flow with parallax. The owner subsequently clarified that this did not fulfill the requested curtain effect. Soft illumination with the existing city image and avoiding wheel interception remain appropriate constraints.
- **Alternatives considered:** Pinned/stacked panels and mandatory full-page snapping add complexity to focus and restoration. Three.js is unnecessary for revealing a flat image. These alternatives are not included in version one.
- **Consequences:** Transitions are deliberately subtle and do not force a whole-page jump on every scroll. Touch gets static light and inline summaries; reduced motion disables animations and snapping and uses a fixed preview position. Next.js route restoration and GSAP cleanup need regression coverage.

## DEC-007 — Layer incoming curtains over stationary panels

- **Date:** 2026-10-10
- **Status:** Accepted geometry; pin implementation superseded by DEC-012. Supersedes DEC-006's ordinary-flow/parallax transition choice
- **Decision maker:** Project owner, through the explicit refinement specification
- **Context:** Ordinary scrolling moved both sections and failed to deliver the requested physical sliding-panel effect.
- **Decision:** Use GSAP ScrollTrigger to pin the previous section while the next full-screen opaque panel rises over it on a higher layer. Repeat from the hero through all three projects, with continuous native scroll control, reversal, and gentle desktop snapping.
- **Rationale:** The owner specified an observable midpoint: the lower half must show the incoming panel while the upper half retains the stationary previous section. This is the portfolio's central interaction.
- **Alternatives considered:** Ordinary stacked scrolling and artwork parallax alone were explicitly rejected. Wheel interception and forced slide advancement are unnecessary.
- **Consequences:** Stable wrapper anchors, focus visibility, cleanup, resize, and route restoration require regression checks. Touch retains native input without snapping. Reduced motion and short landscape screens use unpinned flow. Project 03 releases normally into About.

## DEC-008 — Minimal identity, concealed navigation, and shared text illumination

- **Date:** 2026-10-10
- **Status:** Accepted — implemented
- **Decision maker:** Project owner
- **Context:** The first landing page was too cluttered, and permanently bright type felt disconnected from the city light.
- **Decision:** Center only ELKAHFI and System Design over the city, with a small top-center navigation trigger. Reveal Intro, Work, and About on hover or activation. Use one CSS/JavaScript spotlight position for the city and a masked brighter text layer with restrained highlights and shadows.
- **Rationale:** The owner wants a minimal resting composition and subtly dimensional lettering responding to the same cursor light as the city.
- **Alternatives considered:** Permanently visible header links, corner copy, ornamental symbols, and a large glow/zoom conflict with this request. Three.js adds no necessary capability for this effect.
- **Consequences:** Keep base text readable, decorative text hidden from screen readers, and menu access available by keyboard/touch. Hidden links are not focusable. Reduced motion removes cursor following and the text offset. Placeholder labels and functional controls remain visible where needed.

## DEC-009 — Present owner-supplied work through image-led panels

- **Date:** 2026-10-10
- **Status:** Accepted — implemented; supersedes DEC-005's placeholder-content choice
- **Decision maker:** Project owner
- **Context:** The owner supplied Sentri, Communimate, and Mojo descriptions and images, and requested visual project panels with details available through interaction.
- **Decision:** Replace the placeholders with these three projects. Use the Sentri mascot, Communimate practice screen, and Mojo skill tree in their original colors. Keep desktop panels free of descriptive copy, with a subtle open control and accessible link names. Put supporting text in previews and visual-first detail pages; expose summaries directly on touch/reduced-motion layouts.
- **Rationale:** The owner wants the imagery to explain the work without crowding each full-screen section. Sentri is confirmed as 2026; missing years, roles, tools, metrics, and outcomes remain unfilled instead of invented.
- **Alternatives considered:** Keeping placeholder labels after content was supplied would be misleading. Reusing the complete Sentri page screenshot as the cover would bake unwanted interface labels into the panel, so it informs the composition instead.
- **Consequences:** Named routes replace numbered project URLs, with redirects for existing links. Screenshot interface features may be described, but demo statistics are not evidence of achievements. Final case-study copy and additional metadata remain owner inputs.

## DEC-010 — Short Sentri video and controlled native curtain motion

- **Date:** 2026-10-10
- **Status:** Accepted — implemented
- **Decision maker:** Project owner set the interaction goals; Codex selected the excerpt and tuning values
- **Context:** The owner requested a small recording clip in Sentri's hover card and smoother scrolling without a slippery or delayed feel.
- **Decision:** Serve an eight-second silent looping clip from the supplied recording with a poster underneath. Load playback only for an active preview with motion enabled. Preserve native curtain movement; use anticipatory pinning and limit snapping to within 8% of a boundary, after a 0.32-second pause, with a short 0.18–0.32-second settle.
- **Rationale:** A short clip demonstrates the interface while limiting download/playback work. Poster fallback supports autoplay failure and reduced motion. Narrower snapping preserves deliberate scroll positions and avoids distant slide jumps.
- **Alternatives considered:** A full-length recording would download more media than the hover card needs. Added inertia libraries, wheel interception, aggressive snapping, and long catch-up animations conflict with the owner's request for control.
- **Consequences:** Preview dismissal must stop and unload video. Touch uses inline summaries, and reduced motion uses static imagery and ordinary scrolling. Physical-device feel and Safari/Firefox playback should still be checked before publication.

## DEC-011 — Add depth inside native curtains with coordinated artwork motion

- **Date:** 2026-10-10
- **Status:** Partially superseded by DEC-012 for scroll following and reveal; pointer motion and static touch fallback remain accepted
- **Decision maker:** Project owner specified the motion direction and constraints; Codex selected bounded amplitudes and timings
- **Context:** The owner wants more perceptible glide, subtle enlargement, cursor-responsive hero depth, inverse project parallax, and a slower artwork reveal within each rising panel.
- **Decision:** Keep the opaque curtain edge directly controlled by native scrolling. Add up to 2% artwork scale, small hero translation toward the pointer, inverse project translation (up to 12px/10px), and a 48px scroll reveal with 0.28-second catch-up. Keep snapping within 8% of a boundary, settling over 0.24–0.42 seconds. Use independent CSS variables composed into one artwork transform. Touch now uses ordinary scrolling and static artwork, as required by the latest brief.
- **Rationale:** Artwork motion adds depth and a sense of momentum without delaying native scroll input or disturbing the stationary panel geometry. Bounded scale/translation preserves readability and link placement. A single composed transform avoids competing animation controllers.
- **Alternatives considered:** Inertia libraries and wheel interception conflict with the requested control. Scaling the entire pinned panel would move controls and create edge gaps. Applying cursor motion to menus, previews, About, or detail pages exceeds the requested effect.
- **Consequences:** Hero light and both text layers must remain aligned. Pointer exit returns artwork to rest; cleanup handles live reduced-motion changes, resizing, and routes. Reduced motion disables all added effects. Final subjective motion feel and physical-device performance remain review points.

## DEC-012 — Spring-follow native scroll and counter-translate project images

- **Date:** 2026-10-11
- **Status:** Accepted — implemented; supersedes DEC-007's pin implementation and DEC-011's directly scroll-bound curtain edge and 48px reveal.
- **Decision maker:** Project owner requested spring smoothing and slower images; Codex selected the implementation and tuning.
- **Context:** The owner reports choppy mouse-wheel steps despite smooth trackpad input. Smoothing artwork alone leaves the curtain edge visibly stepped.
- **Decision:** Keep native document scroll and stable anchor slots, with separate fixed visual surfaces driven by one ScrollTrigger target and a critically damped frame loop. Use mass 1, stiffness 900/damping 60; fine pixel updates below 40px use 3600/120. Clamp overshoot, reset opposing momentum, and stop frames after settling. Counter-translate project art by 75% of incoming-panel distance so it travels 25% as far in the viewport, reaching zero offset at rest.
- **Rationale:** Separate visual progress smooths discrete input while retaining native input, anchor positions, keyboard access, and history. A shared coordinate keeps image and curtain motion synchronized. Independent pointer/reveal variables compose into one artwork transform.
- **Alternatives considered:** Long CSS transitions, a second scrub lag, wheel interception, forced slide advancement, and another scrolling library would add delay or competing controllers. No dependencies were added.
- **Consequences:** Typical wheel catch-up targets 200–450ms without bounce. Small updates respond faster; this is not hardware detection. Navigation bypasses wheel smoothing, and snapping remains confined to 8% of a boundary after 400ms, lasting 240–420ms. Touch/reduced motion use static flow. Surface movement is only for curtain coverage; controls receive no artwork parallax. Fixed layers, focus, restoration, reversal, and live preference cleanup need regression coverage. Physical input feel and Safari/Firefox remain unverified.

## DEC-013 — Dedicated static About Me page

- **Date:** 2026-10-12
- **Status:** Accepted — implemented
- **Decision maker:** Project owner requested the page and supplied its content.
- **Decision:** Add `/about` using existing monochrome styles and shared navigation. Present the lightly edited description, three prescribed skill categories, and exact supplied contact destinations. Preserve the home footer anchor and add a link to the page.
- **Rationale:** A dedicated route makes this information readable and directly addressable without adding content to animated project panels.
- **Alternatives considered:** Expanding the homepage footer would crowd the existing portfolio sequence. New visuals or motion would exceed the requested scope.
- **Consequences:** About is static, responsive, and keyboard accessible. Unknown project metadata remains omitted; no further biography is required for this request.

## DEC-015 — Expand SENTRI with confirmed ownership and visual evidence

- **Date:** 2026-10-12
- **Status:** Accepted — implemented
- **Decision:** Extend the existing SENTRI record with the Team Leader role, confirmed infrastructure tools, compact capability/contribution lists, and four captioned images. Keep `/projects/sentri` and existing cover/preview media.
- **Rationale:** Lead with the product and architecture, then summarize personal contributions without claiming sole ownership of team work. Full-width images and original-size links keep the evidence readable.
- **Image mapping:** Architecture → Protocol → employee-management admin screen → company-registration entry screen. The two Deployment screenshots are mapped by their visible content to match the requested captions.
- **Owner correction:** Dispatch is the core feature and must remain visible. Its new console screenshot now leads the case study before these four images, with a dedicated caption and explicit capability point.
- **Consequences:** Optional typed fields preserve the other projects' layout. No new animations or dependencies. Screenshot demo data is not presented as real usage or measured results. Unknown Communimate/Mojo metadata remains pending.

## Template for future decisions

### DEC-018 — Center project visuals and finish with architecture

- **Date:** 2026-10-13
- **Status:** Accepted, per owner layout correction.
- **Decision:** Put the indicator above the image, heading/description beneath and centered, and SENTRI Technical Architecture last. Remove full-size image links.
- **Rationale:** The owner wants the visual to lead the page with its description at the bottom center, rather than a side column.
- **Consequences:** Rotator interaction, data, repositories, and accessibility remain intact; supersedes the side-by-side caption and full-size-link presentation.

### DEC-017 — Immediate hover ownership and local project rotators

- **Date:** 2026-10-13
- **Status:** Accepted; supersedes DEC-016's 500ms preview quiet timer.
- **Decision:** Hit-test the remembered cursor during native/visual scrolling with no delay. Keep the preview present whenever the project is identifiable; replace media only when project ownership changes. Use local state for image/text rotation without route navigation.
- **Rationale:** Immediate context is the owner's priority. Event-driven checks provide that response without an idle loop. A grey line with white active segment communicates progress with minimal UI.
- **Consequences:** Dismissal persists until pointer movement. Rotators wrap, support drag/swipe and scoped arrow keys, and use immediate changes for all motion preferences. SENTRI retains five visuals; Communimate/Mojo reuse each existing image for their two narrative sections until more assets are supplied. Repository links are only the owner-confirmed SENTRI/Communimate URLs.

### DEC-016 — Resolve hover ownership after visual movement

- **Date:** 2026-10-13
- **Status:** Accepted
- **Decision:** Share curtain-progress notifications with pointer effects and hit-test the last known cursor position after 500ms of quiet. Increase project-only scale to 1.04 and reset inactive artwork. Hero stays at 1.02.
- **Rationale:** A stationary cursor must discover the project moved beneath it. Waiting until native/visual motion settles avoids flashing previews between panels; event-driven updates avoid a permanent idle loop.
- **Consequences:** Explicit dismissal clears pointer memory until new movement. Media unmounts while scrolling and resumes through its existing lifecycle. Touch and reduced motion retain their respective static behavior. Supersedes the earlier freeze-inactive-artwork and 2% project-scale choices.

### DEC-NNN — Short decision title

- **Date:** YYYY-MM-DD
- **Status:** Proposed / Accepted / Rejected / Superseded
- **Decision maker:** Person who chose or approved it
- **Context:** Problem, constraints, and requirements
- **Decision:** What was chosen
- **Rationale:** Why it was chosen
- **Alternatives considered:** Other options and why they were not selected
- **Consequences:** Benefits, tradeoffs, and follow-up obligations
- **References:** Related request, roadmap item, change, or superseding decision

## DEC-014 — Inline About Me supersedes DEC-013

- **Date:** 2026-10-12
- **Status:** Accepted; supersedes the separate-page placement in DEC-013.
- **Decision:** At the owner’s correction, replace the existing final homepage section with the full About content and use anchor navigation. Keep `/about` only as a redirect to `/#about`.
- **Rationale:** About belongs in the continuous portfolio sequence. Ordinary flow allows all skills and contacts to remain reachable on short/mobile screens without new effects.
- **Consequences:** Owner content and contact destinations are unchanged; the former promotional heading is removed.
