export function formatDateTime(value) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getScheduleStatus(item, now = new Date()) {
  const start = new Date(item.startTime);
  const end = new Date(item.endTime);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "scheduled";
  if (now < start) return "scheduled";
  if (now > end) return "expired";
  return "active";
}

export function toLocalInputValue(date) {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() - next.getTimezoneOffset());
  return next.toISOString().slice(0, 16);
}
