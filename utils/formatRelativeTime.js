const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// "Just now", "3 min ago", "2 hr ago", "Yesterday", "3 days ago", "12 Sep".
export function formatRelativeTime(timestamp, now = Date.now()) {
  const elapsed = Math.max(0, now - timestamp);
  if (elapsed < MINUTE) return 'Just now';
  if (elapsed < HOUR) return `${Math.floor(elapsed / MINUTE)} min ago`;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  if (timestamp >= startOfToday.getTime()) return `${Math.floor(elapsed / HOUR)} hr ago`;

  const daysAgo = Math.ceil((startOfToday.getTime() - timestamp) / DAY);
  if (daysAgo === 1) return 'Yesterday';
  if (daysAgo < 7) return `${daysAgo} days ago`;

  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
