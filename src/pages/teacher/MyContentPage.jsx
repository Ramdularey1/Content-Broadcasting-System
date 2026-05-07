import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/Modal";
import { ContentTable, PreviewPanel } from "../../components/ContentTable";
import { EmptyState, ErrorState, SearchInput, SkeletonList } from "../../components/UI";
import { useAuth } from "../../context/AuthContext";
import { useContent } from "../../context/ContentContext";
import { AppLayout } from "../../layouts/AppLayout";

export function MyContentPage() {
  const { user } = useAuth();
  const { content, loading, error, refreshContent } = useContent();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    refreshContent({ teacherId: user.id });
  }, [refreshContent, user.id]);

  const rows = useMemo(() => {
    const query = search.toLowerCase().trim();
    return content.filter((item) => {
      const matchesStatus = status === "all" || item.status === status;
      const matchesQuery = !query || [item.title, item.subject, item.fileName].some((value) => value.toLowerCase().includes(query));
      return matchesStatus && matchesQuery;
    });
  }, [content, search, status]);

  return (
    <AppLayout title="My Content" subtitle="Review your submissions, schedules, status, and rejection reasons.">
      <section className="section">
        <div className="toolbar">
          <SearchInput value={search} onChange={(value) => { setSearch(value); setPage(1); }} />
          <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); }}>
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        {error ? <ErrorState message={error} /> : null}
        {loading ? <SkeletonList rows={7} /> : rows.length === 0 ? <EmptyState /> : <ContentTable rows={rows} page={page} onPageChange={setPage} onView={setSelected} />}
      </section>
      {selected ? (
        <Modal title="Content preview" onClose={() => setSelected(null)}>
          <PreviewPanel item={selected} />
        </Modal>
      ) : null}
    </AppLayout>
  );
}
