const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

let wakePromise = null;

/** Fire-and-forget ping so a sleeping Render instance starts booting before the user waits. */
export const wakeBackend = () => {
  if (wakePromise) return wakePromise;

  wakePromise = fetch(`${API_BASE}/health`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    credentials: 'omit',
  }).catch(() => {
    /* cold start / network — auth retries handle the real work */
  });

  return wakePromise;
};
