import { profile, skills, projects } from "./data.js";

const githubIcon = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>`;
const linkedinIcon = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M14.82 0H1.18C.53 0 0 .52 0 1.16v13.68C0 15.48.53 16 1.18 16h13.64c.65 0 1.18-.52 1.18-1.16V1.16C16 .52 15.47 0 14.82 0ZM4.75 13.63H2.38V6.13h2.37v7.5ZM3.56 5.1a1.37 1.37 0 1 1 0-2.75 1.37 1.37 0 0 1 0 2.75Zm10.07 8.53h-2.37V9.98c0-.9-.02-2.06-1.25-2.06-1.26 0-1.45.98-1.45 1.99v3.72H6.2V6.13h2.28v1.02h.03c.32-.6 1.09-1.24 2.24-1.24 2.4 0 2.84 1.58 2.84 3.63v4.09Z"/></svg>`;
const mailIcon = `<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M1.5 3A1.5 1.5 0 0 0 0 4.5v.35l8 4.44 8-4.44V4.5A1.5 1.5 0 0 0 14.5 3h-13ZM16 6.13l-7.62 4.23a.75.75 0 0 1-.76 0L0 6.13V11.5A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5V6.13Z"/></svg>`;

function el(tag, className, html) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (html !== undefined) node.innerHTML = html;
  return node;
}

function renderHero() {
  const section = el("section", "beat beat--hero");
  section.id = "hero";
  section.innerHTML = `
    <div class="content-card content-card--center" data-reveal>
      <p class="eyebrow">${profile.title} · ${profile.location}</p>
      <h1>${profile.name}</h1>
      <p class="tagline">${profile.tagline}</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="${profile.github}" target="_blank" rel="noopener">${githubIcon}<span>GitHub</span></a>
        <a class="btn" href="${profile.linkedin}" target="_blank" rel="noopener">${linkedinIcon}<span>LinkedIn</span></a>
      </div>
      <p class="scroll-cue">Scroll to explore ↓</p>
    </div>
  `;
  return section;
}

function renderAbout() {
  const section = el("section", "beat beat--about");
  section.id = "about";
  section.innerHTML = `
    <div class="content-card content-card--left" data-reveal>
      <p class="eyebrow">About</p>
      <h2>Background</h2>
      <p>${profile.about}</p>
    </div>
  `;
  return section;
}

function renderProject(project, index) {
  const side = index % 2 === 0 ? "right" : "left";
  const section = el("section", `beat beat--project`);
  section.id = project.id;
  section.dataset.panelIndex = String(index);

  const techChips = project.tech.map((t) => `<span class="chip">${t}</span>`).join("");
  const powerbiBadge = project.powerbi
    ? `<span class="chip chip--accent">+ Power BI dashboard</span>`
    : "";

  section.innerHTML = `
    <div class="content-card content-card--${side}" data-reveal>
      <p class="eyebrow">${project.number} · ${project.tag}</p>
      <h2>${project.title}</h2>
      <p class="summary">${project.summary}</p>
      <p class="stat">${project.stat}</p>
      <div class="chip-row">${techChips}${powerbiBadge}</div>
      <a class="btn btn--primary" href="${project.repo}" target="_blank" rel="noopener">${githubIcon}<span>View full case study on GitHub</span></a>
    </div>
  `;
  return section;
}

function renderSkills() {
  const section = el("section", "beat beat--skills");
  section.id = "skills";
  const chips = skills.map((s) => `<span class="chip">${s}</span>`).join("");
  section.innerHTML = `
    <div class="content-card content-card--center" data-reveal>
      <p class="eyebrow">Toolkit</p>
      <h2>Skills</h2>
      <div class="chip-row chip-row--center">${chips}</div>
    </div>
  `;
  return section;
}

function renderContact() {
  const section = el("section", "beat beat--contact");
  section.id = "contact";
  section.innerHTML = `
    <div class="content-card content-card--center" data-reveal>
      <p class="eyebrow">Get in touch</p>
      <h2>Let's connect</h2>
      <p>Open to data analytics roles across business, financial, or healthcare domains in New Zealand.</p>
      <div class="btn-row">
        <a class="btn btn--primary" href="mailto:${profile.email}">${mailIcon}<span>${profile.email}</span></a>
        <a class="btn" href="${profile.linkedin}" target="_blank" rel="noopener">${linkedinIcon}<span>LinkedIn</span></a>
        <a class="btn" href="${profile.github}" target="_blank" rel="noopener">${githubIcon}<span>GitHub</span></a>
      </div>
    </div>
  `;
  return section;
}

export function renderSite() {
  const main = document.getElementById("content");
  main.appendChild(renderHero());
  main.appendChild(renderAbout());
  projects.forEach((project, index) => {
    main.appendChild(renderProject(project, index));
  });
  main.appendChild(renderSkills());
  main.appendChild(renderContact());

  const footer = document.getElementById("site-footer");
  footer.innerHTML = `<p>&copy; 2026 ${profile.name}. Built with Three.js.</p>`;

  const navLinks = document.getElementById("nav-links");
  navLinks.innerHTML = `
    <a href="#about">About</a>
    <a href="#${projects[0].id}">Projects</a>
    <a href="#skills">Skills</a>
    <a href="#contact">Contact</a>
  `;
}

export function getBeatCount() {
  return 2 + projects.length + 2; // hero + about + projects + skills + contact
}

export { projects };
