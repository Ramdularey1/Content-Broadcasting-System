import { Check, Loader2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/Modal";
import { ContentTable, PreviewPanel } from "../../components/ContentTable";
import { Button, EmptyState, ErrorState, SkeletonList } from "../../components/UI";
import { useToast } from "../../components/Toast";
import { useContent } from "../../context/ContentContext";
import { AppLayout } from "../../layouts/AppLayout";

export function ApprovalsPage() {
  const { content, loading, error, refreshContent, approveContent, rejectContent } = useContent();
  const { notify } = useToast();
  const [selected, setSelected] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    refreshContent({ status: "pending" });
  }, [refreshContent]);

  const pending = useMemo(() => content.filter((item) => item.status === "pending"), [content]);

  async function approve(item) {
    setBusyId(item.id);
    try {
      await approveContent(item.id);
      notify("Content approved.");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusyId("");
    }
  }

  async function reject() {
    setBusyId(rejecting.id);
    try {
      await rejectContent(rejecting.id, reason);
      notify("Content rejected.");
      setRejecting(null);
      setReason("");
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusyId("");
    }
  }

  return (
    <AppLayout title="Pending Approval" subtitle="Inspect content previews and decide what is ready for broadcast.">
      <section className="section">
        {error ? <ErrorState message={error} /> : null}
        {loading ? <SkeletonList rows={8} /> : pending.length === 0 ? <EmptyState title="Approval queue is clear" /> : (
          <ContentTable
            rows={pending}
            page={page}
            onPageChange={setPage}
            onView={setSelected}
            actions={(item) => (
              <>
                <Button variant="success" disabled={busyId === item.id} onClick={() => approve(item)}>
                  {busyId === item.id ? <Loader2 className="spin" size={16} /> : <Check size={16} />}
                </Button>
                <Button variant="danger" onClick={() => setRejecting(item)}>
                  <X size={16} />
                </Button>
              </>
            )}
          />
        )}
      </section>
      {selected ? (
        <Modal title="Content preview" onClose={() => setSelected(null)}>
          <PreviewPanel item={selected} />
        </Modal>
      ) : null}
      {rejecting ? (
        <Modal
          title="Reject content"
          onClose={() => setRejecting(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setRejecting(null)}>Cancel</Button>
              <Button variant="danger" disabled={busyId === rejecting.id || !reason.trim()} onClick={reject}>
                {busyId === rejecting.id ? <Loader2 className="spin" size={16} /> : null}
                Reject
              </Button>
            </>
          }
        >
          <PreviewPanel item={rejecting} />
          <label className="field">
            <span>Mandatory rejection reason</span>
            <textarea value={reason} onChange={(event) => setReason(event.target.value)} rows={4} placeholder="Explain what the teacher should fix" />
          </label>
        </Modal>
      ) : null}
    </AppLayout>
  );
}
