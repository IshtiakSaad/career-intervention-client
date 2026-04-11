export type UserRole = "ADMIN" | "MENTOR" | "MENTEE";

export type RouteConfig = {
    exact: string[],
    patterns: RegExp[],
}

export const authRoutes = ["/login", "/register", "/forget-password", "/reset-password"];

// Routes accessible by any logged-in user
export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings"],
    patterns: [], 
}

// Routes accessible strictly by MENTORs
export const mentorProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard\/mentor/],
    exact: [], 
}

// Routes accessible strictly by ADMINs
export const adminProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard\/admin/], 
    exact: [], 
}

// Routes accessible strictly by MENTEEs
export const menteeProtectedRoutes: RouteConfig = {
    patterns: [/^\/dashboard\/mentee/, /^\/dashboard$/], // Assuming /dashboard is the base mentee layout
    exact: [], 
}

export const isAuthRoute = (pathname: string) => {
    return authRoutes.some((route: string) => route === pathname);
}

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean => {
    if (routes.exact.includes(pathname)) {
        return true;
    }
    return routes.patterns.some((pattern: RegExp) => pattern.test(pathname))
}

export const getRouteOwner = (pathname: string): UserRole | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) return "ADMIN";
    if (isRouteMatches(pathname, mentorProtectedRoutes)) return "MENTOR";
    if (isRouteMatches(pathname, menteeProtectedRoutes)) return "MENTEE";
    if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";
    
    return null;
}

export const getDefaultDashboardRoute = (role: UserRole): string => {
    if (role === "ADMIN") return "/dashboard/admin";
    if (role === "MENTOR") return "/dashboard/mentor";
    if (role === "MENTEE") return "/dashboard/mentee";
    return "/";
}

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);

    if (routeOwner === null || routeOwner === "COMMON") {
        return true;
    }

    if (routeOwner === role) {
        return true;
    }

    return false;
}
