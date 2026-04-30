export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  payload: T;
};

type RequestOptions = RequestInit & {
  token?: string;
};

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...restOptions } = options;

  const response = await fetch(`/api/users`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || "Server error occurred";
    throw new Error(message);
  }

  return data as T;
}