# Nahid Hasan Lipu — Interactive 3D Portfolio

Live site: **https://nahid-hasan-lipu.github.io/**

A scroll-driven 3D portfolio built with Three.js — the camera moves through a minimalist 3D corridor as you scroll, with a glowing installation marking each project. Every project card summarises the headline finding and links out to the full case study, code, and (where applicable) Power BI dashboard on GitHub.

## Tech stack

Plain HTML/CSS/JavaScript (ES modules, no build step) + [Three.js](https://threejs.org/) loaded from a CDN. No framework, no bundler — deploys directly as static files.

## Structure

```
web portpholio/
├── index.html          page shell, meta tags
├── css/style.css        typography, layout, glassmorphism cards, responsive rules
├── js/
│   ├── data.js           all copy — profile, skills, and the 9 project cards (single source of truth)
│   ├── render.js          builds the DOM sections from data.js
│   └── app.js             Three.js scene: camera path, project installations, lighting, particles
└── assets/               images/screenshots (currently unused — panels are built entirely from code)
```

## Editing content

All text (bio, project summaries, stats, links) lives in [`js/data.js`](js/data.js). Edit that file only — `render.js` and `app.js` read from it automatically, no HTML editing required.

## Running locally

Needs a local server (ES module imports don't work from `file://`):

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Deployment

Served directly by GitHub Pages from the `main` branch root — this repo's name (`nahid-hasan-lipu.github.io`) is GitHub's special user-site name, so no Pages configuration is required beyond having `index.html` at the repo root.

## Accessibility / fallback

If a visitor's browser doesn't support WebGL (or the scene fails to initialize for any reason), the site detects this and falls back to a flat dark background — all content, links, and navigation remain fully readable and functional without the 3D layer.
