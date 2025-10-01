// src/utils/apiConfig.ts
export function getApiUrl() {
  // @ts-ignore
  return window.RUNTIME_CONFIG?.API_URL || 'http://localhost:3001/api';
}
