const express = require("express");
const router = express.Router();
const { readItems, writeItems, getNextId } = require("../data/db");

const ALLOWED_TYPES = ["Lost", "Found"];
const REQUIRED_FIELDS = [
  "type",
  "name",
  "category",
  "description",
  "location",
  "date",
  "contact",
];

function validateItemPayload(body) {
  for (const field of REQUIRED_FIELDS) {
    if (!body[field] || String(body[field]).trim() === "") {
      return `Field "${field}" is required.`;
    }
  }
  if (!ALLOWED_TYPES.includes(body.type)) {
    return `Field "type" must be either "Lost" or "Found".`;
  }
  return null;
}

// GET /api/items?search=&category=&type=
router.get("/", (req, res) => {
  const { search, category, type } = req.query;
  let items = readItems();

  if (search) {
    const term = search.toLowerCase();
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.location.toLowerCase().includes(term)
    );
  }

  if (category && category !== "All") {
    items = items.filter((item) => item.category === category);
  }

  if (type && type !== "All") {
    items = items.filter((item) => item.type === type);
  }

  // Most recently reported first
  items = items.slice().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  res.json({ success: true, count: items.length, items });
});

// GET /api/items/:id
router.get("/:id", (req, res) => {
  const items = readItems();
  const item = items.find((i) => i.id === Number(req.params.id));
  if (!item) {
    return res.status(404).json({ success: false, message: "Item not found." });
  }
  res.json({ success: true, item });
});

// POST /api/items
router.post("/", (req, res) => {
  const error = validateItemPayload(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const items = readItems();
  const newItem = {
    id: getNextId(items),
    type: req.body.type,
    name: req.body.name.trim(),
    category: req.body.category,
    description: req.body.description.trim(),
    location: req.body.location.trim(),
    date: req.body.date,
    image:
      req.body.image && req.body.image.trim() !== ""
        ? req.body.image.trim()
        : "",
    contact: req.body.contact.trim(),
    reportedBy: req.body.reportedBy || "student",
    createdAt: new Date().toISOString(),
  };

  items.push(newItem);
  writeItems(items);

  res.status(201).json({ success: true, item: newItem });
});

// PUT /api/items/:id
router.put("/:id", (req, res) => {
  const error = validateItemPayload(req.body);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }

  const items = readItems();
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Item not found." });
  }

  const existing = items[index];
  const updatedItem = {
    ...existing,
    type: req.body.type,
    name: req.body.name.trim(),
    category: req.body.category,
    description: req.body.description.trim(),
    location: req.body.location.trim(),
    date: req.body.date,
    image:
      req.body.image && req.body.image.trim() !== ""
        ? req.body.image.trim()
        : existing.image,
    contact: req.body.contact.trim(),
  };

  items[index] = updatedItem;
  writeItems(items);

  res.json({ success: true, item: updatedItem });
});

// DELETE /api/items/:id
router.delete("/:id", (req, res) => {
  const items = readItems();
  const index = items.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Item not found." });
  }

  const [removed] = items.splice(index, 1);
  writeItems(items);

  res.json({ success: true, item: removed });
});

module.exports = router;
