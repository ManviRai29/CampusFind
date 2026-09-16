// Simple client-side "session" handling for this demo project.
// There is no real security here on purpose - this is a portfolio/college
// project and intentionally avoids complex authentication.

const SESSION_KEY = "campusfind_session";

function saveSession(username, token) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ username, token }));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (err) {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Call this at the top of any protected page.
function requireAuth() {
  const session = getSession();
  if (!session || !session.token) {
    window.location.href = "index.html";
  }
  return session;
}

function logout() {
  clearSession();
  window.location.href = "index.html";
}

// Populates the "Hi, <username>" text + wires the logout button.
// Expects elements with ids "navUsername" and "logoutBtn" on the page.
function initNavbar() {
  const session = getSession();
  const userEl = document.getElementById("navUsername");
  if (userEl && session) {
    userEl.textContent = `Hi, ${session.username}`;
  }
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
}
