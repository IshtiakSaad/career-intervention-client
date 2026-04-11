import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Get token using request.cookies (safest in Edge Middleware)
    const accessToken = request.cookies.get("accessToken")?.value || null;

    let userRole: UserRole | null = null;

    // 1. Edge-Safe JWT Decoding
    if (accessToken) {
        try {
            // Using jwtDecode skips signature verification (Edge compatible).
            // Signature verification is performed by your backend API on every data request.
            const decoded: any = jwtDecode(accessToken);
            
            // Your backend sends roles as an array: e.g., ["MENTEE"]
            const roles = decoded.roles || [];
            if (roles.length > 0) {
                userRole = roles[0] as UserRole;
            } else {
                throw new Error("No roles found in token");
            }
            
        } catch (error) {
            // If token is malformed or mangled, clear cookies and redirect
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete("accessToken");
            response.cookies.delete("refreshToken");
            return response;
        }
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Rule 2: Logged-in user tries to access an auth route (e.g. /login) -> Kick to their dashboard
    if (accessToken && isAuth) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    // Rule 3: Public route access (no interference)
    if (routeOwner === null && !isAuth) {
        return NextResponse.next();
    }

    // Rule 4: Unauthenticated user accesses ANY protected route -> Send to login
    if (!accessToken && routeOwner !== null) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rule 5: User accesses a COMMON protected route
    if (routeOwner === "COMMON") {
        return NextResponse.next();
    }

    // Rule 6: User accesses a strict role-based route (e.g., /dashboard/admin)
    if (routeOwner === "ADMIN" || routeOwner === "MENTOR" || routeOwner === "MENTEE") {
        if (userRole !== routeOwner) {
            // Role mismatch -> Security Bounce to their rightful dashboard
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)'],
}
