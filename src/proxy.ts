import { jwtDecode } from 'jwt-decode';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';
import { JWTPayloadSchema } from './services/auth/auth.types';

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Get token using request.cookies (safest in Edge Middleware)
    const accessToken = request.cookies.get("accessToken")?.value || null;

    let userRole: UserRole | null = null;

    // 1. Edge-Safe JWT Decoding & Basic Verification
    if (accessToken) {
        try {
            const rawDecoded = jwtDecode(accessToken);
            
            // Validate schema
            const validated = JWTPayloadSchema.safeParse(rawDecoded);
            if (!validated.success) {
                throw new Error("Invalid token payload structure");
            }

            const decoded = validated.data;
            
            // Check expiry (essential security)
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp && decoded.exp < currentTime) {
                throw new Error("Token expired");
            }

            userRole = (decoded.roles[0] as UserRole) || null;
            
        } catch (error) {
            console.warn("[MIDDLEWARE_AUTH_ERROR]:", error);
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

    // Rule 3: Public route access
    if (routeOwner === null && !isAuth) {
        return NextResponse.next();
    }

    // Rule 4: Unauthenticated user accesses ANY protected route
    if (!accessToken && routeOwner !== null) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rule 5: User accesses a COMMON protected route
    if (routeOwner === "COMMON") {
        return NextResponse.next();
    }

    // Rule 6: User accesses a strict role-based route
    if (routeOwner === "ADMIN" || routeOwner === "MENTOR" || routeOwner === "MENTEE") {
        if (userRole !== routeOwner) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)'],
}
