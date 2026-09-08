const KEY = 'opticloud-session';

export const hasSessionHint = () => {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
};

export const setSessionHint = () => {
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* private mode / quota */
  }
};

export const clearSessionHint = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};
