# Technical Architecture

## Purpose of this file

Explain how the implemented portfolio connects. Keep future work in the roadmap and reasons for technical choices in Decisions.md.

## Runtime and routes

The active site uses Next.js 16.4, React 19.3, TypeScript, CSS, and GSAP 3.15 ScrollTrigger. `package-lock.json` records exact installed dependencies. The App Router prerenders the home page and the three known project detail pages. No API, database, authentication, CMS, or persistent visitor data is used.

```text
app/layout.tsx — metadata, global CSS, skip link
├── app/page.tsx — home (server-rendered composition)
│   ├── Navigation → hidden menu: #top, #work, #about
│   ├── curtain-slot #top → Hero → city + shared text spotlight
│   ├── curtain-slot × 3 → data/projects.ts → ProjectPanel × 3
│   ├── ProjectPreview → hover summary → PreviewMedia → image/video
│   ├── ScrollExperience → GSAP effects on the panels
│   ├── VisualMotion → eased pointer translation and scale variables
│   └── Footer → about text and back-to-top link
├── app/projects/[slug]/page.tsx
│   └── data/projects.ts → detail content, cover, next/return links
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
| `components/ProjectPreview.tsx` | Client component for the decorative, non-interactive cursor card. |
| `components/PreviewMedia.tsx` | Poster image and optional muted video; playback lifecycle and reduced-motion fallback. |
| `components/ScrollExperience.tsx` | Panel pinning, scroll-linked artwork reveal, anchor reconciliation, keyboard visibility, and gentle desktop snapping. |
| `components/VisualMotion.tsx` | Fine-pointer translation/scale, frame-rate-independent easing, exit/reset behavior, and live preference cleanup. |
| `components/Footer.tsx`, `Arrow.tsx` | Footer and shared decorative icon. |
| `app/globals.css` | Typography, layouts, spotlight, focus, responsive, and motion rules. |
| `public/images/`, `public/media/` | Optimized city/project images and the short Sentri MP4. Old SVG placeholders remain unused. |
| `tests/portfolio.spec.ts` | Browser checks for navigation, layout, pointer/touch behavior, scrolling, and reduced motion. |
| `tests/motion.spec.ts` | Cursor direction/scale, fixed control bounds, reveal/reversal, static fallbacks, and live preference checks. |
| `playwright.config.ts` | Desktop, emulated mobile, and reduced-motion Chrome test profiles. |

## Content flow

Each `Project` contains `slug`, `title`, nullable `year`, `summary`, nullable `role`, `tools`, `coverImage`, `coverAlt`, `presentation` (mascot/interface), `previewImage`, optional `previewVideo`, `gallery`, `detailContent`, `isPlaceholder`, and `theme`. Gallery entries carry source, meaningful alt text, width, and height. Panels, previews, and detail pages consume this shared source. Detail pages lead with the first gallery image, followed by concise supporting text, any additional images, and next/return links.

All three records are now non-placeholder. Sentri has the confirmed year 2026; other years and all personal roles remain null, with tools empty. Unknown fields are omitted. Sentri focuses on everyday security behavior, Communimate on speech weaknesses and suitable communication methods, and Mojo on generated UTBK-style practice and a skill-tree journey. Interface descriptions come from supplied screenshots; they do not establish measured outcomes or the owner's responsibilities.

React state changes when a different preview becomes active. Pointer positions use refs and direct style updates instead of rerendering the application on every movement.

## Hero illumination

The city image sits beneath a dark radial-gradient overlay. JavaScript updates `--light-x` and `--light-y` on the hero using `requestAnimationFrame` and eased interpolation. The transparent center reveals the image; the edge fades into darkness. A separate vignette supports text contrast.

The centered semantic heading and tagline remain subdued but readable. An `aria-hidden` duplicate uses a radial CSS mask inheriting the same light coordinates and radius. Only the illuminated region becomes brighter. Restrained shadows and a one-pixel offset on the highlighted name suggest raised lettering without changing layout. Reduced motion removes the offset. The decorative duplicate is excluded from assistive technology.

Animation stops once the light reaches its target. Listeners and pending frames are removed on cleanup. Pointer and reduced-motion media queries update behavior live. Touch and reduced-motion visitors see a static spotlight. No canvas or Three.js renderer is used.

## Project scrolling and previews

Each screen lives inside a stable `.curtain-slot` wrapper with an increasing stacking order. Wrappers own the anchor IDs (`top`, `work`, `communimate`, `mojo`); positioned aliases preserve old numbered anchors and `sentri`. On fine-pointer, hover-capable viewports at least 520px high with motion enabled, ScrollTrigger pins each screen except the last from its wrapper's top until the next wrapper reaches the viewport top, with no extra pin spacing and `anticipatePin: 1`. The incoming opaque screen rises naturally with scroll on a higher layer, covering the stationary pinned screen underneath. At half a viewport of progress, the boundary is exactly at mid-screen. Artwork parallax adds depth inside this curtain; it does not replace its layering.

This design uses native scroll distance to drive coverage continuously; it does not intercept wheel or touch input. Scrolling backward reverses the coverage. Once Mojo is reached, it continues normally into the About footer. Touch devices, short landscape screens, and reduced motion use unpinned document flow. The current touch fallback supersedes the earlier touch curtain behavior.

One additional ScrollTrigger handles settling near section starts on fine-pointer devices. It snaps only within 8% of viewport height of a boundary after a 0.32-second pause, then settles over 0.24–0.42 seconds with `power2.out` and no inertia. Most scrolling remains completely under native input control; there is no wheel interception or smoothing library. Navigation and keyboard use suppress snapping. Keyboard focus on a project link brings its wrapper to the top so an incoming curtain cannot obscure the focused control. Before ordinary project-link navigation, the home history entry receives that project's anchor using `history.replaceState`, preserving existing history state. Modified clicks that open new tabs are left alone. After initial pin measurement, hash navigation is reconciled to its stable wrapper; detail return links and browser Back retain the intended project. Reveal progress is synchronized after measurement and keyboard/hash jumps. Media-query cleanup removes GSAP effects on resize, preference changes, and route departure.

## Coordinated artwork motion

`VisualMotion` updates `--pointer-x`, `--pointer-y`, and `--visual-scale` on the active screen with requestAnimationFrame and a 110ms exponential time constant. React does not rerender for pointer coordinates. Hero text moves at most 6px horizontally/4px vertically toward the pointer; its city moves 1.5 times those distances. Both grow from scale 1 to 1.02. The base and illuminated headings share identical transforms, while the light/mask remain in viewport coordinates. An 18px city overscan prevents edge gaps.

Project artwork moves up to 12px horizontally/10px vertically opposite the pointer and grows to scale 1.02. Hit areas, menu, summaries, previews, and detail-page content are not transformed. Pointer exit, blur, resize, Tab, and Escape ease artwork back to its resting pose. Covered artwork retains its pose when another panel becomes active; passive scroll observation identifies the section beneath a stationary cursor. Animation frames stop once values settle, and listeners/variables are removed on cleanup or a motion preference change.

ScrollTrigger separately animates only `--reveal-y` on each project artwork from 48px to 0px between the wrapper entering the viewport and reaching its top. Linear scroll progress with a 0.28-second scrub catch-up creates restrained reveal momentum and reverses with scroll direction. CSS combines pointer translation, reveal offset, and scale in one transform on `.project-art`, so the two controllers never overwrite each other's transform. The opaque pinned panel itself is never scaled or pointer-translated.

Touch and reduced motion disable these artwork transforms. Reduced motion also disables the hero text offset, following spotlight, snapping, pinning, and smooth anchor scrolling. Detail pages and About retain their ordinary layout and behavior.

The desktop hover card follows the pointer with short eased catch-up, is clamped to a 16px viewport margin, and uses `pointer-events: none`. It hides on scrolling, pointer exit, Escape, Tab, window blur, or unmount. Under reduced motion it appears in a fixed corner. Desktop panels show the artwork and subtle arrow control; hidden semantic titles and named full-panel links provide keyboard/screen-reader access without visible descriptive text. Touch and reduced-motion layouts expose summaries directly.

`PreviewMedia` always renders a poster image beneath optional video. Sentri's source is attached only while its preview is mounted and motion is enabled. Playback is muted, looped, inline, and non-interactive; the video becomes visible only after playback starts. Autoplay rejection or playback error leaves the poster visible. Closing the card pauses playback, removes the source, and resets the media element. Reduced motion leaves the video unloaded and hidden.

Touch/small-screen layouts show summaries directly. Touch has no pinning, reveal, pointer transforms, or snapping; a narrow window with a fine pointer can still use desktop motion. Reduced motion disables smooth anchor scrolling, pinning/curtain motion, snapping, cursor following, scale, reveal, and the text offset. Semantic headings, real links, a skip link, and focus outlines support keyboard navigation.

## Compact navigation

Navigation sits above all curtain layers. Its stationary top-center trigger exposes a dark panel below it with Intro, Work, and About links. The trigger and links share a contiguous pointer region. Hover opening is restricted to fine-pointer devices, avoiding synthetic mouse events reopening the menu after a touch toggle. Activation keeps the menu open, even if hover already revealed it; a second activation closes it. Keyboard focus opens the menu; Escape closes it and returns focus to the trigger. Selection closes it, and outside pointer presses dismiss it. Closed navigation uses both `hidden` and `inert`, keeping its links out of the tab order. Detail pages use home-page hash destinations.

## Media and performance

`archive/legacy-static-site/Pictures/TEST02.jpeg` is preserved as the source. Its serving copy, `public/images/city.webp`, is 2560×1440 and approximately 275 KiB, compared with the approximately 667 KiB original. Next Image supplies responsive raster sizes. The hero and detail lead images are preloaded; homepage project covers load lazily. Typography uses system fonts without third-party font requests.

Owner-supplied originals remain untouched. Serving copies preserve their original colors: Sentri mascot (1144×1375, approximately 92 KiB), Sentri console (1628×902, 87 KiB), Communimate (1732×1004, 49 KiB), Mojo (2400×1561, 100 KiB), and the Sentri poster (960×530, 42 KiB). SentriPage.png informed the mascot composition; the panel uses the isolated mascot so baked-in labels from that reference do not reintroduce unwanted text.

The Sentri MP4 is an eight-second video-only excerpt (seconds 5–13 of the supplied recording), approximately 1.7 MiB, exported at a 960×540 bounding size with its aspect ratio preserved and optimized for streaming. The poster comes from approximately 9.58 seconds. Public URLs contain no private local paths. The clip has no audio track and is not loaded for touch or reduced-motion visitors.

## Development and deployment

Use Node.js 22+ and the commands in README.md. The development server binds to `127.0.0.1:3000`. Production uses `next build` followed by `next start`; hosting is not configured. Image optimization currently expects the Next.js runtime, so static export would require a separate image strategy.

Next.js generates `AGENTS.md` with version-specific framework guidance. The complete original HTML/CSS prototype, its linked pages, source images, fonts, pixel assets, and Live Server settings are preserved together in `archive/legacy-static-site/`, keeping their original relative paths functional. The unused placeholder SVG covers are grouped in `archive/unused-project-covers/`. Nothing under `archive/` is loaded by the active app.

## Remaining limits

Years for Communimate/Mojo, personal roles, tools, verified outcomes, and final case-study copy remain pending. Chrome desktop and emulated mobile checks do not substitute for physical phones or Safari/Firefox before publication. Production performance scores have not been measured. The earlier installation audit reported a development-only lint dependency chain involving `braces`; it has not been rerun for this content refinement. No framework downgrade was applied to work around that advisory.
