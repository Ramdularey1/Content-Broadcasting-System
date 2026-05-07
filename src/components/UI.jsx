import { AlertCircle, Loader2, Search, ShieldAlert } from "lucide-react";

export function Button({ children, variant = "primary", className = "", ...props }) {
  return (
    <button className={`btn btn-${variant} ${className}`} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, error, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {error ? <small className="field-error">{error}</small> : null}
    </label>
  );
}

export function StatCard({ icon: Icon, label, value, tone = "blue" }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <Icon size={22} />
    </article>
  );
}

export function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{status}</span>;
}

export function ScheduleBadge({ status }) {
  return <span className={`schedule-pill schedule-${status}`}>{status}</span>;
}

export function EmptyState({ title = "No content available", text = "Try changing filters or adding content.", icon: Icon = ShieldAlert }) {
  return (
    <div className="empty-state">
      <Icon size={34} />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export function ErrorState({ message }) {
  return (
    <div className="error-state">
      <AlertCircle size={18} />
      <span>{message}</span>
    </div>
  );
}

export function SkeletonList({ rows = 5 }) {
  return (
    <div className="skeleton-list">
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-row" key={index}>
          <span />
          <span />
          <span />
        </div>
      ))}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder = "Search content" }) {
  return (
    <div className="search-input">
      <Search size={17} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

export function LoadingOverlay({ show, label = "Working" }) {
  if (!show) return null;
  return (
    <div className="loading-overlay">
      <Loader2 className="spin" size={24} />
      <span>{label}</span>
    </div>
  );
}
