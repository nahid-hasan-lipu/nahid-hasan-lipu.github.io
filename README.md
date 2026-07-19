# Nahid Hasan Lipu — Interactive 3D Portfolio

Live site: **https://nahid-hasan-lipu.github.io/**

A 6-page portfolio, each page with its own colour theme. Three pages are
single-view (a calm, always-animating scene with mouse parallax); three are
scroll-driven Three.js corridors (scrolling moves the camera through the
scene one "beat" at a time, each beat surfacing one card):

| Page | Theme | Scene |
|---|---|---|
| Home (`index.html`) | Indigo | Single view — a pulsing core with an orbiting satellite for each destination page, signal particles, mouse parallax (same mechanic as Contact, re-themed) |
| Personal Info (`personal.html`) | Amber | Scroll corridor — camera moves past a glowing panel for each of the 5 personal-info details (same mechanic as Projects, re-themed) |
| Education (`education.html`) | Teal | Scroll corridor — camera drives down a glowing highway, a lamp-post marker at each schooling stage, low-poly hills passing by |
| Skills (`skills.html`) | Violet | Scroll corridor — a forest walk, camera moves past a marker tree for each of the 6 skill categories, birds flying and fireflies drifting throughout |
| Projects (`projects.html`) | Cyan | Scroll corridor — camera moves past a glowing installation for each of the 9 projects |
| Contact (`contact.html`) | Rose | Single view — a pulsing beacon with orbiting satellites and signal particles drifting inward (only 3-4 short items, no scroll journey needed) |

All scenes are fully procedural (drawn gradients, canvas-noise textures,
layered additive-blend glow) — no external image assets.

Every scroll-driven page has fixed forward/back arrows (jump one beat at a
time) with a position readout, and every page has a "← Back" button in the
nav bar that returns to wherever you came from (falls back to Home if there's
no previous page in this tab's history).

## Tech stack

Plain HTML/CSS/JavaScript (ES modules, no build step) + [Three.js](https://threejs.org/) loaded from a CDN. No framework, no bundler — deploys directly as static files.

## Structure

```
web portpholio/
├── index.html, personal.html, education.html,
│   skills.html, projects.html, contact.html    the 6 pages
├── css/
│   ├── base.css       shared layout, typography, cards, buttons, chips
│   ├── themes.css      per-page colour variables (body[data-theme="..."])
│   └── pages.css       page-specific card variants (nav cards, info tiles,
│                        timeline, skill groups, contact tiles)
├── js/
│   ├── data.js          all copy — single source of truth (profile, personal
│   │                     info, education, skillGroups with descriptions +
│   │                     tools, the 9 projects, nav links)
│   ├── core.js           shared Three.js helpers — renderer setup, particle
│   │                     fields, mouse parallax, WebGL-fallback detection,
│   │                     and createBeatPath/createScrollCameraUpdater (the
│   │                     scroll-to-camera-position math every scroll-driven
│   │                     page shares)
│   ├── nav.js             shared nav bar + back button + scroll arrows +
│   │                     footer + icon set
│   └── pages/             one script per page — builds that page's DOM and
│                          its own 3D scene visuals
│       ├── home.js, personal.js, education.js,
│       └── skills.js, projects.js, contact.js
└── assets/               (currently unused — all visuals are built from code)
```

## Editing content

All text (bio, personal info, education records, skills, project summaries)
lives in [`js/data.js`](js/data.js). Edit that file only — every page's script
reads from it automatically, no HTML editing required.

## Running locally

Needs a local server (ES module imports don't work from `file://`):

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Deployment

Served directly by GitHub Pages from the `main` branch root — this repo's
name (`nahid-hasan-lipu.github.io`) is GitHub's special user-site name, so no
Pages configuration is required beyond having `index.html` at the repo root.

## Accessibility / fallback

If a visitor's browser doesn't support WebGL (or a scene fails to initialize
for any reason), the site detects this per-page and falls back to a flat
readable background — all content, links, and navigation remain fully usable
without the 3D layer.
