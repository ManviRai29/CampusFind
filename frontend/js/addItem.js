const session = requireAuth();
initNavbar();

const form = document.getElementById("itemForm");
const alertBox = document.getElementById("formAlert");
const submitBtn = document.getElementById("submitBtn");

// Default the date field to today for convenience.
document.getElementById("date").valueAsDate = new Date();

function showAlert(message) {
  alertBox.textContent = message;
  alertBox.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
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
    reportedBy: session?.username || "student",
  };

  if (!payload.name || !payload.description || !payload.location || !payload.date || !payload.contact) {
    showAlert("Please fill in all required fields.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Submitting...";

  try {
    const data = await Api.createItem(payload);
    window.location.href = `item-details.html?id=${data.item.id}`;
  } catch (err) {
    showAlert(err.message || "Failed to submit item. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit Report";
  }
});
