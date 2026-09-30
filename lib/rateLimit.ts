type WindowEntry = { count: number; expiresAt: number };

const windows = new Map<string, WindowEntry>();

/** Small per-process limiter; serverless instances keep separate windows. */
export function takeRateLimit(
  key: string,
  limit = 8,
  windowMs = 60_000,
  now = Date.now(),
): boolean {
  const current = windows.get(key);
  if (!current || current.expiresAt <= now) {
    windows.set(key, { count: 1, expiresAt: now + windowMs });
    if (windows.size > 1000) {
      for (const [entryKey, entry] of windows) {
        if (entry.expiresAt <= now) windows.delete(entryKey);
      }
    }
    return true;
  }
  if (current.count >= limit) return false;
  current.count += 1;
  return true;
}
