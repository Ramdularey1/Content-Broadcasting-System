import { Eye, RotateCw } from "lucide-react";
import { formatDateTime, getScheduleStatus } from "../utils/date";
import { Button, ScheduleBadge, StatusBadge } from "./UI";

export function ContentTable({ rows, onView, actions, page = 1, pageSize = 12, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const visibleRows = rows.slice(start, start + pageSize);

  return (
    <div className="table-shell">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Content</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Schedule</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="content-cell">
                    <img src={item.previewUrl} alt="" loading="lazy" />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.fileName}</span>
                    </div>
                  </div>
                </td>
                <td>{item.subject}</td>
                <td>
                  <StatusBadge status={item.status} />
                </td>
                <td>
                  <div className="schedule-cell">
                    <ScheduleBadge status={getScheduleStatus(item)} />
                    <span>{formatDateTime(item.startTime)}</span>
                  </div>
                </td>
                <td>{item.teacherName}</td>
                <td>
                  <div className="row-actions">
                    <Button variant="ghost" onClick={() => onView(item)} title="Preview content">
                      <Eye size={17} />
                    </Button>
                    {actions?.(item)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <span>
          Showing {rows.length === 0 ? 0 : start + 1}-{Math.min(start + pageSize, rows.length)} of {rows.length}
        </span>
        <div>
          <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            Previous
          </Button>
          <Button variant="secondary" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export function PreviewPanel({ item }) {
  if (!item) return null;
  return (
    <div className="preview-panel">
      <img src={item.previewUrl} alt={item.title} />
      <div className="preview-meta">
        <StatusBadge status={item.status} />
        <span>
          <RotateCw size={15} /> {item.rotationDuration} sec rotation
        </span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
      <dl>
        <div>
          <dt>Subject</dt>
          <dd>{item.subject}</dd>
        </div>
        <div>
          <dt>Starts</dt>
          <dd>{formatDateTime(item.startTime)}</dd>
        </div>
        <div>
          <dt>Ends</dt>
          <dd>{formatDateTime(item.endTime)}</dd>
        </div>
      </dl>
      {item.rejectionReason ? <p className="rejection-note">{item.rejectionReason}</p> : null}
    </div>
  );
}
