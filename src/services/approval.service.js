import { createMockContent } from "../utils/mockData";
import { getAuthHeaders, readStore, simulateRequest, writeStore } from "./client";

const seed = createMockContent();

function updateStatus(id, patch) {
  const rows = readStore(seed);
  const nextRows = rows.map((item) => (item.id === id ? { ...item, ...patch } : item));
  writeStore(nextRows);
  return nextRows.find((item) => item.id === id);
}

export const approvalService = {
  async approveContent(id) {
    getAuthHeaders();
    const updated = updateStatus(id, { status: "approved", rejectionReason: "" });
    return simulateRequest(updated);
  },

  async rejectContent(id, reason) {
    getAuthHeaders();
    if (!reason?.trim()) throw new Error("Rejection reason is required.");
    const updated = updateStatus(id, { status: "rejected", rejectionReason: reason.trim() });
    return simulateRequest(updated);
  },
};
