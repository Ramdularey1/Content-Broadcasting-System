import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useContent } from "../../context/ContentContext";
import { AppLayout } from "../../layouts/AppLayout";
import { EmptyState, ErrorState, SkeletonList, StatCard } from "../../components/UI";
import { StatusBadge } from "../../components/UI";

export function TeacherDashboard() {
  const { user } = useAuth();
  const { content, counts, loading, error, refreshContent } = useContent();

  useEffect(() => {
    refreshContent({ teacherId: user.id });
  }, [refreshContent, user.id]);

  return (
    <AppLayout title="Teacher Dashboard" subtitle="Track uploads, approvals, and scheduled classroom broadcasts.">
      <section className="stats-grid">
        <StatCard icon={FileText} label="Total uploaded" value={counts.total} />
        <StatCard icon={Clock3} label="Pending" value={counts.pending} tone="amber" />
        <StatCard icon={CheckCircle2} label="Approved" value={counts.approved} tone="green" />
        <StatCard icon={XCircle} label="Rejected" value={counts.rejected} tone="red" />
      </section>
      <section className="section">
        <div className="section-heading">
          <h2>Recent content</h2>
          <p>Your newest uploads and review outcomes.</p>
        </div>
        {error ? <ErrorState message={error} /> : null}
        {loading ? <SkeletonList /> : content.length === 0 ? <EmptyState /> : null}
        {!loading && content.length > 0 ? (
          <div className="compact-list">
            {content.slice(0, 6).map((item) => (
              <article key={item.id}>
                <img src={item.previewUrl} alt="" />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.subject}</span>
                </div>
                <StatusBadge status={item.status} />
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AppLayout>
  );
}
