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
    <div class="nav-left">
      <button id="back-button" type="button" aria-label="Go back to the previous page">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
        <span>Back</span>
      </button>
      <a class="brand" href="index.html">${profile.name}</a>
    </div>
    <div id="nav-links">${links}</div>
  `;

  document.getElementById("back-button").addEventListener("click", () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "index.html";
    }
  });

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `<p>&copy; 2026 ${profile.name}. Built with Three.js.</p>`;
  }
}

// Fixed prev/next controls for scroll-driven 3D pages — jumps one "beat"
// (one card's worth of scroll) per click, with a position readout.
export function initScrollArrows(beatCount) {
  if (!beatCount || beatCount < 2) return;

  const wrap = document.createElement("div");
  wrap.id = "scroll-arrows";
  wrap.innerHTML = `
    <button id="scroll-up" type="button" aria-label="Previous section">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>
    </button>
    <div id="scroll-indicator"></div>
    <button id="scroll-down" type="button" aria-label="Next section">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  `;
  document.body.appendChild(wrap);

  const upBtn = document.getElementById("scroll-up");
  const downBtn = document.getElementById("scroll-down");
  const indicator = document.getElementById("scroll-indicator");

  function currentBeat() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const t = max > 0 ? window.scrollY / max : 0;
    return Math.round(t * (beatCount - 1));
  }

  function scrollToBeat(i) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const clamped = Math.max(0, Math.min(beatCount - 1, i));
    window.scrollTo({ top: (clamped / (beatCount - 1)) * max, behavior: "smooth" });
  }

  upBtn.addEventListener("click", () => scrollToBeat(currentBeat() - 1));
  downBtn.addEventListener("click", () => scrollToBeat(currentBeat() + 1));

  function update() {
    const beat = currentBeat();
    indicator.textContent = `${beat + 1} / ${beatCount}`;
    upBtn.disabled = beat <= 0;
    downBtn.disabled = beat >= beatCount - 1;
  }
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
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
  phone: `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M3.65.5C2.9.5 1 1.3 1 3.65 1 8.98 7.02 15 12.35 15c2.35 0 3.15-1.9 3.15-2.65 0-.35-.2-.55-.4-.65l-3.1-1.85a.7.7 0 0 0-.8.1l-1.05 1.05a.4.4 0 0 1-.5.05 9.6 9.6 0 0 1-4.15-4.15.4.4 0 0 1 .05-.5l1.05-1.05a.7.7 0 0 0 .1-.8L4.8.9a.72.72 0 0 0-.65-.4h-.5Z"/></svg>`,
};
