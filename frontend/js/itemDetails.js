requireAuth();
initNavbar();

const detailsArea = document.getElementById("detailsArea");
const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

const itemId = getQueryParam("id");

function renderError(message) {
  detailsArea.innerHTML = `
    <div class="state-box state-error">
      <div class="state-icon">⚠️</div>
      <h3>Couldn't load this item</h3>
      <p>${escapeHtml(message)}</p>
    </div>`;
}

function contactHref(contact) {
  if (!contact) return "#";
  const trimmed = contact.trim();
  if (trimmed.includes("@")) return `mailto:${trimmed}`;
  if (/^[+\d][\d\s-]{5,}$/.test(trimmed)) return `tel:${trimmed.replace(/\s/g, "")}`;
  return "#";
}

function renderItem(item) {
  const badgeClass = item.type === "Lost" ? "badge-lost" : "badge-found";
  const img = item.image && item.image.trim() !== "" ? item.image : placeholderImage(item.name);
  const href = contactHref(item.contact);

  detailsArea.innerHTML = `
    <div class="details-layout">
      <div>
        <img class="details-image" id="detailsImg" src="${escapeHtml(img)}" alt="${escapeHtml(item.name)}" />
      </div>
      <div class="panel">
        <div class="details-title-row">
          <span class="badge ${badgeClass}">${escapeHtml(item.type)}</span>
          <span class="badge badge-category">${escapeHtml(item.category)}</span>
        </div>
        <h1>${escapeHtml(item.name)}</h1>

        <div class="info-list">
          <div class="info-item">
            <div class="info-label">Description</div>
            <div class="info-value">${escapeHtml(item.description)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Location</div>
            <div class="info-value">📍 ${escapeHtml(item.location)}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date</div>
            <div class="info-value">📅 ${formatDate(item.date)}</div>
          </div>
        </div>

        <div class="contact-box">
          <div class="info-label">Contact</div>
          <div class="info-value">${escapeHtml(item.contact)}</div>
          ${href !== "#" ? `<a href="${href}" class="btn btn-primary btn-sm" style="margin-top:10px;">Contact Reporter</a>` : ""}
        </div>

        <div class="details-actions">
          <a href="edit-item.html?id=${item.id}" class="btn btn-outline">✏️ Edit</a>
          <button class="btn btn-danger" id="deleteBtn">🗑️ Delete</button>
        </div>
      </div>
    </div>`;

  attachImageFallback(document.getElementById("detailsImg"), item.name);
  document.getElementById("deleteBtn").addEventListener("click", () => {
    deleteModal.classList.add("open");
  });
}

async function loadItem() {
  if (!itemId) {
    renderError("No item was specified.");
    return;
  }
  try {
    const data = await Api.getItem(itemId);
    renderItem(data.item);
  } catch (err) {
    renderError(err.message || "This item may have been removed.");
  }
}

cancelDeleteBtn.addEventListener("click", () => deleteModal.classList.remove("open"));
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) deleteModal.classList.remove("open");
});

confirmDeleteBtn.addEventListener("click", async () => {
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = "Deleting...";
  try {
    await Api.deleteItem(itemId);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message || "Failed to delete item.");
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = "Delete";
  }
});

loadItem();
