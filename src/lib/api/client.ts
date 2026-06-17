// Central API client — all backend calls go through here

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

function getToken(): string | null {
  return localStorage.getItem("hs:token");
}

function setToken(token: string) {
  localStorage.setItem("hs:token", token);
}

function clearToken() {
  localStorage.removeItem("hs:token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dob?: string;
  avatar?: string;
  role?: "user" | "admin";
};

type AuthResponse = { token: string; user: AuthUser };

export async function apiSignup(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  gender?: string;
  dob?: string;
}): Promise<AuthUser> {
  const res = await request<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
  setToken(res.token);
  return res.user;
}

export async function apiLogin(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setToken(res.token);
  return res.user;
}

export function apiLogout() {
  clearToken();
}

export async function apiGetMe(): Promise<AuthUser> {
  return request<AuthUser>("/auth/me");
}

export async function apiUpdateProfile(
  patch: Partial<AuthUser>
): Promise<AuthUser> {
  return request<AuthUser>("/auth/profile", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function apiChangePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ── Health Data ───────────────────────────────────────────────────────────────
export async function apiGetHealth<T>(): Promise<T> {
  return request<T>("/health");
}

export async function apiSaveHealth<T>(data: T): Promise<T> {
  return request<T>("/health", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function apiPatchHealth<T>(patch: Partial<T>): Promise<T> {
  return request<T>("/health", {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function apiResetHealth(): Promise<void> {
  await request("/health", { method: "DELETE" });
}

// ── Admin ─────────────────────────────────────────────────────────────────────
export async function apiAdminGetUsers(): Promise<AuthUser[]> {
  return request<AuthUser[]>("/admin/users");
}

export async function apiAdminGetStats(): Promise<{
  totalUsers: number;
  adminUsers: number;
  recentUsers: AuthUser[];
}> {
  return request("/admin/stats");
}

export async function apiAdminDeleteUser(id: string): Promise<void> {
  await request(`/admin/users/${id}`, { method: "DELETE" });
}
