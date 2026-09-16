// Shared API helper functions used across all pages.
// Since the backend serves this same frontend, relative paths work
// whether the app is opened via localhost or a different host/port.

const API_BASE = "/api";

async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Unexpected server response.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong.");
  }
  return data;
}

const Api = {
  login: (username, password) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getItems: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v && v !== "All")
    ).toString();
    return apiRequest(`/items${query ? `?${query}` : ""}`);
  },

  getItem: (id) => apiRequest(`/items/${id}`),

  createItem: (payload) =>
    apiRequest("/items", { method: "POST", body: JSON.stringify(payload) }),

  updateItem: (id, payload) =>
    apiRequest(`/items/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteItem: (id) => apiRequest(`/items/${id}`, { method: "DELETE" }),
};

// ---------- Placeholder image fallback ----------
// Generates a simple inline SVG data URI so the UI never breaks even
// if an external placeholder image URL fails to load (e.g. no internet).
function placeholderImage(text = "No Image") {
  const safeText = text.length > 22 ? text.slice(0, 22) + "…" : text;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">
      <rect width="100%" height="100%" fill="#e2e8f0"/>
      <text x="50%" y="50%" font-family="Segoe UI, Arial, sans-serif" font-size="20"
        fill="#64748b" text-anchor="middle" dominant-baseline="middle">${safeText}</text>
    </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function attachImageFallback(imgEl, altText) {
  imgEl.addEventListener("error", () => {
    imgEl.onerror = null;
    imgEl.src = placeholderImage(altText || "Image unavailable");
  });
}

// ---------- Small utils ----------
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}
