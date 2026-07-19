# Nahid Hasan Lipu — Interactive 3D Portfolio

Live site: **https://nahid-hasan-lipu.github.io/**

A 6-page portfolio, each page with its own colour theme and its own
scroll-driven Three.js 3D world — scrolling moves the camera through the
scene one "beat" at a time, each beat surfacing one card:

| Page | Theme | 3D scene |
|---|---|---|
| Home (`index.html`) | Indigo | A galaxy — camera orbits an always-animating sun, one planet per destination page, starfield background |
| Personal Info (`personal.html`) | Amber | A forest walk — camera moves past trees, birds fly continuously, fireflies drift |
| Education (`education.html`) | Teal | A road trip — camera drives down a glowing highway, a lamp-post marker at each stage, low-poly hills passing by |
| Skills (`skills.html`) | Violet | A hex-grid world — camera moves past a floating hexagonal panel for each of the 6 skill categories, honeycomb floor |
| Projects (`projects.html`) | Cyan | A corridor — the camera moves past a glowing installation for each of the 9 projects |
| Contact (`contact.html`) | Rose | A pulsing beacon with orbiting satellites and signal particles drifting inward (kept as a single view — only 3-4 short items, no scroll journey needed) |

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
