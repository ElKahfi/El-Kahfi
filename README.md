# ELKAHFI — System Design

## Purpose of this file

Introduce the portfolio, explain how to run and maintain it, and link to its scope, architecture, history, and technical decisions.

## The portfolio

A responsive Next.js portfolio with the original dark city illustration and the confirmed identity **ELKAHFI — System Design** centered on the screen. A shared soft spotlight illuminates the city and text, with restrained depth on the name. A small top-center button reveals Intro, Work, University, and About navigation.

Scrolling raises each incoming project panel over a stationary previous section, like a curtain. The sequence is Hero → compact Projects (Personal / Team) heading → SENTRI → Communimate → Mojo → University Projects → About. The shorter heading flows directly into SENTRI; the full-screen, centered, dark-grey University Projects introduction has one prominent button to open the separate collection. Scrolling reverses on upward movement and gently settles only very close to section boundaries on desktop. Hover previews provide context and links open individual personal project pages.

The University Projects divider links to `/university-projects`. Its project list and Previous/Next controls switch the complete entry: image, title, description, role, tools, narrative, and links. The focused image supports left/right arrow keys and horizontal swipe. All three university projects have the owner-confirmed Team Leader role. Back to portfolio returns to `/#university`.

Both introductions reuse the hero's city illustration beneath static charcoal shading. Fine rules frame the compact personal heading; the university slide pairs a two-line serif title with a subtle inset border and a rounded dark collection link. Its circular arrow echoes the personal-project controls, with visible keyboard focus and restrained hover feedback.

On a fine-pointer device, the active hero grows by 2% and project artwork by 4%. The hero moves gently toward the cursor; project artwork moves slightly in the opposite direction. A critically damped visual follower smooths stepped wheel input while native scrolling retains control. Images travel 25% of the curtain distance and settle into their original framing; fine pixel input uses a faster response to stay responsive. Touch devices use static artwork and ordinary scrolling.

The original static prototype and its source assets are grouped under `archive/legacy-static-site/`. The superseded SVG project covers are in `archive/unused-project-covers/`. These files remain historical references; the Next.js app is the active website.

## Run locally

Requires Node.js 22 or newer and npm.

```sh
npm ci
npm run dev
```

Open [the local portfolio](http://127.0.0.1:3000). Stop the server with Ctrl+C.

For a production preview, stop the development server first:

```sh
npm run build
npm run start
```

There are no environment variables, accounts, backend services, or external font downloads to configure. Production hosting has not been selected or deployed.

## What works

- Minimal responsive city hero, locally illuminated typography, and a compact navigation menu supporting hover, keyboard, click, and tap.
- Three image-led panels and visual-first detail pages at `/projects/sentri`, `/projects/communimate`, and `/projects/mojo`. The old numbered URLs redirect to these pages.
- Cursor previews that stay within the viewport and never intercept clicks. Sentri includes an eight-second silent recording clip with a poster fallback; reduced motion uses the poster only.
- Native scroll input with ScrollTrigger-driven visual curtains, short spring smoothing, and gentle settling near panel boundaries on desktop.
- Directly visible summaries and links on touch/small screens, a static touch light, and keyboard focus/skip navigation. Touch and reduced motion use an unpinned layout with no parallax or animated scaling. Short landscape viewports also use unpinned flow.
- Project-specific return links, next-project navigation, and a missing-page view.

The visual spring uses mass 1, stiffness 900, and damping 60 (critical damping). Fine pixel input below 40px uses stiffness 3600 and damping 120; this is input-size tuning, not device detection. Near-boundary snapping waits 400ms and lasts 240–420ms within an 8% boundary region. Keyboard, anchor, and scrollbar navigation bypass the wheel follower. Touch and reduced motion remain static. Physical mouse/trackpad feel and Safari/Firefox still need device testing.

## Personal project details

Rotator layout: the grey/white line indicator and navigation sit above the image; the related heading and description are centered below it. Full-size image links are removed. SENTRI's final slide is Technical Architecture, following Dispatch, Protocol, Admin Panel, and Deployment Setup.

SENTRI, Communimate, and Mojo use one `ProjectDetails` template based on SENTRI's layout: title/year and summary, available external links, image-and-caption rotator, centered role/tools, paired capability/contribution cards, optional narrative cards, and next/return navigation. Unknown fields and absent sections are omitted. Shared `.personal-project-page` styles handle the layout without project-specific overrides.

Project details use a local content rotator: one image and its related text at a time, Previous/Next buttons, horizontal drag/touch swipe, arrow keys, and a grey track with a white active segment. SENTRI has five slides; Communimate reuses its one supplied visual for two existing text sections. Mojo's five supplied screenshots appear in the owner's order: Chatbot, Drill, Kuantitatif Drill List, Drill Mode, Drill Mode Content. Add content through `data/projects.ts` and `getProjectSlides`. Confirmed GitHub links remain available for SENTRI and Communimate; Mojo links to its live project. Homepage previews resolve immediately during scroll and curtain movement from the remembered cursor, without an idle delay.

## About Me

The static `/#about` section contains the owner-approved description, Development skills (Python, JavaScript, TypeScript, React, HTML, CSS), Data and Infrastructure (SQL, AWS/Cloud, Docker), and Design and Tools (Figma, GitHub, VS Code). Phone, email, LinkedIn, and GitHub links use the supplied details. Edit `components/About.tsx` to maintain this content. The shared About menu item scrolls to this section. No additional biography is required for this scope; project metadata and case-study content remain pending.

## Project content

Edit `data/projects.ts` to maintain content. Each entry contains a slug, title, year, summary, role, tools, cover image and description, presentation style, preview image, optional preview video, gallery, detail sections, placeholder flag, and visual theme. Store images in `public/images/` and video in `public/media/`.

University content lives in `data/university-projects.ts`; supplied screenshots are served as WebP files in `public/images/university/`, preserving the entire original image and its proportions. Copyin lists Figma and draw.io, TukaKu lists Figma and Canva, and Batikeryday lists CLO and Canva. These describe the design/documentation materials, not a verified application implementation stack. No university project years or measured results are claimed.

Copyin copy was checked against the supplied report, assignment brief in its Drive folder, and Figma structure. TukaKu copy uses the owner context, accessible Canva presentation, Figma landing screen, and supplied interface overview. Batikeryday uses the owner context and CLO screenshot; its Canva link resolves to a presentation but repeatedly blocks further viewing, so the full deck was not verified. Original source links are included on each entry. See `MD's/PROJECT_SOURCES.md` for the source record and remaining gaps.

| Project | Confirmed content |
| --- | --- |
| Sentri (2026) | A human-centric cybersecurity training service designed to help people recognize unsafe patterns and improve everyday security behavior. |
| Communimate | A communication-improvement product that helps people identify speech weaknesses and discover communication methods that suit them best. |
| Mojo | An Indonesian-language UTBK/SNBT study companion prototype combining a prerequisite-aware skill map, drill catalogs, database-backed question sets, and locally generated relaxed practice. |

These are owner-supplied projects, not placeholders. SENTRI has a confirmed year (2026), Team Leader role, and PostgreSQL, Docker, AWS EC2, and Coolify tools. Its case study summarizes capabilities and contributions and presents five captioned images, with Technical architecture last. Its homepage artwork uses the Dispatch screenshot in the same interface presentation as the other projects; the hover video remains unchanged. Full-size image links have been removed. Communimate is an Ongoing Independent Project. Its expanded case study draws on the local Communimate product plan, README, architecture documentation, and active HTML prototype. HTML, CSS, and JavaScript describe that active prototype; recording, speech analysis, storage, and live AI conversation are identified as planned work. Mojo is Ongoing, with the owner-confirmed System Design Infrastructure role and database design, API connections, system flow, and future-scaling contributions. Its supplied technical context supports Next.js, React, TypeScript, and Neon PostgreSQL. Chatbot, personalized weakness selection, demo progress, and temporary relaxed-session state are described with their current limits. Screenshot statistics are not claimed as measured outcomes.

Still needed: any verified metrics/outcomes the owner wishes to publish. Communimate and Mojo's implementation status should be updated as planned features become available. SENTRI content, biography, and contact details are owner-confirmed. No clients, qualifications, or results have been invented.

## Checks

```sh
npm run lint
npm run typecheck
npm run build
npm run test:e2e
```

The browser suite uses installed Google Chrome (`channel: chrome`) and covers desktop, emulated mobile, and reduced motion. It reuses the server on port 3000 or starts one. Install Chrome if it is unavailable. Test artifacts are written to ignored `test-results/`. The motion suite samples actual panel/image positions under stepped and fine wheel input and enables native scrollbars for its drag check. Latest verification: lint, TypeScript, and build passed; 53 browser checks passed, with 40 profile-inapplicable checks skipped. See the changelog for the exact results and remaining device limits.

## Project documents

| Document | Purpose |
| --- | --- |
| [ROADMAP.md](MD%27s/ROADMAP.md) | Agreed scope, completed work, and pending content. |
| [TECHNICAL_ARCHITECTURE.md](MD%27s/TECHNICAL_ARCHITECTURE.md) | How routes, components, data, media, and effects connect. |
| [CHANGELOG.md](MD%27s/CHANGELOG.md) | Completed changes and verification history. |
| [Decisions.md](MD%27s/Decisions.md) | Decisions, rationale, alternatives, and tradeoffs. |

Read the roadmap before extending the website. Update the affected documents when scope, behavior, structure, or decisions change.

About placement correction (2026-10-12): the full About Me content replaces the former Systems/Connections/Possibilities section after Mojo on the homepage. Navigation scrolls to `#about` (or `/#about` from detail routes). `components/About.tsx` renders the content inside the home main landmark in ordinary flow, without parallax. The footer contains only branding and Back to top. `/about` redirects to `/#about` for compatibility; there is no separate About page.
