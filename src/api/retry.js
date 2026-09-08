const RETRYABLE_STATUS = new Set([408, 429, 502, 503, 504]);
const BACKOFF_MS = [2000, 4000, 6000];

export const isCanceled = (error) => (
  error?.code === 'ERR_CANCELED'
  || error?.name === 'CanceledError'
  || error?.name === 'AbortError'
);

export const isRetryableError = (error) => {
  if (isCanceled(error)) return false;
  if (!error.response) return true;
  return RETRYABLE_STATUS.has(error.response.status);
};

export const wait = (ms, signal) => new Promise((resolve, reject) => {
  if (signal?.aborted) {
    const error = new Error('canceled');
    error.name = 'AbortError';
    error.code = 'ERR_CANCELED';
    reject(error);
    return;
  }

  const onAbort = () => {
    clearTimeout(timer);
    const error = new Error('canceled');
    error.name = 'AbortError';
    error.code = 'ERR_CANCELED';
    reject(error);
  };

  const timer = setTimeout(() => {
    signal?.removeEventListener('abort', onAbort);
    resolve();
  }, ms);

  signal?.addEventListener('abort', onAbort, { once: true });
});

export const withRetry = async (fn, { signal, retryable = isRetryableError } = {}) => {
  let lastError;
  for (let attempt = 0; attempt <= BACKOFF_MS.length; attempt += 1) {
    if (signal?.aborted) {
      const error = new Error('canceled');
      error.name = 'AbortError';
      error.code = 'ERR_CANCELED';
      throw error;
    }
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!retryable(error) || attempt === BACKOFF_MS.length) throw error;
      await wait(BACKOFF_MS[attempt], signal);
    }
  }
  throw lastError;
};
