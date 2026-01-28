const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = typeof window !== "undefined" ? localStorage.getItem("spmb_token") : null;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        let message = "API Request Failed";

        if (typeof error.detail === "string") {
            message = error.detail;
        } else if (Array.isArray(error.detail)) {
            message = error.detail.map((d: any) => d.msg || JSON.stringify(d)).join(", ");
        } else if (error.detail) {
            message = JSON.stringify(error.detail);
        } else if (response.statusText) {
            message = response.statusText;
        }

        throw new Error(message);
    }

    return response.json();
}

const getBody = (body: any) => {
    if (body instanceof URLSearchParams || body instanceof FormData || typeof body === "string") {
        return body;
    }
    return JSON.stringify(body);
};

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "GET" }),
    post: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "POST", body: getBody(body) }),
    put: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "PUT", body: getBody(body) }),
    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
