requireAuth();
initNavbar();

const itemId = getQueryParam("id");
const form = document.getElementById("itemForm");
const formLoading = document.getElementById("formLoading");
const alertBox = document.getElementById("formAlert");
const submitBtn = document.getElementById("submitBtn");

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLoadError(message) {
  formLoading.innerHTML = `
    <div class="state-icon">⚠️</div>
    <h3>Couldn't load this item</h3>
    <p>${escapeHtml(message)}</p>`;
  formLoading.classList.add("state-error");
}

async function loadItem() {
  if (!itemId) {
    showLoadError("No item was specified.");
    return;
  }
  try {
    const data = await Api.getItem(itemId);
    const item = data.item;

    document.getElementById("type").value = item.type;
    document.getElementById("category").value = item.category;
    document.getElementById("name").value = item.name;
    document.getElementById("description").value = item.description;
    document.getElementById("location").value = item.location;
    document.getElementById("date").value = item.date;
    document.getElementById("image").value = item.image || "";
    document.getElementById("contact").value = item.contact;

    formLoading.style.display = "none";
    form.style.display = "block";
  } catch (err) {
    showLoadError(err.message || "This item may have been removed.");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  alertBox.style.display = "none";

  const payload = {
    type: document.getElementById("type").value,
    category: document.getElementById("category").value,
    name: document.getElementById("name").value.trim(),
    description: document.getElementById("description").value.trim(),
    location: document.getElementById("location").value.trim(),
    date: document.getElementById("date").value,
    image: document.getElementById("image").value.trim(),
    contact: document.getElementById("contact").value.trim(),
  };

  if (!payload.name || !payload.description || !payload.location || !payload.date || !payload.contact) {
    showAlert("Please fill in all required fields.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    await Api.updateItem(itemId, payload);
    window.location.href = `item-details.html?id=${itemId}`;
  } catch (err) {
    showAlert(err.message || "Failed to save changes. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Save Changes";
  }
});

loadItem();
