# Nahid Hasan Lipu — Interactive 3D Portfolio

Live site: **https://nahid-hasan-lipu.github.io/**

A 6-page portfolio, each page with its own colour theme and its own
scroll-driven Three.js 3D world — scrolling moves the camera through the
scene one "beat" at a time, each beat surfacing one card:

| Page | Theme | Scene |
|---|---|---|
| Home (`index.html`) | Indigo | A real deep-space photo backdrop; camera orbits an always-animating 3D sun, one 3D planet per destination page |
| Personal Info (`personal.html`) | Amber | A real tree-canopy photo backdrop with subtle scroll-driven parallax; each info card is anchored to a specific branch, with 3D birds and fireflies flying over the photo |
| Education (`education.html`) | Teal | A road trip — camera drives down a glowing highway, a lamp-post marker at each stage, low-poly hills passing by |
| Skills (`skills.html`) | Violet | A real mountain-and-sea photo backdrop with a single genuine 3D hexagonal prism at centre — it rotates as you scroll, one of its 6 faces (and one skill category) coming forward per beat |
| Projects (`projects.html`) | Cyan | A corridor — the camera moves past a glowing installation for each of the 9 projects |
| Contact (`contact.html`) | Rose | A pulsing beacon with orbiting satellites and signal particles drifting inward (kept as a single view — only 3-4 short items, no scroll journey needed) |

Home, Personal Info, and Skills use real photographs (Pexels License — free
for commercial use, no attribution required) rather than procedurally-drawn
skies, layered with genuine 3D elements (planets, birds, the hexagon) on top.
Education and Projects remain fully procedural 3D environments.

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
└── assets/
    └── images/            galaxy.jpg, mountain-sea.jpg, tree-canopy.jpg —
                            real photos used as backdrops (see above)
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
