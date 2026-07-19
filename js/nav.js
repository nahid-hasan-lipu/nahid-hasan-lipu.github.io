import { profile, pages } from "./data.js";

export function renderNav(activeId) {
  const nav = document.getElementById("site-nav");
  const links = pages
    .map(
      (p) =>
        `<a href="${p.href}" class="${p.id === activeId ? "is-active" : ""}">${p.label}</a>`
    )
    .join("");
  nav.innerHTML = `
    <a class="brand" href="index.html">${profile.name}</a>
    <div id="nav-links">${links}</div>
  `;

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `<p>&copy; 2026 ${profile.name}. Built with Three.js.</p>`;
  }
}

export function initProgressBar() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${pct}%`;
    },
    { passive: true }
  );
}

export const icons = {
  github: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`,
  linkedin: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14.82 0H1.18C.53 0 0 .52 0 1.16v13.68C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.16V1.16C16 .52 15.47 0 14.82 0ZM4.75 13.63H2.38V6.13h2.37v7.5ZM3.56 5.1a1.37 1.37 0 1 1 0-2.75 1.37 1.37 0 0 1 0 2.75Zm10.07 8.53h-2.37V9.98c0-.9-.02-2.06-1.25-2.06-1.26 0-1.45.98-1.45 1.99v3.72H6.2V6.13h2.28v1.02h.03c.32-.6 1.09-1.24 2.24-1.24 2.4 0 2.84 1.58 2.84 3.63v4.09Z"/></svg>`,
  mail: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v.35l8 4.44 8-4.44V4.5A1.5 1.5 0 0 0 14.5 3h-13ZM16 6.13l-7.62 4.23a.75.75 0 0 1-.76 0L0 6.13V11.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V6.13Z"/></svg>`,
};
