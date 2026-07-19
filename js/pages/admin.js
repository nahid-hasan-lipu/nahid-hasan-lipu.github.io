import { PHOTO_SLOTS, setupReveal } from "../core.js";
import { renderNav } from "../nav.js";

renderNav("admin");
setupReveal();

const OWNER = "nahid-hasan-lipu";
const REPO = "nahid-hasan-lipu.github.io";
const BRANCH = "main";
const TOKEN_KEY = "portfolio_admin_token";

const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const tokenInput = document.getElementById("token-input");
const connectBtn = document.getElementById("connect-btn");
const logoutBtn = document.getElementById("logout-btn");
const statusEl = document.getElementById("admin-status");
const slotGrid = document.getElementById("photo-slot-grid");

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = `admin-status ${message ? (isError ? "admin-status--error" : "admin-status--ok") : ""}`;
}

function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

async function githubRequest(path, token, options = {}) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  return res;
}

async function validateToken(token) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${REPO}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  return res.ok;
}

async function getFileSha(path, token) {
  const res = await githubRequest(path, token);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Couldn't check existing file (${res.status})`);
  const data = await res.json();
  return data.sha;
}

async function resizeAndEncode(file, maxDim = 1200, quality = 0.85) {
  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });

  let { width, height } = img;
  if (width > maxDim || height > maxDim) {
    if (width > height) {
      height = Math.round((height * maxDim) / width);
      width = maxDim;
    } else {
      width = Math.round((width * maxDim) / height);
      height = maxDim;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(img, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality).split(",")[1];
}

async function uploadPhoto(slot, file, token) {
  setStatus(`Uploading ${slot.label} photo…`);
  const base64 = await resizeAndEncode(file);
  const sha = await getFileSha(slot.path, token);
  const res = await githubRequest(slot.path, token, {
    method: "PUT",
    body: JSON.stringify({
      message: `Update photo: ${slot.path}`,
      content: base64,
      branch: BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Upload failed (${res.status})`);
  }
  setStatus(`${slot.label} photo updated — live on the site in about a minute.`);
}

async function deletePhoto(slot, token) {
  setStatus(`Removing ${slot.label} photo…`);
  const sha = await getFileSha(slot.path, token);
  if (!sha) {
    setStatus(`${slot.label} has no photo to remove.`, true);
    return;
  }
  const res = await githubRequest(slot.path, token, {
    method: "DELETE",
    body: JSON.stringify({ message: `Remove photo: ${slot.path}`, sha, branch: BRANCH }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Delete failed (${res.status})`);
  }
  setStatus(`${slot.label} photo removed — live on the site in about a minute.`);
}

function renderSlots() {
  slotGrid.innerHTML = PHOTO_SLOTS.map(
    (slot) => `
    <div class="photo-slot-card" data-slot="${slot.key}">
      <h3>${slot.label}</h3>
      <img class="avatar-photo" src="${slot.path}?t=${Date.now()}" alt="${slot.label}"
           onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 200 200%27%3E%3Crect width=%27200%27 height=%27200%27 rx=%27100%27 fill=%27%23161b26%27/%3E%3Ctext x=%27100%27 y=%27110%27 font-size=%2724%27 font-family=%27system-ui,sans-serif%27 fill=%27%239aa4b6%27 text-anchor=%27middle%27%3ENo photo%3C/text%3E%3C/svg%3E'" />
      <div class="btn-row">
        <label class="btn btn--primary" for="file-${slot.key}">Upload</label>
        <button class="btn" type="button" data-action="delete" data-slot="${slot.key}">Delete</button>
      </div>
      <input type="file" id="file-${slot.key}" accept="image/*" data-slot="${slot.key}" />
    </div>`
  ).join("");

  slotGrid.querySelectorAll('input[type="file"]').forEach((input) => {
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const slot = PHOTO_SLOTS.find((s) => s.key === input.dataset.slot);
      try {
        await uploadPhoto(slot, file, getToken());
        renderSlots();
      } catch (err) {
        setStatus(err.message, true);
      }
      input.value = "";
    });
  });

  slotGrid.querySelectorAll('[data-action="delete"]').forEach((btn) => {
    btn.addEventListener("click", async () => {
      const slot = PHOTO_SLOTS.find((s) => s.key === btn.dataset.slot);
      if (!confirm(`Remove the ${slot.label} photo? The page will fall back to the initials placeholder.`)) return;
      try {
        await deletePhoto(slot, getToken());
        renderSlots();
      } catch (err) {
        setStatus(err.message, true);
      }
    });
  });
}

function showAdmin() {
  loginSection.hidden = true;
  adminSection.hidden = false;
  renderSlots();
}

function showLogin() {
  loginSection.hidden = false;
  adminSection.hidden = true;
}

connectBtn.addEventListener("click", async () => {
  const token = tokenInput.value.trim();
  if (!token) {
    setStatus("Paste a token first.", true);
    return;
  }
  setStatus("Checking token…");
  try {
    const valid = await validateToken(token);
    if (!valid) {
      setStatus("That token couldn't access the repo. Check it's scoped to nahid-hasan-lipu.github.io with Contents: Read and write.", true);
      return;
    }
    localStorage.setItem(TOKEN_KEY, token);
    tokenInput.value = "";
    setStatus("Connected.");
    showAdmin();
  } catch (err) {
    setStatus(`Couldn't reach GitHub: ${err.message}`, true);
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem(TOKEN_KEY);
  setStatus("Logged out.");
  showLogin();
});

if (getToken()) {
  validateToken(getToken()).then((valid) => {
    if (valid) showAdmin();
    else {
      localStorage.removeItem(TOKEN_KEY);
      setStatus("Saved token is no longer valid — please reconnect.", true);
    }
  });
}
