export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  payload: T;
};

type RequestOptions = RequestInit & {
  token?: string;
};

function getStoredToken(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const rawToken = localStorage.getItem("token");
  if (!rawToken) {
    return undefined;
  }

  const normalizedToken = rawToken.replace(/^"|"$/g, "").trim();
  return normalizedToken || undefined;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...restOptions } = options;
  const resolvedToken = (token ?? getStoredToken())?.replace(/^"|"$/g, "").trim();

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...(resolvedToken ? { Authorization: `Bearer ${resolvedToken}` } : {}),
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