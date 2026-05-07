import { createMockContent } from "../utils/mockData";
import { getScheduleStatus } from "../utils/date";
import { getAuthHeaders, readStore, simulateRequest, writeStore } from "./client";

const seed = createMockContent();

function all() {
  return readStore(seed);
}

export const contentService = {
  async listContent(filters = {}) {
    getAuthHeaders();
    const query = (filters.search || "").toLowerCase().trim();
    let rows = all();

    if (filters.teacherId) rows = rows.filter((item) => item.teacherId === filters.teacherId);
    if (filters.status && filters.status !== "all") rows = rows.filter((item) => item.status === filters.status);
    if (query) {
      rows = rows.filter((item) =>
        [item.title, item.subject, item.teacherName, item.fileName].some((value) => value.toLowerCase().includes(query)),
      );
    }

    return simulateRequest(rows);
  },

  async uploadContent(payload) {
    getAuthHeaders();
    if (payload.title.toLowerCase().includes("fail")) {
      await simulateRequest(null, { failRate: 0, delay: 500 });
      throw new Error("Upload failed while saving the content. Please retry.");
    }

    const rows = all();
    const next = {
      ...payload,
      id: `content-${Date.now()}`,
      status: "pending",
      rejectionReason: "",
      createdAt: new Date().toISOString(),
    };
    writeStore([next, ...rows]);
    return simulateRequest(next, { failRate: 0.02 });
  },

  async getLiveContent(teacherId) {
    const live = all()
      .filter((item) => item.teacherId === teacherId && item.status === "approved")
      .filter((item) => getScheduleStatus(item) === "active")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return simulateRequest(live[0] || null, { delay: 650, failRate: 0.02 });
  },
};
