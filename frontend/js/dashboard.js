requireAuth();
initNavbar();

const itemsArea = document.getElementById("itemsArea");
const resultCount = document.getElementById("resultCount");
const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");
const categoryFilter = document.getElementById("categoryFilter");
const clearFiltersBtn = document.getElementById("clearFiltersBtn");

const deleteModal = document.getElementById("deleteModal");
const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

let pendingDeleteId = null;
let debounceTimer = null;

function renderLoading() {
  itemsArea.innerHTML = `<div class="state-box"><p>Loading items...</p></div>`;
}

function renderError(message) {
  itemsArea.innerHTML = `
    <div class="state-box state-error">
      <div class="state-icon">⚠️</div>
      <h3>Couldn't load items</h3>
      <p>${escapeHtml(message)}</p>
      <button class="btn btn-outline btn-sm" onclick="loadItems()" style="margin-top:12px;">Try again</button>
    </div>`;
}

function renderEmpty() {
  itemsArea.innerHTML = `
    <div class="state-box">
      <div class="state-icon">🔎</div>
      <h3>No items found</h3>
      <p>Try adjusting your search or filters, or report a new item.</p>
    </div>`;
}

function itemCardHtml(item) {
  const badgeClass = item.type === "Lost" ? "badge-lost" : "badge-found";
  const img = item.image && item.image.trim() !== "" ? item.image : placeholderImage(item.name);
  return `
    <div class="item-card" data-id="${item.id}">
      <img class="item-card-image" src="${escapeHtml(img)}" alt="${escapeHtml(item.name)}" data-imgfallback="${escapeHtml(item.name)}" />
      <div class="item-card-body">
        <span class="badge ${badgeClass}">${escapeHtml(item.type)}</span>
        <div class="item-card-title">${escapeHtml(item.name)}</div>
        <div class="item-card-meta">
          <span>📍 ${escapeHtml(item.location)}</span>
          <span>📅 ${formatDate(item.date)}</span>
          <span class="badge badge-category" style="margin-top:4px;">${escapeHtml(item.category)}</span>
        </div>
        <div class="item-card-footer">
          <a href="item-details.html?id=${item.id}" class="btn btn-outline btn-sm" style="flex:1;">View Details</a>
          <a href="edit-item.html?id=${item.id}" class="btn btn-outline btn-sm" title="Edit">✏️</a>
          <button class="btn btn-outline btn-sm delete-btn" data-id="${item.id}" title="Delete">🗑️</button>
        </div>
      </div>
    </div>`;
}

function renderItems(items) {
  if (items.length === 0) {
    renderEmpty();
    resultCount.textContent = "";
    return;
  }

  resultCount.textContent = `Showing ${items.length} item${items.length === 1 ? "" : "s"}`;
  itemsArea.innerHTML = `<div class="item-grid">${items.map(itemCardHtml).join("")}</div>`;

  // Wire image fallbacks
  itemsArea.querySelectorAll("img[data-imgfallback]").forEach((img) => {
    attachImageFallback(img, img.getAttribute("data-imgfallback"));
  });

  // Wire delete buttons
  itemsArea.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", () => openDeleteModal(btn.getAttribute("data-id")));
  });
}

async function loadItems() {
  renderLoading();
  try {
    const data = await Api.getItems({
      search: searchInput.value.trim(),
      type: typeFilter.value,
      category: categoryFilter.value,
    });
    renderItems(data.items);
  } catch (err) {
    renderError(err.message || "Please make sure the backend server is running.");
  }
}

function openDeleteModal(id) {
  pendingDeleteId = id;
  deleteModal.classList.add("open");
}

function closeDeleteModal() {
  pendingDeleteId = null;
  deleteModal.classList.remove("open");
}

cancelDeleteBtn.addEventListener("click", closeDeleteModal);
deleteModal.addEventListener("click", (e) => {
  if (e.target === deleteModal) closeDeleteModal();
});

confirmDeleteBtn.addEventListener("click", async () => {
  if (!pendingDeleteId) return;
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = "Deleting...";
  try {
    await Api.deleteItem(pendingDeleteId);
    closeDeleteModal();
    loadItems();
  } catch (err) {
    alert(err.message || "Failed to delete item.");
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = "Delete";
  }
});

searchInput.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(loadItems, 300);
});
typeFilter.addEventListener("change", loadItems);
categoryFilter.addEventListener("change", loadItems);
clearFiltersBtn.addEventListener("click", () => {
  searchInput.value = "";
  typeFilter.value = "All";
  categoryFilter.value = "All";
  loadItems();
});

loadItems();
