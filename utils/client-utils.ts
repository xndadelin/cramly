export const isClient = typeof window !== 'undefined';

export function safeClientSide<T>(fn: () => T, fallback: T): T {
  if (isClient) {
    return fn();
  }
  return fallback;
}

export function getLocalStorage(key: string, fallback: string = ''): string {
  return safeClientSide(() => localStorage.getItem(key) || fallback, fallback);
}

export function setLocalStorage(key: string, value: string): void {
  if (isClient) {
    localStorage.setItem(key, value);
  }
}
