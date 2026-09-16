// Lightweight JSON-file "database" helper.
// Keeps the project dependency-free (no native modules to compile) while
// still giving persistent CRUD storage backed by a real file on disk.

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "items.json");

function readItems() {
  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (err) {
    console.error("Failed to read database file:", err.message);
    return [];
  }
}

function writeItems(items) {
  fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2), "utf-8");
}

function getNextId(items) {
  if (items.length === 0) return 1;
  return Math.max(...items.map((i) => i.id)) + 1;
}

module.exports = { readItems, writeItems, getNextId };
