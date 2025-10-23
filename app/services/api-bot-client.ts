// app/services/api-bot-client.ts

// In Remix, process.env is not available in browser context
// We need to use a fallback value
const API_URL = "http://127.0.0.1:8000";

/**
 * 簡單的 API 錯誤
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * 基礎請求函式
 */
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message || `請求失敗: ${response.status}`,
      response.status,
    );
  }

  // 處理 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

/**
 * API Client
 */
export const api = {
  // GET
  get: <T>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // POST
  post: <T>(endpoint: string, data: any, token?: string) =>
    request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // PUT
  put: <T>(endpoint: string, data: any, token?: string) =>
    request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // PATCH
  patch: <T>(endpoint: string, data: any, token?: string) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),

  // DELETE
  delete: <T = void>(endpoint: string, token?: string) =>
    request<T>(endpoint, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }),
};
