export const ROLE_ROUTES = {
    ADMIN: "/admin/dashboard",
    MENTOR: "/mentor/dashboard",
    MENTEE: "/dashboard",
} as const;

export const AUTH_ROUTES = ["/login", "/register", "/forget-password", "/reset-password"] as const;

export type UserRole = keyof typeof ROLE_ROUTES;
