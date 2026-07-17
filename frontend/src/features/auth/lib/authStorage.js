const AUTH_STORAGE_KEY = 'thilani_watch_auth'
const emptyAuth = { token: '', user: null }

export const loadStoredAuth = () => {
  try {
    const storedValue = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedValue) return emptyAuth;

    try {
      const parsedValue = JSON.parse(storedValue);

      if (typeof parsedValue === 'string') {
        return { token: parsedValue, user: null };
      }

      if (typeof parsedValue?.token === 'string') {
        return { token: parsedValue.token, user: null };
      }
    } catch {
      return { token: storedValue, user: null };
    }

    return emptyAuth;
  } catch {
    return emptyAuth;
  }
};

export const saveStoredAuth = ({ token }) => {
  if (token) {
    localStorage.setItem(AUTH_STORAGE_KEY, token);
    return;
  }

  clearStoredAuth();
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
