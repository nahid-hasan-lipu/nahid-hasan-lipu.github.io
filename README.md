# Nahid Hasan Lipu — Interactive 3D Portfolio

Live site: **https://nahid-hasan-lipu.github.io/**

A 6-page portfolio, each page with its own colour theme, its own Three.js 3D scene, and its own card style:

| Page | Theme | 3D scene |
|---|---|---|
| Home (`index.html`) | Indigo | A core orbited by 5 glowing nodes — one per page, click to navigate |
| Personal Info (`personal.html`) | Amber | A rotating torus-knot badge with rising ember particles |
| Education (`education.html`) | Teal | An ascending staircase of platforms, one per stage of schooling |
| Skills (`skills.html`) | Violet | A core with tilted orbiting rings of crystals, one ring per skill category |
| Projects (`projects.html`) | Cyan | A scroll-driven corridor — the camera moves past a glowing installation for each of the 9 projects |
| Contact (`contact.html`) | Rose | A pulsing beacon with signal particles drifting inward |

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
│   │                     info, education, skills, the 9 projects, nav links)
│   ├── core.js           shared Three.js helpers (renderer setup, particle
│   │                     fields, mouse parallax, WebGL-fallback detection)
│   ├── nav.js             shared nav bar + footer + icon set
│   └── pages/             one script per page — builds that page's DOM
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
