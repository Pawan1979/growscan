export const getApiUrl = (path: string): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const env = (import.meta as any).env;
  if (env && env.VITE_API_URL) {
    return `${env.VITE_API_URL}${cleanPath}`;
  }
  if (typeof window !== 'undefined' && window.location.hostname.includes('.run.app')) {
    const backendHost = 'https://grocscan-backend-test-' + window.location.hostname.replace('grocscan-frontend-test-', '');
    return `${backendHost}${cleanPath}`;
  }
  return cleanPath;
};
