const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("advTask_token")
    const guestSession = localStorage.getItem("guest_session_id")

    const headers = new Headers(options.headers)

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (guestSession) {
        headers.set("x-guest-session", guestSession);
    }

    if (options.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

}