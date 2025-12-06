// Centralized API client with env-driven base URL and auth header injection
// Only non-obvious rationale: ensures all requests consistently target the configured backend

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface ApiClientOptions {
  baseUrl?: string;
  getToken?: () => string | null;
}

export interface ApiRequestOptions {
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  signal?: AbortSignal;
}

export interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

const DEFAULT_BASE = (import.meta as { env?: { VITE_API_URL?: string } })?.env?.VITE_API_URL || 'https://mmeraki-backend1-kappa.vercel.app';

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getToken: () => string | null;

  constructor(options?: ApiClientOptions) {
    this.baseUrl = (options?.baseUrl || DEFAULT_BASE).replace(/\/$/, '');
    this.getToken = options?.getToken || (() => (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null));
  }

  private buildUrl(path: string, query?: ApiRequestOptions['query']): string {
    // Ensure path starts with /api/ if it doesn't already
    const cleanPath = path.startsWith('/api/') ? path : 
                     path.startsWith('/') ? `/api${path}` : 
                     `/api/${path}`;
    const url = new URL(this.baseUrl + cleanPath);
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
      });
    }
    return url.toString();
  }

  private buildHeaders(userHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...userHeaders,
    };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  async request<T = unknown>(path: string, options?: ApiRequestOptions): Promise<T> {
    const url = this.buildUrl(path, options?.query);
    const res = await fetch(url, {
      method: options?.method || 'GET',
      headers: this.buildHeaders(options?.headers),
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: options?.signal,
      credentials: 'include' as RequestCredentials,
    });

    let data: unknown = null;
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      try { data = await res.json(); } catch (_) { /* ignore */ }
    } else {
      try { data = await res.text(); } catch (_) { /* ignore */ }
    }

    if (!res.ok) {
      let message = `HTTP ${res.status}`;
      if (data && typeof data === 'object' && data !== null) {
        const msg = (data as { message?: string; error?: string }).message || (data as { message?: string; error?: string }).error;
        if (typeof msg === 'string' && msg.trim()) {
          message = msg;
        }
      }
      const err: ApiError = new Error(message);
      err.status = res.status;
      err.details = data;
      throw err;
    }


    return data as T;
  }

  get<T = unknown>(path: string, query?: ApiRequestOptions['query'], headers?: Record<string, string>) {
    return this.request<T>(path, { method: 'GET', query, headers });
  }
  post<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(path, { method: 'POST', body, headers });
  }
  put<T = unknown>(path: string, body?: unknown, headers?: Record<string, string>) {
    return this.request<T>(path, { method: 'PUT', body, headers });
  }
  delete<T = unknown>(path: string, headers?: Record<string, string>) {
    return this.request<T>(path, { method: 'DELETE', headers });
  }
}

export const api = new ApiClient();


