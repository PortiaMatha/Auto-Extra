/* ─────────────────────────────────────────────────────────────────
   API Client
   Base URL is read from REACT_APP_API_URL in your .env file.
   If the variable is not set the app runs on local mock data.
   ───────────────────────────────────────────────────────────────── */

export const API_BASE = process.env.REACT_APP_API_URL ?? '';

export const isApiConfigured = (): boolean => Boolean(API_BASE);

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = localStorage.getItem('ae_auth_token');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

export const api = {
  get:    <T>(path: string)                       => request<T>('GET',    path),
  post:   <T>(path: string, body: unknown)        => request<T>('POST',   path, body),
  put:    <T>(path: string, body: unknown)        => request<T>('PUT',    path, body),
  patch:  <T>(path: string, body?: unknown)       => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                       => request<T>('DELETE', path),
};
