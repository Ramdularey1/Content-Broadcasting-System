import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { approvalService } from "../services/approval.service";
import { contentService } from "../services/content.service";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshContent = useCallback(async (filters = {}) => {
    setLoading(true);
    setError("");
    try {
      const rows = await contentService.listContent(filters);
      const safeRows = Array.isArray(rows) ? rows : [];
      setContent(safeRows);
      return safeRows;
    } catch (err) {
      setError(err.message || "Unable to load content.");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  async function uploadContent(payload) {
    const created = await contentService.uploadContent(payload);
    setContent((rows) => [created, ...rows]);
    return created;
  }

  async function approveContent(id) {
    const updated = await approvalService.approveContent(id);
    setContent((rows) => rows.map((item) => (item.id === id ? updated : item)));
    return updated;
  }

  async function rejectContent(id, reason) {
    const updated = await approvalService.rejectContent(id, reason);
    setContent((rows) => rows.map((item) => (item.id === id ? updated : item)));
    return updated;
  }

  const counts = useMemo(
    () => ({
      total: content.length,
      pending: content.filter((item) => item.status === "pending").length,
      approved: content.filter((item) => item.status === "approved").length,
      rejected: content.filter((item) => item.status === "rejected").length,
    }),
    [content],
  );

  const value = useMemo(
    () => ({
      content,
      loading,
      error,
      counts,
      refreshContent,
      uploadContent,
      approveContent,
      rejectContent,
    }),
    [content, loading, error, counts, refreshContent],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) throw new Error("useContent must be used inside ContentProvider");
  return context;
}
