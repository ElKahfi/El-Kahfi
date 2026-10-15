# Technical Architecture

## Purpose of this file

Explain how the implemented portfolio connects. Keep future work in the roadmap and reasons for technical choices in Decisions.md.

## Runtime and routes

The active site uses Next.js 16.4, React 19.3, TypeScript, CSS, and GSAP 3.15 ScrollTrigger. `package-lock.json` records exact installed dependencies. The App Router prerenders the home page, the three known personal project detail pages, and the university collection page. No API, database, authentication, CMS, or persistent visitor data is used.

```text
app/layout.tsx — metadata, global CSS, skip link
├── app/page.tsx — home (server-rendered composition)
│   ├── Navigation → hidden menu: #top, #work, #university, #about
│   ├── curtain-slot #top → Hero → city + shared text spotlight
│   ├── curtain-slot #projects → ProjectSection → Personal / Team introduction
│   ├── curtain-slot × 3 → data/projects.ts → ProjectPanel × 3
│   ├── curtain-slot #university → ProjectSection → university collection link
│   ├── ProjectPreview → hover summary → PreviewMedia → image/video
│   ├── ScrollExperience → GSAP effects on the panels
│   ├── VisualMotion → eased pointer translation and scale variables
│   ├── About → description, skills, contacts
│   └── Footer → branding and back-to-top link
├── components/About.tsx — homepage owner description, grouped skills, contact links
├── app/projects/[slug]/page.tsx
│   └── data/projects.ts → ProjectDetails → shared header, links, rotator, metadata/cards, next/return links
├── app/university-projects/page.tsx
│   └── data/university-projects.ts → UniversityProjects → selected project and controls
└── app/not-found.tsx — unknown route/project
```

The detail route awaits asynchronous route parameters, uses `generateStaticParams` for known slugs, and calls `notFound()` for unknown projects. Named slugs are `sentri`, `communimate`, and `mojo`; the previous `project-01` through `project-03` routes permanently redirect to them. Metadata comes from the same project record. These owner-supplied projects no longer receive placeholder `noindex` metadata. The root HTML declares `data-scroll-behavior="smooth"` so Next.js can manage route restoration correctly.

## Responsibilities

| File or folder | Responsibility |
| --- | --- |
| `data/projects.ts` | Typed owner-supplied project records, image galleries, lookup, and legacy slug mapping. |
| `components/Navigation.tsx` | Fixed top-center menu with hover, focus, click/tap, Escape, outside dismissal, and hidden/inert links. |
| `components/Hero.tsx` | Client component for shared city/text illumination and centered identity. |
| `components/ProjectPanel.tsx` | Server-rendered image-led panel, hidden semantic title, touch summary, and one full-panel project link. |
| `components/ProjectDetails.tsx` | Shared server-rendered personal case-study template for SENTRI, Communimate, and Mojo, with optional metadata, links, and content cards. |
| `components/ProjectPreview.tsx` | Client component for the decorative, non-interactive cursor card. |
| `components/PreviewMedia.tsx` | Poster image and optional muted video; playback lifecycle and reduced-motion fallback. |
| `components/ScrollExperience.tsx` | ScrollTrigger target observation, a critically damped visual follower, artwork parallax, anchor reconciliation, and gentle desktop snapping. |
| `components/VisualMotion.tsx` | Fine-pointer translation/scale, frame-rate-independent easing, exit/reset behavior, and live preference cleanup. |
| `components/Footer.tsx`, `Arrow.tsx` | Footer and shared decorative icon. |
| `app/globals.css` | Typography, layouts, spotlight, focus, responsive, and motion rules. |
| `public/images/`, `public/media/` | Optimized city/project images and the short Sentri MP4. Old SVG placeholders are stored under archive/unused-project-covers/. |
| `tests/portfolio.spec.ts` | Browser checks for navigation, layout, pointer/touch behavior, scrolling, and reduced motion. |
| `tests/motion.spec.ts` | Cursor direction/scale, fixed control bounds, reveal/reversal, static fallbacks, and live preference checks. |
| `tests/spring.spec.ts` | Frame samples for stepped/fine wheel input, reversal, settling, slower image travel, and keyboard interruption. |
| `playwright.config.ts` | Desktop, emulated mobile, and reduced-motion Chrome test profiles. |

## Content flow

Each `Project` contains `slug`, `title`, nullable `year` (number or Ongoing), `summary`, nullable `role`, `tools`, optional `repository`/`website`, `coverImage`, `coverAlt`, `presentation` (mascot/interface), `previewImage`, optional `previewVideo`, `gallery`, `detailContent`, optional `caseStudy`, `isPlaceholder`, and `theme`. Gallery entries carry source, meaningful alt text, width, and height. Panels, previews, and detail pages consume this shared source.

All three records are non-placeholder. SENTRI has confirmed year 2026, role Team Leader, and PostgreSQL/Docker/AWS EC2/Coolify tools. Communimate is an Ongoing Independent Project using HTML/CSS/JavaScript. Mojo is Ongoing with role System Design Infrastructure; its supplied context supports Next.js/React/TypeScript/Neon PostgreSQL. Unknown fields are omitted. Owner statements establish individual contributions; screenshots do not establish measured outcomes.

`ProjectDetails` renders one common order: title/year/summary, available external links, `ProjectRotator`, centered role/tools, paired Key capabilities/My role cards, optional narrative cards, and next/return navigation. Capability/contribution arrays and narrative sections are individually optional; absent metadata or links produce no placeholder blocks. Shared `.personal-project-page` styles apply SENTRI's centered metadata and bordered card treatment to every personal project; cards stack on narrow screens. University details retain their separate selector layout.

SENTRI's visual order is Dispatch, Protocol, employee admin, company setup, then Technical architecture. Its demo admin invitations remain identified as simulated. Mojo's five captioned screenshots follow the owner's order: Chatbot, Drill, Kuantitatif Drill List, Drill Mode, Drill Mode Content. Communimate keeps its two narrative slides using the existing image. Mojo's former skill-tree gallery image remains its homepage cover/preview. Its current capabilities, contribution scope, demo state, and planned features are based on the supplied technical overview; the source record is in PROJECT_SOURCES.md.

React state changes when a different preview becomes active. Pointer positions use refs and direct style updates instead of rerendering the application on every movement.

## University collection

The landing sequence is `top`, `projects`, `work` (SENTRI), `communimate`, `mojo`, `university`, then About in ordinary flow. The Personal / Team introduction is a compact heading in `.curtain-slot--compact`, with matching short slot and fixed-surface heights on enhanced desktop. SENTRI begins immediately after that scroll distance. The University Projects introduction remains a full-screen `.screen` with centered title and one collection link. Neither introduction has `.project-art` or a project hover preview. `ScrollExperience` remembers `#university` when its collection link is activated, and the collection page returns to that anchor. Existing personal project anchors retain their meaning.

`UniversityProjects` owns one selected index. Its visible project list uses pressed-state buttons controlling the project article, with Previous/Next controls and wrapping navigation. Arrow keys operate only while the image is focused; horizontal pointer/touch gestures on the image switch projects without taking over vertical scrolling. A polite live status announces the selected project. The image, title, discipline, summary, role, tools, narrative, caption, and external links derive from the same selected record and render together. External sources open with `noopener noreferrer`.

`ProjectSection` shares a decorative `SectionBackdrop` using the existing city image through `next/image`, with empty alternative text inside an `aria-hidden` container. Scoped CSS adds static charcoal gradients, fading personal-heading rules, and the university inset frame. The collection link has a rounded dark surface and circular arrow with explicit focus styling; reduced motion removes its hover arrow translation. These layers ignore pointer input and do not change curtain measurements or add animation effects.

`data/university-projects.ts` stores a dedicated `UniversityProject` type and three records. Tools are design/documentation tools verified by source files or owner context; no university years or detailed personal tasks are inferred. Whole owner screenshots are served as WebP at original dimensions in `public/images/university/`. Source evidence and access gaps are documented in PROJECT_SOURCES.md. `tests/university.spec.ts` checks entry/return navigation, selection consistency, images, source links, keyboard/swipe navigation, and overflow across the existing device/motion profiles.

## Hero illumination

The city image sits beneath a dark radial-gradient overlay. JavaScript updates `--light-x` and `--light-y` on the hero using `requestAnimationFrame` and eased interpolation. The transparent center reveals the image; the edge fades into darkness. A separate vignette supports text contrast.

The centered semantic heading and tagline remain subdued but readable. An `aria-hidden` duplicate uses a radial CSS mask inheriting the same light coordinates and radius. Only the illuminated region becomes brighter. Restrained shadows and a one-pixel offset on the highlighted name suggest raised lettering without changing layout. Reduced motion removes the offset. The decorative duplicate is excluded from assistive technology.

Animation stops once the light reaches its target. Listeners and pending frames are removed on cleanup. Pointer and reduced-motion media queries update behavior live. Touch and reduced-motion visitors see a static spotlight. No canvas or Three.js renderer is used.

## Project scrolling and previews

Each full-screen panel has a fixed visual `.curtain-surface` inside a stable `.curtain-slot` on enhanced desktop layouts. Those slots remain one viewport tall in document flow; the Personal / Team slot is shorter and its fixed surface matches its heading height. Slot positions are measured from the document rather than inferred from viewport multiples. The slots own the anchors (`top`, `projects`, `work`, `communimate`, `mojo`, `university`); aliases preserve numbered anchors and `sentri`. Increasing stacking order keeps each incoming opaque surface above its predecessor. Enhancement requires a fine pointer, hover, a viewport at least 520px high, and no reduced-motion preference.

ScrollTrigger observes native scroll position and supplies the destination for one requestAnimationFrame follower. A passive capture-phase wheel listener classifies input before ScrollTrigger's bubbling wheel listener, without preventing input or scrolling the document. Each surface sits at `max(0, sectionStart - visualScroll)`: the outgoing surface stays at zero, and the incoming surface covers the lower half at half a section of visual progress. The final surface releases into ordinary About/footer flow. Touch, reduced motion, and short landscape viewports keep ordinary document flow with no fixed surfaces.

The follower uses the analytic critically damped spring solution: mass 1, angular frequency 30/s, stiffness 900, and damping 60. Fine pixel wheel updates under 40px use frequency 60/s, stiffness 3600, and damping 120 to minimize lag. This classifies input size, not hardware. Opposing velocity resets on reversal; each frame is clamped between its previous value and target to avoid overshoot. Frame delta is capped at 50ms, and the loop stops within 0.1px and 1px/s of its target. Normal stepped input targets roughly 200–450ms of visual settling. Only recent wheel-driven changes enter the follower; keyboard, pointer presses (including scrollbar dragging), anchors, history, and programmatic changes without recent wheel input synchronize directly. Scrolling wholly within the footer remains ordinary. Native navigation always remains authoritative.

The same ScrollTrigger handles snapping within 8% of viewport height of a section start. It waits 400ms, then settles over 240–420ms with `power2.out`, without inertia or directional snapping. Navigation/focus suppress snapping; new wheel input interrupts an existing snap. Snap animation is not spring-smoothed again. Mid-panel stops stay where the visitor left them.

Focused project links bring their stable wrapper to the top. Before ordinary project-link navigation, the home history entry receives that project's anchor through `history.replaceState`, preserving existing state and leaving modified clicks alone. Initial hashes are reconciled once after measurement; later preference changes retain the current scroll position instead of returning to a stale hash. Refresh recalculates section positions and synchronizes visuals. A native matchMedia listener owns a local GSAP context, avoiding the global GSAP matchMedia refresh resetting scroll memory when the final trigger is removed. Cleanup cancels frames/listeners, removes enhancement styles/variables, and reverts that context on unmount or preference changes. Curtain slots opt out of scroll anchoring during the fixed/static layout switch.

## Coordinated artwork motion

`VisualMotion` updates `--pointer-x`, `--pointer-y`, and `--visual-scale` on the active screen with requestAnimationFrame and a 110ms exponential time constant. React does not rerender for pointer coordinates. Hero text moves at most 6px horizontally/4px vertically toward the pointer; its city moves 1.5 times those distances. Both grow from scale 1 to 1.02. The base and illuminated headings share identical transforms, while the light/mask remain in viewport coordinates. An 18px city overscan prevents edge gaps.

Project artwork moves up to 12px horizontally/10px vertically opposite the pointer and grows to scale 1.04. Hit areas, menu, summaries, previews, and detail-page content are not transformed. Pointer exit, blur, resize, Tab, and Escape ease artwork back to its resting pose. Inactive artwork returns to its resting pose. Scroll observation and curtain-progress/settled events identify the section beneath a stationary cursor. Animation frames stop once values settle, and listeners/variables are removed on cleanup or a motion preference change.

The curtain follower also owns `--reveal-y` on each project artwork. It counter-translates by 75% of the incoming surface's remaining distance (bounded to one viewport), so the image moves upward by only 25% of the panel's viewport travel. At the panel's resting position the offset is exactly zero. The same visual coordinate drives both layers, giving a coordinated finish and natural reversal without a second delayed tween. The panel clips the reveal over an opaque background; original image aspect ratios and final framing remain intact.

CSS combines reveal offset, pointer translation, and scale in one transform on `.project-art`. The outer surface moves only for curtain coverage; the project panel and full-panel link receive no independent scale or parallax. IntersectionObserver limits artwork `will-change` to visible screens, and curtain visibility clears promotion for covered/future surfaces. There is no permanent offscreen artwork promotion.

Touch and reduced motion disable these artwork transforms. Reduced motion also disables the hero text offset, following spotlight, snapping, pinning, and smooth anchor scrolling. Detail pages and About retain their ordinary layout and behavior.

The desktop hover card follows the pointer with short eased catch-up, is clamped to a 16px viewport margin, and uses `pointer-events: none`. It hides on scrolling, pointer exit, Escape, Tab, window blur, or unmount. Under reduced motion it appears in a fixed corner. Desktop panels show the artwork and subtle arrow control; hidden semantic titles and named full-panel links provide keyboard/screen-reader access without visible descriptive text. Touch and reduced-motion layouts expose summaries directly.

`PreviewMedia` always renders a poster image beneath optional video. Sentri's source is attached only while its preview is mounted and motion is enabled. Playback is muted, looped, inline, and non-interactive; the video becomes visible only after playback starts. Autoplay rejection or playback error leaves the poster visible. Closing the card pauses playback, removes the source, and resets the media element. Reduced motion leaves the video unloaded and hidden.

Touch/small-screen layouts show summaries directly. Touch has no pinning, reveal, pointer transforms, or snapping; a narrow window with a fine pointer can still use desktop motion. Reduced motion disables smooth anchor scrolling, pinning/curtain motion, snapping, cursor following, scale, reveal, and the text offset. Semantic headings, real links, a skip link, and focus outlines support keyboard navigation.

## Compact navigation

Rotator layout correction: controls/indicator precede the single full-width image, and a centered caption follows it. Full-size image links are removed. `getProjectSlides` places Technical Architecture last while retaining the other slides' order. The fixed image area and reserved caption height keep controls stable across changes; geometry assertions cover indicator placement and caption alignment.

Real-time preview and rotator update (2026-10-13): `ProjectPreview` now hit-tests on every native scroll and curtain-progress/settled notification, retaining the card while a project is identifiable. The 500ms quiet timer and wheel-based hiding are removed. Project ownership changes update React state; same-project movement retains the mounted media. Explicit dismissal clears pointer memory. These events are produced only during movement; preview positioning stops once settled, with no idle polling.

`ProjectRotator` is a client component receiving serializable `ProjectSlide[]` through `getProjectSlides` in `ProjectDetails`. SENTRI and Mojo gallery captions each define five slides; Communimate reuses its supplied visual with two narrative sections. Local index state switches image/heading/body together, wraps Previous/Next and arrow keys, and supports primary-pointer capture with a 50px horizontal threshold. `touch-action: pan-y pinch-zoom` preserves vertical scrolling and zoom. No auto-advance or animated slide transition is used, including reduced motion. The line indicator shows a white segment on grey; a polite live caption announces slide count. Only the active image is rendered, with meaningful alt text. Optional repository/live-site links use `target="_blank" rel="noopener noreferrer"`. Contributions and metadata remain server-rendered below the rotator.

Stationary hover (2026-10-13): `ProjectPreview` remembers the latest pointer coordinates and hit-tests with `elementFromPoint`. Native scrolling, wheel input, and `curtainprogress`/`curtainsettled` signals hide/unmount the preview and restart a 500ms quiet timer. After native movement, visual spring movement, and snapping finish, it resolves the current project and remounts its preview/media. Tab, Escape, blur, and pointer exit clear the remembered pointer, preventing a pending timer from undoing dismissal. Timers and listeners are cleared on unmount. Reduced motion retains a fixed-corner poster preview; touch retains inline summaries. `VisualMotion` shares the progress signal for active ownership, targets 1.04 for projects (hero 1.02), and resets inactive artwork. Frame loops stop when transforms settle; no continuous idle polling is added.

Navigation sits above all curtain layers. Its stationary top-center trigger exposes a dark panel below it with Intro, Work, and About links. The trigger and links share a contiguous pointer region. Hover opening is restricted to fine-pointer devices, avoiding synthetic mouse events reopening the menu after a touch toggle. Activation keeps the menu open, even if hover already revealed it; a second activation closes it. Keyboard focus opens the menu; Escape closes it and returns focus to the trigger. Selection closes it, and outside pointer presses dismiss it. Closed navigation uses both `hidden` and `inert`, keeping its links out of the tab order. Detail pages use home-page hashes; the homepage uses local anchors for all three menu links.

## Media and performance

`archive/legacy-static-site/Pictures/TEST02.jpeg` is preserved as the source. Its serving copy, `public/images/city.webp`, is 2560×1440 and approximately 275 KiB, compared with the approximately 667 KiB original. Next Image supplies responsive raster sizes. The hero and detail lead images are preloaded; homepage project covers load lazily. Typography uses system fonts without third-party font requests.

Owner-supplied originals remain untouched. Serving copies preserve their original colors: Sentri mascot (1144×1375, approximately 92 KiB), Sentri console (1628×902, 87 KiB), Communimate (1732×1004, 49 KiB), Mojo (2400×1561, 100 KiB), and the Sentri poster (960×530, 42 KiB). SentriPage.png informed the mascot composition; the panel uses the isolated mascot so baked-in labels from that reference do not reintroduce unwanted text.

The Sentri MP4 is an eight-second video-only excerpt (seconds 5–13 of the supplied recording), approximately 1.7 MiB, exported at a 960×540 bounding size with its aspect ratio preserved and optimized for streaming. The poster comes from approximately 9.58 seconds. Public URLs contain no private local paths. The clip has no audio track and is not loaded for touch or reduced-motion visitors.

## Development and deployment

Use Node.js 22+ and the commands in README.md. The development server binds to `127.0.0.1:3000`. Production uses `next build` followed by `next start`; hosting is not configured. Image optimization currently expects the Next.js runtime, so static export would require a separate image strategy.

Next.js generates `AGENTS.md` with version-specific framework guidance. The complete original HTML/CSS prototype, its linked pages, source images, fonts, pixel assets, and Live Server settings are preserved together in `archive/legacy-static-site/`, keeping their original relative paths functional. The unused placeholder SVG covers are grouped in `archive/unused-project-covers/`. Nothing under `archive/` is loaded by the active app.

## Remaining limits

Personal project metadata and case-study copy are supported by owner context; measured outcomes remain unconfirmed. Communimate and Mojo's planned features need content updates when implemented. Chrome desktop and emulated mobile checks do not substitute for physical phones or Safari/Firefox before publication. Production performance scores have not been measured. The earlier installation audit reported a development-only lint dependency chain involving `braces`; it has not been rerun for this content refinement. No framework downgrade was applied to work around that advisory.

## About Me section

`components/About.tsx` is a server component inside the home main landmark with an About Me h2, Skills and Contact h2 headings, skill-category h3 headings, semantic lists, and a contact definition list. Owner-confirmed content is maintained directly in this component: Development; Data and Infrastructure; Design and Tools. Contact links use `tel:08151610212`, the exact supplied email, and the supplied LinkedIn/GitHub URLs. No proficiency or experience claims are inferred.

Scoped `.about-*` CSS reuses existing palette, typography, gutters, and focus styles. Columns collapse on smaller viewports. The shared navigation supports keyboard and touch. About remains outside the curtain slots and receives no motion enhancement. Its `#about` anchor is the navigation destination. `tests/about.spec.ts` covers content, contact destinations, overflow, keyboard focus, and return-to-work behavior in all applicable profiles. Project years, roles/tools, outcomes, and case-study copy remain the outstanding content requests.

About placement correction (2026-10-12): the full About Me content replaces the former Systems/Connections/Possibilities section after Mojo on the homepage. Navigation scrolls to `#about` (or `/#about` from detail routes). `components/About.tsx` renders the content inside the home main landmark in ordinary flow, without parallax. The footer contains only branding and Back to top. `/about` redirects to `/#about` for compatibility; there is no separate About page.
