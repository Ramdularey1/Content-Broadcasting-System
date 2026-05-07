import { CheckCircle2, Clock3, FileStack, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useContent } from "../../context/ContentContext";
import { AppLayout } from "../../layouts/AppLayout";
import { EmptyState, ErrorState, SkeletonList, StatCard } from "../../components/UI";

export function PrincipalDashboard() {
  const { counts, content, loading, error, refreshContent } = useContent();

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  return (
    <AppLayout title="Principal Dashboard" subtitle="Review school-wide content health and approval workload.">
      <section className="stats-grid">
        <StatCard icon={FileStack} label="All content" value={counts.total} />
        <StatCard icon={Clock3} label="Pending" value={counts.pending} tone="amber" />
        <StatCard icon={CheckCircle2} label="Approved" value={counts.approved} tone="green" />
        <StatCard icon={XCircle} label="Rejected" value={counts.rejected} tone="red" />
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>Approval queue</h2>
          <p>Newest pending submissions across teachers.</p>
        </div>
        {error ? <ErrorState message={error} /> : null}
        {loading ? <SkeletonList /> : null}
        {!loading && content.filter((item) => item.status === "pending").length === 0 ? <EmptyState title="No pending content" /> : null}
        {!loading ? (
          <div className="approval-strip">
            {content
              .filter((item) => item.status === "pending")
              .slice(0, 5)
              .map((item) => (
                <article key={item.id}>
                  <img src={item.previewUrl} alt="" />
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.teacherName} · {item.subject}</span>
                  </div>
                </article>
              ))}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
