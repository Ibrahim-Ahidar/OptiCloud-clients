const KEY = 'opticloud_token';

export const getToken = () => sessionStorage.getItem(KEY);

export const setToken = (token) => {
  if (token) sessionStorage.setItem(KEY, token);
};

export const clearToken = () => sessionStorage.removeItem(KEY);
