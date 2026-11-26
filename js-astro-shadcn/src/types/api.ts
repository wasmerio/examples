import type { AsyncState, ID } from './common';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type HttpStatus = 200 | 201 | 204 | 400 | 401 | 403 | 404 | 500 | 502 | 503;

export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
  status: HttpStatus;
}

export interface ApiError {
  message: string;
  code?: string;
  status: HttpStatus;
  details?: Record<string, unknown>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
  retryCount?: number;
}

export interface ApiState<T = unknown> extends AsyncState<T> {
  lastFetch?: Date;
  isValidating?: boolean;
}

export interface SearchParams {
  query: string;
  filters?: Record<string, unknown>;
  pagination?: PaginationParams;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResponse {
  id: ID;
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface ApiEndpoints {
  readonly base: string;
  readonly timeout: number;
  readonly retryAttempts: number;
}

export type ApiHook<T, P = void> = (params?: P) => ApiState<T> & {
  mutate: (data?: T) => void;
  revalidate: () => Promise<void>;
};
