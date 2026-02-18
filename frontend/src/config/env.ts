export const ENV = {
  API_URL:
    (import.meta.env.VITE_API_URL as string) || 'http://localhost:5005/api',
  IS_DEV: import.meta.env.DEV || false
};
