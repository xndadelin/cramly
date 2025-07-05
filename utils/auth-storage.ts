const AUTH_STORAGE_KEY = 'cramly-auth-storage';
const isClient = typeof window !== 'undefined';

export const getAuthStorage = () => {
  if (!isClient) return null;
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error reading auth from storage:', error);
    return null;
  }
};

export const setAuthStorage = (data: any) => {
  if (!isClient) return;
  
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving auth to storage:', error);
  }
};

export const clearAuthStorage = () => {
  if (!isClient) return;
  
  try {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing auth storage:', error);
  }
};
