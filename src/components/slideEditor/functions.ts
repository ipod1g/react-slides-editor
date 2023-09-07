export function escapeDoubleQuotes(str: string | string[]) {
  if (Array.isArray(str)) {
    return str.map((s) => s.replace(/"/g, '\\"'));
  }
  return str.replace(/"/g, '\\"');
}

export function stripEscapeDoubleQuotes(str: string | string[]) {
  if (Array.isArray(str)) {
    return str.map((s) => s.replace(/\\"/g, '"'));
  }
  return str.replace(/\\"/g, '"');
}

export function getLastUpdatedTimeDifference(
  lastUpdatedTime: Date | null | undefined
) {
  if (!lastUpdatedTime) return 'never updated';
  const now = new Date();

  const diff = Math.abs(now.getTime() - lastUpdatedTime.getTime());
  if (diff < 30000) {
    return 'just now';
  } else if (diff < 60000) {
    return `${Math.floor(diff / 1000)} seconds ago`;
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)} minutes ago`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)} hours ago`;
  }
  return `${Math.floor(diff / 86400000)} days ago`;
}
