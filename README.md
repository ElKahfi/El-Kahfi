# ELKAHFI — System Design

## Purpose of this file

Introduce the portfolio, explain how to run and maintain it, and link to its scope, architecture, history, and technical decisions.

## The portfolio

A responsive Next.js portfolio with the original dark city illustration and the confirmed identity **ELKAHFI — System Design** centered on the screen. A shared soft spotlight illuminates the city and text, with restrained depth on the name. A small top-center button reveals Intro, Work, and About navigation.

Scrolling raises each incoming project panel over a stationary previous section, like a curtain. The sequence presents Sentri, Communimate, and Mojo through their supplied visuals, reverses on upward scrolling, and gently settles only very close to section boundaries on desktop. Hover previews provide context and links open individual project pages.

On a fine-pointer device, the active hero/artwork grows by up to 2%. The hero moves gently toward the cursor; project artwork moves slightly in the opposite direction. A critically damped visual follower smooths stepped wheel input while native scrolling retains control. Images travel 25% of the curtain distance and settle into their original framing; fine pixel input uses a faster response to stay responsive. Touch devices use static artwork and ordinary scrolling.

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

## About Me

The static `/#about` section contains the owner-approved description, Development skills (Python, JavaScript, TypeScript, React, HTML, CSS), Data and Infrastructure (SQL, AWS/Cloud, Docker), and Design and Tools (Figma, GitHub, VS Code). Phone, email, LinkedIn, and GitHub links use the supplied details. Edit `components/About.tsx` to maintain this content. The shared About menu item scrolls to this section. No additional biography is required for this scope; project metadata and case-study content remain pending.

## Project content

Edit `data/projects.ts` to maintain content. Each entry contains a slug, title, year, summary, role, tools, cover image and description, presentation style, preview image, optional preview video, gallery, detail sections, placeholder flag, and visual theme. Store images in `public/images/` and video in `public/media/`.

| Project | Confirmed content |
| --- | --- |
| Sentri (2026) | A human-centric cybersecurity training service designed to help people recognize unsafe patterns and improve everyday security behavior. |
| Communimate | A communication-improvement product that helps people identify speech weaknesses and discover communication methods that suit them best. |
| Mojo | An UTBK training platform that generates unlimited UTBK-style questions and guides practice through a skill-tree-based learning journey. |

These are owner-supplied projects, not placeholders. Roles remain `null`, tools remain empty, and only Sentri has a confirmed year. Unknown fields are omitted from the interface. The descriptions state product intent and visible interface features; screenshot statistics are not claimed as measured outcomes. Keep slugs unique; next-project navigation comes from the shared data.

Still needed: Communimate and Mojo years, roles and tools for all projects, any verified metrics/outcomes, final case-study copy. No clients, qualifications, or results have been invented. Biography and contact details are now owner-confirmed.

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
