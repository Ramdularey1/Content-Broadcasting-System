const STORAGE_KEY = "broadcast_content_store";
const SESSION_KEY = "broadcast_session";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function simulateRequest(payload, options = {}) {
  const { delay = 450, failRate = 0 } = options;
  await sleep(delay + Math.random() * 350);
  if (Math.random() < failRate) {
    throw new Error("We encountered a temporary network issue. Please check your connection and try again.");
  }
  return structuredClone(payload);
}

export function readStore(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function writeStore(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function getAuthHeaders() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    return session?.token ? { Authorization: `Bearer ${session.token}` } : {};
  } catch {
    return {};
  }
}
