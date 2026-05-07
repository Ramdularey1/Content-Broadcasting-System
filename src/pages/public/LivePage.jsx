import { RefreshCw, Radio } from "lucide-react";
import { useEffect, useState } from "react";
import { contentService } from "../../services/content.service";
import { formatDateTime } from "../../utils/date";
import { Button, EmptyState, ErrorState, SkeletonList } from "../../components/UI";

export function LivePage({ teacherId }) {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);
  async function load() {
    setLoading(true);
    setError("");
    try {
      const active = await contentService.getLiveContent(teacherId);
      setItem(active);
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || "Unable to load live content.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [teacherId]);

  return (
    <main className="live-page">
      <header className="live-header">
        <div className="brand live-brand">
          <Radio size={24} />
          <div>
            <strong>Live Broadcast</strong>
            <span>{teacherId}</span>
          </div>
        </div>
        <div className="live-tools">
          {updatedAt ? <span>Updated {formatDateTime(updatedAt)}</span> : null}
          <Button variant="secondary" onClick={load}>
            <RefreshCw size={17} />
            Refresh
          </Button>
        </div>
      </header>
      {error ? <ErrorState message={error} /> : null}
      {loading ? <SkeletonList rows={5} /> : null}
      {!loading && !item ? <EmptyState title="No content available" text="Approved active content will appear here automatically." icon={Radio} /> : null}
      {!loading && item ? (
        <section className="live-stage">
          <img src={item.previewUrl} alt={item.title} />
          <div className="live-caption">
            <span>{item.subject}</span>
            <h1>{item.title}</h1>
            <p>{item.description}</p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
